import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { articles, howIHelpTopics } from "../src/content/data.ts";
import { howIHelpTopicsFr } from "../src/content/howIHelpFr.ts";
import { BLINDSPOTS_DATA } from "../src/content/blindspotsData.ts";
import { STATIC_NEWS } from "../src/content/newsData.ts";
import {
  disclosuresData,
  privacyData,
  standardsData,
  termsData,
  disclosuresDataFr,
  privacyDataFr,
  standardsDataFr,
  termsDataFr,
} from "../src/content/legal.ts";
import { siteConfig, getCtaLabel } from "../src/config/site.ts";
import {
  CORE_ROUTES_SEO,
  ARTICLE_FR_SEO,
  SITE_URL,
  formatStrictTitle,
  getBasePath,
  getLanguageUrls,
  getOgImageForPath,
} from "../src/config/seoMetadata.ts";
import { buildRouteJsonLd } from "../src/config/schema.ts";

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
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeJsonLd(schema) {
  return JSON.stringify(schema).replace(/<\/script/gi, "<\\/script");
}

function renderSiteNav(isFr, altPath) {
  const prefix = isFr ? "/fr" : "";
  const links = [
    { href: prefix || "/", label: isFr ? "Accueil" : "Home" },
    { href: `${prefix}/how-i-help`, label: isFr ? "Comment j'aide" : "How I Help" },
    { href: `${prefix}/education`, label: isFr ? "Éducation" : "Learn" },
    { href: `${prefix}/what-changed`, label: isFr ? "Règles 2026" : "2026 Money Rules" },
    { href: `${prefix}/costly-blindspots`, label: isFr ? "Pièges financiers" : "Costly Blindspots" },
    { href: `${prefix}/calculators`, label: isFr ? "Simulateurs" : "Tools" },
    { href: `${prefix}/calculators/amt`, label: isFr ? "Calculateur IMR" : "AMT Calculator" },
    { href: `${prefix}/atlantic-canada`, label: isFr ? "Canada atlantique" : "Atlantic Canada" },
    { href: `${prefix}/about`, label: isFr ? "À propos" : "About" },
    { href: `${prefix}/contact`, label: isFr ? "Contact" : "Contact" },
    { href: altPath, label: isFr ? "English" : "Français" },
  ];

  return `
    <nav aria-label="${isFr ? "Navigation principale" : "Primary navigation"}" style="display:flex;flex-wrap:wrap;gap:0.85rem;padding-bottom:1rem;margin-bottom:1.5rem;border-bottom:1px solid #d6cebd;font-size:0.9rem;">
      ${links
        .map(
          (l) =>
            `<a href="${escapeAttr(l.href)}" style="color:#2e4a3b;text-decoration:underline;font-weight:500;">${escapeHtml(l.label)}</a>`
        )
        .join("")}
    </nav>
  `;
}

function renderArticleBody(art, isFr) {
  const prefix = isFr ? "/fr" : "";
  const sectionsHtml = (art.sections || [])
    .map(
      (sec) => `
      <section>
        <h2>${escapeHtml(sec.h2)}</h2>
        ${sec.paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join("\n        ")}
      </section>`
    )
    .join("\n");

  const checklistHtml = art.checklist
    ? `
      <section>
        <h2>${escapeHtml(art.checklist.title)}</h2>
        <ul>
          ${art.checklist.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("\n          ")}
        </ul>
      </section>`
    : "";

  const faqsHtml =
    Array.isArray(art.faqs) && art.faqs.length > 0
      ? `
      <section>
        <h2>${isFr ? "Questions fréquentes" : "Frequently Asked Questions"}</h2>
        ${art.faqs
          .map(
            (faq) => `
        <div>
          <h3>${escapeHtml(faq.question)}</h3>
          <p>${escapeHtml(faq.answer)}</p>
        </div>`
          )
          .join("")}
      </section>`
      : "";

  const misunderstandingsHtml =
    Array.isArray(art.misunderstandings) && art.misunderstandings.length > 0
      ? `
      <section>
        <h2>${isFr ? "Idées reçues fréquentes" : "Common Misunderstandings"}</h2>
        ${art.misunderstandings
          .map(
            (m) => `
        <div>
          <h3>${escapeHtml(m.myth)}</h3>
          <p>${escapeHtml(m.reality)}</p>
        </div>`
          )
          .join("")}
      </section>`
      : "";

  const tradeoffsHtml =
    Array.isArray(art.tradeoffs) && art.tradeoffs.length > 0
      ? `
      <section>
        <h2>${isFr ? "Compromis et limites" : "Trade-offs and Limitations"}</h2>
        <ul>
          ${art.tradeoffs.map((t) => `<li>${escapeHtml(t)}</li>`).join("\n          ")}
        </ul>
      </section>`
      : "";

  const sourcesHtml =
    Array.isArray(art.sources) && art.sources.length > 0
      ? `
      <section>
        <h2>${isFr ? "Sources officielles" : "Official Sources"}</h2>
        <ul>
          ${art.sources
            .map(
              (s) =>
                `<li><a href="${escapeAttr(s.url)}">${escapeHtml(s.label)}</a> — ${escapeHtml(s.note)}</li>`
            )
            .join("\n          ")}
        </ul>
      </section>`
      : "";

  const relatedArticles = (art.related || [])
    .map((slug) => articles.find((a) => a.slug === slug))
    .filter(Boolean);

  const relatedHtml =
    relatedArticles.length > 0
      ? `
      <section>
        <h2>${isFr ? "Guides connexes" : "Related Guides"}</h2>
        <ul>
          ${relatedArticles
            .map((rel) => {
              const title = isFr ? ARTICLE_FR_SEO[rel.slug]?.title || rel.title : rel.title;
              return `<li><a href="${escapeAttr(`${prefix}${rel.url}`)}">${escapeHtml(title)}</a></li>`;
            })
            .join("\n          ")}
        </ul>
      </section>`
      : "";

  return `
    <article>
      <p><strong>${isFr ? "La question :" : "The Question:"}</strong> ${escapeHtml(art.question)}</p>
      <p>${escapeHtml(art.problem)}</p>
      <section>
        <h2>${isFr ? "Vue d'ensemble" : "Overview"}</h2>
        ${art.overview.map((p) => `<p>${escapeHtml(p)}</p>`).join("\n        ")}
      </section>
      ${sectionsHtml}
      ${checklistHtml}
      ${faqsHtml}
      ${misunderstandingsHtml}
      ${tradeoffsHtml}
      ${sourcesHtml}
      ${relatedHtml}
    </article>
  `;
}

function renderCoreBody(r, isFr) {
  const prefix = isFr ? "/fr" : "";
  const basePath = getBasePath(r.path);
  const guides = articles.filter((a) => a.kind === "guide");
  const insights = articles.filter((a) => a.kind === "insight");

  if (basePath === "/") {
    return `
      <section>
        <h2>${isFr ? "Comment nous aidons les foyers canadiens" : "Who I Help Across Canada"}</h2>
        <ul>
          <li><a href="${prefix}/for/families">${isFr ? "Familles canadiennes" : "Canadian Families & Homeowners"}</a> — ${isFr ? "CELI, REER, CELIAPP, REEE et protection du revenu" : "TFSA, RRSP, FHSA, RESP grants, and income protection"}</li>
          <li><a href="${prefix}/for/business-owners">${isFr ? "Entrepreneurs et SPCC" : "Business Owners & Incorporated CCPCs"}</a> — ${isFr ? "Seuil de 50 000 $ de revenus passifs, CDC et relève" : "$50k passive income threshold, CDA extraction, and succession"}</li>
          <li><a href="${prefix}/for/healthcare">${isFr ? "Professionnels de la santé" : "Healthcare Workers & Physicians"}</a> — ${isFr ? "Équivalences, réserves de trésorerie et assurance invalidité" : "Credential licensing runway, incorporation, and protection"}</li>
          <li><a href="${prefix}/for/newcomers">${isFr ? "Nouveaux arrivants au Canada" : "Newcomers to Canada"}</a> — ${isFr ? "Crédit canadien, CELI et déclaration T1135" : "First-year banking, Canadian credit building, TFSA/RRSP rules"}</li>
          <li><a href="${prefix}/investing/islamic-equity">${isFr ? "Investissement islamique conforme" : "Shari'ah-Compliant Equity Investing"}</a> — ${isFr ? "Normes AAOIFI dans vos comptes enregistrés canadiens" : "AAOIFI screening inside TFSA, RRSP, FHSA, and RESP accounts"}</li>
        </ul>
      </section>
      <section>
        <h2>${isFr ? "Outils et guides populaires" : "Featured Guides & Calculators"}</h2>
        <ul>
          ${guides
            .slice(0, 8)
            .map(
              (a) =>
                `<li><a href="${prefix}${a.url}">${escapeHtml(isFr ? ARTICLE_FR_SEO[a.slug]?.title || a.title : a.title)}</a></li>`
            )
            .join("\n          ")}
          <li><a href="${prefix}/calculators/amt">${isFr ? "Calculateur d'Impôt Minimum de Remplacement (IMR)" : "Alternative Minimum Tax (AMT) Calculator Canada"}</a></li>
          <li><a href="${prefix}/costly-blindspots">${isFr ? "Pièges financiers coûteux au Canada" : "Costly Canadian Money Blindspots"}</a></li>
        </ul>
      </section>
    `;
  }

  if (basePath === "/education" || basePath === "/insights") {
    const items = basePath === "/education" ? guides : insights;
    return `
      <section>
        <h2>${isFr ? "Tous les articles publiés" : "Published Guides & Analysis"}</h2>
        <ul>
          ${items
            .map((a) => {
              const title = isFr ? ARTICLE_FR_SEO[a.slug]?.title || a.title : a.title;
              const desc = isFr ? ARTICLE_FR_SEO[a.slug]?.description || a.description : a.description;
              return `<li><h3><a href="${prefix}${a.url}">${escapeHtml(title)}</a></h3><p>${escapeHtml(desc)}</p></li>`;
            })
            .join("\n          ")}
        </ul>
      </section>
    `;
  }

  if (basePath === "/how-i-help") {
    const topics = isFr ? howIHelpTopicsFr : howIHelpTopics;
    return `
      <section>
        <h2>${isFr ? "Les 7 questions financières essentielles" : "Seven Core Financial Questions"}</h2>
        ${topics
          .map(
            (t) => `
        <article>
          <h3>${escapeHtml(t.question)}</h3>
          <p>${escapeHtml(t.why)}</p>
          <ul>
            ${t.tradeoffs.map((tr) => `<li>${escapeHtml(tr)}</li>`).join("\n            ")}
          </ul>
          <p>${t.next.map((n) => `<a href="${escapeAttr(n.href)}">${escapeHtml(n.label)}</a>`).join(" | ")}</p>
        </article>`
          )
          .join("")}
      </section>
    `;
  }

  if (basePath === "/costly-blindspots") {
    return `
      <section>
        <h2>${isFr ? "Règles financières statutaires et subventions méconnues" : "Verified Statutory Blindspots & Unclaimed Benefits"}</h2>
        ${BLINDSPOTS_DATA.map(
          (item) => `
        <article id="${escapeAttr(item.id)}">
          <h3>${escapeHtml(isFr ? item.titleFr : item.titleEn)}</h3>
          <p><strong>${escapeHtml(isFr ? item.costStakeFr : item.costStakeEn)}</strong></p>
          <p>${escapeHtml(isFr ? item.summaryFr : item.summaryEn)}</p>
          <p><strong>${isFr ? "Démarche :" : "Action:"}</strong> ${escapeHtml(isFr ? item.actionFr : item.actionEn)}</p>
        </article>`
        ).join("")}
      </section>
    `;
  }

  if (basePath === "/what-changed") {
    return `
      <section>
        <h2>${isFr ? "Mises à jour réglementaires et économiques récentes" : "Verified Regulatory & CRA Rule Updates"}</h2>
        ${STATIC_NEWS.map(
          (u) => `
        <article>
          <h3>${escapeHtml(u.title)}</h3>
          <p>${escapeHtml(u.excerpt)}</p>
          ${u.keyTakeaway ? `<p><strong>${isFr ? "Impact :" : "Practical Impact:"}</strong> ${escapeHtml(u.keyTakeaway)}</p>` : ""}
          <p><a href="${escapeAttr(u.link)}">${escapeHtml(u.source)}</a></p>
        </article>`
        ).join("")}
      </section>
    `;
  }

  if (basePath === "/calculators" || basePath === "/calculators/amt") {
    return `
      <section>
        <h2>${isFr ? "Outils de planification canadiens" : "Canadian Planning Simulators"}</h2>
        <p>${
          isFr
            ? "Basé sur les chiffres officiels publiés par l'ARC pour 2026 : plafond CELI 7 000 $, plafond REER 33 810 $, plafond annuel CELIAPP 8 000 $ (40 000 $ à vie), exemption de base de l'IMR de 181 440 $ à un taux fédéral de 20,5 %."
            : "Based on published 2026 CRA figures: $7,000 TFSA annual limit, $33,810 RRSP ceiling, $8,000 FHSA annual / $40,000 lifetime cap, 20.5% federal AMT rate above the $181,440 indexed exemption (Bills C-59 and C-69)."
        }</p>
        <ul>
          <li><a href="${prefix}/calculators?tab=newcomer">${isFr ? "Planificateur de réserve de 1re année" : "Newcomer First-Year Cash Runway Simulator"}</a></li>
          <li><a href="${prefix}/calculators?tab=mortgage">${isFr ? "Simulateur de renouvellement hypothécaire" : "Mortgage Renewal Shock Analyzer"}</a></li>
          <li><a href="${prefix}/calculators?tab=tfsa-rrsp">${isFr ? "Comparateur fiscal CELI vs REER" : "TFSA vs. RRSP Tax Arbitrage Calculator"}</a></li>
          <li><a href="${prefix}/calculators?tab=ccpc-passive">${isFr ? "Analyseur de revenus passifs SPCC (seuil 50 k$)" : "CCPC $50k Passive Income Limit Analyzer"}</a></li>
          <li><a href="${prefix}/calculators/amt">${isFr ? "Calculateur fédéral d'IMR (2024–2026)" : "Federal Alternative Minimum Tax (AMT) Calculator"}</a></li>
        </ul>
      </section>
    `;
  }

  if (basePath === "/investing/islamic-equity") {
    return `
      <section>
        <h2>${isFr ? "Double filtre de conformité AAOIFI" : "Two-Tier AAOIFI Screening Methodology"}</h2>
        <p>${
          isFr
            ? "Exclusions sectorielles strictes (banques conventionnelles à intérêt/Riba, alcool, porc, jeux de hasard, tabac, armement) et limites de bilan comptable (dette totale / actif < 33,33 %, liquidités à intérêt / actif < 33,33 %, revenus accessoires < 5 % avec purification)."
            : "Strict business sector exclusions (interest banking/Riba, alcohol, pork, gambling, tobacco, weapons) and quantitative balance-sheet thresholds (total debt / total assets < 33.33%, interest-bearing cash & securities / assets < 33.33%, non-permissible revenue < 5% with quarterly purification)."
        }</p>
        <p>${
          isFr
            ? "Admissible dans vos comptes enregistrés canadiens : CELI, REER, CELIAPP, REEE et sociétés par actions (SPCC)."
            : "Eligible inside Canadian registered accounts: TFSA, RRSP, FHSA, RESP, and corporate CCPC holding structures."
        }</p>
      </section>
    `;
  }

  if (basePath === "/atlantic-canada") {
    return `
      <section>
        <h2>${isFr ? "Quatre règles provinciales du Nouveau-Brunswick et de l'Atlantique" : "Four Atlantic Canada Rules That Change Household Math"}</h2>
        <ul>
          <li><strong>${isFr ? "Nouveau-Brunswick (Dieppe / Moncton) :" : "New Brunswick Property Transfer Tax:"}</strong> ${isFr ? "Droit provincial de transfert immobilier de 1,0 % sans exemption générale pour premier acheteur." : "1.0% provincial Real Property Transfer Tax with no general first-time buyer rebate."}</li>
          <li><strong>${isFr ? "Impôt des sociétés (SPCC) au N.-B. :" : "NB Small Business Corporate Tax Rate:"}</strong> ${isFr ? "11,5 % combinés (2,5 % N.-B. + 9,0 % fédéral) jusqu'à 500 000 $, puis 29,0 % lorsque les revenus passifs érodent la DPE au-delà de 50 000 $." : "11.5% combined (2.5% NB + 9.0% federal) on the first $500,000, climbing toward 29.0% when passive income exceeds $50,000."}</li>
          <li><strong>${isFr ? "Frais d'homologation :" : "Estate Probate Fees:"}</strong> ${isFr ? "0,5 % au Nouveau-Brunswick (5 $ par 1 000 $ > 20 000 $) contre ~1,695 % en Nouvelle-Écosse (> 100 000 $)." : "~0.5% in New Brunswick ($5 per $1,000 over $20,000) vs. ~1.695% in Nova Scotia (over $100,000)."}</li>
          <li><strong>${isFr ? "Nouveaux arrivants (PICA) :" : "Atlantic Immigration Program (AIP):"}</strong> ${isFr ? "Budget réel d'arrivée (véhicule d'hiver, lettre d'assurance auto et Assurance-maladie du N.-B.)." : "Real 90-day settlement cash buffers, winter vehicles, foreign auto experience letters, and NB Medicare transitions."}</li>
        </ul>
      </section>
      <section>
        <h2>${isFr ? "Guides spécialisés pour l'Atlantique" : "Targeted Regional & Niche Guides"}</h2>
        <ul>
          <li><a href="${prefix}/education/dieppe-moncton-first-time-homebuyer-fhsa-nb-rebates">${isFr ? "Premier achat immobilier à Dieppe et Moncton (CELIAPP, RAP et taxe de 1 %)" : "First-Time Homebuyer Strategy in Dieppe, Moncton & New Brunswick"}</a></li>
          <li><a href="${prefix}/insights/new-brunswick-ccpc-corporate-tax-small-business-strategy">${isFr ? "Impôt SPCC au Nouveau-Brunswick, seuil passif de 50 000 $ et CDC" : "New Brunswick CCPC Small Business Tax, $50k SBD & Probate Strategy"}</a></li>
          <li><a href="${prefix}/education/atlantic-canada-newcomer-aip-money-guide">${isFr ? "Finances des nouveaux arrivants à Dieppe, Moncton et en Atlantique (PICA)" : "Newcomer Finances in Dieppe, Moncton & Atlantic Canada (AIP Guide)"}</a></li>
          <li><a href="${prefix}/education/halal-tfsa-rrsp-fhsa-investing-canada">${isFr ? "Investir conforme à la charia au Canada : CELI, REER, CELIAPP et Zakat" : "Halal Investing in Canada: TFSA, RRSP, FHSA & Zakah Guide"}</a></li>
        </ul>
      </section>
    `;
  }

  if (basePath.startsWith("/for/")) {
    return `
      <section>
        <h2>${isFr ? "Guides essentiels recommandés" : "Essential Guides & Tools for Your Situation"}</h2>
        <ul>
          ${guides
            .slice(0, 6)
            .map(
              (a) =>
                `<li><a href="${prefix}${a.url}">${escapeHtml(isFr ? ARTICLE_FR_SEO[a.slug]?.title || a.title : a.title)}</a></li>`
            )
            .join("\n          ")}
        </ul>
      </section>
    `;
  }

  if (basePath === "/disclosures" || basePath === "/standards" || basePath === "/privacy" || basePath === "/terms") {
    const legalMap = isFr
      ? {
          "/disclosures": disclosuresDataFr,
          "/standards": standardsDataFr,
          "/privacy": privacyDataFr,
          "/terms": termsDataFr,
        }
      : {
          "/disclosures": disclosuresData,
          "/standards": standardsData,
          "/privacy": privacyData,
          "/terms": termsData,
        };
    const legal = legalMap[basePath];
    if (legal) {
      return `
        <section>
          <p>${escapeHtml(legal.lede)}</p>
          ${legal.sections
            .slice(0, 4)
            .map(
              (s) =>
                `<h2>${escapeHtml(s.title)}</h2>${s.content.slice(0, 2).map((p) => `<p>${escapeHtml(p)}</p>`).join("")}`
            )
            .join("")}
        </section>
      `;
    }
  }

  return "";
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
    summary: art.problem,
    faqs: art.faqs,
    article: art,
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
    faqs: art.faqs,
    article: art,
    noIndex: false,
  });
}

const allRoutes = [...CORE_ROUTES_SEO, ...dynamicArticleRoutes];

function renderRouteHtml(r) {
  const isFrench = r.lang === "fr-CA" || r.path.startsWith("/fr");
  const basePath = r.basePath || getBasePath(r.path);
  const altPath = isFrench ? basePath : basePath === "/" ? "/fr" : `/fr${basePath}`;
  const { enUrl, frUrl, canonicalUrl } = getLanguageUrls(r.path);
  const ogImageUrl = getOgImageForPath(r.path, SITE_URL);
  const robotsValue = r.noIndex
    ? "noindex, nofollow, noarchive"
    : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

  const roleLabel = isFrench
    ? "Ahmed Bello &bull; Professionnel en solutions financières agréé"
    : "Ahmed Bello &bull; Licensed Financial Solutions Professional";
  const ctaLabel = getCtaLabel(isFrench);
  const contactHeading = isFrench
    ? "Contact et demandes directes"
    : "Contact & Direct Practice Enquiries";
  const profLabel = isFrench ? "Professionnel :" : "Professional:";
  const profValue = isFrench
    ? "Ahmed Bello, professionnel en solutions financières agréé"
    : "Ahmed Bello, Licensed Financial Solutions Professional";
  const licensingLabel = isFrench ? "Pratique :" : "Practice:";
  const licensingValue = isFrench
    ? "Pratique indépendante &bull; Dieppe (N.-B.), Canada"
    : "Independent Practice &bull; Dieppe, NB, Canada";
  const telLabel = isFrench ? "Téléphone direct :" : "Direct Telephone:";
  const emailLabel = isFrench ? "Courriel :" : "Email:";
  const footerNote = isFrench
    ? "Ressource éducative pour les résidents canadiens."
    : "Educational practice resource for Canadian residents.";

  const mainBodyHtml = r.article
    ? renderArticleBody(r.article, isFrench)
    : `<p>${escapeHtml(r.summary !== r.description ? r.summary : r.description)}</p>${renderCoreBody(r, isFrench)}`;

  const semanticBody = `
    <div style="max-width:860px;margin:2rem auto;padding:1.5rem;font-family:Georgia,serif;color:#1c1b18;line-height:1.65;">
      ${renderSiteNav(isFrench, altPath)}
      <header style="border-bottom:1px solid #d6cebd;padding-bottom:1rem;margin-bottom:1.5rem;">
        <p style="font-size:0.8rem;text-transform:uppercase;letter-spacing:0.1em;color:#75581f;font-weight:600;margin:0 0 0.5rem 0;">${roleLabel}</p>
        <h1 style="font-size:2rem;margin:0 0 0.5rem 0;color:#1c1b18;">${escapeHtml(r.heading)}</h1>
        <p style="font-size:1.05rem;color:#46423a;margin:0;">${escapeHtml(r.description)}</p>
      </header>
      <main>
        ${mainBodyHtml}
        <aside style="margin-top:2rem;padding:1rem;background:#fcfaf5;border:1px solid #d6cebd;border-radius:2px;">
          <h2 style="font-size:1.15rem;margin-top:0;">${contactHeading}</h2>
          <p><strong>${profLabel}</strong> ${profValue} &middot; <strong>${licensingLabel}</strong> ${licensingValue}</p>
          <p><strong>${telLabel}</strong> ${escapeHtml(siteConfig.publicPhone)} &middot; <strong>${emailLabel}</strong> ${escapeHtml(siteConfig.publicEmail)}</p>
          <p><a href="${escapeAttr(siteConfig.schedulingUrl)}">${escapeHtml(ctaLabel)}</a></p>
        </aside>
      </main>
      <footer style="margin-top:2rem;padding-top:1rem;border-top:1px solid #d6cebd;font-size:0.8rem;color:#625d52;">
        <p>&copy; ${new Date().getFullYear()} Ahmed Bello. ${footerNote}</p>
      </footer>
    </div>
  `;

  // Build unified Schema.org JSON-LD graph for this specific route
  let collectionItems;
  if (basePath === "/education") {
    collectionItems = articles
      .filter((a) => a.kind === "guide")
      .map((a) => ({
        name: isFrench ? ARTICLE_FR_SEO[a.slug]?.title || a.title : a.title,
        url: `${isFrench ? "/fr" : ""}${a.url}`,
      }));
  } else if (basePath === "/insights") {
    collectionItems = articles
      .filter((a) => a.kind === "insight")
      .map((a) => ({
        name: isFrench ? ARTICLE_FR_SEO[a.slug]?.title || a.title : a.title,
        url: `${isFrench ? "/fr" : ""}${a.url}`,
      }));
  } else if (basePath === "/costly-blindspots") {
    collectionItems = BLINDSPOTS_DATA.map((item) => ({
      name: isFrench ? item.titleFr : item.titleEn,
      description: isFrench ? item.summaryFr : item.summaryEn,
      url: `${isFrench ? "/fr" : ""}/costly-blindspots#${item.id}`,
    }));
  } else if (basePath === "/atlantic-canada") {
    r.faqs = isFrench
      ? [
          {
            question: "Les acheteurs d'une première maison au Nouveau-Brunswick ont-ils droit à une exemption de droits de mutation ?",
            answer: "Non. Le Nouveau-Brunswick perçoit un impôt provincial sur le transfert de biens réels de 1,0 % sans remboursement provincial général pour les premiers acheteurs.",
          },
          {
            question: "Quel est le taux d'impôt des petites entreprises (SPCC) au Nouveau-Brunswick en 2026 ?",
            answer: "Une SPCC admissible paie 11,5 % combinés (2,5 % N.-B. + 9,0 % fédéral) sur les premiers 500 000 $, taux qui grimpe jusqu'à 29,0 % si les revenus passifs réduisent la DPE au-delà de 50 000 $.",
          },
        ]
      : [
          {
            question: "Do first-time home buyers in Dieppe, Moncton, or New Brunswick receive a transfer tax rebate?",
            answer: "No. New Brunswick charges a 1.0% provincial Real Property Transfer Tax with no general first-time buyer exemption.",
          },
          {
            question: "What is the New Brunswick small business corporate tax rate on a CCPC?",
            answer: "Qualifying Canadian-controlled private corporations in New Brunswick pay an 11.5% combined rate (2.5% NB + 9.0% federal) on the first $500,000 of active income before passive income clawbacks above $50,000.",
          },
        ];
  }

  const routeJsonLd = buildRouteJsonLd({
    pathname: r.path,
    title: r.title,
    description: r.description,
    heading: r.heading,
    isFr: isFrench,
    noIndex: Boolean(r.noIndex),
    article: r.article,
    faqs: r.faqs,
    collectionItems,
  });

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
    /<meta\s+property="og:image"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta property="og:image" content="${ogImageUrl}" />`
  );
  html = html.replace(
    /<meta\s+property="og:image:secure_url"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta property="og:image:secure_url" content="${ogImageUrl}" />`
  );
  html = html.replace(
    /<meta\s+name="twitter:title"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta name="twitter:title" content="${escapeAttr(r.title)}" />`
  );
  html = html.replace(
    /<meta\s+name="twitter:description"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta name="twitter:description" content="${escapeAttr(r.description)}" />`
  );
  html = html.replace(
    /<meta\s+name="twitter:image"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta name="twitter:image" content="${ogImageUrl}" />`
  );

  // Strip base index.html JSON-LD block before injecting clean single @graph JSON-LD + article dates
  html = html.replace(/<script\s+type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/gi, "");

  let extraHead = "";
  if (r.article) {
    extraHead += `\n    <meta property="article:published_time" content="${escapeAttr(r.article.datePublished || "2025-01-15T08:00:00-05:00")}" />`;
    extraHead += `\n    <meta property="article:modified_time" content="${escapeAttr(r.article.dateModified || "2026-11-05T09:00:00-05:00")}" />`;
  }
  extraHead += `\n    <script type="application/ld+json" data-prerender-jsonld="true">${escapeJsonLd(routeJsonLd)}</script>`;
  html = html.replace("</head>", `${extraHead}\n  </head>`);

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

// Pre-render dedicated 404.html with clean noindex, nofollow & zero duplicate JSON-LD
let notFoundHtml = template
  .replace(/<script\s+type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/gi, "")
  .replace(/<title>[\s\S]*?<\/title>/i, `<title>Page Not Found (404) | Ahmed Bello</title>`)
  .replace(
    /<meta\s+name="description"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta name="description" content="The page you requested could not be found. Explore Canadian financial education guides or return to the homepage." />`
  )
  .replace(
    /<meta\s+name="robots"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta name="robots" content="noindex, nofollow, noarchive" />`
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
  `[Static Pre-rendering Complete] Generated ${count} rich pre-rendered HTML routes and 404.html.`
);
