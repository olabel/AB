/**
 * Federal Alternative Minimum Tax (AMT) Calculation Engine (Post-2024 Bill C-59 Framework)
 *
 * Implements the statutory parallel tax calculation defined in Sections 127.5 to 127.55
 * and Section 120.2 of the Canadian Income Tax Act.
 *
 * SCOPE:
 * - Computes Federal Part I Regular Tax and Federal Alternative Minimum Tax.
 * - PROVINCIAL TAX IS EXPLICITLY OUT OF SCOPE (each province assesses a percentage of federal AMT, e.g. ON ~33.67%, BC ~33.7%).
 * - Output values are mathematical estimations for financial education purposes only.
 */

import { FEDERAL_AMT_PARAMETERS } from "../config/taxParameters.ts";

export interface AmtCalculationInput {
  employmentIncome: number;
  otherIncome?: number;
  realizedCapitalGains?: number;
  eligibleDividends?: number; // Actual cash amount received
  nonEligibleDividends?: number; // Actual cash amount received
  deductions?: number; // RRSP contributions, allowable union dues, etc.
  charitableDonations?: number; // Total eligible philanthropic gifts
  priorYearAmtCarryForward?: number; // Unused AMT from prior 7 taxation years
  taxYear?: 2024 | 2025;
}

export interface AmtCalculationResult {
  // Primary user-facing metrics required by prompt
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

  taxYear: number;
  figuresAsOf: string;
  provincialScopeNote: string;
}

/**
 * Calculates federal tax before non-refundable credits under the 2024/2025 federal brackets.
 */
function calculateFederalTaxOnIncome(taxableIncome: number, year: number): number {
  if (taxableIncome <= 0) return 0;

  // 2024 Brackets: 15% <= 55,867 | 20.5% <= 111,733 | 26% <= 173,205 | 29% <= 246,752 | 33% remainder
  const brackets =
    year === 2025
      ? [
          { upTo: 57375, rate: 0.15 },
          { upTo: 114750, rate: 0.205 },
          { upTo: 177882, rate: 0.26 },
          { upTo: 253414, rate: 0.29 },
          { upTo: Infinity, rate: 0.33 },
        ]
      : [
          { upTo: 55867, rate: 0.15 },
          { upTo: 111733, rate: 0.205 },
          { upTo: 173205, rate: 0.26 },
          { upTo: 246752, rate: 0.29 },
          { upTo: Infinity, rate: 0.33 },
        ];

  let tax = 0;
  let previousLimit = 0;

  for (const b of brackets) {
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
 * - 15% on first $200
 * - 29% (or 33% to the extent taxable income exceeds top federal bracket) on remaining donations
 */
function calculateDonationCredit(donations: number, taxableIncome: number, topBracketThreshold: number): number {
  if (donations <= 0) return 0;

  const tier1Donations = Math.min(donations, 200);
  const tier2Donations = Math.max(0, donations - 200);

  let credit = tier1Donations * 0.15;

  if (tier2Donations > 0) {
    const incomeInTopBracket = Math.max(0, taxableIncome - topBracketThreshold);
    const donationsEligibleFor33 = Math.min(tier2Donations, incomeInTopBracket);
    const donationsEligibleFor29 = tier2Donations - donationsEligibleFor33;

    credit += donationsEligibleFor33 * 0.33 + donationsEligibleFor29 * 0.29;
  }

  return credit;
}

/**
 * Pure, unit-testable Alternative Minimum Tax calculation function.
 */
export function calculateAlternativeMinimumTax(input: AmtCalculationInput): AmtCalculationResult {
  const year = input.taxYear || 2024;
  const employmentIncome = Math.max(0, input.employmentIncome || 0);
  const otherIncome = Math.max(0, input.otherIncome || 0);
  const realizedCapitalGains = Math.max(0, input.realizedCapitalGains || 0);
  const eligibleDividends = Math.max(0, input.eligibleDividends || 0);
  const nonEligibleDividends = Math.max(0, input.nonEligibleDividends || 0);
  const deductions = Math.max(0, input.deductions || 0);
  const charitableDonations = Math.max(0, input.charitableDonations || 0);
  const priorYearAmtCarryForward = Math.max(0, input.priorYearAmtCarryForward || 0);

  // --------------------------------------------------------------------------
  // 1. REGULAR FEDERAL PART I TAX COMPUTATION
  // --------------------------------------------------------------------------
  const regularCapitalGainsInclusion = realizedCapitalGains * FEDERAL_AMT_PARAMETERS.capitalGainsInclusionRateRegular.value; // 50%
  const regularEligibleDividendsTaxable = eligibleDividends * FEDERAL_AMT_PARAMETERS.eligibleDividendGrossUpRegular.value; // 138%
  const regularNonEligibleDividendsTaxable = nonEligibleDividends * FEDERAL_AMT_PARAMETERS.nonEligibleDividendGrossUpRegular.value; // 115%

  const regularTotalIncome =
    employmentIncome +
    otherIncome +
    regularCapitalGainsInclusion +
    regularEligibleDividendsTaxable +
    regularNonEligibleDividendsTaxable;

  const regularTaxableIncome = Math.max(0, regularTotalIncome - deductions);

  const regularTaxBeforeCredits = calculateFederalTaxOnIncome(regularTaxableIncome, year);

  // Non-refundable tax credits (Federal)
  const bpaAmount = year === 2025 ? 16129 : FEDERAL_AMT_PARAMETERS.basicPersonalAmount2024.value; // 15,705 for 2024
  const bpaCredit = bpaAmount * 0.15;

  const eligibleDivCredit = regularEligibleDividendsTaxable * FEDERAL_AMT_PARAMETERS.eligibleDividendTaxCreditRateRegular.value;
  const nonEligibleDivCredit = regularNonEligibleDividendsTaxable * FEDERAL_AMT_PARAMETERS.nonEligibleDividendTaxCreditRateRegular.value;

  const topBracketThreshold = year === 2025 ? 253414 : 246752;
  const regularDonationCredit = calculateDonationCredit(charitableDonations, regularTaxableIncome, topBracketThreshold);

  const regularNonRefundableCredits = bpaCredit + eligibleDivCredit + nonEligibleDivCredit + regularDonationCredit;
  const regularFederalTax = Math.max(0, regularTaxBeforeCredits - regularNonRefundableCredits);

  // --------------------------------------------------------------------------
  // 2. ALTERNATIVE MINIMUM TAX (AMT) COMPUTATION (Bill C-59)
  // --------------------------------------------------------------------------
  // Capital gains included at 100% under AMT
  const amtCapitalGainsInclusion = realizedCapitalGains * FEDERAL_AMT_PARAMETERS.capitalGainsInclusionRateAMT.value;

  // Actual cash dividends included with 0% gross-up
  const amtDividendsInclusion = eligibleDividends + nonEligibleDividends;

  // Adjusted taxable income before exemption
  const amtAdjustedTaxableIncome = Math.max(
    0,
    employmentIncome + otherIncome + amtCapitalGainsInclusion + amtDividendsInclusion - deductions
  );

  // Basic AMT Exemption: $173,205 (2024) or $177,882 (2025)
  const amtExemptionAmount =
    year === 2025
      ? FEDERAL_AMT_PARAMETERS.basicExemption2025.value
      : FEDERAL_AMT_PARAMETERS.basicExemption2024.value;

  const amtExemptionApplied = Math.min(amtAdjustedTaxableIncome, amtExemptionAmount);
  const amtTaxableBase = Math.max(0, amtAdjustedTaxableIncome - amtExemptionAmount);

  // Flat statutory rate: 20.5%
  const amtGrossTax = amtTaxableBase * FEDERAL_AMT_PARAMETERS.amtRate.value;

  // Non-refundable tax credits under AMT: 50% allowance under Section 127.531
  // Dividend tax credits are completely disallowed under AMT
  const amtBpaCreditAllowed = bpaCredit * FEDERAL_AMT_PARAMETERS.nonRefundableCreditAllowanceAMT.value;
  const amtDonationCreditAllowed = regularDonationCredit * FEDERAL_AMT_PARAMETERS.donationTaxCreditAllowanceAMT.value;
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
    // Carry-forward cannot be utilized in a year where AMT exceeds regular tax
    carryForwardApplied = 0;
    remainingCarryForward = priorYearAmtCarryForward;
  } else {
    // Regular tax equals or exceeds AMT: User can potentially utilize prior-year AMT carry-forward
    amtApplies = false;
    estimatedAmtPayable = 0;
    estimatedCarryForwardCredit = 0;

    if (priorYearAmtCarryForward > 0) {
      // Prior AMT can offset regular tax down to the AMT floor (s. 120.2)
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
    figuresAsOf: FEDERAL_AMT_PARAMETERS.figuresAsOf,
    provincialScopeNote:
      "Provincial Alternative Minimum Tax is explicitly out of scope. Most provinces levy an additional minimum tax equal to approximately 33.67% (Ontario) to 33.7% (BC) of federal AMT. Consult your provincial tax return schedule (Form T691).",
  };
}

// Aliases for developer convenience & parity
export type AmtInput = AmtCalculationInput;
export type AmtResult = AmtCalculationResult;
export const calculateFederalAmt = calculateAlternativeMinimumTax;
