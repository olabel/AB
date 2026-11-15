import React, { useState, useMemo, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { SEO } from "../components/SEO.tsx";
import { useLanguage } from "../context/LanguageContext.tsx";
import {
  BLINDSPOTS_DATA,
  BLINDSPOT_CATEGORIES,
  BlindspotItem,
} from "../content/blindspotsData.ts";
import { CalculatorLeadCapture } from "../components/CalculatorLeadCapture.tsx";
import { trackCtaClick, trackBookingClick } from "../lib/track.ts";
import {
  Search,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Copy,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ShieldCheck,
  Users,
  BookmarkCheck,
  Bookmark,
} from "lucide-react";

export const CostlyBlindspotsPage: React.FC = () => {
  const { language } = useLanguage();
  const isFr = language === "fr";
  const prefix = isFr ? "/fr" : "";
  const location = useLocation();

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(() => {
    const hashId = typeof window !== "undefined" ? window.location.hash.replace("#", "") : "";
    const initial: Record<string, boolean> = {
      "clb-zero-dollar-deposit-resp": true,
      "cmhc-eco-plus-25-percent-refund": true,
      "disability-tax-credit-unlocks-six-benefits": true,
    };
    if (hashId) initial[hashId] = true;
    return initial;
  });
  const [flaggedIds, setFlaggedIds] = useState<string[]>([]);
  const [showChecklistForm, setShowChecklistForm] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const hashId = location.hash.replace("#", "");
    if (hashId && BLINDSPOTS_DATA.some((item) => item.id === hashId)) {
      setExpandedItems((prev) => ({ ...prev, [hashId]: true }));
      setTimeout(() => {
        document.getElementById(hashId)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    }
  }, [location.hash]);

  const toggleItem = (id: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleFlag = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFlaggedIds((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((item) => item !== id) : [...prev, id];
      if (!exists) {
        trackCtaClick("blindspot_flag", id);
      }
      return next;
    });
  };

  const expandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    BLINDSPOTS_DATA.forEach((item) => {
      allExpanded[item.id] = true;
    });
    setExpandedItems(allExpanded);
  };

  const collapseAll = () => {
    setExpandedItems({});
  };

  const handleCopy = (item: BlindspotItem) => {
    const title = isFr ? item.titleFr : item.titleEn;
    const action = isFr ? item.actionFr : item.actionEn;
    const label = isFr ? "Démarche clé" : "Key Takeaway";
    const textToCopy = `${title}\n\n${label}: ${action}\n\nhttps://www.ahmedbello.com${prefix}/costly-blindspots#${item.id}`;

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(textToCopy);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: BLINDSPOTS_DATA.length };
    BLINDSPOTS_DATA.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, []);

  const flaggedItems = useMemo(
    () => BLINDSPOTS_DATA.filter((item) => flaggedIds.includes(item.id)),
    [flaggedIds]
  );

  const checklistSummary = useMemo(() => {
    const itemsToInclude =
      flaggedItems.length > 0 ? flaggedItems : BLINDSPOTS_DATA.slice(0, 5);
    const header =
      flaggedItems.length > 0
        ? `Flagged Personal Blindspots (${flaggedItems.length} selected):`
        : "Top 5 High-Impact Canadian Blindspots Starter Checklist:";
    return [
      header,
      "",
      ...itemsToInclude.map(
        (item, idx) =>
          `${idx + 1}. ${isFr ? item.titleFr : item.titleEn}\n   Action: ${
            isFr ? item.actionFr : item.actionEn
          }\n   Link: https://www.ahmedbello.com${prefix}/costly-blindspots#${item.id}`
      ),
    ].join("\n");
  }, [flaggedItems, isFr, prefix]);

  // Filter items based on category and search query
  const filteredItems = useMemo(() => {
    return BLINDSPOTS_DATA.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const title = (isFr ? item.titleFr : item.titleEn).toLowerCase();
      const summary = (isFr ? item.summaryFr : item.summaryEn).toLowerCase();
      const story = (isFr ? item.storyFr : item.storyEn).toLowerCase();
      const tags = (isFr ? item.tagsFr : item.tagsEn).join(" ").toLowerCase();
      const cost = (isFr ? item.costStakeFr : item.costStakeEn).toLowerCase();

      return (
        title.includes(q) ||
        summary.includes(q) ||
        story.includes(q) ||
        tags.includes(q) ||
        cost.includes(q)
      );
    });
  }, [selectedCategory, searchQuery, isFr]);

  const itemListJsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: isFr ? "Pièges Financiers Coûteux au Canada" : "Costly Canadian Money Blindspots",
      description: isFr
        ? "Guide exhaustif des règles financières statutaires souvent découvertes trop tard par les familles, acheteurs et retraités au Canada."
        : "Comprehensive intelligence guide on statutory rules, benefits, and tax mechanisms Canadians discover too late.",
      numberOfItems: BLINDSPOTS_DATA.length,
      itemListElement: BLINDSPOTS_DATA.map((item, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: isFr ? item.titleFr : item.titleEn,
        description: isFr ? item.summaryFr : item.summaryEn,
        url: `https://www.ahmedbello.com${isFr ? "/fr" : ""}/costly-blindspots#${item.id}`,
      })),
    }),
    [isFr]
  );

  return (
    <div className="py-12 md:py-16">
      <SEO
        title={
          isFr
            ? "Pièges Financiers Coûteux au Canada | Ahmed Bello"
            : "Costly Canadian Money Blindspots | Ahmed Bello"
        }
        description={
          isFr
            ? "Règles financières méconnues au Canada : subventions oubliées, délais de prescription et pièges fiscaux découverts trop tard. Démarches concrètes."
            : "Verified Canadian financial blindspots, missed government grants, and costly tax traps that families and professionals discover too late. Actionable steps."
        }
        canonicalUrl={isFr ? "/fr/costly-blindspots" : "/costly-blindspots"}
        jsonLd={itemListJsonLd}
      />

      {/* Hero Section */}
      <section className="section pb-10 pt-2 border-b border-[#d6cebd]">
        <div className="wrap max-w-5xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#2e4a3b]/10 text-[#2e4a3b] border border-[#2e4a3b]/25 rounded-[2px] text-xs font-semibold uppercase tracking-wider">
            <AlertTriangle className="w-3.5 h-3.5 text-[#75581f]" />
            <span>
              {isFr ? "Guide de Vigilance & Droits Légaux" : "Statutory Financial Vigilance"}
            </span>
          </div>

          <h1
            className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1c1b18] leading-[1.14] tracking-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {isFr
              ? "Pièges financiers canadiens que la majorité découvrent trop tard."
              : "Costly Canadian money blindspots most people discover too late."}
          </h1>

          <p className="lede text-base sm:text-lg text-[#46423a] leading-relaxed max-w-3xl">
            {isFr
              ? `Au Canada, le manque d'information sur les programmes publics, les délais de prescription et les règles fiscales coûte des milliards de dollars chaque année aux contribuables. Voici ${BLINDSPOTS_DATA.length} réalités vérifiées, documentées avec leurs lois et démarches concrètes, régulièrement mises à jour.`
              : `In Canadian personal finance, not knowing statutory rules isn't harmless—it is quietly expensive. From unclaimed children's bonds and 25% mortgage rebates to estate traps and clawback thresholds, here are ${BLINDSPOTS_DATA.length} verified provisions every Canadian should master, updated as regulations evolve.`}
          </p>

          {/* Value Anchor Metric Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
            <div className="p-3.5 bg-white border border-[#d6cebd] rounded-[2px]">
              <span className="text-xl sm:text-2xl font-serif font-bold text-[#2e4a3b] block">
                {isFr ? "Jusqu'à 50 000 $" : "Up to $50,000"}
              </span>
              <span className="text-xs text-[#625d52] leading-tight block mt-0.5">
                {isFr ? "Remboursement TPS premier acheteur" : "First-time home buyer GST rebate"}
              </span>
            </div>
            <div className="p-3.5 bg-white border border-[#d6cebd] rounded-[2px]">
              <span className="text-xl sm:text-2xl font-serif font-bold text-[#75581f] block">
                {isFr ? "25 % remboursés" : "25% Back"}
              </span>
              <span className="text-xs text-[#625d52] leading-tight block mt-0.5">
                {isFr ? "Prime d'assurance SCHL Éco Plus" : "CMHC Eco Plus premium refund"}
              </span>
            </div>
            <div className="p-3.5 bg-white border border-[#d6cebd] rounded-[2px]">
              <span className="text-xl sm:text-2xl font-serif font-bold text-[#2e4a3b] block">
                {isFr ? "+42 % à vie" : "+42% Lifetime"}
              </span>
              <span className="text-xs text-[#625d52] leading-tight block mt-0.5">
                {isFr ? "Bonification report RPC/RRQ à 70 ans" : "CPP pension delay bonus at age 70"}
              </span>
            </div>
            <div className="p-3.5 bg-white border border-[#d6cebd] rounded-[2px]">
              <span className="text-xl sm:text-2xl font-serif font-bold text-[#8a3324] block">
                {isFr ? "10 ans" : "10 Years"}
              </span>
              <span className="text-xs text-[#625d52] leading-tight block mt-0.5">
                {isFr ? "Rétroactivité des crédits d'impôt ARC" : "CRA retroactive refund claim window"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Filter and Search Controls */}
      <section className="section py-6 bg-[#fcfaf5] border-b border-[#d6cebd] sticky top-20 z-20 shadow-xs">
        <div className="wrap max-w-5xl space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <label htmlFor="blindspot-search" className="sr-only">
                {isFr ? "Rechercher parmi les pièges financiers" : "Search financial blindspots"}
              </label>
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#75581f]">
                <Search className="w-4 h-4" />
              </div>
              <input
                id="blindspot-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  isFr
                    ? "Rechercher (ex. REEE, CELIAPP, SCHL, TPS, invalidité, FERR, succession)..."
                    : "Search by topic (e.g. RESP, FHSA, CMHC, GST, disability, OAS, will)..."
                }
                className="w-full pl-9 pr-4 py-2 bg-white border border-[#d6cebd] rounded-[2px] text-xs text-[#1c1b18] placeholder-[#7d776a] focus:outline-hidden focus:border-[#2e4a3b] focus:ring-1 focus:ring-[#2e4a3b]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-[#625d52] hover:text-[#1c1b18]"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Expand / Collapse Toggle Buttons */}
            <div className="flex items-center gap-2 self-end md:self-auto text-xs text-[#625d52]">
              <span className="text-[#1c1b18] font-medium mr-1">
                {isFr
                  ? `${filteredItems.length} sur ${BLINDSPOTS_DATA.length} affichés`
                  : `Showing ${filteredItems.length} of ${BLINDSPOTS_DATA.length}`}
              </span>
              <button
                type="button"
                onClick={expandAll}
                className="px-2.5 py-1 bg-white border border-[#d6cebd] rounded-[2px] hover:border-[#2e4a3b] transition-colors"
              >
                {isFr ? "Tout ouvrir" : "Expand All"}
              </button>
              <button
                type="button"
                onClick={collapseAll}
                className="px-2.5 py-1 bg-white border border-[#d6cebd] rounded-[2px] hover:border-[#2e4a3b] transition-colors"
              >
                {isFr ? "Tout fermer" : "Collapse All"}
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {BLINDSPOT_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    trackCtaClick("blindspots_filter", cat.labelEn);
                  }}
                  className={`px-3 py-1.5 rounded-[2px] border transition-colors whitespace-nowrap font-medium cursor-pointer ${
                    isActive
                      ? "bg-[#2e4a3b] text-[#f7f3eb] border-[#2e4a3b] shadow-xs"
                      : "bg-white text-[#46423a] border-[#d6cebd] hover:border-[#2e4a3b]"
                  }`}
                >
                  {isFr ? cat.labelFr : cat.labelEn} ({categoryCounts[cat.id] || 0})
                </button>
              );
            })}
          </div>

          {/* Interactive Personal Blindspots Checklist Bar */}
          {flaggedIds.length > 0 && (
            <div className="p-3 bg-[#14211a] text-[#f7f3eb] border border-[#2e4a3b] rounded-[2px] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <BookmarkCheck className="w-4 h-4 text-[#d6c298] shrink-0" />
                <span>
                  <strong className="text-[#d6c298]">
                    {flaggedIds.length}{" "}
                    {isFr
                      ? flaggedIds.length === 1
                        ? "point sélectionné"
                        : "points sélectionnés"
                      : flaggedIds.length === 1
                      ? "blindspot flagged"
                      : "blindspots flagged"}
                  </strong>{" "}
                  —{" "}
                  {isFr
                    ? "envoyez-vous ces actions par courriel ou vérifiez-les avec Ahmed."
                    : "email yourself these tailored action steps or review them with Ahmed."}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href="#blindspots-checklist-capture"
                  onClick={() => {
                    setShowChecklistForm(true);
                    trackCtaClick("blindspots_bar", "email_flagged_checklist");
                  }}
                  className="px-3 py-1.5 bg-[#d6c298] text-[#14211a] hover:bg-white rounded-[2px] font-semibold transition-colors"
                >
                  {isFr ? "Recevoir ma liste par courriel" : "Email My Action List"}
                </a>
                <button
                  type="button"
                  onClick={() => setFlaggedIds([])}
                  className="px-2 py-1 text-[#ece6da]/80 hover:text-white underline cursor-pointer"
                >
                  {isFr ? "Effacer" : "Clear"}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main List Section */}
      <section className="section py-10">
        <div className="wrap max-w-5xl space-y-6">
          {filteredItems.length === 0 ? (
            <div className="p-10 text-center bg-white border border-[#d6cebd] rounded-[2px] space-y-3">
              <AlertTriangle className="w-8 h-8 text-[#75581f] mx-auto" />
              <h3 className="font-serif text-lg text-[#1c1b18]">
                {isFr ? "Aucun résultat trouvé" : "No matching blindspots found"}
              </h3>
              <p className="text-xs text-[#625d52]">
                {isFr
                  ? "Essayez d'autres mots-clés ou réinitialisez le filtre de catégorie."
                  : "Try clearing your search query or selecting 'All Blindspots'."}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="btn btn-ghost border border-[#d6cebd] hover:border-[#2e4a3b] text-xs px-4 py-2 mt-2"
              >
                {isFr ? "Réinitialiser les filtres" : "Reset Filters"}
              </button>
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isExpanded = Boolean(expandedItems[item.id]);
              const isFlagged = flaggedIds.includes(item.id);
              const title = isFr ? item.titleFr : item.titleEn;
              const summary = isFr ? item.summaryFr : item.summaryEn;
              const story = isFr ? item.storyFr : item.storyEn;
              const action = isFr ? item.actionFr : item.actionEn;
              const costStake = isFr ? item.costStakeFr : item.costStakeEn;
              const categoryLabel = isFr ? item.categoryFr : item.categoryEn;
              const isCopied = copiedId === item.id;

              return (
                <React.Fragment key={item.id}>
                  <article
                    id={item.id}
                    className={`bg-white border rounded-[2px] shadow-xs transition-shadow hover:shadow-sm overflow-hidden scroll-mt-36 ${
                      isFlagged ? "border-[#2e4a3b] ring-1 ring-[#2e4a3b]/20" : "border-[#d6cebd]"
                    }`}
                  >
                    {/* Card Header & Toggle */}
                    <div className="p-5 sm:p-6 flex items-start justify-between gap-4 hover:bg-[#fcfaf5]/60 transition-colors">
                      <button
                        type="button"
                        onClick={() => toggleItem(item.id)}
                        aria-expanded={isExpanded}
                        className="flex-1 text-left cursor-pointer flex items-start justify-between gap-4 focus:outline-hidden group"
                      >
                        <div className="space-y-2 flex-1">
                          {/* Quiet Unboxed Metadata */}
                          <div className="flex items-center gap-2 text-[11px] text-[#625d52] font-mono">
                            <span className="font-bold text-[#75581f]">
                              {String(item.number).padStart(2, "0")}
                            </span>
                            <span aria-hidden="true">/</span>
                            <span className="uppercase tracking-wider font-semibold text-[#2e4a3b]">
                              {categoryLabel}
                            </span>
                          </div>

                          {/* Title Question */}
                          <h2 className="font-serif text-lg sm:text-xl text-[#1c1b18] font-semibold leading-snug group-hover:text-[#2e4a3b] transition-colors">
                            {title}
                          </h2>

                          {/* Financial Stake Warning Callout */}
                          <div className="inline-flex items-center gap-2 text-xs font-medium text-[#8a3324] pt-0.5">
                            <span className="w-1.5 h-1.5 rounded-[1px] bg-[#8a3324] shrink-0" />
                            <span>
                              <strong className="font-semibold text-[#8a3324]">
                                {isFr ? "Enjeu financier : " : "Financial Stake: "}
                              </strong>
                              {costStake}
                            </span>
                          </div>
                        </div>

                        <span className="p-2 text-[#625d52] group-hover:text-[#1c1b18] rounded-[2px] transition-colors shrink-0 mt-0.5">
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-[#2e4a3b]" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </span>
                      </button>

                      <div className="flex items-center shrink-0 mt-1">
                        <button
                          type="button"
                          onClick={(e) => toggleFlag(item.id, e)}
                          aria-pressed={isFlagged}
                          aria-label={isFr ? "Ajouter à ma liste" : "Flag for my checklist"}
                          className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium rounded-[2px] border transition-colors cursor-pointer ${
                            isFlagged
                              ? "bg-[#2e4a3b] text-[#f7f3eb] border-[#2e4a3b]"
                              : "bg-[#fcfaf5] text-[#46423a] border-[#d6cebd] hover:border-[#2e4a3b]"
                          }`}
                        >
                          {isFlagged ? (
                            <>
                              <BookmarkCheck className="w-3.5 h-3.5 text-[#d6c298]" />
                              <span className="hidden sm:inline">{isFr ? "Ajouté" : "Flagged"}</span>
                            </>
                          ) : (
                            <>
                              <Bookmark className="w-3.5 h-3.5 text-[#75581f]" />
                              <span className="hidden sm:inline">{isFr ? "À vérifier" : "Applies to me"}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Expanded Body Content */}
                    {isExpanded && (
                      <div className="px-5 pb-6 sm:px-6 sm:pb-7 pt-2 border-t border-[#ece6da] bg-[#fcfaf5]/30 space-y-5 animate-fadeIn">
                        {/* Full Explanation */}
                        <div className="text-xs sm:text-sm text-[#46423a] leading-relaxed space-y-3">
                          <p>{summary}</p>
                        </div>

                        {/* Human Case Story Box */}
                        <div className="p-4 bg-white border border-[#d6cebd] rounded-[2px] space-y-1.5">
                          <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-[#75581f] font-bold">
                            <Users className="w-3.5 h-3.5" />
                            <span>{isFr ? "Exemple concret" : "Real-World Experience"}</span>
                          </div>
                          <p className="text-xs text-[#33302a] leading-relaxed italic">
                            "{story}"
                          </p>
                        </div>

                        {/* Actionable Directive: Do This */}
                        <div className="p-4 bg-[#14211a] text-[#f7f3eb] rounded-[2px] border border-[#2e4a3b] space-y-1.5">
                          <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-[#d6c298] font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#d6c298]" />
                            <span>{isFr ? "Ce qu'il faut faire :" : "Actionable Step:"}</span>
                          </div>
                          <p className="text-xs sm:text-sm text-[#ece6da] leading-relaxed font-medium">
                            {action}
                          </p>
                        </div>

                        {/* Card Footer Actions */}
                        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-[#ece6da]/80">
                          {/* Tags */}
                          <div className="flex items-center gap-2 text-[#7d776a] text-[11px]">
                            <span>
                              {(isFr ? item.tagsFr : item.tagsEn).join(" · ")}
                            </span>
                          </div>

                          {/* Interactive Buttons */}
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleCopy(item)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#d6cebd] hover:border-[#2e4a3b] text-[#46423a] rounded-[2px] transition-colors cursor-pointer"
                            >
                              {isCopied ? (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2e4a3b]" />
                                  <span className="text-[#2e4a3b] font-medium">
                                    {isFr ? "Copié !" : "Copied!"}
                                  </span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5 text-[#75581f]" />
                                  <span>{isFr ? "Copier l'action" : "Copy takeaway"}</span>
                                </>
                              )}
                            </button>

                            {item.calculatorTab && (
                              <Link
                                to={`${prefix}/calculators?tab=${item.calculatorTab}#calculator-tool`}
                                onClick={() => trackCtaClick("blindspot_calculator_link", item.id)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#2e4a3b] text-[#f7f3eb] hover:bg-[#3d6350] rounded-[2px] transition-colors font-medium"
                              >
                                <span>{isFr ? "Simuler vos chiffres" : "Model in calculator"}</span>
                                <ArrowRight className="w-3 h-3 text-[#d6c298]" />
                              </Link>
                            )}

                            {item.relatedPath && !item.calculatorTab && (
                              <Link
                                to={`${prefix}${item.relatedPath}`}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#2e4a3b] text-[#f7f3eb] hover:bg-[#3d6350] rounded-[2px] transition-colors font-medium"
                              >
                                <span>{isFr ? "Lire le guide complet" : "Read related guide"}</span>
                                <ArrowRight className="w-3 h-3 text-[#d6c298]" />
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </article>

                  {/* Mid-Feed Contextual Lead Capture after card #5 */}
                  {idx === 4 && filteredItems.length > 6 && (
                    <div className="p-6 bg-[#fcfaf5] border-2 border-[#2e4a3b]/35 rounded-[2px] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="space-y-1 max-w-xl">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-[#75581f] font-bold block">
                          {isFr ? "Aide-Mémoire Gratuit" : "Free Personal Checklist"}
                        </span>
                        <h3 className="font-serif text-lg sm:text-xl text-[#1c1b18] font-medium">
                          {isFr
                            ? "Cochez les points qui vous concernent (« À vérifier ») et recevez votre plan d'action"
                            : "Flag any blindspot with “Applies to me” and email yourself the exact action steps"}
                        </h3>
                        <p className="text-xs text-[#625d52]">
                          {isFr
                            ? "Aucun appel requis pour commencer : sélectionnez les règles pertinentes pendant votre lecture."
                            : "No phone call required to start: mark the rules relevant to your household and send the summary to your inbox below."}
                        </p>
                      </div>
                      <a
                        href="#blindspots-checklist-capture"
                        onClick={() => {
                          setShowChecklistForm(true);
                          trackCtaClick("blindspots_midfeed", "jump_to_checklist_capture");
                        }}
                        className="btn btn-primary text-xs py-2.5 px-4 whitespace-nowrap shrink-0 inline-flex items-center gap-1.5"
                      >
                        <span>{isFr ? "Envoyer ma liste" : "Email My Action List"}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#d6c298]" />
                      </a>
                    </div>
                  )}
                </React.Fragment>
              );
            })
          )}

          {/* Personalized Blindspots Checklist Email Capture */}
          <div id="blindspots-checklist-capture" className="scroll-mt-32 pt-2">
            {(flaggedIds.length > 0 || showChecklistForm) && (
              <CalculatorLeadCapture
                calculatorName={
                  flaggedIds.length > 0
                    ? `Personal Canadian Blindspots Checklist (${flaggedIds.length} flagged)`
                    : "Top 5 Canadian Financial Blindspots Checklist"
                }
                analyticsCalculatorName="blindspots_checklist"
                analyticsTopic="general"
                topic="general"
                summaryText={checklistSummary}
                customSubheading={
                  flaggedIds.length > 0
                    ? isFr
                      ? `${flaggedIds.length} Point(s) Sélectionné(s)`
                      : `${flaggedIds.length} Blindspot(s) Selected`
                    : isFr
                    ? "Liste Pratique Gratuite"
                    : "Free Practical Checklist"
                }
                customHeading={
                  flaggedIds.length > 0
                    ? isFr
                      ? `M'envoyer mes ${flaggedIds.length} démarches sélectionnées par courriel`
                      : `Email me my ${flaggedIds.length} flagged blindspot action steps`
                    : isFr
                    ? "Recevoir les 5 oublis financiers les plus fréquents et leurs démarches"
                    : "Email me the Top 5 Costly Blindspots & Action Steps"
                }
                customButtonLabel={
                  isFr
                    ? "Recevoir ma liste d'actions par courriel"
                    : "Email Me My Blindspots Action List"
                }
              />
            )}
            {flaggedIds.length === 0 && !showChecklistForm && (
              <div className="p-6 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#75581f] font-bold">
                    {isFr ? "Passez à l'action" : "Turn Reading Into Action"}
                  </span>
                  <h3 className="font-serif text-lg text-[#1c1b18] font-medium">
                    {isFr
                      ? "Vous ne voulez pas perdre ces démarches ?"
                      : "Want a copy of your personalized blindspot action steps?"}
                  </h3>
                  <p className="text-xs text-[#625d52]">
                    {isFr
                      ? "Cliquez sur « À vérifier » sur les cartes ci-dessus ou demandez directement le top 5 par courriel."
                      : "Click “Applies to me” on any card above—or request the Top 5 high-impact checklist directly."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowChecklistForm(true);
                    trackCtaClick("blindspots_bottom_prompt", "open_checklist_form");
                  }}
                  className="btn btn-primary text-xs py-2.5 px-4 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {isFr ? "Recevoir le Top 5 par courriel" : "Get Top 5 Checklist by Email"}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Advisory Bottom Banner */}
      <section className="section py-16 bg-[#14211a] text-[#f7f3eb] border-t border-[#2e4a3b] text-center">
        <div className="wrap max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#2e4a3b] text-[#d6c298] border border-[#d6c298]/30 rounded-[2px] text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-[#d6c298]" />
            <span>{isFr ? "Vérification Personnalisée du Bilan" : "Comprehensive Financial Review"}</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl text-white">
            {isFr
              ? "Combien de ces règles statutaires influencent actuellement votre bilan familial ?"
              : "How many of these statutory rules currently apply to your balance sheet?"}
          </h2>

          <p className="text-sm text-[#ece6da]/90 max-w-xl mx-auto leading-relaxed">
            {isFr
              ? "Posez une question rapide de 15 minutes ou obtenez un second avis sans pression commerciale sur vos comptes enregistrés, votre renouvellement hypothécaire ou vos crédits non réclamés."
              : "Ask a quick 15-minute question or get a second opinion on your registered shelters, mortgage renewal timeline, and uncollected credits—with zero sales pitch."}
          </p>

          <div className="pt-3">
            <a
              href="https://calendly.com/olabel/30min"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackBookingClick("blindspots_bottom_banner")}
              className="btn btn-primary text-sm px-8 py-3.5 inline-flex items-center gap-2 shadow-md"
            >
              <Calendar className="w-4 h-4 text-[#d6c298]" />
              <span>{isFr ? "Poser une question en 15 min (sans pression)" : "Ask a 15-Min Question (Free, No Pitch)"}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
