/**
 * Comprehensive Unit Test Suite for AMT Engine (src/lib/amt.ts)
 *
 * Covers 10 Scenarios:
 * 1. Standard Salaried Earner (No AMT)
 * 2. High Salaried Professional with Small Capital Gains (Regular Tax Dominates, No AMT)
 * 3. Significant Capital Gains Liquidity Event (AMT Triggers Additional Tax)
 * 4. High Dividend Earner with Large Philanthropic Gift (Credit Reductions)
 * 5. Recovery of Prior-Year AMT Carry-Forward (Carry-forward offsets Regular Tax)
 * 6. Donation Credit Allowance Check (Fails if 50% is used instead of statutory 80% under Bill C-69 s. 127.531(c))
 * 7. 2026 vs 2025 Exemption Comparison ($181,440 vs $177,882 with 14% vs 14.5% lowest rate)
 * 8. Exact Match No AMT / No Carry-Forward (Regular tax >= AMT; payable = 0, credit = 0)
 * 9. Carry-Forward Partially Used (Prior AMT exceeds difference between regular tax and AMT floor)
 * 10. Negative and Blank Inputs Handling (Sanitizes gracefully without NaN or runtime exceptions)
 */

import { calculateAlternativeMinimumTax, AmtCalculationInput } from "../src/lib/amt.ts";
import { getTaxParametersForYear } from "../src/config/taxParameters.ts";

function runTests() {
  console.log("=== RUNNING ALTERNATIVE MINIMUM TAX (AMT) ENGINE VERIFICATION ===");
  let passed = 0;
  let total = 0;

  function assert(condition: boolean, testName: string, details?: any) {
    total++;
    if (condition) {
      console.log(`✓ [PASS] Scenario ${total}: ${testName}`);
      passed++;
    } else {
      console.error(`✗ [FAIL] Scenario ${total}: ${testName}`, details);
      process.exitCode = 1;
    }
  }

  // --------------------------------------------------------------------------
  // Scenario 1: Standard Salaried Earner ($95,000 in 2024)
  // Income below the $173,205 basic exemption -> AMT must be $0, AMT must not apply
  // --------------------------------------------------------------------------
  const s1 = calculateAlternativeMinimumTax({
    employmentIncome: 95000,
    deductions: 5000,
    taxYear: 2024,
  });
  assert(
    s1.amtApplies === false &&
      s1.estimatedAmtPayable === 0 &&
      s1.amtEstimate === 0 &&
      s1.regularFederalTaxEstimate > 0,
    "Standard Salaried Earner below $173,205 exemption incurs NO AMT",
    { s1 }
  );

  // --------------------------------------------------------------------------
  // Scenario 2: High Earner ($220,000) with Modest Capital Gains ($30,000 in 2024)
  // Regular marginal tax (29-33%) dominates flat 20.5% AMT -> No AMT
  // --------------------------------------------------------------------------
  const s2 = calculateAlternativeMinimumTax({
    employmentIncome: 220000,
    realizedCapitalGains: 30000,
    deductions: 10000,
    taxYear: 2024,
  });
  assert(
    s2.amtApplies === false &&
      s2.estimatedAmtPayable === 0 &&
      s2.regularFederalTaxEstimate > s2.amtEstimate,
    "High Earner with high regular salary has regular tax exceeding AMT (No AMT)",
    { regular: s2.regularFederalTaxEstimate, amt: s2.amtEstimate }
  );

  // --------------------------------------------------------------------------
  // Scenario 3: Significant Capital Gains Liquidity Event ($1M Gain, $60k Salary in 2024)
  // Regular tax includes 50% ($500k), but AMT includes 100% ($1M)
  // AMT triggers substantial additional tax payable and 7-year carry-forward credit
  // --------------------------------------------------------------------------
  const s3 = calculateAlternativeMinimumTax({
    employmentIncome: 60000,
    realizedCapitalGains: 1000000,
    deductions: 10000,
    taxYear: 2024,
  });
  assert(
    s3.amtApplies === true &&
      s3.estimatedAmtPayable > 0 &&
      s3.amtEstimate > s3.regularFederalTaxEstimate &&
      s3.estimatedCarryForwardCredit === s3.estimatedAmtPayable,
    "Major $1M Capital Gain triggers AMT liability and generates 7-year carry-forward credit",
    {
      regular: s3.regularFederalTaxEstimate,
      amt: s3.amtEstimate,
      payable: s3.estimatedAmtPayable,
      carryForward: s3.estimatedCarryForwardCredit,
    }
  );

  // --------------------------------------------------------------------------
  // Scenario 4: High Eligible Dividends with Large Philanthropic Gift
  // ($150k Dividends, $80k Donation in 2024)
  // Dividend credits disallowed under AMT; donation credit reduced by 20% (80% allowed)
  // --------------------------------------------------------------------------
  const s4 = calculateAlternativeMinimumTax({
    employmentIncome: 50000,
    eligibleDividends: 150000,
    charitableDonations: 80000,
    taxYear: 2024,
  });
  assert(
    s4.amtCreditsAllowed < s4.regularNonRefundableCredits,
    "Charitable donations and dividend credits are restricted under AMT",
    {
      regularCredits: s4.regularNonRefundableCredits,
      amtCredits: s4.amtCreditsAllowed,
    }
  );

  // --------------------------------------------------------------------------
  // Scenario 5: Full Carry-Forward Utilization in Subsequent Year ($250k Salary, $20k Carry-Forward)
  // Regular tax exceeds AMT, and prior-year AMT carry-forward of $20,000 is used
  // --------------------------------------------------------------------------
  const s5 = calculateAlternativeMinimumTax({
    employmentIncome: 250000,
    priorYearAmtCarryForward: 20000,
    taxYear: 2024,
  });
  assert(
    s5.amtApplies === false &&
      s5.carryForwardApplied === 20000 &&
      s5.totalFederalTaxPayable === s5.regularFederalTaxEstimate - 20000,
    "Prior-year AMT carry-forward successfully offsets regular tax down to AMT floor",
    {
      regular: s5.regularFederalTaxEstimate,
      amt: s5.amtEstimate,
      carryForwardApplied: s5.carryForwardApplied,
      finalTax: s5.totalFederalTaxPayable,
    }
  );

  // --------------------------------------------------------------------------
  // Scenario 6: Donation Credit Allowance (80% vs 50% Statutory Check under Bill C-69 s. 127.531(c))
  // With $50,000 donation and zero other credits besides BPA:
  // Donation credit under 2024 rules:
  // First $200 * 15% = $30. Next $49,800 * 29% = $14,442. Total donation credit = $14,472.
  // 80% allowance = $11,577.60.
  // BPA credit = $15,705 * 15% = $2,355.75. 50% allowance = $1,177.88.
  // Expected total AMT credits allowed = $11,577.60 + $1,177.88 = $12,755.48 (~$12,755).
  // If 50% were used for donation, donation credit would be $7,236, yielding total $8,414.
  // --------------------------------------------------------------------------
  const s6 = calculateAlternativeMinimumTax({
    employmentIncome: 200000,
    charitableDonations: 50000,
    taxYear: 2024,
  });
  // AMT credits allowed must reflect 80% donation credit, NOT 50%
  const bpaCredit50 = 15705 * 0.15 * 0.50; // $1,177.875
  const donationCredit80 = (200 * 0.15 + 49800 * 0.29) * 0.80; // $11,577.60
  const expectedCredits80 = Math.round(bpaCredit50 + donationCredit80); // 12755
  const donationCredit50 = (200 * 0.15 + 49800 * 0.29) * 0.50; // $7,236.00
  const expectedCredits50 = Math.round(bpaCredit50 + donationCredit50); // 8414
  assert(
    Math.abs(s6.amtCreditsAllowed - expectedCredits80) <= 2 &&
      s6.amtCreditsAllowed > expectedCredits50 + 2000,
    "Donation credit allowance under AMT is strictly 80% (Bill C-69), not 50%",
    {
      actual: s6.amtCreditsAllowed,
      expectedCredits80,
      expectedCredits50,
    }
  );

  // --------------------------------------------------------------------------
  // Scenario 7: 2026 vs 2025 Exemption & Lowest Rate Comparison
  // 2025: Exemption is $177,882, lowest rate is 14.5%
  // 2026: Exemption is $181,440, lowest rate is 14.0%
  // Income of $180,000 has AMT base > 0 in 2025 ($180k - $177,882 = $2,118),
  // but AMT base = 0 in 2026 ($180k <= $181,440 exemption).
  // --------------------------------------------------------------------------
  const s7_2025 = calculateAlternativeMinimumTax({
    employmentIncome: 180000,
    taxYear: 2025,
  });
  const s7_2026 = calculateAlternativeMinimumTax({
    employmentIncome: 180000,
    taxYear: 2026,
  });
  assert(
    s7_2025.amtExemptionAmount === 177882 &&
      s7_2026.amtExemptionAmount === 181440 &&
      s7_2025.amtTaxableBase > 0 &&
      s7_2026.amtTaxableBase === 0,
    "2026 applies $181,440 exemption shielding $180k income where 2025 had taxable base",
    {
      exemption2025: s7_2025.amtExemptionAmount,
      base2025: s7_2025.amtTaxableBase,
      exemption2026: s7_2026.amtExemptionAmount,
      base2026: s7_2026.amtTaxableBase,
    }
  );

  // --------------------------------------------------------------------------
  // Scenario 8: Exact Match / Regular Tax Dominance (No AMT, No Carry-Forward Generated)
  // Regular tax >= AMT -> amtApplies: false, estimatedAmtPayable: 0, estimatedCarryForwardCredit: 0
  // --------------------------------------------------------------------------
  const s8 = calculateAlternativeMinimumTax({
    employmentIncome: 150000,
    taxYear: 2026,
  });
  assert(
    s8.amtApplies === false &&
      s8.estimatedAmtPayable === 0 &&
      s8.estimatedCarryForwardCredit === 0 &&
      s8.regularFederalTaxEstimate > 0,
    "Exact Match / High Salary: Regular tax >= AMT produces zero AMT payable and zero new carry-forward",
    {
      regular: s8.regularFederalTaxEstimate,
      amt: s8.amtEstimate,
      payable: s8.estimatedAmtPayable,
      credit: s8.estimatedCarryForwardCredit,
    }
  );

  // --------------------------------------------------------------------------
  // Scenario 9: Carry-Forward Partially Used
  // Taxpayer has $50,000 in prior-year AMT carry-forward.
  // Regular federal tax is $30,000, and AMT is $10,000.
  // Room to absorb carry-forward down to AMT floor is $30,000 - $10,000 = $20,000.
  // Only $20,000 must be applied, leaving $30,000 remaining carry-forward.
  // --------------------------------------------------------------------------
  const s9 = calculateAlternativeMinimumTax({
    employmentIncome: 140000,
    priorYearAmtCarryForward: 50000,
    taxYear: 2026,
  });
  const maxRoom = Math.max(0, s9.regularFederalTaxEstimate - s9.amtEstimate);
  assert(
    s9.carryForwardApplied === maxRoom &&
      s9.remainingCarryForward === 50000 - maxRoom &&
      s9.totalFederalTaxPayable === s9.regularFederalTaxEstimate - maxRoom &&
      maxRoom < 50000,
    "Carry-forward partially used: Prior AMT exceeds difference between regular tax and AMT floor",
    {
      regular: s9.regularFederalTaxEstimate,
      amt: s9.amtEstimate,
      maxRoom,
      applied: s9.carryForwardApplied,
      remaining: s9.remainingCarryForward,
    }
  );

  // --------------------------------------------------------------------------
  // Scenario 10: Negative and Blank Inputs Handling (Sanitization & Stability)
  // Negative or empty values must be sanitized to 0 without throwing errors or returning NaN.
  // --------------------------------------------------------------------------
  const s10 = calculateAlternativeMinimumTax({
    employmentIncome: -50000 as any,
    otherIncome: NaN as any,
    realizedCapitalGains: -100000 as any,
    eligibleDividends: undefined,
    nonEligibleDividends: null as any,
    deductions: -2000 as any,
    charitableDonations: -500 as any,
    priorYearAmtCarryForward: -10000 as any,
    taxYear: 2026,
  });
  assert(
    s10.regularTaxableIncome === 0 &&
      s10.amtAdjustedTaxableIncome === 0 &&
      s10.regularFederalTaxEstimate === 0 &&
      s10.amtEstimate === 0 &&
      !isNaN(s10.totalFederalTaxPayable) &&
      s10.amtApplies === false,
    "Negative and blank inputs sanitize cleanly to 0 without NaN or runtime failures",
    { s10 }
  );

  console.log(`\nAll ${total} scenarios executed. Result: ${passed}/${total} passed.`);
}

runTests();
