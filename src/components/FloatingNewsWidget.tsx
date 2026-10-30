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

  // If user is already on a news page, hide the floating widget
  const isNewsPage =
    location.pathname === "/news" ||
    location.pathname === "/financial-news" ||
    location.pathname === "/fr/news";

  const topStory = STATIC_NEWS[0];

  if (isNewsPage || isDismissed) {
    return null;
  }

  return (
    <aside
      aria-label={isFr ? "Actualités financières en direct" : "Live financial intelligence desk"}
      className="fixed right-3 bottom-6 sm:bottom-8 z-40 select-none"
    >
      {/* 1. Sleek, Small Hanging / Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2 p-2.5 bg-[#1a2c22] hover:bg-[#253d30] text-[#f7f3eb] rounded-full border border-[#d6c298]/60 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
          title={isFr ? "Ouvrir les actualités financières" : "Live Financial News"}
          aria-expanded={isOpen}
          aria-label={isFr ? "Ouvrir les actualités" : "Open Financial News"}
        >
          {/* Pulsing Emerald Dot */}
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#52b788] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#52b788]"></span>
          </span>

          <Newspaper className="w-4 h-4 text-[#d6c298] group-hover:scale-105 transition-transform" />

          {/* Tiny label on hover / medium screens */}
          <span className="hidden group-hover:inline-block pr-1 text-[0.7rem] font-medium tracking-wide text-[#ece6da]">
            {isFr ? "Actualités" : "News"}
          </span>
        </button>
      )}

      {/* 2. Compact Popup Preview (Strictly Headline, Source, Date, Link - NO summaries) */}
      {isOpen && (
        <div className="w-80 sm:w-88 bg-[#1a2c22] text-[#f7f3eb] border border-[#d6c298]/80 rounded-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="px-3.5 py-2.5 bg-[#24392e] border-b border-[#2e4a3b] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#52b788] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#52b788]"></span>
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#d6c298]">
                {isFr ? "Dernière Dépêche" : "Latest Headline"}
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

          {/* Headline Body: Headline, Source Name, Date, Link ONLY (NO summary or commentary) */}
          <div className="p-4 space-y-2.5">
            <div className="flex items-center justify-between text-[0.7rem] text-[#d6c298]">
              <span className="font-semibold">{topStory.source}</span>
              <span className="text-[#ece6da]/70">
                {new Date(topStory.pubDate).toLocaleDateString(isFr ? "fr-CA" : "en-CA", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>

            <h4 className="font-serif text-sm font-semibold text-[#f7f3eb] leading-snug">
              <a
                href={topStory.link}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#d6c298] transition-colors inline-flex items-start gap-1"
              >
                <span>{topStory.title}</span>
                <ExternalLink className="w-3 h-3 shrink-0 mt-1 opacity-70" />
              </a>
            </h4>
          </div>

          {/* Action Link to Full News Page */}
          <div className="p-2.5 bg-[#17251d] border-t border-[#2e4a3b]">
            <Link
              to={isFr ? "/fr/news" : "/news"}
              onClick={() => setIsOpen(false)}
              className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 bg-[#d6c298] hover:bg-[#e4d4b3] text-[#1a2c22] font-semibold text-xs rounded-xs transition-colors text-center"
            >
              <span>{isFr ? "Consulter toutes les actualités" : "View All Headlines"}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </aside>
  );
};
