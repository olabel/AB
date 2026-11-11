/**
 * Federal Tax and Alternative Minimum Tax (AMT) Parameters
 *
 * All rates, thresholds, and limits are centrally configured with their tax year,
 * official statutory source URL, and a TODO_VERIFY flag for independent audit.
 *
 * SOURCES:
 * - Canada Revenue Agency / Department of Finance Canada:
 *   https://www.canada.ca/en/department-finance/news/2023/08/alternative-minimum-tax-for-high-income-individuals.html
 * - Income Tax Act (R.S.C., 1985, c. 1 (5th Supp.)), Sections 127.5 to 127.55 and Section 120.2:
 *   https://laws-lois.justice.gc.ca/eng/acts/I-3.3/page-145.html#h-308552
 * - Bill C-59 (Statutes of Canada 2024, c. 15, Royal Assent June 20, 2024):
 *   https://www.parl.ca/DocumentViewer/en/44-1/bill/C-59/royal-assent
 * - CRA Indexation Guidelines for Personal Income Tax (2024 & 2025):
 *   https://www.canada.ca/en/revenue-agency/services/tax/individuals/frequently-asked-questions-individuals/adjustment-personal-income-tax-benefit-amounts-indexation.html
 */

export interface TaxParameter<T> {
  value: T;
  taxYear: number;
  sourceUrl: string;
  sourceLabel: string;
  notes: string;
  TODO_VERIFY: boolean;
}

export const AMT_FIGURES_AS_OF = "2024/2025 tax years (Bill C-59 Royal Assent June 20, 2024; Section 127.5 ITA)";

export const FEDERAL_AMT_PARAMETERS = {
  figuresAsOf: AMT_FIGURES_AS_OF,
  taxYear: 2024,

  // Statutory flat AMT rate under Section 127.51 (raised from 15% to 20.5% post-2024)
  amtRate: {
    value: 0.205,
    taxYear: 2024,
    sourceUrl: "https://laws-lois.justice.gc.ca/eng/acts/I-3.3/section-127.51.html",
    sourceLabel: "Income Tax Act s. 127.51 (Bill C-59)",
    notes: "Flat minimum tax rate equal to the second federal marginal bracket rate (20.5%).",
    TODO_VERIFY: true,
  } as TaxParameter<number>,

  // Basic AMT exemption under Section 127.531 (indexed to the start of the 4th federal bracket)
  basicExemption2024: {
    value: 173205,
    taxYear: 2024,
    sourceUrl: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/frequently-asked-questions-individuals/adjustment-personal-income-tax-benefit-amounts-indexation.html",
    sourceLabel: "CRA 2024 Indexation Rates & Brackets",
    notes: "Indexed basic exemption for 2024 corresponding to the lower threshold of the 4th federal tax bracket ($173,205).",
    TODO_VERIFY: true,
  } as TaxParameter<number>,

  basicExemption2025: {
    value: 177882,
    taxYear: 2025,
    sourceUrl: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/frequently-asked-questions-individuals/adjustment-personal-income-tax-benefit-amounts-indexation.html",
    sourceLabel: "CRA 2025 Indexation Rates & Brackets",
    notes: "Indexed basic exemption for 2025 corresponding to the 4th federal tax bracket ($177,882).",
    TODO_VERIFY: true,
  } as TaxParameter<number>,

  // Capital gains inclusion rate for AMT purposes under Section 127.52(1)(d)
  capitalGainsInclusionRateAMT: {
    value: 1.0,
    taxYear: 2024,
    sourceUrl: "https://www.canada.ca/en/department-finance/news/2023/08/alternative-minimum-tax-for-high-income-individuals.html",
    sourceLabel: "Department of Finance Canada - AMT Explanatory Notes",
    notes: "100% of realized capital gains are included in the adjusted taxable income for AMT.",
    TODO_VERIFY: true,
  } as TaxParameter<number>,

  // Regular capital gains inclusion rate (standard Part I tax)
  capitalGainsInclusionRateRegular: {
    value: 0.50,
    taxYear: 2024,
    sourceUrl: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/personal-income/line-12700-capital-gains.html",
    sourceLabel: "CRA Line 12700 - Capital Gains",
    notes: "50% regular inclusion rate for individuals (Budget 2024 introduced 66.67% over $250k).",
    TODO_VERIFY: true,
  } as TaxParameter<number>,

  // Dividend treatment under AMT: Gross-up eliminated; cash dividend included
  dividendGrossUpTreatmentAMT: {
    value: 0.0,
    taxYear: 2024,
    sourceUrl: "https://laws-lois.justice.gc.ca/eng/acts/I-3.3/section-127.52.html",
    sourceLabel: "Income Tax Act s. 127.52(1)(g)",
    notes: "Actual cash dividends included in AMT base without gross-up. Dividend tax credits disallowed under AMT.",
    TODO_VERIFY: true,
  } as TaxParameter<number>,

  // Eligible dividend gross-up for regular tax
  eligibleDividendGrossUpRegular: {
    value: 1.38,
    taxYear: 2024,
    sourceUrl: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/personal-income/line-12000-taxable-amount-dividends-eligible-other-than-eligible-taxable-canadian-corporations.html",
    sourceLabel: "CRA Line 12000 - Taxable Dividends",
    notes: "38% gross-up on eligible Canadian dividends.",
    TODO_VERIFY: true,
  } as TaxParameter<number>,

  eligibleDividendTaxCreditRateRegular: {
    value: 0.150198,
    taxYear: 2024,
    sourceUrl: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/deductions-credits-expenses/line-40425-federal-dividend-tax-credit.html",
    sourceLabel: "CRA Line 40425 - Federal Dividend Tax Credit",
    notes: "15.0198% of taxable (grossed-up) eligible dividend amount.",
    TODO_VERIFY: true,
  } as TaxParameter<number>,

  // Non-eligible dividend gross-up for regular tax
  nonEligibleDividendGrossUpRegular: {
    value: 1.15,
    taxYear: 2024,
    sourceUrl: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/personal-income/line-12000-taxable-amount-dividends-eligible-other-than-eligible-taxable-canadian-corporations.html",
    sourceLabel: "CRA Line 12000 - Taxable Dividends",
    notes: "15% gross-up on non-eligible dividends.",
    TODO_VERIFY: true,
  } as TaxParameter<number>,

  nonEligibleDividendTaxCreditRateRegular: {
    value: 0.090301,
    taxYear: 2024,
    sourceUrl: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/deductions-credits-expenses/line-40425-federal-dividend-tax-credit.html",
    sourceLabel: "CRA Line 40425 - Federal Dividend Tax Credit",
    notes: "9.0301% of taxable (grossed-up) non-eligible dividend amount.",
    TODO_VERIFY: true,
  } as TaxParameter<number>,

  // Non-refundable tax credits under AMT: 50% allowance under Section 127.531
  nonRefundableCreditAllowanceAMT: {
    value: 0.50,
    taxYear: 2024,
    sourceUrl: "https://laws-lois.justice.gc.ca/eng/acts/I-3.3/section-127.531.html",
    sourceLabel: "Income Tax Act s. 127.531 (Bill C-59)",
    notes: "Special non-refundable tax credits (including charitable donations and basic personal amount) reduced to 50% against minimum tax.",
    TODO_VERIFY: true,
  } as TaxParameter<number>,

  // Charitable donation credit treatment under AMT
  donationTaxCreditAllowanceAMT: {
    value: 0.50,
    taxYear: 2024,
    sourceUrl: "https://laws-lois.justice.gc.ca/eng/acts/I-3.3/section-127.531.html",
    sourceLabel: "Income Tax Act s. 127.531(a)",
    notes: "Federal charitable donation tax credit is restricted to 50% for AMT purposes.",
    TODO_VERIFY: true,
  } as TaxParameter<number>,

  // Maximum carry-forward period under Section 120.2
  carryForwardYears: {
    value: 7,
    taxYear: 2024,
    sourceUrl: "https://laws-lois.justice.gc.ca/eng/acts/I-3.3/section-120.2.html",
    sourceLabel: "Income Tax Act s. 120.2 - Minimum Tax Carry-over",
    notes: "Additional AMT paid can be carried forward up to 7 consecutive taxation years to credit against regular Part I tax.",
    TODO_VERIFY: true,
  } as TaxParameter<number>,

  // Federal 2024 Regular Tax Brackets & Rates
  federalBrackets2024: {
    value: [
      { upTo: 55867, rate: 0.15 },
      { upTo: 111733, rate: 0.205 },
      { upTo: 173205, rate: 0.26 },
      { upTo: 246752, rate: 0.29 },
      { upTo: Infinity, rate: 0.33 },
    ],
    taxYear: 2024,
    sourceUrl: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/frequently-asked-questions-individuals/canadian-income-tax-rates-individuals-current-previous-years.html",
    sourceLabel: "CRA Canadian Income Tax Rates for Individuals",
    notes: "Federal personal income tax brackets for 2024.",
    TODO_VERIFY: true,
  } as TaxParameter<Array<{ upTo: number; rate: number }>>,

  // Basic Personal Amount for 2024
  basicPersonalAmount2024: {
    value: 15705,
    taxYear: 2024,
    sourceUrl: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/frequently-asked-questions-individuals/adjustment-personal-income-tax-benefit-amounts-indexation.html",
    sourceLabel: "CRA Line 30000 - Basic Personal Amount",
    notes: "Maximum basic personal amount for 2024 ($15,705).",
    TODO_VERIFY: true,
  } as TaxParameter<number>,

  // Donation credit rates for regular tax
  donationCreditTier1Rate: 0.15, // 15% on first $200
  donationCreditTier2Rate: 0.29, // 29% over $200 (or 33% if income in top bracket)
  donationCreditThreshold: 200,
};
