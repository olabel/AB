import React, { useState } from "react";
import { Link } from "react-router-dom";
import { SEO } from "../components/SEO.tsx";
import { useLanguage } from "../context/LanguageContext.tsx";
import { siteConfig, getCtaLabel, getSecondaryCtaLabel } from "../config/site.ts";
import { trackBookingClick } from "../lib/track.ts";
import {
  Calendar,
  TrendingDown,
  Scale,
  ShieldCheck,
  Building2,
  Home,
  PiggyBank,
  ArrowRight,
  CheckCircle2,
  FileText,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

import { RULE_CHANGES } from "../content/whatChangedData.ts";

export const WhatChangedPage: React.FC = () => {
  const { isFr } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredChanges = RULE_CHANGES.filter((item) => {
    if (selectedCategory === "all") return true;
    return item.category === selectedCategory;
  });

  return (
    <section className="section bg-[#f7f3eb]">
      <SEO
        title={
          isFr
            ? "Règles financières 2026 au Canada | Ahmed Bello"
            : "2026 Money Rules & CRA Updates | Ahmed Bello"
        }
        description={
          isFr
            ? "Mises à jour nov. 2026 : Budget 2026, CELI 2027 à 7 500 $ et REER à 35 390 $, taux directeur à 2,50 %, taux prescrit à 3 % et BSIF B-20."
            : "Nov 2026 Canadian money rules: Federal Budget 2026, 2027 $7,500 TFSA & $35,390 RRSP limits, BoC 2.50% rate, CRA 3% rate, and OSFI B-20 rules."
        }
        canonicalUrl={isFr ? "/fr/what-changed" : "/what-changed"}
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
            <li className="text-[#1c1b18] font-medium">
              {isFr ? "Règles financières 2026" : "2026 Money Rules"}
            </li>
          </ol>
        </nav>

        {/* Page Hero */}
        <header className="pb-10 border-b border-[#d6cebd] space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#2e4a3b]">
            <Scale className="w-3.5 h-3.5 text-[#75581f]" />
            <span>
              {isFr ? "Revue Réglementaire & Fiscale Mensuelle" : "Monthly Advisor Regulatory Briefing"}
            </span>
          </div>

          <h1 className="h1 text-[#1c1b18]">
            {isFr
              ? "Ce qui a changé dans les règles financières au Canada"
              : "What Changed in Canadian Money Rules"}
          </h1>

          <p className="lede measure font-serif italic">
            {isFr
              ? "Chaque mois, la Banque du Canada, le ministère des Finances, le BSIF et l'ARC ajustent les taux d'intérêt, les règles hypothécaires et les plafonds fiscaux. Voici notre synthèse vérifiée de l'édition de novembre 2026 et des mesures concrètes à retenir."
              : "Every month, federal regulators, the Bank of Canada, Department of Finance, OSFI, and the CRA adjust interest rates, mortgage guidelines, and tax limits. Here is a verified November 2026 assessment of what changed, what remains proposed, and practical steps to check."}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-[#625d52]">
            <span className="flex items-center gap-1.5 font-medium text-[#1c1b18]">
              <ShieldCheck className="w-4 h-4 text-[#2e4a3b]" />
              {isFr ? "Vérifié par Ahmed Bello" : "Compiled & verified by Ahmed Bello"}
            </span>
            <span aria-hidden="true">&bull;</span>
            <span>{isFr ? "Mis à jour : 24 novembre 2026" : "Updated: November 24, 2026"}</span>
            <span aria-hidden="true">&bull;</span>
            <span>
              {isFr
                ? `${RULE_CHANGES.length} analyses réglementaires`
                : `${RULE_CHANGES.length} regulatory updates analyzed`}
            </span>
          </div>

          <p className="text-xs text-[#625d52] leading-relaxed pt-1">
            {isFr
              ? "Information éducative générale uniquement. Les mesures du Budget fédéral 2026 demeurent des propositions jusqu'à leur sanction royale. Confirmez vos chiffres exacts auprès d'un CPA ou d'un conseiller juridique."
              : "General educational summary only. Federal Budget 2026 measures remain proposals until enacted by Parliament. Confirm rules for your specific situation with a qualified tax or legal professional."}
          </p>
        </header>

        {/* Filter Toolbar */}
        <div className="py-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#d6cebd]/70">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "all", labelEn: "All Updates", labelFr: "Toutes les mises à jour" },
              { id: "rates", labelEn: "Rates & Bank of Canada", labelFr: "Taux & Banque du Canada" },
              { id: "mortgage", labelEn: "Mortgages & Housing", labelFr: "Hypothèques & Immobilier" },
              { id: "tax", labelEn: "Budget 2026 & CRA Rules", labelFr: "Budget 2026 & Règles ARC" },
              { id: "corporate", labelEn: "Corporate, AMT & Brackets", labelFr: "Sociétés, IMR & Paliers" },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setSelectedCategory(f.id)}
                className={`px-3 py-1.5 text-xs rounded-[2px] transition-colors border font-medium cursor-pointer ${
                  selectedCategory === f.id
                    ? "bg-[#2e4a3b] text-[#f7f3eb] border-[#2e4a3b]"
                    : "bg-[#ece6da]/60 text-[#4a463d] border-[#d6cebd] hover:border-[#2e4a3b] hover:text-[#1c1b18]"
                }`}
              >
                {isFr ? f.labelFr : f.labelEn}
              </button>
            ))}
          </div>

          <div className="text-xs text-[#625d52]">
            {filteredChanges.length}{" "}
            {isFr ? "mises à jour répertoriées" : "regulatory briefings displayed"}
          </div>
        </div>

        {/* Chronological Briefings List (Newest first) */}
        <div className="py-8 space-y-12">
          {filteredChanges.map((item) => (
            <article
              key={item.id}
              className="bg-[#f2ece1] border border-[#d6cebd] rounded-[2px] p-6 sm:p-8 space-y-6 shadow-xs relative"
            >
              {/* Card Meta & Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#d6cebd]/60 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#2e4a3b]">
                    <Calendar className="w-3.5 h-3.5" />
                    {item.month} {item.year}
                  </span>
                  <span aria-hidden="true" className="text-[#d6cebd]">&bull;</span>
                  <span className="text-xs text-[#75581f] font-medium uppercase tracking-wider">
                    {isFr ? item.categoryLabelFr : item.categoryLabelEn}
                  </span>
                </div>

                <a
                  href={item.officialSource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-[#625d52] hover:text-[#2e4a3b] transition-colors"
                >
                  <span>{item.officialSource.label}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Title & Official Summary */}
              <div>
                <h2 className="h2 text-[#1c1b18] mb-3">
                  {isFr ? item.titleFr : item.titleEn}
                </h2>
                <p className="text-sm sm:text-base text-[#4a463d] leading-relaxed">
                  {isFr ? item.summaryFr : item.summaryEn}
                </p>
              </div>

              {/* Ahmed's Direct Take Callout */}
              <div className="border-l-2 border-[#2e4a3b] bg-[#fcfaf5] pl-4 sm:pl-5 py-3 pr-4 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#2e4a3b]">
                  <Scale className="w-4 h-4 text-[#75581f]" />
                  <span>{isFr ? "L'analyse d'Ahmed Bello" : "Ahmed's Advisor Analysis"}</span>
                </div>
                <p className="text-xs sm:text-sm text-[#1c1b18] font-serif leading-relaxed">
                  {isFr ? item.ahmedAnalysisFr : item.ahmedAnalysisEn}
                </p>
              </div>

              {/* Action Checklist */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1c1b18] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2e4a3b]" />
                  <span>{isFr ? "Plan d'action concret" : "Practical Action Steps"}</span>
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-[#4a463d] list-none p-0">
                  {(isFr ? item.actionItemsFr : item.actionItemsEn).map((action, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="text-[#75581f] font-bold mt-0.5">&rsaquo;</span>
                      <span className="leading-relaxed">{action}</span>
                    </li>
                  ))}
                </ul>

                {item.relatedLink && (
                  <div className="pt-2">
                    <Link
                      to={isFr ? item.relatedLink.toFr : item.relatedLink.toEn}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#fcfaf5] hover:bg-[#2e4a3b] text-[#2e4a3b] hover:text-[#f7f3eb] border border-[#2e4a3b]/30 rounded-[2px] text-xs font-medium transition-colors"
                    >
                      <span>{isFr ? item.relatedLink.labelFr : item.relatedLink.labelEn}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* Bottom Practice Banner */}
        <section className="bg-[#14211a] text-[#f7f3eb] rounded-[2px] p-8 sm:p-10 border border-[#2e4a3b] space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#2e4a3b] border border-[#d6c298]/30 rounded-[2px] text-[11px] text-[#d6c298] font-medium tracking-wide">
            <ShieldCheck className="w-3.5 h-3.5 text-[#d6c298]" />
            <span>{isFr ? "Accompagnement Personnalisé" : "Personalized Financial Review"}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif text-[#f7f3eb] leading-snug">
            {isFr
              ? "Une de ces nouvelles règles a-t-elle un impact sur votre foyer ?"
              : "Did one of these regulatory changes impact your household or business?"}
          </h2>

          <p className="text-sm sm:text-base text-[#d6cebd] max-w-2xl leading-relaxed">
            {isFr
              ? "Que vous ayez une hypothèque à renouveler, des comptes enregistrés à optimiser ou une société à structurer, regardons vos chiffres clairement ensemble."
              : "Whether you have an upcoming mortgage renewal, registered accounts to balance, or a Canadian corporation to protect, let's walk through your exact numbers."}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-5">
            {siteConfig.schedulingUrl && (
              <a
                href={siteConfig.schedulingUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackBookingClick("what_changed_bottom")}
                className="btn bg-[#d6c298] hover:bg-[#c2ad82] text-[#14211a] font-medium text-xs sm:text-sm rounded-[2px] transition-colors inline-flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>{getCtaLabel(isFr)}</span>
              </a>
            )}
            <Link
              to={isFr ? "/fr/contact" : "/contact"}
              className="arrow-link text-sm text-[#d6c298] hover:text-white"
            >
              <span>{getSecondaryCtaLabel(isFr)}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </section>
  );
};
