import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { articles } from "../src/content/data.ts";
import {
  SITE_URL,
  getAllIndexableCoreRoutes,
  getBasePath,
  getLanguageUrls,
  isFrenchArticleTranslated,
} from "../src/config/seoMetadata.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sitemapPath = path.resolve(__dirname, "../public/sitemap.xml");

const CORE_ROUTE_LASTMOD = {
  "/": "2026-11-25",
  "/what-changed": "2026-11-25",
  "/how-i-help": "2026-11-05",
  "/education": "2026-11-24",
  "/costly-blindspots": "2026-11-25",
  "/insights": "2026-11-05",
  "/for/healthcare": "2026-11-05",
  "/for/business-owners": "2026-11-24",
  "/for/families": "2026-11-20",
  "/for/newcomers": "2026-11-24",
  "/calculators": "2026-11-24",
  "/calculators/amt": "2026-11-05",
  "/investing/islamic-equity": "2026-11-05",
  "/atlantic-canada": "2026-11-18",
  "/about": "2026-11-05",
  "/careers": "2026-11-05",
  "/contact": "2026-11-05",
  "/disclosures": "2026-10-15",
  "/standards": "2026-10-15",
  "/privacy": "2026-10-15",
  "/terms": "2026-10-15",
};

const coreRoutes = getAllIndexableCoreRoutes();

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

// Add all indexable English & French Core Routes from seoMetadata.ts
for (const r of coreRoutes) {
  const { enUrl, frUrl, canonicalUrl } = getLanguageUrls(r.path);
  const basePath = r.basePath || getBasePath(r.path);
  const lastmod = CORE_ROUTE_LASTMOD[basePath] || "2026-11-05";

  xml += `  <url>
    <loc>${canonicalUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${r.changefreq || "monthly"}</changefreq>
    <priority>${r.priority || "0.80"}</priority>
    <xhtml:link rel="alternate" hreflang="en-CA" href="${enUrl}"/>
    <xhtml:link rel="alternate" hreflang="fr-CA" href="${frUrl}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${enUrl}"/>
  </url>
`;
}

// Add active Articles & Strategic Insights (include FR URL + hreflang only when body is translated)
let articleUrlCount = 0;
for (const a of articles) {
  const enPath = a.url;
  const frPath = `/fr${a.url}`;
  const enUrl = `${SITE_URL}${enPath}`;
  const frUrl = `${SITE_URL}${frPath}`;
  const prio = a.kind === "guide" ? "0.85" : "0.80";
  const lastmod = (a.dateModified || "2026-11-05").split("T")[0];
  const hasFrTranslation = isFrenchArticleTranslated(a.slug);

  xml += `  <url>
    <loc>${enUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${prio}</priority>
    <xhtml:link rel="alternate" hreflang="en-CA" href="${enUrl}"/>
${hasFrTranslation ? `    <xhtml:link rel="alternate" hreflang="fr-CA" href="${frUrl}"/>\n` : ""}    <xhtml:link rel="alternate" hreflang="x-default" href="${enUrl}"/>
  </url>
`;
  articleUrlCount++;

  if (hasFrTranslation) {
    xml += `  <url>
    <loc>${frUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${(parseFloat(prio) * 0.95).toFixed(2)}</priority>
    <xhtml:link rel="alternate" hreflang="en-CA" href="${enUrl}"/>
    <xhtml:link rel="alternate" hreflang="fr-CA" href="${frUrl}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${enUrl}"/>
  </url>
`;
    articleUrlCount++;
  }
}

xml += `</urlset>\n`;

fs.writeFileSync(sitemapPath, xml, "utf-8");
console.log(
  `[Sitemap Generated] Wrote ${coreRoutes.length + articleUrlCount} clean URLs with genuine lastmod timestamps to ${sitemapPath}`
);
