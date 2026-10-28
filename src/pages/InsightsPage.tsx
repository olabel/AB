import React, { useState } from "react";
import { Link } from "react-router-dom";
import { articles, categories } from "../content/data.ts";
import { Tbc } from "../components/Tbc.tsx";
import { siteConfig } from "../config/site.ts";
import { useLanguage } from "../context/LanguageContext.tsx";
import { NewsletterSignup } from "../components/NewsletterSignup.tsx";
import {
  ArrowRight,
  TrendingUp,
  Sparkles,
  BookOpen,
  Scale,
  ShieldCheck,
  Building,
  Users,
  Compass,
  Clock,
  Layers,
  FileText,
  Stethoscope,
} from "lucide-react";

type InsightCategoryFilter = "all" | "tax-estates" | "mortgages-liquidity" | "decision-frameworks";

export const InsightsPage: React.FC = () => {
  const { language, t } = useLanguage();
  const isFr = language === "fr";
  const [selectedTheme, setSelectedTheme] = useState<InsightCategoryFilter>("all");

  // All 4 Insights
  const capitalGainsEssay = articles.find(
    (a) => a.slug === "canadian-capital-gains-deemed-disposition-estate-trap"
  );
  const mortgageEssay = articles.find(
    (a) => a.slug === "canadian-mortgage-renewal-shock-liquidity-trap"
  );
  const debtVsSaveEssay = articles.find((a) => a.slug === "savings-or-debt-first");
  const advisorQuestionsEssay = articles.find(
    (a) => a.slug === "questions-before-any-financial-product"
  );

  const allEssays = [
    capitalGainsEssay,
    mortgageEssay,
    debtVsSaveEssay,
    advisorQuestionsEssay,
  ].filter(Boolean);

  const filteredEssays = allEssays.filter((essay) => {
    if (!essay) return false;
    if (selectedTheme === "all") return true;
    if (selectedTheme === "tax-estates") {
      return essay.slug.includes("capital-gains") || essay.slug.includes("estate");
    }
    if (selectedTheme === "mortgages-liquidity") {
      return essay.slug.includes("mortgage") || essay.slug.includes("savings-or-debt");
    }
    if (selectedTheme === "decision-frameworks") {
      return essay.slug.includes("questions-before") || essay.slug.includes("savings-or-debt");
    }
    return true;
  });

  const libraryPreviews = [
    articles.find((a) => a.slug === "tfsa-vs-rrsp"),
    articles.find((a) => a.slug === "fhsa-explained"),
    articles.find((a) => a.slug === "term-vs-permanent-life-insurance"),
  ].filter(Boolean);

  return (
    <div className="py-12 md:py-16">
      {/* 1. Header */}
      <section className="section pb-12 pt-4 border-b border-[#d6cebd]">
        <div className="wrap max-w-5xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#2e4a3b]/10 text-[#2e4a3b] border border-[#2e4a3b]/25 rounded-[2px] text-xs font-semibold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-[#75581f]" />
            <span>
              {isFr
                ? "Perspectives & Analyses Stratégiques"
                : "Strategic Essays & Thought Leadership"}
            </span>
          </div>

          <h1
            className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1c1b18] leading-[1.12] tracking-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {isFr
              ? "Comment aborder les décisions financières à fort enjeu."
              : "How to think through high-stakes money decisions."}
          </h1>

          <p className="lede text-base sm:text-lg text-[#46423a] leading-relaxed max-w-3xl">
            {isFr
              ? "Notre bibliothèque éducative explique les règles et plafonds officiels de l'ARC. Ces essais approfondis fournissent une analyse économique institutionnelle : gestion de la liquidité du bilan familial, coût du capital et distinction entre conseil fiduciaire réel et discours de vente."
              : "The education library explains statutory limits and CRA rules. These long-form essays provide institutional-grade economic analysis: personal balance-sheet liquidity, cost of capital, and distinguishing genuine fiduciary advice from sales pitches."}
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
              onClick={() => setSelectedTheme("tax-estates")}
              className={`text-xs px-3 py-1.5 rounded-[2px] border transition-colors ${
                selectedTheme === "tax-estates"
                  ? "bg-[#2e4a3b] text-[#f7f3eb] border-[#2e4a3b] font-semibold"
                  : "bg-[#fcfaf5] text-[#1c1b18] border-[#d6cebd] hover:border-[#2e4a3b]"
              }`}
            >
              {isFr ? "Fiscalité & Successions" : "Tax & Estate Architecture"}
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
              {isFr ? "Critères de sélection de conseils" : "Advisory Selection & Standards"}
            </button>
          </div>
        </div>
      </section>

      {/* 2. Flagship Strategic Briefings Duo (Spotlighting the 2 Mega Analyses) */}
      {selectedTheme === "all" && (
        <section className="section py-16 border-b border-[#d6cebd] bg-[#fcfaf5]">
          <div className="wrap max-w-5xl space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <span className="eyebrow text-xs uppercase tracking-wider text-[#75581f] block">
                  {isFr ? "Analyses de référence" : "Flagship Research"}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#1c1b18]">
                  {isFr ? "Études stratégiques approfondies" : "Institutional Strategic Analyses"}
                </h2>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[#2e4a3b] font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-[#75581f]" />
                <span>{isFr ? "Modèles financiers inclus" : "Financial Models Included"}</span>
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Flagship 1: Capital Gains & Deemed Disposition */}
              {capitalGainsEssay && (
                <div className="p-7 sm:p-8 bg-[#f7f3eb] border-2 border-[#2e4a3b] rounded-[2px] flex flex-col justify-between space-y-5 hover:border-[#1c1b18] transition-all shadow-xs">
                  <div className="space-y-3.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-[#75581f] text-white text-[0.68rem] font-bold uppercase tracking-wider rounded-[2px]">
                        {isFr ? "Fiscalité & Successions" : "Estate Tax Squeeze"}
                      </span>
                      <span className="text-xs text-[#625d52]">
                        {capitalGainsEssay.readingMinutes} {isFr ? "min de lecture" : "min read"}
                      </span>
                      <span className="text-xs text-[#75581f] font-medium hidden sm:inline">
                        &bull; KPMG Standard
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl text-[#1c1b18] leading-tight">
                      <Link
                        to={capitalGainsEssay.url}
                        className="hover:text-[#2e4a3b] transition-colors"
                      >
                        {capitalGainsEssay.title}
                      </Link>
                    </h3>

                    <p className="text-xs sm:text-sm text-[#46423a] leading-relaxed">
                      {capitalGainsEssay.description}
                    </p>

                    <div className="p-3 bg-[#fcfaf5] border-l-2 border-[#75581f] text-xs text-[#46423a] italic">
                      <strong>The Problem:</strong> &ldquo;{capitalGainsEssay.problem}&rdquo;
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#ece6da] flex items-center justify-between">
                    <Link
                      to={capitalGainsEssay.url}
                      className="btn btn-primary text-xs py-2.5 px-4 inline-flex items-center gap-1.5"
                    >
                      <span>{isFr ? "Lire l'analyse complète" : "Read Strategic Analysis"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <span className="text-[0.7rem] font-mono text-[#625d52]">
                      Case Study: $1.25M Cottage
                    </span>
                  </div>
                </div>
              )}

              {/* Flagship 2: Canadian Mortgage Renewal Shock */}
              {mortgageEssay && (
                <div className="p-7 sm:p-8 bg-[#f7f3eb] border-2 border-[#2e4a3b] rounded-[2px] flex flex-col justify-between space-y-5 hover:border-[#1c1b18] transition-all shadow-xs">
                  <div className="space-y-3.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-[#2e4a3b] text-white text-[0.68rem] font-bold uppercase tracking-wider rounded-[2px]">
                        {isFr ? "Hypothèques & Trésorerie" : "Liquidity Trap"}
                      </span>
                      <span className="text-xs text-[#625d52]">
                        {mortgageEssay.readingMinutes} {isFr ? "min de lecture" : "min read"}
                      </span>
                      <span className="text-xs text-[#75581f] font-medium hidden sm:inline">
                        &bull; McKinsey Framework
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl text-[#1c1b18] leading-tight">
                      <Link
                        to={mortgageEssay.url}
                        className="hover:text-[#2e4a3b] transition-colors"
                      >
                        {mortgageEssay.title}
                      </Link>
                    </h3>

                    <p className="text-xs sm:text-sm text-[#46423a] leading-relaxed">
                      {mortgageEssay.description}
                    </p>

                    <div className="p-3 bg-[#fcfaf5] border-l-2 border-[#2e4a3b] text-xs text-[#46423a] italic">
                      <strong>The Problem:</strong> &ldquo;{mortgageEssay.problem}&rdquo;
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#ece6da] flex items-center justify-between">
                    <Link
                      to={mortgageEssay.url}
                      className="btn btn-primary text-xs py-2.5 px-4 inline-flex items-center gap-1.5"
                    >
                      <span>{isFr ? "Lire l'analyse complète" : "Read Strategic Analysis"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <span className="text-[0.7rem] font-mono text-[#625d52]">
                      Case Study: +$105k Delta
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
              ? "« La finance personnelle conventionnelle évalue la dette en vase clos. La planification institutionnelle évalue l'ensemble du bilan patrimonial — reconnaissant que la liquidité possède une immense valeur d'option économique. »"
              : "“Conventional personal finance evaluates debt in a vacuum. Institutional planning evaluates the total balance sheet — recognizing that liquid capital carries immense economic option value that simple interest arithmetic ignores.”"}
          </blockquote>
          <p className="text-xs uppercase tracking-wider text-[#d6c298] font-semibold">
            — Ahmed Bello, Licensed Financial Solutions Professional
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
                ? "Cadres décisionnels fondamentaux"
                : "Foundational Decision Frameworks"}
            </h2>
            <p className="text-sm text-[#625d52] mt-1">
              {isFr
                ? "Modèles mentaux intemporels pour évaluer les compromis d'argent et l'alignement des incitatifs professionnels."
                : "Timeless mental models for evaluating debt, compounding trade-offs, and professional fiduciary incentives."}
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
                        Financial decision-making
                      </span>
                      <span>&bull;</span>
                      <span>
                        {essay.readingMinutes} {isFr ? "min de lecture" : "min read"}
                      </span>
                    </div>

                    <h3 className="font-serif text-xl text-[#1c1b18] leading-snug">
                      <Link to={essay.url} className="hover:text-[#2e4a3b] transition-colors">
                        {essay.title}
                      </Link>
                    </h3>

                    <p className="text-xs text-[#46423a] leading-relaxed line-clamp-3">
                      {essay.description}
                    </p>

                    <div className="p-3 bg-[#f7f3eb] border-l-2 border-[#8d8677] text-xs text-[#46423a] italic">
                      <strong>The Question:</strong> {essay.question}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#ece6da] flex items-center justify-between">
                    <Link to={essay.url} className="arrow-link text-xs font-semibold">
                      {isFr ? "Lire l'essai complet →" : "Read the essay &rarr;"}
                    </Link>
                    <span className="text-[0.7rem] text-[#625d52]">
                      {essay.sources?.length || 3} {isFr ? "sources vérifiées" : "verified sources"}
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
              to="/for/healthcare"
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
                {isFr ? "Voir le carrefour →" : "View hub &rarr;"}
              </span>
            </Link>

            <Link
              to="/for/business-owners"
              className="p-5 bg-[#f7f3eb] border border-[#d6cebd] hover:border-[#2e4a3b] rounded-[2px] transition-all group flex flex-col justify-between"
            >
              <div>
                <Building className="w-5 h-5 text-[#2e4a3b] mb-2.5" />
                <h3 className="font-serif text-lg font-medium text-[#1c1b18] group-hover:text-[#2e4a3b] transition-colors leading-snug">
                  {isFr ? "Propriétaires d'entreprises" : "Business Owners"}
                </h3>
                <p className="text-xs text-[#625d52] mt-1.5">
                  {isFr
                    ? "Taux d'inclusion de 66,7 %, dividendes en capital (CDC) et gel successoral."
                    : "66.7% capital gains rules, CDA extractions, and corporate freezes."}
                </p>
              </div>
              <span className="text-xs font-semibold text-[#2e4a3b] pt-4 flex items-center gap-1">
                {isFr ? "Voir le carrefour →" : "View hub &rarr;"}
              </span>
            </Link>

            <Link
              to="/for/families"
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
                {isFr ? "Voir le carrefour →" : "View hub &rarr;"}
              </span>
            </Link>

            <Link
              to="/for/newcomers"
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
                {isFr ? "Voir le carrefour →" : "View hub &rarr;"}
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Educational Mailing List */}
      <section className="section py-16 border-b border-[#d6cebd] bg-[#f7f3eb]">
        <div className="wrap max-w-4xl">
          <NewsletterSignup
            source="insights_page"
            title={isFr ? "Le Point Financier Intentionnel" : "The Intentional Wealth Briefing"}
            description={
              isFr
                ? "Recevez chaque mois nos analyses stratégiques et décryptages de la fiscalité canadienne directement dans votre boîte courriel. Zéro pourriel, zéro pression."
                : "Subscribe to receive our monthly research essays and Canadian financial architecture breakdowns directly in your inbox. In-depth analysis, zero sales pressure."
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
              ? "Qu'il s'agisse de renouvellement hypothécaire, d'optimisation fiscale de vos régimes enregistrés ou de protection du revenu familial, commençons par un échange sincère."
              : "Whether navigating an upcoming mortgage renewal, optimizing registered tax shelters, or structuring family income protection, let’s start with an honest conversation."}
          </p>
          <div className="pt-2 flex justify-center">
            <Link to="/contact" className="btn btn-primary text-base px-8 py-3">
              {isFr ? "Démarrer une conversation →" : "Start a Conversation &rarr;"}
            </Link>
          </div>
          <p className="text-xs text-[#625d52]">
            {isFr
              ? "Aucune obligation. Zéro pression commerciale. Accompagnement indépendant au Canada et aux États-Unis."
              : "No obligation. No sales pressure. Independent guidance across Canada and the US."}
          </p>
        </div>
      </section>
    </div>
  );
};
