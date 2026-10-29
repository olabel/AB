import https from "https";

export interface NewsItem {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  source: string;
  summary: string;
  country: "CA" | "US";
  category: "rates" | "housing" | "tax" | "economy";
  relatedGuide?: {
    slug: string;
    title: string;
  };
}

export const FALLBACK_NEWS: NewsItem[] = [
  {
    id: "boc-policy-rate-current",
    title: "Bank of Canada Policy Interest Rate Announcement & Monetary Policy Report",
    link: "https://www.bankofcanada.ca/core-functions/monetary-policy/key-interest-rate/",
    pubDate: "2026-10-28T14:00:00Z",
    source: "Bank of Canada",
    summary:
      "The Bank of Canada continues to adjust its target for the overnight rate to maintain inflation within the 1 to 3 percent control band, balancing housing affordability, consumer debt serviceability, and economic growth.",
    country: "CA",
    category: "rates",
    relatedGuide: {
      slug: "canadian-mortgage-renewal-shock-liquidity-trap",
      title: "Mortgage Renewal Shock: How Rate Moves Impact Your Household Budget",
    },
  },
  {
    id: "fed-fomc-decision",
    title: "Federal Reserve Issues FOMC Policy Statement on Target Federal Funds Rate",
    link: "https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm",
    pubDate: "2026-10-27T18:00:00Z",
    source: "Federal Reserve",
    summary:
      "The Federal Open Market Committee (FOMC) reaffirms its statutory dual mandate of maximum employment and price stability, reviewing labor market indicators and Treasury yield curve movements.",
    country: "US",
    category: "rates",
    relatedGuide: {
      slug: "income-depends-on-you",
      title: "Protecting Your Primary Asset: Why Income Protection Precedes Investing",
    },
  },
  {
    id: "cra-tax-brackets-inflation",
    title: "CRA Releases Annual Inflation Adjustments for Personal Income Tax Brackets & RRSP Limits",
    link: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/frequently-asked-questions-individuals/adjustment-personal-income-tax-benefit-amounts.html",
    pubDate: "2026-10-25T13:30:00Z",
    source: "Canada Revenue Agency",
    summary:
      "The Canada Revenue Agency announces indexed thresholds for federal personal income tax brackets, maximum RRSP dollar limits, and annual TFSA contribution room indexed to the Consumer Price Index (CPI).",
    country: "CA",
    category: "tax",
    relatedGuide: {
      slug: "tfsa-vs-rrsp",
      title: "TFSA vs RRSP: How to Choose Based on Your Income and Tax Bracket",
    },
  },
  {
    id: "statcan-cpi-inflation",
    title: "Statistics Canada Releases Latest Consumer Price Index (CPI) Inflation Metrics",
    link: "https://www150.statcan.gc.ca/n1/daily-quotidien/cpi-ipc-eng.htm",
    pubDate: "2026-10-24T12:30:00Z",
    source: "Statistics Canada",
    summary:
      "Headline CPI inflation tracks shelter costs, grocery prices, and transportation indices, providing the empirical foundation for upcoming central bank interest rate trajectories.",
    country: "CA",
    category: "economy",
    relatedGuide: {
      slug: "savings-or-debt-first",
      title: "Should You Pay Off Debt or Save First? A Decision Framework",
    },
  },
  {
    id: "fhsa-first-time-homebuyers",
    title: "First Home Savings Account (FHSA) Contribution Reminders Before Calendar Year-End",
    link: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/first-home-savings-account.html",
    pubDate: "2026-10-22T10:00:00Z",
    source: "Canada Revenue Agency",
    summary:
      "Prospective first-time home buyers in Canada can contribute up to $8,000 annually into a tax-deductible FHSA, pairing with the Home Buyers' Plan (HBP) for up to $75,000 in qualifying tax-free withdrawals.",
    country: "CA",
    category: "housing",
    relatedGuide: {
      slug: "fhsa-with-the-home-buyers-plan",
      title: "Combining the FHSA and Home Buyers' Plan for Maximum Down Payment Power",
    },
  },
  {
    id: "us-treasury-yield-curve",
    title: "US Department of the Treasury Releases Daily Benchmark Yield Curve Rates",
    link: "https://home.treasury.gov/resource-center/data-chart-center/interest-rates/TextView?type=daily_treasury_yield_curve",
    pubDate: "2026-10-21T20:00:00Z",
    source: "US Department of the Treasury",
    summary:
      "Yield curve dynamics between the 2-year and 10-year Treasury notes continue to influence North American fixed mortgage pricing and institutional borrowing costs.",
    country: "US",
    category: "rates",
    relatedGuide: {
      slug: "term-vs-permanent-life-insurance",
      title: "Term vs Permanent Life Insurance: How to Choose in Canada",
    },
  },
];

function fetchHttps(url: string, timeoutMs = 4000): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const req = https.get(
        url,
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            Accept: "application/rss+xml, application/xml, text/xml, */*",
          },
        },
        (res) => {
          let data = "";
          res.on("data", (chunk) => (data += chunk));
          res.on("end", () => resolve(data));
        }
      );
      req.on("error", reject);
      req.setTimeout(timeoutMs, () => {
        req.destroy();
        reject(new Error(`Timeout fetching ${url}`));
      });
    } catch (e) {
      reject(e);
    }
  });
}

function parseRss(xml: string, defaultSource: string, defaultCountry: "CA" | "US"): NewsItem[] {
  const items: NewsItem[] = [];
  const itemMatches = xml.match(/<item[\s\S]*?<\/item>/gi) || [];

  for (const block of itemMatches.slice(0, 8)) {
    const titleMatch = block.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i);
    const linkMatch = block.match(/<link>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/i);
    const dateMatch = block.match(/<pubDate>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/pubDate>/i);
    const descMatch = block.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/i);

    if (titleMatch && titleMatch[1]) {
      const rawTitle = titleMatch[1].replace(/<[^>]+>/g, "").trim();
      const rawLink = linkMatch ? linkMatch[1].trim() : "";
      const rawDate = dateMatch ? dateMatch[1].trim() : new Date().toISOString();
      const rawSummary = descMatch
        ? descMatch[1]
            .replace(/<[^>]+>/g, "")
            .replace(/&nbsp;/g, " ")
            .replace(/&amp;/g, "&")
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .trim()
            .slice(0, 260)
        : "";

      const lower = rawTitle.toLowerCase();
      let category: "rates" | "housing" | "tax" | "economy" = "economy";
      if (lower.includes("rate") || lower.includes("interest") || lower.includes("mortgage") || lower.includes("cut") || lower.includes("hike")) {
        category = "rates";
      } else if (lower.includes("home") || lower.includes("house") || lower.includes("housing") || lower.includes("property")) {
        category = "housing";
      } else if (lower.includes("tax") || lower.includes("cra") || lower.includes("irs") || lower.includes("rrsp") || lower.includes("tfsa")) {
        category = "tax";
      }

      items.push({
        id: `news-${Buffer.from(rawTitle).toString("base64").slice(0, 16)}`,
        title: rawTitle,
        link: rawLink || "https://www.bankofcanada.ca",
        pubDate: rawDate,
        source: defaultSource,
        summary: rawSummary || "Official institutional reporting on macroeconomic monetary policy and household finance.",
        country: defaultCountry,
        category,
      });
    }
  }

  return items;
}

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
  res.setHeader("Cache-Control", "public, s-maxage=900, stale-while-revalidate=1800");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  try {
    const feedConfigs = [
      {
        url: "https://www.bankofcanada.ca/valet/lists/rss/press_releases",
        source: "Bank of Canada",
        country: "CA" as const,
      },
      {
        url: "https://www.federalreserve.gov/feeds/press_monetary.xml",
        source: "Federal Reserve",
        country: "US" as const,
      },
      {
        url: "https://www.cbc.ca/cmlink/rss-business",
        source: "CBC Business",
        country: "CA" as const,
      },
    ];

    const results = await Promise.allSettled(
      feedConfigs.map(async (cfg) => {
        const xml = await fetchHttps(cfg.url);
        return parseRss(xml, cfg.source, cfg.country);
      })
    );

    const aggregated: NewsItem[] = [];
    for (const r of results) {
      if (r.status === "fulfilled" && Array.isArray(r.value)) {
        aggregated.push(...r.value);
      }
    }

    const seen = new Set<string>();
    const deduplicated: NewsItem[] = [];
    for (const item of aggregated) {
      const key = item.title.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 30);
      if (!seen.has(key)) {
        seen.add(key);
        deduplicated.push(item);
      }
    }

    const items = deduplicated.length >= 3 ? deduplicated : [...deduplicated, ...FALLBACK_NEWS];

    return res.status(200).json({
      success: true,
      count: items.length,
      lastUpdated: new Date().toISOString(),
      items,
    });
  } catch (err: any) {
    return res.status(200).json({
      success: true,
      count: FALLBACK_NEWS.length,
      lastUpdated: new Date().toISOString(),
      items: FALLBACK_NEWS,
    });
  }
}
