// Dedicated Vercel Serverless Function for /api/subscribe
import contactHandler from "./contact.ts";

export default async function handler(req: any, res: any) {
  if (typeof req.body === "string") {
    try {
      req.body = JSON.parse(req.body);
    } catch {
      return res.status(400).json({ success: false, message: "Invalid JSON payload." });
    }
  }
  if (req.body && typeof req.body === "object" && !Array.isArray(req.body)) {
    req.body.topic = req.body.topic || "newsletter";
  }
  return contactHandler(req, res);
}
