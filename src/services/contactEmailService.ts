// Centralized Contact & Confirmation Email Service
// Handles input validation, durable anti-abuse rate limiting per IP and per recipient email,
// disposable domain blocking, bot detection, and compliant email dispatch via Resend.

import fs from "fs";
import path from "path";
import crypto from "crypto";
import { saveLeadToDatabase, recordEmailDeliveryStatus, recordSubscriberToDatabase } from "./dbService.ts";
import { saveSubscriberViaAdmin, saveLeadViaAdmin } from "../server/firebaseAdmin.ts";

export const DEFAULT_NOTIFICATION_RECIPIENTS = "olabel@gmail.com, abello24trdc@wfgmail.ca";

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
  } catch (err) {
    console.warn("Could not save lead to backup leads file:", err);
  }
}
export async function saveLeadToFirestoreServer(lead: {
  referenceNo: string;
  topic: string;
  firstName: string;
  email: string;
  phone?: string;
  province?: string;
  message?: string;
  consentEducational?: boolean;
  consentPrivacy?: boolean;
  source?: string;
}): Promise<boolean> {
  return await saveLeadViaAdmin(lead);
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

export const CASL_CONSENT_WORDING =
  "I consent to receive occasional plain-language educational briefings regarding Canadian tax changes, registered account limits (TFSA, RRSP, FHSA), and financial policy updates from Ahmed Bello under CASL.";

/**
 * Generate a cryptographically signed, expiring token (48h TTL) for CASL double opt-in.
 * Fails closed if SESSION_SECRET / TOKEN_SECRET is not configured.
 */
export function generateSubscriptionToken(email: string): string {
  const normalized = email.toLowerCase().trim();
  const expiresAt = Date.now() + 48 * 60 * 60 * 1000; // 48 hours validity
  const payload = `${normalized}:${expiresAt}`;
  const secret = (process.env.SESSION_SECRET || process.env.TOKEN_SECRET || "").trim();
  if (!secret) {
    throw new Error("SESSION_SECRET is not configured in environment. Double opt-in signing fails closed.");
  }
  const signature = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return `${Buffer.from(payload, "utf-8").toString("base64url")}.${signature}`;
}

/**
 * Verify HMAC signature and expiration on a subscription token.
 * Fails closed if SESSION_SECRET / TOKEN_SECRET is not configured.
 */
export function verifySubscriptionToken(token: string): { valid: boolean; email?: string; error?: string } {
  if (!token || typeof token !== "string" || !token.includes(".")) {
    return { valid: false, error: "invalid_format" };
  }
  const [b64Payload, signature] = token.split(".");
  if (!b64Payload || !signature) {
    return { valid: false, error: "invalid_format" };
  }
  const secret = (process.env.SESSION_SECRET || process.env.TOKEN_SECRET || "").trim();
  if (!secret) {
    console.error("[CASL SECURITY]: SESSION_SECRET is not configured. Failing closed.");
    return { valid: false, error: "signing_secret_not_configured" };
  }
  try {
    const payload = Buffer.from(b64Payload, "base64url").toString("utf-8");
    const [email, expiresStr] = payload.split(":");
    const expiresAt = Number(expiresStr);
    if (!email || isNaN(expiresAt)) {
      return { valid: false, error: "malformed_token" };
    }
    const expectedSignature = crypto.createHmac("sha256", secret).update(payload).digest("hex");

    const sigBuffer = Buffer.from(signature, "hex");
    const expBuffer = Buffer.from(expectedSignature, "hex");
    if (sigBuffer.length !== expBuffer.length || !crypto.timingSafeEqual(sigBuffer, expBuffer)) {
      return { valid: false, error: "invalid_signature" };
    }
    if (Date.now() > expiresAt) {
      return { valid: false, error: "token_expired" };
    }
    return { valid: true, email };
  } catch {
    return { valid: false, error: "verification_exception" };
  }
}

/**
 * Server-Authoritative Subscriber Persistence via Firebase Admin SDK.
 * Bypasses client rules to securely write CASL proof without allowing public client writes.
 */
export async function saveSubscriberToFirestoreServer(subscriber: {
  email: string;
  confirmedAt: string;
  consentWording: string;
  ip: string;
  userAgent?: string;
  source?: string;
}): Promise<boolean> {
  return await saveSubscriberViaAdmin(subscriber);
}

/**
 * Multi-layer persistence for verified subscribers (SQLite, Firestore, local backup).
 */
export async function recordConfirmedSubscriber(params: {
  email: string;
  ip: string;
  userAgent?: string;
  consentWording?: string;
  source?: string;
}): Promise<boolean> {
  const normalized = params.email.toLowerCase().trim();
  const confirmedAt = new Date().toISOString();
  const consentText = params.consentWording || CASL_CONSENT_WORDING;

  // 1. SQLite database persistence
  recordSubscriberToDatabase({
    email: normalized,
    confirmedAt,
    consentWording: consentText,
    ip: params.ip,
    userAgent: params.userAgent,
    source: params.source || "double_opt_in",
  });

  // 2. Dual persistence to Firebase Firestore
  await saveSubscriberToFirestoreServer({
    email: normalized,
    confirmedAt,
    consentWording: consentText,
    ip: params.ip,
    userAgent: params.userAgent,
    source: params.source || "double_opt_in",
  });

  // 3. Local JSON backup
  try {
    let subscribers: Record<string, { confirmedAt: string; ip: string; consentWording: string }> = {};
    if (fs.existsSync(TMP_SUBSCRIBERS_FILE)) {
      subscribers = JSON.parse(fs.readFileSync(TMP_SUBSCRIBERS_FILE, "utf-8"));
    }
    subscribers[normalized] = {
      confirmedAt,
      ip: params.ip,
      consentWording: consentText,
    };
    fs.writeFileSync(TMP_SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2), "utf-8");
  } catch {
    // Non-blocking
  }

  return true;
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
  website_hp?: unknown;
  hp_check?: unknown;
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
    referenceNo?: string;
    phone?: string;
    calendly?: string;
    recorded?: boolean;
    queued?: boolean;
  };
}

export async function processContactSubmission(
  rawBody: any,
  clientIp: string,
  resendApiKey: string | undefined,
  contactToEmail: string = DEFAULT_NOTIFICATION_RECIPIENTS,
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
  const honeypot = sanitizeText(body.honeypot || body.website_hp || body.hp_check || body.work_phone_hp);
  const formLoadedAt = Number(body.formLoadedAt);

  // 3. Honeypot check: silently drop automated spam
  if (honeypot && honeypot.length > 0) {
    return {
      status: 200,
      body: { success: true, notice: "processed" },
    };
  }

  // 4. Minimum fill time check (allow fast browser autofill, drop sub-800ms scripts)
  if (formLoadedAt && !isNaN(formLoadedAt)) {
    const elapsed = Date.now() - formLoadedAt;
    if (elapsed < 800) {
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

  const PROVINCE_MAP: Record<string, string> = {
    AB: "Alberta",
    BC: "British Columbia",
    MB: "Manitoba",
    NB: "New Brunswick",
    NL: "Newfoundland and Labrador",
    NT: "Northwest Territories",
    NS: "Nova Scotia",
    NU: "Nunavut",
    ON: "Ontario",
    PE: "Prince Edward Island",
    PEI: "Prince Edward Island",
    QC: "Quebec",
    SK: "Saskatchewan",
    YT: "Yukon",
  };
  if (province && PROVINCE_MAP[province.toUpperCase()]) {
    province = PROVINCE_MAP[province.toUpperCase()];
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

  // 5.5 Save each lead to a real database FIRST before attempting email dispatch
  let dbRecord: { id: string; referenceNo: string } | null = null;
  try {
    dbRecord = saveLeadToDatabase({
      topic,
      firstName,
      email,
      phone,
      province,
      message,
      consentPrivacy,
      consentEducational,
      ip: clientIp,
    });
    // Compliant logging: Log ONLY reference number (no PII: no names, no email addresses)
    console.log(`[LEAD SAVED TO DB] Ref: #${dbRecord.referenceNo} | Topic: ${topic} | Stored in SQLite.`);
  } catch (dbErr: any) {
    console.error(`[DB ERROR] Database write failed:`, dbErr?.message || dbErr);
  }

  // Dual Persistence: Also persist directly to Firebase Firestore
  const referenceNo = dbRecord?.referenceNo || Math.random().toString(36).substring(2, 8).toUpperCase();
  await saveLeadToFirestoreServer({
    referenceNo,
    topic,
    firstName,
    email,
    phone,
    province,
    message,
    consentPrivacy,
    consentEducational,
    source: isNewsletter ? "newsletter_form" : isCalculator ? "calculator_form" : "contact_form",
  });

  // Backup file persistence
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

  // 6. If no Resend API key is present in environment, record alert in DB and handle outcome
  if (!resendApiKey) {
    if (dbRecord) {
      recordEmailDeliveryStatus({
        leadId: dbRecord.id,
        referenceNo: dbRecord.referenceNo,
        status: "offline_saved",
        errorMessage: "RESEND_API_KEY unconfigured; lead safely preserved in SQLite database",
        recipients: "olabel@gmail.com, abello24trdc@wfgmail.ca",
      });
      console.warn(`[EMAIL ALERT] Ref: #${dbRecord.referenceNo} | Email unconfigured. Lead preserved in SQLite database.`);
      return {
        status: 200,
        body: {
          success: true,
          referenceNo: dbRecord.referenceNo,
          message: isNewsletter
            ? "Subscription request received. Please check your inbox for confirmation."
            : isCalculator
            ? "Your customized plan has been recorded and queued for delivery. Ahmed Bello will review your calculation details."
            : "Enquiry sent successfully. I will follow up shortly.",
          recorded: true,
        },
      };
    }

    // Both database and email failed!
    return {
      status: 500,
      body: {
        error: "submission_failed",
        message:
          "Your message could not be saved right now. Please reach out directly to Ahmed Bello by phone at +1-506-899-4941 or schedule a conversation via Calendly.",
        phone: "+1-506-899-4941",
        calendly: "https://calendly.com/olabel/30min",
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

  const rawRecipientsList = contactToEmail
    .split(/[,;\s]+/)
    .map((e) => e.trim())
    .filter((e) => e.includes("@"));

  // Ensure both designated advisor inboxes are always targeted
  if (!rawRecipientsList.includes("olabel@gmail.com")) {
    rawRecipientsList.push("olabel@gmail.com");
  }
  if (!rawRecipientsList.includes("abello24trdc@wfgmail.ca")) {
    rawRecipientsList.push("abello24trdc@wfgmail.ca");
  }
  const rawRecipients = Array.from(new Set(rawRecipientsList));
  const allRecipientsString = rawRecipients.join(", ");

  const primaryRecipient = rawRecipients[0] || "olabel@gmail.com";

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

    // Direct Notification Fallback: If custom domain is unverified, fallback to Resend's verified onboarding sender to olabel@gmail.com
    if (!resendResponse.ok) {
      try {
        const fallbackResend = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Ahmed Bello Notifications <onboarding@resend.dev>",
            to: ["olabel@gmail.com"],
            reply_to: email,
            subject: `${emailSubject} [Notification]`,
            text: advisorEmailBody,
          }),
        });
        if (fallbackResend.ok) {
          resendResponse = fallbackResend;
          console.log(`[RESEND DELIVERED] Dispatched notification to olabel@gmail.com via onboarding@resend.dev`);
        }
      } catch (fbErr) {
        // preserve original response
      }
    }

    if (resendResponse.ok) {
      if (dbRecord) {
        recordEmailDeliveryStatus({
          leadId: dbRecord.id,
          referenceNo: dbRecord.referenceNo,
          status: "delivered",
          recipients: allRecipientsString,
        });
      }
    } else {
      if (dbRecord) {
        recordEmailDeliveryStatus({
          leadId: dbRecord.id,
          referenceNo: dbRecord.referenceNo,
          status: "failed",
          errorMessage: `Resend API returned HTTP ${resendResponse.status}`,
          recipients: allRecipientsString,
        });
        console.warn(
          `[EMAIL ALERT] Ref: #${dbRecord.referenceNo} | Resend dispatch failed (HTTP ${resendResponse.status}) to [${allRecipientsString}]. Alert logged to database.`
        );
      }
    }

    // 8. Automatic Visitor Receipt / Confirmation with Anti-Abuse Rate Limiting
    const canSendReceipt = shouldSendReceiptToEmail(email);
    if (canSendReceipt && resendApiKey) {
      try {
        let confirmationSubject: string;
        let confirmationBody: string;

        if (isNewsletter) {
          const subToken = generateSubscriptionToken(email);
          confirmationSubject = "Confirm your subscription: Canadian Financial Education | Ahmed Bello";
          confirmationBody = `Hello ${firstName},

Thank you for requesting to join the Intentional Wealth Briefing through ahmedbello.com.

To confirm your email address and activate your subscription to receive occasional plain-language briefings when key Canadian tax rules, annual registered account limits (TFSA/RRSP/FHSA), or public pension policies are updated, please verify your interest:
https://www.ahmedbello.com/confirm-subscription?token=${encodeURIComponent(subToken)}

If you did not request this educational briefing, please disregard this message. You will not receive any further emails unless confirmed.

Warm regards,
Ahmed Bello
Licensed Financial Solutions Professional
Moncton, New Brunswick, Canada
https://www.ahmedbello.com`;
        } else if (isCalculator) {
          confirmationSubject = `Your Customized Plan Calculation Breakdown (#${referenceNo}) | Ahmed Bello`;
          confirmationBody = `Hello ${firstName},

Thank you for calculating your numbers on ahmedbello.com.

Reference Number: #${referenceNo}

Here is the customized calculation you requested:
---------------------------------------------------------
${message}
---------------------------------------------------------

Next Steps:
Financial calculators provide general mathematical projections, but personal tax brackets, risk tolerance, and Canadian registered account contribution room (TFSA/RRSP/FHSA) require tailored analysis.

Schedule a 30-minute review on Calendly:
https://calendly.com/olabel/30min

Direct Contact:
• Direct Phone: +1-506-899-4941
• Direct Email: enquiries@ahmedbello.com

Warm regards,
Ahmed Bello
Licensed Financial Solutions Professional
Moncton, New Brunswick, Canada
https://www.ahmedbello.com`;
        } else {
          confirmationSubject = `Confirmation: I received your enquiry (#${referenceNo}) | Ahmed Bello`;
          confirmationBody = `Hello ${firstName},

Thank you for reaching out through ahmedbello.com. This automated receipt confirms that I have safely received your enquiry regarding ${topic}.

Reference Number: #${referenceNo}

What happens next:
1. Review: I personally review incoming enquiries in the order received and aim to follow up with evidence-based educational insights.
2. Direct, Objective Discussion: I provide clear answers to your questions without sales pressure or proprietary product mandates.
3. Exploration: If your situation calls for a deeper conversation, we can review next steps during a 30-minute introductory call.

Schedule your complimentary 30-minute introductory consultation directly on Calendly:
https://calendly.com/olabel/30min

You can also reach me directly at:
• Direct Telephone: +1-506-899-4941
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
      } catch (visitorErr) {
        // Non-blocking: Primary enquiry was already handled
        console.warn(`[VISITOR RECEIPT WARNING]:`, visitorErr);
      }
    }

    if (dbRecord) {
      return {
        status: 200,
        body: {
          success: true,
          referenceNo: dbRecord.referenceNo,
          message: isNewsletter
            ? "Subscription request received. Please check your inbox for confirmation."
            : isCalculator
            ? "Your customized plan has been recorded and queued for delivery. Ahmed Bello will review your calculation details."
            : "Enquiry sent successfully. I will follow up shortly.",
        },
      };
    }

    return {
      status: 200,
      body: {
        success: true,
        message: isNewsletter
          ? "Subscription request received. Please check your inbox for confirmation."
          : "Enquiry sent successfully. I will follow up shortly.",
      },
    };
  } catch (err: any) {
    if (dbRecord) {
      recordEmailDeliveryStatus({
        leadId: dbRecord.id,
        referenceNo: dbRecord.referenceNo,
        status: "failed",
        errorMessage: err?.message || "Network exception during email dispatch",
        recipients: contactToEmail,
      });
      console.warn(
        `[EMAIL ALERT] Ref: #${dbRecord.referenceNo} | Dispatch exception. Lead safely preserved in SQLite database.`
      );
      return {
        status: 200,
        body: {
          success: true,
          referenceNo: dbRecord.referenceNo,
          message: isNewsletter
            ? "Subscription request received. Please check your inbox for confirmation."
            : isCalculator
            ? "Your customized plan has been recorded and queued for delivery. Ahmed Bello will review your calculation details."
            : "Enquiry sent successfully. I will follow up shortly.",
          recorded: true,
        },
      };
    }

    // Both database and email failed!
    return {
      status: 500,
      body: {
        error: "submission_failed",
        message:
          "Your message could not be sent right now. Please reach out directly to Ahmed Bello by phone at +1-506-899-4941 or schedule a conversation via Calendly.",
        phone: "+1-506-899-4941",
        calendly: "https://calendly.com/olabel/30min",
      },
    };
  }
}
