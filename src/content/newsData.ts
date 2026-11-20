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
    change: "+25 bps (Oct 28, 2026)",
    trend: "up",
    authority: "Bank of Canada",
    lastUpdated: "Prime Rate 4.70%",
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
    value: "3.1%",
    change: "Oct 2026 YoY (Median 2.0%)",
    trend: "up",
    authority: "Statistics Canada",
    lastUpdated: "Nov 16, 2026 Release",
  },
  {
    label: "5-Yr Fixed Mortgage Benchmark",
    value: "4.39% - 4.59%",
    change: "Insured (Uninsured ~4.95%+)",
    trend: "neutral",
    authority: "Major Canadian Lenders",
    lastUpdated: "Government Bond Linked",
  },
];

export const STATIC_NEWS: NewsItem[] = [
  {
    id: "boc-policy-decision-nov-2026",
    title: "Bank of Canada Raises Overnight Policy Rate by 25 bps to 2.50%; Chartered Prime Moves to 4.70%",
    excerpt: "Following seven consecutive holds at 2.25% between January and September 2026, the Bank of Canada lifted the policy rate by 25 basis points to 2.50% on October 28, 2026, pushing prime rates up to 4.70% ahead of the December 9 decision.",
    imageUrl: "/images/news/boc_policy.jpg",
    link: "https://www.bankofcanada.ca/core-functions/monetary-policy/key-interest-rate/",
    pubDate: "2026-10-28T14:00:00Z",
    source: "Bank of Canada",
    country: "CA",
    category: "rates",
    keyTakeaway: "Variable-rate mortgages and HELOC balances now price off a 4.70% chartered bank prime rate ahead of December 9.",
  },
  {
    id: "cra-annual-indexation-2026",
    title: "CRA Releases 2027 Registered Limits: RRSP Ceiling Rises to $35,390, YMPE $76,700 & YAMPE $87,400",
    excerpt: "The Canada Revenue Agency published official 2027 contribution ceilings: the RRSP dollar limit climbs from $33,810 (2026) to $35,390 (2027), alongside a $76,700 YMPE and $87,400 YAMPE.",
    imageUrl: "/images/news/cra_tax.jpg",
    link: "https://www.canada.ca/en/revenue-agency/services/tax/registered-plans-administrators/pspa/mp-rrsp-dpsp-tfsa-limits-ympe.html",
    pubDate: "2026-11-06T14:30:00Z",
    source: "Canada Revenue Agency",
    country: "CA",
    category: "tax",
    keyTakeaway: "Verify your 2026 Notice of Assessment deduction room before funding, and monitor CRA's late-November 2027 TFSA indexation confirmation.",
  },
  {
    id: "cmhc-housing-market-assessment-nov",
    title: "Expanded $60,000 Home Buyers' Plan (HBP) and 30-Year Amortization Rules Shape Buyer Strategy",
    excerpt: "First-time purchasers across Canada continue combining the expanded $60,000 RRSP Home Buyers' Plan ceiling (with the 5-year repayment grace extended through Dec 31, 2028) alongside the $40,000 FHSA and 30-year amortization options.",
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
    title: "Statistics Canada CPI Report: October Headline Inflation Rises to 3.1% (BoC Core Median 2.0%)",
    excerpt: "Statistics Canada's November 16, 2026 release showed October headline CPI accelerating to 3.1% year-over-year, while the Bank of Canada's core CPI-median held at 2.0% and CPI-trim printed at 1.8%.",
    imageUrl: "/images/news/statcan_economy.jpg",
    link: "https://www150.statcan.gc.ca/n1/daily-quotidien/cpi-ipc-eng.htm",
    pubDate: "2026-11-16T13:30:00Z",
    source: "Statistics Canada",
    country: "CA",
    category: "economy",
    keyTakeaway: "Headline inflation moving above the 1% to 3% control range reinforces keeping idle cash in productive GICs, money-market funds, or tax-sheltered growth assets.",
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
    excerpt: "Canada Mortgage and Housing Corporation's latest report highlights an acceleration in multi-unit residential construction starts in Toronto, Montreal, Calgary, and Halifax, moderating prime rental price pressures.",
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
    excerpt: "The FCAC updated compliance expectations for federally regulated banks, requiring early notification windows (up to 6 months prior to maturity) and structured relief options for Canadian mortgagors preparing for mortgage renewals.",
    imageUrl: "/images/news/statcan_economy.jpg",
    link: "https://www.canada.ca/en/financial-consumer-agency.html",
    pubDate: "2026-10-28T12:00:00Z",
    source: "FCAC Canada",
    country: "CA",
    category: "rates",
    keyTakeaway: "Mortgage holders should initiate renewal shopping at least 4 to 6 months before term expiry to lock competitive rates.",
  },
];
