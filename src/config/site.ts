/**
 * Site configuration and compliance constants.
 * Single source of truth for regulated titles, contact information, and live state.
 */

// DRAFT_MODE is set to false for production launch
export const DRAFT_MODE = false;

export const siteConfig = {
  name: "Ahmed Bello",
  legalName: "Ahmed Bello",
  designation: "Licensed Financial Solutions Professional",
  siteUrl: "https://ahmedbello.ca",
  privacyContact: "Ahmed Bello, privacy@ahmedbello.ca",
  privacyEmail: "privacy@ahmedbello.ca",
  tagline: "Your money questions are connected. The answers should be, too.",
  footerBrandLine: "Understand your money. Make informed decisions. Build with intention.",
  
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
    "Yukon"
  ],
  publicEmail: "enquiries@ahmedbello.ca",
  publicPhone: null as string | null,
  schedulingUrl: null as string | null,
  socialLinks: null as Record<string, string> | null,
  newsletterWebhookUrl: null as string | null,

  defaultFromEmail: "Ahmed Bello <enquiries@ahmedbello.ca>",
};
