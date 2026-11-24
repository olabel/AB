import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.tsx";
import { Newspaper, X, ChevronRight } from "lucide-react";

export const FloatingNewsWidget: React.FC = () => {
  const { isFr } = useLanguage();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);

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

  if (isHiddenPage) {
    return null;
  }

  const prefix = isFr ? "/fr" : "";

  return (
    <aside
      aria-label={isFr ? "Règles financières 2026" : "2026 Canadian money rules"}
      className="hidden md:block fixed right-4 bottom-8 z-40 select-none"
    >
      {/* 1. Hanging Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2 p-2.5 bg-[#1a2c22] hover:bg-[#253d30] text-[#f7f3eb] rounded-[2px] border border-[#d6c298]/60 shadow-xs transition-colors duration-200 cursor-pointer"
          title={isFr ? "Règles financières 2026" : "2026 Money Rules"}
          aria-expanded={isOpen}
          aria-label={isFr ? "Règles financières 2026" : "2026 Money Rules"}
        >
          <Newspaper className="w-4 h-4 text-[#d6c298]" aria-hidden="true" />
          <span className="hidden group-hover:inline-block pr-1 text-xs font-medium text-[#ece6da]">
            {isFr ? "Règles 2026" : "2026 Money Rules"}
          </span>
        </button>
      )}

      {/* 2. Compact Popup Preview */}
      {isOpen && (
        <div className="w-80 bg-[#1a2c22] text-[#f7f3eb] border border-[#d6c298]/70 rounded-[2px] shadow-xs overflow-hidden">
          {/* Header */}
          <div className="px-3.5 py-2.5 bg-[#24392e] border-b border-[#2e4a3b] flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#d6c298]">
              {isFr ? "Règles 2026 (Nov.)" : "2026 Money Rules (Nov)"}
            </span>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-[#ece6da]/70 hover:text-[#f7f3eb] hover:bg-[#2e4a3b] rounded-[2px] transition-colors cursor-pointer"
              title={isFr ? "Fermer" : "Close"}
              aria-label={isFr ? "Fermer" : "Close"}
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>

          {/* Headline Body */}
          <div className="p-4 space-y-2">
            <div className="flex items-center justify-between text-[0.7rem] text-[#d6c298]">
              <span className="font-semibold uppercase tracking-wider">
                {isFr ? "Budget 2026 & Banque du Canada" : "Budget 2026 & Bank of Canada"}
              </span>
              <span className="text-[#ece6da]/70">Nov 2026</span>
            </div>

            <h2 className="font-serif text-sm font-semibold text-[#f7f3eb] leading-snug">
              <Link
                to={`${prefix}/what-changed`}
                onClick={() => setIsOpen(false)}
                className="hover:text-[#d6c298] transition-colors"
              >
                {isFr
                  ? "Budget 2026, CELI 2027 à 7 500 $, REER à 35 390 $ & taux directeur à 2,50 %"
                  : "Budget 2026 Proposals, 2027 TFSA $7,500 & RRSP $35,390, BoC Rate 2.50%"}
              </Link>
            </h2>
            <p className="text-xs text-[#d6cebd] line-clamp-2">
              {isFr
                ? "Consultez les 7 mises à jour vérifiées de novembre : seuil T1135, taux prescrit à 3 % et règles hypothécaires."
                : "Read all 7 verified November updates covering T1135, CRA 3% spousal loan rates, and OSFI B-20 rules."}
            </p>
          </div>

          {/* Action Link to What Changed Page */}
          <div className="p-2.5 bg-[#17251d] border-t border-[#2e4a3b]">
            <Link
              to={`${prefix}/what-changed`}
              onClick={() => setIsOpen(false)}
              className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 bg-[#d6c298] hover:bg-[#e4d4b3] text-[#1a2c22] font-semibold text-xs rounded-[2px] transition-colors text-center"
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
