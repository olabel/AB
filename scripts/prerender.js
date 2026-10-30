import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { articles } from "../src/content/data.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, "../dist");

const templatePath = path.resolve(distDir, "index.html");
if (!fs.existsSync(templatePath)) {
  console.error("Template dist/index.html not found! Run vite build first.");
  process.exit(1);
}

const template = fs.readFileSync(templatePath, "utf-8");

const coreRoutes = [
  // English Core Routes
  {
    path: "/",
    title: "Ahmed Bello | Financial Education for Canadians",
    description: "Plain-language Canadian financial education on registered accounts (TFSA, RRSP, FHSA), insurance, and family money decisions with Ahmed Bello.",
    lang: "en-CA",
    heading: "Ahmed Bello — Licensed Financial Solutions Professional",
    summary: "Plain-language Canadian financial education on registered accounts (TFSA, RRSP, FHSA), income protection, debt restructuring, and family financial decision-making.",
  },
  {
    path: "/about",
    title: "About Ahmed Bello | Licensed Financial Solutions Professional",
    description: "Independent Canadian financial educator helping individuals and families understand registered accounts (TFSA, RRSP, FHSA), insurance, and money decisions.",
    lang: "en-CA",
    heading: "About Ahmed Bello — Financial Educator",
    summary: "Independent financial professional helping individuals and families across Canada make intentional, well-grounded money decisions through transparent education.",
  },
  {
    path: "/contact",
    title: "Start a Financial Conversation | Ahmed Bello",
    description: "Start a plain-language financial conversation with Ahmed Bello, Licensed Financial Solutions Professional. Ask questions without sales pressure.",
    lang: "en-CA",
    heading: "Start a Conversation with Ahmed Bello",
    summary: "Send your questions about Canadian registered accounts, income protection, debt repayment, or newcomer finances directly to Ahmed Bello.",
  },
  {
    path: "/education",
    title: "Canadian Financial Education Library | Ahmed Bello",
    description: "Plain-language decision guides on Canadian registered accounts (TFSA, RRSP, FHSA), insurance choices, credit building, and money fundamentals.",
    lang: "en-CA",
    heading: "Canadian Financial Education Library",
    summary: "Explore plain-language guides on TFSA vs RRSP, First Home Savings Account (FHSA), Home Buyers' Plan, credit building for newcomers, and income protection.",
  },
  {
    path: "/insights",
    title: "Financial Insights & Strategic Perspectives | Ahmed Bello",
    description: "Deep-dive analytical essays on mortgage renewal shock, Canadian capital gains, and family liquidity architecture.",
    lang: "en-CA",
    heading: "Financial Insights & Strategic Perspectives",
    summary: "Comprehensive analytical articles examining the mechanics of Canadian mortgage renewals, statutory deemed disposition at death under Subsection 70(5), and structured family wealth transitions.",
  },
  {
    path: "/news",
    title: "Official Financial News & Monetary Policy Announcements | Ahmed Bello",
    description: "Real-time central bank interest rate decisions, Bank of Canada monetary policy, Federal Reserve updates, and verified North American economic news.",
    lang: "en-CA",
    heading: "Official Macroeconomic Intelligence Desk",
    summary: "Direct tracking of the Bank of Canada policy rate, Federal Reserve FOMC decisions, Statistics Canada CPI inflation figures, and CRA regulatory updates.",
  },
  {
    path: "/careers",
    title: "Independent Financial Practice Mentorship | Ahmed Bello",
    description: "Comprehensive Canadian provincial LLQP licensing support, practical case co-planning, and independent practice mentorship with Ahmed Bello.",
    lang: "en-CA",
    heading: "Independent Financial Solutions Practice Mentorship",
    summary: "Learn how motivated candidates prepare for provincial LLQP licensing, receive carrier appointments, and build an independent multi-carrier financial practice across Canada.",
  },
  {
    path: "/how-i-help",
    title: "How I Help: Structured Financial Guidance | Ahmed Bello",
    description: "Explore Ahmed Bello's educational framework: goal prioritization, registered shelter mechanics, family income protection, and debt repayment strategies.",
    lang: "en-CA",
    heading: "How I Help: Structured Financial Guidance",
    summary: "A transparent framework for organizing family finances: prioritizing immediate liquidity, sheltering capital in registered accounts, and protecting against income disruption.",
  },
  {
    path: "/investing/islamic-equity",
    title: "Shari'ah-Compliant Global Equity Index Investing | Canadian Educational Framework",
    description: "Educational guide on Shari'ah-compliant global equity investing under AAOIFI standards. Benchmark index tracking (MSCI ACWI Islamic Index) and Canadian registered accounts (TFSA, RRSP, FHSA, RESP, Corporate).",
    lang: "en-CA",
    heading: "Shari'ah-Compliant Global Equity Index Investing in Canada",
    summary: "Understanding Shari'ah screening principles, benchmark index tracking, and Canadian tax-sheltered accounts without commercial sales pitch.",
  },
  {
    path: "/for/healthcare",
    title: "Financial Guidance for Healthcare Workers, Doctors & Nurses | Ahmed Bello",
    description: "Tailored financial planning for Canadian doctors, nurses, and medical professionals managing licensing gaps, foreign credential costs, and income protection.",
    lang: "en-CA",
    heading: "Financial Planning for Healthcare Workers & Medical Professionals",
    summary: "Strategies for incorporated physicians, registered nurses, and internationally trained medical graduates navigating Canadian taxation, insurance, and licensing runway.",
  },
  {
    path: "/for/business-owners",
    title: "Financial Guidance for Canadian Business Owners & CCPCs | Ahmed Bello",
    description: "Corporate financial architecture: passive investment income rules ($50k SBD limit), Capital Dividend Account (CDA) tax-free distributions, and estate liquidity.",
    lang: "en-CA",
    heading: "Financial Strategy for Business Owners & CCPCs",
    summary: "Guidance on corporate holding companies, passive income thresholds, Capital Dividend Account (CDA) distributions, and succession liquidity.",
  },
  {
    path: "/for/families",
    title: "Family Financial Decision-Making Guide | Ahmed Bello",
    description: "Practical financial planning for Canadian families: education savings (RESP grants), income protection, mortgage renewals, and estate transfer.",
    lang: "en-CA",
    heading: "Financial Decision-Making for Canadian Families",
    summary: "Maximizing the Canada Education Savings Grant (CESG), calculating term insurance requirements, and balancing mortgage acceleration with registered retirement savings.",
  },
  {
    path: "/for/newcomers",
    title: "Newcomers to Canada Financial Roadmap | Ahmed Bello",
    description: "First-year financial checklist for new permanent residents and work permit holders: credit establishment, SIN protection, banking, and FHSA.",
    lang: "en-CA",
    heading: "First-Year Financial Roadmap for Newcomers to Canada",
    summary: "Step-by-step guidance on opening secured credit cards, understanding the Canadian credit bureau scoring system, and opening tax-free registered savings accounts.",
  },
  {
    path: "/disclosures",
    title: "Regulatory Disclosures & Professional Scope | Ahmed Bello",
    description: "Canadian provincial insurance licensing disclosures, regulatory oversight, compensation transparency, and independent brokerage affiliations for Ahmed Bello.",
    lang: "en-CA",
    heading: "Regulatory Disclosures & Professional Scope",
    summary: "Full disclosure of provincial financial licensing across Canadian provinces and territories, compensation models, and educational scope boundaries.",
  },
  {
    path: "/standards",
    title: "Editorial Standards & Official Sources | Ahmed Bello",
    description: "How financial guides on this website are researched, verified against official Canadian government sources, dated, and reviewed.",
    lang: "en-CA",
    heading: "Editorial Standards & Verification Framework",
    summary: "Our commitment to accuracy, official regulatory citations, neutral calculations, and transparent correction policies.",
  },
  {
    path: "/privacy",
    title: "Privacy Notice & Data Protection | Ahmed Bello",
    description: "How personal information from enquiries is handled, protected, and kept private under Canadian PIPEDA standards and CASL anti-spam regulations.",
    lang: "en-CA",
    heading: "Privacy Notice & Client Confidentiality",
    summary: "PIPEDA-compliant privacy policy detailing how client personal information is collected, safeguarded, and handled with strict confidentiality.",
  },
  {
    path: "/terms",
    title: "Website Terms of Use | Ahmed Bello",
    description: "Terms and ground rules for using this Canadian financial education website, intellectual property, and limitations of liability.",
    lang: "en-CA",
    heading: "Website Terms of Use",
    summary: "Clear legal terms governing website access, educational copyright, and financial disclaimer boundaries.",
  },

  // French Core Routes
  {
    path: "/fr",
    title: "Ahmed Bello | Éducation Financière pour Canadiens",
    description: "Éducation financière en langage clair sur les régimes enregistrés (CELI, REER, CELIAPP), l'assurance vie et les décisions budgétaires avec Ahmed Bello.",
    lang: "fr-CA",
    heading: "Ahmed Bello — Professionnel en Solutions Financières Agréé",
    summary: "Éducation financière accessible et indépendante au Canada : régimes enregistrés, protection du revenu familial, remboursement des dettes et investissement réfléchi.",
  },
  {
    path: "/fr/about",
    title: "À Propos d'Ahmed Bello | Professionnel Agréé au Canada",
    description: "Éducateur financier indépendant aidant les familles et particuliers au Canada à comprendre les régimes enregistrés (CELI, REER) et la prévoyance.",
    lang: "fr-CA",
    heading: "À Propos d'Ahmed Bello — Éducateur Financier",
    summary: "Pratique financière indépendante axée sur l'éducation et la transparence, agréée dans toutes les provinces canadiennes.",
  },
  {
    path: "/fr/contact",
    title: "Démarrer une Conversation | Ahmed Bello",
    description: "Échangez directement avec Ahmed Bello, professionnel agréé en solutions financières. Posez vos questions sans pression commerciale.",
    lang: "fr-CA",
    heading: "Démarrer une Conversation avec Ahmed Bello",
    summary: "Posez vos questions sur les régimes enregistrés, la protection de votre revenu ou vos démarches financières au Canada en toute confidentialité.",
  },
  {
    path: "/fr/education",
    title: "Bibliothèque d'Éducation Financière | Ahmed Bello",
    description: "Guides pratiques et outils sur les comptes enregistrés (CELI, REER, CELIAPP), l'assurance vie, le crédit et les finances pour nouveaux arrivants.",
    lang: "fr-CA",
    heading: "Bibliothèque d'Éducation Financière pour Canadiens",
    summary: "Consultez nos guides détaillés sur le CELI, le REER, le CELIAPP, le crédit canadien et les étapes financières des nouveaux arrivants.",
  },
  {
    path: "/fr/insights",
    title: "Perspectives Financières & Analyses Stratégiques | Ahmed Bello",
    description: "Essais analytiques approfondis sur le renouvellement hypothécaire canadien, les gains en capital et la disposition présumée au décès.",
    lang: "fr-CA",
    heading: "Perspectives Financières & Analyses Stratégiques",
    summary: "Analyses complètes sur les renouvellements hypothécaires, la disposition présumée en vertu du paragraphe 70(5) de la Loi de l'impôt sur le revenu et la trésorerie familiale.",
  },
  {
    path: "/fr/news",
    title: "Veille Économique Officielle & Décisions Monétaires | Ahmed Bello",
    description: "Surveillance officielle des taux de la Banque du Canada, de la Réserve Fédérale, de l'inflation de Statistique Canada et des avis de l'ARC.",
    lang: "fr-CA",
    heading: "Bureau d'Actualités Financières & Décisions Monétaires",
    summary: "Dépêches officielles issues des autorités de réglementation monétaire et fiscale avec liens directs vers les sources originales.",
  },
  {
    path: "/fr/careers",
    title: "Mentorat Professionnel Indépendant | Ahmed Bello",
    description: "Accompagnement éducatif et préparation aux examens provinciaux du PQAP pour bâtir un cabinet de solutions financières au Canada.",
    lang: "fr-CA",
    heading: "Mentorat en Solutions Financières Indépendantes",
    summary: "Découvrez notre programme d'accompagnement pour la préparation aux examens du PQAP et le développement d'une pratique financière indépendante.",
  },
  {
    path: "/fr/how-i-help",
    title: "Comment J'Accompagne Vos Décisions | Ahmed Bello",
    description: "L'approche d'Ahmed Bello : priorisation des objectifs, régimes enregistrés, protection du revenu familial et stratégies de dette.",
    lang: "fr-CA",
    heading: "Comment J'Accompagne Vos Décisions Financières",
    summary: "Un cadre méthodique pour organiser vos finances personnelles, protéger votre foyer et optimiser vos régimes fiscaux canadiens.",
  },
  {
    path: "/fr/investing/islamic-equity",
    title: "Investissement en Actions Islamiques & Cadre Éducatif Canadien | Ahmed Bello",
    description: "Guide éducatif sur l'investissement en actions mondiales conformes à la charia selon les normes de l'AAOIFI. Réplication d'indices (MSCI ACWI Islamic) et comptes enregistrés canadiens (CELI, REER, CELIAPP).",
    lang: "fr-CA",
    heading: "Investissement en Actions Islamiques au Canada : Cadre Éducatif",
    summary: "Comprendre les principes de filtrage éthique islamique, la réplication indicielle et les régimes enregistrés canadiens sans démarche commerciale.",
  },
  {
    path: "/fr/for/healthcare",
    title: "Planification Financière Professionnels de Santé & Médecins | Ahmed Bello",
    description: "Orientation financière pour médecins, infirmières et diplômés internationaux en santé au Canada : équivalences, fiscalité et subsistance.",
    lang: "fr-CA",
    heading: "Planification Financière pour Professionnels de la Santé",
    summary: "Stratégies pour médecins incorporés, infirmières autorisées et professionnels formés à l'étranger : équivalences, fiscalité et protection du revenu.",
  },
  {
    path: "/fr/for/business-owners",
    title: "Stratégie Financière pour Chefs d'Entreprise & SPCC | Ahmed Bello",
    description: "Conseils pour Sociétés Privées sous Contrôle Canadien (SPCC), surplus accumulés, plafond de 50 000 $ de revenus passifs et compte de dividendes en capital (CDC).",
    lang: "fr-CA",
    heading: "Stratégie Financière pour Propriétaires d'Entreprise",
    summary: "Gestion des sociétés de gestion, seuils de revenus passifs, compte de dividendes en capital (CDC) et relève d'entreprise.",
  },
  {
    path: "/fr/for/families",
    title: "Guide Financier pour Familles Canadiennes | Ahmed Bello",
    description: "Planification pour familles : épargne-études REEE, subvention SCEE de 20 %, protection du revenu, renouvellement hypothécaire et succession.",
    lang: "fr-CA",
    heading: "Décisions Financières pour les Familles au Canada",
    summary: "Maximisation de la Subvention canadienne pour l'épargne-études (SCEE), assurance temporaire et équilibre entre hypothèque et retraite.",
  },
  {
    path: "/fr/for/newcomers",
    title: "Guide Financier pour Nouveaux Arrivants au Canada | Ahmed Bello",
    description: "Liste de contrôle première année pour résidents permanents et permis de travail : crédit canadien, NAS et CELIAPP.",
    lang: "fr-CA",
    heading: "Feuille de Route Financière pour Nouveaux Arrivants",
    summary: "Guide pas à pas pour bâtir un dossier de crédit solide, ouvrir des comptes enregistrés libres d'impôt et comprendre la résidence fiscale.",
  },
  {
    path: "/fr/disclosures",
    title: "Divulgations Réglementaires & Portée Professionnelle | Ahmed Bello",
    description: "Divulgations provinciales relatives aux permis d'exercice, portée des mandats éducatifs, modèles de rémunération et transparence réglementaire.",
    lang: "fr-CA",
    heading: "Divulgations Réglementaires & Portée Professionnelle",
    summary: "Divulgations complètes relatives aux permis d'assurance de personnes dans les provinces et territoires canadiens et limites du mandat éducatif.",
  },
  {
    path: "/fr/standards",
    title: "Normes Éditoriales & Sources Officielles | Ahmed Bello",
    description: "Processus rigoureux de recherche, de validation auprès des organismes gouvernementaux canadiens et de mise à jour de nos guides financiers.",
    lang: "fr-CA",
    heading: "Normes Éditoriales & Vérification des Faits",
    summary: "Notre engagement envers la rigueur analytique, les sources officielles de l'ARC et des banques centrales, et la neutralité pédagogique.",
  },
  {
    path: "/fr/privacy",
    title: "Avis de Confidentialité & Protection des Données | Ahmed Bello",
    description: "Traitement, sécurisation et confidentialité des renseignements personnels sous la législation canadienne LPRPDE et LCAP.",
    lang: "fr-CA",
    heading: "Avis de Confidentialité & Protection des Renseignements Personnels",
    summary: "Politique de confidentialité conforme à la LPRPDE encadrant la collecte, l'utilisation et la protection des renseignements personnels.",
  },
  {
    path: "/fr/terms",
    title: "Conditions d'Utilisation du Site Web | Ahmed Bello",
    description: "Règles, propriété intellectuelle, droits d'auteur et avis de non-responsabilité applicables à l'utilisation de cette ressource éducative canadienne.",
    lang: "fr-CA",
    heading: "Conditions d'Utilisation du Site Web",
    summary: "Conditions juridiques régissant l'accès et l'utilisation de la plateforme d'éducation financière.",
  },
];

// DYNAMICALLY GENERATE ROUTES FOR EVERY ARTICLE (Doctors & Nurses, Capital Gains, TFSA, FHSA, etc.)
const dynamicArticleRoutes = [];

for (const art of articles) {
  const enUrl = art.url; // e.g. "/education/internationally-trained-doctors-nurses-first-year"
  const titleCandidate = `${art.seoTitle || art.title} | Ahmed Bello`;
  const enTitle = titleCandidate.length > 65 ? `${titleCandidate.slice(0, 62)}...` : titleCandidate;

  // English Article Route
  dynamicArticleRoutes.push({
    path: enUrl,
    title: enTitle,
    description: art.description,
    lang: "en-CA",
    heading: art.title,
    summary: art.description,
  });

  // French Article Route
  dynamicArticleRoutes.push({
    path: `/fr${enUrl}`,
    title: `${art.seoTitle || art.title} | Ahmed Bello`,
    description: art.description,
    lang: "fr-CA",
    heading: art.title,
    summary: art.description,
  });
}

const allRoutes = [...coreRoutes, ...dynamicArticleRoutes];

const siteUrl = "https://www.ahmedbello.com";

let count = 0;
for (const r of allRoutes) {
  const isFrench = r.path.startsWith("/fr");
  const enPath = isFrench ? r.path.replace(/^\/fr(\/|$)/, "$1") || "/" : r.path;
  const frPath = isFrench ? r.path : (r.path === "/" ? "/fr" : `/fr${r.path}`);

  const canonicalUrl = `${siteUrl}${r.path === "/" ? "" : r.path}`;
  const enUrl = `${siteUrl}${enPath === "/" ? "" : enPath}`;
  const frUrl = `${siteUrl}${frPath}`;

  const semanticBody = `
    <div style="max-width:800px;margin:2rem auto;padding:1.5rem;font-family:Georgia,serif;color:#1c1b18;line-height:1.6;">
      <header style="border-bottom:1px solid #d6cebd;padding-bottom:1rem;margin-bottom:1.5rem;">
        <p style="font-size:0.8rem;text-transform:uppercase;letter-spacing:0.1em;color:#75581f;font-weight:600;margin:0 0 0.5rem 0;">Ahmed Bello &bull; Licensed Financial Solutions Professional</p>
        <h1 style="font-size:2rem;margin:0 0 0.5rem 0;color:#1c1b18;">${r.heading}</h1>
        <p style="font-size:1.1rem;color:#46423a;margin:0;">${r.summary}</p>
      </header>
      <main>
        <p>${r.description}</p>
        <div style="margin-top:2rem;padding:1rem;background:#fcfaf5;border:1px solid #d6cebd;border-radius:2px;">
          <h2 style="font-size:1.2rem;margin-top:0;">Contact & Direct Practice Enquiries</h2>
          <p><strong>Professional:</strong> Ahmed Bello, Licensed Financial Solutions Professional</p>
          <p><strong>Licensing:</strong> Independent Practice &bull; Licensed Across Canada</p>
          <p><strong>Direct Telephone:</strong> +1-506-899-4941</p>
          <p><strong>Email:</strong> enquiries@ahmedbello.com</p>
        </div>
      </main>
      <footer style="margin-top:2rem;padding-top:1rem;border-top:1px solid #d6cebd;font-size:0.8rem;color:#625d52;">
        <p>&copy; ${new Date().getFullYear()} Ahmed Bello. Educational practice resource for Canadian residents.</p>
      </footer>
    </div>
  `;

  let html = template;

  // Replace Title
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${r.title}</title>`);

  // Replace Description
  html = html.replace(
    /<meta\s+name="description"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta name="description" content="${r.description}" />`
  );

  // Replace Canonical Link & Alternates
  html = html.replace(
    /<link\s+rel="canonical"\s+href="[\s\S]*?"\s*\/?>/i,
    `<link rel="canonical" href="${canonicalUrl}" />\n    <link rel="alternate" hreflang="en-CA" href="${enUrl}" />\n    <link rel="alternate" hreflang="fr-CA" href="${frUrl}" />\n    <link rel="alternate" hreflang="x-default" href="${enUrl}" />`
  );

  // Replace OpenGraph & Twitter tags
  html = html.replace(
    /<meta\s+property="og:title"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta property="og:title" content="${r.title}" />`
  );
  html = html.replace(
    /<meta\s+property="og:description"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta property="og:description" content="${r.description}" />`
  );
  html = html.replace(
    /<meta\s+property="og:url"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta property="og:url" content="${canonicalUrl}" />`
  );
  html = html.replace(
    /<meta\s+name="twitter:title"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta name="twitter:title" content="${r.title}" />`
  );
  html = html.replace(
    /<meta\s+name="twitter:description"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta name="twitter:description" content="${r.description}" />`
  );

  // Update html lang
  html = html.replace(/<html lang="[^"]*"/i, `<html lang="${r.lang}"`);

  // Inject semantic content into root
  html = html.replace('<div id="root"></div>', `<div id="root">${semanticBody}</div>`);

  // Target directory
  const targetDir = r.path === "/" ? distDir : path.join(distDir, r.path.replace(/^\//, ""));
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const targetFile = path.join(targetDir, "index.html");
  fs.writeFileSync(targetFile, html, "utf-8");
  count++;
}

// -----------------------------------------------------------------------------
// PRE-RENDER DEDICATED 404.HTML FOR VERCEL & STATIC CDNs
// -----------------------------------------------------------------------------
const notFoundHtml = template
  .replace(/<title>[\s\S]*?<\/title>/i, `<title>Page Not Found (404) | Ahmed Bello</title>`)
  .replace(
    /<meta\s+name="description"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta name="description" content="The page you requested could not be found. Explore Canadian financial education guides or return to the homepage." />\n    <meta name="robots" content="noindex, follow" />`
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

console.log(`[Static Pre-rendering Complete] Generated ${count} pre-rendered HTML routes and 404.html for Vercel & CDNs.`);
