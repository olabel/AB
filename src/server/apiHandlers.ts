// Centralized, unified API Handlers shared identically by Express server (server.ts)
// and Vercel serverless functions (/api/*) to eliminate duplicated logic and drift.

import { Request, Response } from "express";
import {
  processContactSubmission,
  recordConfirmedSubscriber,
  verifySubscriptionToken,
} from "../services/contactEmailService.ts";

/**
 * Strict Origin / Referer Validation:
 * Only exact production domains and direct host header matches are authorized.
 * Wildcard subdomains (*.vercel.app, *.run.app, *.web.app) are strictly rejected.
 */
export function isOriginAuthorized(originOrReferer?: string, reqHost?: string): boolean {
  if (!originOrReferer) return false;
  try {
    const parsed = new URL(originOrReferer);
    const host = parsed.hostname.toLowerCase();

    // Exact authorized production domains
    if (host === "ahmedbello.com" || host === "www.ahmedbello.com") return true;
    if (host === "localhost" || host === "127.0.0.1") return true;

    // Direct match against incoming host header (for specific preview or custom host)
    if (reqHost) {
      const cleanReqHost = reqHost.split(":")[0].toLowerCase();
      if (host === cleanReqHost) return true;
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
 * Validates human challenge tokens with Cloudflare's siteverify endpoint.
 * Fails closed on error or invalid response.
 */
export async function verifyTurnstileToken(token: string, clientIp: string): Promise<boolean> {
  const secretKey = (process.env.TURNSTILE_SECRET_KEY || "").trim();
  // Fail closed if no secret key configured in production
  if (!secretKey) {
    if (process.env.NODE_ENV === "production") {
      console.error("[TURNSTILE ERROR]: TURNSTILE_SECRET_KEY missing in production environment.");
      return false;
    }
    return true; // Local developer fallback
  }
  if (!token) return false;

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
    const outcome = (await res.json()) as any;
    return Boolean(outcome?.success);
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
  if (process.env.TURNSTILE_SECRET_KEY) {
    const isHuman = await verifyTurnstileToken(turnstileToken, clientIp);
    if (!isHuman) {
      return res.status(403).json({
        error: "captcha_failed",
        message: "Bot verification challenge was unsuccessful. Please refresh and try again.",
      });
    }
  }

  if ((req.path === "/api/subscribe" || req.url?.includes("/api/subscribe")) && !rawBody.topic) {
    rawBody.topic = "newsletter";
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const CONTACT_TO_EMAIL = (process.env.CONTACT_TO_EMAIL || "").trim();

  // Fail closed if CONTACT_TO_EMAIL is unconfigured
  if (!CONTACT_TO_EMAIL) {
    console.error("[CONFIG ERROR]: CONTACT_TO_EMAIL environment variable is missing or empty.");
    return res.status(500).json({
      error: "service_unavailable",
      message: "Contact submission service is temporarily unavailable. Please schedule a meeting directly or call +1-506-899-4941.",
    });
  }

  const CONTACT_FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || "Ahmed Bello <enquiries@ahmedbello.com>";

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
  if (res.setHeader) {
    res.setHeader("Access-Control-Allow-Origin", "https://www.ahmedbello.com");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  }

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // Extract token: reject naked unverified ?email= calls
  const token = (req.query?.token as string) || req.body?.token;

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

  const clientIp = resolveClientIp(req);
  const userAgent = (req.headers?.["user-agent"] as string) || "Unknown User-Agent";

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
