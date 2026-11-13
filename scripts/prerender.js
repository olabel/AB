import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { articles } from "../src/content/data.ts";
import {
  CORE_ROUTES_SEO,
  ARTICLE_FR_SEO,
  SITE_URL,
  formatStrictTitle,
  getLanguageUrls,
} from "../src/config/seoMetadata.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, "../dist");

const templatePath = path.resolve(distDir, "index.html");
if (!fs.existsSync(templatePath)) {
  console.error("Template dist/index.html not found! Run vite build first.");
  process.exit(1);
}

const template = fs.readFileSync(templatePath, "utf-8");

function escapeAttr(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Dynamically build English + French article routes with full localized SEO
const dynamicArticleRoutes = [];

for (const art of articles) {
  const enUrl = art.url;
  const enTitle = formatStrictTitle(art.seoTitle || art.title);
  const frSeo = ARTICLE_FR_SEO[art.slug];
  const frTitle = formatStrictTitle(frSeo?.seoTitle || art.seoTitle || art.title);

  dynamicArticleRoutes.push({
    path: enUrl,
    basePath: enUrl,
    title: enTitle,
    description: art.description,
    lang: "en-CA",
    ogType: "article",
    heading: art.title,
    summary: art.description,
    noIndex: false,
  });

  dynamicArticleRoutes.push({
    path: `/fr${enUrl}`,
    basePath: enUrl,
    title: frTitle,
    description: frSeo?.description || art.description,
    lang: "fr-CA",
    ogType: "article",
    heading: frSeo?.title || art.title,
    summary: frSeo?.description || art.description,
    noIndex: false,
  });
}

const allRoutes = [...CORE_ROUTES_SEO, ...dynamicArticleRoutes];

function renderRouteHtml(r) {
  const isFrench = r.lang === "fr-CA" || r.path.startsWith("/fr");
  const { enUrl, frUrl, canonicalUrl } = getLanguageUrls(r.path);
  const robotsValue = r.noIndex
    ? "noindex, nofollow"
    : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

  const roleLabel = isFrench
    ? "Ahmed Bello &bull; Professionnel en solutions financières agréé"
    : "Ahmed Bello &bull; Licensed Financial Solutions Professional";
  const contactHeading = isFrench
    ? "Contact et demandes directes"
    : "Contact & Direct Practice Enquiries";
  const profLabel = isFrench ? "Professionnel :" : "Professional:";
  const profValue = isFrench
    ? "Ahmed Bello, professionnel en solutions financières agréé"
    : "Ahmed Bello, Licensed Financial Solutions Professional";
  const licensingLabel = isFrench ? "Permis :" : "Licensing:";
  const licensingValue = isFrench
    ? "Pratique indépendante &bull; Autorisé partout au Canada"
    : "Independent Practice &bull; Licensed Across Canada";
  const telLabel = isFrench ? "Téléphone direct :" : "Direct Telephone:";
  const emailLabel = isFrench ? "Courriel :" : "Email:";
  const footerNote = isFrench
    ? `Ressource éducative pour les résidents canadiens.`
    : `Educational practice resource for Canadian residents.`;

  const semanticBody = `
    <div style="max-width:800px;margin:2rem auto;padding:1.5rem;font-family:Georgia,serif;color:#1c1b18;line-height:1.6;">
      <header style="border-bottom:1px solid #d6cebd;padding-bottom:1rem;margin-bottom:1.5rem;">
        <p style="font-size:0.8rem;text-transform:uppercase;letter-spacing:0.1em;color:#75581f;font-weight:600;margin:0 0 0.5rem 0;">${roleLabel}</p>
        <h1 style="font-size:2rem;margin:0 0 0.5rem 0;color:#1c1b18;">${escapeHtml(r.heading)}</h1>
        <p style="font-size:1.1rem;color:#46423a;margin:0;">${escapeHtml(r.summary)}</p>
      </header>
      <main>
        <p>${escapeHtml(r.description)}</p>
        <div style="margin-top:2rem;padding:1rem;background:#fcfaf5;border:1px solid #d6cebd;border-radius:2px;">
          <h2 style="font-size:1.2rem;margin-top:0;">${contactHeading}</h2>
          <p><strong>${profLabel}</strong> ${profValue}</p>
          <p><strong>${licensingLabel}</strong> ${licensingValue}</p>
          <p><strong>${telLabel}</strong> +1-506-899-4941</p>
          <p><strong>${emailLabel}</strong> enquiries@ahmedbello.com</p>
        </div>
      </main>
      <footer style="margin-top:2rem;padding-top:1rem;border-top:1px solid #d6cebd;font-size:0.8rem;color:#625d52;">
        <p>&copy; ${new Date().getFullYear()} Ahmed Bello. ${footerNote}</p>
      </footer>
    </div>
  `;

  let html = template;

  html = html.replace(/<html\s+lang="[^"]*"/i, `<html lang="${r.lang}"`);
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(r.title)}</title>`);
  html = html.replace(
    /<meta\s+name="description"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta name="description" content="${escapeAttr(r.description)}" />`
  );
  html = html.replace(
    /<meta\s+name="robots"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta name="robots" content="${robotsValue}" />`
  );
  html = html.replace(
    /<link\s+rel="canonical"\s+href="[\s\S]*?"\s*\/?>/i,
    `<link rel="canonical" href="${canonicalUrl}" />\n    <link rel="alternate" hreflang="en-CA" href="${enUrl}" />\n    <link rel="alternate" hreflang="fr-CA" href="${frUrl}" />\n    <link rel="alternate" hreflang="x-default" href="${enUrl}" />`
  );
  html = html.replace(
    /<meta\s+property="og:title"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta property="og:title" content="${escapeAttr(r.title)}" />`
  );
  html = html.replace(
    /<meta\s+property="og:description"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta property="og:description" content="${escapeAttr(r.description)}" />`
  );
  html = html.replace(
    /<meta\s+property="og:type"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta property="og:type" content="${r.ogType || "website"}" />`
  );
  html = html.replace(
    /<meta\s+property="og:url"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta property="og:url" content="${canonicalUrl}" />`
  );
  html = html.replace(
    /<meta\s+property="og:locale"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta property="og:locale" content="${isFrench ? "fr_CA" : "en_CA"}" />`
  );
  html = html.replace(
    /<meta\s+property="og:locale:alternate"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta property="og:locale:alternate" content="${isFrench ? "en_CA" : "fr_CA"}" />`
  );
  html = html.replace(
    /<meta\s+name="twitter:title"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta name="twitter:title" content="${escapeAttr(r.title)}" />`
  );
  html = html.replace(
    /<meta\s+name="twitter:description"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta name="twitter:description" content="${escapeAttr(r.description)}" />`
  );

  html = html.replace('<div id="root"></div>', `<div id="root">${semanticBody}</div>`);
  return html;
}

let count = 0;
for (const r of allRoutes) {
  const html = renderRouteHtml(r);
  const targetDir = r.path === "/" ? distDir : path.join(distDir, r.path.replace(/^\//, ""));
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  fs.writeFileSync(path.join(targetDir, "index.html"), html, "utf-8");
  count++;
}

// Pre-render dedicated 404.html with clean noindex, nofollow
let notFoundHtml = template
  .replace(/<title>[\s\S]*?<\/title>/i, `<title>Page Not Found (404) | Ahmed Bello</title>`)
  .replace(
    /<meta\s+name="description"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta name="description" content="The page you requested could not be found. Explore Canadian financial education guides or return to the homepage." />`
  )
  .replace(
    /<meta\s+name="robots"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta name="robots" content="noindex, nofollow" />`
  )
  .replace(
    /<link\s+rel="canonical"\s+href="[\s\S]*?"\s*\/?>/i,
    `<link rel="canonical" href="${SITE_URL}/404" />`
  )
  .replace(
    '<div id="root"></div>',
    `<div id="root">
      <main style="max-width:700px;margin:4rem auto;padding:2rem;font-family:Georgia,serif;text-align:center;color:#1c1b18;">
        <h1 style="font-size:2.5rem;margin-bottom:1rem;">Page Not Found (404)</h1>
        <p style="font-size:1.1rem;color:#46423a;margin-bottom:2rem;">The page you requested does not exist or may have moved.</p>
        <p><a href="/" style="color:#2e4a3b;text-decoration:underline;font-weight:600;">Return to Ahmed Bello Financial Education &rarr;</a></p>
      </main>
    </div>`
  );

fs.writeFileSync(path.join(distDir, "404.html"), notFoundHtml, "utf-8");

console.log(
  `[Static Pre-rendering Complete] Generated ${count} pre-rendered HTML routes and 404.html.`
);
