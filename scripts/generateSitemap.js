import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { articles } from "../src/content/data.ts";
import {
  SITE_URL,
  getAllIndexableCoreRoutes,
  getLanguageUrls,
} from "../src/config/seoMetadata.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sitemapPath = path.resolve(__dirname, "../public/sitemap.xml");

const currentDate = new Date().toISOString().split("T")[0];
const coreRoutes = getAllIndexableCoreRoutes();

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

// Add all indexable English & French Core Routes from seoMetadata.ts
for (const r of coreRoutes) {
  const { enUrl, frUrl, canonicalUrl } = getLanguageUrls(r.path);
  xml += `  <url>
    <loc>${canonicalUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${r.changefreq || "monthly"}</changefreq>
    <priority>${r.priority || "0.80"}</priority>
    <xhtml:link rel="alternate" hreflang="en-CA" href="${enUrl}"/>
    <xhtml:link rel="alternate" hreflang="fr-CA" href="${frUrl}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${enUrl}"/>
  </url>
`;
}

// Add all active Articles & Strategic Insights in EN and FR
for (const a of articles) {
  const enPath = a.url;
  const frPath = `/fr${a.url}`;
  const enUrl = `${SITE_URL}${enPath}`;
  const frUrl = `${SITE_URL}${frPath}`;
  const prio = a.kind === "guide" ? "0.85" : "0.80";

  xml += `  <url>
    <loc>${enUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${prio}</priority>
    <xhtml:link rel="alternate" hreflang="en-CA" href="${enUrl}"/>
    <xhtml:link rel="alternate" hreflang="fr-CA" href="${frUrl}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${enUrl}"/>
  </url>
`;
  xml += `  <url>
    <loc>${frUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${(parseFloat(prio) * 0.95).toFixed(2)}</priority>
    <xhtml:link rel="alternate" hreflang="en-CA" href="${enUrl}"/>
    <xhtml:link rel="alternate" hreflang="fr-CA" href="${frUrl}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${enUrl}"/>
  </url>
`;
}

xml += `</urlset>\n`;

fs.writeFileSync(sitemapPath, xml, "utf-8");
console.log(
  `[Sitemap Generated] Wrote ${coreRoutes.length + articles.length * 2} URLs to ${sitemapPath}`
);
