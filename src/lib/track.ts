import { track as vercelTrack } from "@vercel/analytics";

/**
 * Universal safe analytics wrapper for Vercel Web Analytics.
 * Guards against SSR execution, ad-blockers, missing tokens, and network failures.
 */
export function safeTrack(eventName: string, properties?: Record<string, string | number | boolean | null | undefined>): void {
  try {
    if (typeof window !== "undefined" && typeof vercelTrack === "function") {
      // Filter out null/undefined properties to adhere to Vercel Analytics record format
      const cleanedProps: Record<string, string | number | boolean> = {};
      if (properties) {
        for (const [key, val] of Object.entries(properties)) {
          if (val !== null && val !== undefined) {
            cleanedProps[key] = val;
          }
        }
      }
      vercelTrack(eventName, cleanedProps);
    }
  } catch (err) {
    // Fail silently in development/testing or if analytics service is unreachable
    if (process.env.NODE_ENV === "development") {
      console.debug(`[Analytics Track Failed]: ${eventName}`, err);
    }
  }
}

/**
 * Fire cta_click with location identifier and readable button label
 */
export function trackCtaClick(location: string, label: string): void {
  safeTrack("cta_click", { location, label });
}

/**
 * Fire booking_click when user clicks a Calendly schedule link
 */
export function trackBookingClick(location: string = "direct"): void {
  safeTrack("booking_click", { location });
}

/**
 * Fire calculator_completed when a user computes results on an interactive model
 */
export function trackCalculatorCompleted(name: string): void {
  safeTrack("calculator_completed", { name });
}

/**
 * Fire lead_submit when a user submits an advisory enquiry form or calculation lead
 */
export function trackLeadSubmit(topic: string): void {
  safeTrack("lead_submit", { topic });
}

/**
 * Fire newsletter_submit when a user registers for the Intentional Wealth Briefing
 */
export function trackNewsletterSubmit(source: string = "footer"): void {
  safeTrack("newsletter_submit", { source });
}

/**
 * Fire subscription_confirmed when a user clicks their cryptographic CASL double opt-in link
 */
export function trackSubscriptionConfirmed(): void {
  safeTrack("subscription_confirmed");
}
