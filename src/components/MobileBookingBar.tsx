import React, { useEffect, useRef, useState } from "react";
import { siteConfig, getCtaLabel } from "../config/site.ts";
import { Calendar } from "lucide-react";
import { useLanguage } from "../context/LanguageContext.tsx";
import { trackBookingClick } from "../lib/track.ts";

/**
 * Single full-width sticky mobile call-to-action.
 * Hides on downward scroll to preserve reading space, and returns on upward scroll.
 */
export const MobileBookingBar: React.FC = () => {
  const { isFr } = useLanguage();
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  const ctaLabel = getCtaLabel(isFr);

  useEffect(() => {
    lastScrollY.current = typeof window !== "undefined" ? window.scrollY : 0;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;

      if (currentY <= 48) {
        setVisible(true);
      } else if (delta > 8 && currentY > 96) {
        setVisible(false);
      } else if (delta < -6) {
        setVisible(true);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <aside
      aria-label={ctaLabel}
      className={`sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#14211a]/95 backdrop-blur-md border-t border-[#2e4a3b]/80 px-4 py-2.5 shadow-lg transition-transform duration-200 ease-out motion-reduce:transition-none ${
        visible ? "translate-y-0" : "translate-y-full pointer-events-none"
      }`}
    >
      <a
        href={siteConfig.schedulingUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackBookingClick("mobile_booking_bar")}
        className="w-full min-h-[44px] bg-[#d6c298] hover:bg-[#e0cfab] text-[#14211a] font-semibold text-sm px-4 py-2.5 rounded-[2px] transition-colors flex items-center justify-center gap-2"
      >
        <Calendar className="w-4 h-4 shrink-0 text-[#75581f]" aria-hidden="true" />
        <span>{ctaLabel}</span>
      </a>
    </aside>
  );
};
