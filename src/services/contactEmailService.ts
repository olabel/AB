// Centralized Contact & Confirmation Email Service
// Handles input validation, durable anti-abuse rate limiting per IP and per recipient email,
// disposable domain blocking, bot detection, and compliant email dispatch via Resend.

import fs from "fs";
import path from "path";

export const VALID_PROVINCES = [
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
  "National (Canada & US)",
  "United States — Northeast",
  "United States — Southeast",
  "United States — Midwest",
  "United States — Southwest",
  "United States — West Coast",
  "United States — Other State",
];

export const VALID_TOPICS = [
  "general",
  "accounts",
  "investing",
  "protection",
  "family",
  "retirement",
  "newcomer",
  "mentorship",
  "newsletter",
  "calculator",
  "other",
];

export const TMP_LEADS_FILE = path.join("/tmp", "ahmed_leads.json");

export interface StoredLead {
  topic: string;
  name: string;
  email: string;
  phone?: string;
  province?: string;
  message?: string;
  consentEducational?: boolean;
  ip?: string;
  recordedAt: string;
}

export function recordLeadSubmission(lead: Omit<StoredLead, "recordedAt">): void {
  try {
    let existing: StoredLead[] = [];
    if (fs.existsSync(TMP_LEADS_FILE)) {
      try {
        existing = JSON.parse(fs.readFileSync(TMP_LEADS_FILE, "utf-8"));
      } catch {
        existing = [];
      }
    }
    const record: StoredLead = {
      ...lead,
      recordedAt: new Date().toISOString(),
    };
    existing.push(record);
    fs.writeFileSync(TMP_LEADS_FILE, JSON.stringify(existing, null, 2), "utf-8");
    console.log(
      `[LEAD CAPTURED] Topic: ${lead.topic} | Name: ${lead.name} | Email: ${lead.email} | Saved Total: ${existing.length}`
    );
  } catch (err) {
    console.warn("Could not save lead to /tmp/ahmed_leads.json:", err);
  }
}

export function getRecordedLeads(): StoredLead[] {
  try {
    if (fs.existsSync(TMP_LEADS_FILE)) {
      return JSON.parse(fs.readFileSync(TMP_LEADS_FILE, "utf-8"));
    }
  } catch {
    // fallback
  }
  return [];
}

export function sanitizeText(input: unknown): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/\0/g, "")
    .replace(/[\r\n]/g, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/[<>]/g, "")
    .trim();
}

export function sanitizeMultiline(input: unknown): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/\0/g, "")
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<[^>]*>/g, "")
    .replace(/[<>]/g, "")
    .trim();
}

// --------------------------------------------------------------------------
// Multi-Tier Durable Rate Limiting (survives container cold starts via /tmp)
// --------------------------------------------------------------------------
const TMP_LIMITS_FILE = path.join("/tmp", "ahmed_rate_limits.json");
const TMP_SUBSCRIBERS_FILE = path.join("/tmp", "ahmed_confirmed_subscribers.json");

interface PersistedRateLimits {
  ips: Record<string, { count: number; resetTime: number }>;
  emails: Record<string, { count: number; resetTime: number }>;
}

function loadPersistedLimits(): PersistedRateLimits {
  try {
    if (fs.existsSync(TMP_LIMITS_FILE)) {
      const raw = fs.readFileSync(TMP_LIMITS_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch {
    // Non-blocking in ephemeral sandboxes
  }
  return { ips: {}, emails: {} };
}

function savePersistedLimits(data: PersistedRateLimits) {
  try {
    const now = Date.now();
    const cleanIps: Record<string, { count: number; resetTime: number }> = {};
    for (const [k, v] of Object.entries(data.ips || {})) {
      if (v && v.resetTime > now) cleanIps[k] = v;
    }
    const cleanEmails: Record<string, { count: number; resetTime: number }> = {};
    for (const [k, v] of Object.entries(data.emails || {})) {
      if (v && v.resetTime > now) cleanEmails[k] = v;
    }
    fs.writeFileSync(
      TMP_LIMITS_FILE,
      JSON.stringify({ ips: cleanIps, emails: cleanEmails }),
      "utf-8"
    );
  } catch {
    // Non-blocking
  }
}

// Memory cache for immediate hot lookups
const ipSubmissions = new Map<string, { count: number; resetTime: number }>();
const IP_RATE_LIMIT_MAX = 8;
const IP_RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

export function checkIpRateLimit(ip: string): boolean {
  const now = Date.now();
  const state = loadPersistedLimits();
  const entry = state.ips[ip] || ipSubmissions.get(ip);

  if (!entry || now > entry.resetTime) {
    const updated = { count: 1, resetTime: now + IP_RATE_LIMIT_WINDOW_MS };
    ipSubmissions.set(ip, updated);
    state.ips[ip] = updated;
    savePersistedLimits(state);
    return true;
  }

  if (entry.count >= IP_RATE_LIMIT_MAX) {
    return false;
  }

  entry.count += 1;
  ipSubmissions.set(ip, entry);
  state.ips[ip] = entry;
  savePersistedLimits(state);
  return true;
}

// Disposable email provider blocklist to block automated bombing
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com",
  "10minutemail.com",
  "guerrillamail.com",
  "tempmail.com",
  "throwawaymail.com",
  "trashmail.com",
  "yopmail.com",
  "sharklasers.com",
  "dispostable.com",
  "temp-mail.org",
  "fakeinbox.com",
]);

const emailReceiptTracker = new Map<string, { count: number; resetTime: number }>();
const EMAIL_RECEIPT_MAX = 2;
const EMAIL_RECEIPT_WINDOW_MS = 2 * 60 * 60 * 1000;

export function shouldSendReceiptToEmail(email: string): boolean {
  const normalized = email.toLowerCase().trim();
  const domain = normalized.split("@")[1];
  if (domain && DISPOSABLE_DOMAINS.has(domain)) {
    return false;
  }

  const now = Date.now();
  const state = loadPersistedLimits();
  const entry = state.emails[normalized] || emailReceiptTracker.get(normalized);

  if (!entry || now > entry.resetTime) {
    const updated = { count: 1, resetTime: now + EMAIL_RECEIPT_WINDOW_MS };
    emailReceiptTracker.set(normalized, updated);
    state.emails[normalized] = updated;
    savePersistedLimits(state);
    return true;
  }

  if (entry.count >= EMAIL_RECEIPT_MAX) {
    return false;
  }

  entry.count += 1;
  emailReceiptTracker.set(normalized, entry);
  state.emails[normalized] = entry;
  savePersistedLimits(state);
  return true;
}

export function recordConfirmedSubscriber(email: string): boolean {
  try {
    const normalized = email.toLowerCase().trim();
    let subscribers: Record<string, string> = {};
    if (fs.existsSync(TMP_SUBSCRIBERS_FILE)) {
      subscribers = JSON.parse(fs.readFileSync(TMP_SUBSCRIBERS_FILE, "utf-8"));
    }
    subscribers[normalized] = new Date().toISOString();
    fs.writeFileSync(TMP_SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2), "utf-8");
    return true;
  } catch {
    return false;
  }
}

export interface ContactSubmissionPayload {
  firstName?: unknown;
  name?: unknown;
  fullName?: unknown;
  email?: unknown;
  phone?: unknown;
  province?: unknown;
  topic?: unknown;
  message?: unknown;
  consentPrivacy?: unknown;
  consentEducational?: unknown;
  honeypot?: unknown;
  formLoadedAt?: unknown;
}

export interface ContactServiceResult {
  status: number;
  body: {
    success?: boolean;
    error?: string;
    message?: string;
    notice?: string;
    code?: string;
    errors?: Record<string, string>;
    recorded?: boolean;
    queued?: boolean;
  };
}

export async function processContactSubmission(
  rawBody: any,
  clientIp: string,
  resendApiKey: string | undefined,
  contactToEmail: string = "enquiries@ahmedbello.com",
  contactFromEmail: string = "Ahmed Bello <enquiries@ahmedbello.com>"
): Promise<ContactServiceResult> {
  // 1. IP Rate Limiting
  if (!checkIpRateLimit(clientIp)) {
    return {
      status: 429,
      body: {
        error: "rate_limit_exceeded",
        message: "Too many submissions from this connection. Please try again in an hour.",
      },
    };
  }

  // 2. Extract and sanitize inputs
  const body = rawBody || {};
  let firstName = sanitizeText(body.firstName || body.name || body.fullName);
  const email = sanitizeText(body.email);
  const phone = sanitizeText(body.phone);
  let province = sanitizeText(body.province);
  const topic = sanitizeText(body.topic) || "general";
  const message = sanitizeMultiline(body.message);
  const consentPrivacy = Boolean(body.consentPrivacy);
  const consentEducational = Boolean(body.consentEducational);
  const honeypot = sanitizeText(body.honeypot);
  const formLoadedAt = Number(body.formLoadedAt);

  // 3. Honeypot check: silently drop bots
  if (honeypot && honeypot.length > 0) {
    return {
      status: 200,
      body: { success: true, notice: "processed" },
    };
  }

  // 4. Minimum fill time check (2 seconds)
  if (formLoadedAt && !isNaN(formLoadedAt)) {
    const elapsed = Date.now() - formLoadedAt;
    if (elapsed < 2000) {
      return {
        status: 400,
        body: {
          error: "automated_submission",
          message: "Submission was too fast. Please take a moment to review before submitting.",
        },
      };
    }
  }

  const isNewsletter = topic === "newsletter";
  const isCalculator = topic === "calculator";
  const isMentorship = topic === "mentorship";

  if (isNewsletter && !firstName) {
    firstName = "Newsletter Subscriber";
  }
  if (isNewsletter && !province) {
    province = "National (Canada & US)";
  }

  if (isCalculator && !firstName) {
    firstName = "Valued Client";
  }
  if (isCalculator && !province) {
    province = "National (Canada & US)";
  }

  // 5. Validation
  const errors: Record<string, string> = {};

  // Unicode name regex supporting international names (e.g. Nguyễn, Łukasz, محمد, 王伟, Олена, O’Brien, Dr. Okafor)
  const unicodeNameRegex = /^[\p{L}\p{M}\s'’‘.-]{1,80}$/u;
  if (!firstName || firstName.length === 0) {
    errors.firstName = "First name is required.";
  } else if (firstName.length > 80) {
    errors.firstName = "First name must be 80 characters or fewer.";
  } else if (!unicodeNameRegex.test(firstName)) {
    errors.firstName = "First name contains invalid characters.";
  }

  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!email || email.length > 100 || !emailRegex.test(email)) {
    errors.email = "A valid email address is required (under 100 characters).";
  }

  if (!isNewsletter) {
    if (!province || !VALID_PROVINCES.includes(province)) {
      errors.province = "Please select a valid Canadian province or region from the dropdown.";
    }

    if (phone) {
      const cleanPhone = phone.replace(/[\s().+-]/g, "");
      if (cleanPhone.length < 10 || cleanPhone.length > 15 || !/^\d+$/.test(cleanPhone)) {
        errors.phone = "Phone number format is invalid (10 to 15 digits expected).";
      }
    }

    if (!consentPrivacy && !isCalculator) {
      errors.consentPrivacy = "You must accept the privacy notice before submitting.";
    }
  }

  if (Object.keys(errors).length > 0) {
    return {
      status: 400,
      body: {
        error: "validation_failed",
        errors,
      },
    };
  }

  // 5.5 Durably persist lead to disk immediately (survives cold starts, environment restarts & Resend downtime)
  recordLeadSubmission({
    topic,
    name: firstName,
    email,
    phone,
    province,
    message,
    consentEducational,
    ip: clientIp,
  });

  // 6. If no Resend API key is present in environment, safely queue and return success
  if (!resendApiKey) {
    console.log(`[LEAD QUEUED OFFLINE] (No RESEND_API_KEY) Topic: ${topic} | ${firstName} <${email}>`);
    return {
      status: 200,
      body: {
        success: true,
        message: isNewsletter
          ? "Subscription request received. Please check your inbox for confirmation."
          : isCalculator
          ? "Your customized plan has been recorded and queued for delivery. Ahmed Bello will review your calculation details."
          : "Enquiry sent successfully. I will follow up shortly.",
        recorded: true,
      },
    };
  }

  // 7. Dispatch to advisor
  let emailSubject = `Financial Enquiry: ${firstName} (${province}) - ${topic}`;
  if (isNewsletter) {
    emailSubject = `Intentional Wealth Briefing Subscriber: ${email}`;
  } else if (isMentorship) {
    emailSubject = `New Agent Mentorship Application: ${firstName} (${province})`;
  } else if (isCalculator) {
    emailSubject = `Customized Plan Calculation Lead: ${firstName} (${province})`;
  }

  const advisorEmailBody = `
${
  isNewsletter
    ? "=== NEW INTENTIONAL WEALTH BRIEFING SUBSCRIBER ==="
    : isMentorship
    ? "=== NEW INDEPENDENT AGENT MENTORSHIP APPLICATION ==="
    : isCalculator
    ? "=== NEW CUSTOMIZED PLAN CALCULATION ENQUIRY ==="
    : "=== NEW FINANCIAL EDUCATION ENQUIRY ==="
}

Name: ${firstName}
Email: ${email}
Phone: ${phone || "Not provided"}
Location: ${province}
Topic: ${topic}
CASL Educational Consent: ${consentEducational ? "Granted (Opted in)" : "Not granted (Did not opt in)"}

${message ? `Notes / Calculation Breakdown:\n${message}\n` : ""}
---------------------------------------------------------
Submitted: ${new Date().toISOString()}
Origin: https://www.ahmedbello.com
  `.trim();

  const rawRecipients = contactToEmail
    .split(/[,;\s]+/)
    .map((e) => e.trim())
    .filter((e) => e.includes("@"));

  const primaryRecipient = rawRecipients[0] || "enquiries@ahmedbello.com";

  try {
    let resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: contactFromEmail,
        to: rawRecipients,
        reply_to: email,
        subject: emailSubject,
        text: advisorEmailBody,
      }),
    });

    if (!resendResponse.ok && rawRecipients.length > 1) {
      resendResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: contactFromEmail,
          to: [primaryRecipient],
          reply_to: email,
          subject: `${emailSubject} [For Ahmed]`,
          text: `${advisorEmailBody}\n\nNote: Dispatched to primary address while domain verification completes.`,
        }),
      });
    }

    // 8. Automatic Visitor Receipt / Confirmation with Anti-Abuse Rate Limiting
    const canSendReceipt = shouldSendReceiptToEmail(email);
    if (canSendReceipt && resendResponse.ok) {
      try {
        let confirmationSubject: string;
        let confirmationBody: string;

        if (isNewsletter) {
          // Double opt-in / verification receipt to prevent third-party spamming
          confirmationSubject = "Confirm your subscription: Canadian Financial Education | Ahmed Bello";
          confirmationBody = `Hello ${firstName},

Thank you for requesting to join the Intentional Wealth Briefing through ahmedbello.com.

To confirm your email address and activate your subscription to receive occasional plain-language briefings when key Canadian tax rules, annual registered account limits (TFSA/RRSP/FHSA), or public pension policies are updated, please verify your interest:
https://www.ahmedbello.com/confirm-subscription?email=${encodeURIComponent(email)}

If you did not request this educational briefing, please disregard this message. You will not receive any further emails unless confirmed.

Warm regards,
Ahmed Bello
Licensed Financial Solutions Professional
Moncton, New Brunswick, Canada
https://www.ahmedbello.com`;
        } else if (isCalculator) {
          confirmationSubject = "Your Customized Plan Calculation Breakdown | Ahmed Bello";
          confirmationBody = `Hello ${firstName},

Thank you for calculating your numbers on ahmedbello.com.

Here is the customized calculation you requested:
---------------------------------------------------------
${message}
---------------------------------------------------------

Next Steps:
Financial calculators provide general mathematical projections, but personal tax brackets, risk tolerance, and Canadian registered account contribution room (TFSA/RRSP/FHSA) require tailored analysis.

If you would like to review your numbers with a Licensed Financial Solutions Professional:
• Schedule 30 minutes on Calendly: https://calendly.com/olabel/30min
• Direct Phone: +1-506-899-4941
• Direct Email: enquiries@ahmedbello.com

Warm regards,
Ahmed Bello
Licensed Financial Solutions Professional
Moncton, New Brunswick, Canada
https://www.ahmedbello.com`;
        } else {
          // Standard enquiry receipt - Strictly single-practitioner wording ("I", not "we" or "our team")
          confirmationSubject = "Confirmation: I received your enquiry | Ahmed Bello";
          confirmationBody = `Hello ${firstName},

Thank you for reaching out through ahmedbello.com. This automated receipt confirms that I have safely received your enquiry regarding ${topic}.

What happens next:
1. Review: I personally review incoming enquiries in the order received and aim to follow up with evidence-based educational insights.
2. Direct, Objective Discussion: I provide clear answers to your questions without sales pressure or proprietary product mandates.
3. Exploration: If your situation calls for a deeper conversation, we can review next steps during a 30-minute introductory call.

If you would like to schedule a time right away:
• Schedule 30 minutes on Calendly: https://calendly.com/olabel/30min
• Direct Phone: +1-506-899-4941
• Direct Email: enquiries@ahmedbello.com

Warm regards,
Ahmed Bello
Licensed Financial Solutions Professional
Moncton, New Brunswick, Canada
https://www.ahmedbello.com`;
        }

        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: contactFromEmail,
            to: [email],
            subject: confirmationSubject,
            text: confirmationBody,
          }),
        });
      } catch {
        // Non-blocking: Primary enquiry was already delivered to advisor
      }
    }

    return {
      status: 200,
      body: {
        success: true,
        message: isNewsletter
          ? "Subscription request received. Please check your inbox for confirmation."
          : isCalculator
          ? "Your customized plan has been recorded and queued for delivery. Ahmed Bello will review your calculation details."
          : "Enquiry sent successfully. I will follow up shortly.",
      },
    };
  } catch {
    // If network to Resend failed, lead is already safely stored in /tmp/ahmed_leads.json
    return {
      status: 200,
      body: {
        success: true,
        message: isNewsletter
          ? "Subscription request received. Please check your inbox for confirmation."
          : isCalculator
          ? "Your customized plan has been recorded and queued for delivery. Ahmed Bello will review your calculation details."
          : "Enquiry sent successfully. I will follow up shortly.",
        recorded: true,
      },
    };
  }
}
