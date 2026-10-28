import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.tsx";
import {
  TrendingUp,
  Clock,
  ExternalLink,
  Search,
  Filter,
  RefreshCw,
  Building,
  Landmark,
  ShieldCheck,
  ArrowRight,
  Layers,
  Sparkles,
  BookOpen,
  DollarSign,
  Globe,
} from "lucide-react";

export interface NewsItem {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  source: string;
  summary: string;
  country: "CA" | "US";
  category: "rates" | "housing" | "tax" | "economy";
  relatedGuide?: {
    slug: string;
    title: string;
  };
}

export const NewsPage: React.FC = () => {
  const { language, t } = useLanguage();
  const isFr = language === "fr";

  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"all" | "CA" | "US" | "rates" | "tax">("all");
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchNews = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/news");
      if (!res.ok) {
        throw new Error("Could not load latest live feeds.");
      }
      const data = await res.json();
      if (Array.isArray(data.items)) {
        setNews(data.items);
      }
      setLastRefreshed(new Date());
      setError(null);
    } catch (err: any) {
      console.warn("News fetch fallback active:", err);
      setError(err?.message || "Failed to load live feeds");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNews();
    // Auto-refresh every 15 minutes without user intervention
    const interval = setInterval(fetchNews, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Filtered stories
  const filteredNews = news.filter((item) => {
    // Country or category filter
    if (selectedFilter === "CA" && item.country !== "CA") return false;
    if (selectedFilter === "US" && item.country !== "US") return false;
    if (selectedFilter === "rates" && item.category !== "rates" && item.category !== "housing")
      return false;
    if (selectedFilter === "tax" && item.category !== "tax") return false;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.source.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Featured breaking policy story (e.g. Bank of Canada rate decision or Fed)
  const featuredStory = news.find(
    (n) =>
      n.category === "rates" &&
      (n.title.toLowerCase().includes("bank of canada") ||
        n.title.toLowerCase().includes("interest rate") ||
        n.title.toLowerCase().includes("overnight rate") ||
        n.title.toLowerCase().includes("federal reserve"))
  ) || news[0];

  const formatTimeAgo = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const diffMs = Date.now() - d.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 60) return isFr ? `il y a ${Math.max(1, diffMins)} min` : `${Math.max(1, diffMins)}m ago`;
      if (diffHours < 24) return isFr ? `il y a ${diffHours} h` : `${diffHours}h ago`;
      return isFr ? `il y a ${diffDays} j` : `${diffDays}d ago`;
    } catch {
      return isFr ? "Récemment" : "Recently";
    }
  };

  return (
    <div className="py-12 md:py-16">
      <div className="wrap max-w-5xl space-y-10">
        {/* Header */}
        <header className="pb-8 border-b border-[#d6cebd] space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#2e4a3b]/10 text-[#2e4a3b] border border-[#2e4a3b]/25 rounded-[2px] text-xs font-semibold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>
                {isFr
                  ? "Veille financière en direct • Canada & États-Unis"
                  : "Live Intelligence Desk • Canada & United States"}
              </span>
            </div>

            {/* Auto-update indicator */}
            <div className="flex items-center gap-2 text-xs text-[#625d52]">
              <Clock className="w-3.5 h-3.5 text-[#75581f]" />
              <span>
                {isFr ? "Actualisé :" : "Updated:"}{" "}
                {lastRefreshed.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
              <button
                type="button"
                onClick={fetchNews}
                disabled={isRefreshing}
                className="p-1 text-[#2e4a3b] hover:text-[#1c1b18] transition-colors"
                title={isFr ? "Actualiser maintenant" : "Refresh now"}
                aria-label="Refresh news"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>

          <h1
            className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1c1b18] leading-[1.12] tracking-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {isFr
              ? "Actualités financières et décisions des banques centrales"
              : "Financial News & Central Bank Rate Moves"}
          </h1>

          <p className="text-base sm:text-lg text-[#46423a] leading-relaxed max-w-3xl">
            {isFr
              ? "Décisions sur les taux d'intérêt de la Banque du Canada et de la Réserve fédérale, inflation, directives de l'ARC et marché immobilier. Des sources institutionnelles fiables, actualisées automatiquement."
              : "Real-time interest rate decisions from the Bank of Canada and the US Federal Reserve, inflation CPI metrics, CRA updates, and mortgage market developments from verified institutional sources."}
          </p>

          {/* Search & Filter Bar */}
          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#75581f] absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  isFr
                    ? "Rechercher une actualité (ex. taux d'intérêt, hypothèque, inflation, ARC)..."
                    : "Search financial news (e.g., Bank of Canada, interest rates, mortgage, CRA)..."
                }
                className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] focus:outline-none focus:border-[#2e4a3b]"
              />
            </div>

            <div className="flex flex-wrap gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setSelectedFilter("all")}
                className={`px-3 py-2 text-xs rounded-[2px] border transition-colors ${
                  selectedFilter === "all"
                    ? "bg-[#2e4a3b] text-[#f7f3eb] border-[#2e4a3b] font-semibold"
                    : "bg-[#fcfaf5] text-[#1c1b18] border-[#d6cebd] hover:border-[#2e4a3b]"
                }`}
              >
                {isFr ? "Toutes" : "All"} ({news.length})
              </button>
              <button
                type="button"
                onClick={() => setSelectedFilter("CA")}
                className={`px-3 py-2 text-xs rounded-[2px] border transition-colors ${
                  selectedFilter === "CA"
                    ? "bg-[#2e4a3b] text-[#f7f3eb] border-[#2e4a3b] font-semibold"
                    : "bg-[#fcfaf5] text-[#1c1b18] border-[#d6cebd] hover:border-[#2e4a3b]"
                }`}
              >
                🇨🇦 Canada
              </button>
              <button
                type="button"
                onClick={() => setSelectedFilter("US")}
                className={`px-3 py-2 text-xs rounded-[2px] border transition-colors ${
                  selectedFilter === "US"
                    ? "bg-[#2e4a3b] text-[#f7f3eb] border-[#2e4a3b] font-semibold"
                    : "bg-[#fcfaf5] text-[#1c1b18] border-[#d6cebd] hover:border-[#2e4a3b]"
                }`}
              >
                🇺🇸 United States
              </button>
              <button
                type="button"
                onClick={() => setSelectedFilter("rates")}
                className={`px-3 py-2 text-xs rounded-[2px] border transition-colors ${
                  selectedFilter === "rates"
                    ? "bg-[#2e4a3b] text-[#f7f3eb] border-[#2e4a3b] font-semibold"
                    : "bg-[#fcfaf5] text-[#1c1b18] border-[#d6cebd] hover:border-[#2e4a3b]"
                }`}
              >
                {isFr ? "Taux & Hypothèques" : "Rates & Mortgages"}
              </button>
              <button
                type="button"
                onClick={() => setSelectedFilter("tax")}
                className={`px-3 py-2 text-xs rounded-[2px] border transition-colors ${
                  selectedFilter === "tax"
                    ? "bg-[#2e4a3b] text-[#f7f3eb] border-[#2e4a3b] font-semibold"
                    : "bg-[#fcfaf5] text-[#1c1b18] border-[#d6cebd] hover:border-[#2e4a3b]"
                }`}
              >
                {isFr ? "Fiscalité & ARC" : "Tax & CRA"}
              </button>
            </div>
          </div>
        </header>

        {/* Featured Policy Story Banner */}
        {featuredStory && !searchQuery && selectedFilter === "all" && (
          <section className="p-7 sm:p-8 bg-[#14211a] text-[#f7f3eb] rounded-[2px] border-2 border-[#d6c298] shadow-md space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-[#d6c298] text-[#14211a] text-[0.68rem] font-bold uppercase tracking-wider rounded-[2px]">
                  {isFr ? "Décision de politique monétaire clé" : "Key Monetary Policy Development"}
                </span>
                <span className="text-xs text-[#ece6da]/80">{formatTimeAgo(featuredStory.pubDate)}</span>
              </div>
              <span className="text-xs text-[#d6c298] font-mono font-semibold">
                {featuredStory.country === "CA" ? "🇨🇦 Canada" : "🇺🇸 United States"}
              </span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl text-white leading-tight">
              <a
                href={featuredStory.link}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#d6c298] transition-colors"
              >
                {featuredStory.title}
              </a>
            </h2>

            <p className="text-sm text-[#ece6da]/90 leading-relaxed max-w-3xl">
              {featuredStory.summary}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-[#2e4a3b]">
              <div className="flex items-center gap-3">
                <a
                  href={featuredStory.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary bg-[#d6c298] text-[#14211a] hover:bg-white text-xs py-2.5 px-4 font-semibold inline-flex items-center gap-1.5"
                >
                  <span>{isFr ? "Lire la dépêche officielle" : "Read Official Release"}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <span className="text-xs text-[#ece6da]/70">Source: {featuredStory.source}</span>
              </div>

              {featuredStory.relatedGuide && (
                <Link
                  to={`/education/${featuredStory.relatedGuide.slug}`}
                  className="text-xs text-[#d6c298] hover:underline flex items-center gap-1 font-medium"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#d6c298]" />
                  <span>{featuredStory.relatedGuide.title} &rarr;</span>
                </Link>
              )}
            </div>
          </section>
        )}

        {/* Stories Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl text-[#1c1b18]">
              {isFr ? "Fil d'actualité vérifié" : "Verified Feed Entries"}
            </h2>
            <span className="text-xs text-[#625d52]">
              {filteredNews.length} {isFr ? "articles trouvés" : "articles displayed"}
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] space-y-3">
              <RefreshCw className="w-6 h-6 text-[#2e4a3b] animate-spin mx-auto" />
              <p className="text-sm text-[#46423a]">
                {isFr ? "Chargement des dépêches en direct..." : "Aggregating live institutional feeds..."}
              </p>
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="p-12 text-center bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] space-y-4">
              <p className="text-sm text-[#625d52]">
                {isFr ? "Aucune actualité ne correspond à vos critères." : "No news stories matched your search criteria."}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedFilter("all");
                }}
                className="btn btn-secondary text-xs py-2 px-4"
              >
                {isFr ? "Réinitialiser les filtres" : "Reset Filters"}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredNews.map((item) => (
                <article
                  key={item.id}
                  className="p-6 bg-[#fcfaf5] border border-[#d6cebd] hover:border-[#2e4a3b] rounded-[2px] flex flex-col justify-between space-y-4 transition-all group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-[#625d52]">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#2e4a3b] uppercase tracking-wider text-[0.7rem]">
                          {item.source}
                        </span>
                        <span>&bull;</span>
                        <span>{formatTimeAgo(item.pubDate)}</span>
                      </div>
                      <span className="font-mono text-xs font-semibold">
                        {item.country === "CA" ? "🇨🇦 Canada" : "🇺🇸 US"}
                      </span>
                    </div>

                    <h3 className="font-serif text-lg font-medium text-[#1c1b18] group-hover:text-[#2e4a3b] transition-colors leading-snug">
                      <a href={item.link} target="_blank" rel="noopener noreferrer">
                        {item.title}
                      </a>
                    </h3>

                    <p className="text-xs text-[#46423a] leading-relaxed line-clamp-3">
                      {item.summary}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#ece6da] space-y-3">
                    <div className="flex items-center justify-between">
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-[#2e4a3b] hover:underline inline-flex items-center gap-1"
                      >
                        <span>{isFr ? "Lire la source" : "Read Source"}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>

                      <span className="text-[0.68rem] px-2 py-0.5 bg-[#f7f3eb] border border-[#d6cebd] rounded-[2px] uppercase tracking-wider text-[#75581f] font-semibold">
                        {item.category === "rates"
                          ? isFr
                            ? "Taux d'intérêt"
                            : "Policy Rates"
                          : item.category === "housing"
                          ? isFr
                            ? "Immobilier"
                            : "Housing"
                          : item.category === "tax"
                          ? isFr
                            ? "Fiscalité"
                            : "Tax / CRA"
                          : isFr
                          ? "Économie"
                          : "Economy"}
                      </span>
                    </div>

                    {item.relatedGuide && (
                      <div className="p-2.5 bg-[#f7f3eb] rounded-[2px] text-[0.75rem] flex items-center justify-between">
                        <span className="text-[#625d52]">
                          {isFr ? "Analyse liée :" : "Strategic Context:"}
                        </span>
                        <Link
                          to={`/education/${item.relatedGuide.slug}`}
                          className="font-medium text-[#2e4a3b] hover:underline"
                        >
                          {item.relatedGuide.title} &rarr;
                        </Link>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Advisory Context Box */}
        <section className="p-8 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] text-center space-y-4">
          <h3 className="font-serif text-2xl text-[#1c1b18]">
            {isFr
              ? "Que signifient ces mouvements de taux pour votre bilan personnel ?"
              : "What Do Macro Rate Decisions Mean for Your Personal Balance Sheet?"}
          </h3>
          <p className="text-sm text-[#46423a] max-w-2xl mx-auto leading-relaxed">
            {isFr
              ? "Lorsque la Banque du Canada ou la Réserve fédérale ajuste son taux directeur, cela affecte directement votre coût d'emprunt, votre rendement d'épargne enregistrée et votre stratégie de renouvellement hypothécaire. Examinons votre situation en toute clarté."
              : "Central bank policy rate changes directly alter mortgage renewal costs, savings yields, and the mathematical trade-off between debt elimination and registered compounding (TFSA/RRSP). Let's review your options with zero pressure."}
          </p>
          <div className="pt-2 flex justify-center">
            <Link to="/contact" className="btn btn-primary text-sm px-6 py-3">
              {isFr ? "Démarrer une conversation →" : "Start a Conversation &rarr;"}
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};
