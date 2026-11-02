// Vercel Serverless Function for /api/confirm-subscription
import { recordConfirmedSubscriber } from "../src/services/contactEmailService.ts";

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  const email = (req.query?.email as string) || req.body?.email || "";
  if (!email || !email.includes("@")) {
    return res.status(400).json({ success: false, error: "invalid_email" });
  }

  recordConfirmedSubscriber(email);

  return res.status(200).json({
    success: true,
    confirmed: true,
    email: email.trim().toLowerCase(),
    confirmedAt: new Date().toISOString(),
  });
}
