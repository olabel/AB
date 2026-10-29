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
    value: "3.75%",
    change: "-50 bps",
    trend: "down",
    authority: "Bank of Canada",
    lastUpdated: "Current Policy Target",
  },
  {
    label: "US Fed Funds Rate",
    value: "4.50% – 4.75%",
    change: "-25 bps",
    trend: "down",
    authority: "Federal Reserve",
    lastUpdated: "FOMC Range",
  },
  {
    label: "Canada CPI Inflation",
    value: "2.0%",
    change: "Target Midpoint",
    trend: "neutral",
    authority: "Statistics Canada",
    lastUpdated: "Control Band (1-3%)",
  },
  {
    label: "5-Yr Fixed Mortgage Benchmark",
    value: "4.39%",
    change: "Competitive Tier",
    trend: "down",
    authority: "Major Canadian Lenders",
    lastUpdated: "Bond Yield Tracked",
  },
];

export const STATIC_NEWS: NewsItem[] = [
  {
    id: "boc-rate-decision-2026",
    title: "Bank of Canada Lowers Target Overnight Rate to 3.75% to Support Economic Growth",
    link: "https://www.bankofcanada.ca/core-functions/monetary-policy/key-interest-rate/",
    pubDate: "2026-10-28T14:00:00Z",
    source: "Bank of Canada",
    summary:
      "The Bank of Canada reduced its key policy interest rate by 50 basis points to 3.75%, noting headline CPI inflation has returned to the 2% control target and economic capacity warrants monetary easing.",
    country: "CA",
    category: "rates",
    relatedGuide: {
      slug: "canadian-mortgage-renewal-shock-liquidity-trap",
      title: "Mortgage Renewal Shock: How Rate Moves Impact Your Household Budget",
    },
  },
  {
    id: "fed-fomc-policy-statement",
    title: "Federal Reserve Reduces Benchmark Interest Rate by 25 Basis Points",
    link: "https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm",
    pubDate: "2026-10-27T18:00:00Z",
    source: "Federal Reserve",
    summary:
      "The Federal Open Market Committee (FOMC) lowered its target federal funds rate range to 4.50%-4.75%, emphasizing that risks to achieving statutory employment and inflation goals are roughly in balance.",
    country: "US",
    category: "rates",
    relatedGuide: {
      slug: "income-depends-on-you",
      title: "Protecting Your Primary Asset: Why Income Protection Precedes Investing",
    },
  },
  {
    id: "cra-tfsa-limit-index",
    title: "CRA Announces Indexed 2026 TFSA Contribution Limit and Income Bracket Thresholds",
    link: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/frequently-asked-questions-individuals/adjustment-personal-income-tax-benefit-amounts.html",
    pubDate: "2026-10-25T13:30:00Z",
    source: "Canada Revenue Agency",
    summary:
      "The Canada Revenue Agency confirmed that annual TFSA dollar contribution room remains indexed to inflation, while personal income tax bracket brackets increase to offset inflationary bracket creep for Canadian earners.",
    country: "CA",
    category: "tax",
    relatedGuide: {
      slug: "tfsa-vs-rrsp",
      title: "TFSA vs RRSP: How to Choose Based on Your Income and Tax Bracket",
    },
  },
  {
    id: "statcan-cpi-october",
    title: "Statistics Canada: Consumer Price Index Reflects Easing Shelter & Transportation Costs",
    link: "https://www150.statcan.gc.ca/n1/daily-quotidien/cpi-ipc-eng.htm",
    pubDate: "2026-10-24T12:30:00Z",
    source: "Statistics Canada",
    summary:
      "Annual headline inflation measured 2.0% in the latest Consumer Price Index release, held within the Bank of Canada's 1% to 3% control range driven by decelerating gasoline prices and moderate shelter increases.",
    country: "CA",
    category: "economy",
    relatedGuide: {
      slug: "savings-or-debt-first",
      title: "Should You Pay Off Debt or Save First? A Decision Framework",
    },
  },
  {
    id: "fhsa-first-time-buyers-2026",
    title: "First Home Savings Account (FHSA): Maximizing Annual $8,000 Room Before Year-End",
    link: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/first-home-savings-account.html",
    pubDate: "2026-10-22T10:00:00Z",
    source: "Canada Revenue Agency",
    summary:
      "Canadians saving toward a first home purchase can combine the $8,000 annual FHSA tax deduction with the federal Home Buyers' Plan (HBP) for up to $75,000 in qualifying tax-free down payment capital.",
    country: "CA",
    category: "housing",
    relatedGuide: {
      slug: "fhsa-with-the-home-buyers-plan",
      title: "Combining the FHSA and Home Buyers' Plan for Maximum Down Payment Power",
    },
  },
  {
    id: "us-treasury-yield-movement",
    title: "US Treasury 10-Year Benchmark Yield Stabilizes Around 4.20% Amid Policy Easing",
    link: "https://home.treasury.gov/resource-center/data-chart-center/interest-rates/TextView?type=daily_treasury_yield_curve",
    pubDate: "2026-10-21T20:00:00Z",
    source: "US Department of the Treasury",
    summary:
      "Sovereign bond market movements continue to set the benchmark for cross-border capital flows and long-term fixed borrowing rates across North American financial institutions.",
    country: "US",
    category: "rates",
    relatedGuide: {
      slug: "term-vs-permanent-life-insurance",
      title: "Term vs Permanent Life Insurance: How to Choose in Canada",
    },
  },
  {
    id: "cmhc-housing-supply-report",
    title: "CMHC Housing Market Assessment: Rental Vacancy and Construction Trends Across Major Metros",
    link: "https://www.cmhc-schl.gc.ca/professionals/housing-markets-data-and-research",
    pubDate: "2026-10-18T15:00:00Z",
    source: "CMHC Canada",
    summary:
      "Canada Mortgage and Housing Corporation (CMHC) analyzes new housing starts, purpose-built rental completions, and municipal approval velocity across Vancouver, Toronto, Calgary, and Atlantic Canada.",
    country: "CA",
    category: "housing",
    relatedGuide: {
      slug: "fhsa-with-the-home-buyers-plan",
      title: "Combining the FHSA and Home Buyers' Plan for Maximum Down Payment Power",
    },
  },
  {
    id: "doctors-nurses-licensing-money",
    title: "Provincial Health Authorities Announce Streamlined Credentialing & Retention Grants",
    link: "https://www.canada.ca/en/health-canada.html",
    pubDate: "2026-10-15T11:00:00Z",
    source: "Health Canada / Provincial Healthcare",
    summary:
      "New provincial assessment fast-tracks and clinical assistant licensing paths allow internationally trained physicians and registered nurses to accelerate practice establishment in Canada.",
    country: "CA",
    category: "economy",
    relatedGuide: {
      slug: "internationally-trained-doctors-nurses-first-year",
      title: "Internationally Trained Doctors and Nurses: First-Year Canadian Financial Roadmap",
    },
  },
];
