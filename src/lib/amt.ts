/**
 * Federal Alternative Minimum Tax (AMT) Calculation Engine (Post-2024 Bill C-59 & C-69 Framework)
 *
 * Implements the statutory parallel tax calculation defined in Sections 127.5 to 127.55
 * and Section 120.2 of the Canadian Income Tax Act.
 *
 * SCOPE:
 * - Computes Federal Part I Regular Tax and Federal Alternative Minimum Tax.
 * - Provincial AMT is not included. Most provinces add a share of federal AMT.
 * - All rate, bracket, BPA, and exemption constants are sourced dynamically from src/config/taxParameters.ts.
 * - Output values are mathematical estimations for financial education purposes only.
 */

import {
  getTaxParametersForYear,
  TaxYearConfig,
  AMT_FIGURES_AS_OF,
} from "../config/taxParameters.ts";

export interface AmtCalculationInput {
  employmentIncome: number;
  otherIncome?: number;
  realizedCapitalGains?: number;
  eligibleDividends?: number; // Actual cash amount received
  nonEligibleDividends?: number; // Actual cash amount received
  deductions?: number; // Carrying charges, childcare, union dues, etc.
  charitableDonations?: number; // Total eligible philanthropic gifts
  priorYearAmtCarryForward?: number; // Unused AMT from prior 7 taxation years
  taxYear?: 2024 | 2025 | 2026;
}

export interface AmtCalculationResult {
  // Primary user-facing metrics
  regularFederalTaxEstimate: number;
  amtEstimate: number;
  amtApplies: boolean;
  estimatedAmtPayable: number; // Additional tax due solely to AMT
  estimatedCarryForwardCredit: number; // New AMT eligible for 7-year carry-forward

  // Transparent balance sheet breakdown
  regularTaxableIncome: number;
  regularTaxBeforeCredits: number;
  regularNonRefundableCredits: number;
  regularFederalTax: number;

  amtAdjustedTaxableIncome: number;
  amtExemptionAmount: number;
  amtExemptionApplied: number;
  amtTaxableBase: number;
  amtGrossTax: number;
  amtCreditsAllowed: number;
  netAmt: number;

  totalFederalTaxPayable: number;
  carryForwardApplied: number;
  remainingCarryForward: number;

  taxYear: 2024 | 2025 | 2026;
  figuresAsOf: string;
  provincialScopeNote: string;
}

/**
 * Calculates federal tax before non-refundable credits using statutory tax year brackets.
 */
function calculateFederalTaxOnIncome(taxableIncome: number, cfg: TaxYearConfig): number {
  if (!Number.isFinite(taxableIncome) || taxableIncome <= 0) return 0;

  let tax = 0;
  let previousLimit = 0;

  for (const b of cfg.brackets) {
    if (taxableIncome > previousLimit) {
      const taxableInBracket = Math.min(taxableIncome - previousLimit, b.upTo - previousLimit);
      tax += taxableInBracket * b.rate;
      previousLimit = b.upTo;
    } else {
      break;
    }
  }

  return tax;
}

/**
 * Calculates federal charitable donation tax credit.
 * - Tier 1: Lowest rate for the year (15% in 2024, 14.5% in 2025, 14.0% in 2026) on first $200
 * - Tier 2: 29% (or 33% to the extent taxable income exceeds top federal bracket) on remaining donations
 */
function calculateDonationCredit(
  donations: number,
  taxableIncome: number,
  cfg: TaxYearConfig
): number {
  if (!Number.isFinite(donations) || donations <= 0) return 0;

  const tier1Donations = Math.min(donations, cfg.donationCreditThreshold);
  const tier2Donations = Math.max(0, donations - cfg.donationCreditThreshold);

  let credit = tier1Donations * cfg.donationCreditTier1Rate;

  if (tier2Donations > 0) {
    const incomeInTopBracket = Math.max(0, taxableIncome - cfg.topBracketThreshold);
    const donationsEligibleFor33 = Math.min(tier2Donations, incomeInTopBracket);
    const donationsEligibleFor29 = tier2Donations - donationsEligibleFor33;

    credit +=
      donationsEligibleFor33 * cfg.donationCreditTier3Rate +
      donationsEligibleFor29 * cfg.donationCreditTier2Rate;
  }

  return credit;
}

/**
 * Pure, unit-testable Alternative Minimum Tax calculation function.
 * Sanitizes negative and blank inputs to 0.
 */
export function calculateAlternativeMinimumTax(input: AmtCalculationInput): AmtCalculationResult {
  const year: 2024 | 2025 | 2026 =
    input.taxYear === 2024 || input.taxYear === 2025 || input.taxYear === 2026
      ? input.taxYear
      : 2026;

  const cfg = getTaxParametersForYear(year);

  // Sanitize all inputs to nonnegative numbers
  const employmentIncome = Math.max(0, Number(input.employmentIncome) || 0);
  const otherIncome = Math.max(0, Number(input.otherIncome) || 0);
  const realizedCapitalGains = Math.max(0, Number(input.realizedCapitalGains) || 0);
  const eligibleDividends = Math.max(0, Number(input.eligibleDividends) || 0);
  const nonEligibleDividends = Math.max(0, Number(input.nonEligibleDividends) || 0);
  const deductions = Math.max(0, Number(input.deductions) || 0);
  const charitableDonations = Math.max(0, Number(input.charitableDonations) || 0);
  const priorYearAmtCarryForward = Math.max(0, Number(input.priorYearAmtCarryForward) || 0);

  // --------------------------------------------------------------------------
  // 1. REGULAR FEDERAL PART I TAX COMPUTATION
  // --------------------------------------------------------------------------
  const regularCapitalGainsInclusion =
    realizedCapitalGains * cfg.capitalGainsInclusionRateRegular;
  const regularEligibleDividendsTaxable =
    eligibleDividends * cfg.eligibleDividendGrossUpRegular;
  const regularNonEligibleDividendsTaxable =
    nonEligibleDividends * cfg.nonEligibleDividendGrossUpRegular;

  const regularTotalIncome =
    employmentIncome +
    otherIncome +
    regularCapitalGainsInclusion +
    regularEligibleDividendsTaxable +
    regularNonEligibleDividendsTaxable;

  const regularTaxableIncome = Math.max(0, regularTotalIncome - deductions);
  const regularTaxBeforeCredits = calculateFederalTaxOnIncome(regularTaxableIncome, cfg);

  // Non-refundable tax credits (Federal)
  const bpaCredit = cfg.basicPersonalAmount * cfg.basicPersonalAmountCreditRate;

  const eligibleDivCredit =
    regularEligibleDividendsTaxable * cfg.eligibleDividendTaxCreditRateRegular;
  const nonEligibleDivCredit =
    regularNonEligibleDividendsTaxable * cfg.nonEligibleDividendTaxCreditRateRegular;

  const regularDonationCredit = calculateDonationCredit(
    charitableDonations,
    regularTaxableIncome,
    cfg
  );

  const regularNonRefundableCredits =
    bpaCredit + eligibleDivCredit + nonEligibleDivCredit + regularDonationCredit;
  const regularFederalTax = Math.max(0, regularTaxBeforeCredits - regularNonRefundableCredits);

  // --------------------------------------------------------------------------
  // 2. ALTERNATIVE MINIMUM TAX (AMT) COMPUTATION (Bills C-59 & C-69)
  // --------------------------------------------------------------------------
  // Capital gains included at 100% under AMT (ITA s. 127.52(1)(d))
  const amtCapitalGainsInclusion =
    realizedCapitalGains * cfg.capitalGainsInclusionRateAMT;

  // Actual cash dividends included with 0% gross-up (ITA s. 127.52(1)(g))
  const amtDividendsInclusion = eligibleDividends + nonEligibleDividends;

  // Adjusted taxable income before exemption
  const amtAdjustedTaxableIncome = Math.max(
    0,
    employmentIncome +
      otherIncome +
      amtCapitalGainsInclusion +
      amtDividendsInclusion -
      deductions
  );

  // Basic AMT Exemption: 4th federal bracket threshold
  const amtExemptionAmount = cfg.amtExemption;
  const amtExemptionApplied = Math.min(amtAdjustedTaxableIncome, amtExemptionAmount);
  const amtTaxableBase = Math.max(0, amtAdjustedTaxableIncome - amtExemptionAmount);

  // Flat statutory rate: 20.5% (ITA s. 127.51)
  const amtGrossTax = amtTaxableBase * cfg.amtRate;

  // Non-refundable tax credits under AMT:
  // - 50% allowance for BPA and other standard personal credits (ITA s. 127.531(a))
  // - 80% allowance for charitable donation tax credit (ITA s. 127.531(c), as amended by Bill C-69 s. 42(1))
  // - Dividend tax credits are disallowed under AMT (ITA s. 127.531)
  const amtBpaCreditAllowed = bpaCredit * cfg.nonRefundableCreditAllowanceAMT;
  const amtDonationCreditAllowed = regularDonationCredit * cfg.donationTaxCreditAllowanceAMT;
  const amtCreditsAllowed = amtBpaCreditAllowed + amtDonationCreditAllowed;

  const netAmt = Math.max(0, amtGrossTax - amtCreditsAllowed);

  // --------------------------------------------------------------------------
  // 3. COMPARISON & MINIMUM TAX PAYABLE
  // --------------------------------------------------------------------------
  let amtApplies = false;
  let estimatedAmtPayable = 0;
  let estimatedCarryForwardCredit = 0;
  let carryForwardApplied = 0;
  let remainingCarryForward = priorYearAmtCarryForward;
  let totalFederalTaxPayable = regularFederalTax;

  if (netAmt > regularFederalTax) {
    // AMT triggers additional tax liability
    amtApplies = true;
    estimatedAmtPayable = netAmt - regularFederalTax;
    estimatedCarryForwardCredit = estimatedAmtPayable;
    totalFederalTaxPayable = netAmt;
    carryForwardApplied = 0;
    remainingCarryForward = priorYearAmtCarryForward;
  } else {
    // Regular tax equals or exceeds AMT: User can potentially utilize prior-year AMT carry-forward
    amtApplies = false;
    estimatedAmtPayable = 0;
    estimatedCarryForwardCredit = 0;

    if (priorYearAmtCarryForward > 0) {
      // Prior AMT can offset regular tax down to the AMT floor (ITA s. 120.2)
      const maxCarryForwardUsable = Math.max(0, regularFederalTax - netAmt);
      carryForwardApplied = Math.min(priorYearAmtCarryForward, maxCarryForwardUsable);
      totalFederalTaxPayable = regularFederalTax - carryForwardApplied;
      remainingCarryForward = priorYearAmtCarryForward - carryForwardApplied;
    } else {
      totalFederalTaxPayable = regularFederalTax;
    }
  }

  return {
    regularFederalTaxEstimate: Math.round(regularFederalTax),
    amtEstimate: Math.round(netAmt),
    amtApplies,
    estimatedAmtPayable: Math.round(estimatedAmtPayable),
    estimatedCarryForwardCredit: Math.round(estimatedCarryForwardCredit),

    regularTaxableIncome: Math.round(regularTaxableIncome),
    regularTaxBeforeCredits: Math.round(regularTaxBeforeCredits),
    regularNonRefundableCredits: Math.round(regularNonRefundableCredits),
    regularFederalTax: Math.round(regularFederalTax),

    amtAdjustedTaxableIncome: Math.round(amtAdjustedTaxableIncome),
    amtExemptionAmount,
    amtExemptionApplied: Math.round(amtExemptionApplied),
    amtTaxableBase: Math.round(amtTaxableBase),
    amtGrossTax: Math.round(amtGrossTax),
    amtCreditsAllowed: Math.round(amtCreditsAllowed),
    netAmt: Math.round(netAmt),

    totalFederalTaxPayable: Math.round(totalFederalTaxPayable),
    carryForwardApplied: Math.round(carryForwardApplied),
    remainingCarryForward: Math.round(remainingCarryForward),

    taxYear: year,
    figuresAsOf: AMT_FIGURES_AS_OF,
    provincialScopeNote:
      "Provincial AMT is not included. Most provinces add a share of federal AMT.",
  };
}

// Aliases for developer convenience & parity
export type AmtInput = AmtCalculationInput;
export type AmtResult = AmtCalculationResult;
export const calculateFederalAmt = calculateAlternativeMinimumTax;
