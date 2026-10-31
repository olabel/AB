import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { analytics } from "../services/analytics.ts";

export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const lastPathRef = useRef<string>("");
  const scrollMilestonesRef = useRef<Set<number>>(new Set());

  // Track page views on route changes
  useEffect(() => {
    if (location.pathname !== lastPathRef.current) {
      lastPathRef.current = location.pathname;
      scrollMilestonesRef.current.clear();

      analytics.track("page_view", {
        title: document.title,
        search: location.search,
      });
    }
  }, [location.pathname, location.search]);

  // Track scroll depth milestones on guides/articles
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;

      const currentScrollPercent = Math.round((window.scrollY / scrollHeight) * 100);

      [50, 90].forEach((milestone) => {
        if (currentScrollPercent >= milestone && !scrollMilestonesRef.current.has(milestone)) {
          scrollMilestonesRef.current.add(milestone);
          analytics.track("article_read", {
            milestone: `${milestone}%`,
            path: location.pathname,
          });
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  // Track external action link clicks (Calendly, WhatsApp)
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target || !target.href) return;

      const href = target.href;
      if (href.includes("calendly.com")) {
        analytics.track("calendly_click", {
          targetUrl: href,
          page: location.pathname,
        });
      } else if (href.includes("wa.me") || href.includes("whatsapp.com")) {
        analytics.track("whatsapp_click", {
          targetUrl: href,
          page: location.pathname,
        });
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [location.pathname]);

  return <>{children}</>;
};
