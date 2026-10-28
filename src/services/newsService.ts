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

let cachedNews: NewsItem[] | null = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

function fetchHttps(url: string, timeoutMs = 6000): Promise<string> {
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

  for (const block of itemMatches.slice(0, 12)) {
    const titleMatch = block.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i);
    const linkMatch = block.match(/<link>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/i);
    const dateMatch = block.match(/<pubDate>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/pubDate>/i);
    const descMatch = block.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/i);
    const sourceMatch = block.match(/<source[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/source>/i);

    let title = (titleMatch ? titleMatch[1] : "").replace(/<[^>]+>/g, "").trim();
    let link = (linkMatch ? linkMatch[1] : "").trim();
    let pubDate = (dateMatch ? dateMatch[1] : "").trim();
    let summary = (descMatch ? descMatch[1] : "")
      .replace(/<[^>]+>/g, "")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim();

    let source = (sourceMatch ? sourceMatch[1] : defaultSource).trim();

    // Clean Google News title prefix/suffix if present
    if (title.includes(" - ")) {
      const parts = title.split(" - ");
      if (parts.length > 1 && !sourceMatch) {
        source = parts[parts.length - 1].trim();
      }
    }

    if (title && link) {
      const lower = (title + " " + summary).toLowerCase();

      // Categorize
      let category: "rates" | "housing" | "tax" | "economy" = "economy";
      if (
        lower.includes("rate") ||
        lower.includes("overnight") ||
        lower.includes("monetary policy") ||
        lower.includes("interest") ||
        lower.includes("fomc") ||
        lower.includes("hike") ||
        lower.includes("cut")
      ) {
        category = "rates";
      } else if (
        lower.includes("mortgage") ||
        lower.includes("housing") ||
        lower.includes("home buyer") ||
        lower.includes("real estate")
      ) {
        category = "housing";
      } else if (
        lower.includes("tax") ||
        lower.includes("cra") ||
        lower.includes("capital gains") ||
        lower.includes("tfsa") ||
        lower.includes("rrsp") ||
        lower.includes("irs")
      ) {
        category = "tax";
      }

      // Assign strategic related guide
      let relatedGuide: { slug: string; title: string } | undefined;
      if (lower.includes("mortgage") || lower.includes("rate") || lower.includes("interest")) {
        relatedGuide = {
          slug: "canadian-mortgage-renewal-shock-liquidity-trap",
          title: "The Canadian Mortgage Renewal Shock & Liquidity Trap",
        };
      } else if (lower.includes("tax") || lower.includes("capital gain") || lower.includes("estate")) {
        relatedGuide = {
          slug: "canadian-capital-gains-deemed-disposition-estate-trap",
          title: "Canada 66.7% Capital Gains & Deemed Disposition at Death",
        };
      } else if (lower.includes("home") || lower.includes("first-time")) {
        relatedGuide = {
          slug: "fhsa-explained",
          title: "The FHSA Explained & HBP Pairing",
        };
      } else if (lower.includes("doctor") || lower.includes("nurse") || lower.includes("immigrant") || lower.includes("newcomer")) {
        relatedGuide = {
          slug: "internationally-trained-doctors-nurses-first-year",
          title: "Internationally Trained Doctors & Nurses First Year",
        };
      }

      let parsedDate: string;
      try {
        parsedDate = pubDate ? new Date(pubDate).toISOString() : new Date().toISOString();
      } catch {
        parsedDate = new Date().toISOString();
      }

      items.push({
        id: Buffer.from(title.slice(0, 40)).toString("base64").replace(/[^a-zA-Z0-9]/g, "").slice(0, 16),
        title,
        link,
        pubDate: parsedDate,
        source,
        summary: summary.slice(0, 220) + (summary.length > 220 ? "..." : ""),
        country: defaultCountry,
        category,
        relatedGuide,
      });
    }
  }

  return items;
}

const FALLBACK_NEWS: NewsItem[] = [
  {
    id: "boc-rate-policy-2026",
    title: "Bank of Canada Releases Policy Interest Rate Announcement & Monetary Policy Report",
    link: "https://www.bankofcanada.ca/core-functions/monetary-policy/key-interest-rate/",
    pubDate: new Date().toISOString(),
    source: "Bank of Canada",
    summary:
      "The Bank of Canada announces its target for the overnight rate, setting the baseline for variable mortgages, prime lending rates, and personal savings yields across Canadian financial institutions.",
    country: "CA",
    category: "rates",
    relatedGuide: {
      slug: "canadian-mortgage-renewal-shock-liquidity-trap",
      title: "The Canadian Mortgage Renewal Shock & Liquidity Trap",
    },
  },
  {
    id: "fed-fomc-policy-statement",
    title: "Federal Reserve Issues FOMC Monetary Policy Statement & Economic Projections",
    link: "https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm",
    pubDate: new Date(Date.now() - 3600000).toISOString(),
    source: "Federal Reserve Board",
    summary:
      "The Federal Open Market Committee provides guidance on federal funds target ranges, balance sheet adjustments, and US inflationary measures impacting cross-border exchange rates.",
    country: "US",
    category: "rates",
  },
  {
    id: "cra-limits-indexation",
    title: "Canada Revenue Agency Updates Registered Account Contribution Limits and Tax Brackets",
    link: "https://www.canada.ca/en/revenue-agency/services/tax/registered-plans-administrators/pspa/mp-rrsp-dpsp-tfsa-limits-ympe.html",
    pubDate: new Date(Date.now() - 7200000).toISOString(),
    source: "Canada Revenue Agency",
    summary:
      "CRA issues annual indexation adjustments for the Tax-Free Savings Account (TFSA), Registered Retirement Savings Plan (RRSP), and federal personal income tax thresholds.",
    country: "CA",
    category: "tax",
    relatedGuide: {
      slug: "tfsa-vs-rrsp",
      title: "TFSA vs RRSP: How to Choose Which to Fund First",
    },
  },
  {
    id: "mortgage-renewal-osfi-updates",
    title: "Canadian Banking Regulators Issue Updated Mortgage Capital Guidelines for Renewals",
    link: "https://www.osfi-bsif.gc.ca/",
    pubDate: new Date(Date.now() - 10800000).toISOString(),
    source: "Office of the Superintendent of Financial Institutions",
    summary:
      "OSFI reviews qualifying mortgage stress test frameworks and consumer liquidity buffers as Canadian homeowners navigate 5-year fixed and variable renewal cycles.",
    country: "CA",
    category: "housing",
    relatedGuide: {
      slug: "canadian-mortgage-renewal-shock-liquidity-trap",
      title: "The Canadian Mortgage Renewal Shock & Liquidity Trap",
    },
  },
];

export async function getLatestFinancialNews(): Promise<NewsItem[]> {
  const now = Date.now();
  if (cachedNews && now - lastFetchTime < CACHE_TTL_MS && cachedNews.length > 0) {
    return cachedNews;
  }

  const feedConfigs = [
    {
      url: "https://news.google.com/rss/search?q=Bank+of+Canada+interest+rate+OR+monetary+policy&hl=en-CA&gl=CA&ceid=CA:en",
      source: "Bank of Canada News",
      country: "CA" as const,
    },
    {
      url: "https://www.federalreserve.gov/feeds/press_monetary.xml",
      source: "Federal Reserve",
      country: "US" as const,
    },
    {
      url: "https://news.google.com/rss/search?q=Federal+Reserve+interest+rates+OR+Treasury+inflation&hl=en-US&gl=US&ceid=US:en",
      source: "US Financial News",
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
  for (const res of results) {
    if (res.status === "fulfilled" && Array.isArray(res.value)) {
      aggregated.push(...res.value);
    }
  }

  // Deduplicate by normalized title
  const seenTitles = new Set<string>();
  const deduplicated: NewsItem[] = [];

  for (const item of aggregated) {
    const key = item.title.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 30);
    if (!seenTitles.has(key)) {
      seenTitles.add(key);
      deduplicated.push(item);
    }
  }

  if (deduplicated.length >= 3) {
    // Sort by publication date descending
    deduplicated.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
    cachedNews = deduplicated;
    lastFetchTime = now;
    return deduplicated;
  }

  // If network feeds were sparse or blocked, merge with fallbacks
  const merged = [...deduplicated, ...FALLBACK_NEWS];
  cachedNews = merged;
  lastFetchTime = now;
  return merged;
}
