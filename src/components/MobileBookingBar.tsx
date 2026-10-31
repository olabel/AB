import React from "react";
import { siteConfig } from "../config/site.ts";
import { Calendar, MessageCircle, ArrowUpRight } from "lucide-react";
import { useLanguage } from "../context/LanguageContext.tsx";

export const MobileBookingBar: React.FC = () => {
  const { isFr } = useLanguage();
  const bookingUrl = siteConfig.schedulingUrl || "/contact";
  const whatsappUrl =
    "https://wa.me/15068994941?text=Hello%20Ahmed,%20I%20have%20a%20question%20about%20Canadian%20finances";

  return (
    <aside
      aria-label={isFr ? "Actions rapides de contact" : "Quick contact actions"}
      className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#14211a]/95 backdrop-blur-md border-t border-[#2e4a3b]/80 px-3 py-2.5 shadow-2xl safe-area-inset-bottom"
    >
      <div className="flex items-center gap-2 max-w-md mx-auto">
        {/* Book 20 Minutes */}
        <a
          href={bookingUrl}
          target={bookingUrl.startsWith("http") ? "_blank" : undefined}
          rel={bookingUrl.startsWith("http") ? "noopener noreferrer" : undefined}
          className="flex-1 bg-[#d6c298] hover:bg-[#e0cfab] text-[#14211a] font-semibold text-xs py-2.5 px-3 rounded-[2px] transition-colors flex items-center justify-center gap-1.5 shadow-xs"
        >
          <Calendar className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">{isFr ? "Réserver 20 min" : "Book 20 minutes"}</span>
          <ArrowUpRight className="w-3 h-3 shrink-0 opacity-70" aria-hidden="true" />
        </a>

        {/* WhatsApp Chat */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-xs py-2.5 px-3 rounded-[2px] transition-colors flex items-center justify-center gap-1.5 shadow-xs shrink-0"
          title={isFr ? "Discuter sur WhatsApp" : "Chat on WhatsApp"}
        >
          <MessageCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>WhatsApp</span>
        </a>
      </div>
    </aside>
  );
};
