/**
 * Unit Test Script for AMT Engine (src/lib/amt.ts)
 *
 * Covers 5 scenarios:
 * 1. Standard Salaried Earner (No AMT)
 * 2. High Salaried Professional with Small Capital Gains (Regular Tax Dominates, No AMT)
 * 3. Significant Capital Gains Liquidity Event (AMT Triggers Additional Tax)
 * 4. High Dividend Earner with Major Charitable Gift (AMT Triggers Due to Credit Reductions)
 * 5. Recovery of Prior-Year AMT Carry-Forward (Carry-forward offsets Regular Tax)
 */

import { calculateAlternativeMinimumTax, AmtCalculationInput } from "../src/lib/amt.ts";

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
  // Scenario 1: Standard Salaried Earner ($95,000)
  // Income below the $173,205 basic exemption -> AMT must be $0, AMT must not apply
  // --------------------------------------------------------------------------
  const s1Input: AmtCalculationInput = {
    employmentIncome: 95000,
    deductions: 5000, // RRSP
  };
  const s1 = calculateAlternativeMinimumTax(s1Input);
  assert(
    s1.amtApplies === false &&
      s1.estimatedAmtPayable === 0 &&
      s1.amtEstimate === 0 &&
      s1.regularFederalTaxEstimate > 0,
    "Standard Salaried Earner below $173,205 exemption incurs NO AMT",
    { s1 }
  );

  // --------------------------------------------------------------------------
  // Scenario 2: High Earner ($220,000) with Modest Capital Gains ($30,000)
  // Income exceeds $173,205, but regular marginal tax (29-33%) dominates flat 20.5% AMT
  // --------------------------------------------------------------------------
  const s2Input: AmtCalculationInput = {
    employmentIncome: 220000,
    realizedCapitalGains: 30000,
    deductions: 10000,
  };
  const s2 = calculateAlternativeMinimumTax(s2Input);
  assert(
    s2.amtApplies === false &&
      s2.estimatedAmtPayable === 0 &&
      s2.regularFederalTaxEstimate > s2.amtEstimate,
    "High Earner with high regular salary has regular tax exceeding AMT (No AMT)",
    { regular: s2.regularFederalTaxEstimate, amt: s2.amtEstimate }
  );

  // --------------------------------------------------------------------------
  // Scenario 3: Significant Capital Gains Liquidity Event ($1,000,000 Gain, $60,000 Salary)
  // Regular tax includes 50% ($500k), but AMT includes 100% ($1M)
  // AMT should trigger substantial additional tax payable
  // --------------------------------------------------------------------------
  const s3Input: AmtCalculationInput = {
    employmentIncome: 60000,
    realizedCapitalGains: 1000000,
    deductions: 10000,
  };
  const s3 = calculateAlternativeMinimumTax(s3Input);
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
  // ($150,000 Dividends, $80,000 Donation)
  // Regular tax receives full dividend tax credit and full donation credit.
  // AMT disallows dividend tax credit and cuts donation credit by 50%.
  // --------------------------------------------------------------------------
  const s4Input: AmtCalculationInput = {
    employmentIncome: 50000,
    eligibleDividends: 150000,
    charitableDonations: 80000,
  };
  const s4 = calculateAlternativeMinimumTax(s4Input);
  assert(
    s4.amtCreditsAllowed < s4.regularNonRefundableCredits,
    "Charitable donations and dividend credits are restricted under AMT",
    {
      regularCredits: s4.regularNonRefundableCredits,
      amtCredits: s4.amtCreditsAllowed,
    }
  );

  // --------------------------------------------------------------------------
  // Scenario 5: Carry-Forward Utilization in Subsequent Year
  // Regular tax exceeds AMT, and prior-year AMT carry-forward of $20,000 is used
  // --------------------------------------------------------------------------
  const s5Input: AmtCalculationInput = {
    employmentIncome: 250000,
    priorYearAmtCarryForward: 20000,
  };
  const s5 = calculateAlternativeMinimumTax(s5Input);
  assert(
    s5.amtApplies === false &&
      s5.carryForwardApplied > 0 &&
      s5.totalFederalTaxPayable === s5.regularFederalTaxEstimate - s5.carryForwardApplied,
    "Prior-year AMT carry-forward successfully offsets regular tax down to AMT floor",
    {
      regular: s5.regularFederalTaxEstimate,
      amt: s5.amtEstimate,
      carryForwardApplied: s5.carryForwardApplied,
      finalTax: s5.totalFederalTaxPayable,
    }
  );

  console.log(`\nAll ${total} scenarios executed. Result: ${passed}/${total} passed.`);
}

runTests();
