
import { getLatestFinancialNews } from "./src/services/newsService.ts";
import { handleContactSubmission, handleConfirmSubscription } from "./src/server/apiHandlers.ts";
import express, { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { articles } from "./src/content/data.ts";
import { DRAFT_MODE, siteConfig } from "./src/config/site.ts";
import {
  ARTICLE_FR_SEO,
  formatStrictTitle,
  getCoreRouteSeo,
  getLanguageUrls,
} from "./src/config/seoMetadata.ts";

dotenv.config();

function getSemanticFallbackHtml(pathname: string): string {
  const p = pathname.toLowerCase().split("?")[0].replace(/\/+$/, "") || "/";
  const core = getCoreRouteSeo(p);
  if (p === "/about" || p === "/fr/about") {
    return `
      <main style="max-width:800px;margin:2rem auto;padding:1rem;font-family:serif;">
        <h1>${escapeHtml(core?.heading || "About Ahmed Bello | Licensed Financial Solutions Professional")}</h1>
        <p>${escapeHtml(core?.summary || "Independent financial educator helping individuals and families across Canada understand registered accounts (TFSA, RRSP, FHSA), debt repayment, and income protection.")}</p>
        <h2>Direct Contact</h2>
        <p>Email: enquiries@ahmedbello.com | Phone: +1-506-899-4941 | Schedule: https://calendly.com/olabel/30min</p>
      </main>
    `;
  }
  if (p === "/contact" || p === "/fr/contact") {
    return `
      <main style="max-width:800px;margin:2rem auto;padding:1rem;font-family:serif;">
        <h1>${escapeHtml(core?.heading || "Start a Conversation with Ahmed Bello")}</h1>
        <p>${escapeHtml(core?.summary || "Ask a question about your Canadian mortgage renewal, registered accounts (TFSA, RRSP, FHSA), income protection, or newcomer finances with zero sales pressure.")}</p>
        <ul>
          <li><strong>Email:</strong> enquiries@ahmedbello.com</li>
          <li><strong>Direct Telephone:</strong> +1-506-899-4941</li>
          <li><strong>Schedule:</strong> <a href="https://calendly.com/olabel/30min">Schedule 30-Minute Intro Call</a></li>
          <li><strong>Location:</strong> Moncton, NB, Canada</li>
        </ul>
      </main>
    `;
  }
  if (p === "/what-changed" || p === "/fr/what-changed") {
    return `
      <main style="max-width:800px;margin:2rem auto;padding:1rem;font-family:serif;">
        <h1>${escapeHtml(core?.heading || "What Changed in Canadian Money Rules")}</h1>
        <p>${escapeHtml(core?.summary || "Monthly Canadian financial intelligence briefing by Ahmed Bello: Bank of Canada policy rates, OSFI Guideline B-20 uninsured mortgage straight-switch rules, CRA registered limits, and federal tax amendments.")}</p>
      </main>
    `;
  }
  if (p === "/costly-blindspots" || p === "/fr/costly-blindspots") {
    return `
      <main style="max-width:800px;margin:2rem auto;padding:1rem;font-family:serif;">
        <h1>${escapeHtml(core?.heading || "Costly Canadian Money Blindspots")}</h1>
        <p>${escapeHtml(core?.summary || "A compendium of verified Canadian financial rules, overlooked government grants, and tax mechanisms covering the Canada Learning Bond, CMHC Eco Plus refunds, FHSA clocks, RRSP deferral, and retirement timing.")}</p>
        <p>Ahmed Bello, Licensed Financial Solutions Professional | Moncton, New Brunswick | Licensed Across Canada.</p>
      </main>
    `;
  }
  return "";
}

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === "production";

// Enable reverse-proxy trust for accurate IP resolution in Cloud Run / hosting environments
app.set("trust proxy", 1);

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

// --------------------------------------------------------------------------
// 5a. Unified Contact & Subscription Ingestion Endpoint
// --------------------------------------------------------------------------
app.post(["/api/contact", "/api/subscribe"], handleContactSubmission);

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
// 5c. Cryptographically Verified CASL Double Opt-in Confirmation Endpoint
// --------------------------------------------------------------------------
app.all("/api/confirm-subscription", handleConfirmSubscription);

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

  // Blindspots aliases -> canonical /costly-blindspots
  "/blindspots": "/costly-blindspots",
  "/fr/blindspots": "/fr/costly-blindspots",
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

// --------------------------------------------------------------------------
// 6. Unified SEO & Schema.org Structured Data Map
// --------------------------------------------------------------------------
interface RouteMeta {
  title: string;
  description: string;
  ogType: string;
  url: string;
  enUrl: string;
  frUrl: string;
  lang: "en-CA" | "fr-CA";
  noIndex: boolean;
  isNotFound?: boolean;
  jsonLd: Record<string, any>[];
}

const siteWideFinancialService = {
  "@context": "https://schema.org",
  "@type": "FinancialService",
  "@id": `${siteConfig.siteUrl}/#organization`,
  name: "Ahmed Bello Financial Solutions",
  url: `${siteConfig.siteUrl}/`,
  logo: `${siteConfig.siteUrl}/brand/icon-512.png`,
  image: `${siteConfig.siteUrl}${siteConfig.headshotUrl}`,
  telephone: siteConfig.publicPhone,
  email: siteConfig.publicEmail,
  description:
    "Tax-efficient wealth accumulation, family capital preservation, and financial strategy for Canadian families, CCPC business owners, and newcomers.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Dieppe",
    addressRegion: "NB",
    addressCountry: "CA",
  },
  areaServed: {
    "@type": "Country",
    name: "Canada",
  },
  knowsAbout: [
    "Tax-Free Savings Account (TFSA)",
    "Registered Retirement Savings Plan (RRSP)",
    "First Home Savings Account (FHSA)",
    "CCPC Small Business Deduction Tax Efficiency",
    "Halal & Islamic Investing Canada",
    "Newcomer Financial Planning Canada",
  ],
};

const siteWidePerson = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${siteConfig.siteUrl}/#person`,
  name: "Ahmed Bello",
  jobTitle: "Licensed Financial Solutions Professional",
  telephone: siteConfig.publicPhone,
  email: siteConfig.publicEmail,
  image: `${siteConfig.siteUrl}${siteConfig.headshotUrl}`,
  worksFor: {
    "@id": `${siteConfig.siteUrl}/#organization`,
  },
  url: `${siteConfig.siteUrl}/`,
};

const siteWideWebSite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteConfig.siteUrl}/#website`,
  name: "Ahmed Bello",
  url: `${siteConfig.siteUrl}/`,
  description: "Plain-language Canadian financial education on registered accounts, insurance, and family money decisions.",
  publisher: {
    "@id": `${siteConfig.siteUrl}/#person`,
  },
};

function buildCoreJsonLd(cleanPath: string, heading: string, isFrench: boolean): Record<string, any>[] {
  const { canonicalUrl } = getLanguageUrls(cleanPath);
  if (cleanPath === "/" || cleanPath === "/fr") {
    return [siteWideWebSite, siteWideFinancialService, siteWidePerson];
  }
  if (cleanPath === "/education" || cleanPath === "/fr/education") {
    return [
      siteWideWebSite,
      siteWideFinancialService,
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: heading,
        url: canonicalUrl,
        hasPart: articles
          .filter((a) => a.kind === "guide")
          .map((a) => ({
            "@type": "Article",
            name: isFrench ? ARTICLE_FR_SEO[a.slug]?.title || a.title : a.title,
            url: `${siteConfig.siteUrl}${isFrench ? `/fr${a.url}` : a.url}`,
          })),
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: isFrench ? "Accueil" : "Home", item: isFrench ? `${siteConfig.siteUrl}/fr` : `${siteConfig.siteUrl}/` },
          { "@type": "ListItem", position: 2, name: isFrench ? "Éducation Financière" : "Financial Education", item: canonicalUrl },
        ],
      },
    ];
  }
  if (cleanPath === "/insights" || cleanPath === "/fr/insights") {
    return [
      siteWideWebSite,
      siteWideFinancialService,
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: heading,
        url: canonicalUrl,
        hasPart: articles
          .filter((a) => a.kind === "insight")
          .map((a) => ({
            "@type": "Article",
            name: isFrench ? ARTICLE_FR_SEO[a.slug]?.title || a.title : a.title,
            url: `${siteConfig.siteUrl}${isFrench ? `/fr${a.url}` : a.url}`,
          })),
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: isFrench ? "Accueil" : "Home", item: isFrench ? `${siteConfig.siteUrl}/fr` : `${siteConfig.siteUrl}/` },
          { "@type": "ListItem", position: 2, name: isFrench ? "Perspectives" : "Insights", item: canonicalUrl },
        ],
      },
    ];
  }
  if (cleanPath === "/calculators" || cleanPath === "/fr/calculators" || cleanPath === "/calculators/amt" || cleanPath === "/fr/calculators/amt") {
    return [
      siteWideWebSite,
      siteWideFinancialService,
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: cleanPath.includes("/amt")
          ? isFrench
            ? "Calculateur d'Impôt Minimum de Remplacement (IMR)"
            : "Alternative Minimum Tax (AMT) Calculator Canada"
          : isFrench
          ? "Simulateurs Financiers Canadiens"
          : "Canadian Financial Decision Calculators",
        url: canonicalUrl,
        applicationCategory: "FinanceApplication",
        operatingSystem: "All",
      },
    ];
  }
  if (cleanPath === "/about" || cleanPath === "/fr/about" || cleanPath === "/careers" || cleanPath === "/fr/careers") {
    return [siteWideWebSite, siteWidePerson, siteWideFinancialService];
  }
  if (cleanPath === "/contact" || cleanPath === "/fr/contact") {
    return [
      siteWideWebSite,
      siteWideFinancialService,
      {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        name: heading,
        url: canonicalUrl,
        contactPoint: {
          "@type": "ContactPoint",
          email: siteConfig.publicEmail,
          telephone: siteConfig.publicPhone,
          contactType: "customer service",
          areaServed: "CA",
          availableLanguage: ["English", "French"],
        },
      },
    ];
  }
  return [siteWideWebSite, siteWideFinancialService];
}

function getRouteMetadata(pathname: string): RouteMeta {
  const pathOnly = pathname.split("?")[0].split("#")[0];
  const cleanPath = pathOnly.replace(/\/+$/, "") || "/";
  const isFrench = cleanPath === "/fr" || cleanPath.startsWith("/fr/");
  const lang: "en-CA" | "fr-CA" = isFrench ? "fr-CA" : "en-CA";

  // 1. Dynamic Article / Insight Pages
  const articleMatch = cleanPath.match(/^\/(?:fr\/)?(?:education|insights)\/([^/]+)$/);
  if (articleMatch) {
    const slug = articleMatch[1];
    const article = articles.find((a) => a.slug === slug);
    if (article) {
      const frSeo = ARTICLE_FR_SEO[slug];
      const title = formatStrictTitle(
        isFrench ? frSeo?.seoTitle || article.seoTitle || article.title : article.seoTitle || article.title
      );
      const description = isFrench ? frSeo?.description || article.description : article.description;
      const headline = isFrench ? frSeo?.title || article.title : article.title;
      const articlePath = isFrench ? `/fr${article.url}` : article.url;
      const { enUrl, frUrl, canonicalUrl } = getLanguageUrls(articlePath);

      return {
        title,
        description,
        ogType: "article",
        url: canonicalUrl,
        enUrl,
        frUrl,
        lang,
        noIndex: false,
        jsonLd: [
          siteWideWebSite,
          siteWidePerson,
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline,
            description,
            datePublished: article.datePublished || "2025-01-15T08:00:00-05:00",
            dateModified: article.dateModified || "2026-11-05T09:00:00-05:00",
            isAccessibleForFree: true,
            inLanguage: lang,
            author: siteWidePerson,
            publisher: siteWideFinancialService,
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": canonicalUrl,
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
                item: isFrench ? `${siteConfig.siteUrl}/fr` : `${siteConfig.siteUrl}/`,
              },
              {
                "@type": "ListItem",
                position: 2,
                name:
                  article.kind === "guide"
                    ? isFrench
                      ? "Éducation Financière"
                      : "Financial Education"
                    : isFrench
                    ? "Perspectives"
                    : "Insights",
                item: `${siteConfig.siteUrl}${isFrench ? "/fr" : ""}/${article.kind === "guide" ? "education" : "insights"}`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: headline,
                item: canonicalUrl,
              },
            ],
          },
        ],
      };
    }
  }

  // 2. Core Canonical Routes (EN & FR) from unified seoMetadata.ts
  const coreSeo = getCoreRouteSeo(cleanPath);
  if (coreSeo) {
    const { enUrl, frUrl, canonicalUrl } = getLanguageUrls(cleanPath);
    return {
      title: formatStrictTitle(coreSeo.title),
      description: coreSeo.description,
      ogType: coreSeo.ogType || "website",
      url: canonicalUrl,
      enUrl,
      frUrl,
      lang: coreSeo.lang,
      noIndex: Boolean(coreSeo.noIndex),
      jsonLd: buildCoreJsonLd(cleanPath, coreSeo.heading, coreSeo.lang === "fr-CA"),
    };
  }

  // 3. Explicit 404 metadata for unknown URLs
  const { enUrl, frUrl, canonicalUrl } = getLanguageUrls(cleanPath);
  return {
    title: isFrench ? "Page non trouvée (404) | Ahmed Bello" : "Page Not Found (404) | Ahmed Bello",
    description: isFrench
      ? "La page demandée est introuvable. Consultez nos guides d'éducation financière au Canada."
      : "The page you requested could not be found. Explore Canadian financial education guides or return home.",
    ogType: "website",
    url: canonicalUrl,
    enUrl,
    frUrl,
    lang,
    noIndex: true,
    isNotFound: true,
    jsonLd: [siteWideWebSite],
  };
}

// --------------------------------------------------------------------------
// 7. Server-Side Head Injection Helper (No Duplicate Meta Tags)
// --------------------------------------------------------------------------
function injectHeadMetadata(html: string, pathname: string): string {
  const meta = getRouteMetadata(pathname);
  const robotsValue =
    DRAFT_MODE || meta.noIndex
      ? "noindex, nofollow"
      : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

  let transformed = html;
  transformed = transformed.replace(/<html\s+lang="[^"]*"/i, `<html lang="${meta.lang}"`);
  transformed = transformed.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(meta.title)}</title>`);
  transformed = transformed.replace(
    /<meta\s+name="description"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta name="description" content="${escapeAttr(meta.description)}" />`
  );
  transformed = transformed.replace(
    /<meta\s+name="robots"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta name="robots" content="${robotsValue}" />`
  );
  transformed = transformed.replace(
    /<link\s+rel="canonical"\s+href="[\s\S]*?"\s*\/?>/i,
    `<link rel="canonical" href="${escapeAttr(meta.url)}" />\n    <link rel="alternate" hreflang="en-CA" href="${escapeAttr(meta.enUrl)}" />\n    <link rel="alternate" hreflang="fr-CA" href="${escapeAttr(meta.frUrl)}" />\n    <link rel="alternate" hreflang="x-default" href="${escapeAttr(meta.enUrl)}" />`
  );
  transformed = transformed.replace(
    /<meta\s+property="og:title"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta property="og:title" content="${escapeAttr(meta.title)}" />`
  );
  transformed = transformed.replace(
    /<meta\s+property="og:description"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta property="og:description" content="${escapeAttr(meta.description)}" />`
  );
  transformed = transformed.replace(
    /<meta\s+property="og:url"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta property="og:url" content="${escapeAttr(meta.url)}" />`
  );
  transformed = transformed.replace(
    /<meta\s+property="og:type"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta property="og:type" content="${escapeAttr(meta.ogType)}" />`
  );
  transformed = transformed.replace(
    /<meta\s+property="og:locale"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta property="og:locale" content="${meta.lang === "fr-CA" ? "fr_CA" : "en_CA"}" />`
  );
  transformed = transformed.replace(
    /<meta\s+property="og:locale:alternate"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta property="og:locale:alternate" content="${meta.lang === "fr-CA" ? "en_CA" : "fr_CA"}" />`
  );
  transformed = transformed.replace(
    /<meta\s+name="twitter:title"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta name="twitter:title" content="${escapeAttr(meta.title)}" />`
  );
  transformed = transformed.replace(
    /<meta\s+name="twitter:description"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta name="twitter:description" content="${escapeAttr(meta.description)}" />`
  );

  // Inject route-specific JSON-LD schemas
  let extraTags = "";
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
        const statusCode = meta.isNotFound ? 404 : 200;
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
          const statusCode = meta.isNotFound ? 404 : 200;
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
