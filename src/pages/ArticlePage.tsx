import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { articles, categories } from "../content/data.ts";
import { Tbc } from "../components/Tbc.tsx";
import { Portrait } from "../components/Portrait.tsx";
import { DRAFT_MODE, siteConfig, hasSiteCredentials, getCtaLabel } from "../config/site.ts";
import {
  Check,
  Copy,
  ExternalLink,
  ArrowRight,
  CheckCircle2,
  MessageSquare,
  Linkedin,
  Send,
  Scale,
  Calendar,
  AlertCircle,
  ClipboardList,
} from "lucide-react";
import { NewcomerPlanningCalculator } from "../components/NewcomerPlanningCalculator.tsx";
import { FhsaQuickEstimator } from "../components/FhsaQuickEstimator.tsx";
import { TfsaVsRrspQuickWidget } from "../components/TfsaVsRrspQuickWidget.tsx";
import { RespGrantQuickWidget } from "../components/RespGrantQuickWidget.tsx";
import { CalculatorLeadCapture } from "../components/CalculatorLeadCapture.tsx";
import { trackBookingClick, trackCtaClick } from "../lib/track.ts";
import { useLanguage } from "../context/LanguageContext.tsx";
import { SEO } from "../components/SEO.tsx";
import { ARTICLE_FR_SEO, isFrenchArticleTranslated } from "../config/seoMetadata.ts";
import { buildRouteJsonLd } from "../config/schema.ts";
import { NotFoundPage } from "./NotFoundPage.tsx";

const CATEGORY_LABELS_FR: Record<string, string> = {
  "registered-accounts": "Comptes enregistrés canadiens",
  investing: "Principes d'investissement",
  protection: "Protection financière",
  "debt-credit": "Dette et crédit",
  family: "Finances familiales",
  retirement: "Retraite",
  newcomers: "Nouveaux arrivants au Canada",
  "decision-making": "Prise de décision financière",
};

const TOPIC_LABELS: Record<string, { en: string; fr: string }> = {
  accounts: { en: "Canadian Registered Accounts (TFSA / RRSP / FHSA)", fr: "Comptes enregistrés canadiens (CELI / REER / CELIAPP)" },
  investing: { en: "Investing Fundamentals & Shari'ah Principles", fr: "Principes d'investissement & finance éthique" },
  protection: { en: "Family Income Protection & Insurance", fr: "Protection du revenu familial & assurances" },
  family: { en: "Family Financial Priorities & RESP", fr: "Finances familiales & REEE" },
  retirement: { en: "Retirement & Pension Timing", fr: "Retraite & rentes publiques" },
  newcomer: { en: "New to Canada Financial Fundamentals", fr: "Finances pour nouveaux arrivants" },
  mentorship: { en: "Independent Practice Mentorship", fr: "Mentorat de pratique indépendante" },
  general: { en: "General Financial Education", fr: "Éducation financière générale" },
  education: { en: "Financial Decision Frameworks", fr: "Cadres de décision financière" },
  debt: { en: "Debt Strategy & Balance Sheet Restructuring", fr: "Stratégie d'endettement & restructuration de passif" },
  mortgage: { en: "Mortgage Qualification & Amortization Strategy", fr: "Qualification hypothécaire & stratégie d'amortissement" },
};

export const ArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { isFr, t } = useLanguage();
  const prefix = isFr ? "/fr" : "";
  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const article = articles.find((a) => a.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
    setScrollProgress(0);

    const handleScroll = () => {
      const el = document.documentElement;
      const totalHeight = el.scrollHeight - el.clientHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setScrollProgress(progress);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [slug]);

  if (!article) {
    return <NotFoundPage />;
  }

  const category = categories.find((c) => c.id === article.category);
  const localizedCategoryLabel =
    (isFr && category ? CATEGORY_LABELS_FR[category.id] : category?.label) || article.category;
  const kindLabel = article.kind === "guide" ? "Guide" : isFr ? "Analyse" : "Insight";
  const isUntranslatedFrArticle = isFr && !isFrenchArticleTranslated(article.slug);
  const frSeo = isFr ? ARTICLE_FR_SEO[article.slug] : undefined;
  const localizedSeoTitle = frSeo?.seoTitle || article.seoTitle || article.title;
  const localizedTitle = frSeo?.title || article.title;
  const localizedDescription = frSeo?.description || article.description;
  const relatedArticles = article.related
    .map((relSlug) => articles.find((a) => a.slug === relSlug))
    .filter(Boolean);
  const reviewedDateRaw = article.dateModified || "2026-11-05T09:00:00-05:00";
  const reviewedDateFormatted = new Date(reviewedDateRaw).toLocaleDateString(
    isFr ? "fr-CA" : "en-CA",
    { year: "numeric", month: "long", day: "numeric" }
  );
  const showCredentials = hasSiteCredentials();

  const handleCopyLink = () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (!url) return;

    const markCopied = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    };

    const fallbackCopy = () => {
      try {
        const ta = document.createElement("textarea");
        ta.value = url;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        markCopied();
      } catch {
        // Clipboard access restricted in current context; ignore gracefully
      }
    };

    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).then(markCopied).catch(fallbackCopy);
    } else {
      fallbackCopy();
    }
  };

  const pageUrl =
    typeof window !== "undefined" ? window.location.href : `${siteConfig.siteUrl}${prefix}${article.url}`;
  const shareTitle = `${localizedTitle} | Ahmed Bello`;
  const shareLinkedIn = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`;
  const shareTwitter = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(pageUrl)}`;
  const shareWhatsApp = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + " " + pageUrl)}`;

  const sections = [
    { id: "overview", label: isFr ? "Vue d'ensemble" : "Overview" },
    ...(article.slug === "fhsa-explained"
      ? [{ id: "fhsa-estimator", label: isFr ? "Simulateur CELIAPP" : "FHSA Tax Estimator" }]
      : []),
    ...(article.slug === "tfsa-vs-rrsp" || article.slug === "tfsa-vs-rrsp-vs-fhsa-which-to-maximize-first"
      ? [{ id: "tfsa-rrsp-widget", label: isFr ? "Comparateur CELI vs REER" : "TFSA vs. RRSP Priority Check" }]
      : []),
    ...(article.slug === "resp-basics"
      ? [{ id: "resp-grant-widget", label: isFr ? "Calculateur SCEE REEE" : "RESP Grant Estimator" }]
      : []),
    ...(article.slug === "new-to-canada-money-basics" || article.slug === "internationally-trained-doctors-nurses-first-year"
      ? [{ id: "newcomer-calculator", label: isFr ? "Planificateur 1re année" : "Newcomer Runway Calculator" }]
      : []),
    ...(article.sections
      ? article.sections.map((s, idx) => ({
          id: s.id || `section-${idx}`,
          label: s.h2,
        }))
      : []),
    ...(article.checklist ? [{ id: "checklist", label: article.checklist.title }] : []),
    ...(article.faqs ? [{ id: "faqs", label: isFr ? "Foire aux questions" : "Frequently Asked Questions" }] : []),
    ...(article.example ? [{ id: "example", label: isFr ? "Exemple hypothétique" : "Hypothetical example" }] : []),
    { id: "misunderstandings", label: isFr ? "Idées reçues fréquentes" : "Common misunderstandings" },
    { id: "tradeoffs", label: isFr ? "Compromis et limites" : "Trade-offs and limitations" },
    { id: "questions", label: isFr ? "Questions à considérer" : "Questions to consider" },
    { id: "sources", label: isFr ? `Sources officielles (${article.sources.length})` : `Sources (${article.sources.length})` },
  ];

  const articleJsonLd = useMemo(
    () =>
      buildRouteJsonLd({
        pathname: isUntranslatedFrArticle ? article.url : `${prefix}${article.url}`,
        title: localizedSeoTitle,
        description: localizedDescription,
        heading: localizedTitle,
        isFr,
        article,
      }),
    [prefix, article, isUntranslatedFrArticle, localizedSeoTitle, localizedDescription, localizedTitle, isFr]
  );

  return (
    <article className="py-12 lg:py-16 relative">
      {/* Scroll-Linked Reading Progress Bar (Fixed at top of viewport) */}
      <progress
        value={Math.round(scrollProgress)}
        max={100}
        aria-label={isFr ? "Progression de lecture" : "Reading progress"}
        className="read-progress-bar fixed top-0 left-0 right-0 z-50 w-full h-[3.5px] pointer-events-none"
      />

      <SEO
        title={localizedSeoTitle}
        description={localizedDescription}
        canonicalUrl={isUntranslatedFrArticle ? article.url : `${prefix}${article.url}`}
        ogType="article"
        articlePublishedTime={article.datePublished || "2025-01-15T08:00:00-05:00"}
        articleModifiedTime={article.dateModified || "2026-11-05T09:00:00-05:00"}
        jsonLd={articleJsonLd}
      />

      <div className="wrap">
        {/* Header Breadcrumbs / Eyebrow */}
        <header className="max-w-4xl mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#2e4a3b] mb-4">
            <Link
              to={`${prefix}/education?category=${article.category}`}
              className="hover:underline text-[#2e4a3b]"
            >
              {localizedCategoryLabel}
            </Link>
            <span aria-hidden="true">&middot;</span>
            <span className="text-[#625d52]">{kindLabel}</span>
          </div>

          <h1 className="h1 text-[#1c1b18] mb-5 font-normal">
            {localizedTitle}
          </h1>

          {isUntranslatedFrArticle && (
            <div className="mb-6 p-4 bg-[#fcfaf5] border border-[#d6c298] rounded-[2px] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#46423a]">
              <p className="leading-relaxed">
                <strong className="text-[#1c1b18]">Note linguistique :</strong> le corps technique détaillé de ce guide est actuellement publié en anglais sous ce titre et résumé en français.
              </p>
              <Link
                to={article.url}
                className="text-xs font-semibold text-[#2e4a3b] underline shrink-0"
              >
                Lire la version originale en anglais →
              </Link>
            </div>
          )}

          {/* Author & Editorial Review Block */}
          <div className="flex flex-wrap items-center gap-3.5 pb-5 mb-5 border-b border-[#d6cebd] text-xs text-[#46423a]">
            <Portrait variant="avatar" alt={siteConfig.name} className="shrink-0" />
            <div className="space-y-0.5 min-w-0">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                <span className="font-semibold text-[#1c1b18]">{siteConfig.name}</span>
                {showCredentials && (siteConfig.credentials.licenceType || siteConfig.credentials.provinces) && (
                  <span className="text-[#625d52]">
                    &middot;{" "}
                    {[siteConfig.credentials.licenceType, siteConfig.credentials.provinces]
                      .filter(Boolean)
                      .join(" · ")}
                    {siteConfig.credentials.licenceNumbers ? ` (${siteConfig.credentials.licenceNumbers})` : ""}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[#625d52]">
                <span>
                  {isFr ? `Révisé le ${reviewedDateFormatted}` : `Reviewed ${reviewedDateFormatted}`}
                </span>
                <span aria-hidden="true">&middot;</span>
                <Link
                  to={`${prefix}/standards`}
                  className="text-[#2e4a3b] underline hover:text-[#1c1b18]"
                >
                  {isFr ? "Méthodologie de vérification" : "How content is checked"}
                </Link>
              </div>
            </div>
          </div>

          <div className="card-editorial p-4 text-[#1c1b18]">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#2e4a3b] block mb-1">
              {t("meta_the_question")}
            </span>
            <p className="text-lg font-serif text-[#1c1b18] leading-snug">
              {article.question}
            </p>
          </div>
        </header>

        {/* 2-Column Editorial Grid: Meta + Sticky Index (Left) & Longform Content (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left Column: Metadata + Sticky "On this page" */}
          <aside className="lg:col-span-4 order-2 lg:order-1 no-print">
            <div className="lg:sticky lg:top-28 space-y-8">
              {/* Meta Box */}
              <div className="card-editorial p-5 text-xs space-y-3.5">
                <div>
                  <span className="text-[#625d52] block mb-0.5 font-medium">{t("meta_reading_time")}</span>
                  <span className="text-[#1c1b18] font-semibold">{article.readingMinutes} {t("meta_min_read")}</span>
                </div>

                {article.figuresAsOf && (
                  <div className="border-t border-[#ece6da] pt-3">
                    <span className="text-[#625d52] block mb-0.5 font-medium">
                      {isFr ? "Données en date du" : "Figures as of"}
                    </span>
                    <span className="text-[#1c1b18]">{article.figuresAsOf}</span>
                  </div>
                )}

                <div className="border-t border-[#ece6da] pt-3 flex items-center justify-between">
                  <span className="text-[#625d52] font-medium">{t("meta_sources")}</span>
                  <a
                    href="#sources"
                    className="text-[#2e4a3b] font-semibold hover:underline"
                  >
                    {article.sources.length} {isFr ? "citées" : "cited"}
                  </a>
                </div>

                <div className="border-t border-[#ece6da] pt-3">
                  <span className="text-[#625d52] block mb-1 font-medium">
                    {isFr ? "Révision éditoriale" : "Editorial Review"}
                  </span>
                  <Link
                    to={`${prefix}/standards`}
                    className="text-[#2e4a3b] underline hover:text-[#1c1b18]"
                  >
                    {isFr ? "Méthodologie de vérification →" : "How content is checked →"}
                  </Link>
                </div>

                <div className="border-t border-[#ece6da] pt-3">
                  <span className="text-[#625d52] block mb-0.5 font-medium">
                    {isFr ? "Statut de publication" : "Publication Status"}
                  </span>
                  <span className="text-[#2e4a3b] font-semibold">
                    {isFr ? "Guide éducatif vérifié" : "Verified Educational Guide"}
                  </span>
                </div>
              </div>

              {/* Sticky "On this page" index */}
              <nav aria-label={isFr ? "Table des matières" : "Table of contents"} className="hidden lg:block border-t border-[#d6cebd] pt-6">
                <h2 className="text-xs font-semibold tracking-wider uppercase text-[#46423a] mb-3">
                  {isFr ? "Sur cette page" : "On this page"}
                </h2>
                <ul className="space-y-2 text-sm list-none p-0">
                  {sections.map((sec) => (
                    <li key={sec.id}>
                      <a
                        href={`#${sec.id}`}
                        className="text-[#625d52] hover:text-[#2e4a3b] hover:underline transition-colors block py-1"
                      >
                        {sec.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Copy Link Button */}
              <div>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="btn btn-ghost w-full py-2.5 text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-[#2e4a3b]" aria-hidden="true" />
                      <span>{isFr ? "Lien copié" : "Link copied to clipboard"}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" aria-hidden="true" />
                      <span>{isFr ? "Copier le lien de l'article" : "Copy article link"}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Sticky Reader Conversion Card */}
              <div className="p-5 bg-[#14211a] text-[#f7f3eb] border border-[#2e4a3b] rounded-[2px] space-y-3">
                <span className="text-[11px] uppercase tracking-wider text-[#d6c298] font-semibold block">
                  {isFr ? "Appliquer à votre situation" : "Apply to Your Numbers"}
                </span>
                <p className="text-xs text-[#ece6da]/90 leading-relaxed">
                  {article.slug === "fhsa-explained"
                    ? isFr
                      ? "Calculez votre déduction CELIAPP, cumulez avec le RAP (60 000 $) ou posez une question fiscale précise."
                      : "Calculate your FHSA tax refund, model $100k FHSA + HBP stacking, or ask a question about your eligibility."
                    : article.slug === "tfsa-vs-rrsp" || article.slug === "tfsa-vs-rrsp-vs-fhsa-which-to-maximize-first"
                    ? isFr
                      ? "Comparez CELI et REER selon votre tranche fiscale actuelle et recevez votre aide-mémoire par courriel."
                      : "Check whether TFSA or RRSP fits your bracket better and get your personal tax checklist by email."
                    : article.slug === "resp-basics"
                    ? isFr
                      ? "Estimez la SCEE (20 %) et vos droits de rattrapage jusqu'à 1 000 $/an selon l'âge de votre enfant."
                      : "Estimate your 20% CESG match and catch-up room up to $1,000/yr based on your child's age."
                    : article.slug === "new-to-canada-money-basics" || article.slug === "internationally-trained-doctors-nurses-first-year"
                    ? isFr
                      ? "Calculez votre coussin de liquidités de 1re année au Canada et recevez votre plan par courriel."
                      : "Map your first-year Canadian cash runway and email yourself a step-by-step settlement checklist."
                    : isFr
                    ? `Vous avez une question sur ${article.invitationAbout} ? Demandez un second avis direct et objectif.`
                    : `Have a specific question about ${article.invitationAbout}? Get a direct, objective second opinion.`}
                </p>
                <div className="flex flex-col gap-2 pt-1">
                  {article.slug === "fhsa-explained" && (
                    <a
                      href="#fhsa-estimator"
                      onClick={() => trackCtaClick("article_sidebar", "fhsa_estimator")}
                      className="btn bg-[#d6c298] text-[#14211a] hover:bg-white text-xs py-2 px-3 inline-flex items-center justify-center gap-1.5 font-semibold transition-colors"
                    >
                      <span>{isFr ? "Calculer mon économie CELIAPP" : "Estimate My FHSA Tax Refund"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {(article.slug === "tfsa-vs-rrsp" || article.slug === "tfsa-vs-rrsp-vs-fhsa-which-to-maximize-first") && (
                    <a
                      href="#tfsa-rrsp-widget"
                      onClick={() => trackCtaClick("article_sidebar", "tfsa_rrsp_widget")}
                      className="btn bg-[#d6c298] text-[#14211a] hover:bg-white text-xs py-2 px-3 inline-flex items-center justify-center gap-1.5 font-semibold transition-colors"
                    >
                      <span>{isFr ? "Comparer CELI vs REER" : "Run 15-Sec TFSA vs. RRSP Check"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {article.slug === "resp-basics" && (
                    <a
                      href="#resp-grant-widget"
                      onClick={() => trackCtaClick("article_sidebar", "resp_grant_widget")}
                      className="btn bg-[#d6c298] text-[#14211a] hover:bg-white text-xs py-2 px-3 inline-flex items-center justify-center gap-1.5 font-semibold transition-colors"
                    >
                      <span>{isFr ? "Calculer la subvention REEE" : "Estimate Child's RESP Grant"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {(article.slug === "new-to-canada-money-basics" || article.slug === "internationally-trained-doctors-nurses-first-year") && (
                    <a
                      href="#newcomer-calculator"
                      onClick={() => trackCtaClick("article_sidebar", "newcomer_calculator")}
                      className="btn bg-[#d6c298] text-[#14211a] hover:bg-white text-xs py-2 px-3 inline-flex items-center justify-center gap-1.5 font-semibold transition-colors"
                    >
                      <span>{isFr ? "Calculer mon budget 1re année" : "Calculate First-Year Runway"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <Link
                    to={`${prefix}/contact?topic=${article.contactTopic}`}
                    onClick={() => trackCtaClick("article_sidebar", `ask_${article.slug}`)}
                    className="btn btn-primary text-xs py-2 px-3 inline-flex items-center justify-center gap-1.5 border border-[#d6c298]/40"
                  >
                    <span>{isFr ? "Poser ma question" : "Ask Ahmed About This"}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#d6c298]" />
                  </Link>
                  <a
                    href={siteConfig.schedulingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackBookingClick(`article_sidebar_${article.slug}`)}
                    className="text-[11px] text-[#d6c298] hover:text-white underline text-center py-1 inline-flex items-center justify-center gap-1"
                  >
                    <Calendar className="w-3 h-3" />
                    <span>{getCtaLabel(isFr)}</span>
                  </a>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Column: Editorial Longform Reading Body */}
          <div className="lg:col-span-8 order-1 lg:order-2 space-y-12 max-w-prose measure">
            {/* 0. Executive 60-Second Briefing Box */}
            <div className="card-editorial p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#d6cebd]">
                <div className="flex items-center gap-2">
                  <span className="p-1 bg-[#2e4a3b] text-[#f7f3eb] rounded-[2px]">
                    <Scale className="w-3.5 h-3.5 text-[#d6c298]" />
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#1c1b18]">
                    {isFr ? "Synthèse exécutive en 60 secondes" : "60-Second Executive Summary"}
                  </span>
                </div>
                <span className="text-[0.68rem] text-[#75581f] uppercase tracking-wider font-semibold">
                  {article.kind === "insight" ? (isFr ? "Note stratégique" : "Strategic Briefing") : (isFr ? "Guide pratique" : "Core Guide")}
                </span>
              </div>

              <div className="space-y-2 text-xs sm:text-sm text-[#46423a] leading-relaxed">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2e4a3b] shrink-0 mt-0.5" />
                  <p>
                    <strong>{isFr ? "L'enjeu central :" : "The Core Issue:"}</strong> {article.problem}
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#75581f] shrink-0 mt-0.5" />
                  <p>
                    <strong>{isFr ? "Règle stratégique clé :" : "Key Strategic Rule:"}</strong> {article.tradeoffs[0] || article.overview[0]}
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2e4a3b] shrink-0 mt-0.5" />
                  <p>
                    <strong>{isFr ? "Point clé :" : "Balance-Sheet Takeaway:"}</strong>{" "}
                    {article.misunderstandings[0]?.reality ||
                      (isFr
                        ? "Évaluez l'impact global sur votre bilan avant d'engager votre capital enregistré ou non enregistré."
                        : "Evaluate total balance-sheet impact before committing non-registered or registered capital.")}
                  </p>
                </div>
              </div>

              {/* Social Share Strip */}
              <div className="pt-3 border-t border-[#ece6da] flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="text-[#625d52] font-medium">
                  {isFr ? "Partager cette analyse :" : "Share this briefing:"}
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href={shareLinkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on LinkedIn"
                    className="p-1.5 bg-[#f7f3eb] hover:bg-[#2e4a3b] hover:text-white border border-[#d6cebd] rounded-[2px] text-[#46423a] transition-colors"
                    title="Share on LinkedIn"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={shareTwitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on X"
                    className="p-1.5 bg-[#f7f3eb] hover:bg-[#2e4a3b] hover:text-white border border-[#d6cebd] rounded-[2px] text-[#46423a] transition-colors"
                    title="Share on X / Twitter"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={shareWhatsApp}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on WhatsApp"
                    className="p-1.5 bg-[#f7f3eb] hover:bg-[#2e4a3b] hover:text-white border border-[#d6cebd] rounded-[2px] text-[#46423a] transition-colors"
                    title="Share via WhatsApp"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    aria-label="Copy link"
                    className="p-1.5 bg-[#f7f3eb] hover:bg-[#2e4a3b] hover:text-white border border-[#d6cebd] rounded-[2px] text-[#46423a] transition-colors inline-flex items-center gap-1 text-[0.7rem] font-semibold cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copied ? (isFr ? "Copié !" : "Copied!") : (isFr ? "Copier" : "Copy")}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Top Compliance Disclaimer for Pension Decision Review */}
            {article.slug === "pension-commuted-value-transfer-par-tax-planning" && (
              <div className="p-4 bg-[#fcfaf5] border border-[#75581f]/40 rounded-[2px] text-xs text-[#46423a] leading-relaxed shadow-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-[#75581f] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#1c1b18] block font-semibold mb-0.5">
                    {isFr ? "Avis de conformité réglementaire" : "Regulatory Compliance Notice"}
                  </strong>
                  {isFr
                    ? "Formation générale uniquement. Les décisions relatives aux régimes de retraite dépendent de votre régime et de votre situation personnelle. Confirmez les détails auprès de l'administrateur de votre régime et d'un professionnel de la fiscalité."
                    : "General education only. Pension decisions depend on your plan and personal situation. Confirm details with your plan administrator and a tax professional."}
                </div>
              </div>
            )}

            {/* Dedicated AMT Calculator Banner on AMT Guide */}
            {article.slug === "canadian-alternative-minimum-tax-amt-high-earners-guide" && (
              <div className="card-editorial p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs uppercase font-semibold tracking-wider text-[#75581f]">
                    {isFr ? "Outil interactif" : "Interactive Decision Tool"}
                  </span>
                  <h2 className="font-serif text-base sm:text-lg text-[#1c1b18] font-semibold">
                    {isFr ? "Simulateur d'Impôt Minimum de Remplacement (IMR)" : "Alternative Minimum Tax (AMT) Calculator Canada"}
                  </h2>
                  <p className="text-xs text-[#46423a]">
                    {isFr
                      ? "Modélisez l'impact des règles des lois C-59 et C-69 sur vos gains en capital, vos dons et le report sur 7 ans."
                      : "Model the impact of Bills C-59 & C-69 on your capital gains, dividends, donations, and 7-year carry-forward recovery."}
                  </p>
                </div>
                <Link
                  to={`${prefix}/calculators/amt`}
                  className="btn btn-primary text-xs py-2 px-3.5 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
                >
                  <Scale className="w-3.5 h-3.5 text-[#d6c298]" />
                  <span>{isFr ? "Ouvrir le simulateur" : "Open Calculator"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}

            {/* Top Interactive Estimator Shortcut Banner on FHSA Guide */}
            {article.slug === "fhsa-explained" && (
              <div className="card-editorial p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs uppercase font-semibold tracking-wider text-[#75581f]">
                    {isFr ? "Calculateur & Liste CELIAPP" : "Interactive Tool & Opening Checklist"}
                  </span>
                  <h2 className="font-serif text-base sm:text-lg text-[#1c1b18] font-semibold">
                    {isFr
                      ? "Simuler votre remboursement d'impôt CELIAPP et le cumul RAP (100 000 $)"
                      : "Estimate your FHSA tax refund and $100k FHSA + HBP stacking"}
                  </h2>
                  <p className="text-xs text-[#46423a]">
                    {isFr
                      ? "Vérifiez vos droits reportés (plafond de 8 000 $) et recevez l'aide-mémoire d'ouverture par courriel."
                      : "Check your $8,000 carry-forward room and receive a free printable opening checklist by email."}
                  </p>
                </div>
                <a
                  href="#fhsa-estimator"
                  onClick={() => trackCtaClick("fhsa_top_banner", "jump_to_estimator")}
                  className="btn btn-primary text-xs py-2 px-3.5 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
                >
                  <span>{isFr ? "Calculer maintenant" : "Estimate My Refund"}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#d6c298]" />
                </a>
              </div>
            )}

            {/* Top Interactive Shortcut Banner on TFSA vs RRSP Guides */}
            {(article.slug === "tfsa-vs-rrsp" || article.slug === "tfsa-vs-rrsp-vs-fhsa-which-to-maximize-first") && (
              <div className="card-editorial p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs uppercase font-semibold tracking-wider text-[#75581f]">
                    {isFr ? "Vérification en 15 secondes" : "15-Second Account Check & Checklist"}
                  </span>
                  <h2 className="font-serif text-base sm:text-lg text-[#1c1b18] font-semibold">
                    {isFr
                      ? "Comparez CELI vs REER selon votre tranche fiscale et recevez la synthèse"
                      : "See how TFSA vs. RRSP compares at your bracket & get the tax checklist"}
                  </h2>
                  <p className="text-xs text-[#46423a]">
                    {isFr
                      ? "Comparez les plafonds 2026 (CELI 7 000 $, REER jusqu'à 33 810 $) et obtenez les vérifications clés par courriel."
                      : "Test your current tax rate against 2026 CRA limits ($7,000 TFSA / up to $33,810 RRSP) and save your summary by email."}
                  </p>
                </div>
                <a
                  href="#tfsa-rrsp-widget"
                  onClick={() => trackCtaClick("tfsa_rrsp_top_banner", "jump_to_widget")}
                  className="btn btn-primary text-xs py-2 px-3.5 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
                >
                  <span>{isFr ? "Lancer le test 15 sec" : "Run 15-Sec Check"}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#d6c298]" />
                </a>
              </div>
            )}

            {/* Top Interactive Shortcut Banner on RESP Guide */}
            {article.slug === "resp-basics" && (
              <div className="card-editorial p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs uppercase font-semibold tracking-wider text-[#75581f]">
                    {isFr ? "Calculateur Subvention REEE (15 sec)" : "15-Second RESP Grant & Catch-Up Check"}
                  </span>
                  <h2 className="font-serif text-base sm:text-lg text-[#1c1b18] font-semibold">
                    {isFr
                      ? "Estimez la SCEE (20 %) et les droits de rattrapage pour votre enfant"
                      : "Calculate your child's CESG match & unused catch-up room"}
                  </h2>
                  <p className="text-xs text-[#46423a]">
                    {isFr
                      ? "Vérifiez la règle jusqu'à 1 000 $/an en rattrapage, les critères des 16-17 ans et le BEC par courriel."
                      : "See how missed years boost your match up to $1,000/yr and get the RESP provider checklist by email."}
                  </p>
                </div>
                <a
                  href="#resp-grant-widget"
                  onClick={() => trackCtaClick("resp_top_banner", "jump_to_widget")}
                  className="btn btn-primary text-xs py-2 px-3.5 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
                >
                  <span>{isFr ? "Calculer la subvention" : "Estimate Grant"}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#d6c298]" />
                </a>
              </div>
            )}

            {/* Top Interactive Shortcut Banner on Newcomer Guides */}
            {(article.slug === "new-to-canada-money-basics" || article.slug === "internationally-trained-doctors-nurses-first-year") && (
              <div className="card-editorial p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs uppercase font-semibold tracking-wider text-[#75581f]">
                    {isFr ? "Planificateur 1re Année & Liste" : "Interactive Runway Tool & Checklist"}
                  </span>
                  <h2 className="font-serif text-base sm:text-lg text-[#1c1b18] font-semibold">
                    {isFr
                      ? "Calculez votre autonomie financière de 1re année au Canada"
                      : "Model your first-year Canadian cash runway & settlement buffer"}
                  </h2>
                  <p className="text-xs text-[#46423a]">
                    {isFr
                      ? "Intégrez vos délais d'équivalence, vos frais mensuels et recevez la liste d'actions des 90 premiers jours."
                      : "Factor in licensing wait times and household burn rate, then email yourself the 90-day newcomer checklist."}
                  </p>
                </div>
                <a
                  href="#newcomer-calculator"
                  onClick={() => trackCtaClick("newcomer_top_banner", "jump_to_widget")}
                  className="btn btn-primary text-xs py-2 px-3.5 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
                >
                  <span>{isFr ? "Calculer mon autonomie" : "Calculate Runway"}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#d6c298]" />
                </a>
              </div>
            )}

            {/* 1. Problem / Lead Paragraph */}
            <section className="text-lg md:text-xl font-serif text-[#1c1b18] leading-relaxed border-b border-[#d6cebd] pb-8">
              <p>{article.problem}</p>
            </section>

            {/* 2. Plain-language Overview */}
            <section id="overview" className="space-y-5 prose-editorial">
              <h2 className="h3 text-[#1c1b18] border-b border-[#ece6da] pb-2">
                {isFr ? "Vue d'ensemble" : "Overview"}
              </h2>
              {article.overview.map((para, idx) => (
                <p key={`ov-${idx}`} className="leading-relaxed">
                  {para}
                </p>
              ))}
            </section>

            {/* 2a. Surfaced Contextual Interactive Widgets (High Visibility After Overview) */}
            {(article.slug === "internationally-trained-doctors-nurses-first-year" ||
              article.slug === "new-to-canada-money-basics") && (
              <section id="newcomer-calculator" className="pt-2 scroll-mt-28">
                <NewcomerPlanningCalculator
                  defaultProfession={
                    article.slug === "internationally-trained-doctors-nurses-first-year"
                      ? "healthcare"
                      : "general"
                  }
                />
              </section>
            )}

            {article.slug === "fhsa-explained" && (
              <div className="pt-2">
                <FhsaQuickEstimator />
              </div>
            )}

            {(article.slug === "tfsa-vs-rrsp" || article.slug === "tfsa-vs-rrsp-vs-fhsa-which-to-maximize-first") && (
              <div className="pt-2">
                <TfsaVsRrspQuickWidget />
              </div>
            )}

            {article.slug === "resp-basics" && (
              <div className="pt-2">
                <RespGrantQuickWidget />
              </div>
            )}

            {/* 2b. Structured H2 Sections (if provided) */}
            {article.sections &&
              article.sections.map((sec, sIdx) => (
                <section key={sec.id || `sec-${sIdx}`} id={sec.id || `sec-${sIdx}`} className="space-y-4 prose-editorial">
                  <h2 className="h3 text-[#1c1b18] border-b border-[#ece6da] pb-2 font-serif text-xl sm:text-2xl">
                    {sec.h2}
                  </h2>
                  {sec.paragraphs.map((p, pIdx) => (
                    <p key={`sp-${pIdx}`} className="leading-relaxed text-sm sm:text-base text-[#46423a]">
                      {p}
                    </p>
                  ))}
                </section>
              ))}

            {/* 2c. Decision Checklist (if provided) */}
            {article.checklist && (
              <section id="checklist" className="card-editorial p-6 space-y-4">
                <div className="flex items-center gap-2 border-b border-[#d6cebd] pb-3">
                  <ClipboardList className="w-5 h-5 text-[#75581f]" />
                  <h2 className="font-serif text-lg sm:text-xl text-[#1c1b18] font-semibold">
                    {article.checklist.title}
                  </h2>
                </div>
                <div className="space-y-3">
                  {article.checklist.items.map((item, cIdx) => (
                    <div key={`chk-${cIdx}`} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#46423a]">
                      <CheckCircle2 className="w-4 h-4 text-[#2e4a3b] shrink-0 mt-0.5" />
                      <p className="leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 2d. 8-Question FAQ Accordion (if provided) */}
            {article.faqs && article.faqs.length > 0 && (
              <section id="faqs" className="space-y-4">
                <div className="border-b border-[#ece6da] pb-2">
                  <span className="text-[0.68rem] uppercase tracking-wider text-[#75581f] font-bold block mb-0.5">
                    {isFr ? "Questions Fréquentes" : "Frequently Asked Questions"}
                  </span>
                  <h2 className="h3 text-[#1c1b18] font-serif text-xl sm:text-2xl">
                    {article.slug === "pension-commuted-value-transfer-par-tax-planning"
                      ? isFr
                        ? "Questions Essentielles sur la Rente Commuée"
                        : "Frequently Asked Pension Questions"
                      : isFr
                      ? "Foire aux questions"
                      : "Frequently Asked Questions"}
                  </h2>
                </div>
                <div className="space-y-3">
                  {article.faqs.map((faq, fIdx) => (
                    <details
                      key={`faq-${fIdx}`}
                      className="group border border-[#d6cebd] rounded-[2px] bg-white overflow-hidden transition-colors open:bg-[#fcfaf5]"
                    >
                      <summary className="p-4 cursor-pointer font-serif text-sm sm:text-base font-semibold text-[#1c1b18] flex items-center justify-between list-none hover:text-[#2e4a3b]">
                        <span className="capitalize">{faq.question}</span>
                        <span className="text-[#75581f] text-xs font-bold transition-transform group-open:rotate-180">
                          ▼
                        </span>
                      </summary>
                      <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-[#46423a] leading-relaxed border-t border-[#ece6da]/60">
                        {faq.answer}
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {/* 3. Hypothetical Example */}
            {article.example && (
              <section
                id="example"
                className="bg-[#fcfaf5] border border-[#d6cebd] p-6 lg:p-8 rounded-[2px] space-y-5"
              >
                <div className="flex items-center justify-between gap-4 border-b border-[#d6cebd] pb-3">
                  <h2 className="h3 text-[#1c1b18]">
                    {article.example.title}
                  </h2>
                  <span className="text-[0.7rem] uppercase tracking-wider font-semibold bg-[#ece6da] text-[#46423a] px-2 py-0.5 rounded-[2px] shrink-0">
                    {isFr ? "Chiffres hypothétiques" : "Hypothetical figures"}
                  </span>
                </div>

                <p className="text-sm text-[#46423a] leading-relaxed italic">
                  {article.example.intro}
                </p>

                {article.example.table && (
                  <div className="overflow-x-auto my-4">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="border-b-2 border-[#2e4a3b]">
                          {article.example.table.head.map((th, i) => (
                            <th
                              key={`th-${i}`}
                              className="py-2.5 px-3 font-semibold text-[#1c1b18] text-xs uppercase tracking-wider"
                            >
                              {th}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#ece6da]">
                        {article.example.table.rows.map((row, rIdx) => (
                          <tr key={`row-${rIdx}`} className="hover:bg-[#f7f3eb]/60">
                            {row.map((cell, cIdx) => (
                              <td
                                key={`cell-${cIdx}`}
                                className={`py-3 px-3 ${
                                  cIdx > 0 ? "tabular-nums text-[#2e4a3b] font-medium" : "text-[#1c1b18]"
                                }`}
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {article.example.notes && (
                  <div className="space-y-2 pt-2 border-t border-[#ece6da] text-xs text-[#625d52]">
                    {article.example.notes.map((note, nIdx) => (
                      <p key={`note-${nIdx}`}>&bull; {note}</p>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* 4. Common Misunderstandings (Myth / Reality) */}
            <section id="misunderstandings" className="space-y-6">
              <h2 className="h3 text-[#1c1b18] border-b border-[#ece6da] pb-2">
                {isFr ? "Idées reçues fréquentes" : "Common misunderstandings"}
              </h2>
              <div className="space-y-4">
                {article.misunderstandings.map((m, mIdx) => (
                  <div
                    key={`m-${mIdx}`}
                    className="p-5 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] space-y-2.5"
                  >
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#8f2a1d] shrink-0">
                        {isFr ? "Mythe :" : "Myth:"}
                      </span>
                      <p className="font-serif text-[#1c1b18] font-medium text-lg leading-snug">
                        “{m.myth}”
                      </p>
                    </div>
                    <div className="flex items-baseline gap-2 border-t border-[#ece6da] pt-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#2e4a3b] shrink-0">
                        {isFr ? "Réalité :" : "Reality:"}
                      </span>
                      <p className="text-sm text-[#46423a] leading-relaxed">
                        {m.reality}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 5. Trade-offs and Limitations */}
            <section id="tradeoffs" className="space-y-5 prose-editorial">
              <h2 className="h3 text-[#1c1b18] border-b border-[#ece6da] pb-2">
                {isFr ? "Compromis et limites" : "Trade-offs and limitations"}
              </h2>
              <ul className="space-y-3">
                {article.tradeoffs.map((to, toIdx) => (
                  <li key={`to-${toIdx}`} className="text-sm md:text-base leading-relaxed">
                    {to}
                  </li>
                ))}
              </ul>
            </section>

            {/* 6. Questions to Consider */}
            <section id="questions" className="space-y-5 prose-editorial">
              <h2 className="h3 text-[#1c1b18] border-b border-[#ece6da] pb-2">
                {isFr ? "Questions à considérer" : "Questions to consider"}
              </h2>
              <ul className="space-y-3">
                {article.questions.map((q, qIdx) => (
                  <li key={`q-${qIdx}`} className="text-sm md:text-base leading-relaxed font-serif text-lg">
                    {q}
                  </li>
                ))}
              </ul>
            </section>

            {/* 7. Official Sources */}
            <section
              id="sources"
              className="p-6 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] space-y-4"
            >
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[#2e4a3b]">
                {isFr ? "Sources officielles et vérification" : "Official Sources & Verification"}
              </h2>
              <p className="text-xs text-[#625d52]">
                {isFr
                  ? "Chaque chiffre et règle cités dans cet article proviennent directement des organismes canadiens officiels. Consultez nos "
                  : "Every figure and rule cited in this article is drawn directly from official Canadian authorities. Read our full "}
                <Link to={`${prefix}/standards`} className="underline text-[#2e4a3b]">
                  {isFr ? "normes éditoriales" : "editorial standards"}
                </Link>
                .
              </p>
              <ul className="space-y-3.5 list-none p-0 text-sm">
                {article.sources.map((s, sIdx) => (
                  <li key={`source-${sIdx}`} className="border-t border-[#ece6da] pt-3">
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-medium text-[#2e4a3b] hover:underline"
                    >
                      <span>{s.label}</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-70" aria-hidden="true" />
                    </a>
                    {s.note && (
                      <p className="text-xs text-[#625d52] mt-1 leading-relaxed">
                        {s.note}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </section>

            {/* 8. Educational Disclaimer */}
            <div className="p-4 bg-[#ece6da]/50 border border-[#d6cebd] rounded-[2px] text-xs text-[#46423a] leading-relaxed">
              <strong>{isFr ? "Contenu éducatif, pas un conseil." : "Educational content, not advice."}</strong>{" "}
              {isFr
                ? "Ce guide propose une formation financière générale. Il ne constitue pas un conseil financier, fiscal, juridique ou d'investissement personnalisé, ni une offre d'achat ou de vente d'un produit quelconque. Les règles et plafonds évoluent ; confirmez les données actuelles auprès des autorités officielles et d'un professionnel qualifié avant d'agir."
                : "This guide offers general financial education. It is not personalized financial, tax, legal, or investment advice, and is not an offer or solicitation to buy or sell any product. Rules and limits change; confirm current details with official sources and a qualified professional before acting."}{" "}
              <Link to={`${prefix}/disclosures`} className="underline text-[#2e4a3b]">
                {isFr ? "Lire les divulgations complètes" : "Read full disclosures"}
              </Link>
              .
            </div>

            {/* Bottom Compliance Disclaimer and CTAs for Pension Commuted Value (Task 2c & 2d) */}
            {article.slug === "pension-commuted-value-transfer-par-tax-planning" && (
              <div className="space-y-6 pt-2">
                <div className="p-4 bg-[#fcfaf5] border border-[#75581f]/40 rounded-[2px] text-xs text-[#46423a] leading-relaxed shadow-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-[#75581f] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#1c1b18] block font-semibold mb-0.5">
                      {isFr ? "Avis de conformité réglementaire" : "Regulatory Compliance Notice"}
                    </strong>
                    {isFr
                      ? "Formation générale uniquement. Les décisions relatives aux régimes de retraite dépendent de votre régime et de votre situation personnelle. Confirmez les détails auprès de l'administrateur de votre régime et d'un professionnel de la fiscalité."
                      : "General education only. Pension decisions depend on your plan and personal situation. Confirm details with your plan administrator and a tax professional."}
                  </div>
                </div>

                {/* CTA 1: Email capture for the pension decision checklist */}
                <CalculatorLeadCapture
                  calculatorName="pension-decision-checklist"
                  analyticsCalculatorName="pension_decision_checklist"
                  analyticsTopic="pension-checklist"
                  topic="pension-checklist"
                  summaryText="Pension Commuted Value vs Deferred Pension Decision Checklist requested from article."
                  customHeading={
                    isFr
                      ? "Télécharger la grille d'aide à la décision sur la rente commuée"
                      : "Get the Pension Decision Checklist"
                  }
                  customSubheading={
                    isFr ? "Diligence Raisonnable Indépendante" : "Independent Due Diligence"
                  }
                  customButtonLabel={
                    isFr
                      ? "M'envoyer la grille de décision par courriel"
                      : "Send Me the Pension Decision Checklist"
                  }
                />

                {/* CTA 2: Booking button with utm_campaign=commuted-value */}
                <div className="p-6 bg-[#2e4a3b] text-[#f7f3eb] rounded-[2px] space-y-3 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                  <div className="space-y-1">
                    <span className="text-[0.68rem] uppercase tracking-wider text-[#d6c298] font-semibold block">
                      {isFr ? "Révision Indépendante" : "Independent Pension Review"}
                    </span>
                    <h2 className="font-serif text-lg font-medium text-[#f7f3eb]">
                      {isFr
                        ? "Besoin d'un second regard indépendant sur votre relevé de cessation ?"
                        : "Need an independent review of your pension termination statement?"}
                    </h2>
                    <p className="text-xs text-[#ece6da]">
                      {isFr
                        ? "Obtenez un second avis objectif sur vos plafonds de transfert ITR 8517, le montant PAR et l'impact fiscal lors d'un échange rapide."
                        : "Get an objective second opinion on your ITR 8517 Maximum Transfer Value, PAR capacity, and tax impact before deciding."}
                    </p>
                  </div>

                  <a
                    href={`${siteConfig.schedulingUrl}?utm_campaign=commuted-value`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackBookingClick("commuted-value")}
                    className="btn bg-[#d6c298] text-[#14211a] hover:bg-white text-xs py-2.5 px-4 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 font-semibold transition-colors"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{getCtaLabel(isFr)}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}

            {/* 9. Next Step: Interactive Question Box Under Every Guide */}
            <div className="card-editorial p-6 sm:p-8 space-y-5 no-print">
              <div className="flex items-center gap-2">
                <span className="p-1 bg-[#2e4a3b] text-[#f7f3eb] rounded-[2px]">
                  <MessageSquare className="w-4 h-4 text-[#d6c298]" />
                </span>
                <span className="eyebrow text-xs text-[#75581f]">
                  {isFr ? "Prochaine Étape Directe" : "Next Step: Direct Question"}
                </span>
              </div>

              <div>
                <h2 className="h3 text-[#1c1b18] text-xl sm:text-2xl font-serif">
                  {isFr
                    ? "Pas certain de la structure ou du compte adapté à votre situation ? Posez votre question ici."
                    : "Not sure which account or strategy fits your situation? Ask here."}
                </h2>
                <p className="text-sm text-[#46423a] mt-2 leading-relaxed">
                  {isFr
                    ? `Les règles fiscales canadiennes et les plafonds de cotisation dépendent de votre situation précise. Posez votre question sur « ${article.invitationAbout} » : Ahmed vous répondra personnellement avec des explications claires et factuelles.`
                    : `Canadian tax rules, registered shelters, and liquidity limits depend on your exact household situation. Ask your specific question about “${article.invitationAbout}”: Ahmed reviews and responds directly with evidence-based education.`}
                </p>
              </div>

              <div className="pt-4 border-t border-[#ece6da] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="text-xs text-[#46423a]">
                  <span className="block font-semibold text-[#1c1b18]">
                    {isFr ? "Sujet pré-sélectionné :" : "Pre-selected Topic:"}
                  </span>
                  <span className="text-[#2e4a3b] font-semibold text-xs sm:text-sm">
                    {TOPIC_LABELS[article.contactTopic]?.[isFr ? "fr" : "en"] || article.contactTopic}
                  </span>
                  <span className="text-[#625d52] block mt-0.5">
                    {isFr ? "Le formulaire s'ouvrira avec cette catégorie déjà choisie." : "Opens the contact form with this category already configured."}
                  </span>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
                  <Link
                    to={`${prefix}/contact?topic=${article.contactTopic}`}
                    className="btn btn-primary text-xs py-2.5 px-5 text-center whitespace-nowrap inline-flex items-center justify-center gap-1.5 w-full sm:w-auto"
                  >
                    <span>{isFr ? "Poser ma question à Ahmed" : "Ask Ahmed about this"}</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>

            {/* 10. Related Articles */}
            {relatedArticles.length > 0 && (
              <section className="pt-8 border-t border-[#d6cebd] space-y-6 no-print">
                <h2 className="h3 text-[#1c1b18]">{isFr ? "Lectures recommandées" : "Related reading"}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedArticles.map((rel) => {
                    if (!rel) return null;
                    const relCat = categories.find((c) => c.id === rel.category);
                    return (
                      <Link
                        key={rel.slug}
                        to={`${prefix}${rel.url}`}
                        className="p-5 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] hover:border-[#2e4a3b] transition-all flex flex-col justify-between group"
                      >
                        <div>
                          <span className="text-[0.7rem] uppercase tracking-wider font-semibold text-[#2e4a3b] block mb-2">
                            {(isFr && relCat ? CATEGORY_LABELS_FR[relCat.id] : relCat?.label) || rel.category}
                          </span>
                          <h3 className="font-serif text-lg font-medium text-[#1c1b18] group-hover:text-[#2e4a3b] transition-colors leading-snug mb-2">
                            {isFr ? ARTICLE_FR_SEO[rel.slug]?.title || rel.title : rel.title}
                          </h3>
                          {!isFr && (
                            <p className="text-xs text-[#625d52] line-clamp-3 mb-4">
                              {rel.question}
                            </p>
                          )}
                        </div>
                        <span className="text-xs font-semibold text-[#2e4a3b] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          {isFr ? "Lire le guide" : "Read guide"} <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
