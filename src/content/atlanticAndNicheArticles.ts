import type { Article } from "./types.ts";

export const atlanticAndNicheArticles: Article[] = [
  {
    slug: "atlantic-canada-newcomer-aip-money-guide",
    kind: "guide",
    title: "Newcomer Finances in Dieppe, Moncton & Atlantic Canada (AIP Guide)",
    seoTitle: "Newcomer AIP Money Guide Moncton & NB",
    description:
      "Atlantic Immigration Program settlement funds vs. real first-year costs in Dieppe and Moncton, NB Medicare timing, car insurance letters, and TFSA rules.",
    question:
      "Why does the Atlantic Immigration Program (AIP) settlement proof-of-funds amount often fall short of real first-year costs in New Brunswick or Nova Scotia?",
    category: "newcomers",
    figuresAsOf: "Figures verified as of November 2026",
    problem:
      "Under the federal Atlantic Immigration Program (AIP), applicants with a validated job offer only need to show 12.5% of the Low Income Cut-Off (just over $3,900 for a single applicant or ~$7,300 for a family of four). Once families land in Dieppe, Moncton, Fredericton, or Halifax, upfront rental deposits, a winter vehicle, higher uncredited auto insurance, and professional licensing fees can consume that minimum within 45 days.",
    overview: [
      "Greater Moncton and Dieppe have become two of the fastest-growing bilingual landing hubs in Atlantic Canada because housing remains more accessible than in Toronto or Vancouver and employers actively endorse skilled newcomers through the Atlantic Immigration Program (AIP) and provincial nominee streams.",
      "What surprises most families is not the ongoing monthly cost of groceries or utilities, which can feel manageable once paycheques begin. It is the concentrated cash outflow during weeks one through twelve, compounded by provincial waiting rules, vehicle dependency, and credit history starting from zero.",
      "Planning the first 180 days with an honest Greater Moncton or Atlantic Canada cash buffer protects your household from high-interest credit card debt and positions your TFSA, RRSP, and FHSA accounts cleanly under Canada Revenue Agency (CRA) rules."
    ],
    sections: [
      {
        id: "settlement-runway",
        h2: "Minimum AIP Proof of Funds vs. Real Greater Moncton Costs",
        paragraphs: [
          "Immigration, Refugees and Citizenship Canada (IRCC) sets AIP proof-of-funds minimums intentionally low for candidates holding a valid Atlantic Canadian job offer. However, an immigration eligibility minimum is not a realistic 90-day household operating budget.",
          "Outside central Halifax, public transit routes in New Brunswick (including Codiac Transpo across Moncton, Dieppe, and Riverview) cover core corridors but rarely match shift schedules for hospital, warehouse, or industrial park employers. Most newly arrived families must acquire a reliable winter-ready vehicle within 30 to 60 days of landing, complete with winter tires and an upfront security deposit or cash purchase.",
          "In addition, utility providers such as NB Power or apartment landlords frequently request an upfront security deposit from applicants who do not yet have a Canadian credit file with Equifax or TransUnion. Keeping at least three to four months of essential cash liquid in a Canadian chequing or high-interest savings account prevents forced reliance on revolving 21% APR credit cards."
        ]
      },
      {
        id: "medicare-and-insurance",
        h2: "NB Medicare Registration & Foreign Auto Driving History",
        paragraphs: [
          "Health care and vehicle insurance follow strict provincial rules across New Brunswick, Nova Scotia, Prince Edward Island, and Newfoundland & Labrador. In New Brunswick, workers arriving on an eligible permanent resident confirmation or qualified full-time work permit (minimum 12-month contract) can apply for New Brunswick Medicare through Service New Brunswick, with coverage effective upon arrival once approved and verified, though card processing still takes several weeks.",
          "Until permanent provincial Medicare confirmation is active (or for visitors and transitional permits), out-of-pocket emergency hospitalization in Canada can run several thousand dollars per day. Securing short-term private emergency medical coverage during the transition bridge eliminates catastrophic risk for a modest fixed premium.",
          "For drivers, one of the highest-impact steps to take before flying to Atlantic Canada is obtaining an official written Letter of Experience from your home country's motor vehicle bureau and previous auto insurer on company letterhead. Recognized New Brunswick and Nova Scotia insurers can often credit prior claim-free years directly, reducing annual family auto insurance premiums by $1,200 to $2,400 compared to a new-driver rate."
        ]
      },
      {
        id: "registered-accounts-t1135",
        h2: "First-Year TFSA, FHSA, Credit Building & Form T1135",
        paragraphs: [
          "Canadian financial institutions require a Social Insurance Number (SIN) and proof of Canadian residential address to open tax-sheltered accounts. Your Tax-Free Savings Account (TFSA) room ($7,000 for 2026) begins accumulating in full in the calendar year you become a tax resident of Canada aged 18 or older.",
          "Do not fall into the common trap of opening an RRSP before you actually have prior-year Canadian earned income reported on a Notice of Assessment. Your first-year RRSP limit is generally zero until the calendar year following your first year of Canadian T4 or self-employed employment.",
          "Finally, keep meticulous stamped valuations of any bank accounts, rental property, or investments left outside Canada on your exact landing date. While CRA exempts newcomers from filing Form T1135 (Foreign Income Verification Statement) for their first partial year of residency, every subsequent tax year requires reporting if total foreign specified property cost exceeds CAD $100,000 (currently proposed for indexation increases in later tax years)."
        ]
      }
    ],
    checklist: {
      title: "First 60-Day Atlantic Canada Financial Action Checklist",
      items: [
        "Collect official home-country driving abstracts and claim-free auto insurance Letters of Experience before departing.",
        "Open a newcomer Canadian bank package with both a chequing account and a secured or newcomer credit card in week one.",
        "Keep monthly credit card utilization below 30% of the card limit and automate full statement payment to build Equifax/TransUnion history.",
        "Register promptly for New Brunswick Medicare (Service NB) or MSI (Nova Scotia) and verify coverage start dates for every family member.",
        "Verify SIN issuance and Tax Residency start date before contributing to a TFSA or FHSA ($8,000/yr once resident and 18+).",
        "Document exact fair market value and exchange rate of all overseas assets on your date of landing for future CRA cost-base tracking."
      ]
    },
    faqs: [
      {
        question: "Do AIP newcomers in New Brunswick get full TFSA contribution room in year one?",
        answer:
          "Yes. Once you establish Canadian tax residency and hold a valid Social Insurance Number (SIN) while aged 18 or older, you receive the full annual TFSA limit ($7,000 for 2026) for that calendar year without proration, even if you arrived in October."
      },
      {
        question: "Can I contribute to an RRSP during my first year working in Moncton or Dieppe?",
        answer:
          "Generally no, unless you worked and filed a Canadian tax return in a prior calendar year. RRSP contribution room equals 18% of prior-year Canadian earned income up to the annual maximum ($33,810 for 2026). Over-contributing in year one triggers a 1% per month penalty tax above the $2,000 buffer."
      },
      {
        question: "Why is auto insurance so expensive for newcomers in Atlantic Canada without a claims letter?",
        answer:
          "Without an authenticated Letter of Experience or driving abstract proving years of continuous licensed driving and zero at-fault claims, insurers rate newcomers as first-time inexperienced drivers. Bringing verified documentation can save more than $100 per month from day one."
      },
      {
        question: "Is Dieppe and Greater Moncton a good bilingual market for AIP newcomers?",
        answer:
          "Yes. Greater Moncton is officially bilingual (English and French), offering strong employment pathways across healthcare, logistics, financial services, technology, and federal/provincial administration, paired with lower housing prices than Ontario or British Columbia."
      }
    ],
    example: {
      title: "Hypothetical 90-Day Cash Flow Budget: Family of Three Settling in Dieppe, NB (AIP)",
      intro:
        "A couple with one child arrives under AIP with one endorsed healthcare/logistics job offer at $72,000/year. Notice why the IRCC minimum proof-of-funds (~$6,000 for a family of three with a job offer) differs sharply from real upfront settlement outlay.",
      table: {
        head: ["First-90-Day Settlement Item", "Realistic Greater Moncton Cost", "Cash-Flow Planning Note"],
        rows: [
          ["First month rent + 1-month NB security deposit", "$3,600", "2-bedroom apartment in Dieppe / Moncton (~$1,800/mo)"],
          ["Reliable used vehicle + winter tires + NB safety", "$14,500", "Cash purchase avoids 9%+ new-to-Canada auto loans"],
          ["Annual auto + tenant insurance upfront deposit", "$2,800", "Drops significantly when home-country claims letter is accepted"],
          ["Utilities, winter clothing, furniture & groceries (90 days)", "$4,800", "Includes NB Power setup, winter boots/coats & school supplies"],
          ["Emergency buffer + transitional health bridge", "$4,000", "Covers unexpected dental/clinic needs during Medicare card wait"],
          ["Total Realistic 90-Day Settlement Liquidity", "$29,700", "Nearly 5x the minimum AIP proof-of-funds exemption threshold"]
        ]
      },
      notes: [
        "Once both spouses establish Canadian credit and Medicare is active, emergency liquidity needs settle back toward a standard 3-to-6 month essential expense fund.",
        "If one spouse earns lower transitional income while finishing licensing exams, income-splitting benefits like CCB (Canada Child Benefit) start after 18 months of continuous residency or permanent resident arrival depending on immigration status."
      ],
      conclusion:
        "Meeting the minimum immigration bank balance gets your visa approved, but carrying a true 90-day Greater Moncton settlement fund protects your family from starting life in Canada with expensive consumer debt."
    },
    misunderstandings: [
      {
        myth: "Holding an AIP job offer means $4,000 to $6,000 in savings is enough for my entire move.",
        reality:
          "IRCC sets lower proof-of-funds minimums when a job offer exists, not because living costs vanish, but because a paycheque starts soon. Upfront rent deposits, winter transportation, and licensing fees still hit before full cash flow stabilizes."
      },
      {
        myth: "Canadian banks automatically pull my credit score from the US, UK, Nigeria, or France.",
        reality:
          "Credit files are national and do not automatically transfer across borders into Canadian Equifax or TransUnion bureaus. Every newcomer must actively establish Canadian credit lines from scratch."
      },
      {
        myth: "I must immediately move my foreign savings into a Canadian RRSP to lower my year-one taxes.",
        reality:
          "You cannot legally deduct RRSP contributions until you have earned Canadian room on an assessed tax return. Placing year-one surplus cash into a TFSA or FHSA avoids over-contribution penalties."
      }
    ],
    tradeoffs: [
      "Paying cash for an economical used car preserves monthly cash flow and avoids high newcomer loan interest rates, while preserving liquidity via a modest financed balance only makes sense if the interest rate is reasonable and reserves remain intact.",
      "Waiting until month three to open a secured credit card delays Equifax history by a full quarter, potentially affecting mortgage qualification or utility deposits a year later."
    ],
    questions: [
      "If my employer paycheque were delayed by three weeks or my spouse needed six months to complete Canadian licensing, how many months would our cash savings last?",
      "Have we requested official stamped letters from our current foreign insurer and licensing authority before terminating policies abroad?",
      "Which spouse should hold non-registered or TFSA savings first once our SIN numbers arrive?"
    ],
    sources: [
      {
        label: "IRCC - Atlantic Immigration Program (AIP): Settlement Funds Requirements",
        url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/atlantic-immigration/how-to-immigrate/settlement-funds.html",
        note: "Official federal proof-of-funds formula (12.5% of LICO for endorsed job offers)."
      },
      {
        label: "Government of New Brunswick - New Brunswick Medicare Registration & Eligibility",
        url: "https://www2.gnb.ca/content/gnb/en/departments/health/MedicarePrescriptionDrugPlan.html",
        note: "Provincial public health insurance eligibility criteria for new residents and permit holders."
      },
      {
        label: "CRA - Newcomers to Canada: Tax Residency, TFSA & Form T1135 Rules",
        url: "https://www.canada.ca/en/revenue-agency/services/tax/international-non-residents/individuals-leaving-entering-canada-non-residents/newcomers-canada-immigrants.html",
        note: "Official CRA rules on tax residency date, registered account limits, and foreign property reporting."
      }
    ],
    related: [
      "new-to-canada-money-basics",
      "internationally-trained-doctors-nurses-first-year",
      "dieppe-moncton-first-time-homebuyer-fhsa-nb-rebates",
      "fhsa-explained"
    ],
    contactTopic: "newcomers",
    invitationAbout: "planning a structured financial arrival in Dieppe, Moncton, or Atlantic Canada",
    url: "/education/atlantic-canada-newcomer-aip-money-guide",
    readingMinutes: 9,
    datePublished: "2026-11-18T09:00:00-04:00",
    dateModified: "2026-11-18T09:00:00-04:00"
  },
  {
    slug: "new-brunswick-ccpc-corporate-tax-small-business-strategy",
    kind: "insight",
    title: "New Brunswick CCPC Small Business Tax, $50k SBD & Probate Strategy",
    seoTitle: "NB CCPC Corporate Tax & $50k SBD Guide",
    description:
      "How New Brunswick CCPCs protect the 11.5% combined small business tax rate from the $50k passive income grind and use CDA insurance to cut probate fees.",
    question:
      "How does New Brunswick's 11.5% small business tax rate interact with federal passive income clawbacks and provincial estate probate fees?",
    category: "investing",
    figuresAsOf: "2026 New Brunswick & Federal CRA Statutory Corporate Rates",
    problem:
      "New Brunswick Canadian-controlled private corporations (CCPCs), incorporated physicians, and owner-operated businesses enjoy a combined 11.5% corporate tax rate (9.0% federal + 2.5% NB) on their first $500,000 of active business income. Yet retaining surplus GICs or dividend portfolios inside the company past $50,000 of annual passive investment income triggers a $5-for-$1 clawback under Subsection 125(5.1), pushing corporate tax toward 29.0%.",
    overview: [
      "When business owners in Dieppe, Moncton, Fredericton, or Saint John retain profitable cash inside an operating or holding corporation rather than taking high-bracket personal salaries (often taxed around 52.5% at the top combined NB marginal rate), they defer personal tax efficiently.",
      "That 11.5% vs. ~52.5% deferral gap leaves roughly 41 cents more per dollar inside the corporation to reinvest. However, many incorporated professionals accumulate passive investment balances inside the same corporate umbrella without tracking Adjusted Aggregate Investment Income (AAII) on T2 Schedule 7.",
      "Across $50,000 to $150,000 of corporate passive income, every $1 of passive return eliminates $5 of your $500,000 federal Small Business Deduction (SBD) room. Combined with New Brunswick's 0.5% estate probate fee (and Nova Scotia's ~1.695% probate rate), passive corporate surpluses create both annual tax drag and multi-generational estate erosion if left unstructured."
    ],
    sections: [
      {
        id: "nb-sbd-rate",
        h2: "Why Defending New Brunswick's 11.5% Corporate Tax Rate Matters",
        paragraphs: [
          "On the first $500,000 of active business earnings, an eligible New Brunswick CCPC pays 9.0% federal tax plus 2.5% provincial tax, totaling 11.5%. Above $500,000, or once SBD room is clawed back, active earnings jump immediately to New Brunswick's 29.0% combined general corporate rate (15.0% federal + 14.0% provincial).",
          "Notice the practical spread: losing $300,000 of small business limit on active clinic, consulting, or construction profits costs the company an extra 17.5% tax right away, creating an immediate $52,500 corporate tax surcharge that leaves less working capital for equipment, staff, or debt payoff.",
          "Passive corporate investment returns (interest, rental income, foreign dividends, and the taxable 50% share of capital gains) face an initial combined rate near 50.67% inside a New Brunswick corporation (with refundable RDTOH mechanisms returning a portion only when taxable dividends are later paid to shareholders)."
        ]
      },
      {
        id: "ipps-rca-cda",
        h2: "Four Practical Levers to Manage Corporate AAII & Retain Liquidity",
        paragraphs: [
          "Working alongside your New Brunswick CPA, incorporated owners typically evaluate four statutory levers before passive income breaches $50,000:",
          "1. Maximize Personal TFSA and RRSP Shelters First: Paying yourself sufficient T4 salary (up to ~$187,000–$196,000 to generate maximum 2026/2027 RRSP room) shifts future compounding out of the corporate passive-income net and into personal tax-exempt or tax-deferred wrappers.",
          "2. Realize Corporate Capital Gains Selectively: Capital gains inside a CCPC only enter AAII when realized (sold). Emphasizing low-turnover, tax-deferred equity structures inside a corporate account avoids premature passive income spikes compared to corporate GICs generating 100% annual interest.",
          "3. Individual Pension Plans (IPPs) for High-Earning Owners Aged 40+: Employer-funded contributions into a CRA-registered IPP are tax-deductible to the company and grow inside a pension shelter completely outside the $50,000 AAII calculation.",
          "4. Corporate-Owned Permanent Life Insurance & Capital Dividend Account (CDA): Deposits inside an exempt permanent life policy shelter cash value growth from annual AAII taxation. Upon death, the tax-free death benefit minus the policy's Adjusted Cost Basis (ACB) credits the company's Capital Dividend Account, allowing surviving family shareholders in New Brunswick or Nova Scotia to extract substantial proceeds personally at 0% income tax."
        ]
      },
      {
        id: "atlantic-probate",
        h2: "Atlantic Canada Probate Exposure on Corporate Estates",
        paragraphs: [
          "Every Atlantic province taxes estates differently upon death. Under the New Brunswick Probate Court Act, estates exceeding $20,000 pay $5 per $1,000 (0.5%). While 0.5% sounds modest compared to Ontario's ~1.5% Estate Administration Tax or Nova Scotia's ~1.695% probate levy above $100,000, the bigger risk for private company owners is asset freeze delays and double taxation under Subsection 70(5) deemed disposition rules.",
          "At death without a surviving spouse rollover, private company shares are deemed sold at fair market value, potentially triggering immediate personal capital gains tax alongside corporate dividend taxes when heirs pull cash out to pay the CRA (so-called pipeline or subsection 164(6) planning with a CPA must be executed promptly). Naming clear beneficiaries on personal segregated funds/TFSA/RRSP accounts and holding adequate tax-free CDA insurance liquidity prevents forced sale of business real estate or clinic equipment."
        ]
      }
    ],
    checklist: {
      title: "Year-End Corporate Review Checklist for Atlantic CCPC Owners",
      items: [
        "Locate Schedule 7 on your most recent T2 corporate return and confirm your exact Adjusted Aggregate Investment Income (AAII).",
        "Confirm whether combined active corporate income across all associated companies stays under the remaining $500,000 SBD threshold.",
        "Compare after-tax wealth from corporate GIC interest (~50.67% initial tax + AAII grind) vs. drawing salary to fund personal TFSA/RRSP space.",
        "Ask your CPA whether an Individual Pension Plan (IPP) makes mathematical sense if you are aged 40+ earning steady T4 income.",
        "Review corporate shareholder agreements, buy-sell funding, and Capital Dividend Account (CDA) balances with both your CPA and licensed advisor."
      ]
    },
    faqs: [
      {
        question: "What is the combined corporate small business tax rate in New Brunswick?",
        answer:
          "For 2026, a qualifying Canadian-controlled private corporation (CCPC) pays 9.0% federal tax and 2.5% New Brunswick provincial tax, totaling 11.5% on its first $500,000 of active business income. Income above the limit is taxed at 29.0% combined (15.0% federal + 14.0% NB)."
      },
      {
        question: "At what amount of passive income does a New Brunswick business lose the 11.5% rate?",
        answer:
          "Your federal Small Business Deduction ($500,000 limit) begins shrinking once corporate Adjusted Aggregate Investment Income exceeds $50,000 per year, and is completely eliminated at $150,000 under Income Tax Act Subsection 125(5.1)."
      },
      {
        question: "Does New Brunswick follow the federal $50k passive income SBD clawback?",
        answer:
          "Yes, federally incorporated or NB-registered CCPCs still face the federal 15.0% general corporate rate when federal SBD room is ground down, raising combined NB tax from 11.5% toward 29.0% depending on provincial parallel rules and income levels."
      },
      {
        question: "How does a Capital Dividend Account (CDA) help an incorporated family in Moncton or Halifax?",
        answer:
          "The CDA tracks tax-free amounts received by a private corporation, including 50% of realized capital gains and corporate life insurance death benefits minus the policy's Adjusted Cost Basis (ACB). Cash paid out via a CDA capital dividend election (Form T2054) is received 100% tax-free by Canadian resident shareholders."
      }
    ],
    example: {
      title: "Case Study: Dieppe Medical Clinic / Construction CCPC With $100,000 Passive Income",
      intro:
        "Suppose a Moncton incorporated owner generates $450,000 of active business profit alongside $100,000 of passive interest and realized taxable income from retained corporate investments.",
      table: {
        head: ["Metric", "$40,000 Passive Income", "$100,000 Passive Income", "Impact Under ITA 125(5.1)"],
        rows: [
          ["Excess Passive Over $50k", "$0", "$50,000", "Triggers $5-for-$1 federal SBD reduction"],
          ["Available Federal SBD Ceiling", "$500,000", "$250,000", "$5 × $50,000 = $250,000 lost shelter"],
          ["Active Profit Taxed at Low Rate", "$450,000", "$250,000", "$200,000 pushed into higher bracket"],
          ["Extra Active Corporate Tax Due", "$0", "+$35,000 / yr", "Lost federal + provincial integration rate gap"]
        ]
      },
      notes: [
        "Even before personal taxes are triggered, crossing $100,000 of passive income costs this business up to $35,000 in extra active-business tax in a single fiscal year.",
        "Structured coordination with your accountant (salary-dividend mix, IPP contributions, and exempt corporate-owned permanent insurance) evaluates each trade-off mathematically before year-end."
      ],
      conclusion:
        "Corporate cash hoarding inside high-interest accounts can silently penalize your operating company. Proactive tax-integrated planning protects both working capital and your family's tax-free estate transfer."
    },
    misunderstandings: [
      {
        myth: "Corporate passive income rules only hurt massive corporations with $10 million in cash.",
        reality:
          "At a 5.0% GIC or portfolio yield, just $1,000,000 in corporate retained investments creates $50,000 of passive income, right where the $5-for-$1 clawback starts."
      },
      {
        myth: "Holding investments in a separate holding company avoids the $50,000 passive income limit.",
        reality:
          "CRA aggregates passive investment income across all 'associated corporations' controlled by the same owner or related corporate group. Splitting cash into a HoldCo does not reset the $50,000 threshold."
      },
      {
        myth: "Life insurance proceeds paid to a corporation are taxed as corporate income.",
        reality:
          "Life insurance death benefits are received tax-free by the corporation, and the amount exceeding the policy's Adjusted Cost Basis (ACB) is credited to the Capital Dividend Account for tax-free distribution to heirs."
      }
    ],
    tradeoffs: [
      "Tying up excessive working capital inside permanent corporate insurance reduces near-term business liquidity; policy funding should only come from genuinely long-term surplus capital after maintaining a 6-month operating reserve.",
      "Paying yourself higher T4 salary increases CPP contributions and personal tax today, but unlocks precious RRSP contribution space that removes assets permanently from the CCPC passive income calculation."
    ],
    questions: [
      "How close was your corporation's Schedule 7 passive investment income to $50,000 on last year's T2 return?",
      "If you passed away unexpectedly this year, how much cash would your estate need to settle subsection 70(5) deemed disposition tax on your corporate shares?",
      "Are your excess corporate profits sitting in fully taxable GICs while personal TFSA/FHSA/RRSP contribution limits sit unused?"
    ],
    sources: [
      {
        label: "CRA - Corporate Income Tax Rates: Small Business Deduction & Provincial Tables (New Brunswick)",
        url: "https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/corporations/corporation-tax-rates.html",
        note: "Official 9.0% federal small business rate alongside 2.5% NB provincial small business and 14.0% general rate."
      },
      {
        label: "Income Tax Act Subsection 125(5.1) - Business Limit Reduction (Passive Income Grind)",
        url: "https://laws-lois.justice.gc.ca/eng/acts/I-3.3/section-125.html",
        note: "Statutory $5-for-$1 clawback above $50,000 Adjusted Aggregate Investment Income."
      },
      {
        label: "CRA - Capital Dividend Account (CDA) & Form T2054 Election",
        url: "https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/corporations/corporate-income-tax-return/schedule-89.html",
        note: "Official mechanism allowing tax-free extraction of capital dividends to Canadian shareholders."
      }
    ],
    related: [
      "canadian-ccpc-passive-income-grind-sbd-tax-trap",
      "corporate-passive-income-trap-50000-clawback-rule",
      "term-vs-permanent-life-insurance",
      "tfsa-vs-rrsp"
    ],
    contactTopic: "business",
    invitationAbout: "coordinating New Brunswick corporate tax efficiency, passive limits, and estate liquidity",
    url: "/insights/new-brunswick-ccpc-corporate-tax-small-business-strategy",
    readingMinutes: 10,
    datePublished: "2026-11-18T09:00:00-04:00",
    dateModified: "2026-11-18T09:00:00-04:00"
  },
  {
    slug: "halal-tfsa-rrsp-fhsa-investing-canada",
    kind: "guide",
    title: "Halal Investing in Canada: TFSA, RRSP, FHSA & Zakah Guide",
    seoTitle: "Halal TFSA, RRSP & FHSA Investing Canada",
    description:
      "How Canadian Muslims invest without Riba: AAOIFI equity screening, dividend purification, and Zakah rules for TFSA, RRSP, and FHSA.",
    question:
      "How can Muslims in Canada invest inside a TFSA, RRSP, FHSA, or RESP without earning interest (Riba) and accurately calculate annual Zakah?",
    category: "investing",
    figuresAsOf: "AAOIFI Standard 21 & 2026 CRA Registered Account Rules",
    problem:
      "When Canadian banks promote 'safe' TFSA, FHSA, or RESP accounts, the default recommendation is almost always a Guaranteed Investment Certificate (GIC), bond fund, or High-Interest Savings Account, all of which generate interest (Riba). Without understanding Shari'ah equity screening and how Zakah treats locked-in vs. liquid registered shelters, many families leave tens of thousands sitting uninvested in zero-interest chequing accounts losing purchasing power to inflation.",
    overview: [
      "Canadian tax law does not require registered accounts like the TFSA, RRSP, FHSA, or RESP to hold interest-bearing bonds or conventional balanced funds. Those acronyms simply describe tax containers defined under the Income Tax Act.",
      "Inside those exact same CRA containers, Muslim households, physicians, and business owners can hold global equities screened under internationally recognized AAOIFI (Accounting and Auditing Organization for Islamic Financial Institutions) Shari'ah standards, including institutional index strategies and life-insurer segregated fund contracts aligned with benchmarks such as the MSCI ACWI Islamic Index.",
      "Understanding the two-tier AAOIFI screen, handling dividend purification, and applying clear scholarly principles for annual Zakah lets families invest consistently across both short-term home goals and 25-year retirement horizons."
    ],
    sections: [
      {
        id: "two-tier-aaoifi",
        h2: "Inside the Two-Tier AAOIFI Screening Standard",
        paragraphs: [
          "Islamic equity screening removes prohibited industries while recognizing that global public operating companies interact within modern corporate banking infrastructure. Independent Shari'ah Supervisory Boards apply two sequential filters every quarter:",
          "Tier 1 (Qualitative Sector Screening): Any company whose primary operating business involves conventional interest-based banking/insurance (Riba), gambling, alcohol, pork products, adult entertainment, tobacco, or certain weapons manufacturing is strictly excluded.",
          "Tier 2 (Quantitative Financial Ratio Screening under 33.33% Rule): Surviving companies are audited against balance-sheet ratios based on trailing market capitalization or total assets: Total interest-bearing debt must stay below 33.33%, cash plus interest-bearing securities must stay below 33.33%, and any minor incidental non-permissible interest revenue must stay strictly below 5% of total revenue."
        ]
      },
      {
        id: "purification-zakah",
        h2: "Dividend Purification & Zakah Across Canadian Registered Accounts",
        paragraphs: [
          "Holding compliant shares involves two distinct charitable obligations that investors should never confuse: Dividend Purification and Annual Zakah.",
          "Dividend Purification removes the tiny fraction (for example, 0.2% to 1.5%) of non-permissible interest income earned by an otherwise halal corporation on its working cash. Index administrators publish periodic purification ratios showing how much per share or per dividend to donate directly to clean the payout (note: this purification charity cannot intentionally claim personal tax enrichment where scholarly consensus requires pure disposal).",
          "Annual Zakah (2.5% per lunar Hawl year above the Nisab threshold) applies to personal Zakatable wealth. How it applies to Canadian accounts depends on account liquidity and scholarly methodology: funds held inside a TFSA or accessible non-registered equity are immediately liquid net of zero exit taxes, so scholars treat either full Zakatable asset ratio (for short-term trading) or the underlying liquid net zakatable asset proportion (often 25% to 30% proxy for long-term equity holdings, or 2.5% of total market value under the simpler total-value view). For RRSPs where early withdrawal triggers immediate 20% to 50% marginal income tax withholding, contemporary Fiqh councils permit paying Zakah only on the net accessible after-tax balance, or on actual withdrawals upon retirement if locked-in like a LIRA."
        ]
      },
      {
        id: "account-matching",
        h2: "Matching Halal Vehicles Across TFSA, FHSA, RRSP & Segregated Funds",
        paragraphs: [
          "Your asset mix still needs to match your time horizon. A TFSA or FHSA intended for a first-home purchase in Dieppe, Halifax, or Ottawa within 18 months should not sit 100% in volatile global equities, even if halal: short-term funds require stable non-interest cash custody or Islamic commercial alternatives.",
          "For 10-to-30-year retirement, children's university (RESP), or corporate surplus building, broadly diversified AAOIFI-screened global equity funds inside a TFSA, RRSP, or RESP compound free of annual dividend/capital gains tax drag. Where families also want probate bypass and maturity guarantees, insurance-based segregated fund contracts (such as iA Financial Group's Shari'ah-compliant equity mandate sub-advised by BlackRock) pair institutional index screening with named-beneficiary estate protection."
        ]
      }
    ],
    checklist: {
      title: "Halal Registered Investing Implementation Checklist",
      items: [
        "Confirm whether each CRA account (TFSA, RRSP, FHSA, RESP) needs immediate 1-to-3-year cash safety or 7+ year equity compounding.",
        "Verify that selected equity funds or segregated fund options follow published AAOIFI / Shari'ah Supervisory Board screening.",
        "If holding existing conventional interest-bearing RRSPs or TFSAs, use direct institution-to-institution Form T2033 (RRSP) or RC240 (TFSA) so transfers avoid tax or lost room.",
        "Set an annual calendar reminder aligned with Ramadan or your Hawl date to compute both dividend purification and Zakah consistently.",
        "Consult a qualified Islamic scholar regarding your preferred Zakah valuation method for locked-in pensions (LIRA) vs. liquid TFSAs."
      ]
    },
    faqs: [
      {
        question: "Can a TFSA, RRSP, or FHSA in Canada be halal if I don't hold GICs or bonds?",
        answer:
          "Yes. TFSA, RRSP, FHSA, and RESP are strictly tax-registration statuses with the CRA, not interest-bearing products. Holding 100% Shari'ah-compliant equity funds or interest-free cash inside these accounts makes them tax-sheltered without earning Riba."
      },
      {
        question: "Do I lose my TFSA room if I transfer out of a conventional bank GIC into a halal investment?",
        answer:
          "Not if done as a direct registered transfer. Using CRA's issuer-to-issuer transfer process moves your TFSA (or RRSP via Form T2033) directly between institutions without withdrawing funds or forfeiting lifetime contribution space."
      },
      {
        question: "Do I pay Zakah on my Canadian RRSP and TFSA every year?",
        answer:
          "Under prevailing contemporary Fiqh rulings, liquid TFSA savings that you can access anytime are Zakatable annually (consulting a scholar on full market value vs. underlying liquid corporate assets). For an RRSP, because withdrawing funds triggers immediate Canadian income tax, many scholars allow calculating Zakah on the estimated after-tax net value (after marginal tax) rather than the gross pre-tax figure."
      },
      {
        question: "Are there halal RESP options for my children's education grants (CESG)?",
        answer:
          "Yes. While the 20% federal Canada Education Savings Grant ($500/yr per $2,500 contributed) can go into an eligible RESP holding screened Islamic equities or non-interest cash, confirm that any default government-bond money-market sweep inside your provider's platform is disabled."
      }
    ],
    example: {
      title: "Hypothetical 15-Year Purchasing Power: Zero-Interest Cash vs. Screened Global Equity (TFSA)",
      intro:
        "Consider Nadia, a pharmacist in Moncton holding $20,000 initially plus $450/month inside her TFSA over 15 years ($101,000 total out-of-pocket principal). Compare leaving those dollars in 0% non-interest bank cash vs. compounding inside a diversified AAOIFI-screened equity fund at a hypothetical 6.0% net annual return after fees, under 2.5% annual inflation.",
      table: {
        head: ["15-Year TFSA Approach", "Total Cash Contributed", "Nominal End Value", "Real Purchasing Power (After 2.5% Inflation)", "Annual Tax Drag Inside TFSA"],
        rows: [
          ["Zero-Interest Bank Cash (0%)", "$101,000", "$101,000", "~$69,700 (eroded by inflation)", "$0 (No growth)"],
          ["Screened Islamic Equity (6.0% net hypothetical)", "$101,000", "~$178,400", "~$123,200 (real purchasing gain)", "$0 (Tax-free TFSA shelter)"]
        ]
      },
      notes: [
        "All investment return figures above are hypothetical illustrations only. Global equities fluctuate year-to-year and carry market downturn risk over short time horizons.",
        "Leaving 15-year capital in 0% bank cash protects nominal dollar value while steadily sacrificing roughly 31% of household purchasing power to 2.5% compound inflation."
      ],
      conclusion:
        "Avoiding Riba does not require accepting silent inflation erosion. Compliant global equity screening allows long-term Canadian households to deploy TFSA, RRSP, and RESP tax shelters ethically."
    },
    misunderstandings: [
      {
        myth: "All Canadian stock market and mutual fund investments involve Riba.",
        reality:
          "Dividends and equity appreciation represent fractional ownership in real operating businesses (software, healthcare, manufacturing, energy infrastructure). When audited under AAOIFI sector and <33.33% debt screens, equity ownership is permissible while pure interest lending (bonds/GICs) is excluded."
      },
      {
        myth: "A Shari'ah-compliant equity fund guarantees positive returns every single year.",
        reality:
          "No equity portfolio guarantees principal or steady returns. Screenable stocks remain subject to normal equity market volatility and drawdowns, which is why time horizons shorter than 3 to 5 years generally require stable liquid reserves."
      },
      {
        myth: "You must pay Zakah AND 2.5% charity out of pocket even on money locked inside an employer DB pension.",
        reality:
          "Funds you have zero legal control or access to withdraw (such as an active employer defined-benefit pension) generally do not become Zakatable until disbursed into your possession under most contemporary rulings."
      }
    ],
    tradeoffs: [
      "Concentrated global Islamic equity portfolios often carry higher allocation to technology, healthcare, and industrials because conventional financials/banks are excluded, increasing sector concentration risk compared to broad TSX/S&P indexes.",
      "Holding halal investments inside a life-insurance segregated fund contract adds higher MER management cost than a DIY brokerage ETF in exchange for maturity/death guarantees, named-beneficiary probate bypass, and potential creditor protection."
    ],
    questions: [
      "How much purchasing power have your zero-interest savings lost over the past five years?",
      "If you hold existing conventional TFSA or RRSP accounts, do you know how to initiate a tax-free Form RC240 or T2033 transfer rather than withdrawing cash manually?",
      "Do you have a consistent annual calculation method for both dividend purification and Zakah?"
    ],
    sources: [
      {
        label: "AAOIFI Shari'ah Standards - Standard 21 (Financial Papers: Shares and Bonds)",
        url: "https://aaoifi.com/shariah-standards/?lang=en",
        note: "International Islamic finance standard setting business activity and <33.33% debt/interest balance-sheet caps."
      },
      {
        label: "CRA - Registered Transfer Procedures (Form T2033 for RRSP / Form RC240 for TFSA)",
        url: "https://www.canada.ca/en/revenue-agency/services/forms-publications/forms/t2033.html",
        note: "Direct institution-to-institution rollover mechanism preserving tax deferral and contribution limits."
      },
      {
        label: "Ahmed Bello - Islamic Equity Investing Educational Hub & Compounding Simulator",
        url: "https://www.ahmedbello.com/investing/islamic-equity",
        note: "Interactive Canadian purchasing-power simulator and detailed AAOIFI breakdown."
      }
    ],
    related: [
      "tfsa-vs-rrsp",
      "investment-risk-vs-goal-risk",
      "fhsa-explained",
      "resp-basics"
    ],
    contactTopic: "investing",
    invitationAbout: "structuring Shari'ah-compliant equity inside TFSA, RRSP, FHSA, or corporate accounts",
    url: "/education/halal-tfsa-rrsp-fhsa-investing-canada",
    readingMinutes: 10,
    datePublished: "2026-11-18T09:00:00-04:00",
    dateModified: "2026-11-18T09:00:00-04:00"
  },
  {
    slug: "dieppe-moncton-first-time-homebuyer-fhsa-nb-rebates",
    kind: "guide",
    title: "First-Time Homebuyer Strategy in Dieppe, Moncton & New Brunswick",
    seoTitle: "Dieppe & Moncton First-Time Homebuyer NB",
    description:
      "Closing cash in Dieppe & Moncton, NB: 1.0% Real Property Transfer Tax (no first-time exemption), $100k FHSA + HBP stacking, and 25% CMHC Eco refund.",
    question:
      "How much cash do first-time buyers in Dieppe, Moncton, and New Brunswick actually need on closing day, and how do FHSA, HBP, and CMHC refunds fit together?",
    category: "registered-accounts",
    figuresAsOf: "2026 New Brunswick Real Property Transfer Tax & CRA Limits",
    problem:
      "First-time home buyers across Dieppe, Moncton, and Riverview routinely budget strictly for a 5% down payment based on national personal-finance calculators. Because New Brunswick assesses a 1.0% provincial Real Property Transfer Tax with zero broad first-time homebuyer exemption (unlike Ontario or PEI), many buyers face an unexpected $4,000+ cash shortfall at the lawyer's office days before closing.",
    overview: [
      "Greater Moncton continues to attract local young families, healthcare staff, and relocating Canadians because detached and semi-detached prices in Dieppe, Riverview, and Moncton allow realistic entry compared with major metropolitan markets.",
      "Still, saving for closing requires understanding New Brunswick's exact closing rules alongside federal tax shelters. Unlike Ontario (up to $4,000 first-time land transfer rebate) or Prince Edward Island (full first-time buyer transfer tax exemption up to statutory limits), New Brunswick requires 1.0% cash upfront on the greater of the purchase price or municipal property assessment.",
      "Coordinating the First Home Savings Account (FHSA), the $60,000 RRSP Home Buyers' Plan (HBP), New Brunswick's non-refundable Home Buyers' Amount federal credit, and the CMHC Eco Plus 25% insurance refund turns closing day from a liquidity scramble into a disciplined plan."
    ],
    sections: [
      {
        id: "nb-closing-math",
        h2: "New Brunswick's 1.0% Transfer Tax & Real Dieppe Closing Costs",
        paragraphs: [
          "Under New Brunswick's Real Property Transfer Tax Act, buyers pay 1.0% of the purchase price (or assessed value, whichever is higher) upon registering the deed through Service New Brunswick. On a $425,000 semi-detached or single-family home in Dieppe or Moncton North, that transfer tax alone is $4,250 payable in cash.",
          "When you add legal fees and title registration (~$1,600 to $2,200), a home inspection ($500 to $700), title insurance, and property tax / water utility adjustments, a Greater Moncton buyer typically needs 1.8% to 2.2% of the purchase price strictly in closing cash, entirely separate from their 5% minimum down payment.",
          "Importantly, lender rules mandate that you verify minimum closing cost capacity (often called 'closing cost verification' equal to 1.5% of the purchase price in bank statements) prior to final mortgage commitment."
        ]
      },
      {
        id: "stacking-fhsa-hbp",
        h2: "Pooling $40k FHSA + $60k HBP + CMHC 25% Eco Plus Refund",
        paragraphs: [
          "Opening your First Home Savings Account (FHSA) early creates an $8,000/year tax-deductible room clock ($40,000 lifetime cap, carrying forward up to $8,000 of unused room only after opening). When used for a qualifying first home in New Brunswick, every dollar of FHSA principal plus investment growth comes out 100% tax-free with zero repayment required.",
          "Better yet, federal rules let an individual stack the $40,000 FHSA alongside up to $60,000 under the RRSP Home Buyers' Plan (expanded from $35,000, with the initial repayment grace period extended to 5 years for eligible withdrawals). Two buying partners can theoretically combine up to $200,000 across registered accounts before touching non-registered savings.",
          "If purchasing an energy-efficient new build in Dieppe or retrofitting an existing home meeting ENERGY STAR or EnerGuide thresholds, insured buyers (under 20% down) should apply within 24 months of mortgage closing for the CMHC Eco Plus program, which refunds 25% of your mortgage default insurance premium directly as cash (often worth $3,500 to $4,500)."
        ]
      },
      {
        id: "protect-the-mortgage",
        h2: "Don't Confuse Bank Creditor Insurance With Individual Term Life",
        paragraphs: [
          "Right after signing mortgage paperwork in Moncton or Dieppe, banks routinely offer creditor mortgage insurance billed on top of the bi-weekly mortgage payment. Under creditor insurance, coverage declines automatically as you pay down principal, the bank is the sole beneficiary, and full underwriting often happens only after a claim is filed ('post-claim underwriting').",
          "By contrast, an individually underwritten 20-year or 25-year level term life policy keeps a locked death benefit payout (for example, $500,000 throughout the full 20-year term), pays out 100% tax-free directly to your spouse or named family beneficiaries rather than the bank, and stays portable even if you switch lenders at renewal to get a sharper rate."
        ]
      }
    ],
    checklist: {
      title: "New Brunswick Homebuyer Cash & Closing Readiness Checklist",
      items: [
        "Open an FHSA immediately if buying within 5 years so the annual $8,000 room clock begins accumulating.",
        "Budget 5% down payment PLUS 2.0% dedicated closing cash (including 1.0% NB Real Property Transfer Tax).",
        "Confirm any RRSP contributions intended for HBP withdrawal have remained in the RRSP for at least 90 days prior to closing.",
        "Verify whether new-construction builders or EnerGuide audits qualify your insured mortgage for the 25% CMHC Eco Plus premium refund.",
        "Claim the federal First-Time Home Buyers' Tax Credit ($10,000 amount yielding $1,400–$1,500 tax relief on T1 Schedule 1) on your purchase year return.",
        "Compare individual level term life insurance quotes against lender mortgage creditor insurance before waiving coverage."
      ]
    },
    faqs: [
      {
        question: "How much is property transfer tax in Dieppe and Moncton for first-time buyers?",
        answer:
          "New Brunswick assesses a flat 1.0% Real Property Transfer Tax on the greater of purchase price or assessed property value. New Brunswick does not currently provide a provincial first-time buyer exemption on this 1.0% tax."
      },
      {
        question: "Can I use both the FHSA and the $60,000 Home Buyers' Plan (HBP) on the same NB home?",
        answer:
          "Yes. You can withdraw both your full FHSA balance (tax-free, no repayment) and up to $60,000 per person from your RRSP under the Home Buyers' Plan (tax-free if repaid over 15 years) for the exact same qualifying home purchase."
      },
      {
        question: "How does the 25% CMHC Eco Plus refund work in New Brunswick?",
        answer:
          "If your down payment is under 20% and you hold CMHC-insured financing on a qualifying energy-efficient home or certified retrofit, you can submit documentation to CMHC within 24 months of the mortgage closing date to receive a 25% refund on your mortgage default insurance premium."
      },
      {
        question: "What minimum cash total should I keep on hand for a $425,000 house in Dieppe?",
        answer:
          "With a minimum 5% down payment ($21,250) plus ~1.8% to 2.0% closing cash ($4,250 NB transfer tax + ~$2,500 legal/inspection/adjustments), plan to hold roughly $28,000 to $30,000 in accessible liquid funds before moving day."
      }
    ],
    example: {
      title: "Dieppe First-Time Purchase: $425,000 Home Closing & Tax Shelter Illustration",
      intro:
        "Consider Marc and Claire buying a $425,000 home in Dieppe, NB with 5% down ($21,250), insured via CMHC (4.0% premium = $16,150 added to mortgage). They accumulated $18,000 in an FHSA and $12,000 in an RRSP over the prior three years.",
      table: {
        head: ["Closing & Funding Component", "Dollar Amount", "New Brunswick / Federal Rule Applied"],
        rows: [
          ["Minimum 5% Down Payment", "$21,250", "Funded from FHSA ($18,000) + $3,250 RRSP HBP (Zero tax due)"],
          ["NB Real Property Transfer Tax (1.0%)", "$4,250", "Mandatory NB closing cash (no provincial 1st-time buyer exemption)"],
          ["Legal Fees, Inspection & Utility Adjustments", "$2,750", "Covered comfortably out of remaining $8,750 RRSP HBP / cash buffer"],
          ["Total Cash Needed on Closing Day", "$28,250", "Fully covered ($30k combined FHSA + HBP leaves $1,750 moving cushion)"],
          ["Federal First-Time Buyer Credit + FHSA Tax Refunds", "+$5,900 combined value", "Tax refunds earned during contribution years + closing-year credit"],
          ["Potential CMHC Eco Plus 25% Refund", "+$4,038 cash rebate", "If property holds qualifying ENERGY STAR / EnerGuide certificate within 24 mos"]
        ]
      },
      notes: [
        "Notice how New Brunswick's 1.0% transfer tax increases actual closing cash needed by 20% compared to down payment alone ($28,250 vs. $21,250).",
        "Always check current NB property tax assessment rates per $100 of assessment in Dieppe vs. Moncton or Riverview, since municipal property taxes vary meaningfully between municipalities."
      ],
      conclusion:
        "Planning both your down payment and New Brunswick's 1.0% closing tax inside the FHSA and RRSP HBP prevents last-minute bridge borrowing and captures thousands in combined tax and CMHC rebates."
    },
    misunderstandings: [
      {
        myth: "New Brunswick waives land transfer tax for first-time buyers just like Ontario does.",
        reality:
          "New Brunswick charges its full 1.0% Real Property Transfer Tax to first-time buyers as well as repeat buyers."
      },
      {
        myth: "I can deposit $8,000 into my RRSP three days before closing and withdraw it tax-free under the HBP.",
        reality:
          "CRA requires funds contributed to an RRSP to stay inside the plan for at least 90 days before an HBP withdrawal to remain tax-deductible. Note that the FHSA has no identical 90-day waiting requirement, though lender proof-of-funds history still applies."
      },
      {
        myth: "The bank's mortgage life insurance is cheaper and safer than getting my own policy.",
        reality:
          "Bank creditor insurance shrinks as your mortgage shrinks, locks you to that lender's coverage structure, and frequently underwrites health history only after death rather than upfront."
      }
    ],
    tradeoffs: [
      "Putting 5% down preserves emergency reserves and avoids draining your entire TFSA, though it incurs a 4.0% CMHC insurance premium added to the mortgage compared to 2.8% at 15% down or 0% at 20% down.",
      "Tapping your RRSP via the HBP boosts closing cash today, while requiring disciplined 1/15th annual repayments over 15 years after the 5-year grace window."
    ],
    questions: [
      "Does your home savings plan account separately for both the 5% down payment AND New Brunswick's 1.0% transfer tax in cash?",
      "If you and your partner are buying together in Greater Moncton, have both of you opened individual FHSAs before year-end?",
      "Would an individual level term life policy protect your family for less per month (and with stronger beneficiary control) than bank creditor insurance?"
    ],
    sources: [
      {
        label: "Service New Brunswick - Real Property Transfer Tax Act (1.0% Provincial Transfer Tax)",
        url: "https://www2.gnb.ca/content/gnb/en/services/services_renderer.16435.Real_Property_Transfer_Tax.html",
        note: "Official NB provincial transfer tax calculation and registration fee schedule."
      },
      {
        label: "CRA - First Home Savings Account (FHSA) & Home Buyers' Plan (HBP) Rules",
        url: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/first-home-savings-account.html",
        note: "Official $8,000/yr ($40,000 lifetime) FHSA rules and qualifying withdrawal stacking with $60,000 HBP."
      },
      {
        label: "CMHC - Eco Plus Mortgage Loan Insurance 25% Premium Refund Program",
        url: "https://www.cmhc-schl.gc.ca/professionals/project-funding-and-mortgage-financing/mortgage-loan-insurance/mortgage-loan-insurance-homeownership-programs/cmhc-eco-plus",
        note: "Official 25% rebate eligibility within 24 months of mortgage closing for energy-efficient homes."
      }
    ],
    related: [
      "fhsa-vs-hbp-first-time-home-buyer-stacking",
      "fhsa-explained",
      "canadian-mortgage-renewal-shock-liquidity-trap",
      "term-vs-permanent-life-insurance"
    ],
    contactTopic: "families",
    invitationAbout: "coordinating your first home purchase, FHSA/HBP stacking, and family protection in Dieppe, Moncton, or NB",
    url: "/education/dieppe-moncton-first-time-homebuyer-fhsa-nb-rebates",
    readingMinutes: 10,
    datePublished: "2026-11-18T09:00:00-04:00",
    dateModified: "2026-11-18T09:00:00-04:00"
  }
];
