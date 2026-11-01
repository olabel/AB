// Centralized Contact & Confirmation Email Service
// Handles input validation, anti-abuse rate limiting per IP and per recipient email,
// bot detection, and compliant email dispatch via Resend.

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
  "other",
];

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

// In-memory rate limiting per IP (max 8 requests / hour)
const ipSubmissions = new Map<string, { count: number; resetTime: number }>();
const IP_RATE_LIMIT_MAX = 8;
const IP_RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

export function checkIpRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = ipSubmissions.get(ip);
  if (!entry || now > entry.resetTime) {
    ipSubmissions.set(ip, { count: 1, resetTime: now + IP_RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= IP_RATE_LIMIT_MAX) {
    return false;
  }
  entry.count += 1;
  return true;
}

// In-memory rate limiting per target recipient email (anti-abuse spam protection)
// Max 2 automated confirmation emails per recipient email per 2 hours
const emailReceiptTracker = new Map<string, { count: number; resetTime: number }>();
const EMAIL_RECEIPT_MAX = 2;
const EMAIL_RECEIPT_WINDOW_MS = 2 * 60 * 60 * 1000;

export function shouldSendReceiptToEmail(email: string): boolean {
  const normalized = email.toLowerCase().trim();
  const now = Date.now();
  const entry = emailReceiptTracker.get(normalized);
  if (!entry || now > entry.resetTime) {
    emailReceiptTracker.set(normalized, { count: 1, resetTime: now + EMAIL_RECEIPT_WINDOW_MS });
    return true;
  }
  if (entry.count >= EMAIL_RECEIPT_MAX) {
    return false;
  }
  entry.count += 1;
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
  if (isNewsletter && !firstName) {
    firstName = "Newsletter Subscriber";
  }
  if (isNewsletter && !province) {
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
  if (!email || !emailRegex.test(email) || email.length > 100) {
    errors.email = "A valid email address is required (under 100 characters).";
  }

  if (phone && (!/^[0-9+\-()\s]{7,25}$/.test(phone) || phone.length > 25)) {
    errors.phone = "Invalid phone number format.";
  }

  if (!isNewsletter && (!province || !VALID_PROVINCES.includes(province))) {
    errors.province = "Please select a valid Canadian province or region from the dropdown.";
  }

  if (!topic || !VALID_TOPICS.includes(topic)) {
    errors.topic = "Please select a valid financial topic.";
  }

  if (message.length > 2500) {
    errors.message = "Message must not exceed 2,500 characters.";
  }

  if (!consentPrivacy) {
    errors.consentPrivacy = "You must accept the privacy notice before submitting.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      status: 400,
      body: { error: "validation_failed", errors },
    };
  }

  // 6. Check email delivery service credentials
  if (!resendApiKey) {
    return {
      status: 503,
      body: {
        code: "not_configured",
        message: "The form is active, but email delivery is not yet configured on this deployment.",
      },
    };
  }

  // 7. Compose Advisor Notification
  const isMentorship = topic === "mentorship";
  let emailSubject = `New Financial Education Enquiry: ${topic} (${firstName})`;
  if (isNewsletter) {
    emailSubject = `New Mailing List Subscriber: ${email} (${firstName})`;
  } else if (isMentorship) {
    emailSubject = `New Agent Mentorship Application: ${firstName} (${province})`;
  }

  const advisorEmailBody = `
${
  isNewsletter
    ? "=== NEW INTENTIONAL WEALTH BRIEFING SUBSCRIBER ==="
    : isMentorship
    ? "=== NEW INDEPENDENT AGENT MENTORSHIP APPLICATION ==="
    : "=== NEW FINANCIAL EDUCATION ENQUIRY ==="
}

Name: ${firstName}
Email: ${email}
Phone: ${phone || "Not provided"}
Location: ${province}
Topic: ${topic}
CASL Educational Consent: ${consentEducational ? "Granted (Opted in)" : "Not granted (Did not opt in)"}

${message ? `Notes / Message:\n${message}\n` : ""}
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

    // Fallback to primary recipient if domain sandboxing restricts multiple addresses
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
          subject: `${emailSubject} [For Ahmed & Team]`,
          text: `${advisorEmailBody}\n\nNote: Dispatched to primary address while domain verification completes.`,
        }),
      });
    }

    if (!resendResponse.ok) {
      return {
        status: 502,
        body: {
          error: "delivery_failed",
          message:
            "Your message could not be sent right now. Please reach out directly by email at enquiries@ahmedbello.com, call +1-506-899-4941, or schedule a conversation via Calendly.",
        },
      };
    }

    // 8. Automatic Visitor Receipt / Confirmation with Anti-Abuse Rate Limiting
    const canSendReceipt = shouldSendReceiptToEmail(email);
    if (canSendReceipt) {
      try {
        let confirmationSubject: string;
        let confirmationBody: string;

        if (isNewsletter) {
          // Double opt-in / verification receipt to prevent third-party spamming
          confirmationSubject = "Confirm your subscription to Intentional Wealth Briefing | Ahmed Bello";
          confirmationBody = `Hello ${firstName},

Thank you for requesting to join the Intentional Wealth Briefing newsletter through ahmedbello.com.

To confirm your subscription and begin receiving our monthly plain-language breakdowns of Canadian tax rules, registered accounts, and family money strategies, please verify your interest:
https://www.ahmedbello.com/confirm-subscription?email=${encodeURIComponent(email)}

If you did not request this newsletter subscription, please ignore this email. You will not receive any further emails unless verified.

Warm regards,
Ahmed Bello
Licensed Financial Solutions Professional
Moncton, New Brunswick, Canada
https://www.ahmedbello.com`;
        } else {
          // Standard enquiry receipt
          confirmationSubject = "Confirmation: We received your enquiry | Ahmed Bello";
          confirmationBody = `Hello ${firstName},

Thank you for reaching out through ahmedbello.com. This automated receipt confirms that we have safely received your enquiry regarding ${topic}.

What happens next:
1. Review: Our team reviews incoming enquiries in the order received and aims to follow up with evidence-based educational insights.
2. Direct, Objective Discussion: We provide clear answers to your questions without aggressive sales pressure or proprietary product mandates.
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
          : "Enquiry sent successfully. We will follow up shortly.",
      },
    };
  } catch {
    return {
      status: 500,
      body: {
        error: "server_error",
        message:
          "Your message could not be sent right now. Please reach out directly by email at enquiries@ahmedbello.com, call +1-506-899-4941, or schedule a conversation via Calendly.",
      },
    };
  }
}
