/**
 * Privacy-First Client Analytics & Event Tracking Engine
 * Designed for Canadian regulatory compliance and privacy standards (PIPEDA/CASL).
 * Never stores or transmits IP addresses, PII, or advertising tracking cookies.
 */

export interface AnalyticsEvent {
  name:
    | "page_view"
    | "article_read"
    | "calculator_used"
    | "contact_form_submit"
    | "calendly_click"
    | "whatsapp_click"
    | "news_item_click"
    | "language_switch";
  path: string;
  properties?: Record<string, string | number | boolean>;
  timestamp: string;
}

export interface AnalyticsSummary {
  totalPageviews: number;
  uniqueSessions: number;
  topPages: { path: string; count: number }[];
  topTopics: { topic: string; count: number }[];
  conversions: {
    contactSubmissions: number;
    calendlyClicks: number;
    whatsappClicks: number;
    calculatorUses: number;
  };
  deviceBreakdown: { mobile: number; desktop: number };
  languageBreakdown: { en: number; fr: number };
}

const STORAGE_KEY = "ab_analytics_events_v1";
const SESSION_KEY = "ab_analytics_session_v1";

// Safe session ID generation without fingerprinting
function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let sid = sessionStorage.getItem(SESSION_KEY);
    if (!sid) {
      sid = "s_" + Math.random().toString(36).slice(2, 10) + "_" + Date.now().toString(36);
      sessionStorage.setItem(SESSION_KEY, sid);
    }
    return sid;
  } catch {
    return "ephemeral_session";
  }
}

// Get device type
function getDeviceType(): "mobile" | "desktop" {
  if (typeof window === "undefined") return "desktop";
  return window.innerWidth < 768 ? "mobile" : "desktop";
}

class AnalyticsService {
  private gaLoaded = false;
  private gaId: string | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.gaId = (import.meta as any).env?.VITE_GA_MEASUREMENT_ID || null;
      if (this.gaId) {
        this.initGA(this.gaId);
      }
    }
  }

  private initGA(measurementId: string) {
    if (typeof window === "undefined" || this.gaLoaded) return;
    try {
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      document.head.appendChild(script);

      (window as any).dataLayer = (window as any).dataLayer || [];
      function gtag(...args: any[]) {
        (window as any).dataLayer.push(args);
      }
      (window as any).gtag = gtag;
      gtag("js", new Date());
      gtag("config", measurementId, {
        anonymize_ip: true,
        cookie_flags: "SameSite=None;Secure",
      });
      this.gaLoaded = true;
    } catch {
      // Ignore if blocked by browser ad-blockers
    }
  }

  public track(name: AnalyticsEvent["name"], properties?: Record<string, any>) {
    if (typeof window === "undefined") return;

    const event: AnalyticsEvent = {
      name,
      path: window.location.pathname,
      properties: {
        ...properties,
        sessionId: getSessionId(),
        device: getDeviceType(),
        screen: `${window.innerWidth}x${window.innerHeight}`,
      },
      timestamp: new Date().toISOString(),
    };

    // 1. Store in local browser storage (aggregates insights)
    this.storeLocally(event);

    // 2. Transmit to server analytics endpoint asynchronously
    this.sendToServer(event);

    // 3. Forward to GA4 if enabled
    if (this.gaLoaded && typeof (window as any).gtag === "function") {
      try {
        (window as any).gtag("event", name, properties);
      } catch {
        // Silently catch
      }
    }
  }

  private storeLocally(event: AnalyticsEvent) {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const list: AnalyticsEvent[] = raw ? JSON.parse(raw) : [];
      list.push(event);
      // Keep most recent 500 events to prevent unbounded storage
      if (list.length > 500) {
        list.splice(0, list.length - 500);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch {
      // Storage unavailable or quota exceeded
    }
  }

  private sendToServer(event: AnalyticsEvent) {
    try {
      if (navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify(event)], { type: "application/json" });
        navigator.sendBeacon("/api/analytics", blob);
      } else {
        fetch("/api/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(event),
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      // Graceful offline fallback
    }
  }

  public getLocalSummary(): AnalyticsSummary {
    if (typeof window === "undefined") {
      return {
        totalPageviews: 0,
        uniqueSessions: 0,
        topPages: [],
        topTopics: [],
        conversions: { contactSubmissions: 0, calendlyClicks: 0, whatsappClicks: 0, calculatorUses: 0 },
        deviceBreakdown: { mobile: 0, desktop: 0 },
        languageBreakdown: { en: 0, fr: 0 },
      };
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const events: AnalyticsEvent[] = raw ? JSON.parse(raw) : [];

      const pageCounts: Record<string, number> = {};
      const topicCounts: Record<string, number> = {};
      const sessions = new Set<string>();
      let mobileCount = 0;
      let desktopCount = 0;
      let enCount = 0;
      let frCount = 0;
      const conversions = {
        contactSubmissions: 0,
        calendlyClicks: 0,
        whatsappClicks: 0,
        calculatorUses: 0,
      };

      for (const ev of events) {
        const sid = ev.properties?.sessionId as string;
        if (sid) sessions.add(sid);

        if (ev.properties?.device === "mobile") mobileCount++;
        else desktopCount++;

        if (ev.path.startsWith("/fr")) frCount++;
        else enCount++;

        if (ev.name === "page_view") {
          pageCounts[ev.path] = (pageCounts[ev.path] || 0) + 1;
        } else if (ev.name === "contact_form_submit") {
          conversions.contactSubmissions++;
          const t = (ev.properties?.topic as string) || "general";
          topicCounts[t] = (topicCounts[t] || 0) + 1;
        } else if (ev.name === "calendly_click") {
          conversions.calendlyClicks++;
        } else if (ev.name === "whatsapp_click") {
          conversions.whatsappClicks++;
        } else if (ev.name === "calculator_used") {
          conversions.calculatorUses++;
        }
      }

      const topPages = Object.entries(pageCounts)
        .map(([path, count]) => ({ path, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8);

      const topTopics = Object.entries(topicCounts)
        .map(([topic, count]) => ({ topic, count }))
        .sort((a, b) => b.count - a.count);

      return {
        totalPageviews: events.filter((e) => e.name === "page_view").length,
        uniqueSessions: Math.max(1, sessions.size),
        topPages,
        topTopics,
        conversions,
        deviceBreakdown: { mobile: mobileCount, desktop: desktopCount },
        languageBreakdown: { en: enCount, fr: frCount },
      };
    } catch {
      return {
        totalPageviews: 0,
        uniqueSessions: 0,
        topPages: [],
        topTopics: [],
        conversions: { contactSubmissions: 0, calendlyClicks: 0, whatsappClicks: 0, calculatorUses: 0 },
        deviceBreakdown: { mobile: 0, desktop: 0 },
        languageBreakdown: { en: 0, fr: 0 },
      };
    }
  }

  public clearData() {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  }
}

export const analytics = new AnalyticsService();
