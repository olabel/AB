let aggregatedStats = {
  totalViews: 0,
  uniqueSessions: 0,
  topPaths: {} as Record<string, number>,
  topEvents: {} as Record<string, number>,
  lastUpdated: new Date().toISOString(),
};

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method === "GET") {
    return res.status(200).json(aggregatedStats);
  }

  if (req.method === "POST") {
    try {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      const { name, path } = body || {};

      if (name === "page_view") {
        aggregatedStats.totalViews++;
        if (typeof path === "string") {
          const cleanPath = path.slice(0, 80);
          aggregatedStats.topPaths[cleanPath] = (aggregatedStats.topPaths[cleanPath] || 0) + 1;
        }
      }

      if (typeof name === "string") {
        aggregatedStats.topEvents[name] = (aggregatedStats.topEvents[name] || 0) + 1;
      }

      aggregatedStats.lastUpdated = new Date().toISOString();
      return res.status(200).json({ ok: true });
    } catch {
      return res.status(400).json({ error: "invalid_payload" });
    }
  }

  return res.status(405).json({ error: "method_not_allowed" });
}
