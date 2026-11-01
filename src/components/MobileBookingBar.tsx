import React from "react";
import { Link } from "react-router-dom";
import { siteConfig } from "../config/site.ts";
import { Calendar, MessageSquare, ArrowUpRight } from "lucide-react";
import { useLanguage } from "../context/LanguageContext.tsx";

export const MobileBookingBar: React.FC = () => {
  const { isFr } = useLanguage();
  const bookingUrl = siteConfig.schedulingUrl || "https://calendly.com/olabel/30min";
  const contactUrl = isFr ? "/fr/contact" : "/contact";

  return (
    <aside
      aria-label={isFr ? "Actions rapides de contact" : "Quick contact actions"}
      className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#14211a]/95 backdrop-blur-md border-t border-[#2e4a3b]/80 px-3 py-2.5 shadow-2xl safe-area-inset-bottom"
    >
      <div className="flex items-center gap-2 max-w-md mx-auto">
        {/* Book 30 Minutes */}
        <a
          href={bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-[#d6c298] hover:bg-[#e0cfab] text-[#14211a] font-semibold text-xs py-2.5 px-3 rounded-[2px] transition-colors flex items-center justify-center gap-1.5 shadow-xs"
        >
          <Calendar className="w-3.5 h-3.5 shrink-0 text-[#75581f]" aria-hidden="true" />
          <span className="truncate">{isFr ? "Réserver 30 min" : "Book 30 minutes"}</span>
          <ArrowUpRight className="w-3 h-3 shrink-0 opacity-70" aria-hidden="true" />
        </a>

        {/* Ask a Question on Contact Form */}
        <Link
          to={contactUrl}
          className="bg-[#24392e] hover:bg-[#2e4a3b] text-[#f7f3eb] border border-[#2e4a3b] font-medium text-xs py-2.5 px-3 rounded-[2px] transition-colors flex items-center justify-center gap-1.5 shadow-xs shrink-0"
        >
          <MessageSquare className="w-3.5 h-3.5 shrink-0 text-[#d6c298]" aria-hidden="true" />
          <span>{isFr ? "Poser une question" : "Ask a Question"}</span>
        </Link>
      </div>
    </aside>
  );
};
