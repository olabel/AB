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

  if (isProduction || req.secure || req.headers["x-forwarded-proto"] === "https") {
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    );
  }

  next();
});

// Reject bodies over 10 KB to prevent DoS payloads
app.use(express.json({ limit: "10kb" }));

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
  res.type("text/plain");
  if (DRAFT_MODE) {
    res.send("User-agent: *\nDisallow: /\n");
  } else {
    res.send(
      `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${siteConfig.siteUrl}/sitemap.xml\n`
    );
  }
});

app.get("/sitemap.xml", (_req: Request, res: Response) => {
  res.type("application/xml");
  const routes = [
    { loc: "", priority: "1.0", changefreq: "weekly" },
    { loc: "/how-i-help", priority: "0.9", changefreq: "monthly" },
    { loc: "/education", priority: "0.9", changefreq: "weekly" },
    ...articles.map((a) => ({
      loc: a.url,
      priority: a.kind === "guide" ? "0.85" : "0.8",
      changefreq: "monthly",
    })),
    { loc: "/insights", priority: "0.8", changefreq: "monthly" },
    { loc: "/about", priority: "0.75", changefreq: "monthly" },
    { loc: "/contact", priority: "0.8", changefreq: "monthly" },
    { loc: "/disclosures", priority: "0.5", changefreq: "quarterly" },
    { loc: "/standards", priority: "0.6", changefreq: "quarterly" },
    { loc: "/privacy", priority: "0.4", changefreq: "yearly" },
    { loc: "/terms", priority: "0.4", changefreq: "yearly" },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${routes
  .map(
    (r) => `  <url>
    <loc>${siteConfig.siteUrl}${r.loc}</loc>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;
  res.send(xml);
});

// --------------------------------------------------------------------------
// 5. Hardened Contact API Endpoint: POST /api/contact
// --------------------------------------------------------------------------
app.post("/api/contact", async (req: Request, res: Response) => {
  const forwarded = req.headers["x-forwarded-for"];
  const clientIp = typeof forwarded === "string" ? forwarded.split(",")[0].trim() : req.socket.remoteAddress || "unknown";

  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({
      error: "rate_limit_exceeded",
      message: "Too many requests. Please try again in an hour.",
    });
  }

  const rawBody = req.body || {};
  const firstName = sanitizeText(rawBody.firstName);
  const email = sanitizeText(rawBody.email);
  const phone = sanitizeText(rawBody.phone);
  const province = sanitizeText(rawBody.province);
  const topic = sanitizeText(rawBody.topic);
  const message = sanitizeMultiline(rawBody.message);
  const consentPrivacy = Boolean(rawBody.consentPrivacy);
  const consentEducational = Boolean(rawBody.consentEducational);
  const honeypot = sanitizeText(rawBody.honeypot);
  const formLoadedAt = Number(rawBody.formLoadedAt);

  // Honeypot check: silently drop bots
  if (honeypot && honeypot.length > 0) {
    return res.status(200).json({ success: true, notice: "processed" });
  }

  // Minimum fill time check (3 seconds)
  if (formLoadedAt && !isNaN(formLoadedAt)) {
    const elapsed = Date.now() - formLoadedAt;
    if (elapsed < 3000) {
      return res.status(400).json({
        error: "automated_submission",
        message: "Submission was too fast. Please take your time to review.",
      });
    }
  }

  // Strict field validation
  const errors: Record<string, string> = {};

  if (!firstName || firstName.length === 0) {
    errors.firstName = "First name is required.";
  } else if (firstName.length > 60) {
    errors.firstName = "First name must be 60 characters or fewer.";
  } else if (!/^[A-Za-zÀ-ÿ\s'-]+$/.test(firstName)) {
    errors.firstName = "First name contains invalid characters.";
  }

  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!email || !emailRegex.test(email) || email.length > 100) {
    errors.email = "A valid email address is required (under 100 characters).";
  }

  if (phone && (!/^[0-9+\-()\s]{7,25}$/.test(phone) || phone.length > 25)) {
    errors.phone = "Invalid phone number format.";
  }

  const validProvinces = [
    "Alberta",
    "British Columbia",
    "Manitoba",
    "New Brunswick",
    "Newfoundland and Labrador",
    "Northwest Territories",
    "Nova Scotia",
    "Nunavut",
    "Ontario",
    "Prince Edward Island",
    "Quebec",
    "Saskatchewan",
    "Yukon",
  ];
  if (!province || !validProvinces.includes(province)) {
    errors.province = "Please select a valid Canadian province or territory.";
  }

  const validTopics = [
    "general",
    "accounts",
    "investing",
    "protection",
    "family",
    "retirement",
    "newcomer",
    "other",
  ];
  if (!topic || !validTopics.includes(topic)) {
    errors.topic = "Please select a valid financial topic.";
  }

  if (message.length > 1500) {
    errors.message = "Message must not exceed 1,500 characters.";
  }

  if (!consentPrivacy) {
    errors.consentPrivacy = "You must agree to the privacy notice before submitting.";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ error: "validation_failed", errors });
  }

  // Secrets verification
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL || "olabel@gmail.com, abello24trdc@wfgmail.ca";
  const CONTACT_FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || siteConfig.defaultFromEmail;

  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL) {
    return res.status(503).json({
      code: "not_configured",
      message: "Not sent. This form isn’t connected to an inbox yet.",
    });
  }

  const emailBody = `New Canadian Financial Education Enquiry

From: ${firstName}
Email: ${email}
Phone: ${phone || "Not provided"}
Province/Territory: ${province}
Main Topic: ${topic}
Educational Newsletter Opt-in: ${consentEducational ? "Yes" : "No"}

Message:
${message || "No message text provided."}

--
Enquiry received at ${new Date().toISOString()}
Origin: ${siteConfig.siteUrl}/contact`;

  const rawRecipients = CONTACT_TO_EMAIL.split(/[,;\s]+/)
    .map((e) => e.trim())
    .filter((e) => e.includes("@"));
  const primaryRecipient = rawRecipients[0] || "olabel@gmail.com";

  try {
    // Attempt sending to all configured recipients
    let resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: CONTACT_FROM_EMAIL,
        to: rawRecipients,
        reply_to: email,
        subject: `Financial Enquiry: ${topic} (${firstName})`,
        text: emailBody,
      }),
    });

    // If Resend limits unverified sandbox domains to the account owner, fallback to primary recipient
    if (!resendResponse.ok && rawRecipients.length > 1) {
      const errData = await resendResponse.clone().json().catch(() => ({}));
      if (
        resendResponse.status === 403 ||
        (typeof errData.message === "string" && errData.message.includes("testing emails"))
      ) {
        console.warn(
          "[Resend Notice] Multi-recipient restricted on sandbox domain. Retrying with primary account owner:",
          primaryRecipient
        );
        resendResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: CONTACT_FROM_EMAIL,
            to: [primaryRecipient],
            reply_to: email,
            subject: `Financial Enquiry: ${topic} (${firstName}) [For Ahmed & Team]`,
            text: `${emailBody}\n\nNote: Sent to primary owner while domain verification is pending in Resend.`,
          }),
        });
      }
    }

    if (!resendResponse.ok) {
      const errData = await resendResponse.json().catch(() => ({}));
      console.error(
        `[Contact Delivery Error] Status: ${resendResponse.status}, ErrorMsg: ${errData.message || "Unknown error"}`
      );
      return res.status(502).json({
        error: "delivery_failed",
        message: errData.message || "Failed to deliver email enquiry. Please try again later.",
      });
    }

    return res.status(200).json({ success: true, message: "Enquiry sent successfully." });
  } catch (err: any) {
    console.error(`[Contact Exception] Status: 500, ErrorName: ${err?.name || "NetworkError"}`);
    return res.status(500).json({
      error: "server_error",
      message: "An internal error occurred. Please try again later.",
    });
  }
});

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
  logo: `${siteConfig.siteUrl}/brand/icon-512.png`,
  image: `${siteConfig.siteUrl}/brand/icon-512.png`,
  description:
    "Independent Canadian financial education on registered accounts (TFSA, RRSP, FHSA, RESP), household income protection, debt-versus-savings frameworks, and retirement public pensions.",
  priceRange: "$$",
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
    "Canadian Licensed Financial Solutions Professional helping Canadians connect income, savings, protection, and retirement decisions.",
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
  description: "Canadian financial education, registered accounts, protection, and retirement guidance.",
  publisher: {
    "@id": `${siteConfig.siteUrl}/#person`,
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${siteConfig.siteUrl}/education?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

const howIHelpFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: howIHelpTopics.map((topic) => ({
    "@type": "Question",
    name: topic.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: `${topic.why} Key concepts include: ${topic.concepts.map((c) => `${c.term}: ${c.plain}`).join("; ")}. Trade-offs: ${topic.tradeoffs.join(" ")}`,
    },
  })),
};

function getRouteMetadata(pathname: string): RouteMeta {
  const cleanPath = pathname.replace(/\/+$/, "") || "/";

  // Article pages (/education/:slug or /insights/:slug)
  const articleMatch = cleanPath.match(/^\/(?:education|insights)\/([^/]+)$/);
  if (articleMatch) {
    const slug = articleMatch[1];
    const article = articles.find((a) => a.slug === slug);
    if (article) {
      const titleCandidate = `${article.seoTitle || article.title} | Ahmed Bello`;
      const title = titleCandidate.length > 65 ? `${titleCandidate.slice(0, 62)}...` : titleCandidate;

      return {
        title,
        description: article.description,
        ogType: "article",
        url: `${siteConfig.siteUrl}${article.url}`,
        jsonLd: [
          siteWideWebSite,
          siteWidePerson,
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: article.seoTitle || article.title,
            description: article.description,
            isAccessibleForFree: true,
            inLanguage: "en-CA",
            author: siteWidePerson,
            publisher: siteWideFinancialService,
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `${siteConfig.siteUrl}${article.url}`,
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
                name: "Home",
                item: siteConfig.siteUrl,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: article.kind === "guide" ? "Financial Education" : "Insights",
                item: `${siteConfig.siteUrl}/${article.kind === "guide" ? "education" : "insights"}`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: article.title,
                item: `${siteConfig.siteUrl}${article.url}`,
              },
            ],
          },
        ],
      };
    }
  }

  switch (cleanPath) {
    case "/how-i-help":
      return {
        title: "How I Help | Canadian Financial Guidance | Ahmed Bello",
        description:
          "Seven question-led financial areas: cash flow, registered accounts, income protection, investing, education savings, retirement, and newcomers.",
        ogType: "website",
        url: `${siteConfig.siteUrl}/how-i-help`,
        jsonLd: [
          siteWideWebSite,
          siteWideFinancialService,
          howIHelpFaqSchema,
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.siteUrl },
              { "@type": "ListItem", position: 2, name: "How I Help", item: `${siteConfig.siteUrl}/how-i-help` },
            ],
          },
        ],
      };

    case "/education":
      return {
        title: "Financial Education Library | Canadian Money Rules | Ahmed Bello",
        description:
          "Plain-language explainers on Canadian registered accounts (TFSA, RRSP, FHSA, RESP), risk, debt, protection, and retirement with official sources.",
        ogType: "website",
        url: `${siteConfig.siteUrl}/education`,
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

    case "/about":
      return {
        title: "About Ahmed Bello | Licensed Financial Solutions Professional",
        description:
          "Independent Canadian financial educator helping Canadians understand how their income, savings, protection, and retirement decisions connect.",
        ogType: "profile",
        url: `${siteConfig.siteUrl}/about`,
        jsonLd: [
          siteWideWebSite,
          siteWidePerson,
          siteWideFinancialService,
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.siteUrl },
              { "@type": "ListItem", position: 2, name: "About Ahmed", item: `${siteConfig.siteUrl}/about` },
            ],
          },
        ],
      };

    case "/contact":
      return {
        title: "Start a Conversation | Financial Guidance | Ahmed Bello",
        description:
          "Ask a financial question regarding Canadian registered accounts, income protection, retirement, or newcomer finances without sales pressure.",
        ogType: "website",
        url: `${siteConfig.siteUrl}/contact`,
        jsonLd: [
          siteWideWebSite,
          siteWideFinancialService,
          {
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: "Start a Conversation | Ahmed Bello",
            url: `${siteConfig.siteUrl}/contact`,
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
              { "@type": "ListItem", position: 2, name: "Contact", item: `${siteConfig.siteUrl}/contact` },
            ],
          },
        ],
      };

    case "/disclosures":
      return {
        title: "Disclosures & Regulatory Scope | Ahmed Bello",
        description:
          "Plain-language disclosures on licensing, professional scope, compensation, education vs advice boundaries, and regulatory transparency.",
        ogType: "website",
        url: `${siteConfig.siteUrl}/disclosures`,
        jsonLd: [
          siteWideWebSite,
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Disclosures & Regulatory Transparency",
            url: `${siteConfig.siteUrl}/disclosures`,
          },
        ],
      };

    case "/standards":
      return {
        title: "Editorial Standards & Official Sources | Ahmed Bello",
        description:
          "How financial guides on this site are researched, verified against official Canadian government sources, dated, and reviewed.",
        ogType: "website",
        url: `${siteConfig.siteUrl}/standards`,
        jsonLd: [
          siteWideWebSite,
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Editorial Standards & Sources",
            url: `${siteConfig.siteUrl}/standards`,
          },
        ],
      };

    case "/privacy":
      return {
        title: "Privacy Notice & Data Protection | Ahmed Bello",
        description:
          "How personal information from enquiries is handled, protected, and kept private under Canadian privacy principles and CASL.",
        ogType: "website",
        url: `${siteConfig.siteUrl}/privacy`,
        jsonLd: [
          siteWideWebSite,
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Privacy Notice",
            url: `${siteConfig.siteUrl}/privacy`,
          },
        ],
      };

    case "/terms":
      return {
        title: "Website Terms of Use | Ahmed Bello",
        description:
          "Terms and ground rules for using this Canadian financial education website, intellectual property, and limitations of liability.",
        ogType: "website",
        url: `${siteConfig.siteUrl}/terms`,
        jsonLd: [
          siteWideWebSite,
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Website Terms of Use",
            url: `${siteConfig.siteUrl}/terms`,
          },
        ],
      };

    default:
      // Home page
      return {
        title: "Ahmed Bello | Licensed Financial Solutions Professional",
        description:
          "Canadian financial education, registered accounts, protection, and retirement guidance. Connect your money decisions with intention.",
        ogType: "website",
        url: siteConfig.siteUrl,
        jsonLd: [
          siteWideWebSite,
          siteWideFinancialService,
          siteWidePerson,
          howIHelpFaqSchema,
        ],
      };
  }
}

// --------------------------------------------------------------------------
// 7. Server-Side Head Injection Helper
// --------------------------------------------------------------------------
function injectHeadMetadata(html: string, pathname: string): string {
  const meta = getRouteMetadata(pathname);

  // Replace <title>
  let transformed = html.replace(
    /<title>.*?<\/title>/i,
    `<title>${meta.title}</title>`
  );

  // Replace or inject meta description
  transformed = transformed.replace(
    /<meta name="description" content=".*?" \/>/i,
    `<meta name="description" content="${meta.description}" />`
  );

  // Replace canonical
  transformed = transformed.replace(
    /<link rel="canonical" href=".*?" \/>/i,
    `<link rel="canonical" href="${meta.url}" />`
  );

  // Replace og:title
  transformed = transformed.replace(
    /<meta property="og:title" content=".*?" \/>/i,
    `<meta property="og:title" content="${meta.title}" />`
  );

  // Replace og:description
  transformed = transformed.replace(
    /<meta property="og:description" content=".*?" \/>/i,
    `<meta property="og:description" content="${meta.description}" />`
  );

  // Replace og:url
  transformed = transformed.replace(
    /<meta property="og:url" content=".*?" \/>/i,
    `<meta property="og:url" content="${meta.url}" />`
  );

  // Replace og:type
  transformed = transformed.replace(
    /<meta property="og:type" content=".*?" \/>/i,
    `<meta property="og:type" content="${meta.ogType}" />`
  );

  // Replace twitter:title
  transformed = transformed.replace(
    /<meta name="twitter:title" content=".*?" \/>/i,
    `<meta name="twitter:title" content="${meta.title}" />`
  );

  // Replace twitter:description
  transformed = transformed.replace(
    /<meta name="twitter:description" content=".*?" \/>/i,
    `<meta name="twitter:description" content="${meta.description}" />`
  );

  // Robots meta tag: Indexing enabled when DRAFT_MODE is false
  let extraTags = "";
  if (DRAFT_MODE) {
    extraTags += `\n    <meta name="robots" content="noindex, nofollow" />`;
  } else {
    extraTags += `\n    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />`;
    extraTags += `\n    <meta property="og:locale" content="en_CA" />`;
    extraTags += `\n    <meta property="og:image" content="${siteConfig.siteUrl}/brand/icon-512.png" />`;
    extraTags += `\n    <meta name="twitter:image" content="${siteConfig.siteUrl}/brand/icon-512.png" />`;
  }

  // Inject Rich JSON-LD Schemas
  meta.jsonLd.forEach((schema) => {
    extraTags += `\n    <script type="application/ld+json">${JSON.stringify(schema)}</script>`;
  });

  transformed = transformed.replace("</head>", `${extraTags}\n  </head>`);

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
        const html = injectHeadMetadata(template, url);
        res.status(200).set({ "Content-Type": "text/html" }).end(html);
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
          const html = injectHeadMetadata(template, url);
          res.status(200).set({ "Content-Type": "text/html" }).end(html);
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
