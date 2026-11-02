// Vercel Serverless Function for /api/contact & newsletter subscriptions
// Handles contact enquiries, agent mentorship applications, and mailing list signups
import { processContactSubmission } from "../src/services/contactEmailService.ts";

export default async function handler(req: any, res: any) {
  // Handle OPTIONS preflight
  if (req.method === "OPTIONS") {
    const origin = (req.headers["origin"] as string) || "*";
    if (res.setHeader) {
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
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  // Origin / Referer validation against cross-site exploitation
  const origin = req.headers["origin"] as string | undefined;
  if (origin) {
    const isAllowedOrigin =
      origin === "null" ||
      origin === "" ||
      origin.includes("ahmedbello.com") ||
      origin.includes("localhost") ||
      origin.includes("127.0.0.1") ||
      origin.includes(".aistudio-preview.net") ||
      origin.includes(".run.app") ||
      origin.includes(".vercel.app") ||
      origin.includes("googleusercontent.com") ||
      origin.includes("aistudio.google.com") ||
      origin.includes("google.com");
    if (!isAllowedOrigin) {
      return res.status(403).json({
        error: "forbidden",
        message: "Cross-origin submission rejected.",
      });
    }
    if (res.setHeader) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    }
  }

  // Client IP extraction
  const forwarded = req.headers["x-forwarded-for"];
  const clientIp = typeof forwarded === "string" ? forwarded.split(",")[0].trim() : req.socket?.remoteAddress || "unknown";

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

  // Environment variables from Vercel Project Settings
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL || "enquiries@ahmedbello.com";
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
