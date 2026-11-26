import {
  getLatestFinancialNews,
  VERIFIED_CURRENT_NEWS,
  type NewsItem,
} from "../src/services/newsService.ts";

export type { NewsItem };
export const FALLBACK_NEWS = VERIFIED_CURRENT_NEWS;

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
  res.setHeader("Cache-Control", "public, s-maxage=900, stale-while-revalidate=1800");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD, OPTIONS");
    return res.status(405).json({ success: false, error: "method_not_allowed" });
  }

  try {
    const deduplicated = await getLatestFinancialNews();
    return res.status(200).json({
      success: true,
      count: deduplicated.length,
      lastUpdated: new Date().toISOString(),
      items: deduplicated,
    });
  } catch {
    return res.status(200).json({
      success: true,
      count: FALLBACK_NEWS.length,
      lastUpdated: new Date().toISOString(),
      items: FALLBACK_NEWS,
    });
  }
}
