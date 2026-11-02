export interface NewsItem {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  source: string;
  country: "CA" | "US";
  category: "rates" | "housing" | "tax" | "economy";
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
    id: "cbc-budget-affordability-measures",
    title: "Canada's Federal Budget to Detail Middle-Class Affordability, Business Tax Incentives and Infrastructure",
    link: "https://www.cbc.ca/news/politics/budget-carney-affordability-investments-9.7404193",
    pubDate: "2026-11-02T13:00:00Z",
    source: "CBC News",
    country: "CA",
    category: "economy",
  },
  {
    id: "alberta-benefits-schedule-nov",
    title: "Provincial and Federal Benefit Payment Schedules Issued for November 2026: CPP, OAS, CCB and Support Dates",
    link: "https://www.canada.ca/en/services/benefits/calendar.html",
    pubDate: "2026-11-02T10:30:00Z",
    source: "Government of Canada",
    country: "CA",
    category: "tax",
  },
  {
    id: "retirement-timing-cpp-oas-clawback",
    title: "Retirement Timing and Income Sequencing: Evaluating CPP Delay Against OAS Recovery Tax Thresholds",
    link: "https://www.canada.ca/en/services/benefits/publicpensions/cpp/cpp-benefit/amount.html",
    pubDate: "2026-10-31T14:00:00Z",
    source: "Financial Post",
    country: "CA",
    category: "rates",
  },
  {
    id: "tfsa-2026-room-guidance",
    title: "TFSA Statutory Rules: Verifying Contribution Ceilings and Avoiding Overcontribution Penalties",
    link: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/tax-free-savings-account.html",
    pubDate: "2026-10-31T11:00:00Z",
    source: "Canada Revenue Agency",
    country: "CA",
    category: "tax",
  },
  {
    id: "boc-policy-rate-decision",
    title: "Bank of Canada Sets Overnight Rate Target at 2.50% in Monetary Policy Announcement",
    link: "https://www.bankofcanada.ca/core-functions/monetary-policy/key-interest-rate/",
    pubDate: "2026-10-28T14:00:00Z",
    source: "Bank of Canada",
    country: "CA",
    category: "rates",
  },
  {
    id: "fed-fomc-policy-statement",
    title: "Federal Reserve Maintains Target Federal Funds Rate Range at 3.75% - 4.00%",
    link: "https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm",
    pubDate: "2026-10-27T18:00:00Z",
    source: "Federal Reserve",
    country: "US",
    category: "rates",
  },
  {
    id: "cra-tfsa-rrsp-indexation",
    title: "CRA Announces Annual Inflation Adjustments for Personal Income Tax Brackets, TFSA and RRSP Limits",
    link: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/frequently-asked-questions-individuals/adjustment-personal-income-tax-benefit-amounts.html",
    pubDate: "2026-10-25T13:30:00Z",
    source: "Canada Revenue Agency",
    country: "CA",
    category: "tax",
  },
  {
    id: "statcan-cpi-release",
    title: "Statistics Canada: Consumer Price Index Reflects 2.0% Inflation Target Alignment",
    link: "https://www150.statcan.gc.ca/n1/daily-quotidien/cpi-ipc-eng.htm",
    pubDate: "2026-10-24T12:30:00Z",
    source: "Statistics Canada",
    country: "CA",
    category: "economy",
  },
  {
    id: "fhsa-first-home-savings-rules",
    title: "First Home Savings Account (FHSA) Annual Contribution Reminders and Qualifying Withdrawal Rules",
    link: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/first-home-savings-account.html",
    pubDate: "2026-10-22T10:00:00Z",
    source: "Canada Revenue Agency",
    country: "CA",
    category: "housing",
  },
  {
    id: "us-treasury-yield-curve-rates",
    title: "US Department of the Treasury: Daily Benchmark Yield Curve and Long-Term Rates",
    link: "https://home.treasury.gov/resource-center/data-chart-center/interest-rates/TextView?type=daily_treasury_yield_curve",
    pubDate: "2026-10-21T20:00:00Z",
    source: "US Department of the Treasury",
    country: "US",
    category: "rates",
  },
  {
    id: "cmhc-housing-market-assessment",
    title: "CMHC Housing Market Assessment: Rental Vacancy and Construction Trends Across Major Metros",
    link: "https://www.cmhc-schl.gc.ca/professionals/housing-markets-data-and-research",
    pubDate: "2026-10-18T15:00:00Z",
    source: "CMHC Canada",
    country: "CA",
    category: "housing",
  },
  {
    id: "fcac-consumer-banking-rights",
    title: "Financial Consumer Agency of Canada: Mortgage Relief Guidelines and Consumer Banking Rights",
    link: "https://www.canada.ca/en/financial-consumer-agency.html",
    pubDate: "2026-10-16T13:00:00Z",
    source: "Financial Consumer Agency of Canada",
    country: "CA",
    category: "rates",
  },
  {
    id: "boc-financial-system-hub",
    title: "Bank of Canada Financial System Hub: Monitoring Household Debt and Liquidity Buffers",
    link: "https://www.bankofcanada.ca/core-functions/financial-system/",
    pubDate: "2026-10-14T14:30:00Z",
    source: "Bank of Canada",
    country: "CA",
    category: "economy",
  },
  {
    id: "statcan-labour-force-survey",
    title: "Statistics Canada Labour Force Survey: Employment Trends and Wage Growth Statistics",
    link: "https://www150.statcan.gc.ca/n1/daily-quotidien/lfs-epa-eng.htm",
    pubDate: "2026-10-11T12:30:00Z",
    source: "Statistics Canada",
    country: "CA",
    category: "economy",
  },
];
