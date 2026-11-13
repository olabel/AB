import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.tsx";
import { Newspaper, X, ExternalLink, ChevronRight } from "lucide-react";
import { STATIC_NEWS } from "../content/newsData.ts";

export const FloatingNewsWidget: React.FC = () => {
  const { isFr } = useLanguage();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Hide on what-changed pages and all article / reading guides to preserve reading focus
  const isHiddenPage =
    location.pathname === "/what-changed" ||
    location.pathname === "/fr/what-changed" ||
    location.pathname === "/news" ||
    location.pathname === "/fr/news" ||
    location.pathname.startsWith("/education") ||
    location.pathname.startsWith("/fr/education") ||
    location.pathname.startsWith("/insights") ||
    location.pathname.startsWith("/fr/insights");

  if (isHiddenPage || isDismissed) {
    return null;
  }

  const prefix = isFr ? "/fr" : "";

  return (
    <aside
      aria-label={isFr ? "Changements récents aux règles financières" : "Recent Canadian money rule updates"}
      className="fixed right-3 bottom-20 sm:bottom-8 z-40 select-none"
    >
      {/* 1. Hanging Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2 p-2.5 bg-[#1a2c22] hover:bg-[#253d30] text-[#f7f3eb] rounded-[2px] border border-[#d6c298]/60 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
          title={isFr ? "Voir les changements réglementaires récents" : "What Changed in Canadian Money Rules"}
          aria-expanded={isOpen}
          aria-label={isFr ? "Changements aux règles" : "Money Rule Changes"}
        >
          <span className="inline-flex h-2 w-2 rounded-[1px] bg-[#d6c298]" aria-hidden="true" />

          <Newspaper className="w-4 h-4 text-[#d6c298] group-hover:scale-105 transition-transform" />

          <span className="hidden group-hover:inline-block pr-1 text-[0.7rem] font-medium tracking-wide text-[#ece6da]">
            {isFr ? "Règles 2026" : "Rule Updates"}
          </span>
        </button>
      )}

      {/* 2. Compact Popup Preview */}
      {isOpen && (
        <div className="w-80 sm:w-88 bg-[#1a2c22] text-[#f7f3eb] border border-[#d6c298]/80 rounded-[2px] shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="px-3.5 py-2.5 bg-[#24392e] border-b border-[#2e4a3b] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-2 w-2 rounded-[1px] bg-[#d6c298]" aria-hidden="true" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#d6c298]">
                {isFr ? "Ce qui a changé (Nov 2026)" : "What Changed (Nov 2026)"}
              </span>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-[#ece6da]/70 hover:text-[#f7f3eb] hover:bg-[#2e4a3b] rounded-xs transition-colors cursor-pointer"
              title={isFr ? "Fermer" : "Close"}
              aria-label={isFr ? "Fermer" : "Close"}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Headline Body */}
          <div className="p-4 space-y-2">
            <div className="flex items-center justify-between text-[0.7rem] text-[#d6c298]">
              <span className="font-semibold uppercase tracking-wider">
                {isFr ? "Banque du Canada & BSIF" : "Bank of Canada & OSFI"}
              </span>
              <span className="text-[#ece6da]/70">Nov 2026</span>
            </div>

            <h4 className="font-serif text-sm font-semibold text-[#f7f3eb] leading-snug">
              <Link
                to={`${prefix}/what-changed`}
                onClick={() => setIsOpen(false)}
                className="hover:text-[#d6c298] transition-colors"
              >
                {isFr
                  ? "Baisse du taux directeur à 2,50 % & exemption du test de résistance B-20 du BSIF"
                  : "Overnight Rate Cut to 2.50% & OSFI Uninsured Mortgage Straight-Switch In Effect"}
              </Link>
            </h4>
            <p className="text-xs text-[#d6cebd] line-clamp-2">
              {isFr
                ? "Découvrez l'analyse d'Ahmed Bello sur l'impact pour les emprunteurs et les épargnants."
                : "Read Ahmed's advisor breakdown on mortgage renewal leverage and cash yield shifts."}
            </p>
          </div>

          {/* Action Link to What Changed Page */}
          <div className="p-2.5 bg-[#17251d] border-t border-[#2e4a3b]">
            <Link
              to={`${prefix}/what-changed`}
              onClick={() => setIsOpen(false)}
              className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 bg-[#d6c298] hover:bg-[#e4d4b3] text-[#1a2c22] font-semibold text-xs rounded-xs transition-colors text-center"
            >
              <span>{isFr ? "Lire la revue réglementaire complète" : "Read Full Advisor Briefing"}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </aside>
  );
};
