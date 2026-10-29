import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.tsx";
import { TrendingUp, Landmark, X, ChevronRight, Sparkles, ExternalLink, Minimize2, Maximize2 } from "lucide-react";
import { STATIC_NEWS } from "../content/newsData.ts";

export const FloatingNewsWidget: React.FC = () => {
  const { language } = useLanguage();
  const isFr = language === "fr";
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // If user is already on /news or /financial-news, hide the widget
  const isNewsPage = location.pathname === "/news" || location.pathname === "/financial-news" || location.pathname === "/fr/news";

  const topStory = STATIC_NEWS[0];

  if (isNewsPage || isDismissed) {
    return null;
  }

  return (
    <aside aria-label={isFr ? "Actualités financières en direct" : "Live financial intelligence desk"} className="fixed right-0 top-1/2 -translate-y-1/2 z-40 select-none">
      {/* 1. Hanging Interactive Tab / Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2 py-3 px-2 sm:px-2.5 bg-[#2e4a3b] hover:bg-[#253d30] text-[#f7f3eb] rounded-l-md border-y border-l border-[#d6c298] shadow-lg transition-all duration-300 hover:pr-3 cursor-pointer"
          title={isFr ? "Ouvrir le bureau d'actualités financières" : "Open Financial News Desk"}
          aria-expanded={isOpen}
          aria-label={isFr ? "Ouvrir le bureau d'actualités" : "Open Live News Desk"}
        >
          {/* Pulsing Emerald Dot */}
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#52b788] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#52b788]"></span>
          </span>

          <TrendingUp className="w-4 h-4 text-[#d6c298] group-hover:scale-110 transition-transform" />

          {/* Vertical Text */}
          <div className="flex flex-col items-center">
            <span
              className="text-[0.68rem] font-semibold tracking-wider uppercase text-[#ece6da]"
              style={{
                writingMode: "vertical-rl",
                textOrientation: "mixed",
                letterSpacing: "0.1em",
              }}
            >
              {isFr ? "Actualités" : "News Desk"}
            </span>
          </div>

          {/* Quick Rate Pill on Hover */}
          <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 hidden md:block whitespace-nowrap bg-[#1a2c22] text-[#f7f3eb] text-[0.7rem] px-2.5 py-1 rounded-sm border border-[#d6c298] shadow-md">
            <span className="text-[#d6c298] font-bold">BoC 3.75%</span> &bull; <span>Fed 4.50%</span>
          </div>
        </button>
      )}

      {/* 2. Expanded Interactive Side Drawer Preview */}
      {isOpen && (
        <div className="mr-2 w-80 sm:w-88 bg-[#1a2c22] text-[#f7f3eb] border border-[#d6c298] rounded-md shadow-2xl overflow-hidden animate-in slide-in-from-right duration-250">
          {/* Card Header */}
          <div className="px-4 py-3 bg-[#24392e] border-b border-[#2e4a3b] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#52b788] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#52b788]"></span>
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#d6c298]">
                {isFr ? "Bureau d'Actualités en Direct" : "Live News Desk"}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-[#ece6da]/70 hover:text-[#f7f3eb] hover:bg-[#2e4a3b] rounded-sm transition-colors cursor-pointer"
                title={isFr ? "Réduire" : "Collapse"}
                aria-label={isFr ? "Réduire le volet" : "Collapse panel"}
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsDismissed(true)}
                className="p-1 text-[#ece6da]/70 hover:text-[#f7f3eb] hover:bg-[#2e4a3b] rounded-sm transition-colors cursor-pointer"
                title={isFr ? "Fermer pour cette session" : "Close for this session"}
                aria-label={isFr ? "Fermer pour cette session" : "Close for this session"}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Rates Ticker */}
          <div className="px-4 py-2 bg-[#17251d] border-b border-[#2e4a3b] grid grid-cols-2 gap-2 text-center text-xs">
            <div className="py-1 px-2 bg-[#1e3126] rounded-xs border border-[#2e4a3b]">
              <div className="text-[0.62rem] uppercase tracking-wider text-[#ece6da]/70">Banque du Canada</div>
              <div className="font-serif text-sm font-bold text-[#d6c298]">3.75%</div>
            </div>
            <div className="py-1 px-2 bg-[#1e3126] rounded-xs border border-[#2e4a3b]">
              <div className="text-[0.62rem] uppercase tracking-wider text-[#ece6da]/70">US Fed Target</div>
              <div className="font-serif text-sm font-bold text-[#d6c298]">4.50%</div>
            </div>
          </div>

          {/* Latest Headline Spotlight */}
          <div className="p-4 space-y-2.5">
            <div className="flex items-center justify-between text-[0.68rem] text-[#ece6da]/70">
              <span className="flex items-center gap-1 text-[#d6c298] font-semibold">
                <Landmark className="w-3 h-3" />
                {topStory.source}
              </span>
              <span>{topStory.country === "CA" ? "🇨🇦 Canada" : "🇺🇸 USA"}</span>
            </div>

            <h4 className="font-serif text-sm font-semibold text-[#f7f3eb] leading-snug line-clamp-2">
              {topStory.title}
            </h4>

            <p className="text-[0.72rem] text-[#ece6da]/80 leading-relaxed line-clamp-2">
              {topStory.summary}
            </p>
          </div>

          {/* Action Footer */}
          <div className="p-3 bg-[#24392e] border-t border-[#2e4a3b] flex items-center justify-between">
            <Link
              to={isFr ? "/fr/news" : "/news"}
              onClick={() => setIsOpen(false)}
              className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 bg-[#d6c298] hover:bg-[#e4d4b3] text-[#1a2c22] font-semibold text-xs rounded-sm transition-colors text-center"
            >
              <span>{isFr ? "Consulter le Bureau d'Actualités" : "Open Full Intelligence Desk"}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </aside>
  );
};
