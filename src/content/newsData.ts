export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  imageUrl?: string;
  link: string;
  pubDate: string;
  source: string;
  country: "CA" | "US";
  category: "rates" | "housing" | "tax" | "economy";
  keyTakeaway?: string;
}

export interface MacroIndicator {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  authority: string;
  lastUpdated: string;
}

export const MACRO_INDICATORS: MacroIndicator[] = [
  {
    label: "Bank of Canada Policy Rate",
    value: "2.50%",
    change: "Current Overnight Target",
    trend: "neutral",
    authority: "Bank of Canada",
    lastUpdated: "Official Benchmark",
  },
  {
    label: "US Fed Funds Target Range",
    value: "3.75% - 4.00%",
    change: "FOMC Policy Corridor",
    trend: "neutral",
    authority: "Federal Reserve",
    lastUpdated: "Official Benchmark",
  },
  {
    label: "Canada CPI Inflation",
    value: "2.0%",
    change: "Target Midpoint",
    trend: "neutral",
    authority: "Statistics Canada",
    lastUpdated: "Control Band (1% - 3%)",
  },
  {
    label: "5-Yr Fixed Mortgage Benchmark",
    value: "4.39%",
    change: "Competitive Tier",
    trend: "down",
    authority: "Major Canadian Lenders",
    lastUpdated: "Government Bond Linked",
  },
];

export const STATIC_NEWS: NewsItem[] = [
  {
    id: "boc-policy-decision-nov-2026",
    title: "Bank of Canada Holds Overnight Policy Rate at 2.50% Following Inflation Target Stabilization",
    excerpt: "The Governing Council maintained the policy rate at 2.50%, noting that core inflation metrics have consolidated firmly inside the 1% to 3% control range. Economic growth continues at a steady pace with consumer spending adjusting to current borrowing benchmarks.",
    imageUrl: "/images/news/boc_policy.jpg",
    link: "https://www.bankofcanada.ca/core-functions/monetary-policy/key-interest-rate/",
    pubDate: "2026-11-03T11:00:00Z",
    source: "Bank of Canada",
    country: "CA",
    category: "rates",
    keyTakeaway: "Prime lending rates and fixed mortgage benchmarks remain anchored, providing rate certainty for household budgeting.",
  },
  {
    id: "cra-annual-indexation-2026",
    title: "CRA Releases Official Indexation Parameters: Personal Tax Brackets, TFSA and RRSP Limits",
    excerpt: "The Canada Revenue Agency has confirmed annual indexation adjustments for personal tax brackets, non-refundable tax credits, and registered account limits. Eligible Canadians are encouraged to confirm available room on their CRA My Account.",
    imageUrl: "/images/news/cra_tax.jpg",
    link: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/frequently-asked-questions-individuals/adjustment-personal-income-tax-benefit-amounts.html",
    pubDate: "2026-11-02T14:30:00Z",
    source: "Canada Revenue Agency",
    country: "CA",
    category: "tax",
    keyTakeaway: "Check your personal Notice of Assessment before scheduling 2026 RRSP and TFSA lump-sum contributions to avoid overcontribution fees.",
  },
  {
    id: "cmhc-housing-market-assessment-nov",
    title: "Expanded $60,000 Home Buyers' Plan (HBP) and 30-Year Amortization Rules Shape Spring Real Estate Market",
    excerpt: "First-time purchasers across Canadian metropolitan centers are actively utilizing the increased $60,000 RRSP Home Buyers' Plan withdrawal ceiling alongside the FHSA to structure competitive down payments under newly expanded 30-year amortization guidelines.",
    imageUrl: "/images/news/housing_growth.jpg",
    link: "https://www.cmhc-schl.gc.ca/professionals/housing-markets-data-and-research",
    pubDate: "2026-11-02T10:15:00Z",
    source: "CMHC Canada",
    country: "CA",
    category: "housing",
    keyTakeaway: "Qualifying couples can mobilize up to $120,000 via HBP plus $80,000 via FHSA, subject to statutory 15-year RRSP repayment.",
  },
  {
    id: "statcan-cpi-inflation-benchmark",
    title: "Statistics Canada CPI Report: Annual Consumer Price Index Holds at 2.0% Benchmark",
    excerpt: "Consumer inflation printed at 2.0% year-over-year, supported by moderation in grocery price dynamics and balanced energy costs, aligning cleanly with the central bank's midpoint inflation target.",
    imageUrl: "/images/news/statcan_economy.jpg",
    link: "https://www150.statcan.gc.ca/n1/daily-quotidien/cpi-ipc-eng.htm",
    pubDate: "2026-11-01T13:30:00Z",
    source: "Statistics Canada",
    country: "CA",
    category: "economy",
    keyTakeaway: "Purchasing power erosion has stabilized, supporting real returns in diversified registered savings portfolios.",
  },
  {
    id: "fed-fomc-policy-statement-nov",
    title: "Federal Reserve FOMC Adopts Neutral Policy Stance with Benchmark Target Range at 3.75% to 4.00%",
    excerpt: "The Federal Open Market Committee maintained its policy corridor, emphasizing balanced risks between labour market equilibrium and long-term price stability. Cross-border capital flows and the CAD/USD exchange rate responded with minimal volatility.",
    imageUrl: "/images/news/boc_policy.jpg",
    link: "https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm",
    pubDate: "2026-10-31T18:00:00Z",
    source: "Federal Reserve",
    country: "US",
    category: "rates",
    keyTakeaway: "Cross-border investors and snowbirds should monitor foreign exchange conversion timing when repatriating US dividends.",
  },
  {
    id: "cpp-oas-payment-calendar-nov",
    title: "Federal Public Pension Update: CPP Second Earnings Ceiling (YAMPE) and OAS Recovery Tax Thresholds",
    excerpt: "Employment and Social Development Canada published updated public pension payout dates and earnings ceilings. High-earning seniors approaching age 65 are modeling deferral horizons to minimize Old Age Security recovery tax clawbacks.",
    imageUrl: "/images/news/cra_tax.jpg",
    link: "https://www.canada.ca/en/services/benefits/publicpensions/cpp/cpp-benefit/amount.html",
    pubDate: "2026-10-30T10:00:00Z",
    source: "Government of Canada",
    country: "CA",
    category: "tax",
    keyTakeaway: "Deferring CPP up to age 70 permanently enhances monthly payouts by 8.4% per year after age 65.",
  },
  {
    id: "cmhc-rental-construction-trends",
    title: "CMHC Housing Review: Purpose-Built Rental Completions Reach Multi-Year High in Major Metros",
    excerpt: "Canada Mortgage and Housing Corporation's latest report highlights an acceleration in multi-unit residential construction starts in Toronto, Montreal, Calgary, and Moncton, moderating prime rental price pressures.",
    imageUrl: "/images/news/housing_growth.jpg",
    link: "https://www.cmhc-schl.gc.ca/professionals/housing-markets-data-and-research",
    pubDate: "2026-10-29T14:00:00Z",
    source: "CMHC Canada",
    country: "CA",
    category: "housing",
    keyTakeaway: "Prospective home buyers should benchmark local rental yield parity against home ownership carrying costs before entering bidding markets.",
  },
  {
    id: "fcac-mortgage-protection-guidelines",
    title: "Financial Consumer Agency of Canada: Enhanced Mortgage Protection and Renewal Rights",
    excerpt: "The FCAC updated compliance expectations for federally regulated banks, requiring early notification windows (up to 6 months prior to maturity) and tailored relief options for Canadian mortgagors navigating renewals.",
    imageUrl: "/images/news/statcan_economy.jpg",
    link: "https://www.canada.ca/en/financial-consumer-agency.html",
    pubDate: "2026-10-28T12:00:00Z",
    source: "FCAC Canada",
    country: "CA",
    category: "rates",
    keyTakeaway: "Mortgage holders should initiate renewal shopping at least 4 to 6 months before term expiry to lock competitive rates.",
  },
];
