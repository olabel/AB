import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { SEO } from "../components/SEO.tsx";
import { useLanguage } from "../context/LanguageContext.tsx";
import {
  BLINDSPOTS_DATA,
  BLINDSPOT_CATEGORIES,
  BlindspotItem,
} from "../content/blindspotsData.ts";
import { trackCtaClick, trackBookingClick } from "../lib/track.ts";
import {
  Search,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Share2,
  Copy,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  PiggyBank,
  Home,
  Users,
  Briefcase,
  ExternalLink,
} from "lucide-react";

export const CostlyBlindspotsPage: React.FC = () => {
  const { language } = useLanguage();
  const isFr = language === "fr";
  const prefix = isFr ? "/fr" : "";

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(() => {
    // Expand the first 3 items by default for immediate engagement
    return {
      "clb-zero-dollar-deposit-resp": true,
      "cmhc-eco-plus-25-percent-refund": true,
      "disability-tax-credit-unlocks-six-benefits": true,
    };
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
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
    const textToCopy = `${title}\n\nKey Takeaway: ${action}\n\nVia Ahmed Bello Financial Practice: https://www.ahmedbello.com/costly-blindspots#${item.id}`;
    
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(textToCopy);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

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
                Up to $50,000
              </span>
              <span className="text-xs text-[#625d52] leading-tight block mt-0.5">
                {isFr ? "Remboursement TPS premier acheteur" : "First-time home buyer GST rebate"}
              </span>
            </div>
            <div className="p-3.5 bg-white border border-[#d6cebd] rounded-[2px]">
              <span className="text-xl sm:text-2xl font-serif font-bold text-[#75581f] block">
                25% Back
              </span>
              <span className="text-xs text-[#625d52] leading-tight block mt-0.5">
                {isFr ? "Prime d'assurance SCHL Éco Plus" : "CMHC Eco Plus premium refund"}
              </span>
            </div>
            <div className="p-3.5 bg-white border border-[#d6cebd] rounded-[2px]">
              <span className="text-xl sm:text-2xl font-serif font-bold text-[#2e4a3b] block">
                +42% Lifetime
              </span>
              <span className="text-xs text-[#625d52] leading-tight block mt-0.5">
                {isFr ? "Bonification report RPC/RRQ à 70 ans" : "CPP pension delay bonus at age 70"}
              </span>
            </div>
            <div className="p-3.5 bg-white border border-[#d6cebd] rounded-[2px]">
              <span className="text-xl sm:text-2xl font-serif font-bold text-[#8a3324] block">
                10 Years
              </span>
              <span className="text-xs text-[#625d52] leading-tight block mt-0.5">
                {isFr ? "Rétroactivité des crédits d'impôt ARC" : "CRA retroactive refund claim window"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Filter and Search Controls */}
      <section className="section py-6 bg-[#fcfaf5] border-b border-[#d6cebd] sticky top-16 z-20 shadow-xs">
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
                  className={`px-3 py-1.5 rounded-[2px] border transition-colors whitespace-nowrap font-medium ${
                    isActive
                      ? "bg-[#2e4a3b] text-[#f7f3eb] border-[#2e4a3b] shadow-xs"
                      : "bg-white text-[#46423a] border-[#d6cebd] hover:border-[#2e4a3b]"
                  }`}
                >
                  {isFr ? cat.labelFr : cat.labelEn}
                </button>
              );
            })}
          </div>
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
            filteredItems.map((item) => {
              const isExpanded = Boolean(expandedItems[item.id]);
              const title = isFr ? item.titleFr : item.titleEn;
              const summary = isFr ? item.summaryFr : item.summaryEn;
              const story = isFr ? item.storyFr : item.storyEn;
              const action = isFr ? item.actionFr : item.actionEn;
              const costStake = isFr ? item.costStakeFr : item.costStakeEn;
              const categoryLabel = isFr ? item.categoryFr : item.categoryEn;
              const isCopied = copiedId === item.id;

              return (
                <article
                  key={item.id}
                  id={item.id}
                  className="bg-white border border-[#d6cebd] rounded-[2px] shadow-xs transition-shadow hover:shadow-sm overflow-hidden scroll-mt-36"
                >
                  {/* Card Header & Toggle */}
                  <div
                    onClick={() => toggleItem(item.id)}
                    className="p-5 sm:p-6 cursor-pointer flex items-start justify-between gap-4 select-none hover:bg-[#fcfaf5]/60 transition-colors"
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
                      <h2 className="font-serif text-lg sm:text-xl text-[#1c1b18] font-semibold leading-snug">
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

                    <button
                      type="button"
                      aria-label={isExpanded ? "Collapse details" : "Expand details"}
                      className="p-2 text-[#625d52] hover:text-[#1c1b18] rounded-[2px] transition-colors shrink-0 mt-1"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-[#2e4a3b]" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
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
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleCopy(item)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#d6cebd] hover:border-[#2e4a3b] text-[#46423a] rounded-[2px] transition-colors"
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
              );
            })
          )}
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
              ? "Planifiez un échange sans pression commerciale avec Ahmed Bello pour auditer vos régimes enregistrés, votre structure hypothécaire ou vos déductions manquées."
              : "Schedule a 30-minute introductory conversation with Ahmed Bello to review your registered shelters, mortgage renewal timeline, and uncollected credits with zero sales pressure."}
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
              <span>{isFr ? "Planifier un appel de 30 minutes sur Calendly" : "Schedule 30-Min Strategy Call on Calendly"}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
