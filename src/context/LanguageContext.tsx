import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "fr";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
  isFr: boolean;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    nav_home: "Home",
    nav_how_i_help: "How I Help",
    nav_education: "Financial Education",
    nav_insights: "Insights",
    nav_news: "Financial News",
    nav_careers: "Become an Agent",
    nav_contact: "Start a Conversation",
    nav_disclosures: "Disclosures",
    nav_standards: "Editorial Standards",
    nav_privacy: "Privacy Notice",
    nav_terms: "Terms of Use",

    // Buttons & CTAs
    btn_start_conversation: "Start a Conversation",
    btn_book_call: "Schedule 30-Min Call",
    btn_read_guide: "Read the guide",
    btn_read_essay: "Read the essay",
    btn_subscribe: "Subscribe",
    btn_subscribing: "Subscribing...",
    btn_apply: "Apply for Mentorship",
    btn_explore_topics: "Explore How I Help →",
    btn_learn_before: "Learn Before You Decide",
    btn_reset_filters: "Reset filters",
    btn_show_all: "Show all articles",

    // Categories
    cat_all: "All topics",
    cat_registered_accounts: "Registered Accounts",
    cat_debt_credit: "Debt and Credit",
    cat_protection: "Income Protection",
    cat_investing: "Investing and Risk",
    cat_resp: "Education Savings",
    cat_retirement: "Retirement and Public Pensions",
    cat_newcomers: "New to Canada",
    cat_decision_making: "Financial Decision-Making",

    // Hero & Taglines
    hero_eyebrow: "Financial clarity for real life",
    hero_headline: "Your money questions are connected. The answers should be, too.",
    hero_subhead:
      "From protecting your family’s income to registered accounts, debt choices and family priorities, better decisions begin with seeing how the pieces fit together.",
    hero_tag: "Licensed Financial Solutions Professional in Canada",

    // Trust Badges
    badge_independent: "Independent Practice",
    badge_licensed: "Licensed Across Canada",
    badge_no_pressure: "Zero Sales Pressure",

    // Topics & Highlights
    topic_newcomers: "Newcomers' First-Year Steps",
    topic_fhsa_hbp: "FHSA with Home Buyers' Plan",
    topic_credit: "Building Canadian Credit",
    topic_life_ins: "Term vs Permanent Insurance",

    // Audience Hubs
    hub_healthcare: "Healthcare & Medical",
    hub_business: "Business Owners & CCPCs",
    hub_families: "Canadian Families",
    hub_newcomers: "Newcomers to Canada",

    // Reading & Article Meta
    meta_reading_time: "Estimated Reading Time",
    meta_min_read: "min read",
    meta_figures_as_of: "Figures as of",
    meta_sources: "Official Sources",
    meta_sources_cited: "sources cited",
    meta_reading_progress: "Reading Progress",
    meta_the_question: "The Question:",
    meta_hypothetical: "Hypothetical example",
    meta_misunderstandings: "Common misunderstandings",
    meta_tradeoffs: "Trade-offs and limitations",
    meta_questions_to_ask: "Questions to consider",
    meta_share_link: "Share link copied",
    meta_copy_link: "Copy link",

    // Newsletter
    newsletter_title: "The Intentional Wealth Briefing",
    newsletter_sub: "Monthly plain-language breakdowns of Canadian tax rules and family financial strategy. No spam.",

    // Footer
    footer_role: "Independent financial professional providing education and financial solutions across Canada and the United States.",
    footer_notice:
      "This website is an educational resource providing general financial concepts, strategic frameworks, and professional mentorship across Canada and the United States. Content published here does not constitute individualized financial, investment, tax, or legal advice, nor an offer or solicitation to purchase any specific product or security. Regulated solutions, protection plans, and financial products are arranged exclusively through licensed professionals in their authorized provincial or state jurisdictions.",
  },
  fr: {
    // Navigation
    nav_home: "Accueil",
    nav_how_i_help: "Comment j'aide",
    nav_education: "Éducation financière",
    nav_insights: "Perspectives",
    nav_news: "Actualités",
    nav_careers: "Devenir conseiller",
    nav_contact: "Démarrer une conversation",
    nav_disclosures: "Divulgations",
    nav_standards: "Normes éditoriales",
    nav_privacy: "Politique de confidentialité",
    nav_terms: "Conditions d'utilisation",

    // Buttons & CTAs
    btn_start_conversation: "Démarrer une conversation",
    btn_book_call: "Réserver un appel de 30 min",
    btn_read_guide: "Lire le guide",
    btn_read_essay: "Lire l'analyse",
    btn_subscribe: "S'abonner",
    btn_subscribing: "Inscription en cours...",
    btn_apply: "Postuler au mentorat",
    btn_explore_topics: "Explorer comment j'aide →",
    btn_learn_before: "Apprendre avant de décider",
    btn_reset_filters: "Réinitialiser les filtres",
    btn_show_all: "Afficher tous les guides",

    // Categories
    cat_all: "Tous les sujets",
    cat_registered_accounts: "Comptes enregistrés",
    cat_debt_credit: "Dette et crédit",
    cat_protection: "Protection du revenu",
    cat_investing: "Investissement et risque",
    cat_resp: "Épargne-études",
    cat_retirement: "Retraite et rentes publiques",
    cat_newcomers: "Nouveaux arrivants au Canada",
    cat_decision_making: "Prise de décision financière",

    // Hero & Taglines
    hero_eyebrow: "Clarté financière au quotidien",
    hero_headline: "Vos décisions financières sont liées. Les réponses devraient l'être aussi.",
    hero_subhead:
      "De la protection du revenu familial aux régimes enregistrés (CELI, REER, CELIAPP) et à la gestion des dettes, de meilleures décisions commencent par une vue d'ensemble.",
    hero_tag: "Professionnel agréé en solutions financières indépendantes au Canada",

    // Trust Badges
    badge_independent: "Pratique indépendante",
    badge_licensed: "Agréé partout au Canada",
    badge_no_pressure: "Zéro pression commerciale",

    // Topics & Highlights
    topic_newcomers: "Nouveaux arrivants : 1re année",
    topic_fhsa_hbp: "CELIAPP + RAP (100k$ non taxé)",
    topic_credit: "Bâtir son crédit au Canada",
    topic_life_ins: "Assurance temporaire vs perm.",

    // Audience Hubs
    hub_healthcare: "Santé & Médecins",
    hub_business: "Entreprises & SPCC",
    hub_families: "Familles canadiennes",
    hub_newcomers: "Nouveaux arrivants",

    // Reading & Article Meta
    meta_reading_time: "Temps de lecture estimé",
    meta_min_read: "min de lecture",
    meta_figures_as_of: "Chiffres en date de",
    meta_sources: "Sources officielles",
    meta_sources_cited: "sources citées",
    meta_reading_progress: "Progression de lecture",
    meta_the_question: "La question posée :",
    meta_hypothetical: "Exemple hypothétique",
    meta_misunderstandings: "Idées reçues fréquentes",
    meta_tradeoffs: "Compromis et limites",
    meta_questions_to_ask: "Questions à considérer",
    meta_share_link: "Lien copié dans le presse-papiers",
    meta_copy_link: "Copier le lien",

    // Newsletter
    newsletter_title: "Le Point Financier Intentionnel",
    newsletter_sub: "Analyses mensuelles en langage clair sur les règles fiscales canadiennes et la stratégie familiale. Zéro pourriel.",

    // Footer
    footer_role: "Professionnel indépendant offrant de l'éducation financière partout au Canada et aux États-Unis.",
    footer_notice:
      "Ce site web est une ressource éducative fournissant des concepts financiers généraux, des cadres stratégiques et du mentorat professionnel au Canada et aux États-Unis. Le contenu publié ici ne constitue pas un conseil financier, d'investissement, fiscal ou juridique personnalisé, ni une offre ou sollicitation pour acheter un produit ou titre spécifique. Les solutions réglementées et plans de protection sont organisés exclusivement par des professionnels dûment autorisés dans leur province ou état.",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem("ahmed_bello_lang");
      if (saved === "fr" || saved === "en") return saved;
      if (typeof navigator !== "undefined" && navigator.language?.toLowerCase().startsWith("fr")) {
        return "fr";
      }
    } catch {
      // Fallback
    }
    return "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("ahmed_bello_lang", lang);
    } catch {
      // ignore
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "fr" : "en");
  };

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language === "fr" ? "fr-CA" : "en-CA";
    }
  }, [language]);

  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        isFr: language === "fr",
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
