import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.tsx";
import { STATIC_NEWS, MACRO_INDICATORS, NewsItem } from "../content/newsData.ts";
import {
  TrendingUp,
  Clock,
  ExternalLink,
  Search,
  Filter,
  RefreshCw,
  Landmark,
  ShieldCheck,
  ArrowRight,
  BookOpen,
  DollarSign,
  Globe,
  Percent,
  CheckCircle2,
  TrendingDown,
  Building2,
} from "lucide-react";
import { SEO } from "../components/SEO.tsx";

export const NewsPage: React.FC = () => {
  const { language } = useLanguage();
  const isFr = language === "fr";

  // Initialize with robust verified news so the page NEVER renders empty on Vercel or offline
  const [news, setNews] = useState<NewsItem[]>(STATIC_NEWS);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"all" | "CA" | "US" | "rates" | "tax" | "housing">("all");
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchLiveFeeds = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/news");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.items) && data.items.length > 0) {
          // Merge live items with static items, avoiding duplicates
          const seen = new Set<string>();
          const combined: NewsItem[] = [];
          for (const item of [...data.items, ...STATIC_NEWS]) {
            const key = item.title.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 30);
            if (!seen.has(key)) {
              seen.add(key);
              combined.push(item);
            }
          }
          setNews(combined);
          setLastRefreshed(new Date());
        }
      }
    } catch {
      // Silently maintain STATIC_NEWS on static hosts like Vercel
    } finally {
      setIsRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Attempt live fetch on mount
    fetchLiveFeeds();
    const interval = setInterval(fetchLiveFeeds, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredNews = news.filter((item) => {
    const matchesFilter =
      selectedFilter === "all"
        ? true
        : selectedFilter === "CA"
        ? item.country === "CA"
        : selectedFilter === "US"
        ? item.country === "US"
        : item.category === selectedFilter;

    const matchesSearch =
      searchQuery.trim() === "" ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.source.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const featuredStory = filteredNews[0] || news[0];
  const regularStories = filteredNews.slice(1);

  return (
    <div className="py-10 lg:py-16 bg-[#f7f3eb]">
      <SEO
        title={isFr ? "Actualités financières Canada & É.-U. | Ahmed Bello" : "Financial News & Rate Tracker | Ahmed Bello"}
        description={
          isFr
            ? "Actualités financières vérifiées : Banque du Canada, Fed, inflation IPC, taux hypothécaires et réglementation fiscale de l'ARC."
            : "Real-time updates on Bank of Canada policy rate, US Federal Reserve decisions, Canadian inflation CPI, mortgage rates, and CRA tax updates."
        }
        canonicalUrl="/news"
      />
      <div className="wrap max-w-6xl">
        {/* Header Breadcrumbs & Title */}
        <div className="mb-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2 text-xs text-[#75581f] font-semibold uppercase tracking-wider">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2e4a3b] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#2e4a3b]"></span>
              </span>
              <span>{isFr ? "Veille Économique en Direct" : "Live Macroeconomic Intelligence Desk"}</span>
            </div>

            <div className="flex items-center gap-3 text-xs text-[#625d52]">
              <span className="hidden sm:inline">
                {isFr ? "Actualisé:" : "Updated:"} {lastRefreshed.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
              <button
                onClick={fetchLiveFeeds}
                disabled={isRefreshing}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#fcfaf5] border border-[#d6cebd] rounded-sm text-xs text-[#1c1b18] hover:bg-[#ece6da] transition-colors cursor-pointer"
                title={isFr ? "Rafraîchir les flux" : "Refresh feeds"}
              >
                <RefreshCw className={`w-3.5 h-3.5 text-[#2e4a3b] ${isRefreshing ? "animate-spin" : ""}`} />
                <span>{isRefreshing ? (isFr ? "Chargement..." : "Refreshing...") : (isFr ? "Rafraîchir" : "Refresh")}</span>
              </button>
            </div>
          </div>

          <h1
            className="font-serif text-3xl sm:text-5xl text-[#1c1b18] tracking-tight mb-4"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {isFr ? "Actualités Financières & Décisions Monétaires" : "Canadian & North American Financial Intelligence"}
          </h1>
          <p className="text-base sm:text-lg text-[#46423a] max-w-3xl leading-relaxed">
            {isFr
              ? "Surveillance en temps réel des taux de la Banque du Canada, des décisions de la Réserve Fédérale, de l'inflation de Statistique Canada et des règles fiscales de l'ARC. Des sources officielles et vérifiées, reliées directement à nos guides d'orientation patrimoniale."
              : "Real-time institutional intelligence tracking the Bank of Canada policy rate, Federal Reserve FOMC decisions, CPI inflation indices, and CRA tax shelter rules. Curated from official regulatory releases and verified economic reporting."}
          </p>
        </div>

        {/* 1. Macroeconomic Indicator Dashboard Bar */}
        <section className="mb-12">
          <div className="text-xs uppercase tracking-wider text-[#75581f] font-semibold mb-3 flex items-center gap-1.5">
            <Percent className="w-3.5 h-3.5 text-[#2e4a3b]" />
            <span>{isFr ? "Indicateurs Monétaires Clés" : "Benchmark Monetary Indicators"}</span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {MACRO_INDICATORS.map((ind, i) => (
              <div
                key={i}
                className="p-4 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[0.7rem] uppercase tracking-wider text-[#625d52]">
                    <span>{ind.authority}</span>
                    <span
                      className={`inline-flex items-center gap-0.5 font-bold ${
                        ind.trend === "down"
                          ? "text-[#2e4a3b]"
                          : ind.trend === "up"
                          ? "text-[#8a3324]"
                          : "text-[#75581f]"
                      }`}
                    >
                      {ind.trend === "down" ? (
                        <TrendingDown className="w-3 h-3" />
                      ) : (
                        <TrendingUp className="w-3 h-3" />
                      )}
                      {ind.change}
                    </span>
                  </div>
                  <div className="font-serif text-2xl sm:text-3xl font-bold text-[#1c1b18] mt-2 mb-1">
                    {ind.value}
                  </div>
                  <div className="text-xs font-semibold text-[#1c1b18]">{ind.label}</div>
                </div>
                <div className="mt-3 pt-2 border-t border-[#ece6da] text-[0.68rem] text-[#625d52]">
                  {ind.lastUpdated}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Interactive Search & Filters Bar */}
        <div className="mb-8 p-4 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => setSelectedFilter("all")}
              className={`px-3 py-1.5 rounded-sm text-xs font-medium transition-colors cursor-pointer ${
                selectedFilter === "all"
                  ? "bg-[#2e4a3b] text-[#f7f3eb]"
                  : "bg-[#f2ecdf] text-[#46423a] hover:bg-[#ece6da]"
              }`}
            >
              {isFr ? "Toutes les actualités" : "All Intelligence"} ({news.length})
            </button>
            <button
              onClick={() => setSelectedFilter("CA")}
              className={`px-3 py-1.5 rounded-sm text-xs font-medium transition-colors cursor-pointer ${
                selectedFilter === "CA"
                  ? "bg-[#2e4a3b] text-[#f7f3eb]"
                  : "bg-[#f2ecdf] text-[#46423a] hover:bg-[#ece6da]"
              }`}
            >
              🇨🇦 {isFr ? "Canada" : "Canada"}
            </button>
            <button
              onClick={() => setSelectedFilter("US")}
              className={`px-3 py-1.5 rounded-sm text-xs font-medium transition-colors cursor-pointer ${
                selectedFilter === "US"
                  ? "bg-[#2e4a3b] text-[#f7f3eb]"
                  : "bg-[#f2ecdf] text-[#46423a] hover:bg-[#ece6da]"
              }`}
            >
              🇺🇸 {isFr ? "États-Unis" : "United States"}
            </button>
            <button
              onClick={() => setSelectedFilter("rates")}
              className={`px-3 py-1.5 rounded-sm text-xs font-medium transition-colors cursor-pointer ${
                selectedFilter === "rates"
                  ? "bg-[#2e4a3b] text-[#f7f3eb]"
                  : "bg-[#f2ecdf] text-[#46423a] hover:bg-[#ece6da]"
              }`}
            >
              {isFr ? "Taux & Hypothèques" : "Rates & Monetary Policy"}
            </button>
            <button
              onClick={() => setSelectedFilter("tax")}
              className={`px-3 py-1.5 rounded-sm text-xs font-medium transition-colors cursor-pointer ${
                selectedFilter === "tax"
                  ? "bg-[#2e4a3b] text-[#f7f3eb]"
                  : "bg-[#f2ecdf] text-[#46423a] hover:bg-[#ece6da]"
              }`}
            >
              {isFr ? "Fiscalité & ARC" : "Tax & CRA Shelters"}
            </button>
            <button
              onClick={() => setSelectedFilter("housing")}
              className={`px-3 py-1.5 rounded-sm text-xs font-medium transition-colors cursor-pointer ${
                selectedFilter === "housing"
                  ? "bg-[#2e4a3b] text-[#f7f3eb]"
                  : "bg-[#f2ecdf] text-[#46423a] hover:bg-[#ece6da]"
              }`}
            >
              {isFr ? "Immobilier & CELIAPP" : "Housing & FHSA"}
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-[#75581f] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isFr ? "Rechercher un sujet ou institution..." : "Filter by institution or topic..."}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-[#d6cebd] rounded-sm text-xs text-[#1c1b18] placeholder-[#75581f]/60 focus:outline-none focus:border-[#2e4a3b]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#625d52] hover:text-[#1c1b18]"
              >
                &times;
              </button>
            )}
          </div>
        </div>

        {/* 3. Featured Spotlight Story */}
        {featuredStory && (
          <div className="mb-10 p-6 sm:p-8 bg-[#1a2c22] text-[#f7f3eb] rounded-[2px] border border-[#2e4a3b] shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#d6c298]/10 to-transparent pointer-events-none rounded-full blur-2xl"></div>

            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-2.5 py-0.5 bg-[#d6c298] text-[#1a2c22] rounded-[2px] text-[0.68rem] font-bold uppercase tracking-wider">
                  {isFr ? "Actualité Vedette" : "Spotlight Intelligence"}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-[#ece6da]/80">
                  <Landmark className="w-3.5 h-3.5 text-[#d6c298]" />
                  <span>{featuredStory.source}</span>
                </span>
                <span className="text-xs text-[#ece6da]/60">&bull;</span>
                <span className="text-xs text-[#ece6da]/70">
                  {new Date(featuredStory.pubDate).toLocaleDateString([], {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span className="text-xs text-[#d6c298] font-medium">
                  {featuredStory.country === "CA" ? "🇨🇦 Canada" : "🇺🇸 United States"}
                </span>
              </div>

              <h2
                className="font-serif text-2xl sm:text-3xl text-[#f7f3eb] mb-3 leading-snug"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {featuredStory.title}
              </h2>

              <p className="text-sm sm:text-base text-[#ece6da]/90 max-w-3xl leading-relaxed mb-6">
                {featuredStory.summary}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-[#2e4a3b]">
                <a
                  href={featuredStory.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#d6c298] text-[#1a2c22] font-semibold text-xs rounded-sm hover:bg-[#e4d4b3] transition-colors"
                >
                  <span>{isFr ? "Lire la communication officielle" : "Read Official Release"}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                {featuredStory.relatedGuide && (
                  <Link
                    to={`/education/${featuredStory.relatedGuide.slug}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2e4a3b] text-[#f7f3eb] border border-[#d6c298]/30 font-medium text-xs rounded-sm hover:bg-[#253d30] transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#d6c298]" />
                    <span>{isFr ? "Guide Pratique Associé" : "Explore Related Educational Guide"} &rarr;</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 4. Grid of Institutional Stories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularStories.map((item) => (
            <article
              key={item.id}
              className="p-6 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] shadow-xs flex flex-col justify-between hover:border-[#2e4a3b] transition-colors"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-[#625d52] mb-3 pb-2 border-b border-[#ece6da]">
                  <span className="flex items-center gap-1 font-semibold text-[#1c1b18]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#2e4a3b]" />
                    {item.source}
                  </span>
                  <span className="text-[0.72rem]">{item.country === "CA" ? "🇨🇦 CA" : "🇺🇸 US"}</span>
                </div>

                <div className="text-[0.68rem] uppercase tracking-wider text-[#75581f] font-semibold mb-1">
                  {item.category === "rates"
                    ? isFr ? "Taux & Politique" : "Rates & Policy"
                    : item.category === "tax"
                    ? isFr ? "Fiscalité ARC" : "Tax & Shelters"
                    : item.category === "housing"
                    ? isFr ? "Immobilier & Logement" : "Housing & Mortgages"
                    : isFr ? "Économie Générale" : "Macroeconomy"}
                </div>

                <h3 className="font-serif text-lg text-[#1c1b18] mb-2 leading-snug hover:text-[#2e4a3b]">
                  <a href={item.link} target="_blank" rel="noopener noreferrer">
                    {item.title}
                  </a>
                </h3>

                <p className="text-xs text-[#46423a] leading-relaxed line-clamp-3 mb-4">
                  {item.summary}
                </p>
              </div>

              <div>
                {item.relatedGuide && (
                  <div className="mb-4 p-2.5 bg-[#f7f3eb] border-l-2 border-[#2e4a3b] rounded-r-xs">
                    <div className="text-[0.65rem] uppercase tracking-wider text-[#2e4a3b] font-bold">
                      {isFr ? "Stratégie Connexe" : "Practical Strategy"}
                    </div>
                    <Link
                      to={`/education/${item.relatedGuide.slug}`}
                      className="text-xs text-[#1c1b18] hover:text-[#2e4a3b] font-medium line-clamp-1 block mt-0.5"
                    >
                      {item.relatedGuide.title} &rarr;
                    </Link>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-[#ece6da] text-[0.72rem] text-[#625d52]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(item.pubDate).toLocaleDateString([], {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>

                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-[#2e4a3b] hover:underline"
                  >
                    <span>{isFr ? "Source officielle" : "Official Source"}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredNews.length === 0 && (
          <div className="text-center py-16 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px]">
            <p className="text-base text-[#46423a]">
              {isFr ? "Aucune actualité ne correspond à votre recherche." : "No intelligence items match your current filter."}
            </p>
            <button
              onClick={() => {
                setSelectedFilter("all");
                setSearchQuery("");
              }}
              className="mt-3 px-4 py-1.5 bg-[#2e4a3b] text-[#f7f3eb] text-xs font-semibold rounded-sm"
            >
              {isFr ? "Réinitialiser les filtres" : "Reset Filters"}
            </button>
          </div>
        )}

        {/* 5. Institutional Disclaimer Footer */}
        <div className="mt-16 p-6 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] text-xs text-[#625d52] leading-relaxed">
          <p className="font-semibold text-[#1c1b18] mb-1">
            {isFr ? "Note Institutionnelle & Indépendance Éditoriale:" : "Institutional Transparency & Educational Scope:"}
          </p>
          <p>
            {isFr
              ? "Les actualités et indices présentés ci-dessus sont agrégés directement auprès des autorités de régulation et banques centrales officielles (Banque du Canada, Réserve Fédérale, Statistique Canada, Agence du Revenu du Canada). Ce flux est fourni à des fins strictement éducatives pour permettre aux résidents canadiens de comprendre le contexte macroéconomique régissant leurs décisions d'épargne, de dette et de prévoyance. Il ne constitue pas un conseil en investissement ou fiscal individuel."
              : "The intelligence feed above aggregates public monetary policy releases and statutory announcements directly from official regulatory bodies (Bank of Canada, Federal Reserve, Statistics Canada, Canada Revenue Agency). This desk is maintained for educational context to assist Canadian families in understanding the macroeconomic climate governing household borrowing, tax shelters, and income protection. It does not constitute specific individualized financial or tax advice."}
          </p>
        </div>
      </div>
    </div>
  );
};
