export const SITE_URL = "https://www.ahmedbello.com";
export const BRAND_NAME = "Ahmed Bello";
export const MAX_TITLE_LENGTH = 60;
export const MAX_DESCRIPTION_LENGTH = 155;

export interface RouteSeoEntry {
  path: string;
  basePath: string;
  lang: "en-CA" | "fr-CA";
  title: string;
  description: string;
  heading: string;
  summary: string;
  ogType?: "website" | "article";
  priority?: string;
  changefreq?: "weekly" | "monthly" | "yearly";
  noIndex?: boolean;
}

export interface ArticleFrSeoEntry {
  seoTitle: string;
  title: string;
  description: string;
}

/**
 * Formats page titles to strictly stay within 60 characters without truncation ellipses.
 */
export function formatStrictTitle(
  rawTitle: string,
  brand = BRAND_NAME,
  maxLen = MAX_TITLE_LENGTH
): string {
  const brandSuffix = ` | ${brand}`;
  const clean = rawTitle.replace(/\s+/g, " ").trim();

  if (clean.includes(brand) || clean.includes("|")) {
    if (clean.length <= maxLen) return clean;
    const slice = clean.slice(0, maxLen);
    const lastSpace = slice.lastIndexOf(" ");
    return (lastSpace > 20 ? slice.slice(0, lastSpace) : slice).trim();
  }

  const withBrand = `${clean}${brandSuffix}`;
  if (withBrand.length <= maxLen) return withBrand;

  const allowed = maxLen - brandSuffix.length;
  const slice = clean.slice(0, allowed);
  const lastSpace = slice.lastIndexOf(" ");
  const trimmed = (lastSpace > 15 ? slice.slice(0, lastSpace) : slice).trim();
  return `${trimmed}${brandSuffix}`;
}

export function normalizeRoutePath(pathname: string): string {
  if (!pathname || pathname === "/") return "/";
  return pathname.length > 1 && pathname.endsWith("/")
    ? pathname.slice(0, -1)
    : pathname;
}

export function getBasePath(pathname: string): string {
  const norm = normalizeRoutePath(pathname);
  if (norm === "/fr") return "/";
  if (norm.startsWith("/fr/")) return norm.slice(3);
  return norm;
}

export function getCanonicalUrl(pathname: string): string {
  const norm = normalizeRoutePath(pathname);
  return norm === "/" ? `${SITE_URL}/` : `${SITE_URL}${norm}`;
}

export function getLanguageUrls(pathname: string): {
  enUrl: string;
  frUrl: string;
  canonicalUrl: string;
} {
  const norm = normalizeRoutePath(pathname);
  const basePath = getBasePath(norm);
  const enUrl = basePath === "/" ? `${SITE_URL}/` : `${SITE_URL}${basePath}`;
  const frUrl = basePath === "/" ? `${SITE_URL}/fr` : `${SITE_URL}/fr${basePath}`;
  const canonicalUrl = getCanonicalUrl(norm);
  return { enUrl, frUrl, canonicalUrl };
}

export const CORE_ROUTES_SEO: RouteSeoEntry[] = [
  // =========================================================================
  // ENGLISH CORE ROUTES
  // =========================================================================
  {
    path: "/",
    basePath: "/",
    lang: "en-CA",
    title: "Canadian Wealth & Protection Planning | Ahmed Bello",
    description:
      "Tax-efficient wealth strategy, income protection, and registered account planning for Canadian families, CCPCs, healthcare pros, and newcomers.",
    heading: "Ahmed Bello | Licensed Financial Solutions Professional",
    summary:
      "Plain-language Canadian financial education on registered accounts (TFSA, RRSP, FHSA), income protection, debt restructuring, and family money decisions.",
    priority: "1.0",
    changefreq: "weekly",
  },
  {
    path: "/how-i-help",
    basePath: "/how-i-help",
    lang: "en-CA",
    title: "How I Help: Structured Financial Guidance | Ahmed Bello",
    description:
      "Explore Ahmed Bello's educational framework: goal prioritization, registered tax shelters, family income protection, and debt strategies in Canada.",
    heading: "How I Help: Structured Financial Guidance",
    summary:
      "A transparent framework for organizing family finances: prioritizing immediate liquidity, sheltering capital, and protecting against income disruption.",
    priority: "0.9",
    changefreq: "monthly",
  },
  {
    path: "/education",
    basePath: "/education",
    lang: "en-CA",
    title: "Canadian Financial Education Library | Ahmed Bello",
    description:
      "Plain-language guides on Canadian registered accounts (TFSA, RRSP, FHSA), life insurance, credit building, and household money fundamentals.",
    heading: "Canadian Financial Education Library",
    summary:
      "Explore plain-language guides on TFSA vs RRSP, the FHSA, Home Buyers' Plan, newcomer credit building, and family income protection.",
    priority: "0.9",
    changefreq: "weekly",
  },
  {
    path: "/what-changed",
    basePath: "/what-changed",
    lang: "en-CA",
    title: "What Changed in Canadian Money Rules | Ahmed Bello",
    description:
      "Monthly plain-language analysis of Bank of Canada rates, OSFI mortgage rules, CRA contribution limits, and federal tax law updates.",
    heading: "What Changed in Canadian Money Rules",
    summary:
      "Curated monthly brief covering policy rate announcements, OSFI mortgage straight-switch rules, CRA contribution rooms, and federal tax changes.",
    priority: "0.9",
    changefreq: "monthly",
  },
  {
    path: "/costly-blindspots",
    basePath: "/costly-blindspots",
    lang: "en-CA",
    title: "Costly Canadian Money Blindspots | Ahmed Bello",
    description:
      "Verified Canadian financial blindspots, overlooked government grants, and tax traps that families and professionals discover too late.",
    heading: "Costly Canadian Money Blindspots",
    summary:
      "Critical statutory rules, government grants, and tax traps across family savings, home buying, retirement, and estate planning in Canada.",
    priority: "0.95",
    changefreq: "weekly",
  },
  {
    path: "/insights",
    basePath: "/insights",
    lang: "en-CA",
    title: "Financial Insights & Strategic Essays | Ahmed Bello",
    description:
      "Deep-dive analytical essays on Canadian mortgage renewals, CCPC passive income limits, capital gains, and family wealth architecture.",
    heading: "Financial Insights & Strategic Essays",
    summary:
      "Comprehensive analytical essays examining Canadian mortgage renewals, statutory liquidity reserves, corporate tax rules, and estate planning.",
    priority: "0.85",
    changefreq: "weekly",
  },
  {
    path: "/for/healthcare",
    basePath: "/for/healthcare",
    lang: "en-CA",
    title: "Financial Planning for Healthcare | Ahmed Bello",
    description:
      "Financial education for Canadian doctors, nurses, and medical professionals navigating licensing, incorporation, and income protection.",
    heading: "Financial Planning for Healthcare Workers & Physicians",
    summary:
      "Strategies for incorporated physicians, nurses, and internationally trained medical professionals navigating Canadian taxes and income protection.",
    priority: "0.85",
    changefreq: "weekly",
  },
  {
    path: "/for/business-owners",
    basePath: "/for/business-owners",
    lang: "en-CA",
    title: "CCPC Tax Efficiency & SBD Strategy | Ahmed Bello",
    description:
      "Understand corporate tax integration, the $50,000 small business passive income threshold, CDA extraction, and succession planning.",
    heading: "Financial Strategy for Business Owners & CCPCs",
    summary:
      "Guidance on corporate holding companies, passive income thresholds, Capital Dividend Account (CDA) distributions, and succession liquidity.",
    priority: "0.85",
    changefreq: "weekly",
  },
  {
    path: "/for/families",
    basePath: "/for/families",
    lang: "en-CA",
    title: "Financial Guidance for Families | Ahmed Bello",
    description:
      "Practical financial education for Canadian families: RESP grants, term life insurance, mortgage renewals, and estate planning basics.",
    heading: "Financial Decision-Making for Canadian Families",
    summary:
      "Maximizing the Canada Education Savings Grant (CESG), sizing term insurance, and balancing mortgage payoff with registered savings.",
    priority: "0.85",
    changefreq: "weekly",
  },
  {
    path: "/for/newcomers",
    basePath: "/for/newcomers",
    lang: "en-CA",
    title: "Newcomer Financial Blueprint Canada | Ahmed Bello",
    description:
      "Navigate Canadian banking, credit building, emergency reserves, and TFSA, RRSP, and FHSA rules with our first-year newcomer roadmap.",
    heading: "First-Year Financial Roadmap for Newcomers to Canada",
    summary:
      "Step-by-step guidance on building Canadian credit history, setting up liquid reserves, and opening registered tax-sheltered accounts.",
    priority: "0.85",
    changefreq: "weekly",
  },
  {
    path: "/calculators",
    basePath: "/calculators",
    lang: "en-CA",
    title: "Canadian Financial Planning Calculators | Ahmed Bello",
    description:
      "Compare TFSA vs. RRSP vs. FHSA growth, newcomer financial runway, mortgage renewals, and CCPC passive income in real time.",
    heading: "Interactive Canadian Financial Calculators",
    summary:
      "Model real Canadian financial scenarios using current CRA contribution limits, tax rules, and compound growth formulas.",
    priority: "0.9",
    changefreq: "weekly",
  },
  {
    path: "/calculators/amt",
    basePath: "/calculators/amt",
    lang: "en-CA",
    title: "Alternative Minimum Tax Calculator Canada | Ahmed Bello",
    description:
      "Estimate whether Canada's alternative minimum tax applies to you. Free calculator for capital gains, dividends, donations and carry-forward.",
    heading: "Alternative Minimum Tax (AMT) Calculator Canada",
    summary:
      "Model how post-2024 federal AMT reforms (Bills C-59 and C-69) affect capital gains, dividends, charitable donations, and 7-year recovery.",
    priority: "0.9",
    changefreq: "weekly",
  },
  {
    path: "/investing/islamic-equity",
    basePath: "/investing/islamic-equity",
    lang: "en-CA",
    title: "Islamic Equity Investing in Canada | Ahmed Bello",
    description:
      "Educational guide on Shari'ah-compliant global equity investing under AAOIFI standards and Canadian TFSA, RRSP, FHSA, and RESP accounts.",
    heading: "Islamic Equity Investing in Canada: Educational Guide",
    summary:
      "Understand Shari'ah equity screening, benchmark index tracking (MSCI ACWI Islamic Index), and Canadian registered account options.",
    priority: "0.95",
    changefreq: "weekly",
  },
  {
    path: "/about",
    basePath: "/about",
    lang: "en-CA",
    title: "About Ahmed Bello | Financial Solutions Canada",
    description:
      "Independent Canadian financial educator helping families understand registered accounts (TFSA, RRSP, FHSA), insurance, and money decisions.",
    heading: "About Ahmed Bello | Financial Educator",
    summary:
      "Independent financial professional helping individuals and families across Canada make intentional, informed money decisions through education.",
    priority: "0.75",
    changefreq: "monthly",
  },
  {
    path: "/careers",
    basePath: "/careers",
    lang: "en-CA",
    title: "Practice Expansion & Careers | Ahmed Bello",
    description:
      "Canadian provincial LLQP licensing support, case co-planning, and independent financial practice mentorship with Ahmed Bello.",
    heading: "Independent Financial Practice Mentorship",
    summary:
      "Learn how candidates prepare for provincial LLQP licensing and build an independent financial solutions practice across Canada.",
    priority: "0.85",
    changefreq: "weekly",
  },
  {
    path: "/contact",
    basePath: "/contact",
    lang: "en-CA",
    title: "Start a Financial Conversation | Ahmed Bello",
    description:
      "Start a plain-language financial conversation with Ahmed Bello, Licensed Financial Solutions Professional. Ask questions with zero sales pressure.",
    heading: "Start a Conversation with Ahmed Bello",
    summary:
      "Send your questions about Canadian registered accounts, income protection, debt repayment, or newcomer finances directly to Ahmed Bello.",
    priority: "0.8",
    changefreq: "monthly",
  },
  {
    path: "/disclosures",
    basePath: "/disclosures",
    lang: "en-CA",
    title: "Regulatory Disclosures & Scope | Ahmed Bello",
    description:
      "Canadian provincial licensing disclosures, regulatory oversight, compensation transparency, and practice scope boundaries for Ahmed Bello.",
    heading: "Regulatory Disclosures & Professional Scope",
    summary:
      "Full disclosure of provincial financial licensing across Canada, compensation transparency, and educational scope boundaries.",
    priority: "0.5",
    changefreq: "yearly",
  },
  {
    path: "/standards",
    basePath: "/standards",
    lang: "en-CA",
    title: "Editorial Standards & Sources | Ahmed Bello",
    description:
      "How financial guides on this website are researched, verified against official Canadian government sources, dated, and reviewed.",
    heading: "Editorial Standards & Verification Framework",
    summary:
      "Our commitment to factual accuracy, official regulatory citations, transparent arithmetic, and timely corrections.",
    priority: "0.5",
    changefreq: "yearly",
  },
  {
    path: "/privacy",
    basePath: "/privacy",
    lang: "en-CA",
    title: "Privacy Notice & Data Protection | Ahmed Bello",
    description:
      "How personal information from enquiries is handled, protected, and kept private under Canadian PIPEDA and CASL standards.",
    heading: "Privacy Notice & Client Confidentiality",
    summary:
      "PIPEDA-compliant privacy notice detailing how enquiry details are collected, safeguarded, and handled confidentially.",
    priority: "0.5",
    changefreq: "yearly",
  },
  {
    path: "/terms",
    basePath: "/terms",
    lang: "en-CA",
    title: "Website Terms of Use | Ahmed Bello",
    description:
      "Terms and ground rules for using this Canadian financial education website, intellectual property, and limitations of liability.",
    heading: "Website Terms of Use",
    summary:
      "Clear legal terms governing website access, educational copyright, and financial disclaimer boundaries.",
    priority: "0.5",
    changefreq: "yearly",
  },
  {
    path: "/confirm-subscription",
    basePath: "/confirm-subscription",
    lang: "en-CA",
    title: "Subscription Confirmed | Ahmed Bello",
    description: "Your educational newsletter subscription preference has been verified.",
    heading: "Subscription Preferences Confirmed",
    summary:
      "Your email address has been verified for Canadian financial education briefings.",
    noIndex: true,
  },

  // =========================================================================
  // FRENCH CORE ROUTES
  // =========================================================================
  {
    path: "/fr",
    basePath: "/",
    lang: "fr-CA",
    title: "Architecture Financière & Protection | Ahmed Bello",
    description:
      "Stratégie patrimoniale fiscalement efficiente et protection du revenu pour familles canadiennes, SPCC, professionnels de santé et nouveaux arrivants.",
    heading: "Ahmed Bello | Professionnel en Solutions Financières Agréé",
    summary:
      "Éducation financière claire au Canada : régimes enregistrés (CELI, REER, CELIAPP), protection du revenu familial et décisions patrimoniales.",
    priority: "0.95",
    changefreq: "weekly",
  },
  {
    path: "/fr/how-i-help",
    basePath: "/how-i-help",
    lang: "fr-CA",
    title: "Comment J'Accompagne Vos Décisions | Ahmed Bello",
    description:
      "Approche d'Ahmed Bello : priorisation des objectifs, régimes enregistrés (CELI, REER), protection du revenu et stratégies de dette.",
    heading: "Comment J'Accompagne Vos Décisions Financières",
    summary:
      "Un cadre méthodique pour organiser vos finances personnelles, protéger votre foyer et optimiser vos comptes enregistrés.",
    priority: "0.86",
    changefreq: "monthly",
  },
  {
    path: "/fr/education",
    basePath: "/education",
    lang: "fr-CA",
    title: "Bibliothèque d'Éducation Financière | Ahmed Bello",
    description:
      "Guides pratiques sur les comptes enregistrés canadiens (CELI, REER, CELIAPP), l'assurance vie, le crédit et les finances familiales.",
    heading: "Bibliothèque d'Éducation Financière au Canada",
    summary:
      "Consultez nos guides sur le CELI, le REER, le CELIAPP, le crédit canadien et la protection financière.",
    priority: "0.86",
    changefreq: "weekly",
  },
  {
    path: "/fr/what-changed",
    basePath: "/what-changed",
    lang: "fr-CA",
    title: "Règles Financières Canadiennes | Ahmed Bello",
    description:
      "Analyse mensuelle des taux de la Banque du Canada, des règles hypothécaires du BSIF, des plafonds de l'ARC et des changements fiscaux.",
    heading: "Ce qui a changé dans les règles financières canadiennes",
    summary:
      "Synthèse mensuelle des décisions monétaires, des règles du BSIF et des modifications fiscales fédérales.",
    priority: "0.86",
    changefreq: "monthly",
  },
  {
    path: "/fr/costly-blindspots",
    basePath: "/costly-blindspots",
    lang: "fr-CA",
    title: "Pièges Financiers Coûteux au Canada | Ahmed Bello",
    description:
      "Règles financières méconnues au Canada : subventions oubliées, délais légaux et pièges fiscaux découverts trop tard. Actions concrètes.",
    heading: "Pièges Financiers Coûteux au Canada",
    summary:
      "Règles statutaires, subventions fédérales et pièges fiscaux souvent découverts trop tard par les ménages canadiens.",
    priority: "0.90",
    changefreq: "weekly",
  },
  {
    path: "/fr/insights",
    basePath: "/insights",
    lang: "fr-CA",
    title: "Perspectives & Analyses Stratégiques | Ahmed Bello",
    description:
      "Essais analytiques sur le renouvellement hypothécaire canadien, les seuils de revenu passif des SPCC et la transmission patrimoniale.",
    heading: "Perspectives & Analyses Stratégiques",
    summary:
      "Analyses approfondies sur le renouvellement hypothécaire, les réserves de liquidité et la fiscalité des sociétés.",
    priority: "0.81",
    changefreq: "weekly",
  },
  {
    path: "/fr/for/healthcare",
    basePath: "/for/healthcare",
    lang: "fr-CA",
    title: "Orientation Financière Santé | Ahmed Bello",
    description:
      "Planification pour médecins, infirmières et diplômés internationaux en santé au Canada : équivalences, fiscalité et protection.",
    heading: "Planification Financière pour Professionnels de Santé",
    summary:
      "Stratégies pour médecins incorporés, personnel infirmier et diplômés internationaux en santé au Canada.",
    priority: "0.81",
    changefreq: "weekly",
  },
  {
    path: "/fr/for/business-owners",
    basePath: "/for/business-owners",
    lang: "fr-CA",
    title: "Efficience Fiscale SPCC & DPE | Ahmed Bello",
    description:
      "Optimisez la fiscalité de votre société, gérez le seuil de 50 000 $ de revenus passifs de la DPE et structurez le CDC.",
    heading: "Stratégie Financière pour Propriétaires de SPCC",
    summary:
      "Gestion des revenus passifs de société, seuil de la DPE, compte de dividendes en capital (CDC) et relève.",
    priority: "0.81",
    changefreq: "weekly",
  },
  {
    path: "/fr/for/families",
    basePath: "/for/families",
    lang: "fr-CA",
    title: "Orientation Financière Familles | Ahmed Bello",
    description:
      "Planification familiale au Canada : subvention REEE, assurance temporaire, renouvellement hypothécaire et transfert successoral.",
    heading: "Décisions Financières pour les Familles au Canada",
    summary:
      "Maximisation des subventions REEE (SCEE et BEC), assurance vie temporaire et équilibre hypothèque-retraite.",
    priority: "0.81",
    changefreq: "weekly",
  },
  {
    path: "/fr/for/newcomers",
    basePath: "/for/newcomers",
    lang: "fr-CA",
    title: "Plan Financier Nouveaux Arrivants | Ahmed Bello",
    description:
      "Bâtissez votre crédit canadien, structurez vos réserves de liquidité et ouvrez vos comptes CELI, REER et CELIAPP dès la première année.",
    heading: "Feuille de Route Financière pour Nouveaux Arrivants",
    summary:
      "Guide pratique pour établir votre crédit canadien, sécuriser vos réserves et utiliser les régimes enregistrés.",
    priority: "0.81",
    changefreq: "weekly",
  },
  {
    path: "/fr/calculators",
    basePath: "/calculators",
    lang: "fr-CA",
    title: "Simulateurs Financiers Canadiens | Ahmed Bello",
    description:
      "Comparez CELI, REER et CELIAPP, calculez votre coussin d'arrivée, simulez votre hypothèque et évaluez la DPE en temps réel.",
    heading: "Simulateurs Financiers Canadiens Interactifs",
    summary:
      "Modélisez vos décisions financières canadiennes selon les plafonds et taux fiscaux officiels de l'ARC.",
    priority: "0.86",
    changefreq: "weekly",
  },
  {
    path: "/fr/calculators/amt",
    basePath: "/calculators/amt",
    lang: "fr-CA",
    title: "Calculateur d'IMR au Canada | Ahmed Bello",
    description:
      "Estimez si l'impôt minimum de remplacement fédéral (IMR) s'applique à vos gains en capital, dividendes et dons de bienfaisance.",
    heading: "Calculateur d'Impôt Minimum de Remplacement (IMR)",
    summary:
      "Évaluez l'impact des règles fédérales de l'IMR (projets de loi C-59 et C-69) sur vos gains, dividendes et crédits de report.",
    priority: "0.86",
    changefreq: "weekly",
  },
  {
    path: "/fr/investing/islamic-equity",
    basePath: "/investing/islamic-equity",
    lang: "fr-CA",
    title: "Investissement Islamique Canada | Ahmed Bello",
    description:
      "Guide éducatif sur les actions mondiales conformes à la charia selon les normes AAOIFI dans vos comptes CELI, REER, CELIAPP et REEE.",
    heading: "Investissement Islamique au Canada : Cadre Éducatif",
    summary:
      "Comprendre le filtrage éthique islamique, les indices de référence et les comptes enregistrés canadiens.",
    priority: "0.90",
    changefreq: "weekly",
  },
  {
    path: "/fr/about",
    basePath: "/about",
    lang: "fr-CA",
    title: "À Propos d'Ahmed Bello | Solutions Canada",
    description:
      "Éducateur financier indépendant aidant les familles au Canada à comprendre les régimes enregistrés (CELI, REER) et la protection.",
    heading: "À Propos d'Ahmed Bello | Éducateur Financier",
    summary:
      "Pratique financière indépendante axée sur l'éducation et la transparence partout au Canada.",
    priority: "0.71",
    changefreq: "monthly",
  },
  {
    path: "/fr/careers",
    basePath: "/careers",
    lang: "fr-CA",
    title: "Expansion du Cabinet & Carrières | Ahmed Bello",
    description:
      "Accompagnement éducatif et préparation aux examens provinciaux du PQAP pour bâtir une pratique financière indépendante au Canada.",
    heading: "Expansion du Cabinet & Mentorat PQAP",
    summary:
      "Découvrez notre accompagnement pour réussir les examens du PQAP et développer une pratique financière indépendante.",
    priority: "0.81",
    changefreq: "weekly",
  },
  {
    path: "/fr/contact",
    basePath: "/contact",
    lang: "fr-CA",
    title: "Démarrer une Conversation | Ahmed Bello",
    description:
      "Échangez directement avec Ahmed Bello, professionnel agréé en solutions financières. Posez vos questions sans pression commerciale.",
    heading: "Démarrer une Conversation avec Ahmed Bello",
    summary:
      "Posez vos questions sur les régimes enregistrés, la protection du revenu ou vos démarches financières au Canada.",
    priority: "0.76",
    changefreq: "monthly",
  },
  {
    path: "/fr/disclosures",
    basePath: "/disclosures",
    lang: "fr-CA",
    title: "Divulgations Réglementaires | Ahmed Bello",
    description:
      "Divulgations provinciales relatives aux permis d'exercice, portée éducative, modes de rémunération et transparence réglementaire.",
    heading: "Divulgations Réglementaires & Portée",
    summary:
      "Divulgations complètes relatives aux permis canadiens, aux modes de rémunération et à la portée éducative.",
    priority: "0.48",
    changefreq: "yearly",
  },
  {
    path: "/fr/standards",
    basePath: "/standards",
    lang: "fr-CA",
    title: "Normes Éditoriales & Sources | Ahmed Bello",
    description:
      "Comment nos guides financiers sont documentés, vérifiés auprès des sources officielles canadiennes, datés et révisés régulièrement.",
    heading: "Normes Éditoriales & Sources Officielles",
    summary:
      "Notre engagement envers l'exactitude factuelle, les citations officielles canadiennes et la neutralité pédagogique.",
    priority: "0.48",
    changefreq: "yearly",
  },
  {
    path: "/fr/privacy",
    basePath: "/privacy",
    lang: "fr-CA",
    title: "Avis de Confidentialité & LPRPDE | Ahmed Bello",
    description:
      "Traitement, sécurisation et confidentialité des renseignements personnels selon les lois canadiennes LPRPDE et LCAP.",
    heading: "Avis de Confidentialité & Protection des Données",
    summary:
      "Politique conforme à la LPRPDE encadrant la collecte et la protection des renseignements personnels.",
    priority: "0.48",
    changefreq: "yearly",
  },
  {
    path: "/fr/terms",
    basePath: "/terms",
    lang: "fr-CA",
    title: "Conditions d'Utilisation | Ahmed Bello",
    description:
      "Règles, propriété intellectuelle et limites de responsabilité applicables à cette ressource canadienne d'éducation financière.",
    heading: "Conditions d'Utilisation du Site Web",
    summary:
      "Conditions juridiques régissant l'accès au site et les limites du contenu éducatif.",
    priority: "0.48",
    changefreq: "yearly",
  },
  {
    path: "/fr/confirm-subscription",
    basePath: "/confirm-subscription",
    lang: "fr-CA",
    title: "Abonnement Confirmé | Ahmed Bello",
    description:
      "Votre confirmation d'abonnement aux résumés éducatifs canadiens est enregistrée.",
    heading: "Préférences d'Abonnement Confirmées",
    summary:
      "Votre adresse courriel a été confirmée pour recevoir les analyses éducatives canadiennes.",
    noIndex: true,
  },
];

/**
 * Localized French SEO titles (max 46 chars before " | Ahmed Bello") and
 * descriptions (max 155 chars) for every active article slug.
 */
export const ARTICLE_FR_SEO: Record<string, ArticleFrSeoEntry> = {
  "tfsa-vs-rrsp": {
    seoTitle: "CELI vs REER : comparer les deux comptes",
    title: "CELI vs REER : une décision au-delà de la déduction fiscale",
    description:
      "Les deux régimes protègent vos placements de l'impôt à des moments opposés. Voici comment taux marginal et flexibilité guident le choix.",
  },
  "investment-risk-vs-goal-risk": {
    seoTitle: "Risque boursier vs risque d'échec",
    title: "Risque de marché ou risque de manquer votre objectif ?",
    description:
      "La volatilité se remarque vite, mais manquer la cible financière détermine le résultat. Comment équilibrer les deux risques au Canada.",
  },
  "fhsa-explained": {
    seoTitle: "CELIAPP expliqué : plafonds et retraits",
    title: "Le CELIAPP expliqué : déductions, plafonds et retraits",
    description:
      "Le CELIAPP combine déduction fiscale à l'entrée et retrait libre d'impôt pour une première maison. Règles, reports et clôture.",
  },
  "consumer-proposals-explained": {
    seoTitle: "Proposition de consommateur au Canada",
    title: "Proposition de consommateur : ce qui change et ce qui reste",
    description:
      "Une offre légale et encadrée pour rembourser vos créanciers sans faillite. Ce qu'elle protège et le rôle du syndic autorisé.",
  },
  "income-depends-on-you": {
    seoTitle: "Protection du revenu familial au Canada",
    title: "Quelle part du revenu familial dépend de votre travail ?",
    description:
      "Vos projets et dettes reposent sur votre capacité de travailler. Comment mesurer l'écart et quelles protections répondent.",
  },
  "resp-basics": {
    seoTitle: "REEE et subvention d'études de 20 %",
    title: "Fondamentaux du REEE : comment fonctionne la SCEE",
    description:
      "Le REEE bonifie votre épargne-études avec les subventions canadiennes. Plafonds de 20 %, rattrapage et options si l'enfant n'étudie pas.",
  },
  "cpp-oas-start-age": {
    seoTitle: "RPC et SV : quel âge de début choisir ?",
    title: "RPC et Sécurité de la vieillesse : l'impact de l'âge de début",
    description:
      "Le RPC débute entre 60 et 70 ans et la SV entre 65 et 70 ans. Écart mathématique mensuel et critères réels pour décider.",
  },
  "new-to-canada-money-basics": {
    seoTitle: "Finances des nouveaux arrivants Canada",
    title: "Nouveau au Canada : les bases financières de la 1re année",
    description:
      "Historique de crédit, comptes enregistrés et impôts fonctionnent autrement ici. Par où commencer dès votre première année au Canada.",
  },
  "savings-or-debt-first": {
    seoTitle: "Rembourser ses dettes ou épargner ?",
    title: "Rembourser une dette ou épargner : la vraie comparaison",
    description:
      "Le choix dépend du taux d'intérêt après impôt, de vos droits enregistrés et de votre coussin de liquidités. Cadre de calcul clair.",
  },
  "questions-before-any-financial-product": {
    seoTitle: "8 questions avant un produit financier",
    title: "Huit questions à poser avant tout produit financier",
    description:
      "Mode de rémunération, permis provinciaux et limites du contrat : huit vérifications essentielles avant de signer avec un conseiller.",
  },
  "canadian-mortgage-renewal-shock-liquidity-trap": {
    seoTitle: "Renouvellement hypothécaire & CELI/REER",
    title: "Choc hypothécaire : éviter de liquider votre CELI ou REER",
    description:
      "Face à la hausse des mensualités au renouvellement, liquider un REER ou CELI coûte souvent plus cher qu'il n'y paraît. Analyse chiffrée.",
  },
  "canadian-ccpc-passive-income-grind-sbd-tax-trap": {
    seoTitle: "Revenu passif de SPCC : seuil de 50 k$",
    title: "Seuil de 50 000 $ en SPCC : réduction de la DPE",
    description:
      "Au-delà de 50 000 $ de revenus passifs, la déduction pour petite entreprise diminue à raison de 5 $ pour 1 $. Mécanisme et options.",
  },
  "term-vs-permanent-life-insurance": {
    seoTitle: "Assurance vie temporaire vs permanente",
    title: "Assurance vie temporaire ou permanente : comment choisir",
    description:
      "L'assurance temporaire couvre l'hypothèque et les charges familiales ; la permanente répond aux besoins successoraux et fiscaux viagers.",
  },
  "internationally-trained-doctors-nurses-first-year": {
    seoTitle: "Médecins et infirmières formés à l'étranger",
    title: "Santé au Canada : gérer la 1re année d'équivalence",
    description:
      "Pendant la reconnaissance des titres médicaux, gérez impôts, crédit canadien, allocations et réserves de liquidités sans erreur.",
  },
  "fhsa-vs-hbp-first-time-home-buyer-stacking": {
    seoTitle: "Cumuler CELIAPP et RAP (100 000 $)",
    title: "Jusqu'à 100 000 $ pour une maison : cumuler CELIAPP et RAP",
    description:
      "Comment combiner les 40 000 $ du CELIAPP et les 60 000 $ du RAP REER pour une première maison, avec leurs règles de remboursement.",
  },
  "cpp-timing-age-60-vs-65-vs-70-mathematical-breakeven": {
    seoTitle: "RPC à 60, 65 ou 70 ans : point mort",
    title: "Prendre le RPC à 60, 65 ou 70 ans : calcul du seuil",
    description:
      "Analyse actuarielle du RPC anticipé à 60 ans (-36 %) contre le report à 70 ans (+42 %), indexation et décaissement REER.",
  },
  "canadian-alternative-minimum-tax-amt-high-earners-guide": {
    seoTitle: "Guide de l'IMR au Canada (taux 20,5 %)",
    title: "Impôt minimum de remplacement (IMR) : réformes post-2024",
    description:
      "Taux fédéral de 20,5 %, inclusion à 100 % des gains, crédit de don à 80 % et report sur 7 ans : comprendre l'IMR sous C-59 et C-69.",
  },
  "resp-withdrawal-strategy-eap-pse-grant-clawback": {
    seoTitle: "Retraits REEE : PAE vs capital et SCEE",
    title: "Stratégie de retrait REEE : PAE, capital et subventions",
    description:
      "Maîtrisez le plafond de 8 000 $ des 13 premières semaines pour les PAE, l'extraction du capital sans impôt et la protection de la SCEE.",
  },
  "prescribed-rate-loans-spousal-income-splitting": {
    seoTitle: "Prêt au taux prescrit entre conjoints",
    title: "Prêts au taux prescrit de l'ARC : fractionnement familial",
    description:
      "Règles d'attribution (art. 74.1), prêts entre conjoints (par. 74.5(2)) et échéance stricte du 30 janvier pour le paiement des intérêts.",
  },
  "oas-clawback-mitigation-threshold-canadian-retirees": {
    seoTitle: "Récupération de la SV : éviter le seuil",
    title: "Impôt de récupération de la Sécurité de la vieillesse",
    description:
      "Mécanique de l'art. 180.2 sur le revenu net mondial, report jusqu'à 70 ans, CELI et fractionnement de pension pour protéger votre SV.",
  },
  "credit-cards-loans-lines-of-credit-repayment-strategies": {
    seoTitle: "Rembourser cartes de crédit et marges",
    title: "Remboursement des dettes : cartes, prêts et marges de crédit",
    description:
      "Méthode avalanche vs boule de neige, utilisation prudente des marges et taux effectifs pour réduire le coût total de vos dettes.",
  },
  "mortgages-home-buying-fixed-vs-variable-amortization-stress-test": {
    seoTitle: "Guide hypothèque Canada : taux et B-20",
    title: "Hypothèque au Canada : fixe, variable et test de résistance",
    description:
      "Qualification selon la ligne directrice B-20 du BSIF, taux fixe ou variable et impact réel d'un amortissement sur 25 ou 30 ans.",
  },
  "personal-line-of-credit-vs-heloc-canada": {
    seoTitle: "Marge personnelle vs marge hypothécaire",
    title: "Marge de crédit personnelle vs HELOC au Canada",
    description:
      "Comparaison des marges non garanties et hypothécaires : limite RPV de 65 %, risques sur la propriété et déductibilité sous l'art. 20(1)c).",
  },
  "how-much-tax-do-i-save-with-a-10000-rrsp-contribution": {
    seoTitle: "Économie d'impôt sur 10 000 $ en REER",
    title: "Combien d'impôt économise une cotisation REER de 10 000 $ ?",
    description:
      "Calcul des remboursements fédéraux et provinciaux pour 10 000 $ cotisés au REER et effet sur l'Allocation canadienne pour enfants.",
  },
  "tfsa-vs-rrsp-vs-fhsa-which-to-maximize-first": {
    seoTitle: "CELI, REER ou CELIAPP : ordre de priorité",
    title: "CELI vs REER vs CELIAPP : quel compte prioriser d'abord ?",
    description:
      "Matrice décisionnelle classant CELI, REER et CELIAPP selon le revenu imposable, l'achat d'une maison et la contrepartie d'employeur.",
  },
  "accidental-fhsa-over-contributions-non-resident-freezes": {
    seoTitle: "Surcotisation CELIAPP et formulaire RC727",
    title: "Surcotisations accidentelles au CELIAPP et départ du Canada",
    description:
      "Évitez la pénalité mensuelle de 1 % (art. 207.02), corrigez un excédent avec le formulaire RC727 et gérez le statut de non-résident.",
  },
  "irs-foreign-trust-nightmare-moving-to-us-with-tfsa": {
    seoTitle: "CELI et départ aux É.-U. : formulaires IRS",
    title: "Le piège fiscal américain du CELI (3520, 3520-A et PFIC)",
    description:
      "Conserver un CELI après un déménagement aux États-Unis entraîne les déclarations 3520/3520-A, PFIC (8621) et de lourdes pénalités.",
  },
  "corporate-passive-income-trap-50000-clawback-rule": {
    seoTitle: "Revenus passifs de SPCC & annexe 7 T2",
    title: "Piège du seuil de 50 000 $ en SPCC et annexe 7",
    description:
      "Comprenez la réduction 5 pour 1 de la DPE sous l'art. 125(5.1) entre 50 000 $ et 150 000 $ de revenu de placement total ajusté.",
  },
  "66-percent-capital-gains-tax-family-cottage-trap": {
    seoTitle: "Chalet familial, art. 70(5) et T2091",
    title: "Chalet familial : disposition présumée au décès et formulaire T2091",
    description:
      "Avec le taux d'inclusion maintenu à 50 %, l'art. 70(5) au décès et les choix T2091 créent d'importantes factures sur les chalets.",
  },
  "switching-uninsured-mortgages-without-osfi-stress-test": {
    seoTitle: "Transfert hypothécaire sans stress test",
    title: "Transférer un prêt non assuré sans test de résistance B-20",
    description:
      "Comment l'exemption du BSIF permet un transfert direct d'hypothèque non assurée au renouvellement sans repasser le test de résistance.",
  },
  "canada-federal-budget-capital-gains-cei-amt-analysis": {
    seoTitle: "Gains à 50 %, ICE et réforme de l'IMR",
    title: "Gains en capital à 50 %, ECGC à 1,25 M$, ICE et réforme IMR",
    description:
      "Bilan fiscal canadien à jour : annulation de la hausse à 66,7 % (maintien à 50 %), ECGC à 1,25 M$, Incitatif aux entrepreneurs et IMR.",
  },
  "prescribed-rate-spousal-loans-tax-arbitrage-guide": {
    seoTitle: "Prêts au taux prescrit et date du 30 janv.",
    title: "Prêts au taux prescrit de l'ARC : règles et échéances",
    description:
      "Fonctionnement détaillé du prêt à demande entre conjoints (par. 74.5(2)) et obligation stricte de paiement annuel avant le 30 janvier.",
  },
  "pension-commuted-value-transfer-par-tax-planning": {
    seoTitle: "Valeur de rachat d'un régime de pension",
    title: "Valeur de rachat de pension et facteur d'équivalence rectifié",
    description:
      "Comment est calculée la valeur de rachat d'un régime à prestations déterminées, l'effet des taux et les plafonds de transfert fiscal.",
  },
};

export function getCoreRouteSeo(pathname: string): RouteSeoEntry | undefined {
  const norm = normalizeRoutePath(pathname);
  return CORE_ROUTES_SEO.find((r) => r.path === norm);
}

export function getAllIndexableCoreRoutes(): RouteSeoEntry[] {
  return CORE_ROUTES_SEO.filter((r) => !r.noIndex);
}
