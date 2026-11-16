/**
 * Site configuration and compliance constants.
 * Single source of truth for regulated titles, CTA copy, credentials, and live state.
 */

// DRAFT_MODE is set to false for production launch
export const DRAFT_MODE = false;

export const siteConfig = {
  name: "Ahmed Bello",
  legalName: "Ahmed Bello",
  designation: "Licensed Financial Solutions Professional",
  siteUrl: "https://www.ahmedbello.com",
  privacyContact: "Ahmed Bello, privacy@ahmedbello.com",
  privacyEmail: "privacy@ahmedbello.com",
  tagline: "Your money questions are connected. The answers should be, too.",
  footerBrandLine: "Understand your money. Make informed decisions. Build with intention.",
  portrait: "/assets/aistudio/headshot1_0b740ccc.webp",
  headshotUrl: "/assets/aistudio/headshot1_0b740ccc.webp",

  // Standardized primary call-to-action language & duration (single source of truth)
  callDurationMinutes: 15,
  ctaLabelEn: "Book a free 15-minute call",
  ctaLabelFr: "Réserver un appel gratuit de 15 minutes",
  ctaShortLabelEn: "Book free 15-min call",
  ctaShortLabelFr: "Appel gratuit 15 min",
  secondaryCtaLabelEn: "Send a question",
  secondaryCtaLabelFr: "Envoyer une question",

  // Regulated credentials (kept empty until verified details are provided; UI hides empty fields)
  credentials: {
    licenceType: "",
    provinces: "",
    licenceNumbers: "",
    regulatorLookupUrls: [] as { label: string; url: string }[],
  },

  // Author / practice social profile URLs for schema.org sameAs (omit when empty)
  socialProfiles: [] as string[],

  // Independent financial professional credentials
  affiliationWording: "Independent Financial Practice",
  licensedProvinces: [
    "Alberta",
    "British Columbia",
    "Manitoba",
    "New Brunswick",
    "Newfoundland and Labrador",
    "Northwest Territories",
    "Nova Scotia",
    "Nunavut",
    "Ontario",
    "Prince Edward Island",
    "Quebec",
    "Saskatchewan",
    "Yukon",
  ],
  publicEmail: "enquiries@ahmedbello.com",
  publicPhone: "+1-506-899-4941",
  schedulingUrl: "https://calendly.com/olabel/30min",
  bookingUrl: "https://calendly.com/olabel/30min",
  socialLinks: null as Record<string, string> | null,
  newsletterWebhookUrl: null as string | null,
  defaultFromEmail: "Ahmed Bello <enquiries@ahmedbello.com>",
};

export function hasSiteCredentials(
  creds: typeof siteConfig.credentials = siteConfig.credentials
): boolean {
  return Boolean(
    creds.licenceType.trim() ||
      creds.provinces.trim() ||
      creds.licenceNumbers.trim() ||
      creds.regulatorLookupUrls.some((item) => item.label.trim() && item.url.trim())
  );
}

export function getCtaLabel(isFr: boolean): string {
  return isFr ? siteConfig.ctaLabelFr : siteConfig.ctaLabelEn;
}

export function getSecondaryCtaLabel(isFr: boolean): string {
  return isFr ? siteConfig.secondaryCtaLabelFr : siteConfig.secondaryCtaLabelEn;
}
