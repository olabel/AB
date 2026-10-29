import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { articles } from "../src/content/data.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sitemapPath = path.resolve(__dirname, "../public/sitemap.xml");

const baseUrl = "https://www.ahmedbello.com";
const currentDate = new Date().toISOString().split("T")[0];

const coreRoutes = [
  { path: "", priority: "1.0", changefreq: "weekly" },
  { path: "/how-i-help", priority: "0.9", changefreq: "monthly" },
  { path: "/education", priority: "0.9", changefreq: "weekly" },
  { path: "/news", priority: "0.9", changefreq: "hourly" },
  { path: "/insights", priority: "0.85", changefreq: "weekly" },
  { path: "/for/healthcare", priority: "0.85", changefreq: "weekly" },
  { path: "/for/business-owners", priority: "0.85", changefreq: "weekly" },
  { path: "/for/families", priority: "0.85", changefreq: "weekly" },
  { path: "/for/newcomers", priority: "0.85", changefreq: "weekly" },
  { path: "/about", priority: "0.75", changefreq: "monthly" },
  { path: "/careers", priority: "0.85", changefreq: "weekly" },
  { path: "/contact", priority: "0.8", changefreq: "monthly" },
  { path: "/disclosures", priority: "0.5", changefreq: "yearly" },
  { path: "/standards", priority: "0.5", changefreq: "yearly" },
  { path: "/privacy", priority: "0.5", changefreq: "yearly" },
  { path: "/terms", priority: "0.5", changefreq: "yearly" },
];

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

// Add English routes with alternates
for (const r of coreRoutes) {
  const enUrl = `${baseUrl}${r.path}`;
  const frUrl = `${baseUrl}/fr${r.path}`;
  xml += `  <url>
    <loc>${enUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
    <xhtml:link rel="alternate" hreflang="en-CA" href="${enUrl}"/>
    <xhtml:link rel="alternate" hreflang="fr-CA" href="${frUrl}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${enUrl}"/>
  </url>
`;
}

// Add French routes with alternates
for (const r of coreRoutes) {
  const enUrl = `${baseUrl}${r.path}`;
  const frUrl = `${baseUrl}/fr${r.path}`;
  xml += `  <url>
    <loc>${frUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${(parseFloat(r.priority) * 0.95).toFixed(2)}</priority>
    <xhtml:link rel="alternate" hreflang="en-CA" href="${enUrl}"/>
    <xhtml:link rel="alternate" hreflang="fr-CA" href="${frUrl}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${enUrl}"/>
  </url>
`;
}

// Add Articles
for (const a of articles) {
  const enUrl = `${baseUrl}${a.url}`;
  const frUrl = `${baseUrl}/fr${a.url}`;
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
console.log(`[Sitemap Generated] Successfully wrote multilingual sitemap to ${sitemapPath}`);
