
import { getLatestFinancialNews } from "./src/services/newsService.ts";
import {
  handleContactSubmission,
  handleConfirmSubscription,
  isOriginAuthorized,
} from "./src/server/apiHandlers.ts";
import express, { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { articles } from "./src/content/data.ts";
import { BLINDSPOTS_DATA } from "./src/content/blindspotsData.ts";
import { RULE_CHANGES } from "./src/content/whatChangedData.ts";
import { DRAFT_MODE, siteConfig } from "./src/config/site.ts";
import {
  ARTICLE_FR_SEO,
  formatStrictTitle,
  getCoreRouteSeo,
  getLanguageUrls,
  getOgImageForPath,
  hasTranslatedFrenchAlternate,
  isFrenchArticleTranslated,
} from "./src/config/seoMetadata.ts";
import { buildRouteJsonLd } from "./src/config/schema.ts";

dotenv.config();

function getSemanticFallbackHtml(pathname: string): string {
  const p = pathname.toLowerCase().split("?")[0].replace(/\/+$/, "") || "/";
  const isFr = p === "/fr" || p.startsWith("/fr/");
  const core = getCoreRouteSeo(p);
  if (p === "/about" || p === "/fr/about") {
    return `
      <main style="max-width:800px;margin:2rem auto;padding:1rem;font-family:serif;">
        <h1>${escapeHtml(core?.heading || "About Ahmed Bello | Licensed Financial Solutions Professional")}</h1>
        <p>${escapeHtml(core?.summary || "Independent financial educator helping individuals and families across Canada understand registered accounts (TFSA, RRSP, FHSA), debt repayment, and income protection.")}</p>
        <h2>Direct Contact</h2>
        <p>Email: ${escapeHtml(siteConfig.publicEmail)} | Phone: ${escapeHtml(siteConfig.publicPhone)} | Schedule: ${escapeHtml(siteConfig.schedulingUrl)}</p>
      </main>
    `;
  }
  if (p === "/contact" || p === "/fr/contact") {
    return `
      <main style="max-width:800px;margin:2rem auto;padding:1rem;font-family:serif;">
        <h1>${escapeHtml(core?.heading || "Start a Conversation with Ahmed Bello")}</h1>
        <p>${escapeHtml(core?.summary || "Ask a question about your Canadian mortgage renewal, registered accounts (TFSA, RRSP, FHSA), income protection, or newcomer finances with clear, plain-language explanations.")}</p>
        <ul>
          <li><strong>Email:</strong> ${escapeHtml(siteConfig.publicEmail)}</li>
          <li><strong>Direct Telephone:</strong> ${escapeHtml(siteConfig.publicPhone)}</li>
          <li><strong>Schedule:</strong> <a href="${escapeAttr(siteConfig.schedulingUrl)}">${escapeHtml(siteConfig.ctaLabelEn)}</a></li>
          <li><strong>Location:</strong> Dieppe, NB, Canada</li>
        </ul>
      </main>
    `;
  }
  if (p === "/what-changed" || p === "/fr/what-changed") {
    return `
      <main style="max-width:800px;margin:2rem auto;padding:1rem;font-family:serif;">
        <h1>${escapeHtml(core?.heading || "2026 Canadian Money Rules & Official Updates")}</h1>
        <p>${escapeHtml(core?.summary || "Monthly Canadian financial briefing by Ahmed Bello: Bank of Canada policy rates, OSFI Guideline B-20 uninsured mortgage straight-switch rules, CRA registered limits, and Federal Budget 2026 updates.")}</p>
        ${RULE_CHANGES.map(
          (item) => `
          <article>
            <h2>${escapeHtml(isFr ? item.titleFr : item.titleEn)}</h2>
            <p>${escapeHtml(isFr ? item.summaryFr : item.summaryEn)}</p>
            <p><strong>${isFr ? "Impact :" : "Practical Impact:"}</strong> ${escapeHtml(isFr ? item.ahmedAnalysisFr : item.ahmedAnalysisEn)}</p>
            <p><a href="${escapeAttr(item.officialSource.url)}">${escapeHtml(item.officialSource.label)}</a></p>
          </article>`
        ).join("")}
      </main>
    `;
  }
  if (p === "/costly-blindspots" || p === "/fr/costly-blindspots") {
    return `
      <main style="max-width:800px;margin:2rem auto;padding:1rem;font-family:serif;">
        <h1>${escapeHtml(core?.heading || "Costly Canadian Money Blindspots")}</h1>
        <p>${escapeHtml(core?.summary || "A compendium of verified Canadian financial rules, overlooked government grants, and tax mechanisms covering the Canada Learning Bond, CMHC Eco Plus refunds, FHSA clocks, RRSP deferral, and retirement timing.")}</p>
        <p>Ahmed Bello, Licensed Financial Solutions Professional | Dieppe, New Brunswick | Independent Practice.</p>
      </main>
    `;
  }
  return "";
}

const app = express();
const isProduction = process.env.NODE_ENV === "production";

function resolveArgValue(flag: string): string | undefined {
  const eqArg = process.argv.find((arg) => arg.startsWith(`${flag}=`));
  if (eqArg) return eqArg.slice(flag.length + 1);
  const idx = process.argv.indexOf(flag);
  if (idx !== -1 && process.argv[idx + 1]) return process.argv[idx + 1];
  return undefined;
}

const cliPortRaw = resolveArgValue("--port");
const cliPort = cliPortRaw ? Number(cliPortRaw) : undefined;
const envPort = process.env.PORT ? Number(process.env.PORT) : undefined;
const PORT =
  cliPort && Number.isFinite(cliPort)
    ? cliPort
    : !isProduction && (!envPort || envPort === 8080)
    ? 3000
    : envPort && Number.isFinite(envPort)
    ? envPort
    : 3000;
const HOST = resolveArgValue("--host") || "0.0.0.0";

// Enable reverse-proxy trust for accurate IP resolution in Cloud Run / hosting environments
app.set("trust proxy", 1);

// Disable fingerprinting header
app.disable("x-powered-by");

// --------------------------------------------------------------------------
// 1. Enterprise Security Headers Middleware
// --------------------------------------------------------------------------
app.use((req: Request, res: Response, next: NextFunction) => {
  const isIntakeHost = req.hostname?.toLowerCase() === "intake.ahmedbello.com";
  const isPrivateRoute =
    req.path === "/sign" ||
    req.path === "/fr/sign" ||
    req.path === "/client-signature" ||
    req.path === "/fr/client-signature" ||
    req.path === "/confirm-subscription" ||
    req.path === "/fr/confirm-subscription";

  let cspDirectives: string;
  if (isProduction) {
    if (isIntakeHost || isPrivateRoute) {
      cspDirectives = [
        "default-src 'self'",
        "script-src 'self'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: blob:",
        "font-src 'self' data:",
        "connect-src 'self'",
        "worker-src 'self' blob:",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'",
      ].join("; ");
    } else {
      cspDirectives = [
        "default-src 'self'",
        "script-src 'self' https://challenges.cloudflare.com",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: blob:",
        "font-src 'self' data:",
        "connect-src 'self' https://challenges.cloudflare.com",
        "frame-src https://challenges.cloudflare.com",
        "worker-src 'self' blob:",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'",
      ].join("; ");
    }
    res.setHeader("X-Frame-Options", "DENY");
  } else {
    // Development / AI Studio preview iframe requires Vite HMR + parent framing
    cspDirectives = [
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
  }

  res.setHeader("Content-Security-Policy", cspDirectives);
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader(
    "Referrer-Policy",
    isIntakeHost || isPrivateRoute ? "no-referrer" : "strict-origin-when-cross-origin"
  );
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=()"
  );
  if (isIntakeHost || isPrivateRoute) {
    res.setHeader("X-Robots-Tag", "noindex, nofollow, noarchive");
  }

  if (isProduction || req.secure || req.headers["x-forwarded-proto"] === "https") {
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload"
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

// Input validation, sanitization, and rate-limiting are unified in contactEmailService.ts & apiHandlers.ts


// --------------------------------------------------------------------------
// 4. Live Launch Robots.txt & Dynamic High-Value Sitemap.xml
// --------------------------------------------------------------------------
app.get("/robots.txt", (req: Request, res: Response) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "public, max-age=86400");
  res.type("text/plain; charset=utf-8");

  if (req.hostname?.toLowerCase() === "intake.ahmedbello.com" || DRAFT_MODE) {
    return res.send("User-agent: *\nDisallow: /\n");
  }

  const diskPath = path.resolve(process.cwd(), "public", "robots.txt");
  if (fs.existsSync(diskPath)) {
    return res.sendFile(diskPath);
  }

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
  const origin = req.headers["origin"] as string | undefined;
  res.setHeader("Vary", "Origin");
  if (origin && isOriginAuthorized(origin, req.get("host"))) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    res.setHeader("Access-Control-Max-Age", "86400");
  }
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
app.get("/api/confirm-subscription", handleConfirmSubscription);
app.post("/api/confirm-subscription", handleConfirmSubscription);
app.options("/api/confirm-subscription", handleConfirmSubscription);
app.all("/api/confirm-subscription", (_req: Request, res: Response) => {
  res.setHeader("Allow", "GET, POST, OPTIONS");
  return res.status(405).json({ success: false, error: "method_not_allowed" });
});

// Prevent Express HTML fallback from ever being served for /_vercel/* analytics paths
app.get("/_vercel/*", (_req: Request, res: Response) => {
  res.status(204).type("application/javascript; charset=utf-8").end();
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
  ogImage: string;
  lang: "en-CA" | "fr-CA";
  noIndex: boolean;
  robotsDirective?: string;
  hasFrenchAlternate: boolean;
  isNotFound?: boolean;
  articlePublishedTime?: string;
  articleModifiedTime?: string;
  jsonLd: Record<string, any>;
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
      const ogImage = getOgImageForPath(articlePath, siteConfig.siteUrl);
      const frTranslated = isFrenchArticleTranslated(slug);
      const noIndex = isFrench && !frTranslated;

      return {
        title,
        description,
        ogType: "article",
        url: canonicalUrl,
        enUrl,
        frUrl,
        ogImage,
        lang,
        noIndex,
        robotsDirective: noIndex ? "noindex, follow" : undefined,
        hasFrenchAlternate: hasTranslatedFrenchAlternate(articlePath),
        articlePublishedTime: article.datePublished || "2025-01-15T08:00:00-05:00",
        articleModifiedTime: article.dateModified || "2026-11-25T09:00:00-05:00",
        jsonLd: buildRouteJsonLd({
          pathname: articlePath,
          title,
          description,
          heading: headline,
          isFr: isFrench,
          noIndex,
          article,
        }),
      };
    }
  }

  // 2. Core Canonical Routes (EN & FR) from unified seoMetadata.ts
  const coreSeo = getCoreRouteSeo(cleanPath);
  if (coreSeo) {
    const { enUrl, frUrl, canonicalUrl } = getLanguageUrls(cleanPath);
    const ogImage = getOgImageForPath(cleanPath, siteConfig.siteUrl);
    const isFrCore = coreSeo.lang === "fr-CA";
    const collectionItems =
      cleanPath === "/education" || cleanPath === "/fr/education"
        ? articles
            .filter((a) => a.kind === "guide")
            .map((a) => ({
              name: isFrCore ? ARTICLE_FR_SEO[a.slug]?.title || a.title : a.title,
              url: `${isFrCore ? "/fr" : ""}${a.url}`,
            }))
        : cleanPath === "/insights" || cleanPath === "/fr/insights"
        ? articles
            .filter((a) => a.kind === "insight")
            .map((a) => ({
              name: isFrCore ? ARTICLE_FR_SEO[a.slug]?.title || a.title : a.title,
              url: `${isFrCore ? "/fr" : ""}${a.url}`,
            }))
        : cleanPath === "/costly-blindspots" || cleanPath === "/fr/costly-blindspots"
        ? BLINDSPOTS_DATA.map((item) => ({
            name: isFrCore ? item.titleFr : item.titleEn,
            description: isFrCore ? item.summaryFr : item.summaryEn,
            url: `${isFrCore ? "/fr" : ""}/costly-blindspots#${item.id}`,
          }))
        : undefined;

    return {
      title: formatStrictTitle(coreSeo.title),
      description: coreSeo.description,
      ogType: coreSeo.ogType || "website",
      url: canonicalUrl,
      enUrl,
      frUrl,
      ogImage,
      lang: coreSeo.lang,
      noIndex: Boolean(coreSeo.noIndex),
      hasFrenchAlternate: hasTranslatedFrenchAlternate(cleanPath),
      jsonLd: buildRouteJsonLd({
        pathname: cleanPath,
        title: formatStrictTitle(coreSeo.title),
        description: coreSeo.description,
        heading: coreSeo.heading,
        isFr: isFrCore,
        noIndex: Boolean(coreSeo.noIndex),
        collectionItems,
      }),
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
    ogImage: `${siteConfig.siteUrl}/brand/og-home.png`,
    lang,
    noIndex: true,
    hasFrenchAlternate: false,
    isNotFound: true,
    jsonLd: buildRouteJsonLd({
      pathname: cleanPath,
      noIndex: true,
      isFr: isFrench,
    }),
  };
}

// --------------------------------------------------------------------------
// 7. Server-Side Head Injection Helper (No Duplicate Meta Tags)
// --------------------------------------------------------------------------
function injectHeadMetadata(html: string, pathname: string): string {
  const meta = getRouteMetadata(pathname);
  const robotsValue = DRAFT_MODE
    ? "noindex, nofollow"
    : meta.robotsDirective
    ? meta.robotsDirective
    : meta.noIndex
    ? "noindex, nofollow, noarchive"
    : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

  const canonicalAndHreflang = meta.hasFrenchAlternate
    ? `<link rel="canonical" href="${escapeAttr(meta.url)}" />\n    <link rel="alternate" hreflang="en-CA" href="${escapeAttr(meta.enUrl)}" />\n    <link rel="alternate" hreflang="fr-CA" href="${escapeAttr(meta.frUrl)}" />\n    <link rel="alternate" hreflang="x-default" href="${escapeAttr(meta.enUrl)}" />`
    : `<link rel="canonical" href="${escapeAttr(meta.url)}" />\n    <link rel="alternate" hreflang="en-CA" href="${escapeAttr(meta.enUrl)}" />\n    <link rel="alternate" hreflang="x-default" href="${escapeAttr(meta.enUrl)}" />`;

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
    canonicalAndHreflang
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
  if (meta.lang === "fr-CA" || meta.hasFrenchAlternate) {
    transformed = transformed.replace(
      /<meta\s+property="og:locale:alternate"\s+content="[\s\S]*?"\s*\/?>/i,
      `<meta property="og:locale:alternate" content="${meta.lang === "fr-CA" ? "en_CA" : "fr_CA"}" />`
    );
  } else {
    transformed = transformed.replace(/<meta\s+property="og:locale:alternate"\s+content="[\s\S]*?"\s*\/?>\n?\s*/i, "");
  }
  transformed = transformed.replace(
    /<meta\s+property="og:image"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta property="og:image" content="${escapeAttr(meta.ogImage)}" />`
  );
  transformed = transformed.replace(
    /<meta\s+property="og:image:secure_url"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta property="og:image:secure_url" content="${escapeAttr(meta.ogImage)}" />`
  );
  transformed = transformed.replace(
    /<meta\s+property="og:image:alt"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta property="og:image:alt" content="${escapeAttr(meta.title)}" />`
  );
  transformed = transformed.replace(
    /<meta\s+name="twitter:title"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta name="twitter:title" content="${escapeAttr(meta.title)}" />`
  );
  transformed = transformed.replace(
    /<meta\s+name="twitter:description"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta name="twitter:description" content="${escapeAttr(meta.description)}" />`
  );
  transformed = transformed.replace(
    /<meta\s+name="twitter:image"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta name="twitter:image" content="${escapeAttr(meta.ogImage)}" />`
  );
  transformed = transformed.replace(
    /<meta\s+name="twitter:image:alt"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta name="twitter:image:alt" content="${escapeAttr(meta.title)}" />`
  );

  // Remove base template JSON-LD so each route serves a single unified @graph script
  transformed = transformed.replace(/<script\s+type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/gi, "");

  let extraTags = "";
  if (meta.articlePublishedTime) {
    extraTags += `\n    <meta property="article:published_time" content="${escapeAttr(meta.articlePublishedTime)}" />`;
  }
  if (meta.articleModifiedTime) {
    extraTags += `\n    <meta property="article:modified_time" content="${escapeAttr(meta.articleModifiedTime)}" />`;
  }
  extraTags += `\n    <script type="application/ld+json" data-prerender-jsonld="true">${escapeJsonLd(meta.jsonLd)}</script>`;

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
    let viteInstance: any = null;
    const viteReady = (async () => {
      const { createServer: createViteServer } = await import("vite");
      viteInstance = await createViteServer({
        server: { middlewareMode: true },
        appType: "custom",
      });
      return viteInstance;
    })();

    viteReady.catch((err) => {
      console.error("[Vite Dev Server Init Error]:", err);
    });

    app.use(async (req: Request, res: Response, next: NextFunction) => {
      try {
        const vite = viteInstance || (await viteReady);
        return vite.middlewares(req, res, next);
      } catch (e) {
        next(e);
      }
    });

    app.use("*", async (req: Request, res: Response, next: NextFunction) => {
      const url = req.originalUrl;
      let vite: any = null;
      try {
        vite = viteInstance || (await viteReady);
        let template = fs.readFileSync(path.resolve(process.cwd(), "index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);
        const meta = getRouteMetadata(url);
        const html = injectHeadMetadata(template, url);
        const statusCode = meta.isNotFound ? 404 : 200;
        res.status(statusCode).set({ "Content-Type": "text/html" }).end(html);
      } catch (e: any) {
        if (vite) vite.ssrFixStacktrace(e);
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
      } catch {
        res.status(500).send("Unable to load page.");
      }
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(`Ahmed Bello server running on http://${HOST}:${PORT}`);
  });
}

setupServer();
