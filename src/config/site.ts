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
  siteUrl: "https://www.ahmedbello.com",
  privacyContact: "Ahmed Bello, privacy@ahmedbello.com",
  privacyEmail: "privacy@ahmedbello.com",
  tagline: "Your money questions are connected. The answers should be, too.",
  footerBrandLine: "Understand your money. Make informed decisions. Build with intention.",
  headshotUrl: "/assets/aistudio/headshot1_0b740ccc.png",
  
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
  publicEmail: "enquiries@ahmedbello.com",
  publicPhone: "+1-506-899-4941",
  schedulingUrl: "https://calendly.com/olabel/30min",
  socialLinks: null as Record<string, string> | null,
  newsletterWebhookUrl: null as string | null,
  defaultFromEmail: "Ahmed Bello <onboarding@resend.dev>",
};
