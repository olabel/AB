import React, { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { articles, categories } from "../content/data.ts";
import { siteConfig } from "../config/site.ts";
import { Search, X, ArrowRight, Calculator, Stethoscope, Briefcase, Users, Compass } from "lucide-react";
import { NewcomerPlanningCalculator } from "../components/NewcomerPlanningCalculator.tsx";
import { useLanguage } from "../context/LanguageContext.tsx";
import { SEO } from "../components/SEO.tsx";

export const EducationLibraryPage: React.FC = () => {
  const { language } = useLanguage();
  const prefix = language === "fr" ? "/fr" : "";
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get("q") || "";
  const selectedCategory = searchParams.get("category") || "all";

  const handleSearchChange = (newQ: string) => {
    const next = new URLSearchParams(searchParams);
    if (newQ.trim()) {
      next.set("q", newQ);
    } else {
      next.delete("q");
    }
    setSearchParams(next, { replace: true });
  };

  const handleCategorySelect = (catId: string) => {
    const next = new URLSearchParams(searchParams);
    if (catId === "all") {
      next.delete("category");
    } else {
      next.set("category", catId);
    }
    setSearchParams(next);
  };

  // Only guide kinds or all articles? The prompt states 10 finished articles (8 guides, 2 insights).
  // The education library features the guides and articles. Let's filter across all articles or guides.
  // In the attached markdown, it listed 8 articles under Education Library:
  // tfsa-vs-rrsp, investment-risk-vs-goal-risk, fhsa-explained, consumer-proposals-explained,
  // income-depends-on-you, resp-basics, cpp-oas-start-age, new-to-canada-money-basics.
  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      // Category filter
      if (selectedCategory !== "all" && art.category !== selectedCategory) {
        return false;
      }
      // Query filter
      if (query.trim()) {
        const q = query.toLowerCase();
        const matchesTitle = art.title.toLowerCase().includes(q);
        const matchesDesc = art.description.toLowerCase().includes(q);
        const matchesQuestion = art.question.toLowerCase().includes(q);
        const matchesProblem = art.problem.toLowerCase().includes(q);
        return matchesTitle || matchesDesc || matchesQuestion || matchesProblem;
      }
      return true;
    });
  }, [selectedCategory, query]);

  // Counts by category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: articles.length };
    categories.forEach((cat) => {
      counts[cat.id] = articles.filter((a) => a.category === cat.id).length;
    });
    return counts;
  }, []);

  return (
    <div className="py-12 md:py-16">
      <SEO
        title={language === "fr" ? "Bibliothèque d'éducation financière | Ahmed Bello" : "Financial Education Library | Ahmed Bello"}
        description={
          language === "fr"
            ? "Guides éducatifs clairs sur le CELI, REER, CELIAPP, RESP, pensions publiques RPC/SV et stratégies d'endettement au Canada."
            : "Plain-language explanations of Canadian registered accounts (TFSA, RRSP, FHSA), risk, debt, income protection, and public pensions."
        }
        canonicalUrl="/education"
      />
      {/* CollectionPage Schema JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Financial Education Library | Ahmed Bello",
            "description": "Plain-language explanations of Canadian registered accounts, risk, debt, protection, and retirement rules.",
            "url": `${siteConfig.siteUrl}/education`
          })
        }}
      />

      {/* Header */}
      <section className="section pb-12 pt-4 border-b border-[#d6cebd]">
        <div className="wrap max-w-4xl space-y-5">
          <span className="eyebrow text-xs">Financial education library</span>
          <h1 className="h1 text-[#1c1b18] leading-tight">
            Understand the rules before you choose the account.
          </h1>
          <p className="lede text-lg md:text-xl text-[#46423a] leading-relaxed">
            Plain-language explanations of how Canadian money rules actually work, with the trade-offs,
            the common misunderstandings and a link to the official source every time.
          </p>

          <div className="p-4 bg-[#ece6da]/60 border-l-2 border-[#8d8677] text-xs text-[#46423a] leading-relaxed">
            <strong>Educational content, not advice.</strong> This page offers general financial education. It is not
            personalized financial, tax, legal or investment advice, and it is not an offer or solicitation to buy or
            sell any product. Your circumstances are different, rules and limits change, and examples use hypothetical
            figures. Confirm current details with the sources listed and with a qualified professional before acting.{" "}
            <Link to="/disclosures" className="underline text-[#2e4a3b]">
              Read the full disclosures →
            </Link>
          </div>
        </div>
      </section>

      {/* Targeted Topic Clusters: Specialized Situation & Profession Hubs */}
      <section className="section py-12 bg-[#fcfaf5] border-b border-[#d6cebd]">
        <div className="wrap max-w-6xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="eyebrow text-xs uppercase tracking-wider text-[#75581f]">
                {language === "fr" ? "Parcours Spécialisés" : "Targeted Topic Clusters"}
              </span>
              <h2 className="h2 text-[#1c1b18] mt-1 text-2xl md:text-3xl">
                {language === "fr" ? "Guides groupés par situation et profession" : "Guides Grouped by Situation & Profession"}
              </h2>
              <p className="text-sm text-[#46423a] mt-1.5 max-w-2xl leading-relaxed">
                {language === "fr"
                  ? "Accédez directement à nos synthèses statutaires, règles de comptes et outils d'analyse conçus pour votre réalité financière."
                  : "Explore curated statutory rules, registered account strategies, and simulators tailored for your specific stage of life or career."}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Islamic Investing Feature */}
            <Link
              to={`${prefix}/investing/islamic-equity`}
              className="p-5 bg-[#14211a] text-[#f7f3eb] border border-[#d6c298] hover:border-[#52b788] rounded-[2px] transition-all group flex flex-col justify-between hover:shadow-md"
            >
              <div>
                <div className="p-2 w-fit bg-[#d6c298]/20 rounded-[2px] text-[#d6c298] mb-3">
                  <span className="font-serif font-bold text-sm tracking-wider">HALAL</span>
                </div>
                <h3 className="font-serif text-lg font-medium text-white group-hover:text-[#d6c298] transition-colors leading-snug">
                  {language === "fr" ? "Investissement Islamique" : "Islamic Investing"}
                </h3>
                <p className="text-xs text-[#ece6da]/80 mt-2 leading-relaxed">
                  {language === "fr"
                    ? "Actions mondiales conformes à la charia (AAOIFI). Intégration CELI, REER et CELIAPP."
                    : "Shari'ah-compliant global equities under AAOIFI screening inside TFSA, RRSP & FHSA."}
                </p>
              </div>
              <span className="text-xs font-semibold text-[#d6c298] pt-4 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                {language === "fr" ? "Cadre Éducatif →" : "Educational Guide →"}
              </span>
            </Link>

            {/* Healthcare & Doctors */}
            <Link
              to={`${prefix}/for/healthcare`}
              className="p-5 bg-[#f7f3eb] border border-[#d6cebd] hover:border-[#2e4a3b] rounded-[2px] transition-all group flex flex-col justify-between hover:shadow-xs"
            >
              <div>
                <div className="p-2 w-fit bg-[#2e4a3b]/10 rounded-[2px] text-[#2e4a3b] mb-3">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-medium text-[#1c1b18] group-hover:text-[#2e4a3b] transition-colors leading-snug">
                  {language === "fr" ? "Santé & Médecins" : "Healthcare & Doctors"}
                </h3>
                <p className="text-xs text-[#625d52] mt-2 leading-relaxed">
                  {language === "fr"
                    ? "Délai d'équivalence, trésorerie de transition et protection du revenu médical."
                    : "Licensing gap planning, credential verification fees, and income protection."}
                </p>
              </div>
              <span className="text-xs font-semibold text-[#2e4a3b] pt-4 flex items-center gap-1">
                {language === "fr" ? "Explorer →" : "Explore hub →"}
              </span>
            </Link>

            {/* Business Owners & CCPCs */}
            <Link
              to={`${prefix}/for/business-owners`}
              className="p-5 bg-[#f7f3eb] border border-[#d6cebd] hover:border-[#2e4a3b] rounded-[2px] transition-all group flex flex-col justify-between hover:shadow-xs"
            >
              <div>
                <div className="p-2 w-fit bg-[#2e4a3b]/10 rounded-[2px] text-[#2e4a3b] mb-3">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-medium text-[#1c1b18] group-hover:text-[#2e4a3b] transition-colors leading-snug">
                  {language === "fr" ? "Entreprises & SPCC" : "Business Owners"}
                </h3>
                <p className="text-xs text-[#625d52] mt-2 leading-relaxed">
                  {language === "fr"
                    ? "Règles fiscales de gains en capital, extraction CDC et plafond de 50k$ de revenu passif."
                    : "Corporate capital gains rules, CDA extraction, and $50k passive income grind."}
                </p>
              </div>
              <span className="text-xs font-semibold text-[#2e4a3b] pt-4 flex items-center gap-1">
                {language === "fr" ? "Explorer →" : "Explore hub →"}
              </span>
            </Link>

            {/* Canadian Families */}
            <Link
              to={`${prefix}/for/families`}
              className="p-5 bg-[#f7f3eb] border border-[#d6cebd] hover:border-[#2e4a3b] rounded-[2px] transition-all group flex flex-col justify-between hover:shadow-xs"
            >
              <div>
                <div className="p-2 w-fit bg-[#2e4a3b]/10 rounded-[2px] text-[#2e4a3b] mb-3">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-medium text-[#1c1b18] group-hover:text-[#2e4a3b] transition-colors leading-snug">
                  {language === "fr" ? "Familles canadiennes" : "Canadian Families"}
                </h3>
                <p className="text-xs text-[#625d52] mt-2 leading-relaxed">
                  {language === "fr"
                    ? "Choc hypothécaire, cumul CELIAPP + RAP (100k$ non taxé) et retraits REEE."
                    : "Mortgage renewal shock, FHSA + HBP stacking, and strategic RESP withdrawals."}
                </p>
              </div>
              <span className="text-xs font-semibold text-[#2e4a3b] pt-4 flex items-center gap-1">
                {language === "fr" ? "Explorer →" : "Explore hub →"}
              </span>
            </Link>

            {/* Newcomers to Canada */}
            <Link
              to={`${prefix}/for/newcomers`}
              className="p-5 bg-[#f7f3eb] border border-[#d6cebd] hover:border-[#2e4a3b] rounded-[2px] transition-all group flex flex-col justify-between hover:shadow-xs"
            >
              <div>
                <div className="p-2 w-fit bg-[#2e4a3b]/10 rounded-[2px] text-[#2e4a3b] mb-3">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-medium text-[#1c1b18] group-hover:text-[#2e4a3b] transition-colors leading-snug">
                  {language === "fr" ? "Nouveaux arrivants" : "New to Canada"}
                </h3>
                <p className="text-xs text-[#625d52] mt-2 leading-relaxed">
                  {language === "fr"
                    ? "Bâtir son crédit de zéro, résidence fiscale et simulateur de survie financière."
                    : "Credit building from scratch, tax residency timing, and financial runway simulator."}
                </p>
              </div>
              <span className="text-xs font-semibold text-[#2e4a3b] pt-4 flex items-center gap-1">
                {language === "fr" ? "Explorer →" : "Explore hub →"}
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="section py-8 bg-[#fcfaf5] border-b border-[#d6cebd]">
        <div className="wrap max-w-5xl space-y-6">
          {/* Keyword Search Input */}
          <div className="relative max-w-xl">
            <label htmlFor="search-input" className="sr-only">
              Search guides by keyword
            </label>
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#625d52]">
              <Search className="w-4 h-4" aria-hidden="true" />
            </div>
            <input
              id="search-input"
              type="text"
              value={query}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search by topic, account, or question (e.g., TFSA, debt, pension)..."
              className="field pl-10 pr-9 text-sm w-full bg-white"
            />
            {query && (
              <button
                type="button"
                onClick={() => handleSearchChange("")}
                aria-label="Clear search query"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#625d52] hover:text-[#1c1b18]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Filter Buttons */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#75581f] mb-2.5">
              Filter by topic:
            </div>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter guides by topic">
              <button
                type="button"
                onClick={() => handleCategorySelect("all")}
                aria-pressed={selectedCategory === "all"}
                className={`px-3 py-1.5 text-xs font-medium rounded-[2px] border transition-colors ${
                  selectedCategory === "all"
                    ? "bg-[#2e4a3b] text-[#f7f3eb] border-[#2e4a3b]"
                    : "bg-[#f7f3eb] text-[#1c1b18] border-[#d6cebd] hover:border-[#8d8677]"
                }`}
              >
                All topics ({categoryCounts.all})
              </button>
              {categories.map((cat) => {
                const count = categoryCounts[cat.id] || 0;
                if (count === 0) return null;
                const isSelected = selectedCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategorySelect(cat.id)}
                    aria-pressed={isSelected}
                    className={`px-3 py-1.5 text-xs font-medium rounded-[2px] border transition-colors ${
                      isSelected
                        ? "bg-[#2e4a3b] text-[#f7f3eb] border-[#2e4a3b]"
                        : "bg-[#f7f3eb] text-[#1c1b18] border-[#d6cebd] hover:border-[#8d8677]"
                    }`}
                  >
                    {cat.label} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between text-xs text-[#625d52] pt-2">
            <span>
              Showing {filteredArticles.length} {filteredArticles.length === 1 ? "article" : "articles"}
              {query && ` matching “${query}”`}
            </span>
            {(query || selectedCategory !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setSearchParams({});
                }}
                className="underline text-[#2e4a3b] hover:text-[#1c1b18]"
              >
                Reset filters
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Article Cards Grid or Empty State */}
      <section className="section py-16">
        <div className="wrap max-w-5xl">
          {filteredArticles.length === 0 ? (
            <div className="p-12 text-center bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] space-y-4">
              <h3 className="h3 text-[#1c1b18]">No articles found</h3>
              <p className="text-sm text-[#625d52] max-w-md mx-auto">
                No guides matched your search criteria. Try a different search term or clear the filter.
              </p>
              <button
                type="button"
                onClick={() => setSearchParams({})}
                className="btn btn-primary text-xs py-2 px-4"
              >
                Show all articles
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredArticles.map((art) => {
                const cat = categories.find((c) => c.id === art.category);
                return (
                  <article
                    key={art.slug}
                    className="p-8 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] flex flex-col justify-between hover:border-[#2e4a3b] transition-all group"
                  >
                    <div className="space-y-3.5">
                      <div className="flex items-center gap-2 text-xs text-[#625d52]">
                        <span className="font-semibold text-[#2e4a3b] uppercase tracking-wider text-[0.7rem]">
                          {cat?.label || art.category}
                        </span>
                        <span>/</span>
                        <span>{art.readingMinutes} min read</span>
                      </div>

                      <h3 className="h3 text-[#1c1b18] group-hover:text-[#2e4a3b] transition-colors leading-snug">
                        <Link to={art.url}>{art.title}</Link>
                      </h3>

                      <p className="text-sm text-[#46423a] leading-relaxed">
                        {art.description}
                      </p>

                      <div className="p-3 bg-[#f7f3eb] border-l-2 border-[#8d8677] text-xs text-[#46423a] italic">
                        <strong>The question:</strong> {art.question}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-[#ece6da] mt-6 flex items-center justify-between">
                      <Link
                        to={art.url}
                        className="text-xs font-semibold text-[#2e4a3b] flex items-center gap-1 group-hover:underline"
                      >
                        <span>Read the article</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                      <span className="text-xs text-[#625d52]">
                        {art.sources.length} sources
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Interactive Tool: Newcomer Financial Planning Runway Calculator */}
      <section id="runway-calculator" className="section py-16 bg-[#f7f3eb] border-t border-[#d6cebd]">
        <div className="wrap max-w-5xl">
          <NewcomerPlanningCalculator />
        </div>
      </section>

      {/* How these guides are written */}
      <section className="section py-16 bg-[#fcfaf5] border-y border-[#d6cebd]">
        <div className="wrap max-w-4xl space-y-6">
          <h2 className="h2 text-[#1c1b18]">How these guides are written</h2>
          <ul className="space-y-3 prose-editorial text-sm md:text-base text-[#46423a]">
            <li>
              Each one answers a single question, then explains the concept, a hypothetical example, common misunderstandings and the trade-offs.
            </li>
            <li>
              Figures come from the Canada Revenue Agency and other official sources, are dated, and are linked so you can check them.
            </li>
            <li>
              Examples use hypothetical numbers and are labelled as such. Nothing here is a prediction or a promise.
            </li>
            <li>
              Read the full{" "}
              <Link to="/standards" className="underline text-[#2e4a3b]">
                editorial standards
              </Link>
              , or tell me if a guide is missing the answer to your question. It may become the next one.
            </li>
          </ul>
        </div>
      </section>

      {/* Didn't find your question? CTA */}
      <section className="section py-20 text-center">
        <div className="wrap max-w-3xl space-y-6">
          <h2 className="h2 text-[#1c1b18]">Didn’t find your question?</h2>
          <p className="lede text-base md:text-lg text-[#46423a] max-w-xl mx-auto">
            Tell me what you are trying to understand. Your question may become the next guide, and I can point you to the right source or professional.
          </p>
          <div className="pt-2 flex justify-center">
            <Link to="/contact" className="btn btn-primary text-base px-8 py-3">
              Start a Conversation →
            </Link>
          </div>
          <p className="text-xs text-[#625d52]">
            No obligation. No sales pressure.
          </p>
        </div>
      </section>
    </div>
  );
};
