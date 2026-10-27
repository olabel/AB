// Dedicated Vercel Serverless Function for /api/subscribe
import contactHandler from "./contact.ts";

export default async function handler(req: any, res: any) {
  if (req.body && typeof req.body === "object") {
    req.body.topic = req.body.topic || "newsletter";
  }
  return contactHandler(req, res);
}
