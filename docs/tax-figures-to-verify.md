# Tax Figures to Verify: Federal Alternative Minimum Tax (AMT) & Parameters

This document records all statutory tax figures, formulas, rates, and thresholds utilized across the Alternative Minimum Tax (AMT) calculator and financial education guides on https://www.ahmedbello.com/.

**Audit Status:** All entries are flagged `TODO_VERIFY` for independent compliance and client-verification audits against official Canada.ca, Canada Revenue Agency (CRA), and Department of Finance publications.

---

## 1. Federal Alternative Minimum Tax (AMT) Parameters (Bill C-59 / ITA s. 127.5)

| Parameter / Constant | Value | Tax Year | Statutory Source & Citation | Verification URL | Status |
| :--- | :--- | :---: | :--- | :--- | :---: |
| **Statutory Flat AMT Rate** | `20.5%` (0.205) | 2024 / 2025 | Income Tax Act Section 127.51 (enacted via Bill C-59, Royal Assent June 20, 2024) | [Laws-Lois Justice Canada - s. 127.51](https://laws-lois.justice.gc.ca/eng/acts/I-3.3/section-127.51.html) | `TODO_VERIFY` |
| **Basic AMT Exemption (2024)** | `$173,205` | 2024 | Income Tax Act Section 127.531 (indexed to the lower threshold of the 4th federal tax bracket) | [CRA Indexation Adjustments](https://www.canada.ca/en/revenue-agency/services/tax/individuals/frequently-asked-questions-individuals/adjustment-personal-income-tax-benefit-amounts-indexation.html) | `TODO_VERIFY` |
| **Basic AMT Exemption (2025)** | `$177,882` | 2025 | CRA Indexation Formula applied to 4th federal tax bracket | [CRA Indexation Adjustments](https://www.canada.ca/en/revenue-agency/services/tax/individuals/frequently-asked-questions-individuals/adjustment-personal-income-tax-benefit-amounts-indexation.html) | `TODO_VERIFY` |
| **Capital Gains Inclusion Rate (AMT)** | `100.0%` (1.0) | 2024 / 2025 | Income Tax Act Section 127.52(1)(d) (Bill C-59) | [Finance Canada AMT Backgrounder](https://www.canada.ca/en/department-finance/news/2023/08/alternative-minimum-tax-for-high-income-individuals.html) | `TODO_VERIFY` |
| **Capital Gains Inclusion Rate (Regular Tax)** | `50.0%` (0.50) | 2024 | Income Tax Act Section 38(a) / Line 12700 | [CRA Line 12700 - Capital Gains](https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/personal-income/line-12700-capital-gains.html) | `TODO_VERIFY` |
| **Dividend Treatment (AMT)** | `0% gross-up` | 2024 / 2025 | Income Tax Act Section 127.52(1)(g) (cash dividends included with zero gross-up; dividend tax credit disallowed) | [Laws-Lois Justice Canada - s. 127.52](https://laws-lois.justice.gc.ca/eng/acts/I-3.3/section-127.52.html) | `TODO_VERIFY` |
| **Eligible Dividend Gross-Up (Regular)** | `38%` (1.38 factor) | 2024 | Income Tax Act Section 82(1)(b) / CRA Line 12000 | [CRA Line 12000](https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/personal-income/line-12000-taxable-amount-dividends-eligible-other-than-eligible-taxable-canadian-corporations.html) | `TODO_VERIFY` |
| **Eligible Dividend Tax Credit (Regular)** | `15.0198%` of taxable | 2024 | Income Tax Act Section 121 / CRA Line 40425 | [CRA Line 40425](https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/deductions-credits-expenses/line-40425-federal-dividend-tax-credit.html) | `TODO_VERIFY` |
| **Non-Eligible Dividend Gross-Up (Regular)**| `15%` (1.15 factor) | 2024 | Income Tax Act Section 82(1)(a) / CRA Line 12000 | [CRA Line 12000](https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/personal-income/line-12000-taxable-amount-dividends-eligible-other-than-eligible-taxable-canadian-corporations.html) | `TODO_VERIFY` |
| **Non-Eligible Dividend Tax Credit (Regular)**| `9.0301%` of taxable | 2024 | Income Tax Act Section 121 / CRA Line 40425 | [CRA Line 40425](https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/deductions-credits-expenses/line-40425-federal-dividend-tax-credit.html) | `TODO_VERIFY` |
| **Charitable Donation Credit Allowance (AMT)** | `50%` of regular credit | 2024 / 2025 | Income Tax Act Section 127.531(a) (Bill C-59) | [Finance Canada AMT Backgrounder](https://www.canada.ca/en/department-finance/news/2023/08/alternative-minimum-tax-for-high-income-individuals.html) | `TODO_VERIFY` |
| **Non-Refundable Tax Credit Allowance (AMT)** | `50%` of regular credits | 2024 / 2025 | Income Tax Act Section 127.531 (Bill C-59) | [Laws-Lois Justice Canada - s. 127.531](https://laws-lois.justice.gc.ca/eng/acts/I-3.3/section-127.531.html) | `TODO_VERIFY` |
| **AMT Carry-Forward Limit** | `7 Years` | 2024 / 2025 | Income Tax Act Section 120.2 (Minimum Tax Carry-over against future regular Part I tax) | [Laws-Lois Justice Canada - s. 120.2](https://laws-lois.justice.gc.ca/eng/acts/I-3.3/section-120.2.html) | `TODO_VERIFY` |

---

## 2. Federal Personal Income Tax Brackets (2024 Reference)

| Taxable Income Range | Federal Marginal Rate | Source Citation | Status |
| :--- | :---: | :--- | :---: |
| First `$55,867` | `15.0%` | CRA Canadian Income Tax Rates for Individuals (2024) | `TODO_VERIFY` |
| Over `$55,867` up to `$111,733` | `20.5%` | CRA Canadian Income Tax Rates for Individuals (2024) | `TODO_VERIFY` |
| Over `$111,733` up to `$173,205` | `26.0%` | CRA Canadian Income Tax Rates for Individuals (2024) | `TODO_VERIFY` |
| Over `$173,205` up to `$246,752` | `29.0%` | CRA Canadian Income Tax Rates for Individuals (2024) | `TODO_VERIFY` |
| Over `$246,752` | `33.0%` | CRA Canadian Income Tax Rates for Individuals (2024) | `TODO_VERIFY` |
| **Basic Personal Amount (Maximum)** | `$15,705` | CRA Line 30000 | `TODO_VERIFY` |

---

## 3. Scope Disclosures
- **Federal Scope Only:** Provincial AMT is explicitly outside the calculation scope of this module. In most Canadian provinces and territories, provincial AMT is calculated as a prescribed percentage of federal AMT (for example, Ontario s. 31 of the Taxation Act applies approximately 33.67%, and British Columbia applies approximately 33.7%). Taxpayers must consult provincial schedules (e.g., Form ON428, BC428, Form T691) for complete provincial liability.
- **Hypothetical Estimates:** Output values are mathematical estimations for financial education purposes only. Actual tax payable is determined exclusively by the Canada Revenue Agency upon assessment of Form T691 (Alternative Minimum Tax).
