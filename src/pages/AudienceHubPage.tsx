import React from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { articles, categories } from "../content/data.ts";
import { siteConfig } from "../config/site.ts";
import { useLanguage } from "../context/LanguageContext.tsx";
import { NewcomerPlanningCalculator } from "../components/NewcomerPlanningCalculator.tsx";
import { SEO } from "../components/SEO.tsx";
import { ARTICLE_FR_SEO } from "../config/seoMetadata.ts";
import { trackCtaClick, trackBookingClick } from "../lib/track.ts";
import {
  Stethoscope,
  Briefcase,
  Users,
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  BookOpen,
  Calculator,
} from "lucide-react";

interface AudienceConfig {
  id: string;
  slug: string;
  aliases?: string[];
  titleEn: string;
  titleFr: string;
  metaTitleEn?: string;
  metaTitleFr?: string;
  eyebrowEn: string;
  eyebrowFr: string;
  descriptionEn: string;
  descriptionFr: string;
  icon: React.ComponentType<{ className?: string }>;
  curatedSlugs: string[];
  showCalculator?: boolean;
  calculatorProfession?: "general" | "healthcare" | "tech";
  keyTakeawaysEn: string[];
  keyTakeawaysFr: string[];
}

const AUDIENCES: Record<string, AudienceConfig> = {
  healthcare: {
    id: "healthcare",
    slug: "healthcare",
    aliases: ["health-workers", "doctors-nurses"],
    titleEn: "Financial Guidance for Healthcare Workers & Internationally Trained Doctors and Nurses",
    titleFr: "Orientation financière pour professionnels de la santé, médecins et infirmiers formés à l'étranger",
    metaTitleEn: "Financial Guidance for Healthcare | Ahmed Bello",
    metaTitleFr: "Orientation Financière Santé | Ahmed Bello",
    eyebrowEn: "Audience Hub: Healthcare & Medical Professionals",
    eyebrowFr: "Carrefour thématique : Professionnels de la santé",
    descriptionEn:
      "Licensing delays, credential recognition fees, and income gaps make your first years in Canada unique. Learn how to structure your cashflow runway, protect your income, and understand tax residency rules.",
    descriptionFr:
      "Les délais d'équivalence, les frais d'examens et le décalage de revenus rendent vos premières années au Canada uniques. Structurez vos réserves de subsistance et vos comptes enregistrés.",
    icon: Stethoscope,
    curatedSlugs: [
      "internationally-trained-doctors-nurses-first-year",
      "new-to-canada-money-basics",
      "income-depends-on-you",
      "term-vs-permanent-life-insurance",
      "canadian-mortgage-renewal-shock-liquidity-trap",
    ],
    showCalculator: true,
    calculatorProfession: "healthcare",
    keyTakeawaysEn: [
      "Plan around the licensing gap, not the expected future salary.",
      "CRA tax residency starts on arrival; T1135 foreign property reporting applies after year one.",
      "TFSA room starts when you become a resident; RRSP room is based on prior-year Canadian earned income.",
      "Explore federal Foreign Credential Recognition loans (up to $30,000) before draining all liquid reserves.",
    ],
    keyTakeawaysFr: [
      "Planifiez selon la durée d'équivalence réelle, et non sur le salaire anticipé.",
      "La résidence fiscale de l'ARC débute dès l'arrivée; la déclaration T1135 s'applique après l'année d'arrivée.",
      "Les droits de cotisation au CELI débutent à l'arrivée; les droits de REER exigent des revenus canadiens antérieurs.",
      "Explorez les prêts fédéraux de reconnaissance des titres (jusqu'à 30 000 $) pour protéger votre trésorerie.",
    ],
  },

  "business-owners": {
    id: "business-owners",
    slug: "business-owners",
    aliases: ["entrepreneurs", "incorporated"],
    titleEn: "CCPC Tax Efficiency & $50k SBD Passive Income Strategy | Ahmed Bello",
    titleFr: "Efficience Fiscale des SPCC & Plafond DPE de 50 000 $ | Ahmed Bello",
    metaTitleEn: "CCPC Tax Efficiency & SBD Strategy | Ahmed Bello",
    metaTitleFr: "Efficience Fiscale des SPCC & DPE | Ahmed Bello",
    eyebrowEn: "Audience Hub: Business Owners & CCPCs",
    eyebrowFr: "Carrefour thématique : Propriétaires d'entreprises",
    descriptionEn:
      "Optimize your corporate tax exposure, manage the small business deduction passive income threshold, and extract capital tax-efficiently.",
    descriptionFr:
      "Optimisez la fiscalité de votre société, gérez le seuil de revenus passifs de la DPE et extrayez du capital en franchise d'impôt.",
    icon: Briefcase,
    curatedSlugs: [
      "tfsa-vs-rrsp",
      "term-vs-permanent-life-insurance",
      "savings-or-debt-first",
      "questions-before-any-financial-product",
      "canadian-mortgage-renewal-shock-liquidity-trap",
    ],
    showCalculator: false,
    keyTakeawaysEn: [
      "Passive corporate investment income exceeding $50,000 begins grinding down your federal Small Business Deduction limit.",
      "Permanent corporate-owned insurance provides tax-sheltered growth and credit to the Capital Dividend Account (CDA).",
      "Section 85/86 estate freezes prevent exponential tax liabilities upon deemed disposition at death.",
      "Distinguish corporate retained earnings liquidity from personal household emergency buffers.",
    ],
    keyTakeawaysFr: [
      "Les revenus de placement passif en société supérieurs à 50 000 $ réduisent progressivement la Déduction pour petite entreprise.",
      "L'assurance permanente détenue par la société alimente le Compte de dividendes en capital (CDC) en franchise d'impôt.",
      "Les gels successoraux (art. 85/86) plafonnent l'impôt terminal lors de la disposition présumée au décès.",
      "Distinguez la trésorerie de votre entreprise de vos coussins de sécurité personnels.",
    ],
  },

  families: {
    id: "families",
    slug: "families",
    aliases: ["parents", "homeowners"],
    titleEn: "Connected Financial Guidance for Canadian Families & Homeowners",
    titleFr: "Orientation financière globale pour les familles et propriétaires canadiens",
    metaTitleEn: "Financial Guidance for Families | Ahmed Bello",
    metaTitleFr: "Orientation Financière Familles | Ahmed Bello",
    eyebrowEn: "Audience Hub: Canadian Families",
    eyebrowFr: "Carrefour thématique : Familles canadiennes",
    descriptionEn:
      "Balancing mortgage renewal payments with registered savings (TFSA, RRSP, FHSA), education savings (RESP), and income protection for primary breadwinners.",
    descriptionFr:
      "Équilibrer les paiements hypothécaires avec l'épargne enregistrée (CELI, REER, CELIAPP), les études des enfants (REEE) et la protection du revenu familial.",
    icon: Users,
    curatedSlugs: [
      "canadian-mortgage-renewal-shock-liquidity-trap",
      "fhsa-explained",
      "tfsa-vs-rrsp",
      "resp-basics",
      "income-depends-on-you",
      "term-vs-permanent-life-insurance",
    ],
    showCalculator: false,
    keyTakeawaysEn: [
      "Avoid liquidating registered tax shelters (TFSA/RRSP) to pay down mortgage principal without modeling 15-year compounding.",
      "Eligible first-time buyers can combine $40k FHSA + $60k RRSP HBP for up to $100k per person ($200k per couple) tax-free.",
      "The Canada Education Savings Grant (CESG) provides a 20% match on the first $2,500 contributed annually to an RESP.",
      "Individual level term insurance keeps coverage steady and pays tax-free to family beneficiaries, unlike bank mortgage insurance.",
    ],
    keyTakeawaysFr: [
      "Évitez de liquider vos régimes enregistrés (CELI/REER) pour rembourser votre hypothèque sans comparer le rendement à long terme.",
      "Combinez 40 000 $ en CELIAPP et 60 000 $ en RAP pour jusqu'à 100 000 $ non imposables par acheteur (200 000 $ par couple).",
      "La Subvention canadienne pour l'épargne-études (SCEE) offre une bonification de 20 % sur les premiers 2 500 $ cotisés au REEE.",
      "L'assurance temporaire individuelle verse un capital fixe non imposable à votre famille, contrairement à l'assurance prêt bancaire.",
    ],
  },

  newcomers: {
    id: "newcomers",
    slug: "newcomers",
    aliases: ["immigrants", "new-to-canada"],
    titleEn: "First-Year Financial Blueprint for Newcomers to Canada (Runway & Credit Guide)",
    titleFr: "Plan Financier de 1re Année pour Nouveaux Arrivants au Canada (Piste & Crédit)",
    metaTitleEn: "Newcomer Financial Blueprint Canada | Ahmed Bello",
    metaTitleFr: "Plan Financier Nouveaux Arrivants | Ahmed Bello",
    eyebrowEn: "Audience Hub: Newcomers to Canada",
    eyebrowFr: "Carrefour thématique : Nouveaux arrivants",
    descriptionEn:
      "Navigate Canadian banking, credit building, emergency reserves, and tax-sheltered accounts with our step-by-step financial framework.",
    descriptionFr:
      "Bâtissez votre crédit canadien, structurez vos réserves de subsistance et optimisez vos régimes enregistrés dès votre première année.",
    icon: Compass,
    curatedSlugs: [
      "new-to-canada-money-basics",
      "internationally-trained-doctors-nurses-first-year",
      "tfsa-vs-rrsp",
      "fhsa-explained",
    ],
    showCalculator: true,
    calculatorProfession: "general",
    keyTakeawaysEn: [
      "Canadian credit scores start from scratch; open a secured or newcomer credit card and pay the full balance monthly.",
      "TFSA contribution room accumulates only for years you are a Canadian resident aged 18 or older.",
      "Form T1135 is required for foreign property costing over CAD $100,000, starting in the year after you become a resident.",
      "Always compare the total exchange-rate spread plus transfer fees when remitting money abroad.",
    ],
    keyTakeawaysFr: [
      "Le dossier de crédit canadien repart de zéro; utilisez une carte de crédit pour nouveaux arrivants et payez le solde complet chaque mois.",
      "Les droits de cotisation au CELI ne s'accumulent que pour les années où vous êtes résident canadien âgé de 18 ans et plus.",
      "Le formulaire T1135 est obligatoire pour les biens étrangers de plus de 100 000 $ CAD à compter de l'année suivant votre arrivée.",
      "Comparez toujours l'écart de taux de change en plus des frais de transfert lorsque vous envoyez des fonds à l'étranger.",
    ],
  },
};

import { NotFoundPage } from "./NotFoundPage.tsx";

export const AudienceHubPage: React.FC = () => {
  const { audience } = useParams<{ audience: string }>();
  const { language } = useLanguage();
  const isFr = language === "fr";

  // Normalize audience lookup by slug or alias
  const audienceKey = Object.keys(AUDIENCES).find(
    (k) =>
      AUDIENCES[k].slug === audience ||
      (AUDIENCES[k].aliases && AUDIENCES[k].aliases?.includes(audience || ""))
  );

  const currentAudience = audienceKey ? AUDIENCES[audienceKey] : null;

  // Unknown audience slugs return a proper 404 page (no soft 404)
  if (!currentAudience) {
    return <NotFoundPage />;
  }

  // Redirect any alias (e.g., /for/health-workers or /for/doctors-nurses) to the single canonical URL (/for/healthcare)
  if (audience && currentAudience.slug !== audience) {
    return <Navigate to={`${isFr ? "/fr" : ""}/for/${currentAudience.slug}`} replace />;
  }

  const IconComponent = currentAudience.icon;
  const curatedArticles = currentAudience.curatedSlugs
    .map((slug) => articles.find((a) => a.slug === slug))
    .filter(Boolean);

  return (
    <div className="py-12 md:py-16">
      <SEO
        title={isFr ? (currentAudience.metaTitleFr || currentAudience.titleFr) : (currentAudience.metaTitleEn || currentAudience.titleEn)}
        description={isFr ? currentAudience.descriptionFr : currentAudience.descriptionEn}
        canonicalUrl={isFr ? `/fr/for/${currentAudience.slug}` : `/for/${currentAudience.slug}`}
      />
      <div className="wrap max-w-5xl">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-[#625d52]">
          <ol className="flex items-center gap-2 list-none p-0">
            <li>
              <Link to={isFr ? "/fr" : "/"} className="hover:text-[#2e4a3b] transition-colors">
                {isFr ? "Accueil" : "Home"}
              </Link>
            </li>
            <li aria-hidden="true">&rsaquo;</li>
            <li>
              <Link to={isFr ? "/fr/education" : "/education"} className="hover:text-[#2e4a3b] transition-colors">
                {isFr ? "Éducation financière" : "Education Library"}
              </Link>
            </li>
            <li aria-hidden="true">&rsaquo;</li>
            <li className="text-[#1c1b18] font-medium">
              {isFr ? currentAudience.titleFr : currentAudience.titleEn}
            </li>
          </ol>
        </nav>

        {/* Hub Header */}
        <header className="pb-12 border-b border-[#d6cebd] space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#2e4a3b]/10 text-[#2e4a3b] border border-[#2e4a3b]/25 rounded-[2px] text-xs font-semibold uppercase tracking-wider">
            <IconComponent className="w-4 h-4 text-[#75581f]" />
            <span>{isFr ? currentAudience.eyebrowFr : currentAudience.eyebrowEn}</span>
          </div>

          <h1
            className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1c1b18] leading-[1.12] tracking-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {isFr ? currentAudience.titleFr : currentAudience.titleEn}
          </h1>

          <p className="text-base sm:text-lg text-[#46423a] leading-relaxed max-w-3xl">
            {isFr ? currentAudience.descriptionFr : currentAudience.descriptionEn}
          </p>

          {/* Quick Audience Switcher */}
          <div className="pt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-[#75581f] font-semibold mr-1">
              {isFr ? "Autres carrefours :" : "Other Audience Hubs:"}
            </span>
            {Object.values(AUDIENCES).map((aud) => (
              <Link
                key={aud.id}
                to={`${isFr ? "/fr" : ""}/for/${aud.slug}`}
                className={`text-xs px-3 py-1.5 rounded-[2px] border transition-colors ${
                  aud.id === currentAudience.id
                    ? "bg-[#2e4a3b] text-[#f7f3eb] border-[#2e4a3b] font-semibold"
                    : "bg-[#fcfaf5] text-[#1c1b18] border-[#d6cebd] hover:border-[#2e4a3b]"
                }`}
              >
                {aud.id === "healthcare"
                  ? isFr
                    ? "Santé & Médecins"
                    : "Healthcare"
                  : aud.id === "business-owners"
                  ? isFr
                    ? "Entreprises & SPCC"
                    : "Business Owners"
                  : aud.id === "families"
                  ? isFr
                    ? "Familles"
                    : "Families"
                  : isFr
                  ? "Nouveaux arrivants"
                  : "Newcomers"}
              </Link>
            ))}
          </div>
        </header>

        {/* Key Takeaways Grid */}
        <section className="py-12 border-b border-[#d6cebd]">
          <h2 className="font-serif text-2xl text-[#1c1b18] mb-6">
            {isFr ? "Règles clés à retenir pour votre situation" : "Key Strategic Ground Rules"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(isFr ? currentAudience.keyTakeawaysFr : currentAudience.keyTakeawaysEn).map(
              (point, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] flex items-start gap-3"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#2e4a3b] shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-[#46423a] leading-relaxed">{point}</p>
                </div>
              )
            )}
          </div>
        </section>

        {/* NEWCOMERS LONG-TAIL TARGET SECTION */}
        {currentAudience.id === "newcomers" && (
          <section className="py-12 border-b border-[#d6cebd] space-y-6">
            <div className="space-y-3 max-w-4xl">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#75581f] font-bold block">
                {isFr ? "Guide Pratique d'Intégration Financière" : "Settlement Capital & Liquidity Framework"}
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#1c1b18] mb-4">
                {isFr
                  ? "Guide de la Réserve de Sécurité et du Fonds d'Urgence pour les Nouveaux Résidents Permanents au Canada"
                  : "Financial Runway & Emergency Fund Guide for New Permanent Residents in Canada"}
              </h2>
              <p className="text-sm sm:text-base text-[#46423a] leading-relaxed">
                {isFr
                  ? "L'erreur la plus coûteuse commise par les nouveaux arrivants au Canada consiste à sous-estimer la durée de transition vers leur premier emploi qualifié. Entre l'évaluation des diplômes étrangers (EDE), les examens d'équivalence professionnelle et les délais administratifs, la plupart des ménages traversent une période sans revenu stable de 6 à 12 mois."
                  : "The single most critical vulnerability facing new permanent residents in Canada is misjudging the duration of their credential recognition and settlement runway. Between provincial regulatory reviews, language testing, and exam sequencing, bridging the gap to full professional earnings frequently requires a protected, liquid cash buffer of 6 to 9 months."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-5 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] space-y-2">
                <h3 className="font-serif text-base font-bold text-[#1c1b18]">
                  {isFr ? "1. Calcul de la Réserve Minimale" : "1. Minimum Living Runway"}
                </h3>
                <p className="text-xs text-[#46423a] leading-relaxed">
                  {isFr
                    ? "Additionnez le loyer, l'alimentation, le transport et les frais d'examen. Maintenez au minimum 6 mois de dépenses courantes sur un compte chèque ou d'épargne liquide non exposé aux fluctuations boursières."
                    : "Tally essential shelter, utilities, food, transit, and professional licensing examination fees. Maintain at least 6 months of non-negotiable living overhead in guaranteed, zero-risk liquid savings before allocating to long-term equities."}
                </p>
              </div>

              <div className="p-5 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] space-y-2">
                <h3 className="font-serif text-base font-bold text-[#1c1b18]">
                  {isFr ? "2. Construction du Dossier de Crédit" : "2. Credit Bureau Architecture"}
                </h3>
                <p className="text-xs text-[#46423a] leading-relaxed">
                  {isFr
                    ? "Votre historique étranger ne vous suit pas. Obtenez immédiatement une carte de crédit pour nouveaux arrivants, maintenez un taux d'utilisation sous 30 % et réglez l'intégralité du solde chaque mois."
                    : "Foreign credit histories do not cross borders into Canada. Open a primary newcomer or secured credit card with Equifax and TransUnion reporting, keep credit utilization strictly under 30%, and pay statements in full monthly."}
                </p>
              </div>

              <div className="p-5 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] space-y-2">
                <h3 className="font-serif text-base font-bold text-[#1c1b18]">
                  {isFr ? "3. Timing des Régimes Enregistrés" : "3. Tax Shelter Sequencing"}
                </h3>
                <p className="text-xs text-[#46423a] leading-relaxed">
                  {isFr
                    ? "Vos droits de cotisation au CELI débutent l'année où vous devenez résident fiscal canadien âgé de 18 ans et plus. Le REER nécessite des revenus gagnés l'année précédente et déclarés sur votre déclaration T1."
                    : "TFSA contribution room accumulates starting the year you become a resident for tax purposes aged 18+. RRSP room requires Canadian earned income filed on prior-year CRA T1 returns; the FHSA opens as soon as you are a resident first-time buyer."}
                </p>
              </div>
            </div>

            {/* High-Intent CTA to Interactive Calculator */}
            <div className="p-5 bg-[#14211a] text-[#f7f3eb] rounded-[2px] border border-[#2e4a3b] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Calculator className="w-5 h-5 text-[#d6c298] shrink-0" />
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#d6c298] font-bold block">
                    {isFr ? "Simulateur Interactif" : "Interactive Runway Simulator"}
                  </span>
                  <p className="text-sm font-serif text-white mt-0.5">
                    {isFr
                      ? "Mesurez votre capital de subsistance et les frais d'équivalence en temps réel."
                      : "Model your settlement budget, credential verification costs, and monthly burn rate."}
                  </p>
                </div>
              </div>
              <Link
                to={isFr ? "/fr/calculators?tab=newcomer#calculator-tool" : "/calculators?tab=newcomer#calculator-tool"}
                onClick={() => trackCtaClick("audience_newcomers", "Calculate your newcomer settlement runway")}
                className="btn btn-primary text-xs px-5 py-2.5 whitespace-nowrap shrink-0 inline-flex items-center gap-2"
              >
                <span>{isFr ? "Calculer votre réserve financière de nouvel arrivant →" : "Calculate your newcomer settlement runway →"}</span>
              </Link>
            </div>
          </section>
        )}

        {/* BUSINESS OWNERS LONG-TAIL TARGET SECTION */}
        {currentAudience.id === "business-owners" && (
          <section className="py-12 border-b border-[#d6cebd] space-y-6">
            <div className="space-y-3 max-w-4xl">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#75581f] font-bold block">
                {isFr ? "Fiscalité Avancée des Sociétés Privées" : "Corporate Tax Planning & Retained Capital"}
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#1c1b18] mb-4">
                {isFr
                  ? "Gestion des Seuils de Revenus Passifs des SPCC sous la Règle des 50 000 $ de la DPE"
                  : "Managing CCPC Passive Income Limits under the $50k Small Business Deduction Rule"}
              </h2>
              <p className="text-sm sm:text-base text-[#46423a] leading-relaxed">
                {isFr
                  ? "En vertu du paragraphe 125(5.1) de la Loi de l'impôt sur le revenu (LIR), chaque tranche de 1 $ de revenu de placement passif (RPAA) au-delà de 50 000 $ réduit le plafond de la Déduction pour petite entreprise (DPE) de 5 $. Lorsque les placements passifs atteignent 150 000 $, le plafond de 500 000 $ est intégralement éliminé, forçant vos bénéfices d'exploitation au taux d'imposition général de 26,5 % (ou plus selon la province) au lieu du taux préférentiel de 9 % ou 12,2 %."
                  : "Under Subsection 125(5.1) of the federal Income Tax Act, every $1 of corporate passive investment income—technically known as Adjusted Aggregate Investment Income (AAII)—exceeding $50,000 erodes $5 of your Canadian-Controlled Private Corporation's (CCPC) Small Business Deduction (SBD) limit. Once passive income reaches $150,000, your entire $500,000 active business limit is wiped out, forcing active operational profits from the 9% federal small business rate up to the 26.5%+ general corporate rate."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-5 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] space-y-2">
                <h3 className="font-serif text-base font-bold text-[#1c1b18]">
                  {isFr ? "La Formule de Réduction 5:1" : "The 5:1 Clawback Mechanism"}
                </h3>
                <p className="text-xs text-[#46423a] leading-relaxed">
                  {isFr
                    ? "70 000 $ de revenus passifs (20 000 $ d'excédent) amputent 100 000 $ de bénéfice actif admissible au taux réduit, générant jusqu'à 17 500 $/an d'impôt supplémentaire à payer."
                    : "A corporate holding with $70,000 of passive investment income ($20,000 above the $50,000 statutory threshold) slashes $100,000 from your small business limit, triggering up to $17,500 annually in unneeded corporate tax owing."}
                </p>
              </div>

              <div className="p-5 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] space-y-2">
                <h3 className="font-serif text-base font-bold text-[#1c1b18]">
                  {isFr ? "Extraction via le CDC" : "Capital Dividend Account (CDA)"}
                </h3>
                <p className="text-xs text-[#46423a] leading-relaxed">
                  {isFr
                    ? "La fraction non imposable des gains en capital (50 %) crédite le CDC, permettant de distribuer du capital net d'impôt aux actionnaires canadiens."
                    : "The non-taxable portion of realized corporate capital gains credits your Capital Dividend Account (CDA), allowing tax-free distribution of surplus funds to Canadian resident shareholders via Form T2054."}
                </p>
              </div>

              <div className="p-5 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] space-y-2">
                <h3 className="font-serif text-base font-bold text-[#1c1b18]">
                  {isFr ? "Solutions de Trésorerie Exonérées" : "Tax-Exempt Corporate Structures"}
                </h3>
                <p className="text-xs text-[#46423a] leading-relaxed">
                  {isFr
                    ? "L'assurance vie permanente détenue par la société abrite la croissance des liquidités sans déclencher de RPAA, tout en finançant la relève et le rachat d'actions."
                    : "Corporate-owned permanent life insurance contracts accumulate internal cash values with zero annual passive tax drag, protecting the $50k SBD limit while creating a substantial tax-free credit to the CDA at death."}
                </p>
              </div>
            </div>

            {/* High-Intent CTA to Interactive Calculator */}
            <div className="p-5 bg-[#14211a] text-[#f7f3eb] rounded-[2px] border border-[#2e4a3b] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Calculator className="w-5 h-5 text-[#d6c298] shrink-0" />
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#d6c298] font-bold block">
                    {isFr ? "Simulateur Corporatif Interactif" : "Interactive CCPC Tax Simulator"}
                  </span>
                  <p className="text-sm font-serif text-white mt-0.5">
                    {isFr
                      ? "Modélisez l'impact exact de vos surplus de trésorerie sur votre déduction pour petite entreprise."
                      : "Calculate your corporate tax exposure and model the exact 5:1 small business deduction grind."}
                  </p>
                </div>
              </div>
              <div className="shrink-0">
                <Link
                  to={isFr ? "/fr/calculators?tab=ccpc-passive#calculator-tool" : "/calculators?tab=ccpc-passive#calculator-tool"}
                  onClick={() => trackCtaClick("audience_business_owners", "Analyze your corporate passive income limit")}
                  className="btn btn-primary text-xs px-5 py-2.5 whitespace-nowrap inline-flex items-center gap-2"
                >
                  <span>{isFr ? "Analyser le plafond de revenu passif de votre société →" : "Analyze your corporate passive income limit →"}</span>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* HEALTHCARE CALCULATOR CTA CARD */}
        {currentAudience.id === "healthcare" && (
          <section className="py-8 border-b border-[#d6cebd]">
            <div className="p-5 bg-[#14211a] text-[#f7f3eb] rounded-[2px] border border-[#2e4a3b] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Calculator className="w-5 h-5 text-[#d6c298] shrink-0" />
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#d6c298] font-bold block">
                    {isFr ? "Modélisation de Trésorerie Médicale" : "Healthcare Cashflow & Bridge Simulator"}
                  </span>
                  <p className="text-sm font-serif text-white mt-0.5">
                    {isFr
                      ? "Évaluez votre période d'équivalence et vos coûts de subsistance pendant vos démarches de permis."
                      : "Quantify your licensing gap timeline, credential evaluation costs, and living runway before residency or full practice."}
                  </p>
                </div>
              </div>
              <Link
                to={isFr ? "/fr/calculators?tab=newcomer#calculator-tool" : "/calculators?tab=newcomer#calculator-tool"}
                onClick={() => trackCtaClick("audience_healthcare", "Calculate your transition emergency reserve")}
                className="btn btn-primary text-xs px-5 py-2.5 whitespace-nowrap shrink-0 inline-flex items-center gap-2"
              >
                <span>{isFr ? "Calculer votre réserve de transition professionnelle →" : "Calculate your transition emergency reserve →"}</span>
              </Link>
            </div>
          </section>
        )}

        {/* FAMILIES CALCULATOR CTA CARD */}
        {currentAudience.id === "families" && (
          <section className="py-8 border-b border-[#d6cebd]">
            <div className="p-5 bg-[#14211a] text-[#f7f3eb] rounded-[2px] border border-[#2e4a3b] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Calculator className="w-5 h-5 text-[#d6c298] shrink-0" />
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#d6c298] font-bold block">
                    {isFr ? "Simulateur d'Arbitrage Familial" : "Family Wealth & Tax Arbitrage"}
                  </span>
                  <p className="text-sm font-serif text-white mt-0.5">
                    {isFr
                      ? "Comparez les rendements nets entre CELI, REER et épargne non enregistrée pour votre foyer."
                      : "Model the exact after-tax wealth gap between registered accounts (TFSA/RRSP/FHSA) and taxable non-registered savings."}
                  </p>
                </div>
              </div>
              <Link
                to={isFr ? "/fr/calculators?tab=tfsa-rrsp#calculator-tool" : "/calculators?tab=tfsa-rrsp#calculator-tool"}
                onClick={() => trackCtaClick("audience_families", "Compare TFSA versus RRSP tax benefits")}
                className="btn btn-primary text-xs px-5 py-2.5 whitespace-nowrap shrink-0 inline-flex items-center gap-2"
              >
                <span>{isFr ? "Comparer les avantages fiscaux CELI et REER →" : "Compare TFSA versus RRSP tax benefits →"}</span>
              </Link>
            </div>
          </section>
        )}

        {/* Interactive Calculator Section (if enabled for this audience) */}
        {currentAudience.showCalculator && (
          <section className="py-12 border-b border-[#d6cebd]">
            <NewcomerPlanningCalculator
              defaultProfession={currentAudience.calculatorProfession || "general"}
            />
          </section>
        )}

        {/* Curated Guides Cluster */}
        <section className="py-12 border-b border-[#d6cebd] space-y-8">
          <div>
            <span className="eyebrow text-xs uppercase tracking-wider text-[#75581f]">
              {isFr ? "Guides et analyses recommandés" : "Topic Cluster"}
            </span>
            <h2 className="font-serif text-3xl text-[#1c1b18] mt-1">
              {isFr
                ? "Guides essentiels pour votre parcours"
                : "Essential Guides for Your Situation"}
            </h2>
            <p className="text-sm text-[#625d52] mt-1">
              {isFr
                ? "Rédigés en langage clair, avec chiffres officiels et sans jargon de vente."
                : "Plain-language breakdowns with official CRA and FCAC sources linked."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {curatedArticles.map((art) => {
              if (!art) return null;
              const cat = categories.find((c) => c.id === art.category);
              return (
                <article
                  key={art.slug}
                  className="p-6 sm:p-7 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] flex flex-col justify-between hover:border-[#2e4a3b] transition-all group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs text-[#625d52]">
                      <span className="font-semibold text-[#2e4a3b] uppercase tracking-wider text-[0.7rem]">
                        {cat?.label || art.category}
                      </span>
                      <span>&bull;</span>
                      <span>
                        {art.readingMinutes} {isFr ? "min de lecture" : "min read"}
                      </span>
                    </div>

                    <h3 className="font-serif text-xl text-[#1c1b18] group-hover:text-[#2e4a3b] transition-colors leading-snug">
                      <Link to={`${isFr ? "/fr" : ""}${art.url}`}>
                        {isFr ? ARTICLE_FR_SEO[art.slug]?.title || art.title : art.title}
                      </Link>
                    </h3>

                    <p className="text-xs sm:text-sm text-[#46423a] leading-relaxed line-clamp-3">
                      {isFr ? ARTICLE_FR_SEO[art.slug]?.description || art.description : art.description}
                    </p>

                    <div className="p-3 bg-[#f7f3eb] border border-[#d6cebd] rounded-[2px] text-xs text-[#46423a]">
                      <strong>{isFr ? "La question :" : "The Question:"}</strong> {art.question}
                    </div>
                  </div>

                  <div className="pt-5 border-t border-[#ece6da] mt-5 flex items-center justify-between">
                    <Link
                      to={`${isFr ? "/fr" : ""}${art.url}`}
                      className="text-xs font-semibold text-[#2e4a3b] flex items-center gap-1.5 group-hover:underline"
                    >
                      <span>{isFr ? "Lire le guide" : "Read the guide"}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                    <span className="text-xs text-[#625d52]">
                      {art.sources.length} {isFr ? "sources officielles" : "sources"}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Direct Consultation Zone */}
        <section className="py-12 text-center bg-[#fcfaf5] border border-[#d6cebd] p-8 rounded-[2px] mt-12 space-y-4">
          <h3 className="font-serif text-2xl sm:text-3xl text-[#1c1b18]">
            {isFr
              ? "Vous avez une question précise sur votre situation ?"
              : "Have a Specific Question About Your Circumstances?"}
          </h3>
          <p className="text-sm text-[#46423a] max-w-xl mx-auto leading-relaxed">
            {isFr
              ? "Discutez directement avec Ahmed Bello pour examiner vos options fiscales, de protection ou d'épargne enregistrée au Canada sans aucune pression commerciale."
              : "Start an honest conversation with Ahmed Bello to review your Canadian tax, protection, and registered accounts strategy with zero sales pressure."}
          </p>
          <div className="pt-2 flex flex-col items-center justify-center gap-3">
            <a
              href={siteConfig.schedulingUrl || "/contact"}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackBookingClick("audience_hub_bottom")}
              className="btn btn-primary px-8 py-3.5 text-base inline-flex items-center gap-2 shadow-sm"
            >
              <Calendar className="w-4 h-4 text-[#d6c298]" />
              <span>{isFr ? "Réserver un appel de 30 min sur Calendly →" : "Schedule 30-Min Call on Calendly →"}</span>
            </a>
            <p className="text-xs text-[#625d52]">
              {isFr ? (
                <>
                  Vous préférez poser votre question par écrit ?{" "}
                  <Link to="/fr/contact" className="underline text-[#2e4a3b] font-medium">
                    Envoyer un message sans engagement
                  </Link>
                </>
              ) : (
                <>
                  Prefer to write first?{" "}
                  <Link to="/contact" className="underline text-[#2e4a3b] font-medium">
                    Send your questions directly through our contact form
                  </Link>
                </>
              )}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
