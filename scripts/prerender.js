import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, "../dist");

const templatePath = path.resolve(distDir, "index.html");
if (!fs.existsSync(templatePath)) {
  console.error("Template dist/index.html not found! Run vite build first.");
  process.exit(1);
}

const template = fs.readFileSync(templatePath, "utf-8");

const routes = [
  // English Routes
  {
    path: "/",
    title: "Ahmed Bello | Financial Education for Canadians",
    description: "Plain-language Canadian financial education on registered accounts (TFSA, RRSP, FHSA), insurance, and family money decisions with Ahmed Bello.",
    lang: "en-CA",
    heading: "Ahmed Bello — Licensed Financial Solutions Professional",
    summary: "Plain-language Canadian financial education on registered accounts (TFSA, RRSP, FHSA), income protection, debt restructuring, and family financial decision-making."
  },
  {
    path: "/about",
    title: "About Ahmed Bello | Licensed Financial Solutions Professional",
    description: "Independent Canadian financial educator helping individuals and families understand registered accounts (TFSA, RRSP, FHSA), insurance, and money decisions.",
    lang: "en-CA",
    heading: "About Ahmed Bello — Financial Educator",
    summary: "I am an independent financial professional helping individuals and families across Canada make intentional, well-grounded money decisions. Rather than starting with a product, I start with education: clarifying how Canadian registered accounts, debt repayment, and income protection interact."
  },
  {
    path: "/contact",
    title: "Start a Financial Conversation | Ahmed Bello",
    description: "Start a plain-language financial conversation with Ahmed Bello, Licensed Financial Solutions Professional. Ask questions without sales pressure.",
    lang: "en-CA",
    heading: "Start a Conversation with Ahmed Bello",
    summary: "Send your questions about Canadian registered accounts, income protection, debt repayment, or newcomer finances directly to Ahmed Bello. No obligation, no sales pitch."
  },
  {
    path: "/education",
    title: "Canadian Financial Education Library | Ahmed Bello",
    description: "Plain-language decision guides on Canadian registered accounts (TFSA, RRSP, FHSA), insurance choices, credit building, and money fundamentals.",
    lang: "en-CA",
    heading: "Canadian Financial Education Library",
    summary: "Explore plain-language guides on TFSA vs RRSP, First Home Savings Account (FHSA), Home Buyers' Plan, credit building for newcomers, and income protection."
  },
  {
    path: "/insights",
    title: "Financial Insights & Strategic Perspectives | Ahmed Bello",
    description: "Deep-dive analytical essays on mortgage renewal shock, Canadian capital gains and deemed disposition at death, and family liquidity architecture.",
    lang: "en-CA",
    heading: "Financial Insights & Strategic Perspectives",
    summary: "Comprehensive analytical articles examining the mechanics of Canadian mortgage renewals, statutory deemed disposition at death under Subsection 70(5), and structured family wealth transitions."
  },
  {
    path: "/news",
    title: "Live Canadian & US Financial News Desk | Ahmed Bello",
    description: "Real-time central bank interest rate decisions, Bank of Canada monetary policy, Federal Reserve updates, and verified North American economic news.",
    lang: "en-CA",
    heading: "Live Macroeconomic Intelligence Desk",
    summary: "Tracking the Bank of Canada policy rate, Federal Reserve FOMC decisions, Statistics Canada CPI inflation figures, and Canada Revenue Agency tax updates in real time."
  },
  {
    path: "/careers",
    title: "Independent Financial Practice Mentorship | Ahmed Bello",
    description: "Comprehensive Canadian provincial LLQP licensing support, practical case co-planning, and independent practice mentorship with Ahmed Bello.",
    lang: "en-CA",
    heading: "Independent Financial Solutions Practice Mentorship",
    summary: "Learn how motivated candidates prepare for provincial LLQP licensing, receive carrier appointments, and build an independent multi-carrier financial practice across Canada."
  },
  {
    path: "/how-i-help",
    title: "How I Help: Structured Financial Guidance | Ahmed Bello",
    description: "Explore Ahmed Bello's educational framework: goal prioritization, registered shelter mechanics, family income protection, and debt repayment strategies.",
    lang: "en-CA",
    heading: "How I Help: Structured Financial Guidance",
    summary: "A transparent framework for organizing family finances: prioritizing immediate liquidity, sheltering capital in registered accounts, and protecting against income disruption."
  },
  {
    path: "/for/healthcare",
    title: "Financial Guidance for Healthcare Workers | Ahmed Bello",
    description: "Tailored financial planning for Canadian doctors, nurses, and medical professionals managing incorporated medicine, licensing, and debt.",
    lang: "en-CA",
    heading: "Financial Planning for Healthcare Workers & Medical Professionals",
    summary: "Strategies for incorporated physicians, registered nurses, and internationally trained medical graduates navigating Canadian taxation, insurance, and student debt."
  },
  {
    path: "/for/business-owners",
    title: "Financial Strategy for Canadian Business Owners | Ahmed Bello",
    description: "Strategies for Canadian-Controlled Private Corporations (CCPCs), corporate retained earnings extraction, and estate liquidity planning.",
    lang: "en-CA",
    heading: "Financial Strategy for Business Owners & CCPCs",
    summary: "Guidance on corporate holding companies, passive income thresholds, Capital Dividend Account (CDA) tax-free distributions, and succession liquidity."
  },
  {
    path: "/for/families",
    title: "Family Financial Decision-Making Guide | Ahmed Bello",
    description: "Practical financial planning for Canadian families: education savings (RESP grants), income protection, mortgage renewals, and estate transfer.",
    lang: "en-CA",
    heading: "Financial Decision-Making for Canadian Families",
    summary: "Maximizing the Canada Education Savings Grant (CESG), calculating term insurance requirements, and balancing mortgage acceleration with registered retirement savings."
  },
  {
    path: "/for/newcomers",
    title: "Newcomers to Canada Financial Roadmap | Ahmed Bello",
    description: "First-year financial checklist for new permanent residents and work permit holders: credit establishment, SIN protection, banking, and FHSA.",
    lang: "en-CA",
    heading: "First-Year Financial Roadmap for Newcomers to Canada",
    summary: "Step-by-step guidance on opening secured credit cards, understanding the Canadian credit bureau scoring system, and opening tax-free registered savings accounts."
  },

  // Key Educational Articles
  {
    path: "/education/new-to-canada-money-basics",
    title: "New to Canada: Your First-Year Financial Checklist | Ahmed Bello",
    description: "The essential first-year financial checklist for newcomers to Canada: SIN protection, banking packages, credit building, and tax return filing.",
    lang: "en-CA",
    heading: "New to Canada: Your First-Year Financial Checklist",
    summary: "A practical guide for new permanent residents on establishing credit history, avoiding predatory loans, and leveraging Canadian government newcomer programs."
  },
  {
    path: "/education/fhsa-with-the-home-buyers-plan",
    title: "Combining the FHSA and Home Buyers' Plan (HBP) | Ahmed Bello",
    description: "How Canadian first-time home buyers can combine the First Home Savings Account (FHSA) with the RRSP Home Buyers' Plan for maximum down payment savings.",
    lang: "en-CA",
    heading: "Combining the FHSA and Home Buyers' Plan for Maximum Down Payment Power",
    summary: "Explaining how couples can withdraw up to $75,000 tax-free under the Home Buyers' Plan and add cumulative FHSA tax-deductible savings for a first home down payment."
  },
  {
    path: "/education/tfsa-vs-rrsp",
    title: "TFSA vs RRSP: How to Choose Based on Your Income | Ahmed Bello",
    description: "A clear comparison between the Tax-Free Savings Account (TFSA) and Registered Retirement Savings Plan (RRSP) for Canadian income earners.",
    lang: "en-CA",
    heading: "TFSA vs RRSP: How to Choose Based on Your Income and Tax Bracket",
    summary: "Detailed analysis of marginal tax rates, retirement clawbacks on GIS/OAS, and when TFSA contributions provide greater flexibility than RRSP deductions."
  },
  {
    path: "/education/term-vs-permanent-life-insurance",
    title: "Term vs Permanent Life Insurance: How to Choose | Ahmed Bello",
    description: "Term insurance covers temporary liabilities like mortgages. Permanent insurance covers lifelong capital gains taxes and estate liquidity. How to choose.",
    lang: "en-CA",
    heading: "Term vs Permanent Life Insurance: How to Choose in Canada",
    summary: "Comparing premium structures, conversion options, and underwriting criteria to protect family income versus creating tax-sheltered estate transfer."
  },
  {
    path: "/insights/canadian-capital-gains-deemed-disposition-estate-trap",
    title: "Capital Gains & Deemed Disposition at Death Guide | Ahmed Bello",
    description: "Canada has no formal inheritance tax, but the CRA’s statutory 'deemed disposition at death' triggers capital gains tax on cottages and rental property. How the 50% rule works.",
    lang: "en-CA",
    heading: "Capital Gains & Deemed Disposition at Death: Navigating Canada's Silent Estate Tax",
    summary: "Explaining Subsection 70(5) of the Income Tax Act, why the proposed 66.7% rate was cancelled, how the statutory 50% inclusion rate works, and case study numbers on cottage estate liquidity."
  },
  {
    path: "/insights/canadian-mortgage-renewal-shock-liquidity-trap",
    title: "Canadian Mortgage Renewal Shock & Liquidity Guide | Ahmed Bello",
    description: "How Canadian homeowners face sharp mortgage payment renewals, the stress test impact, and how to restructure household liquidity before signing.",
    lang: "en-CA",
    heading: "Mortgage Renewal Shock: How Rate Moves Impact Your Household Budget",
    summary: "Strategies for managing variable-to-fixed renewals, evaluating amortization adjustments, and preserving liquid emergency reserves."
  },

  // French Routes
  {
    path: "/fr",
    title: "Ahmed Bello | Éducation Financière pour Canadiens",
    description: "Éducation financière en langage clair sur les régimes enregistrés (CELI, REER, CELIAPP), l'assurance vie et les décisions budgétaires avec Ahmed Bello.",
    lang: "fr-CA",
    heading: "Ahmed Bello — Professionnel en Solutions Financières",
    summary: "Éducation financière accessible et indépendante au Canada : régimes enregistrés, protection du revenu familial, remboursement des dettes et investissement réfléchi."
  },
  {
    path: "/fr/about",
    title: "À Propos d'Ahmed Bello | Professionnel Agréé au Canada",
    description: "Éducateur financier indépendant aidant les familles et particuliers au Canada à comprendre les régimes enregistrés (CELI, REER) et la prévoyance.",
    lang: "fr-CA",
    heading: "À Propos d'Ahmed Bello — Éducateur Financier",
    summary: "Pratique financière indépendante axée sur l'éducation et la transparence, agréée dans toutes les provinces canadiennes."
  },
  {
    path: "/fr/contact",
    title: "Démarrer une Conversation | Ahmed Bello",
    description: "Échangez directement avec Ahmed Bello, professionnel agréé en solutions financières. Posez vos questions sans pression commerciale.",
    lang: "fr-CA",
    heading: "Démarrer une Conversation avec Ahmed Bello",
    summary: "Posez vos questions sur les régimes enregistrés, la protection de votre revenu ou vos démarches financières au Canada en toute confidentialité."
  },
  {
    path: "/fr/education",
    title: "Bibliothèque d'Éducation Financière | Ahmed Bello",
    description: "Guides pratiques et outils sur les comptes enregistrés (CELI, REER, CELIAPP), l'assurance vie, le crédit et les finances pour nouveaux arrivants.",
    lang: "fr-CA",
    heading: "Bibliothèque d'Éducation Financière pour Canadiens",
    summary: "Consultez nos guides détaillés sur le CELI, le REER, le CELIAPP, le crédit canadien et les étapes financières des nouveaux arrivants."
  },
  {
    path: "/fr/news",
    title: "Veille Économique & Décisions Monétaires | Ahmed Bello",
    description: "Surveillance en temps réel des taux de la Banque du Canada, de la Réserve Fédérale, de l'inflation et des règles fiscales de l'ARC.",
    lang: "fr-CA",
    heading: "Bureau d'Actualités Financières & Décisions Monétaires",
    summary: "Suivi en direct des décisions de taux de la Banque du Canada, des annonces de l'Agence du Revenu du Canada et de l'indice des prix à la consommation."
  },
  {
    path: "/fr/careers",
    title: "Mentorat Professionnel Indépendant | Ahmed Bello",
    description: "Accompagnement éducatif et préparation aux examens provinciaux du PQAP pour bâtir un cabinet de solutions financières au Canada.",
    lang: "fr-CA",
    heading: "Mentorat en Solutions Financières Indépendantes",
    summary: "Découvrez notre programme d'accompagnement gratuit pour la préparation aux examens du PQAP et le développement d'une pratique financière indépendante."
  },
  {
    path: "/fr/how-i-help",
    title: "Comment J'Accompagne Vos Décisions | Ahmed Bello",
    description: "L'approche d'Ahmed Bello : priorisation des objectifs, régimes enregistrés, protection du revenu familial et stratégies de dette.",
    lang: "fr-CA",
    heading: "Comment J'Accompagne Vos Décisions Financières",
    summary: "Un cadre méthodique pour organiser vos finances personnelles, protéger votre foyer et optimiser vos régimes fiscaux canadiens."
  },
  {
    path: "/fr/for/healthcare",
    title: "Planification Financière Professionnels de Santé | Ahmed Bello",
    description: "Orientation financière pour médecins, infirmières et diplômés internationaux en santé au Canada.",
    lang: "fr-CA",
    heading: "Planification Financière pour Professionnels de la Santé",
    summary: "Stratégies pour médecins incorporés, infirmières autorisées et professionnels formés à l'étranger : équivalences, fiscalité et protection du revenu."
  },
  {
    path: "/fr/for/business-owners",
    title: "Stratégie Financière pour Chefs d'Entreprise | Ahmed Bello",
    description: "Conseils pour Sociétés Privées sous Contrôle Canadien (SPCC), surplus accumulés et fiscalité corporative.",
    lang: "fr-CA",
    heading: "Stratégie Financière pour Propriétaires d'Entreprise",
    summary: "Gestion des sociétés de gestion, seuils de revenus passifs, compte de dividendes en capital (CDC) et relève d'entreprise."
  },
  {
    path: "/fr/for/families",
    title: "Guide Financier pour Familles Canadiennes | Ahmed Bello",
    description: "Planification pour familles : épargne-études REEE, protection du revenu, renouvellement hypothécaire et succession.",
    lang: "fr-CA",
    heading: "Décisions Financières pour les Familles au Canada",
    summary: "Maximisation de la Subvention canadienne pour l'épargne-études (SCEE), assurance temporaire et équilibre entre hypothèque et retraite."
  },
  {
    path: "/fr/for/newcomers",
    title: "Guide Financier pour Nouveaux Arrivants au Canada | Ahmed Bello",
    description: "Liste de contrôle première année pour résidents permanents et permis de travail : crédit canadien, NAS et CELIAPP.",
    lang: "fr-CA",
    heading: "Feuille de Route Financière pour Nouveaux Arrivants",
    summary: "Guide pas à pas pour bâtir un dossier de crédit solide, ouvrir des comptes enregistrés libres d'impôt et comprendre la résidence fiscale."
  },
  {
    path: "/legal/disclosures",
    title: "Regulatory Disclosures & Licensing Information | Ahmed Bello",
    description: "Canadian provincial insurance licensing disclosures, regulatory oversight, and independent brokerage affiliations for Ahmed Bello.",
    lang: "en-CA",
    heading: "Regulatory Disclosures & Licensing Information",
    summary: "Full disclosure of provincial financial licensing, regulatory adherence across Canadian provinces and territories, and product provider relationships."
  },
  {
    path: "/legal/privacy",
    title: "Privacy Policy & Personal Data Protection | Ahmed Bello",
    description: "PIPEDA-compliant privacy policy detailing how client personal information is collected, safeguarded, and handled with confidentiality.",
    lang: "en-CA",
    heading: "Privacy Policy & Data Protection",
    summary: "Commitment to Canadian federal and provincial privacy legislation (PIPEDA). No data selling, no third-party tracking, and encrypted transmissions."
  },
  {
    path: "/legal/standards",
    title: "Professional Standards & Fiduciary Principles | Ahmed Bello",
    description: "Our core professional code: objective client education, conflict-of-interest transparency, and suitability across all recommendations.",
    lang: "en-CA",
    heading: "Professional Standards & Conduct",
    summary: "Guiding principles of education-first practice, transparent compensation disclosures, and rigorous statutory suitability reviews."
  },
  {
    path: "/legal/terms",
    title: "Terms of Website Use & Legal Notice | Ahmed Bello",
    description: "Terms and conditions governing the educational materials, financial calculators, and content published on ahmedbello.com.",
    lang: "en-CA",
    heading: "Terms of Use & Legal Notices",
    summary: "Clear legal boundaries: website materials are provided for general educational purposes and do not constitute individual legal, accounting, or tax advice."
  }
];

const siteUrl = "https://www.ahmedbello.com";

let count = 0;
for (const r of routes) {
  const isFrench = r.path.startsWith("/fr");
  const enPath = isFrench ? r.path.replace(/^\/fr(\/|$)/, "$1") || "/" : r.path;
  const frPath = isFrench ? r.path : (r.path === "/" ? "/fr" : `/fr${r.path}`);

  const canonicalUrl = `${siteUrl}${r.path === "/" ? "" : r.path}`;
  const enUrl = `${siteUrl}${enPath === "/" ? "" : enPath}`;
  const frUrl = `${siteUrl}${frPath}`;

  // Semantic fallback HTML inserted inside <div id="root">
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

  // Replace Canonical Link
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

console.log(`[Static Pre-rendering Complete] Generated ${count} pre-rendered HTML routes for Vercel & CDNs.`);
