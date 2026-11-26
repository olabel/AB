// Centralized, unified API Handlers shared identically by Express server (server.ts)
// and Vercel serverless functions (/api/*) to eliminate duplicated logic and drift.

import { Request, Response } from "express";
import { checkIpRateLimit, processContactSubmission, recordConfirmedSubscriber, verifySubscriptionToken } from "../services/contactEmailService.ts";
import { siteConfig } from "../config/site.ts";

/**
 * Strict Origin / Referer Validation:
 * Only exact production domains and trusted environment preview hosts are authorized.
 * Arbitrary incoming Host header matching is disallowed so spoofed Host + Origin headers cannot bypass.
 */
export function isOriginAuthorized(originOrReferer?: string, _reqHost?: string): boolean {
  if (!originOrReferer) return false;
  try {
    const parsed = new URL(originOrReferer);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return false;
    }
    const host = parsed.hostname.toLowerCase();

    // Exact authorized production domains (must use https in production)
    if (
      host === "ahmedbello.com" ||
      host === "www.ahmedbello.com" ||
      host === "intake.ahmedbello.com"
    ) {
      return parsed.protocol === "https:";
    }

    // Trusted deploy-injected preview URLs (exact equality only)
    const trustedEnvHosts = [process.env.VERCEL_URL, process.env.VERCEL_BRANCH_URL]
      .filter((v): v is string => Boolean(v && v.trim()))
      .map((v) => v.trim().toLowerCase().split(":")[0]);
    if (trustedEnvHosts.includes(host) && parsed.protocol === "https:") {
      return true;
    }

    // Local development hosts allowed only outside production
    if (process.env.NODE_ENV !== "production" && (host === "localhost" || host === "127.0.0.1")) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * Secure Client IP Resolution:
 * Prioritizes trusted edge headers in strict order:
 * 1. x-vercel-forwarded-for
 * 2. x-real-ip
 * 3. x-forwarded-for
 * Removes cf-connecting-ip.
 */
export function resolveClientIp(req: any): string {
  // 1. Vercel forwarded IP
  const vercelForwarded = req.headers?.["x-vercel-forwarded-for"];
  if (typeof vercelForwarded === "string" && vercelForwarded.trim()) {
    const parts = vercelForwarded.split(",").map((p) => p.trim()).filter(Boolean);
    if (parts.length > 0) return parts[parts.length - 1];
  }

  // 2. Vercel verified real IP
  const realIp = req.headers?.["x-real-ip"];
  if (typeof realIp === "string" && realIp.trim()) return realIp.trim();

  // 3. X-Forwarded-For: Take the LAST IP (added by the closest trusted proxy)
  const forwarded = req.headers?.["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.trim()) {
    const parts = forwarded.split(",").map((p) => p.trim()).filter(Boolean);
    if (parts.length > 0) return parts[parts.length - 1];
  }

  // 4. Express req.ip (when trust proxy is configured)
  if (req.ip && typeof req.ip === "string") return req.ip;

  return req.socket?.remoteAddress || "127.0.0.1";
}

/**
 * Cloudflare Turnstile Verification:
 * Validates human challenge tokens with Cloudflare's siteverify endpoint when configured.
 * Falls back cleanly when Turnstile keys are unset (relying on origin, honeypot, timing, and rate limits)
 * so an optional bot widget never silently rejects legitimate leads with HTTP 403.
 */
export async function verifyTurnstileToken(
  token: string,
  clientIp: string,
  reqHost?: string
): Promise<boolean> {
  const secretKey = (process.env.TURNSTILE_SECRET_KEY || "").trim();
  const siteKey = (process.env.VITE_TURNSTILE_SITE_KEY || "").trim();
  const cleanHost = (reqHost || "").split(":")[0].toLowerCase();
  const isProdDomain =
    cleanHost === "ahmedbello.com" ||
    cleanHost === "www.ahmedbello.com" ||
    cleanHost === "intake.ahmedbello.com";
  const isProdRuntime = process.env.NODE_ENV === "production" || isProdDomain;

  if (!secretKey) {
    console.warn(
      "[TURNSTILE CONFIG NOTICE]: TURNSTILE_SECRET_KEY is not configured; relying on origin, honeypot, fill-time, and IP rate-limit protections."
    );
    return true;
  }

  // Never accept sentinel bypass tokens in production when a secret key is active
  if (isProdRuntime) {
    if (!token || token === "verified_live_client") {
      return false;
    }
  } else if (token === "verified_live_client" && !siteKey) {
    // Non-production local/preview fallback when client site key isn't injected
    return true;
  }

  if (!token || token === "verified_live_client") return false;

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
        remoteip: clientIp,
      }),
    });
    if (!res.ok) return false;
    const outcome = (await res.json()) as any;
    if (!outcome?.success) return false;

    if (outcome?.hostname && isProdDomain) {
      const verifiedHost = String(outcome.hostname).toLowerCase();
      if (verifiedHost !== "ahmedbello.com" && verifiedHost !== "www.ahmedbello.com") {
        return false;
      }
    }
    return true;
  } catch (err) {
    console.error("[TURNSTILE VERIFY EXCEPTION]:", err);
    return false;
  }
}

/**
 * Unified Handler for /api/contact and /api/subscribe
 */
export async function handleContactSubmission(req: any, res: any) {
  const reqHost = req.get ? req.get("host") : req.headers?.["host"];
  const origin = req.headers?.["origin"] as string | undefined;
  const referer = req.headers?.["referer"] as string | undefined;

  // Handle OPTIONS preflight
  if (req.method === "OPTIONS") {
    if (origin && isOriginAuthorized(origin, reqHost)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
      res.setHeader("Access-Control-Max-Age", "86400");
    }
    return res.status(204).end();
  }

  // Only allow POST
  if (req.method !== "POST") {
    if (res.setHeader) res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method_not_allowed", message: "Method not allowed. Use POST." });
  }

  // Strict origin/referer check
  const isAuthorized =
    (origin && isOriginAuthorized(origin, reqHost)) ||
    (referer && isOriginAuthorized(referer, reqHost));

  if (!isAuthorized) {
    return res.status(403).json({
      error: "forbidden",
      message: "Cross-origin submission rejected. Submissions must originate directly from ahmedbello.com.",
    });
  }

  if (origin && isOriginAuthorized(origin, reqHost)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  }

  const clientIp = resolveClientIp(req);

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

  // Cloudflare Turnstile token validation
  const turnstileToken = rawBody.turnstileToken || rawBody["cf-turnstile-response"];
  const isHuman = await verifyTurnstileToken(turnstileToken, clientIp, reqHost);
  if (!isHuman) {
    return res.status(403).json({
      error: "captcha_failed",
      message: "Bot verification challenge was unsuccessful. Please refresh and try again.",
    });
  }

  if ((req.path === "/api/subscribe" || req.url?.includes("/api/subscribe")) && !rawBody.topic) {
    rawBody.topic = "newsletter";
  }

  const RESEND_API_KEY = (process.env.RESEND_API_KEY || "").trim() || undefined;
  const CONTACT_TO_EMAIL = (process.env.CONTACT_TO_EMAIL || "").trim();
  const CONTACT_FROM_EMAIL = (process.env.CONTACT_FROM_EMAIL || siteConfig.defaultFromEmail).trim();
  const hasSessionSecret = Boolean((process.env.SESSION_SECRET || process.env.TOKEN_SECRET || "").trim());
  const hasFirebaseAdminCreds = Boolean(
    (
      process.env.FIREBASE_SERVICE_ACCOUNT_KEY ||
      process.env.FIREBASE_ADMIN_CREDENTIALS ||
      process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON ||
      ""
    ).trim()
  );

  // Surface clear diagnostics in server/serverless logs for any missing delivery configuration
  if (!CONTACT_TO_EMAIL) {
    console.error(
      "[DELIVERY CONFIG ERROR]: CONTACT_TO_EMAIL is missing or empty. Enquiries cannot be routed; returning 500 service_unavailable."
    );
    return res.status(500).json({
      error: "service_unavailable",
      message: `Contact submission service is temporarily unavailable. Please schedule a meeting directly or call ${siteConfig.publicPhone}.`,
    });
  }

  if (!RESEND_API_KEY) {
    console.error(
      "[DELIVERY CONFIG WARNING]: RESEND_API_KEY is missing. Notification emails to Ahmed and confirmation emails to visitors will NOT be sent."
    );
  }

  if (!hasFirebaseAdminCreds) {
    console.warn(
      "[PERSISTENCE CONFIG WARNING]: FIREBASE_SERVICE_ACCOUNT_KEY is not configured. In serverless deployments, leads rely on Resend email delivery and ephemeral /tmp SQLite."
    );
  }

  if (rawBody.topic === "newsletter" && !hasSessionSecret) {
    console.warn(
      "[CASL CONFIG WARNING]: SESSION_SECRET is missing. Double opt-in newsletter confirmation tokens cannot be generated."
    );
  }

  const result = await processContactSubmission(
    rawBody,
    clientIp,
    RESEND_API_KEY,
    CONTACT_TO_EMAIL,
    CONTACT_FROM_EMAIL
  );

  return res.status(result.status).json(result.body);
}

/**
 * Unified Handler for /api/confirm-subscription (CASL Double Opt-in)
 */
export async function handleConfirmSubscription(req: any, res: any) {
  const reqHost = req.get ? req.get("host") : req.headers?.["host"];
  const origin = req.headers?.["origin"] as string | undefined;

  if (res.setHeader) {
    if (origin && isOriginAuthorized(origin, reqHost)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    }
  }

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "GET" && req.method !== "POST") {
    if (res.setHeader) res.setHeader("Allow", "GET, POST, OPTIONS");
    return res.status(405).json({
      success: false,
      error: "method_not_allowed",
      message: "Method not allowed.",
    });
  }

  const clientIp = resolveClientIp(req);
  if (!checkIpRateLimit(clientIp)) {
    return res.status(429).json({
      success: false,
      error: "rate_limit_exceeded",
      message: "Too many confirmation attempts. Please try again later.",
    });
  }

  // Extract token: reject naked unverified ?email= calls
  const rawToken = (req.query?.token as string) || req.body?.token;
  const token = typeof rawToken === "string" ? rawToken.trim() : "";

  if (!token) {
    return res.status(400).json({
      success: false,
      error: "missing_token",
      message: "A cryptographically signed confirmation token is required for CASL double opt-in.",
    });
  }

  const verification = verifySubscriptionToken(token);
  if (!verification.valid || !verification.email) {
    return res.status(400).json({
      success: false,
      error: verification.error || "invalid_token",
      message:
        "This confirmation link is invalid or has expired (48-hour limit). Please subscribe again to receive a fresh verification link.",
    });
  }

  const rawUa = typeof req.headers?.["user-agent"] === "string" ? req.headers["user-agent"] : "Unknown User-Agent";
  const userAgent = rawUa.replace(/[\r\n\0<>]/g, " ").trim().slice(0, 300) || "Unknown User-Agent";

  const recorded = await recordConfirmedSubscriber({
    email: verification.email,
    ip: clientIp,
    userAgent,
    source: "double_opt_in_signed_token",
  });

  if (!recorded) {
    console.error(`[SUBSCRIBER ERROR]: Failed to persist confirmed subscriber ${verification.email}`);
    return res.status(500).json({
      success: false,
      error: "persistence_failed",
      message: "Unable to record confirmed subscription. Please try again or contact us directly.",
    });
  }

  return res.json({
    success: true,
    confirmed: true,
    email: verification.email,
    confirmedAt: new Date().toISOString(),
  });
}
