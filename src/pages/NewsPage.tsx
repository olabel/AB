import React, { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext.tsx";
import { STATIC_NEWS, MACRO_INDICATORS, NewsItem } from "../content/newsData.ts";
import {
  ExternalLink,
  Search,
  RefreshCw,
  Landmark,
  ShieldCheck,
  Percent,
} from "lucide-react";
import { SEO } from "../components/SEO.tsx";

export const NewsPage: React.FC = () => {
  const { isFr } = useLanguage();

  // Initialize with verified fresh news so the page NEVER renders empty on static hosts or offline
  const [news, setNews] = useState<NewsItem[]>(STATIC_NEWS);
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
      // Gracefully retain STATIC_NEWS
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
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
      item.source.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="py-10 lg:py-16 bg-[#f7f3eb]">
      <SEO
        title={isFr ? "Actualités financières Canada & É.-U. | Ahmed Bello" : "Financial News & Rate Tracker | Ahmed Bello"}
        description={
          isFr
            ? "Actualités financières officielles : Banque du Canada, Réserve Fédérale, inflation IPC de Statistique Canada, taux hypothécaires et avis de l'ARC."
            : "Official economic headlines: Bank of Canada policy rate, US Federal Reserve decisions, Canadian CPI inflation, mortgage benchmarks, and CRA tax notices."
        }
        canonicalUrl={isFr ? "/fr/news" : "/news"}
        keywords={[
          "Bank of Canada interest rate",
          "US Federal Reserve rate decision",
          "Canada CPI inflation",
          "CRA tax bracket indexation",
          "Mortgage rates Canada",
          "Canadian financial news",
          "Banque du Canada taux",
          "Actualités financières Canada",
        ]}
      />
      <div className="wrap max-w-5xl">
        {/* Header Breadcrumbs & Title */}
        <div className="mb-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2 text-xs text-[#75581f] font-semibold uppercase tracking-wider">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2e4a3b] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#2e4a3b]"></span>
              </span>
              <span>{isFr ? "Veille Économique Officielle" : "Official Economic Desk"}</span>
            </div>

            <div className="flex items-center gap-3 text-xs text-[#625d52]">
              <span className="hidden sm:inline">
                {isFr ? "Actualisé :" : "Updated:"} {lastRefreshed.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
              <button
                onClick={fetchLiveFeeds}
                disabled={isRefreshing}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#fcfaf5] border border-[#d6cebd] rounded-xs text-xs text-[#1c1b18] hover:bg-[#ece6da] transition-colors cursor-pointer"
                title={isFr ? "Actualiser les dépêches" : "Refresh feeds"}
              >
                <RefreshCw className={`w-3.5 h-3.5 text-[#2e4a3b] ${isRefreshing ? "animate-spin" : ""}`} />
                <span>{isRefreshing ? (isFr ? "Chargement..." : "Refreshing...") : (isFr ? "Actualiser" : "Refresh")}</span>
              </button>
            </div>
          </div>

          <h1
            className="font-serif text-3xl sm:text-5xl text-[#1c1b18] tracking-tight mb-4"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {isFr ? "Actualités Financières & Décisions Monétaires" : "Financial News & Regulatory Announcements"}
          </h1>
          <p className="text-base sm:text-lg text-[#46423a] max-w-3xl leading-relaxed">
            {isFr
              ? "Dépêches officielles issues des autorités de réglementation monétaire et fiscale : Banque du Canada, Réserve Fédérale, Statistique Canada et Agence du revenu du Canada. Titres directs et liens vérifiés vers les publications sources."
              : "Official headlines directly from central banks, statistics agencies, and tax authorities: Bank of Canada, US Federal Reserve, Statistics Canada, and the Canada Revenue Agency."}
          </p>
        </div>

        {/* 1. Macroeconomic Indicator Bar */}
        <section className="mb-10">
          <div className="text-xs uppercase tracking-wider text-[#75581f] font-semibold mb-3 flex items-center gap-1.5">
            <Percent className="w-3.5 h-3.5 text-[#2e4a3b]" />
            <span>{isFr ? "Taux & Repères de Référence" : "Benchmark Rates & Indicators"}</span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            {MACRO_INDICATORS.map((ind, i) => (
              <div
                key={i}
                className="p-3.5 bg-[#fcfaf5] border border-[#d6cebd] rounded-xs flex flex-col justify-between"
              >
                <div>
                  <div className="text-[0.68rem] uppercase tracking-wider text-[#625d52] font-semibold mb-1">
                    {ind.label}
                  </div>
                  <div className="font-serif text-2xl font-bold text-[#1c1b18] mb-1">
                    {ind.value}
                  </div>
                </div>
                <div className="text-[0.7rem] text-[#2e4a3b] font-medium pt-2 border-t border-[#ece6da]">
                  {ind.authority}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Filter & Search Bar */}
        <div className="mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-3 bg-[#fcfaf5] border border-[#d6cebd] rounded-xs">
          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setSelectedFilter("all")}
              className={`px-3 py-1.5 rounded-xs text-xs font-medium transition-colors cursor-pointer ${
                selectedFilter === "all"
                  ? "bg-[#2e4a3b] text-[#f7f3eb]"
                  : "bg-[#f2ecdf] text-[#46423a] hover:bg-[#ece6da]"
              }`}
            >
              {isFr ? "Tout" : "All"} ({news.length})
            </button>
            <button
              onClick={() => setSelectedFilter("CA")}
              className={`px-3 py-1.5 rounded-xs text-xs font-medium transition-colors cursor-pointer ${
                selectedFilter === "CA"
                  ? "bg-[#2e4a3b] text-[#f7f3eb]"
                  : "bg-[#f2ecdf] text-[#46423a] hover:bg-[#ece6da]"
              }`}
            >
              🇨🇦 Canada
            </button>
            <button
              onClick={() => setSelectedFilter("US")}
              className={`px-3 py-1.5 rounded-xs text-xs font-medium transition-colors cursor-pointer ${
                selectedFilter === "US"
                  ? "bg-[#2e4a3b] text-[#f7f3eb]"
                  : "bg-[#f2ecdf] text-[#46423a] hover:bg-[#ece6da]"
              }`}
            >
              🇺🇸 {isFr ? "États-Unis" : "USA"}
            </button>
            <button
              onClick={() => setSelectedFilter("rates")}
              className={`px-3 py-1.5 rounded-xs text-xs font-medium transition-colors cursor-pointer ${
                selectedFilter === "rates"
                  ? "bg-[#2e4a3b] text-[#f7f3eb]"
                  : "bg-[#f2ecdf] text-[#46423a] hover:bg-[#ece6da]"
              }`}
            >
              {isFr ? "Taux" : "Rates"}
            </button>
            <button
              onClick={() => setSelectedFilter("tax")}
              className={`px-3 py-1.5 rounded-xs text-xs font-medium transition-colors cursor-pointer ${
                selectedFilter === "tax"
                  ? "bg-[#2e4a3b] text-[#f7f3eb]"
                  : "bg-[#f2ecdf] text-[#46423a] hover:bg-[#ece6da]"
              }`}
            >
              {isFr ? "Fiscalité" : "Tax"}
            </button>
            <button
              onClick={() => setSelectedFilter("housing")}
              className={`px-3 py-1.5 rounded-xs text-xs font-medium transition-colors cursor-pointer ${
                selectedFilter === "housing"
                  ? "bg-[#2e4a3b] text-[#f7f3eb]"
                  : "bg-[#f2ecdf] text-[#46423a] hover:bg-[#ece6da]"
              }`}
            >
              {isFr ? "Immobilier" : "Housing"}
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 text-[#75581f] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isFr ? "Filtrer les titres..." : "Filter headlines..."}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#d6cebd] rounded-xs text-xs text-[#1c1b18] placeholder-[#75581f]/60 focus:outline-none focus:border-[#2e4a3b]"
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

        {/* 3. News Items List: ONLY Headline, Source Name, Date, Link to Original */}
        <div className="space-y-3.5">
          {filteredNews.map((item) => (
            <article
              key={item.id}
              className="p-4 sm:p-5 bg-[#fcfaf5] border border-[#d6cebd] rounded-xs hover:border-[#2e4a3b] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1 pr-0 sm:pr-4">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#625d52]">
                  <span className="inline-flex items-center gap-1 font-semibold text-[#1c1b18]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#2e4a3b]" />
                    {item.source}
                  </span>
                  <span>&bull;</span>
                  <span>
                    {new Date(item.pubDate).toLocaleDateString(isFr ? "fr-CA" : "en-CA", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span>&bull;</span>
                  <span className="text-[0.68rem] uppercase tracking-wider text-[#75581f] font-semibold">
                    {item.country === "CA" ? "🇨🇦 Canada" : "🇺🇸 USA"}
                  </span>
                </div>

                <h2 className="font-serif text-base sm:text-lg font-semibold text-[#1c1b18] leading-snug">
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#2e4a3b] transition-colors"
                  >
                    {item.title}
                  </a>
                </h2>
              </div>

              <div className="shrink-0 self-start sm:self-center">
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f2ecdf] hover:bg-[#2e4a3b] hover:text-[#f7f3eb] text-[#1c1b18] text-xs font-medium rounded-xs border border-[#d6cebd] transition-colors"
                >
                  <span>{isFr ? "Consulter l'original" : "Original Source"}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </article>
          ))}

          {filteredNews.length === 0 && (
            <div className="p-8 text-center bg-[#fcfaf5] border border-[#d6cebd] rounded-xs text-sm text-[#625d52]">
              {isFr
                ? "Aucune dépêche ne correspond à vos critères."
                : "No headlines matched your search criteria."}
            </div>
          )}
        </div>

        {/* 4. Verification Footnote */}
        <div className="mt-12 p-4 bg-[#ece6da]/60 border-l-2 border-[#8d8677] text-xs text-[#46423a] leading-relaxed">
          <strong>{isFr ? "Source officielle et impartialité :" : "Source verification & neutrality:"}</strong>{" "}
          {isFr
            ? "Les actualités affichées proviennent exclusivement de dépêches officielles d'institutions publiques et financières (Banque du Canada, Réserve Fédérale, Statistique Canada, ARC). Aucun commentaire ou résumé automatisé n'est produit. Chaque titre renvoie directement à la publication originale vérifiable."
            : "Headlines displayed above originate directly from official monetary authorities and government agencies (Bank of Canada, US Federal Reserve, Statistics Canada, CRA). No automated summaries or editorial commentary are generated. Every headline links directly to its primary source documentation."}
        </div>
      </div>
    </div>
  );
};
