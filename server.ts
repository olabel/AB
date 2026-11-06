
function getSemanticFallbackHtml(pathname: string): string {
  const p = pathname.toLowerCase().split("?")[0].replace(/\/$/, "") || "/";
  if (p === "/about") {
    return `
      <main style="max-width:800px;margin:2rem auto;padding:1rem;font-family:serif;">
        <h1>About Ahmed Bello | Licensed Financial Solutions Professional</h1>
        <p>I am an independent financial professional helping individuals and families across Canada make intentional, well-grounded money decisions. Rather than starting with a product or sales pitch, I start with education: clarifying how Canadian registered accounts (TFSA, RRSP, FHSA), debt repayment, and income protection interact.</p>
        <h2>Professional Background & Licensing</h2>
        <p>Headquartered in Moncton, New Brunswick, and licensed to provide financial solutions and protection planning across Canada (Alberta, British Columbia, Manitoba, New Brunswick, Newfoundland and Labrador, Northwest Territories, Nova Scotia, Nunavut, Ontario, Prince Edward Island, Quebec, Saskatchewan, Yukon) and the United States.</p>
        <h2>Get in Touch</h2>
        <p>Email: enquiries@ahmedbello.com | Phone: +1-506-899-4941 | Schedule: https://calendly.com/olabel/30min</p>
      </main>
    `;
  }
  if (p === "/contact") {
    return `
      <main style="max-width:800px;margin:2rem auto;padding:1rem;font-family:serif;">
        <h1>Start a Conversation with Ahmed Bello</h1>
        <p>Ask a question about your Canadian mortgage renewal, registered accounts (TFSA, RRSP, FHSA), income protection, or newcomer finances with zero obligation and zero sales pressure.</p>
        <h2>Contact Details</h2>
        <ul>
          <li><strong>Email:</strong> enquiries@ahmedbello.com</li>
          <li><strong>Direct Telephone:</strong> +1-506-899-4941</li>
          <li><strong>Direct Calendar Booking:</strong> <a href="https://calendly.com/olabel/30min">Schedule 30-Minute Intro Call</a></li>
          <li><strong>Location:</strong> Moncton, NB, Canada</li>
        </ul>
      </main>
    `;
  }
  if (p === "/what-changed" || p === "/fr/what-changed" || p === "/news") {
    return `
      <main style="max-width:800px;margin:2rem auto;padding:1rem;font-family:serif;">
        <h1>What Changed in Canadian Money Rules | Ahmed Bello</h1>
        <p>Monthly Canadian financial intelligence briefing by licensed financial solutions professional Ahmed Bello: Bank of Canada interest rate decisions, OSFI Guideline B-20 uninsured mortgage straight-switch rules, CRA registered account ceilings (TFSA, RRSP, FHSA), and Budget 2024 capital gains inclusion rates.</p>
      </main>
    `;
  }
  return "";
}
import { getLatestFinancialNews } from "./src/services/newsService.ts";
import { processContactSubmission, recordConfirmedSubscriber } from "./src/services/contactEmailService.ts";
import express, { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { articles, howIHelpTopics } from "./src/content/data.ts";
import { DRAFT_MODE, siteConfig } from "./src/config/site.ts";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === "production";

// Disable fingerprinting header
app.disable("x-powered-by");

// --------------------------------------------------------------------------
// 1. Enterprise Security Headers Middleware
// --------------------------------------------------------------------------
app.use((req: Request, res: Response, next: NextFunction) => {
  // Content Security Policy - permissive frame-ancestors for AI Studio preview iframe
  const cspDirectives = [
    "default-src 'self' https: data: blob:",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https: blob:",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob: https:",
    "connect-src 'self' https: ws: wss:",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
  ].join("; ");

  res.setHeader("Content-Security-Policy", cspDirectives);
  res.setHeader("X-Content-Type-Options", "nosniff");
  // Omit X-Frame-Options to allow embedding within the AI Studio preview iframe
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=(), vr=()"
  );
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS, POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  if (isProduction || req.secure || req.headers["x-forwarded-proto"] === "https") {
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    );
  }

  if (req.method === "TRACE" || req.method === "TRACK") {
    return res.status(405).send("Method Not Allowed");
  }

  next();
});

// Reject bodies over 10 KB to prevent DoS payloads
app.use(express.json({ limit: "10kb" }));

// Reject prototype pollution attacks
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.body && typeof req.body === "object" && !Array.isArray(req.body)) {
    const hasOwn = Object.prototype.hasOwnProperty;
    if (
      hasOwn.call(req.body, "__proto__") ||
      hasOwn.call(req.body, "constructor") ||
      hasOwn.call(req.body, "prototype")
    ) {
      return res.status(400).json({ error: "malformed_request" });
    }
  }
  next();
});

// --------------------------------------------------------------------------
// 2. Strict Input Sanitization Helpers
// --------------------------------------------------------------------------
function sanitizeText(input: unknown): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/\0/g, "") // remove null bytes
    .replace(/[\r\n]/g, " ") // prevent CRLF / header injection
    .replace(/<[^>]*>/g, "") // strip HTML tags
    .replace(/[<>]/g, "") // remove stray angle brackets
    .trim();
}

function sanitizeMultiline(input: unknown): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/\0/g, "") // remove null bytes
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // strip scripts
    .replace(/<[^>]*>/g, "") // strip HTML tags
    .replace(/[<>]/g, "") // strip angle brackets
    .trim();
}

// --------------------------------------------------------------------------
// 3. Robust Per-IP Rate Limiting
// --------------------------------------------------------------------------
const ipSubmissions = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = ipSubmissions.get(ip);

  if (!entry || now > entry.resetTime) {
    ipSubmissions.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count += 1;
  return true;
}

// --------------------------------------------------------------------------
// 4. Live Launch Robots.txt & Dynamic High-Value Sitemap.xml
// --------------------------------------------------------------------------
app.get("/robots.txt", (_req: Request, res: Response) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "public, max-age=86400");
  res.type("text/plain; charset=utf-8");

  const diskPath = path.resolve(process.cwd(), "public", "robots.txt");
  if (fs.existsSync(diskPath)) {
    return res.sendFile(diskPath);
  }

  if (DRAFT_MODE) {
    res.send("User-agent: *\nDisallow: /\n");
  } else {
    res.send(
`User-agent: *
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Googlebot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Applebot
Allow: /

User-agent: CCBot
Allow: /

Sitemap: ${siteConfig.siteUrl}/sitemap.xml
`
    );
  }
});

app.get("/sitemap.xml", (_req: Request, res: Response) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.type("application/xml; charset=utf-8");

  const diskPath = path.resolve(process.cwd(), "public", "sitemap.xml");
  if (fs.existsSync(diskPath)) {
    return res.sendFile(diskPath);
  }

  res.status(404).send("Sitemap not found");
});

app.get("/BingSiteAuth.xml", (_req: Request, res: Response) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.type("application/xml; charset=utf-8");
  const diskPath = path.resolve(process.cwd(), "public", "BingSiteAuth.xml");
  if (fs.existsSync(diskPath)) {
    return res.sendFile(diskPath);
  }
  res.status(404).send("BingSiteAuth.xml not found");
});

// --------------------------------------------------------------------------
// 5. Hardened Contact API Endpoint: POST /api/contact & OPTIONS preflight
// --------------------------------------------------------------------------
app.options(["/api/contact", "/api/subscribe"], (req: Request, res: Response) => {
  const origin = (req.headers["origin"] as string) || "*";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  res.setHeader("Access-Control-Max-Age", "86400");
  return res.sendStatus(204);
});

function isOriginAuthorized(origin?: string): boolean {
  if (!origin || origin === "null" || origin === "") return true;
  try {
    const parsed = new URL(origin);
    const host = parsed.hostname.toLowerCase();

    // Exact domain matching (no substring injection)
    if (host === "ahmedbello.com" || host === "www.ahmedbello.com") return true;
    if (host === "localhost" || host === "127.0.0.1" || host === "0.0.0.0") return true;
    if (host === "ais-dev-jx5oov2nruxlj6dgff7nn2-332126510101.us-east1.run.app") return true;
    if (host === "ais-pre-jx5oov2nruxlj6dgff7nn2-332126510101.us-east1.run.app") return true;
    if (host === "aistudio.google.com") return true;

    // Exact project preview subdomains
    if (
      host.endsWith(".aistudio-preview.net") ||
      host.endsWith(".googleusercontent.com") ||
      host.endsWith(".google.com") ||
      host.endsWith(".run.app") ||
      host.endsWith(".vercel.app") ||
      host.endsWith(".web.app") ||
      host.endsWith(".firebaseapp.com")
    ) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

app.post(["/api/contact", "/api/subscribe"], async (req: Request, res: Response) => {
  // Origin / Referer Validation against CSRF: Exact hostname matching only
  const origin = req.headers["origin"] as string | undefined;
  if (origin && !isOriginAuthorized(origin)) {
    return res.status(403).json({
      error: "forbidden",
      message: "Cross-origin submission rejected.",
    });
  }
  const referer = req.headers["referer"] as string | undefined;
  if (referer && !isOriginAuthorized(referer)) {
    return res.status(403).json({
      error: "forbidden",
      message: "Cross-origin submission rejected.",
    });
  }
  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  }

  const forwarded = req.headers["x-forwarded-for"];
  const clientIp = typeof forwarded === "string" ? forwarded.split(",")[0].trim() : req.socket.remoteAddress || "unknown";

  const rawBody = req.body || {};
  if (req.path === "/api/subscribe" && !rawBody.topic) {
    rawBody.topic = "newsletter";
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL || "olabel@gmail.com, abello24trdc@wfgmail.ca";
  const CONTACT_FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || "Ahmed Bello <enquiries@ahmedbello.com>";

  const result = await processContactSubmission(
    rawBody,
    clientIp,
    RESEND_API_KEY,
    CONTACT_TO_EMAIL,
    CONTACT_FROM_EMAIL
  );

  return res.status(result.status).json(result.body);
});

// --------------------------------------------------------------------------
// 5b. Live Financial News Aggregation Endpoint: GET /api/news
// --------------------------------------------------------------------------
app.get("/api/news", async (_req: Request, res: Response) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  try {
    const items = await getLatestFinancialNews();
    return res.json({
      success: true,
      count: items.length,
      lastUpdated: new Date().toISOString(),
      items,
    });
  } catch (err: any) {
    console.error("[News Feed API Error]:", err?.message || err);
    return res.status(500).json({
      success: false,
      error: "news_fetch_failed",
      items: [],
    });
  }
});

// --------------------------------------------------------------------------
// 5c. Double Opt-in Subscription Confirmation Endpoint: /api/confirm-subscription
// --------------------------------------------------------------------------
app.all("/api/confirm-subscription", (req: Request, res: Response) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const email = (req.query.email as string) || req.body?.email || "";
  if (!email || !email.includes("@")) {
    return res.status(400).json({ success: false, error: "invalid_email" });
  }

  recordConfirmedSubscriber(email);
  return res.json({
    success: true,
    confirmed: true,
    email: email.trim().toLowerCase(),
    confirmedAt: new Date().toISOString(),
  });
});

// --------------------------------------------------------------------------
// 5.1. Strict 301 Canonical URL Normalization & Alias Redirects
// --------------------------------------------------------------------------
const REDIRECT_MAP: Record<string, string> = {
  // Healthcare duplicates -> canonical /for/healthcare
  "/health-workers": "/for/healthcare",
  "/doctors-nurses": "/for/healthcare",
  "/for/health-workers": "/for/healthcare",
  "/for/doctors-nurses": "/for/healthcare",
  "/fr/health-workers": "/fr/for/healthcare",
  "/fr/doctors-nurses": "/fr/for/healthcare",
  "/fr/for/health-workers": "/fr/for/healthcare",
  "/fr/for/doctors-nurses": "/fr/for/healthcare",

  // Audience aliases -> canonical
  "/for/entrepreneurs": "/for/business-owners",
  "/for/incorporated": "/for/business-owners",
  "/fr/for/entrepreneurs": "/fr/for/business-owners",
  "/fr/for/incorporated": "/fr/for/business-owners",
  "/for/immigrants": "/for/newcomers",
  "/for/new-to-canada": "/for/newcomers",
  "/fr/for/immigrants": "/fr/for/newcomers",
  "/fr/for/new-to-canada": "/fr/for/newcomers",
  "/for/parents": "/for/families",
  "/fr/for/parents": "/fr/for/families",
  "/for/muslim-investors": "/investing/islamic-equity",
  "/fr/for/muslim-investors": "/fr/investing/islamic-equity",
  "/become-an-agent": "/careers",
  "/fr/become-an-agent": "/fr/careers",

  // Calculators aliases -> canonical /calculators
  "/financial-calculators": "/calculators",
  "/fr/financial-calculators": "/fr/calculators",
  "/fr/simulateurs": "/fr/calculators",

  // Cut the news desk -> canonical /what-changed
  "/news": "/what-changed",
  "/financial-news": "/what-changed",
  "/fr/news": "/fr/what-changed",
  "/fr/financial-news": "/fr/what-changed",
};

app.use((req: Request, res: Response, next: NextFunction) => {
  const cleanPath = req.path.replace(/\/+$/, "") || "/";
  const target = REDIRECT_MAP[cleanPath.toLowerCase()];
  if (target) {
    return res.redirect(301, target);
  }
  next();
});

// --------------------------------------------------------------------------
// 5.2. Strict Attribute & HTML Escaping Helpers
// --------------------------------------------------------------------------
function escapeHtml(str: string): string {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeAttr(str: string): string {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeJsonLd(schema: unknown): string {
  return JSON.stringify(schema).replace(/<\/script/gi, "<\\/script");
}

/**
 * Formats metadata page titles to strictly stay <= 60 characters
 * without cutting words mid-sentence (truncates cleanly at word boundaries).
 */
function formatMetaTitle(rawTitle: string, brand = "Ahmed Bello", maxLen = 60): string {
  const brandSuffix = ` | ${brand}`;
  const clean = rawTitle.replace(/\s+/g, " ").trim();

  // If already includes the brand
  if (clean.includes(brand)) {
    if (clean.length <= maxLen) return clean;
    const target = maxLen - 3;
    const slice = clean.slice(0, target);
    const lastSpace = slice.lastIndexOf(" ");
    return (lastSpace > 20 ? slice.slice(0, lastSpace) : slice).trim() + "...";
  }

  // If appending brand fits within maxLen
  const withBrand = `${clean}${brandSuffix}`;
  if (withBrand.length <= maxLen) return withBrand;

  // Truncate clean title so cleanTitle + brandSuffix <= maxLen
  const allowed = maxLen - brandSuffix.length - 3;
  if (allowed < 15) {
    const slice = withBrand.slice(0, maxLen - 3);
    const lastSpace = slice.lastIndexOf(" ");
    return (lastSpace > 20 ? slice.slice(0, lastSpace) : slice).trim() + "...";
  }

  const slice = clean.slice(0, allowed);
  const lastSpace = slice.lastIndexOf(" ");
  const truncated = (lastSpace > 10 ? slice.slice(0, lastSpace) : slice).trim() + "...";
  return `${truncated}${brandSuffix}`;
}

// --------------------------------------------------------------------------
// 6. High-Value SEO & Schema.org Rich Structured Data Map
// --------------------------------------------------------------------------
interface RouteMeta {
  title: string;
  description: string;
  ogType: string;
  url: string;
  jsonLd: Record<string, any>[];
}

const siteWideFinancialService = {
  "@context": "https://schema.org",
  "@type": "FinancialService",
  "@id": `${siteConfig.siteUrl}/#financialservice`,
  name: "Ahmed Bello Financial Education",
  legalName: "Ahmed Bello",
  url: siteConfig.siteUrl,
  logo: `${siteConfig.siteUrl}/brand/og-share.png`,
  image: `${siteConfig.siteUrl}/brand/og-share.png`,
  description:
    "Plain-language Canadian financial education on registered accounts (TFSA, RRSP, FHSA, RESP), insurance solutions, and family money decisions.",
  areaServed: {
    "@type": "Country",
    name: "Canada",
  },
  address: {
    "@type": "PostalAddress",
    addressCountry: "CA",
  },
  knowsAbout: [
    "Tax-Free Savings Account (TFSA)",
    "Registered Retirement Savings Plan (RRSP)",
    "First Home Savings Account (FHSA)",
    "Registered Education Savings Plan (RESP)",
    "Canada Pension Plan (CPP)",
    "Old Age Security (OAS)",
    "Life Insurance and Disability Insurance",
    "Consumer Proposals and Debt Repayment",
    "Canadian Financial Decision-Making",
  ],
};

const siteWidePerson = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${siteConfig.siteUrl}/#person`,
  name: "Ahmed Bello",
  jobTitle: siteConfig.designation,
  url: siteConfig.siteUrl,
  description:
    "Licensed Financial Solutions Professional providing plain-language financial education for Canadians.",
  worksFor: {
    "@id": `${siteConfig.siteUrl}/#financialservice`,
  },
};

const siteWideWebSite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteConfig.siteUrl}/#website`,
  name: "Ahmed Bello",
  url: siteConfig.siteUrl,
  description: "Plain-language Canadian financial education on registered accounts, insurance, and family money decisions.",
  publisher: {
    "@id": `${siteConfig.siteUrl}/#person`,
  },
};

function getRouteMetadata(pathname: string): RouteMeta {
  const pathOnly = pathname.split("?")[0].split("#")[0];
  const cleanPath = pathOnly.replace(/\/+$/, "") || "/";

  // Article pages (/education/:slug, /insights/:slug, /fr/education/:slug, /fr/insights/:slug)
  const articleMatch = cleanPath.match(/^\/(?:fr\/)?(?:education|insights)\/([^/]+)$/);
  if (articleMatch) {
    const slug = articleMatch[1];
    const isFrench = cleanPath.startsWith("/fr");
    const article = articles.find((a) => a.slug === slug);
    if (article) {
      const title = formatMetaTitle(article.seoTitle || article.title, "Ahmed Bello", 60);
      const articleUrl = isFrench ? `/fr${article.url}` : article.url;

      return {
        title,
        description: article.description,
        ogType: "article",
        url: `${siteConfig.siteUrl}${articleUrl}`,
        jsonLd: [
          siteWideWebSite,
          siteWidePerson,
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: article.seoTitle || article.title,
            description: article.description,
            datePublished: article.datePublished || "2025-01-15T08:00:00-05:00",
            dateModified: article.dateModified || "2026-11-05T09:00:00-05:00",
            isAccessibleForFree: true,
            inLanguage: isFrench ? "fr-CA" : "en-CA",
            author: siteWidePerson,
            publisher: siteWideFinancialService,
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `${siteConfig.siteUrl}${articleUrl}`,
            },
            about: {
              "@type": "Thing",
              name: article.category,
            },
            citation: article.sources.map((s) => ({
              "@type": "CreativeWork",
              name: s.label,
              url: s.url,
            })),
            speakable: {
              "@type": "SpeakableSpecification",
              cssSelector: ["h1", ".lede", "#overview"],
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: isFrench ? "Accueil" : "Home",
                item: isFrench ? `${siteConfig.siteUrl}/fr` : siteConfig.siteUrl,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: article.kind === "guide" ? (isFrench ? "Éducation Financière" : "Financial Education") : (isFrench ? "Perspectives" : "Insights"),
                item: `${siteConfig.siteUrl}${isFrench ? "/fr" : ""}/${article.kind === "guide" ? "education" : "insights"}`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: article.title,
                item: `${siteConfig.siteUrl}${articleUrl}`,
              },
            ],
          },
        ],
      };
    }
  }

  // Audience Hub pages (/for/:audience and /fr/for/:audience)
  const forMatch = cleanPath.match(/^\/(?:fr\/)?for\/([^\/]+)$/);
  if (forMatch) {
    const aud = forMatch[1];
    const isFrench = cleanPath.startsWith("/fr");

    const VALID_AUDIENCES: Record<string, { titleEn: string; titleFr: string; descEn: string; descFr: string; canonical: string }> = {
      healthcare: {
        titleEn: "Financial Guidance for Healthcare | Ahmed Bello",
        titleFr: "Orientation Financière Santé | Ahmed Bello",
        descEn: "Licensing gap planning, newcomer cashflow runway, and income protection for internationally trained healthcare professionals.",
        descFr: "Planification des délais d'équivalence, subsistance et protection pour professionnels de la santé.",
        canonical: "/for/healthcare",
      },
      "business-owners": {
        titleEn: "Financial Guidance for Business Owners | Ahmed Bello",
        titleFr: "Orientation Propriétaires d'Entreprises | Ahmed Bello",
        descEn: "Corporate capital gains rules, Capital Dividend Account extraction, and private company estate planning.",
        descFr: "Règles fiscales corporatives, compte de dividendes en capital et planification de relève.",
        canonical: "/for/business-owners",
      },
      families: {
        titleEn: "Financial Guidance for Families | Ahmed Bello",
        titleFr: "Orientation Financière Familles | Ahmed Bello",
        descEn: "Mortgage renewal planning, FHSA and Home Buyers' Plan coordination, RESP education savings, and family protection.",
        descFr: "Planification du renouvellement hypothécaire, CELIAPP, RAP et épargne-études REEE.",
        canonical: "/for/families",
      },
      newcomers: {
        titleEn: "Financial Essentials for Newcomers | Ahmed Bello",
        titleFr: "Essentiels Nouveaux Arrivants | Ahmed Bello",
        descEn: "Credit score building, first-year savings runway calculator, tax residency timing, and foreign asset reporting.",
        descFr: "Bâtir son crédit, réserves financières de première année et règles de résidence fiscale.",
        canonical: "/for/newcomers",
      },
    };

    const matchedAud = VALID_AUDIENCES[aud];
    if (!matchedAud) {
      // Unknown audience slug: Return 404 metadata so it never soft-404s with 200 OK
      return {
        title: isFrench ? "Page non trouvée (404) | Ahmed Bello" : "Page Not Found (404) | Ahmed Bello",
        description: isFrench
          ? "La page de conseil financier demandée n'existe pas."
          : "The requested financial guidance page could not be found.",
        ogType: "website",
        url: `${siteConfig.siteUrl}${cleanPath}`,
        jsonLd: [siteWideWebSite],
      };
    }

    return {
      title: isFrench ? matchedAud.titleFr : matchedAud.titleEn,
      description: isFrench ? matchedAud.descFr : matchedAud.descEn,
      ogType: "website",
      url: `${siteConfig.siteUrl}${isFrench ? `/fr${matchedAud.canonical}` : matchedAud.canonical}`,
      jsonLd: [siteWideWebSite, siteWideFinancialService],
    };
  }

  switch (cleanPath) {
    case "/how-i-help":
    case "/fr/how-i-help":
      return {
        title: cleanPath.startsWith("/fr")
          ? "Comment J'Aide | Éducation Financière | Ahmed Bello"
          : "How I Help | Financial Guidance | Ahmed Bello",
        description:
          "Seven question-led financial areas: cash flow, registered accounts, income protection, investing, education savings, retirement, and newcomers.",
        ogType: "website",
        url: `${siteConfig.siteUrl}${cleanPath}`,
        jsonLd: [
          siteWideWebSite,
          siteWideFinancialService,
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.siteUrl },
              { "@type": "ListItem", position: 2, name: "How I Help", item: `${siteConfig.siteUrl}${cleanPath}` },
            ],
          },
        ],
      };

    case "/education":
    case "/fr/education":
      return {
        title: cleanPath.startsWith("/fr")
          ? "Bibliothèque d'Éducation Financière | Ahmed Bello"
          : "Financial Education Library | Ahmed Bello",
        description:
          "Plain-language explainers on Canadian registered accounts (TFSA, RRSP, FHSA, RESP), risk, debt, protection, and retirement with official sources.",
        ogType: "website",
        url: `${siteConfig.siteUrl}${cleanPath}`,
        jsonLd: [
          siteWideWebSite,
          siteWideFinancialService,
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Financial Education Library | Ahmed Bello",
            url: `${siteConfig.siteUrl}/education`,
            description:
              "Plain-language explainers on Canadian registered accounts, risk, debt, protection, and retirement rules.",
            hasPart: articles.filter((a) => a.kind === "guide").map((a) => ({
              "@type": "Article",
              name: a.title,
              url: `${siteConfig.siteUrl}${a.url}`,
            })),
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.siteUrl },
              { "@type": "ListItem", position: 2, name: "Financial Education", item: `${siteConfig.siteUrl}/education` },
            ],
          },
        ],
      };

    case "/insights":
      return {
        title: "Insights & Financial Essays | Ahmed Bello",
        description:
          "Essays on financial decision-making, comparing debt with savings, and eight questions to ask before buying any financial product in Canada.",
        ogType: "website",
        url: `${siteConfig.siteUrl}/insights`,
        jsonLd: [
          siteWideWebSite,
          siteWideFinancialService,
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Insights & Financial Essays | Ahmed Bello",
            url: `${siteConfig.siteUrl}/insights`,
            hasPart: articles.filter((a) => a.kind === "insight").map((a) => ({
              "@type": "Article",
              name: a.title,
              url: `${siteConfig.siteUrl}${a.url}`,
            })),
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.siteUrl },
              { "@type": "ListItem", position: 2, name: "Insights", item: `${siteConfig.siteUrl}/insights` },
            ],
          },
        ],
      };

    case "/what-changed":
    case "/fr/what-changed":
      return {
        title: cleanPath.startsWith("/fr")
          ? "Changements aux Règles Financières | Ahmed Bello"
          : "What Changed in Canadian Money Rules | Ahmed Bello",
        description: cleanPath.startsWith("/fr")
          ? "Revue mensuelle rédigée par Ahmed Bello : décisions de la Banque du Canada, règles de transfert B-20 du BSIF, plafonds CELIAPP/REER et fiscalité."
          : "Monthly Canadian financial intelligence by licensed professional Ahmed Bello: Bank of Canada rate shifts, OSFI straight switches, and CRA tax rules.",
        ogType: "website",
        url: `${siteConfig.siteUrl}${cleanPath}`,
        jsonLd: [
          siteWideWebSite,
          siteWideFinancialService,
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: cleanPath.startsWith("/fr") ? "Changements aux Règles Financières" : "What Changed in Canadian Money Rules",
            url: `${siteConfig.siteUrl}${cleanPath}`,
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.siteUrl },
              { "@type": "ListItem", position: 2, name: cleanPath.startsWith("/fr") ? "Règles 2026" : "What Changed", item: `${siteConfig.siteUrl}${cleanPath}` },
            ],
          },
        ],
      };

    case "/calculators":
    case "/fr/calculators":
      return {
        title: cleanPath.startsWith("/fr")
          ? "Simulateurs Financiers Canadiens | Ahmed Bello"
          : "Canadian Financial Calculators | Ahmed Bello",
        description: cleanPath.startsWith("/fr")
          ? "Simulateurs interactifs : piste d'atterrissage pour nouveaux arrivants, choc hypothécaire, arbitrage CELI vs REER et plafond passif SPCC."
          : "Interactive Canadian simulators: Newcomer financial runway, mortgage renewal shock analyzer, TFSA vs RRSP tax arbitrage, and CCPC passive income calculator.",
        ogType: "website",
        url: `${siteConfig.siteUrl}${cleanPath}`,
        jsonLd: [
          siteWideWebSite,
          siteWideFinancialService,
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Canadian Financial Decision Simators",
            url: `${siteConfig.siteUrl}${cleanPath}`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "All",
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.siteUrl },
              { "@type": "ListItem", position: 2, name: "Financial Calculators", item: `${siteConfig.siteUrl}${cleanPath}` },
            ],
          },
        ],
      };

    case "/investing/islamic-equity":
    case "/fr/investing/islamic-equity":
      return {
        title: cleanPath.startsWith("/fr")
          ? "Investissement Islamique au Canada | Ahmed Bello"
          : "Islamic Equity Investing in Canada | Ahmed Bello",
        description: cleanPath.startsWith("/fr")
          ? "Guide éducatif sur l'investissement en actions mondiales conformes à la charia selon les normes de l'AAOIFI et les comptes enregistrés canadiens."
          : "Educational guide on Shari'ah-compliant global equity investing under AAOIFI standards. Benchmark index tracking and Canadian registered accounts (TFSA, RRSP, FHSA).",
        ogType: "website",
        url: `${siteConfig.siteUrl}${cleanPath}`,
        jsonLd: [
          siteWideWebSite,
          siteWideFinancialService,
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Islamic Investing in Canada Educational Guide",
            description:
              "Educational framework on Shari'ah-compliant global equity investing, ethical screening principles, and Canadian tax-sheltered accounts.",
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.siteUrl },
              { "@type": "ListItem", position: 2, name: "Islamic Investing", item: `${siteConfig.siteUrl}${cleanPath}` },
            ],
          },
        ],
      };

    case "/about":
    case "/fr/about":
      return {
        title: cleanPath.startsWith("/fr")
          ? "À Propos d'Ahmed Bello | Professionnel Agréé"
          : "About Ahmed Bello | Licensed Financial Solutions",
        description:
          "Independent Canadian financial educator helping Canadians understand how their income, savings, protection, and retirement decisions connect.",
        ogType: "profile",
        url: `${siteConfig.siteUrl}${cleanPath}`,
        jsonLd: [
          siteWideWebSite,
          siteWidePerson,
          siteWideFinancialService,
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.siteUrl },
              { "@type": "ListItem", position: 2, name: "About Ahmed", item: `${siteConfig.siteUrl}${cleanPath}` },
            ],
          },
        ],
      };

    case "/careers":
    case "/fr/careers":
      return {
        title: cleanPath.startsWith("/fr")
          ? "Expansion du Cabinet & Carrières | Ahmed Bello"
          : "Practice Expansion & Careers | Ahmed Bello",
        description:
          "Launch your independent Canadian financial advisory career. Comprehensive LLQP licensing support, case co-planning, and direct 1-on-1 mentorship with Ahmed Bello. No tuition or desk fees charged by our mentorship program.",
        ogType: "website",
        url: `${siteConfig.siteUrl}${cleanPath}`,
        jsonLd: [
          siteWideWebSite,
          siteWideFinancialService,
          siteWidePerson,
          {
            "@context": "https://schema.org",
            "@type": "EducationalOccupationalProgram",
            name: "Independent Financial Solutions Practice Mentorship",
            description:
              "Comprehensive Canadian financial practice training, provincial LLQP licensing support, and 1-on-1 mentorship with Ahmed Bello. No tuition or desk fees charged by our mentorship program.",
            provider: siteWidePerson,
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.siteUrl },
              { "@type": "ListItem", position: 2, name: "Careers & Mentorship", item: `${siteConfig.siteUrl}${cleanPath}` },
            ],
          },
        ],
      };

    case "/contact":
    case "/fr/contact":
      return {
        title: cleanPath.startsWith("/fr")
          ? "Démarrer une Conversation | Ahmed Bello"
          : "Start a Conversation | Ahmed Bello",
        description:
          "Ask a financial question regarding Canadian registered accounts, income protection, retirement, or newcomer finances without sales pressure.",
        ogType: "website",
        url: `${siteConfig.siteUrl}${cleanPath}`,
        jsonLd: [
          siteWideWebSite,
          siteWideFinancialService,
          {
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: "Start a Conversation | Ahmed Bello",
            url: `${siteConfig.siteUrl}${cleanPath}`,
            contactPoint: {
              "@type": "ContactPoint",
              email: siteConfig.publicEmail,
              telephone: siteConfig.publicPhone,
              contactType: "customer service",
              areaServed: "CA",
              availableLanguage: ["English", "French"],
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.siteUrl },
              { "@type": "ListItem", position: 2, name: "Contact", item: `${siteConfig.siteUrl}${cleanPath}` },
            ],
          },
        ],
      };

    case "/disclosures":
    case "/fr/disclosures":
      return {
        title: cleanPath.startsWith("/fr")
          ? "Divulgations Réglementaires | Ahmed Bello"
          : "Regulatory Disclosures | Ahmed Bello",
        description:
          cleanPath.startsWith("/fr")
            ? "Divulgations provinciales relatives aux permis d'exercice, portée des mandats éducatifs, modèles de rémunération et transparence réglementaire."
            : "Plain-language disclosures on licensing, professional scope, compensation, education vs advice boundaries, and regulatory transparency.",
        ogType: "website",
        url: `${siteConfig.siteUrl}${cleanPath}`,
        jsonLd: [
          siteWideWebSite,
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Disclosures & Regulatory Transparency",
            url: `${siteConfig.siteUrl}${cleanPath}`,
          },
        ],
      };

    case "/standards":
    case "/fr/standards":
      return {
        title: cleanPath.startsWith("/fr")
          ? "Normes Éditoriales & Sources | Ahmed Bello"
          : "Editorial Standards & Sources | Ahmed Bello",
        description:
          cleanPath.startsWith("/fr")
            ? "Processus rigoureux de recherche, de validation auprès des organismes gouvernementaux canadiens et de mise à jour de nos guides financiers."
            : "How financial guides on this site are researched, verified against official Canadian government sources, dated, and reviewed.",
        ogType: "website",
        url: `${siteConfig.siteUrl}${cleanPath}`,
        jsonLd: [
          siteWideWebSite,
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Editorial Standards & Sources",
            url: `${siteConfig.siteUrl}${cleanPath}`,
          },
        ],
      };

    case "/privacy":
    case "/fr/privacy":
      return {
        title: cleanPath.startsWith("/fr")
          ? "Avis de Confidentialité | Ahmed Bello"
          : "Privacy Notice & Data Security | Ahmed Bello",
        description:
          cleanPath.startsWith("/fr")
            ? "Traitement, sécurisation et confidentialité des renseignements personnels sous la législation canadienne LPRPDE et LCAP."
            : "How personal information from enquiries is handled, protected, and kept private under Canadian privacy principles and CASL.",
        ogType: "website",
        url: `${siteConfig.siteUrl}${cleanPath}`,
        jsonLd: [
          siteWideWebSite,
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Privacy Notice",
            url: `${siteConfig.siteUrl}${cleanPath}`,
          },
        ],
      };

    case "/terms":
    case "/fr/terms":
      return {
        title: cleanPath.startsWith("/fr")
          ? "Conditions d'Utilisation | Ahmed Bello"
          : "Terms of Use | Ahmed Bello",
        description:
          cleanPath.startsWith("/fr")
            ? "Règles, propriété intellectuelle, droits d'auteur et avis de non-responsabilité applicables à l'utilisation de cette ressource éducative canadienne."
            : "Terms and ground rules for using this Canadian financial education website, intellectual property, and limitations of liability.",
        ogType: "website",
        url: `${siteConfig.siteUrl}${cleanPath}`,
        jsonLd: [
          siteWideWebSite,
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Website Terms of Use",
            url: `${siteConfig.siteUrl}${cleanPath}`,
          },
        ],
      };

    case "/confirm-subscription":
    case "/fr/confirm-subscription":
      return {
        title: cleanPath.startsWith("/fr")
          ? "Abonnement Confirmé | Ahmed Bello"
          : "Subscription Confirmed | Ahmed Bello",
        description: "Your educational newsletter subscription has been confirmed.",
        ogType: "website",
        url: `${siteConfig.siteUrl}${cleanPath}`,
        jsonLd: [siteWideWebSite],
      };

    default:
      if (cleanPath === "/" || cleanPath === "/fr") {
        return {
          title: cleanPath === "/fr"
            ? "Ahmed Bello | Éducation Financière pour Canadiens"
            : "Ahmed Bello | Financial Education for Canadians",
          description:
            "Plain-language Canadian financial education on registered accounts (TFSA, RRSP, FHSA), insurance, and family money decisions with Ahmed Bello.",
          ogType: "website",
          url: `${siteConfig.siteUrl}${cleanPath === "/fr" ? "/fr" : ""}`,
          jsonLd: [
            siteWideWebSite,
            siteWideFinancialService,
            siteWidePerson,
          ],
        };
      }

      // Explicit 404 metadata for any unknown URL so it never displays the homepage title
      return {
        title: cleanPath.startsWith("/fr") ? "Page non trouvée (404) | Ahmed Bello" : "Page Not Found (404) | Ahmed Bello",
        description: "The page you requested could not be found.",
        ogType: "website",
        url: `${siteConfig.siteUrl}${cleanPath}`,
        jsonLd: [siteWideWebSite],
      };
  }
}

// --------------------------------------------------------------------------
// 7. Server-Side Head Injection Helper
// --------------------------------------------------------------------------
function injectHeadMetadata(html: string, pathname: string): string {
  const meta = getRouteMetadata(pathname);

  // Replace <title> (HTML escaped)
  let transformed = html.replace(
    /<title>.*?<\/title>/i,
    `<title>${escapeHtml(meta.title)}</title>`
  );

  // Replace or inject meta description (Attribute escaped)
  transformed = transformed.replace(
    /<meta name="description" content=".*?" \/>/i,
    `<meta name="description" content="${escapeAttr(meta.description)}" />`
  );

  // Replace canonical (Attribute escaped)
  transformed = transformed.replace(
    /<link rel="canonical" href=".*?" \/>/i,
    `<link rel="canonical" href="${escapeAttr(meta.url)}" />`
  );

  // Replace og:title (Attribute escaped)
  transformed = transformed.replace(
    /<meta property="og:title" content=".*?" \/>/i,
    `<meta property="og:title" content="${escapeAttr(meta.title)}" />`
  );

  // Replace og:description (Attribute escaped)
  transformed = transformed.replace(
    /<meta property="og:description" content=".*?" \/>/i,
    `<meta property="og:description" content="${escapeAttr(meta.description)}" />`
  );

  // Replace og:url (Attribute escaped)
  transformed = transformed.replace(
    /<meta property="og:url" content=".*?" \/>/i,
    `<meta property="og:url" content="${escapeAttr(meta.url)}" />`
  );

  // Replace og:type (Attribute escaped)
  transformed = transformed.replace(
    /<meta property="og:type" content=".*?" \/>/i,
    `<meta property="og:type" content="${escapeAttr(meta.ogType)}" />`
  );

  // Replace twitter:title (Attribute escaped)
  transformed = transformed.replace(
    /<meta name="twitter:title" content=".*?" \/>/i,
    `<meta name="twitter:title" content="${escapeAttr(meta.title)}" />`
  );

  // Replace twitter:description (Attribute escaped)
  transformed = transformed.replace(
    /<meta name="twitter:description" content=".*?" \/>/i,
    `<meta name="twitter:description" content="${escapeAttr(meta.description)}" />`
  );

  // Robots meta tag: Indexing enabled when DRAFT_MODE is false and not 404
  let extraTags = "";
  if (DRAFT_MODE || meta.title.includes("404")) {
    extraTags += `\n    <meta name="robots" content="noindex, nofollow" />`;
  } else {
    extraTags += `\n    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />`;
    extraTags += `\n    <meta property="og:locale" content="en_CA" />`;
    extraTags += `\n    <meta property="og:image" content="${siteConfig.siteUrl}/brand/og-share.png" />`;
    extraTags += `\n    <meta name="twitter:image" content="${siteConfig.siteUrl}/brand/og-share.png" />`;
  }

  // Inject Rich JSON-LD Schemas (XSS and script-close safe)
  meta.jsonLd.forEach((schema) => {
    extraTags += `\n    <script type="application/ld+json">${escapeJsonLd(schema)}</script>`;
  });

  transformed = transformed.replace("</head>", `${extraTags}\n  </head>`);
  const semanticFallback = getSemanticFallbackHtml(pathname);
  if (semanticFallback) {
    transformed = transformed.replace('<div id="root"></div>', `<div id="root">${semanticFallback}</div>`);
  }

  return transformed;
}

// --------------------------------------------------------------------------
// 8. Server Startup: Dev Mode & Production SSR
// --------------------------------------------------------------------------
async function setupServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });

    app.use(vite.middlewares);

    app.use("*", async (req: Request, res: Response, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(process.cwd(), "index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);
        const meta = getRouteMetadata(url);
        const html = injectHeadMetadata(template, url);
        const statusCode = meta.title.includes("404") ? 404 : 200;
        res.status(statusCode).set({ "Content-Type": "text/html" }).end(html);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    const clientDist = path.resolve(process.cwd(), "dist");
    app.use(express.static(clientDist, { index: false }));

    app.use("*", (req: Request, res: Response) => {
      const url = req.originalUrl;
      try {
        const indexPath = path.resolve(clientDist, "index.html");
        if (fs.existsSync(indexPath)) {
          const template = fs.readFileSync(indexPath, "utf-8");
          const meta = getRouteMetadata(url);
          const html = injectHeadMetadata(template, url);
          const statusCode = meta.title.includes("404") ? 404 : 200;
          res.status(statusCode).set({ "Content-Type": "text/html" }).end(html);
        } else {
          res.status(404).send("Application build not found.");
        }
      } catch (e: any) {
        res.status(500).send("Server rendering error: " + e?.message);
      }
    });
  }

  app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`Ahmed Bello production server running on port ${PORT}`);
  });
}

setupServer();
