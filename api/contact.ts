// Vercel Serverless Function for /api/contact & newsletter subscriptions
// Handles contact enquiries, agent mentorship applications, and mailing list signups

function sanitizeText(input: unknown): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/\0/g, "")
    .replace(/[\r\n]/g, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/[<>]/g, "")
    .trim();
}

function sanitizeMultiline(input: unknown): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/\0/g, "")
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<[^>]*>/g, "")
    .replace(/[<>]/g, "")
    .trim();
}

// In-memory rate limiting per serverless instance
const ipSubmissions = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 8;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = ipSubmissions.get(ip);
  if (!entry || now > entry.resetTime) {
    ipSubmissions.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }
  entry.count += 1;
  return true;
}

export default async function handler(req: any, res: any) {
  // Only allow POST
  if (req.method !== "POST") {
    if (res.setHeader) res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  // Origin / Referer validation against cross-site exploitation
  const origin = req.headers["origin"] as string | undefined;
  if (origin) {
    const isAllowedOrigin =
      origin.includes("ahmedbello.com") ||
      origin.includes("localhost") ||
      origin.includes("127.0.0.1") ||
      origin.includes(".aistudio-preview.net") ||
      origin.includes(".run.app") ||
      origin.includes(".vercel.app");
    if (!isAllowedOrigin) {
      return res.status(403).json({
        error: "forbidden",
        message: "Cross-origin submission rejected.",
      });
    }
  }

  // Client IP rate limiting
  const forwarded = req.headers["x-forwarded-for"];
  const clientIp = typeof forwarded === "string" ? forwarded.split(",")[0].trim() : req.socket?.remoteAddress || "unknown";

  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({
      error: "rate_limit_exceeded",
      message: "Too many submissions from this connection. Please try again in an hour.",
    });
  }

  // Parse body safely
  let rawBody = req.body;
  if (typeof rawBody === "string") {
    try {
      rawBody = JSON.parse(rawBody);
    } catch {
      return res.status(400).json({ error: "invalid_json", message: "Invalid JSON payload." });
    }
  }
  rawBody = rawBody || {};

  let firstName = sanitizeText(rawBody.firstName);
  const email = sanitizeText(rawBody.email);
  const phone = sanitizeText(rawBody.phone);
  let province = sanitizeText(rawBody.province);
  const topic = sanitizeText(rawBody.topic) || "general";
  const message = sanitizeMultiline(rawBody.message);
  const consentPrivacy = Boolean(rawBody.consentPrivacy);
  const consentEducational = Boolean(rawBody.consentEducational);
  const honeypot = sanitizeText(rawBody.honeypot);
  const formLoadedAt = Number(rawBody.formLoadedAt);

  // Honeypot check: silently drop bots
  if (honeypot && honeypot.length > 0) {
    return res.status(200).json({ success: true, notice: "processed" });
  }

  // Minimum fill time check (2 seconds) to thwart rapid automated bots
  if (formLoadedAt && !isNaN(formLoadedAt)) {
    const elapsed = Date.now() - formLoadedAt;
    if (elapsed < 2000) {
      return res.status(400).json({
        error: "automated_submission",
        message: "Submission was too fast. Please take your time to review.",
      });
    }
  }

  const isNewsletter = topic === "newsletter";
  if (isNewsletter && !firstName) {
    firstName = "Newsletter Subscriber";
  }
  if (isNewsletter && !province) {
    province = "National (Canada & US)";
  }

  // Validation
  const errors: Record<string, string> = {};
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

  const validProvinces = [
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
  if (!isNewsletter && (!province || !validProvinces.includes(province))) {
    errors.province = "Please select a valid province, state, or region.";
  }

  const validTopics = [
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
  if (!topic || !validTopics.includes(topic)) {
    errors.topic = "Please select a valid topic.";
  }

  if (message.length > 2500) {
    errors.message = "Message must not exceed 2,500 characters.";
  }

  if (!consentPrivacy) {
    errors.consentPrivacy = "You must accept the privacy notice before submitting.";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ error: "validation_failed", errors });
  }

  // Environment variables from Vercel Project Settings
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL || "enquiries@ahmedbello.com";
  const CONTACT_FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || "Ahmed Bello <enquiries@ahmedbello.com>";

  if (!RESEND_API_KEY) {
    return res.status(503).json({
      code: "not_configured",
      message: "The form is active, but RESEND_API_KEY has not yet been set in your Vercel Project Settings > Environment Variables.",
    });
  }

  const isMentorship = topic === "mentorship";
  let emailSubject = `New Financial Education Enquiry: ${topic} (${firstName})`;
  if (isNewsletter) {
    emailSubject = `New Mailing List Subscriber: ${email} (${firstName})`;
  } else if (isMentorship) {
    emailSubject = `New Agent Mentorship Application: ${firstName} (${province})`;
  }

  const emailBody = `
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
Origin: https://ahmedbello.com
  `.trim();

  const rawRecipients = CONTACT_TO_EMAIL.split(/[,;\s]+/)
    .map((e) => e.trim())
    .filter((e) => e.includes("@"));

  const primaryRecipient = rawRecipients[0] || "enquiries@ahmedbello.com";

  try {
    let resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: CONTACT_FROM_EMAIL,
        to: rawRecipients,
        reply_to: email,
        subject: emailSubject,
        text: emailBody,
      }),
    });

    // If sandbox mode requires sending only to the verified email
    if (!resendResponse.ok && rawRecipients.length > 1) {
      resendResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: CONTACT_FROM_EMAIL,
          to: [primaryRecipient],
          reply_to: email,
          subject: `${emailSubject} [For Ahmed & Team]`,
          text: `${emailBody}\n\nNote: Sent to primary inbox while domain verification is pending in Resend.`,
        }),
      });
    }

    if (!resendResponse.ok) {
      return res.status(502).json({
        error: "delivery_failed",
        message: "Your message could not be sent right now. Please reach out directly by email at enquiries@ahmedbello.com, call +1-506-899-4941, or schedule a conversation via Calendly.",
      });
    }

    // Send automatic confirmation receipt to the visitor
    try {
      const confirmationSubject = isNewsletter
        ? "Welcome to Intentional Wealth Briefing | Ahmed Bello"
        : `Confirmation: We received your enquiry | Ahmed Bello`;

      const confirmationBody = `Hello ${firstName},

Thank you for reaching out through ahmedbello.com. This automated receipt confirms that we have safely received your ${isNewsletter ? "subscription" : "message regarding " + topic}.

What happens next:
1. Personal Review: Ahmed Bello personally reviews every enquiry within 1 to 2 business days.
2. Direct, Educational Answer: You will receive an evidence-based response to your question—without high-pressure sales pitches or product pushes.
3. Next Steps: If your situation calls for a deeper conversation, we will share available times for a 20-minute introductory call.

If you would like to speak directly or reserve a spot right away:
• Schedule 20 minutes on Calendly: https://calendly.com/ahmedbello
• WhatsApp / Direct Phone: +1 (506) 899-4941
• Direct Email: enquiries@ahmedbello.com

Warm regards,
Ahmed Bello
Financial Security Advisor
Moncton, New Brunswick, Canada
https://ahmedbello.com`;

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: CONTACT_FROM_EMAIL,
          to: [email],
          subject: confirmationSubject,
          text: confirmationBody,
        }),
      });
    } catch {
      // Non-blocking: Enquiry was successfully saved/sent to advisor
    }

    return res.status(200).json({ success: true, message: isNewsletter ? "Subscribed successfully." : "Enquiry sent successfully." });
  } catch {
    return res.status(500).json({
      error: "server_error",
      message: "Your message could not be sent right now. Please reach out directly by email at enquiries@ahmedbello.com, call +1-506-899-4941, or schedule a conversation via Calendly.",
    });
  }
}
