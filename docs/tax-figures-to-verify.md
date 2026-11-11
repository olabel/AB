# Tax Figures to Verify: Federal Alternative Minimum Tax (AMT) & Parameters

This document records all statutory tax figures, formulas, rates, and thresholds utilized across the Alternative Minimum Tax (AMT) calculator and financial education guides on https://www.ahmedbello.com/.

**Audit Status:** All entries are flagged `TODO_VERIFY` for independent compliance and client-verification audits against official Canada.ca, Canada Revenue Agency (CRA), and Department of Finance publications.

---

## 1. Federal Alternative Minimum Tax (AMT) Parameters (Bills C-59 & C-69 / ITA s. 127.5–127.55)

| Parameter / Constant | Value | Tax Year | Statutory Source & Citation | Verification URL | Status |
| :--- | :--- | :---: | :--- | :--- | :---: |
| **Statutory Flat AMT Rate** | `20.5%` (0.205) | 2024–2026 | Income Tax Act Section 127.51 (enacted via Bill C-59, Royal Assent June 20, 2024) | [Laws-Lois Justice Canada - s. 127.51](https://laws-lois.justice.gc.ca/eng/acts/I-3.3/section-127.51.html) | `TODO_VERIFY` |
| **Basic AMT Exemption (2024)** | `$173,205` | 2024 | Income Tax Act Section 127.531 (indexed to the lower threshold of the 4th federal tax bracket) | [CRA Indexation Adjustments](https://www.canada.ca/en/revenue-agency/services/tax/individuals/frequently-asked-questions-individuals/adjustment-personal-income-tax-benefit-amounts-indexation.html) | `TODO_VERIFY` |
| **Basic AMT Exemption (2025)** | `$177,882` | 2025 | CRA Indexation Formula applied to 4th federal tax bracket | [CRA Indexation Adjustments](https://www.canada.ca/en/revenue-agency/services/tax/individuals/frequently-asked-questions-individuals/adjustment-personal-income-tax-benefit-amounts-indexation.html) | `TODO_VERIFY` |
| **Basic AMT Exemption (2026)** | `$181,440` | 2026 | CRA Indexation Formula applied to 4th federal tax bracket | [CRA Indexation Adjustments](https://www.canada.ca/en/revenue-agency/services/tax/individuals/frequently-asked-questions-individuals/adjustment-personal-income-tax-benefit-amounts-indexation.html) | `TODO_VERIFY` |
| **Capital Gains Inclusion Rate (AMT)** | `100.0%` (1.0) | 2024–2026 | Income Tax Act Section 127.52(1)(d) (Bill C-59) | [Finance Canada AMT Backgrounder](https://www.canada.ca/en/department-finance/news/2023/08/alternative-minimum-tax-for-high-income-individuals.html) | `TODO_VERIFY` |
| **Capital Gains Inclusion Rate (Regular Tax)** | `50.0%` (0.50) | 2024–2026 | Income Tax Act Section 38(a) / Line 12700 | [CRA Line 12700 - Capital Gains](https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/personal-income/line-12700-capital-gains.html) | `TODO_VERIFY` |
| **Dividend Treatment (AMT)** | `0% gross-up` | 2024–2026 | Income Tax Act Section 127.52(1)(g) (cash dividends included with zero gross-up; dividend tax credit disallowed) | [Laws-Lois Justice Canada - s. 127.52](https://laws-lois.justice.gc.ca/eng/acts/I-3.3/section-127.52.html) | `TODO_VERIFY` |
| **Eligible Dividend Gross-Up (Regular)** | `38%` (1.38 factor) | 2024–2026 | Income Tax Act Section 82(1)(b) / CRA Line 12000 | [CRA Line 12000](https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/personal-income/line-12000-taxable-amount-dividends-eligible-other-than-eligible-taxable-canadian-corporations.html) | `TODO_VERIFY` |
| **Eligible Dividend Tax Credit (Regular)** | `15.0198%` of taxable | 2024–2026 | Income Tax Act Section 121 / CRA Line 40425 | [CRA Line 40425](https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/deductions-credits-expenses/line-40425-federal-dividend-tax-credit.html) | `TODO_VERIFY` |
| **Non-Eligible Dividend Gross-Up (Regular)**| `15%` (1.15 factor) | 2024–2026 | Income Tax Act Section 82(1)(a) / CRA Line 12000 | [CRA Line 12000](https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/personal-income/line-12000-taxable-amount-dividends-eligible-other-than-eligible-taxable-canadian-corporations.html) | `TODO_VERIFY` |
| **Non-Eligible Dividend Tax Credit (Regular)**| `9.0301%` of taxable | 2024–2026 | Income Tax Act Section 121 / CRA Line 40425 | [CRA Line 40425](https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/deductions-credits-expenses/line-40425-federal-dividend-tax-credit.html) | `TODO_VERIFY` |
| **Charitable Donation Credit Allowance (AMT)** | `80%` of regular credit | 2024–2026 | Income Tax Act Section 127.531(c) (amended by Bill C-69 s. 42(1), Royal Assent June 20, 2024; formerly 50% under Bill C-59 proposals) | [Laws-Lois Justice Canada - s. 127.531](https://laws-lois.justice.gc.ca/eng/acts/I-3.3/section-127.531.html) | `TODO_VERIFY` |
| **Non-Refundable Tax Credit Allowance (AMT)** | `50%` of regular credits | 2024–2026 | Income Tax Act Section 127.531(a) (Bill C-59; applies to basic personal amount, age, medical expenses, caregiver) | [Laws-Lois Justice Canada - s. 127.531](https://laws-lois.justice.gc.ca/eng/acts/I-3.3/section-127.531.html) | `TODO_VERIFY` |
| **AMT Carry-Forward Limit** | `7 Years` | 2024–2026 | Income Tax Act Section 120.2 (Minimum Tax Carry-over against future regular Part I tax) | [Laws-Lois Justice Canada - s. 120.2](https://laws-lois.justice.gc.ca/eng/acts/I-3.3/section-120.2.html) | `TODO_VERIFY` |

---

## 2. Federal Personal Income Tax Brackets & Rates (2024, 2025, 2026)

### Tax Year 2024
| Taxable Income Range | Federal Marginal Rate | Source Citation | Status |
| :--- | :---: | :--- | :---: |
| First `$55,867` | `15.0%` | CRA Canadian Income Tax Rates for Individuals (2024) | `TODO_VERIFY` |
| Over `$55,867` up to `$111,733` | `20.5%` | CRA Canadian Income Tax Rates for Individuals (2024) | `TODO_VERIFY` |
| Over `$111,733` up to `$173,205` | `26.0%` | CRA Canadian Income Tax Rates for Individuals (2024) | `TODO_VERIFY` |
| Over `$173,205` up to `$246,752` | `29.0%` | CRA Canadian Income Tax Rates for Individuals (2024) | `TODO_VERIFY` |
| Over `$246,752` | `33.0%` | CRA Canadian Income Tax Rates for Individuals (2024) | `TODO_VERIFY` |
| **Basic Personal Amount (Maximum)** | `$15,705` (Credit rate 15.0%) | CRA Line 30000 | `TODO_VERIFY` |

### Tax Year 2025
| Taxable Income Range | Federal Marginal Rate | Source Citation | Status |
| :--- | :---: | :--- | :---: |
| First `$57,375` | `14.5%` (blended) | Canada.ca / Department of Finance (mid-year middle-class rate cut) | `TODO_VERIFY` |
| Over `$57,375` up to `$114,750` | `20.5%` | CRA 2025 Indexation Rates | `TODO_VERIFY` |
| Over `$114,750` up to `$177,882` | `26.0%` | CRA 2025 Indexation Rates | `TODO_VERIFY` |
| Over `$177,882` up to `$253,414` | `29.0%` | CRA 2025 Indexation Rates | `TODO_VERIFY` |
| Over `$253,414` | `33.0%` | CRA 2025 Indexation Rates | `TODO_VERIFY` |
| **Basic Personal Amount (Maximum)** | `$16,129` (Credit rate 14.5%) | CRA Line 30000 | `TODO_VERIFY` |

### Tax Year 2026
| Taxable Income Range | Federal Marginal Rate | Source Citation | Status |
| :--- | :---: | :--- | :---: |
| First `$58,523` | `14.0%` | Canada.ca / Department of Finance (full lowest bracket reduction) | `TODO_VERIFY` |
| Over `$58,523` up to `$117,045` | `20.5%` | CRA 2026 Indexation Rates | `TODO_VERIFY` |
| Over `$117,045` up to `$181,440` | `26.0%` | CRA 2026 Indexation Rates | `TODO_VERIFY` |
| Over `$181,440` up to `$258,482` | `29.0%` | CRA 2026 Indexation Rates | `TODO_VERIFY` |
| Over `$258,482` | `33.0%` | CRA 2026 Indexation Rates | `TODO_VERIFY` |
| **Basic Personal Amount (Maximum)** | `$16,452` (Credit rate 14.0%) | CRA Line 30000 | `TODO_VERIFY` |

---

## 3. Enacting Legislation Clarifications
- **Bill C-59** (*Fall Economic Statement Implementation Act, 2023*, Royal Assent June 20, 2024): Introduced foundational AMT restructuring, raising the flat rate to 20.5%, tying the basic exemption to the 4th bracket threshold, 100% capital gains inclusion, and disallowing dividend tax credits.
- **Bill C-69** (*Budget Implementation Act, 2024, No. 1*, Royal Assent June 20, 2024): Enacted critical amendments to Section 127.531(c) increasing the charitable donation tax credit allowance under AMT from 50% to 80%, and providing a 30% capital gains inclusion on donations of publicly listed securities.
- **Credit Categorization under ITA s. 127.531**:
  - **80% Allowance:** Charitable donation tax credit under Section 118.1 (s. 127.531(c)).
  - **50% Allowance:** Basic personal amount (s. 118(1)(a)-(c)), age amount (s. 118(2)), disability amount (s. 118.3), medical expense tax credit (s. 118.2), tuition tax credit (s. 118.5), caregiver amount (s. 118(1)(d)).
  - **0% Allowance (Disallowed):** Dividend tax credits (s. 121), labour-sponsored funds credit (s. 127.4), overseas employment tax credit.

---

## 4. Scope Disclosures
- **Federal Scope Only:** Provincial AMT is not included. Most provinces add a share of federal AMT. Taxpayers should review provincial schedules (Form T691, ON428, BC428) for complete provincial liability.
- **Unmodelled Elements:** Donations of securities, the lifetime capital gains exemption, employee stock option deductions and other adjustments are not modelled in this estimate.
- **Hypothetical Estimates:** Output values are mathematical estimations for financial education purposes only. Actual tax payable is determined exclusively by the Canada Revenue Agency upon assessment of Form T691 (Alternative Minimum Tax).
