import React, { useState } from "react";
import { Link } from "react-router-dom";
import { articles } from "../content/data.ts";
import { useLanguage } from "../context/LanguageContext.tsx";
import { NewsletterSignup } from "../components/NewsletterSignup.tsx";
import { SEO } from "../components/SEO.tsx";
import { trackCtaClick } from "../lib/track.ts";
import {
  ArrowRight,
  Sparkles,
  Scale,
  Building,
  Users,
  Compass,
  Layers,
  Stethoscope,
  ShieldAlert,
  Landmark,
  BadgeCheck,
  Calculator,
} from "lucide-react";

type InsightCategoryFilter = "all" | "corporate-tax" | "mortgages-liquidity" | "decision-frameworks";

export const InsightsPage: React.FC = () => {
  const { language } = useLanguage();
  const isFr = language === "fr";
  const prefix = isFr ? "/fr" : "";
  const [selectedTheme, setSelectedTheme] = useState<InsightCategoryFilter>("all");

  // Core Analytical Essays
  const ccpcEssay = articles.find(
    (a) => a.slug === "canadian-ccpc-passive-income-grind-sbd-tax-trap"
  );
  const mortgageEssay = articles.find(
    (a) => a.slug === "canadian-mortgage-renewal-shock-liquidity-trap"
  );
  const debtVsSaveEssay = articles.find((a) => a.slug === "savings-or-debt-first");
  const advisorQuestionsEssay = articles.find(
    (a) => a.slug === "questions-before-any-financial-product"
  );

  const allEssays = [
    ccpcEssay,
    mortgageEssay,
    debtVsSaveEssay,
    advisorQuestionsEssay,
  ].filter(Boolean);

  const filteredEssays = allEssays.filter((essay) => {
    if (!essay) return false;
    if (selectedTheme === "all") return true;
    if (selectedTheme === "corporate-tax") {
      return essay.slug.includes("ccpc") || essay.slug.includes("passive-income");
    }
    if (selectedTheme === "mortgages-liquidity") {
      return essay.slug.includes("mortgage") || essay.slug.includes("savings-or-debt");
    }
    if (selectedTheme === "decision-frameworks") {
      return essay.slug.includes("questions-before") || essay.slug.includes("savings-or-debt");
    }
    return true;
  });

  return (
    <div className="py-12 md:py-16">
      <SEO
        title={
          isFr
            ? "Perspectives & Analyses Stratégiques | Ahmed Bello"
            : "Strategic Financial Essays & Insights | Ahmed Bello"
        }
        description={
          isFr
            ? "Analyses économiques approfondies : plafond de 50 000 $ de revenus passifs des SPCC, choc du renouvellement hypothécaire canadien et critères fiduciaires indépendants."
            : "Deep-dive analytical essays on the Canadian CCPC $50,000 passive income limit, mortgage renewal liquidity shock, and evaluating financial advice."
        }
        canonicalUrl="/insights"
      />

      {/* 1. Header with Editorial Rationale */}
      <section className="section pb-12 pt-4 border-b border-[#d6cebd]">
        <div className="wrap max-w-5xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#2e4a3b]/10 text-[#2e4a3b] border border-[#2e4a3b]/25 rounded-[2px] text-xs font-semibold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-[#75581f]" />
            <span>
              {isFr
                ? "Perspectives & Analyses Stratégiques"
                : "Strategic Essays & Economic Briefings"}
            </span>
          </div>

          <h1
            className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1c1b18] leading-[1.12] tracking-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {isFr
              ? "Analyser les décisions financières à fort enjeu."
              : "Rigorous frameworks for high-stakes financial decisions."}
          </h1>

          <p className="lede text-base sm:text-lg text-[#46423a] leading-relaxed max-w-3xl">
            {isFr
              ? "Notre bibliothèque éducative détaille les plafonds officiels de l'ARC et des régimes enregistrés. Ces essais approfondis examinent la mécanique économique sous-jacente : l'architecture de trésorerie d'entreprise, la préservation de la liquidité du bilan familial et l'alignement des incitations professionnelles."
              : "While the education library explains CRA registered limits and basic rules, these long-form essays provide quantitative economic analysis: corporate treasury architecture, total household balance-sheet liquidity, and distinguishing fiduciary principles from sales rhetoric."}
          </p>

          {/* Quick Filter Tabs */}
          <div className="pt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-[#75581f] font-semibold mr-1">
              {isFr ? "Filtrer par thème :" : "Filter by Theme:"}
            </span>
            <button
              type="button"
              onClick={() => setSelectedTheme("all")}
              className={`text-xs px-3 py-1.5 rounded-[2px] border transition-colors ${
                selectedTheme === "all"
                  ? "bg-[#2e4a3b] text-[#f7f3eb] border-[#2e4a3b] font-semibold"
                  : "bg-[#fcfaf5] text-[#1c1b18] border-[#d6cebd] hover:border-[#2e4a3b]"
              }`}
            >
              {isFr ? `Tous les essais (${allEssays.length})` : `All Briefings (${allEssays.length})`}
            </button>
            <button
              type="button"
              onClick={() => setSelectedTheme("corporate-tax")}
              className={`text-xs px-3 py-1.5 rounded-[2px] border transition-colors ${
                selectedTheme === "corporate-tax"
                  ? "bg-[#2e4a3b] text-[#f7f3eb] border-[#2e4a3b] font-semibold"
                  : "bg-[#fcfaf5] text-[#1c1b18] border-[#d6cebd] hover:border-[#2e4a3b]"
              }`}
            >
              {isFr ? "Fiscalité corporative & SPCC" : "Corporate Tax & CCPCs"}
            </button>
            <button
              type="button"
              onClick={() => setSelectedTheme("mortgages-liquidity")}
              className={`text-xs px-3 py-1.5 rounded-[2px] border transition-colors ${
                selectedTheme === "mortgages-liquidity"
                  ? "bg-[#2e4a3b] text-[#f7f3eb] border-[#2e4a3b] font-semibold"
                  : "bg-[#fcfaf5] text-[#1c1b18] border-[#d6cebd] hover:border-[#2e4a3b]"
              }`}
            >
              {isFr ? "Hypothèques & Trésorerie" : "Mortgages & Household Liquidity"}
            </button>
            <button
              type="button"
              onClick={() => setSelectedTheme("decision-frameworks")}
              className={`text-xs px-3 py-1.5 rounded-[2px] border transition-colors ${
                selectedTheme === "decision-frameworks"
                  ? "bg-[#2e4a3b] text-[#f7f3eb] border-[#2e4a3b] font-semibold"
                  : "bg-[#fcfaf5] text-[#1c1b18] border-[#d6cebd] hover:border-[#2e4a3b]"
              }`}
            >
              {isFr ? "Critères décisionnels & Déontologie" : "Advisory Standards & Priorities"}
            </button>
          </div>
        </div>
      </section>

      {/* 2. Flagship Mega Briefings Duo */}
      {selectedTheme === "all" && (
        <section className="section py-16 border-b border-[#d6cebd] bg-[#fcfaf5]">
          <div className="wrap max-w-5xl space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <span className="eyebrow text-xs uppercase tracking-wider text-[#75581f] block">
                  {isFr ? "Recherche de fond" : "Flagship Research"}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#1c1b18]">
                  {isFr ? "Analyses institutionnelles phares" : "Flagship Balance-Sheet Studies"}
                </h2>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[#2e4a3b] font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-[#75581f]" />
                <span>{isFr ? "Modèles chiffrés inclus" : "Quantitative Models Included"}</span>
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Flagship 1: CCPC Passive Income Grind */}
              {ccpcEssay && (
                <div className="p-7 sm:p-8 bg-[#f7f3eb] border-2 border-[#2e4a3b] rounded-[2px] flex flex-col justify-between space-y-5 hover:border-[#1c1b18] transition-all shadow-xs">
                  <div className="space-y-3.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-[#75581f] text-white text-[0.68rem] font-bold uppercase tracking-wider rounded-[2px] inline-flex items-center gap-1">
                        <Landmark className="w-3 h-3" />
                        <span>{isFr ? "Fiscalité corporative" : "Corporate Tax Drag"}</span>
                      </span>
                      <span className="text-xs text-[#625d52]">
                        {ccpcEssay.readingMinutes} {isFr ? "min de lecture" : "min read"}
                      </span>
                      <span className="text-xs text-[#75581f] font-medium hidden sm:inline">
                        &bull; ITA Subsection 125(5.1)
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl text-[#1c1b18] leading-tight">
                      <Link
                        to={`${prefix}${ccpcEssay.url}`}
                        className="hover:text-[#2e4a3b] transition-colors"
                      >
                        {ccpcEssay.title}
                      </Link>
                    </h3>

                    <p className="text-xs sm:text-sm text-[#46423a] leading-relaxed">
                      {ccpcEssay.description}
                    </p>

                    <div className="p-3 bg-[#fcfaf5] border-l-2 border-[#75581f] text-xs text-[#46423a] italic">
                      <strong>{isFr ? "Le problème :" : "The Problem:"}</strong> &ldquo;{ccpcEssay.problem}&rdquo;
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#ece6da] flex items-center justify-between">
                    <Link
                      to={`${prefix}${ccpcEssay.url}`}
                      className="btn btn-primary text-xs py-2.5 px-4 inline-flex items-center gap-1.5"
                    >
                      <span>{isFr ? "Lire l'analyse complète" : "Read Strategic Analysis"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <span className="text-[0.7rem] font-mono text-[#625d52]">
                      {isFr ? "Étude de cas : 1,8 M$ de capital conservé" : "Case Study: $1.8M Retained Capital"}
                    </span>
                  </div>
                </div>
              )}

              {/* Flagship 2: Canadian Mortgage Renewal Shock */}
              {mortgageEssay && (
                <div className="p-7 sm:p-8 bg-[#f7f3eb] border-2 border-[#2e4a3b] rounded-[2px] flex flex-col justify-between space-y-5 hover:border-[#1c1b18] transition-all shadow-xs">
                  <div className="space-y-3.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-[#2e4a3b] text-white text-[0.68rem] font-bold uppercase tracking-wider rounded-[2px] inline-flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3" />
                        <span>{isFr ? "Trésorerie des ménages" : "Household Liquidity"}</span>
                      </span>
                      <span className="text-xs text-[#625d52]">
                        {mortgageEssay.readingMinutes} {isFr ? "min de lecture" : "min read"}
                      </span>
                      <span className="text-xs text-[#75581f] font-medium hidden sm:inline">
                        &bull; Bank of Canada Review
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl text-[#1c1b18] leading-tight">
                      <Link
                        to={`${prefix}${mortgageEssay.url}`}
                        className="hover:text-[#2e4a3b] transition-colors"
                      >
                        {mortgageEssay.title}
                      </Link>
                    </h3>

                    <p className="text-xs sm:text-sm text-[#46423a] leading-relaxed">
                      {mortgageEssay.description}
                    </p>

                    <div className="p-3 bg-[#fcfaf5] border-l-2 border-[#2e4a3b] text-xs text-[#46423a] italic">
                      <strong>{isFr ? "Le problème :" : "The Problem:"}</strong> &ldquo;{mortgageEssay.problem}&rdquo;
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#ece6da] flex items-center justify-between">
                    <Link
                      to={`${prefix}${mortgageEssay.url}`}
                      className="btn btn-primary text-xs py-2.5 px-4 inline-flex items-center gap-1.5"
                    >
                      <span>{isFr ? "Lire l'analyse complète" : "Read Strategic Analysis"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <span className="text-[0.7rem] font-mono text-[#625d52]">
                      {isFr ? "Étude de cas : Piège de remboursement anticipé de 60k$" : "Case Study: $60k Prepayment Trap"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 3. Thought Leadership Quotation Banner */}
      <section className="bg-[#14211a] text-[#f7f3eb] py-12 border-b border-[#2e4a3b]">
        <div className="wrap max-w-4xl text-center space-y-4">
          <Scale className="w-8 h-8 text-[#d6c298] mx-auto opacity-80" />
          <blockquote className="font-serif text-xl sm:text-2xl text-[#f7f3eb] italic leading-relaxed max-w-3xl mx-auto">
            {isFr
              ? "« La finance personnelle conventionnelle évalue la dette et les placements en vase clos. La planification institutionnelle évalue l'ensemble du bilan patrimonial, reconnaissant que la liquidité et les abris fiscaux enregistrés possèdent une valeur d'option économique irremplaçable. »"
              : "“Conventional personal finance evaluates debts and investments in isolated silos. Institutional planning evaluates the total balance sheet, recognizing that liquid capital and registered tax shelters carry irreplaceable economic option value that simplistic interest arithmetic ignores.”"}
          </blockquote>
          <p className="text-xs uppercase tracking-wider text-[#d6c298] font-semibold">
            - Ahmed Bello, Licensed Financial Solutions Professional
          </p>
        </div>
      </section>

      {/* 4. Complete Catalog of Strategic Essays */}
      <section className="section py-16 border-b border-[#d6cebd]">
        <div className="wrap max-w-5xl space-y-8">
          <div>
            <span className="eyebrow text-xs uppercase tracking-wider text-[#75581f]">
              {isFr ? "Tous les essais" : "All Briefings & Frameworks"}
            </span>
            <h2 className="font-serif text-3xl text-[#1c1b18] mt-1">
              {isFr
                ? "Cadres décisionnels & Études comparatives"
                : "Foundational Decision Frameworks"}
            </h2>
            <p className="text-sm text-[#625d52] mt-1">
              {isFr
                ? "Modèles rigoureux pour évaluer les compromis d'argent, la priorité des flux de trésorerie et la vérification des conseils professionnels."
                : "Timeless mental models for evaluating capital allocation, balance-sheet liquidity, and verifying professional advice."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredEssays.map((essay) => {
              if (!essay) return null;
              return (
                <div
                  key={essay.slug}
                  className="p-6 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] flex flex-col justify-between space-y-4 hover:border-[#2e4a3b] transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs text-[#625d52]">
                      <span className="font-semibold text-[#2e4a3b] uppercase tracking-wider text-[0.7rem]">
                        {essay.category === "debt-and-cashflow"
                          ? "Household Treasury"
                          : essay.category === "investing"
                          ? "Corporate & Wealth"
                          : essay.category === "education"
                          ? "Fiduciary Standards"
                          : "Financial Priorities"}
                      </span>
                      <span>&bull;</span>
                      <span>
                        {essay.readingMinutes} {isFr ? "min de lecture" : "min read"}
                      </span>
                    </div>

                    <h3 className="font-serif text-xl text-[#1c1b18] leading-snug">
                      <Link to={`${prefix}${essay.url}`} className="hover:text-[#2e4a3b] transition-colors">
                        {essay.title}
                      </Link>
                    </h3>

                    <p className="text-xs text-[#46423a] leading-relaxed line-clamp-3">
                      {essay.description}
                    </p>

                    <div className="p-3 bg-[#f7f3eb] border-l-2 border-[#8d8677] text-xs text-[#46423a] italic">
                      <strong>{isFr ? "La question :" : "The Question:"}</strong> {essay.question}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#ece6da] flex items-center justify-between">
                    <Link to={`${prefix}${essay.url}`} className="arrow-link text-xs font-semibold">
                      {isFr ? "Lire l'essai complet →" : "Read the essay →"}
                    </Link>
                    <span className="text-[0.7rem] text-[#625d52] inline-flex items-center gap-1">
                      <BadgeCheck className="w-3.5 h-3.5 text-[#2e4a3b]" />
                      <span>{essay.sources?.length || 3} {isFr ? "sources officielles" : "official sources"}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Audience Navigation Hubs Shortcut */}
      <section className="section py-16 bg-[#fcfaf5] border-b border-[#d6cebd]">
        <div className="wrap max-w-5xl space-y-6">
          <div>
            <span className="eyebrow text-xs uppercase tracking-wider text-[#75581f]">
              {isFr ? "Parcours adaptés à votre situation" : "Situation-Specific Hubs"}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#1c1b18] mt-1">
              {isFr
                ? "Explorez selon votre profession ou profil"
                : "Explore by Your Specific Situation"}
            </h2>
            <p className="text-xs sm:text-sm text-[#625d52] mt-1">
              {isFr
                ? "Découvrez les guides et simulateurs regroupés pour votre étape de vie."
                : "Curated guides, statutory rules, and calculators grouped for your circumstances."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to={`${prefix}/for/healthcare`}
              className="p-5 bg-[#f7f3eb] border border-[#d6cebd] hover:border-[#2e4a3b] rounded-[2px] transition-all group flex flex-col justify-between"
            >
              <div>
                <Stethoscope className="w-5 h-5 text-[#2e4a3b] mb-2.5" />
                <h3 className="font-serif text-lg font-medium text-[#1c1b18] group-hover:text-[#2e4a3b] transition-colors leading-snug">
                  {isFr ? "Santé & Médecins" : "Healthcare & Medical"}
                </h3>
                <p className="text-xs text-[#625d52] mt-1.5">
                  {isFr
                    ? "Équivalences de diplômes, trésorerie de transition et protection."
                    : "Credential delays, licensing fee runway, and medical practice protection."}
                </p>
              </div>
              <span className="text-xs font-semibold text-[#2e4a3b] pt-4 flex items-center gap-1">
                {isFr ? "Voir le carrefour →" : "View hub →"}
              </span>
            </Link>

            <Link
              to={`${prefix}/for/business-owners`}
              className="p-5 bg-[#f7f3eb] border border-[#d6cebd] hover:border-[#2e4a3b] rounded-[2px] transition-all group flex flex-col justify-between"
            >
              <div>
                <Building className="w-5 h-5 text-[#2e4a3b] mb-2.5" />
                <h3 className="font-serif text-lg font-medium text-[#1c1b18] group-hover:text-[#2e4a3b] transition-colors leading-snug">
                  {isFr ? "Propriétaires d'entreprises" : "Business Owners"}
                </h3>
                <p className="text-xs text-[#625d52] mt-1.5">
                  {isFr
                    ? "Plafond de 50 000 $ de revenus passifs (DPE), compte de dividendes en capital (CDC) et relève."
                    : "$50,000 passive income threshold (SBD), Capital Dividend Account (CDA), and corporate succession."}
                </p>
              </div>
              <span className="text-xs font-semibold text-[#2e4a3b] pt-4 flex items-center gap-1">
                {isFr ? "Voir le carrefour →" : "View hub →"}
              </span>
            </Link>

            <Link
              to={`${prefix}/for/families`}
              className="p-5 bg-[#f7f3eb] border border-[#d6cebd] hover:border-[#2e4a3b] rounded-[2px] transition-all group flex flex-col justify-between"
            >
              <div>
                <Users className="w-5 h-5 text-[#2e4a3b] mb-2.5" />
                <h3 className="font-serif text-lg font-medium text-[#1c1b18] group-hover:text-[#2e4a3b] transition-colors leading-snug">
                  {isFr ? "Familles canadiennes" : "Canadian Families"}
                </h3>
                <p className="text-xs text-[#625d52] mt-1.5">
                  {isFr
                    ? "Hypothèques, CELIAPP + RAP (100k$ non taxé), REEE et assurance temporaire."
                    : "Mortgage renewal, FHSA + HBP pairing, RESP grants, and term life."}
                </p>
              </div>
              <span className="text-xs font-semibold text-[#2e4a3b] pt-4 flex items-center gap-1">
                {isFr ? "Voir le carrefour →" : "View hub →"}
              </span>
            </Link>

            <Link
              to={`${prefix}/for/newcomers`}
              className="p-5 bg-[#f7f3eb] border border-[#d6cebd] hover:border-[#2e4a3b] rounded-[2px] transition-all group flex flex-col justify-between"
            >
              <div>
                <Compass className="w-5 h-5 text-[#2e4a3b] mb-2.5" />
                <h3 className="font-serif text-lg font-medium text-[#1c1b18] group-hover:text-[#2e4a3b] transition-colors leading-snug">
                  {isFr ? "Nouveaux arrivants" : "New to Canada"}
                </h3>
                <p className="text-xs text-[#625d52] mt-1.5">
                  {isFr
                    ? "Bâtir son crédit de zéro, résidence fiscale et simulateur de survie financière."
                    : "Credit building from scratch, tax residency, and first-year runway tool."}
                </p>
              </div>
              <span className="text-xs font-semibold text-[#2e4a3b] pt-4 flex items-center gap-1">
                {isFr ? "Voir le carrefour →" : "View hub →"}
              </span>
            </Link>
          </div>

          {/* High-Intent Calculator Matrix CTA */}
          <div className="p-5 bg-[#14211a] text-[#f7f3eb] rounded-[2px] border border-[#2e4a3b] flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-center gap-3">
              <Calculator className="w-6 h-6 text-[#d6c298] shrink-0" />
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#d6c298] font-bold block">
                  {isFr ? "Outils de Simulation Fiscale" : "Interactive Decision Simulators"}
                </span>
                <p className="text-sm font-serif text-white mt-0.5">
                  {isFr
                    ? "Modélisez vos décisions financières avec rigueur : piste de subsistance, arbitrage fiscal et SPCC."
                    : "Quantify your numbers against official CRA rules before executing major financial decisions."}
                </p>
              </div>
            </div>
            <div className="shrink-0">
              <Link
                to={`${prefix}/calculators?tab=tfsa-rrsp#calculator-tool`}
                onClick={() => trackCtaClick("insights_banner", "Model your tax-sheltered compound growth")}
                className="btn btn-primary text-xs px-5 py-2.5 inline-flex items-center gap-2 whitespace-nowrap"
              >
                <span>
                  {isFr
                    ? "Modéliser votre croissance composée à l'abri de l'impôt →"
                    : "Model your tax-sheltered compound growth →"}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Educational Mailing List with Honest Copy */}
      <section className="section py-16 border-b border-[#d6cebd] bg-[#f7f3eb]">
        <div className="wrap max-w-4xl">
          <NewsletterSignup
            source="insights_page"
            title={isFr ? "Le Point Financier Intentionnel" : "The Intentional Wealth Briefing"}
            description={
              isFr
                ? "Recevez des analyses ponctuelles lors de modifications législatives importantes de l'ARC, des plafonds enregistrés ou des règles provinciales. Zéro pourriel commercial."
                : "Receive occasional research briefings strictly when significant Canadian statutory tax changes, CRA registered limits, or financial regulations occur. Zero sales spam."
            }
          />
        </div>
      </section>

      {/* 7. Closing Consultation CTA */}
      <section className="section py-20 text-center">
        <div className="wrap max-w-3xl space-y-6">
          <h2 className="display text-[#1c1b18]">
            {isFr
              ? "Une meilleure décision financière commence par une meilleure question."
              : "A better financial decision starts with a better question."}
          </h2>
          <p className="lede text-base md:text-lg text-[#46423a] max-w-xl mx-auto">
            {isFr
              ? "Qu'il s'agisse de gérer le plafond de revenus passifs de votre société, un renouvellement hypothécaire ou la protection de votre famille, commençons par un échange direct."
              : "Whether managing your corporation's passive investment threshold, evaluating a mortgage renewal, or structuring family income protection, let’s start with a direct conversation."}
          </p>
          <div className="pt-2 flex justify-center">
            <Link to={`${prefix}/contact`} className="btn btn-primary text-base px-8 py-3">
              {isFr ? "Démarrer une conversation →" : "Start a Conversation →"}
            </Link>
          </div>
          <p className="text-xs text-[#625d52]">
            {isFr
              ? "Aucune obligation. Zéro pression commerciale. Accompagnement indépendant au Canada."
              : "No obligation. Zero sales pressure. Independent guidance across Canada."}
          </p>
        </div>
      </section>
    </div>
  );
};
