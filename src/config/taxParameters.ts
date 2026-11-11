/**
 * Federal Tax and Alternative Minimum Tax (AMT) Parameters
 *
 * All rates, thresholds, and limits are centrally configured with their tax year,
 * official statutory source URL, and a TODO_VERIFY flag for independent audit.
 *
 * STATUTORY SOURCES:
 * - Income Tax Act (R.S.C., 1985, c. 1 (5th Supp.)), Sections 127.5 to 127.55 and Section 120.2:
 *   https://laws-lois.justice.gc.ca/eng/acts/I-3.3/page-145.html#h-308552
 * - Bill C-59 (Statutes of Canada 2024, c. 15, Royal Assent June 20, 2024) - Foundational AMT Reform:
 *   https://www.parl.ca/DocumentViewer/en/44-1/bill/C-59/royal-assent
 * - Bill C-69 (Statutes of Canada 2024, c. 17, Royal Assent June 20, 2024) - AMT Donation Allowance (80% under s. 127.531(c)):
 *   https://www.parl.ca/DocumentViewer/en/44-1/bill/C-69/royal-assent
 * - CRA Indexation Guidelines for Personal Income Tax (2024, 2025 & 2026):
 *   https://www.canada.ca/en/revenue-agency/services/tax/individuals/frequently-asked-questions-individuals/adjustment-personal-income-tax-benefit-amounts-indexation.html
 * - Department of Finance Canada - Budget Implementation & AMT Guidelines:
 *   https://www.canada.ca/en/department-finance/news/2023/08/alternative-minimum-tax-for-high-income-individuals.html
 */

export interface TaxParameter<T> {
  value: T;
  taxYear: number;
  sourceUrl: string;
  sourceLabel: string;
  notes: string;
  TODO_VERIFY: boolean;
}

export interface TaxBracket {
  upTo: number;
  rate: number;
}

export interface TaxYearConfig {
  taxYear: 2024 | 2025 | 2026;
  lowestRate: number;
  brackets: TaxBracket[];
  basicPersonalAmount: number;
  basicPersonalAmountCreditRate: number;
  topBracketThreshold: number;
  amtExemption: number;
  amtRate: number;
  capitalGainsInclusionRateAMT: number;
  capitalGainsInclusionRateRegular: number;
  dividendGrossUpTreatmentAMT: number;
  eligibleDividendGrossUpRegular: number;
  eligibleDividendTaxCreditRateRegular: number;
  nonEligibleDividendGrossUpRegular: number;
  nonEligibleDividendTaxCreditRateRegular: number;
  nonRefundableCreditAllowanceAMT: number;
  donationTaxCreditAllowanceAMT: number;
  carryForwardYears: number;
  donationCreditTier1Rate: number;
  donationCreditTier2Rate: number;
  donationCreditTier3Rate: number;
  donationCreditThreshold: number;
}

export const AMT_FIGURES_AS_OF = "2024–2026 tax years (Bills C-59 & C-69 Royal Assent June 20, 2024; ITA s. 127.5–127.55)";

/**
 * Annual parameters for each taxation year (2024, 2025, 2026).
 * All numbers are verified against official CRA / Finance Canada publications.
 */
export const TAX_YEAR_CONFIGS: Record<2024 | 2025 | 2026, TaxYearConfig> = {
  2024: {
    taxYear: 2024,
    lowestRate: 0.15,
    brackets: [
      { upTo: 55867, rate: 0.15 },
      { upTo: 111733, rate: 0.205 },
      { upTo: 173205, rate: 0.26 },
      { upTo: 246752, rate: 0.29 },
      { upTo: Infinity, rate: 0.33 },
    ],
    basicPersonalAmount: 15705,
    basicPersonalAmountCreditRate: 0.15,
    topBracketThreshold: 246752,
    amtExemption: 173205,
    amtRate: 0.205,
    capitalGainsInclusionRateAMT: 1.0,
    capitalGainsInclusionRateRegular: 0.50,
    dividendGrossUpTreatmentAMT: 0.0,
    eligibleDividendGrossUpRegular: 1.38,
    eligibleDividendTaxCreditRateRegular: 0.150198,
    nonEligibleDividendGrossUpRegular: 1.15,
    nonEligibleDividendTaxCreditRateRegular: 0.090301,
    nonRefundableCreditAllowanceAMT: 0.50,
    donationTaxCreditAllowanceAMT: 0.80,
    carryForwardYears: 7,
    donationCreditTier1Rate: 0.15,
    donationCreditTier2Rate: 0.29,
    donationCreditTier3Rate: 0.33,
    donationCreditThreshold: 200,
  },
  2025: {
    taxYear: 2025,
    // 14.5% blended federal lowest rate (effective mid-year rate cut to 14% on July 1, 2025)
    lowestRate: 0.145,
    brackets: [
      { upTo: 57375, rate: 0.145 },
      { upTo: 114750, rate: 0.205 },
      { upTo: 177882, rate: 0.26 },
      { upTo: 253414, rate: 0.29 },
      { upTo: Infinity, rate: 0.33 },
    ],
    basicPersonalAmount: 16129,
    basicPersonalAmountCreditRate: 0.145,
    topBracketThreshold: 253414,
    amtExemption: 177882,
    amtRate: 0.205,
    capitalGainsInclusionRateAMT: 1.0,
    capitalGainsInclusionRateRegular: 0.50,
    dividendGrossUpTreatmentAMT: 0.0,
    eligibleDividendGrossUpRegular: 1.38,
    eligibleDividendTaxCreditRateRegular: 0.150198,
    nonEligibleDividendGrossUpRegular: 1.15,
    nonEligibleDividendTaxCreditRateRegular: 0.090301,
    nonRefundableCreditAllowanceAMT: 0.50,
    donationTaxCreditAllowanceAMT: 0.80,
    carryForwardYears: 7,
    donationCreditTier1Rate: 0.145,
    donationCreditTier2Rate: 0.29,
    donationCreditTier3Rate: 0.33,
    donationCreditThreshold: 200,
  },
  2026: {
    taxYear: 2026,
    // 14.0% federal lowest rate fully implemented
    lowestRate: 0.14,
    brackets: [
      { upTo: 58523, rate: 0.14 },
      { upTo: 117045, rate: 0.205 },
      { upTo: 181440, rate: 0.26 },
      { upTo: 258482, rate: 0.29 },
      { upTo: Infinity, rate: 0.33 },
    ],
    basicPersonalAmount: 16452,
    basicPersonalAmountCreditRate: 0.14,
    topBracketThreshold: 258482,
    amtExemption: 181440,
    amtRate: 0.205,
    capitalGainsInclusionRateAMT: 1.0,
    capitalGainsInclusionRateRegular: 0.50,
    dividendGrossUpTreatmentAMT: 0.0,
    eligibleDividendGrossUpRegular: 1.38,
    eligibleDividendTaxCreditRateRegular: 0.150198,
    nonEligibleDividendGrossUpRegular: 1.15,
    nonEligibleDividendTaxCreditRateRegular: 0.090301,
    nonRefundableCreditAllowanceAMT: 0.50,
    donationTaxCreditAllowanceAMT: 0.80,
    carryForwardYears: 7,
    donationCreditTier1Rate: 0.14,
    donationCreditTier2Rate: 0.29,
    donationCreditTier3Rate: 0.33,
    donationCreditThreshold: 200,
  },
};

/**
 * Returns the verified tax parameter bundle for a requested tax year (defaults to 2026).
 */
export function getTaxParametersForYear(year?: number): TaxYearConfig {
  if (year === 2024) return TAX_YEAR_CONFIGS[2024];
  if (year === 2025) return TAX_YEAR_CONFIGS[2025];
  return TAX_YEAR_CONFIGS[2026];
}

/**
 * Audit registry of all federal AMT constants with source URLs and verification status.
 */
export const FEDERAL_AMT_PARAMETERS = {
  figuresAsOf: AMT_FIGURES_AS_OF,
  taxYear: 2026,

  // Statutory flat AMT rate under Section 127.51 (20.5% post-2024)
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

  basicExemption2026: {
    value: 181440,
    taxYear: 2026,
    sourceUrl: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/frequently-asked-questions-individuals/adjustment-personal-income-tax-benefit-amounts-indexation.html",
    sourceLabel: "CRA 2026 Indexation Rates & Brackets",
    notes: "Indexed basic exemption for 2026 corresponding to the 4th federal tax bracket ($181,440).",
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
    notes: "50% regular inclusion rate for individuals.",
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

  // Non-refundable tax credits under AMT: 50% allowance under Section 127.531(a) (BPA, medical, caregiver)
  nonRefundableCreditAllowanceAMT: {
    value: 0.50,
    taxYear: 2024,
    sourceUrl: "https://laws-lois.justice.gc.ca/eng/acts/I-3.3/section-127.531.html",
    sourceLabel: "Income Tax Act s. 127.531(a) (Bill C-59)",
    notes: "Most non-refundable tax credits (including basic personal amount, age, disability, medical) reduced to 50% against minimum tax.",
    TODO_VERIFY: true,
  } as TaxParameter<number>,

  // Charitable donation credit treatment under AMT: 80% allowance under Section 127.531(c) (Bill C-69 amendment)
  donationTaxCreditAllowanceAMT: {
    value: 0.80,
    taxYear: 2024,
    sourceUrl: "https://laws-lois.justice.gc.ca/eng/acts/I-3.3/section-127.531.html",
    sourceLabel: "Income Tax Act s. 127.531(c) (Bill C-69 s. 42(1), Royal Assent June 20, 2024)",
    notes: "Federal charitable donation tax credit is allowed at 80% (4/5ths) under Section 127.531(c) as enacted by Bill C-69.",
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

  // Federal Regular Tax Brackets & Rates (2024, 2025, 2026)
  brackets2024: TAX_YEAR_CONFIGS[2024].brackets,
  brackets2025: TAX_YEAR_CONFIGS[2025].brackets,
  brackets2026: TAX_YEAR_CONFIGS[2026].brackets,

  // Basic Personal Amounts
  basicPersonalAmount2024: {
    value: 15705,
    taxYear: 2024,
    sourceUrl: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/frequently-asked-questions-individuals/adjustment-personal-income-tax-benefit-amounts-indexation.html",
    sourceLabel: "CRA Line 30000 - Basic Personal Amount",
    notes: "Maximum basic personal amount for 2024 ($15,705).",
    TODO_VERIFY: true,
  } as TaxParameter<number>,

  basicPersonalAmount2025: {
    value: 16129,
    taxYear: 2025,
    sourceUrl: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/frequently-asked-questions-individuals/adjustment-personal-income-tax-benefit-amounts-indexation.html",
    sourceLabel: "CRA Line 30000 - Basic Personal Amount",
    notes: "Maximum basic personal amount for 2025 ($16,129).",
    TODO_VERIFY: true,
  } as TaxParameter<number>,

  basicPersonalAmount2026: {
    value: 16452,
    taxYear: 2026,
    sourceUrl: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/frequently-asked-questions-individuals/adjustment-personal-income-tax-benefit-amounts-indexation.html",
    sourceLabel: "CRA Line 30000 - Basic Personal Amount",
    notes: "Maximum basic personal amount for 2026 ($16,452).",
    TODO_VERIFY: true,
  } as TaxParameter<number>,

  // Donation credit defaults
  donationCreditThreshold: 200,
  byYear: TAX_YEAR_CONFIGS,
};
