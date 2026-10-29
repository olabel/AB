import { Article, Category, DecisionMapData, HowIHelpTopic, AboutData } from "./types.ts";

export const categories: Category[] = [
  {
    "id": "registered-accounts",
    "label": "Canadian registered accounts",
    "blurb": "TFSA, RRSP, FHSA and RESP rules and trade-offs."
  },
  {
    "id": "investing",
    "label": "Investing fundamentals",
    "blurb": "Risk, time horizon and what the vocabulary actually means."
  },
  {
    "id": "protection",
    "label": "Financial protection",
    "blurb": "Income, insurance concepts and what they do and don't cover."
  },
  {
    "id": "debt-credit",
    "label": "Debt and credit",
    "blurb": "Credit, repayment choices and formal options."
  },
  {
    "id": "family",
    "label": "Family finances",
    "blurb": "Education savings and household priorities."
  },
  {
    "id": "retirement",
    "label": "Retirement",
    "blurb": "Public pensions, timing and income sources."
  },
  {
    "id": "newcomers",
    "label": "New to Canada",
    "blurb": "How the Canadian system works, from day one."
  },
  {
    "id": "decision-making",
    "label": "Financial decision-making",
    "blurb": "Frameworks for choosing, and questions to ask first."
  }
];

export const decisionMap: DecisionMapData = {
  "nodes": [
    {
      "id": "accounts",
      "label": "Registered accounts",
      "x": 280,
      "y": 64,
      "label_dx": 0,
      "label_dy": -40,
      "anchor": "middle"
    },
    {
      "id": "retirement",
      "label": "Retirement savings",
      "x": 462,
      "y": 150,
      "label_dx": 0,
      "label_dy": -40,
      "anchor": "middle"
    },
    {
      "id": "education",
      "label": "Children’s education",
      "x": 462,
      "y": 290,
      "label_dx": 0,
      "label_dy": 50,
      "anchor": "middle"
    },
    {
      "id": "protection",
      "label": "Protecting household income",
      "x": 280,
      "y": 356,
      "label_dx": 0,
      "label_dy": 50,
      "anchor": "middle"
    },
    {
      "id": "debt",
      "label": "Saving vs. paying down debt",
      "x": 98,
      "y": 290,
      "label_dx": 0,
      "label_dy": 50,
      "anchor": "middle"
    },
    {
      "id": "risk",
      "label": "Investment risk",
      "x": 98,
      "y": 150,
      "label_dx": 0,
      "label_dy": -40,
      "anchor": "middle"
    }
  ],
  "edges": [
    {
      "a": "debt",
      "b": "accounts",
      "text": "Whether to use available room before or after paying down a debt depends on the debt’s interest rate, the account’s tax treatment, and how soon you might need the money."
    },
    {
      "a": "debt",
      "b": "protection",
      "text": "Debt payments and savings goals both assume income keeps arriving. If it stopped, which commitments would be hardest to keep?"
    },
    {
      "a": "debt",
      "b": "retirement",
      "text": "A dollar sent to debt is a dollar not saved for retirement, and the reverse. The trade-off changes with the rate you pay and the years you have."
    },
    {
      "a": "accounts",
      "b": "education",
      "text": "An RESP is one registered way to save for education, and it competes for cash with the RRSP, TFSA and FHSA."
    },
    {
      "a": "accounts",
      "b": "retirement",
      "text": "The RRSP and TFSA are both common retirement vehicles, taxed at different moments. Which one comes first can change what you keep."
    },
    {
      "a": "accounts",
      "b": "risk",
      "text": "An account is a container. The same account can hold cash or growth investments, so risk is a separate decision from the account."
    },
    {
      "a": "risk",
      "b": "retirement",
      "text": "Time horizon changes how much short-term movement matters, but so does the risk of saving too little to meet the goal."
    },
    {
      "a": "risk",
      "b": "education",
      "text": "A fixed date, like a first tuition payment, shortens the horizon and changes how much movement the plan can absorb."
    },
    {
      "a": "protection",
      "b": "retirement",
      "text": "Retirement savings are usually funded from working income, so a long interruption to that income affects both the present and the future."
    },
    {
      "a": "protection",
      "b": "education",
      "text": "If a parent’s income stopped, would education savings continue? Protection and savings goals depend on each other."
    }
  ]
};

export const howIHelpTopics: HowIHelpTopic[] = [
  {
    "id": "priorities",
    "short": "Prioritizing goals",
    "question": "How should I prioritize my financial goals?",
    "why": "Money is finite and goals compete. Without an order, the urgent crowds out the important, and the choice of account or product gets made before the question it was meant to answer.",
    "concepts": [
      {
        "term": "Cash flow",
        "plain": "What comes in, what goes out, and what is left to direct."
      },
      {
        "term": "Emergency buffer",
        "plain": "Money set aside so a surprise does not turn into debt."
      },
      {
        "term": "Cost of debt",
        "plain": "The interest you pay, set against what saving could earn or save in tax."
      },
      {
        "term": "Time horizon",
        "plain": "When each goal needs the money, which changes how it should be held."
      }
    ],
    "tradeoffs": [
      "Repaying debt gives a certain result but reduces flexibility. Saving keeps cash available but may earn less than the interest you pay.",
      "Sequencing goals means some of them wait. The trade-off is deciding which, and for how long.",
      "A plan you will actually follow can matter more than one that looks optimal on paper."
    ],
    "next": [
      {
        "label": "Read: Pay down debt or save?",
        "href": "/insights/savings-or-debt-first"
      }
    ],
    "contactTopic": "education"
  },
  {
    "id": "accounts",
    "short": "Registered accounts",
    "question": "What should I understand before choosing a registered account?",
    "why": "The TFSA, RRSP, FHSA and RESP can each shelter investments from tax, but at different moments and under different rules. Choosing by habit, or by whatever was offered first, can cost flexibility or tax you did not intend to give up.",
    "concepts": [
      {
        "term": "Contribution room",
        "plain": "How much the rules allow you to put in, and how that room builds."
      },
      {
        "term": "Deduction or tax-free growth",
        "plain": "Tax relief now, or tax-free withdrawals later."
      },
      {
        "term": "Qualifying withdrawals",
        "plain": "What the money may be used for, and what happens if it is used for something else."
      },
      {
        "term": "What you hold inside",
        "plain": "An account is a container, not an investment."
      }
    ],
    "tradeoffs": [
      "Flexibility and tax treatment pull in different directions.",
      "Your future tax rate is an estimate, so any comparison is an estimate too.",
      "Several accounts compete for the same dollars."
    ],
    "next": [
      {
        "label": "Read: TFSA vs RRSP",
        "href": "/education/tfsa-vs-rrsp"
      },
      {
        "label": "Read: The FHSA explained",
        "href": "/education/fhsa-explained"
      }
    ],
    "contactTopic": "accounts"
  },
  {
    "id": "income",
    "short": "Protecting income",
    "question": "How much of my household income depends on my ability to work?",
    "why": "Savings plans, mortgages and education goals all assume your income continues. Illness, disability or death can interrupt it, and most households have never measured the gap.",
    "concepts": [
      {
        "term": "Income gap",
        "plain": "Essential expenses minus the income that would continue."
      },
      {
        "term": "Existing coverage",
        "plain": "Employer benefits, loan coverage and public programs, and when each one ends."
      },
      {
        "term": "Types of coverage",
        "plain": "Life, disability and critical illness insurance respond to different events."
      },
      {
        "term": "Definitions",
        "plain": "What counts as a disability or a covered condition varies from policy to policy."
      }
    ],
    "tradeoffs": [
      "Coverage costs money, and the right amount depends on the gap rather than a rule of thumb.",
      "Term and permanent coverage serve different purposes at different costs.",
      "Answers to health questions at application matter: incomplete answers can affect a claim."
    ],
    "next": [
      {
        "label": "Read: How much income depends on you?",
        "href": "/education/income-depends-on-you"
      }
    ],
    "contactTopic": "protection"
  },
  {
    "id": "investing",
    "short": "Before investing",
    "question": "What should I know before making an investment decision?",
    "why": "Investment decisions are easy to make on a good day and hard to live with on a bad one. Understanding risk, time horizon and cost first makes the decision, and your reaction to it, steadier.",
    "concepts": [
      {
        "term": "Time horizon",
        "plain": "When you will need the money."
      },
      {
        "term": "Risk tolerance and capacity",
        "plain": "How much movement you can accept, and how much your finances can absorb."
      },
      {
        "term": "Diversification",
        "plain": "Spreading money so that no single holding decides the outcome."
      },
      {
        "term": "Fees",
        "plain": "What you pay every year, and how that adds up over time."
      }
    ],
    "tradeoffs": [
      "Higher expected returns come with a wider range of outcomes.",
      "Safe-looking choices carry a different risk: falling short of the goal.",
      "Complexity can add features and cost. Make sure you need the feature."
    ],
    "next": [
      {
        "label": "Read: Investment risk vs goal risk",
        "href": "/education/investment-risk-vs-goal-risk"
      }
    ],
    "contactTopic": "investing"
  },
  {
    "id": "education",
    "short": "Children’s education",
    "question": "How can I prepare for my children’s education?",
    "why": "Education costs have a fixed date and a long runway, so the planning horizon is unusually clear. An RESP adds a government grant, but only if you understand how it works.",
    "concepts": [
      {
        "term": "RESP",
        "plain": "A registered account for post-secondary education savings."
      },
      {
        "term": "Canada Education Savings Grant",
        "plain": "A government contribution on eligible RESP deposits, with annual and lifetime limits."
      },
      {
        "term": "Education assistance payments",
        "plain": "How growth and grants are paid out and taxed."
      },
      {
        "term": "If plans change",
        "plain": "What happens when a child does not pursue further education."
      }
    ],
    "tradeoffs": [
      "The money is earmarked, so flexibility is lower.",
      "Contributions are not deductible and compete with other goals.",
      "Starting early helps, but so does contributing only what you can sustain."
    ],
    "next": [
      {
        "label": "Read: RESP basics",
        "href": "/education/resp-basics"
      }
    ],
    "contactTopic": "family"
  },
  {
    "id": "retirement",
    "short": "Approaching retirement",
    "question": "What should I consider as retirement approaches?",
    "why": "Retirement turns saving into spending, and several decisions interact: when to start CPP and OAS, and how to draw from an RRSP, a RRIF and a TFSA. Many are hard to undo.",
    "concepts": [
      {
        "term": "Income sources",
        "plain": "Public pensions, workplace plans, RRSP or RRIF, TFSA and other savings."
      },
      {
        "term": "Start-age choices",
        "plain": "CPP and OAS amounts change with when you start."
      },
      {
        "term": "Longevity and inflation",
        "plain": "A plan has to last, and costs rise over time."
      },
      {
        "term": "Tax in retirement",
        "plain": "How withdrawals are taxed and how they affect income-tested benefits."
      }
    ],
    "tradeoffs": [
      "Earlier income versus a larger monthly amount later.",
      "Drawing from accounts in a different order changes taxes and benefits.",
      "Longevity is uncertain, so every plan involves a bet on timing."
    ],
    "next": [
      {
        "label": "Read: CPP and OAS start age",
        "href": "/education/cpp-oas-start-age"
      }
    ],
    "contactTopic": "retirement"
  },
  {
    "id": "newcomers",
    "short": "New to Canada",
    "question": "I’m new to Canada. What works differently here?",
    "why": "Credit, tax and registered accounts follow Canadian rules, and some things start from zero when you arrive. Knowing which saves time and avoids avoidable mistakes.",
    "concepts": [
      {
        "term": "Credit history",
        "plain": "Canadian credit generally starts here, whatever your record elsewhere."
      },
      {
        "term": "Social Insurance Number",
        "plain": "Generally needed to work and to open registered accounts."
      },
      {
        "term": "TFSA room",
        "plain": "Starts when you become a resident, not before."
      },
      {
        "term": "Tax residency",
        "plain": "How it affects income and assets you hold abroad."
      }
    ],
    "tradeoffs": [
      "Building credit takes time, and credit costs money if it is misused.",
      "Registered accounts help, but setup costs may come first.",
      "Cross-border questions often need a tax professional."
    ],
    "next": [
      {
        "label": "Read: New to Canada money basics",
        "href": "/education/new-to-canada-money-basics"
      }
    ],
    "contactTopic": "newcomer"
  }
];

export const aboutData: AboutData = {
  "portrait": "/assets/aistudio/headshot1_0b740ccc.webp",
  "portraitWidth": 800,
  "portraitHeight": 1000,
  "portraitAlt": "Official portrait of Ahmed Bello, Licensed Financial Solutions Professional",
  "background": [],
  "credentials": [],
  "scopeStatement": null,
  "approachDraft": [
    "Most financial decisions go wrong not because people lack discipline, but because nobody explained how the pieces connect. A registered account, an insurance policy and a retirement date are rarely separate questions.",
    "My role, as I see it, is to explain: what an account or product does, what it costs, what it cannot do, and which questions are worth asking before you decide. You should leave a conversation understanding more than when you arrived.",
    "I will tell you plainly what I can help with and what belongs with another professional, such as an accountant, a lawyer or a Licensed Insolvency Trustee."
  ],
  "questionsEnjoyed": [
    "Should my next dollar go into a TFSA, an RRSP or something else?",
    "What would happen to my family’s income if I could not work?",
    "How do I start saving for my children’s education?",
    "I am new to Canada. How does money work here?",
    "How do I know whether a financial recommendation is right for me?"
  ]
};

export const articles: Article[] = [
  {
    "slug": "tfsa-vs-rrsp",
    "kind": "guide",
    "title": "TFSA vs RRSP: the decision is about more than tax deductions",
    "seoTitle": "TFSA vs RRSP: how to compare the two accounts",
    "description": "Both accounts shelter investments from tax, but at opposite moments. How timing, flexibility and room rules shape the choice.",
    "question": "Which account should my next dollar go into — and what should I actually be comparing?",
    "category": "registered-accounts",
    "figuresAsOf": "2026 tax year, as published by the Canada Revenue Agency",
    "problem": "“Which one saves more tax?” is where most people start, and it is an incomplete question. The two accounts tax you at different moments, and they differ in flexibility, room rules and how they interact with benefits later in life.",
    "overview": [
      "An RRSP (Registered Retirement Savings Plan) lets you deduct contributions from your income, so you pay less tax now. Investments grow without annual tax, and withdrawals are added to your income and taxed in the year you take them out.",
      "A TFSA (Tax-Free Savings Account) works the other way around. Contributions are not deductible, but growth and withdrawals are not taxed and do not count as income. Despite the name, a TFSA is not only for cash: it can hold the same kinds of investments as other registered accounts.",
      "Each has its own contribution room. TFSA room builds from the year you turn 18 (or become a resident of Canada). The annual limit is $7,000 for each of 2024, 2025 and 2026, and withdrawals are added back to your room on January 1 of the following year. RRSP room is generally 18% of the previous year’s earned income up to an annual maximum ($33,810 for 2026), reduced by any pension adjustment, plus unused room carried forward. Your own RRSP limit appears on your most recent notice of assessment and in CRA My Account."
    ],
    "example": {
      "title": "Same pre-tax dollars, different tax rate later",
      "intro": "Hypothetical figures. You have $5,000 of pre-tax income to set aside for 20 years. Assume a constant 5% annual return, no fees, a 30% tax rate today, and that the TFSA route starts with the $3,500 left after paying that 30% tax.",
      "table": {
        "head": [
          "Tax rate when you withdraw",
          "RRSP, after tax",
          "TFSA"
        ],
        "rows": [
          [
            "20%",
            "$10,613",
            "$9,287"
          ],
          [
            "30%",
            "$9,287",
            "$9,287"
          ],
          [
            "40%",
            "$7,960",
            "$9,287"
          ]
        ]
      },
      "notes": [
        "In this simplified case, the outcome turns on whether your tax rate in retirement is lower, equal to or higher than your rate today. If it is equal, the two come out the same.",
        "Real returns are not constant, and the example ignores contribution limits, benefit clawbacks and the timing of withdrawals — all of which can change the result. It illustrates the logic; it is not a prediction."
      ]
    },
    "misunderstandings": [
      {
        "myth": "An RRSP always saves you tax.",
        "reality": "A deduction defers tax; it does not remove it. Whether you come out ahead depends on your tax rate when you withdraw compared with today."
      },
      {
        "myth": "A TFSA is just a savings account.",
        "reality": "It is a tax wrapper. It can hold savings, GICs, funds, ETFs or stocks, and what you hold inside matters as much as the account itself."
      },
      {
        "myth": "Taking money out of a TFSA permanently uses up the room.",
        "reality": "Withdrawals are added back on January 1 of the following year. Re-contributing in the same year can create an over-contribution, which CRA taxes at 1% per month on the excess."
      },
      {
        "myth": "I have to choose one or the other.",
        "reality": "Many people use both. The real questions are the order and the amounts."
      },
      {
        "myth": "The RRSP refund is a bonus.",
        "reality": "The refund is deferred tax coming back to you. Reinvesting it is what makes the comparison work; spending it changes the result."
      }
    ],
    "tradeoffs": [
      "Flexibility: TFSA money can generally be withdrawn at any time without tax, and the room returns the following year. RRSP withdrawals are taxed and the room is generally not restored, apart from programs such as the Home Buyers’ Plan and Lifelong Learning Plan, which have their own repayment rules.",
      "Income testing in retirement: RRSP and RRIF withdrawals count as income, which can affect income-tested benefits such as Old Age Security (through its recovery tax) and the Guaranteed Income Supplement. TFSA withdrawals do not count as income.",
      "Timing: an RRSP must be converted to retirement income, for example a RRIF or annuity, by the end of the year you turn 71.",
      "Uncertainty: both your current and your future tax rates are estimates, so the comparison is only as good as those assumptions.",
      "Competing priorities: contributing here may mean less for debt repayment, an emergency buffer or a first-home account."
    ],
    "questions": [
      "Do I expect my taxable income in retirement to be higher, lower or about the same as it is now?",
      "How likely is it that I will need this money before retirement?",
      "Does my employer offer a matching contribution or a group plan?",
      "Have I checked my actual room on my notice of assessment or in CRA My Account?",
      "What will I hold inside the account, and does it suit when I will need the money?"
    ],
    "sources": [
      {
        "label": "Canada Revenue Agency — Before you contribute to a TFSA",
        "url": "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/tax-free-savings-account/contributing/before.html",
        "note": "TFSA limits by year, room rules, withdrawals and over-contributions."
      },
      {
        "label": "Canada Revenue Agency — MP, RRSP, DPSP, TFSA limits, YMPE and the YAMPE",
        "url": "https://www.canada.ca/en/revenue-agency/services/tax/registered-plans-administrators/pspa/mp-rrsp-dpsp-tfsa-limits-ympe.html",
        "note": "Annual RRSP and TFSA dollar limits."
      },
      {
        "label": "Canada Revenue Agency — RRSPs and related plans",
        "url": "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/rrsps-related-plans.html",
        "note": "Contribution rules, withdrawals and maturity at 71."
      }
    ],
    "related": [
      "fhsa-explained",
      "savings-or-debt-first",
      "cpp-oas-start-age"
    ],
    "contactTopic": "accounts",
    "invitationAbout": "registered accounts",
    "url": "/education/tfsa-vs-rrsp",
    "readingMinutes": 3
  },
  {
    "slug": "investment-risk-vs-goal-risk",
    "kind": "guide",
    "title": "Investment risk vs. the risk of never reaching your goal",
    "seoTitle": "Investment risk vs the risk of missing your goal",
    "description": "Volatility is the risk people notice. Falling short of what a goal requires is the one that decides outcomes. How to think about both.",
    "question": "Is keeping my money “safe” actually the lower-risk choice?",
    "category": "investing",
    "problem": "Most people define investment risk as the chance of watching a balance fall. For a goal that is years away, there is a quieter risk: that the safe choices do not grow enough to fund it.",
    "overview": [
      "“Risk” means more than one thing. Volatility describes how much an investment’s value moves up and down. Shortfall risk is the chance that your savings end up below what a goal requires. A savings account has almost no volatility, but over long periods its returns may not keep pace with inflation or with the growth a goal assumes.",
      "Three ideas help separate the two. Time horizon is when you need the money. Risk tolerance is how much movement you can accept emotionally. Risk capacity is how much movement your finances can absorb without derailing the goal. Money needed in two years and money needed in twenty-five years usually deserve different answers, even for the same person.",
      "Diversification — spreading money across many holdings — reduces the damage any single investment can do. It does not remove the risk that markets as a whole decline."
    ],
    "example": {
      "title": "Three steady paths toward the same goal",
      "intro": "Hypothetical figures. You save $10,000 a year for 20 years toward a $300,000 goal. The returns below are constant illustrations, not forecasts, and ignore fees and taxes.",
      "table": {
        "head": [
          "Assumed constant annual return",
          "Balance after 20 years",
          "Compared with the $300,000 goal"
        ],
        "rows": [
          [
            "0%",
            "$200,000",
            "$100,000 short"
          ],
          [
            "2%",
            "$242,974",
            "about $57,000 short"
          ],
          [
            "6%",
            "$367,856",
            "about $68,000 above"
          ]
        ]
      },
      "notes": [
        "A steady 2% looks safe and still leaves the goal about $57,000 out of reach. A steady 6% clears it — but real returns are never steady, and a path that averages 6% can include years of large declines. Neither number is a prediction; each choice simply carries a different risk.",
        "Raising contributions, giving the goal more time, or revising the goal are also levers. The investment return is not the only one."
      ]
    },
    "misunderstandings": [
      {
        "myth": "A falling balance means I have lost money.",
        "reality": "A decline on paper becomes a realized loss when you sell. It matters most if you have to sell during the decline, which is why time horizon matters."
      },
      {
        "myth": "Low volatility means low risk.",
        "reality": "It means low price movement. Falling short of a goal, and inflation, are still risks."
      },
      {
        "myth": "Diversification eliminates risk.",
        "reality": "It reduces the damage from any single holding. Broad market declines still affect diversified portfolios."
      },
      {
        "myth": "I already know how much risk I can tolerate.",
        "reality": "Tolerance is hard to judge when markets are calm. It is worth asking how you would respond to a large decline before one happens."
      }
    ],
    "tradeoffs": [
      "Higher expected returns come with a wider range of possible outcomes, including poor ones.",
      "Money needed soon generally cannot afford large declines; money needed much later can usually absorb more movement.",
      "Fees reduce returns every year. Compare the total ongoing cost of any investment you are considering.",
      "Returns in illustrations are assumptions. Past performance does not predict future results."
    ],
    "questions": [
      "When will I need this money, and what happens if I need it earlier?",
      "What return does my goal actually require, and how steady is that likely to be?",
      "How would I respond to a 30% decline in this account?",
      "Could I change the plan — contribute more, wait longer, adjust the goal — instead of relying on a higher return?"
    ],
    "sources": [
      {
        "label": "GetSmarterAboutMoney.ca — investor education from Canadian securities regulators",
        "url": "https://www.getsmarteraboutmoney.ca",
        "note": "Plain-language material on risk, return and time horizon."
      },
      {
        "label": "Financial Consumer Agency of Canada",
        "url": "https://www.canada.ca/en/financial-consumer-agency.html",
        "note": "Federal consumer education on investing and financial products."
      }
    ],
    "related": [
      "savings-or-debt-first",
      "tfsa-vs-rrsp",
      "questions-before-any-financial-product"
    ],
    "contactTopic": "investing",
    "invitationAbout": "investing",
    "url": "/education/investment-risk-vs-goal-risk",
    "readingMinutes": 2
  },
  {
    "slug": "fhsa-explained",
    "kind": "guide",
    "title": "The FHSA explained: deductions, limits and qualifying withdrawals",
    "seoTitle": "FHSA explained: limits, deductions, withdrawals",
    "description": "The First Home Savings Account pairs a tax deduction with tax-free qualifying withdrawals. How the limits, carry-forward and closing rules work.",
    "question": "How does a First Home Savings Account work, and what are its limits?",
    "category": "registered-accounts",
    "figuresAsOf": "Limits as published by the Canada Revenue Agency; confirm current rules before acting",
    "problem": "The FHSA borrows features from both the RRSP and the TFSA, which makes it easy to misread — particularly the carry-forward rule and the point at which the account has to close.",
    "overview": [
      "The First Home Savings Account (FHSA) is a registered account for saving toward a first home. Contributions are generally tax-deductible, and withdrawals used to buy a qualifying first home are not taxed, including the investment income earned in the account.",
      "The annual contribution limit is $8,000 and the lifetime limit is $40,000. Unused annual room can be carried forward to the next year, up to a maximum of $8,000. Transfers from an RRSP count toward the limits but are not deductible.",
      "To open one you generally need to be a resident of Canada, at least 18, and a first-time home buyer under CRA’s definition — broadly, that neither you nor your spouse or common-law partner lived in a home you owned during the year you open the account or the previous four calendar years. CRA publishes the precise test.",
      "Withdrawals that do not go toward a qualifying home are included in your income. Your maximum participation period ends on December 31 of the earliest of: the 15th anniversary of opening your first FHSA, the year you turn 71, or the year after your first qualifying withdrawal. An unused balance can generally be transferred to an RRSP or RRIF on a tax-deferred basis.",
      "Combining the FHSA with the Home Buyers' Plan (HBP): You can legally combine both the FHSA and the RRSP Home Buyers' Plan for the exact same qualifying home purchase. With the CRA HBP withdrawal limit at $60,000, a single first-time homebuyer can combine $40,000 from an FHSA and $60,000 from an RRSP for up to $100,000 in tax-free home purchase capital ($200,000 for a couple). Unlike the HBP, qualifying FHSA withdrawals never have to be repaid." 
    ],
    "example": {
      "title": "How the carry-forward cap works",
      "intro": "Hypothetical figures. You open an FHSA in 2026 and contribute $2,000 that year, then $5,000 in 2027.",
      "table": {
        "head": [
          "Year",
          "Room available",
          "Contributed",
          "Carried to next year"
        ],
        "rows": [
          [
            "2026",
            "$8,000",
            "$2,000",
            "$6,000"
          ],
          [
            "2027",
            "$14,000 ($8,000 + $6,000)",
            "$5,000",
            "$8,000 (capped; $9,000 was unused)"
          ],
          [
            "2028",
            "$16,000 ($8,000 + $8,000)",
            "—",
            "—"
          ]
        ]
      },
      "notes": [
        "Carry-forward is capped at $8,000, so unused room above that amount is not carried.",
        "The $40,000 lifetime limit applies regardless of any carried-forward room.",
        "Deductions can generally be claimed in a later year rather than the year of contribution. Check CRA’s current guidance for how this works for your situation."
      ]
    },
    "misunderstandings": [
      {
        "myth": "It is just a TFSA for houses.",
        "reality": "Unlike a TFSA, FHSA contributions are generally tax-deductible, and the qualifying-withdrawal rules are specific to buying a first home."
      },
      {
        "myth": "I can keep the account forever.",
        "reality": "It must close by the earliest of the 15-year, age-71 or post-withdrawal deadlines."
      },
      {
        "myth": "Unused room builds up without limit.",
        "reality": "Carry-forward is limited to $8,000 from one year to the next."
      },
      {
        "myth": "If I do not buy a home, the money is stuck.",
        "reality": "Non-qualifying withdrawals are taxable, but the balance can generally be transferred to an RRSP or RRIF on a tax-deferred basis."
      }
    ],
    "tradeoffs": [
      "The tax-free benefit depends on the money going toward a qualifying first home.",
      "It competes with RRSP, TFSA and debt repayment for the same dollars.",
      "A deduction is worth more at a higher marginal tax rate and less at a lower one.",
      "Home-purchase conditions (such as a written agreement to buy or build, and occupancy timelines) are specific. Check CRA’s requirements before withdrawing.",
      "Invested balances can fall, and a home purchase may be on a fixed timeline."
    ],
    "questions": [
      "How soon do I realistically expect to buy, and how firm is that date?",
      "What would I do with the account if my plans changed?",
      "How does the deduction compare with using a TFSA, or with paying down debt?",
      "Do I meet CRA’s definition of a first-time home buyer?"
    ],
    "sources": [
      {
        "label": "Canada Revenue Agency — Saving for your first home: how a First Home Savings Account can help",
        "url": "https://www.canada.ca/en/revenue-agency/news/newsroom/tax-tips/tax-tips-2023/saving-first-home-find-out-how-first-home-savings-account-can-help.html",
        "note": "Limits, carry-forward, deductions, qualifying withdrawals and closing rules."
      },
      {
        "label": "Canada Revenue Agency — First home savings account",
        "url": "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/first-home-savings-account.html",
        "note": "Eligibility and the first-time home buyer definition."
      },
      {
        "label": "Canada Revenue Agency — Definitions for FHSAs",
        "url": "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/first-home-savings-account/definitions.html",
        "note": "Carry-forward cap and the maximum participation period."
      }
    ],
    "related": [
      "tfsa-vs-rrsp",
      "savings-or-debt-first",
      "resp-basics"
    ],
    "contactTopic": "accounts",
    "invitationAbout": "the FHSA",
    "url": "/education/fhsa-explained",
    "readingMinutes": 3
  },
  {
    "slug": "consumer-proposals-explained",
    "kind": "guide",
    "title": "Consumer proposals: what they change and what they don’t",
    "seoTitle": "Consumer proposals: what changes, what doesn’t",
    "description": "A consumer proposal is a formal, legally binding offer to repay creditors over time. What it does, what it leaves alone, and who administers it.",
    "question": "What is a consumer proposal, and how is it different from simply struggling on?",
    "category": "debt-credit",
    "figuresAsOf": "As described by the federal Office of the Superintendent of Bankruptcy; confirm current rules with a trustee",
    "problem": "When debt becomes unmanageable, people hear about consumer proposals and bankruptcy without learning how either works. A proposal changes some things quickly — collection pressure, for example — and leaves others untouched.",
    "overview": [
      "A consumer proposal is a formal process under federal insolvency law. You offer creditors a plan to repay a portion of what you owe, over a longer period, or both. It is arranged and administered by a Licensed Insolvency Trustee (LIT), who works with you to develop the proposal and handles the payments to creditors.",
      "It is available to individuals whose total debts do not exceed $250,000, not counting a mortgage secured by your principal residence. The term of a proposal cannot be longer than five years.",
      "Once a proposal is filed, you stop paying unsecured creditors directly, and wage garnishments and lawsuits against you are stopped. Creditors have 45 days to accept or reject the proposal. A creditors’ meeting is held only if creditors owed at least 25% of the total value of proven claims request one, and if no meeting is requested within 45 days the proposal is deemed accepted. An accepted proposal generally allows you to keep your assets, provided you keep up payments to secured creditors."
    ],
    "example": {
      "title": "How the pieces relate",
      "intro": "Hypothetical figures. You have $60,000 of unsecured debt, and a proposal offers creditors 40% of what is owed, paid over five years.",
      "table": {
        "head": [
          "Item",
          "Hypothetical amount"
        ],
        "rows": [
          [
            "Unsecured debt",
            "$60,000"
          ],
          [
            "Offer to creditors (40%)",
            "$24,000"
          ],
          [
            "Term",
            "60 months"
          ],
          [
            "Payment toward the proposal, per month",
            "$400"
          ]
        ]
      },
      "notes": [
        "Real terms depend on your income, your assets, what creditors will accept, and the trustee’s fees — ask how those costs are handled before committing.",
        "These numbers only show how the parts relate. A Licensed Insolvency Trustee can explain what is realistic in a particular situation."
      ]
    },
    "misunderstandings": [
      {
        "myth": "A proposal makes all my debts disappear.",
        "reality": "It deals with the debts included in the proposal. Secured debts, such as a car loan or mortgage, still need to be paid if you want to keep the asset."
      },
      {
        "myth": "Creditors must accept whatever I offer.",
        "reality": "Creditors decide whether to accept. A trustee helps shape an offer that is realistic."
      },
      {
        "myth": "It has no credit consequences.",
        "reality": "According to the Office of the Superintendent of Bankruptcy, both a consumer proposal and a bankruptcy generally result in the lowest possible credit score."
      },
      {
        "myth": "Anyone offering debt help can file one.",
        "reality": "Only a Licensed Insolvency Trustee can file a consumer proposal. Trustees are licensed and supervised by the federal Office of the Superintendent of Bankruptcy."
      }
    ],
    "tradeoffs": [
      "A proposal can stop collection pressure and reduce what you repay, but it is a legal process with a commitment of up to five years. Missing payments can cause it to fail.",
      "Credit impact: both proposals and bankruptcy generally lead to the lowest credit score for a period.",
      "It may not suit every situation. Credit counselling, a repayment plan or a budget change may be enough in some cases, and different options apply if debts exceed the $250,000 limit.",
      "Trustee fees and other costs exist. Ask what they are and how they are paid.",
      "Questions about whether to file a proposal belong with a Licensed Insolvency Trustee, not with a general financial educator."
    ],
    "questions": [
      "Which of my debts are secured, and which are unsecured?",
      "What payment could I sustain for the whole term of a proposal?",
      "Have I compared a proposal with credit counselling, a consolidation plan or other options?",
      "What would happen to my assets and my credit?"
    ],
    "sources": [
      {
        "label": "Office of the Superintendent of Bankruptcy — You owe money",
        "url": "https://ised-isde.canada.ca/site/office-superintendent-bankruptcy/en/node/448",
        "note": "Consumer proposals: eligibility, term, effect on creditors and trustees."
      },
      {
        "label": "Financial Consumer Agency of Canada — Getting help from a credit counsellor",
        "url": "https://www.canada.ca/en/financial-consumer-agency/services/debt/debt-help.html",
        "note": "Alternatives and what to look for when getting help with debt."
      }
    ],
    "related": [
      "savings-or-debt-first",
      "questions-before-any-financial-product",
      "new-to-canada-money-basics"
    ],
    "contactTopic": "other",
    "invitationAbout": "debt and credit",
    "url": "/education/consumer-proposals-explained",
    "readingMinutes": 3
  },
  {
    "slug": "income-depends-on-you",
    "kind": "guide",
    "title": "How much of your household income depends on your ability to work?",
    "seoTitle": "How much household income depends on you working?",
    "description": "Savings plans and debts quietly assume your income continues. A way to size the gap if it stopped, and the main types of coverage that respond.",
    "question": "If my income stopped, which commitments could I not meet — and for how long?",
    "category": "protection",
    "problem": "Plans for housing, education and retirement assume earnings continue. Illness, disability or death can interrupt them, and most households have never worked out how large the gap would be.",
    "overview": [
      "Start with the household, not the product. List the expenses that would have to continue — housing, food, childcare, debt payments — then subtract the income that would continue, such as a partner’s earnings or benefits you would be entitled to. The gap, and how long it might last, is the starting point.",
      "Different events call for different responses. Life insurance pays a benefit when the insured person dies. Disability insurance replaces part of your income if illness or injury prevents you from working. Critical illness insurance pays a lump sum if you are diagnosed with a condition covered by the policy, as the policy defines it. They respond to different events and are not interchangeable.",
      "Before considering new coverage, take stock of what already exists: employer group benefits, coverage attached to a mortgage or loan, and public programs such as the Canada Pension Plan disability benefit. Check how each one is defined, what it pays and when it ends. Group coverage often ends when the job does."
    ],
    "example": {
      "title": "Sizing a monthly gap",
      "intro": "Hypothetical two-income household. All figures are illustrative.",
      "table": {
        "head": [
          "Monthly item",
          "Amount"
        ],
        "rows": [
          [
            "Essential expenses (housing, food, utilities, childcare, debt payments)",
            "$5,000"
          ],
          [
            "Partner’s take-home pay, which continues",
            "− $2,600"
          ],
          [
            "Other continuing income or benefits (none assumed here)",
            "− $0"
          ],
          [
            "Monthly gap if the other earner’s income stopped",
            "$2,400"
          ]
        ]
      },
      "notes": [
        "Over ten years, a gap of $2,400 a month adds up to $288,000 before inflation or investment returns ($2,400 × 120 months).",
        "A real analysis would also account for existing coverage, savings, how long the gap would last and which expenses could be reduced."
      ]
    },
    "misunderstandings": [
      {
        "myth": "My employer coverage is enough.",
        "reality": "It might be. It might also be limited to a multiple of salary, taxed in a way you did not expect, or end when you leave the job. Read the certificate."
      },
      {
        "myth": "Only the main earner needs to think about this.",
        "reality": "A partner who provides unpaid care or household work has economic value; replacing it can carry real cost."
      },
      {
        "myth": "Critical illness and disability insurance do the same thing.",
        "reality": "Critical illness insurance pays a lump sum on a covered diagnosis. Disability insurance pays regular income when you cannot work. Definitions and exclusions differ."
      },
      {
        "myth": "More coverage is always better.",
        "reality": "Coverage costs money, and the right amount depends on the gap, existing resources and what the household can afford each month."
      }
    ],
    "tradeoffs": [
      "Premiums depend on factors such as age, health and policy type, and you may need to answer detailed health questions. Incomplete or inaccurate answers can affect a later claim.",
      "Term coverage generally costs less and covers a set period; permanent coverage lasts for life and costs more. They serve different purposes.",
      "Definitions, waiting periods, exclusions and renewability differ, so two products with the same label can respond differently to the same event.",
      "Savings can cover small or short gaps; insurance is generally designed for large or long ones.",
      "Public programs may cover part of a gap, subject to their own eligibility rules."
    ],
    "questions": [
      "Which expenses must continue if my income stops, and for how long?",
      "What coverage do I already have, and when does it end?",
      "Who depends on my income, and what would they need?",
      "If I buy coverage, can I keep it if my circumstances change?"
    ],
    "sources": [
      {
        "label": "Financial Consumer Agency of Canada — Life insurance",
        "url": "https://www.canada.ca/en/financial-consumer-agency/services/insurance/life.html",
        "note": "Types of life insurance and what to consider."
      },
      {
        "label": "Financial Consumer Agency of Canada — Disability insurance",
        "url": "https://www.canada.ca/en/financial-consumer-agency/services/insurance/disability.html",
        "note": "How disability coverage works and what to check."
      },
      {
        "label": "Government of Canada — Canada Pension Plan disability benefits",
        "url": "https://www.canada.ca/en/services/benefits/publicpensions/cpp-disability-benefit.html",
        "note": "Public disability benefit and eligibility."
      }
    ],
    "related": [
      "questions-before-any-financial-product",
      "savings-or-debt-first",
      "resp-basics"
    ],
    "contactTopic": "protection",
    "invitationAbout": "financial protection",
    "url": "/education/income-depends-on-you",
    "readingMinutes": 3
  },
  {
    "slug": "resp-basics",
    "kind": "guide",
    "title": "RESP basics: how the Canada Education Savings Grant works",
    "seoTitle": "RESP basics: how the education grant works",
    "description": "An RESP can add a government grant to what you save for a child’s education. How the 20% match, the limits and the “what if” scenarios work.",
    "question": "How much does the government add to an RESP, and what happens if the plan changes?",
    "category": "family",
    "figuresAsOf": "Grant rules as published by the Canada Revenue Agency; confirm current rules before acting",
    "problem": "Families often open an RESP to “get the grant” without knowing how much they need to contribute, what the limits are, or what happens if a child does not go on to further education.",
    "overview": [
      "A Registered Education Savings Plan (RESP) is a registered account for a child’s post-secondary education. Contributions are not tax-deductible, but investment growth is not taxed while it stays in the plan. When money is paid out for education, the growth and grants are generally taxed in the student’s hands — often at a lower rate — while the original contributions come back tax-free.",
      "The Canada Education Savings Grant (CESG) adds 20% on the first $2,500 contributed each year, up to $500 a year per child. If earlier years were missed, unused grant room carries forward, and up to $1,000 of basic grant can be paid in a single year. The lifetime maximum is $7,200 per child, and additional grant amounts apply for lower- and middle-income families. Grants are available on contributions made up to the end of the calendar year the child turns 17, with extra conditions for ages 16 and 17.",
      "A lifetime contribution limit per child also applies. CRA’s RESP contributions page has the current figure."
    ],
    "example": {
      "title": "Reaching the lifetime grant maximum",
      "intro": "Hypothetical figures. You contribute $2,500 every year starting the year a child is born, with no catch-up contributions. Investment growth is ignored.",
      "table": {
        "head": [
          "Year",
          "Your contribution",
          "Basic grant"
        ],
        "rows": [
          [
            "Years 1–14 (each year)",
            "$2,500",
            "$500"
          ],
          [
            "Year 15",
            "$2,500",
            "$200 (reaches the $7,200 lifetime maximum)"
          ],
          [
            "Total after 15 years",
            "$37,500",
            "$7,200"
          ]
        ]
      },
      "notes": [
        "Contributing more than $2,500 in a year is allowed, but only the first $2,500 earns the basic grant.",
        "Income-tested additional grants count toward the same $7,200 lifetime maximum, so some families may reach it sooner. They are not included here."
      ]
    },
    "misunderstandings": [
      {
        "myth": "The grant is mine to keep no matter what.",
        "reality": "Grants generally must be repaid if the money is not used for eligible education. The plan’s rules govern what happens to grants and growth."
      },
      {
        "myth": "If I miss a year, that year’s grant is lost.",
        "reality": "Unused grant room carries forward, though catch-up is limited to $1,000 of basic grant in a year."
      },
      {
        "myth": "RESPs only work for university.",
        "reality": "Eligible programs can include some colleges, trade schools and programs outside Canada. Confirm that a specific program qualifies."
      },
      {
        "myth": "Contributing more always earns more grant.",
        "reality": "Only the first $2,500 contributed each year attracts the basic grant."
      }
    ],
    "tradeoffs": [
      "RESP money is earmarked for education. If it is not used that way, grants are returned and growth may be taxed at the subscriber’s rate plus an additional tax, unless it is moved in a permitted way, for example to an RRSP within limits.",
      "Contributions are not deductible, so the RESP competes with an RRSP, TFSA and debt repayment for the same dollars.",
      "Investments inside the plan carry risk, and the time horizon is set by the child’s age.",
      "Individual and family plans have different rules about sharing among beneficiaries. Read the plan terms."
    ],
    "questions": [
      "How much can I realistically contribute each year?",
      "Which other goals compete for that money?",
      "What would I do if my child does not pursue post-secondary education?",
      "Does the plan I am considering charge fees or restrict withdrawals?"
    ],
    "sources": [
      {
        "label": "Canada Revenue Agency — Canada Education Savings Grant (CESG)",
        "url": "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/registered-education-savings-plans-resps/canada-education-savings-programs-cesp/canada-education-savings-grant-cesg.html",
        "note": "Grant rate, annual and lifetime maximums, age rules and carry-forward."
      },
      {
        "label": "Canada Revenue Agency — RESP contributions",
        "url": "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/registered-education-savings-plans-resps/resp-contributions.html",
        "note": "Contribution limits and how contributions are treated."
      }
    ],
    "related": [
      "tfsa-vs-rrsp",
      "income-depends-on-you",
      "savings-or-debt-first"
    ],
    "contactTopic": "family",
    "invitationAbout": "education savings",
    "url": "/education/resp-basics",
    "readingMinutes": 2
  },
  {
    "slug": "cpp-oas-start-age",
    "kind": "guide",
    "title": "CPP and OAS: how your start age changes the monthly amount",
    "seoTitle": "CPP and OAS: how start age changes your pension",
    "description": "CPP can start between 60 and 70 and OAS between 65 and 70. How much the monthly amount changes, and why the right age depends on more than arithmetic.",
    "question": "How does choosing when to start CPP and OAS change what I receive?",
    "category": "retirement",
    "figuresAsOf": "OAS maximums shown are for October–December 2026 and are adjusted quarterly",
    "problem": "Start age is one of the few retirement-income choices governed by a published formula, yet it is often decided by habit: “take it as soon as I can.”",
    "overview": [
      "The Canada Pension Plan (CPP) retirement pension can start as early as 60 and as late as 70, with 65 as the standard age. Starting before 65 reduces your monthly amount by 0.6% for each month (7.2% a year), to a maximum reduction of 36% at 60. Starting after 65 increases it by 0.7% a month (8.4% a year), to a maximum increase of 42% at 70. Nothing more is gained by waiting past 70.",
      "Old Age Security (OAS) payments begin at 65 and can be deferred for up to five years. The pension increases by 0.6% for each month you delay, to a maximum of 36% at 70. OAS depends on years of residence in Canada after age 18 rather than on contributions: a full pension generally requires 40 years of residence, and a partial pension is calculated as years of residence divided by 40. For October to December 2026, the maximum monthly OAS payment for ages 65 to 74 is $762.50. Applying the maximum 36% increase to that figure gives about $1,037 a month at 70 (our calculation, not a published amount).",
      "CPP and OAS are separate programs. CPP is earned through contributions during working years; OAS depends on residence. For most people, both are only part of retirement income."
    ],
    "example": {
      "title": "How start age scales a CPP amount",
      "intro": "Hypothetical figures. Your CPP retirement pension would be $1,000 a month if it started at 65.",
      "table": {
        "head": [
          "Start age",
          "Adjustment",
          "Hypothetical monthly CPP"
        ],
        "rows": [
          [
            "60",
            "−36%",
            "$640"
          ],
          [
            "65",
            "none",
            "$1,000"
          ],
          [
            "70",
            "+42%",
            "$1,420"
          ]
        ]
      },
      "notes": [
        "Starting early means smaller payments for more years; starting late means larger payments for fewer years. Which total is larger depends on how long you live, which no one knows.",
        "Taxes, other income, health, work plans, and whether a partner relies on the pension all matter too."
      ]
    },
    "misunderstandings": [
      {
        "myth": "I paid in, so I should take it as early as possible.",
        "reality": "Starting early permanently reduces the monthly amount. Whether that suits you depends on your needs, your health and your other income."
      },
      {
        "myth": "Delaying is always the better financial choice.",
        "reality": "It helps only if you live long enough and do not need the income sooner. Bridging the gap may mean drawing on savings, which has its own trade-offs."
      },
      {
        "myth": "CPP and OAS are the same program.",
        "reality": "They have different eligibility rules, funding and start-age adjustments."
      },
      {
        "myth": "OAS is paid in full to everyone.",
        "reality": "It depends on years of residence in Canada, and higher-income retirees may face a recovery tax. Service Canada explains the details."
      }
    ],
    "tradeoffs": [
      "Starting early gives income sooner; starting late gives a larger monthly amount.",
      "To delay, you may need other income, such as savings or work, which interacts with RRSP, RRIF and TFSA decisions.",
      "CPP and OAS payments are taxable income.",
      "Longevity, health and a partner’s circumstances matter and cannot be predicted."
    ],
    "questions": [
      "What does my CPP statement project at 60, 65 and 70?",
      "Do I need this income now, or can other sources bridge the gap?",
      "Does a partner rely on this income, and what would they receive later?",
      "How would starting earlier or later change my taxes?"
    ],
    "sources": [
      {
        "label": "Government of Canada — CPP: When to start your retirement pension",
        "url": "https://www.canada.ca/en/services/benefits/publicpensions/cpp/when-start.html",
        "note": "Earliest and latest start ages and the monthly adjustments."
      },
      {
        "label": "Government of Canada — OAS: When to start your retirement pension",
        "url": "https://www.canada.ca/en/services/benefits/publicpensions/old-age-security/when-start.html",
        "note": "Deferral and the monthly increase."
      },
      {
        "label": "Government of Canada — OAS benefit amount",
        "url": "https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/benefit-amount.html",
        "note": "Eligibility, residency and current maximum payments."
      },
      {
        "label": "Retirement Hub — Deciding when to start your public pensions",
        "url": "https://retraite-retirement.service.canada.ca/en/learn/deciding-when-to-start-your-public-pensions"
      }
    ],
    "related": [
      "tfsa-vs-rrsp",
      "income-depends-on-you",
      "new-to-canada-money-basics"
    ],
    "contactTopic": "retirement",
    "invitationAbout": "retirement",
    "url": "/education/cpp-oas-start-age",
    "readingMinutes": 2
  },
  {
    "slug": "new-to-canada-money-basics",
    "kind": "guide",
    "title": "New to Canada: how your first year of money decisions works",
    "seoTitle": "New to Canada: money basics for your first year",
    "description": "Credit history, registered accounts and taxes work differently here. What starts when you arrive, what does not carry over, and what to check first.",
    "question": "What should I understand about banking, credit, registered accounts and tax when I arrive?",
    "category": "newcomers",
    "figuresAsOf": "2026 TFSA limit as published by the Canada Revenue Agency",
    "problem": "Newcomers often assume their financial history travels with them, or that Canadian accounts work like those at home. Some things start on day one; others start from zero.",
    "overview": [
      "Credit. Canadian lenders rely on credit reports kept by credit bureaus. Credit history from another country generally does not appear in a Canadian report, so many newcomers start without one. Paying bills and credit products on time and keeping balances low is what builds a Canadian record. The Financial Consumer Agency of Canada explains how reports and scores work.",
      "Social Insurance Number (SIN). A SIN is generally needed to work in Canada and to open registered accounts such as a TFSA or RRSP.",
      "TFSA. CRA says TFSA room begins accumulating on the day your residency starts, if you are 18 or older. You do not receive room for the years before you arrived.",
      "RRSP. Room is generally based on earned income reported on a Canadian tax return, so it builds from your first years of Canadian earnings.",
      "Tax. Becoming a Canadian resident for tax purposes affects how your income and, in some cases, assets you hold abroad are reported. The rules are technical and depend on your circumstances, so a qualified tax professional is the right person to ask."
    ],
    "example": {
      "title": "TFSA room for a recent arrival",
      "intro": "Hypothetical figures. A 30-year-old becomes a resident of Canada during 2026.",
      "table": {
        "head": [
          "Item",
          "Amount"
        ],
        "rows": [
          [
            "2026 annual TFSA limit",
            "$7,000"
          ],
          [
            "Room for years before becoming a resident",
            "$0"
          ],
          [
            "Total TFSA room at arrival",
            "$7,000"
          ]
        ]
      },
      "notes": [
        "CRA’s own example makes the same point: a person who became a resident in 2024 had only the 2024 limit of $7,000 available.",
        "Contributing more than your room is an over-contribution, taxed at 1% per month on the excess."
      ]
    },
    "misunderstandings": [
      {
        "myth": "My credit score comes with me.",
        "reality": "Generally it does not. Canadian credit is built here, although some institutions have programs for newcomers. Ask what a lender will consider."
      },
      {
        "myth": "I have the same TFSA room as someone who has lived here for years.",
        "reality": "Room starts when you become a resident, so a newcomer’s total is usually much smaller."
      },
      {
        "myth": "I only need to think about Canadian assets and income.",
        "reality": "Income and property held abroad may need to be reported on a Canadian tax return. Ask a tax professional what applies to you."
      },
      {
        "myth": "Opening a bank account builds credit.",
        "reality": "A chequing or savings account typically does not create a credit record. Borrowing products reported to credit bureaus, such as a credit card, do."
      }
    ],
    "tradeoffs": [
      "A credit card can help build a record, but it carries high interest if the balance is not paid in full.",
      "Registered accounts offer tax advantages, but they may not be the first priority while you are covering moving and setup costs. Priorities differ by situation.",
      "Sending money abroad involves exchange rates, fees and sometimes reporting. Compare the total cost.",
      "Rules for newcomers differ by immigration status, province and income source. Treat general guidance as a starting point."
    ],
    "questions": [
      "Which of my financial relationships (banking, credit, taxes) start in Canada, and which continue from home?",
      "What do I need to report to CRA about assets or income abroad?",
      "How will I build credit safely?",
      "What help do I need from a tax professional this year?"
    ],
    "sources": [
      {
        "label": "Canada Revenue Agency — Before you contribute to a TFSA",
        "url": "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/tax-free-savings-account/contributing/before.html",
        "note": "TFSA room for new residents and over-contribution rules."
      },
      {
        "label": "Financial Consumer Agency of Canada — Credit report and score basics",
        "url": "https://www.canada.ca/en/financial-consumer-agency/services/credit-reports-score/credit-report-score-basics.html"
      },
      {
        "label": "Financial Consumer Agency of Canada — Improving your credit score",
        "url": "https://www.canada.ca/en/financial-consumer-agency/services/credit-reports-score/improve-credit-score.html"
      }
    ],
    "related": [
      "tfsa-vs-rrsp",
      "consumer-proposals-explained",
      "questions-before-any-financial-product"
    ],
    "contactTopic": "newcomer",
    "invitationAbout": "money questions as a newcomer",
    "url": "/education/new-to-canada-money-basics",
    "readingMinutes": 2
  },
  {
    "slug": "savings-or-debt-first",
    "kind": "insight",
    "title": "Pay down debt or save? The question behind the question",
    "seoTitle": "Pay down debt or save? The question behind it",
    "description": "The answer depends on the interest rate you pay, what saving would earn or save in tax, and how much buffer you have. A framework for the comparison.",
    "question": "When money is limited, how should I compare paying down debt with saving?",
    "category": "decision-making",
    "problem": "“Debt first or savings first?” is usually argued as a rule. A better approach is to compare what each dollar would actually do, and to protect against the surprise that would otherwise push you back into debt.",
    "overview": [
      "Paying down a debt earns a return equal to the interest you stop paying. If a credit card charges 19.99%, each dollar repaid avoids that rate — a certain result, provided you would otherwise have carried the balance. A dollar invested has an expected return that is not guaranteed and varies from year to year.",
      "That comparison changes with the type of debt. Interest on most personal debt is not tax-deductible, and lower-rate debt, such as some mortgages, makes the comparison much closer. Tax benefits — an RRSP deduction or an employer’s matching contribution, for example — may belong in the comparison too.",
      "Liquidity is the other half. Money used to pay down a debt can be hard to get back. A modest emergency buffer helps keep a car repair or a gap between jobs from landing on a credit card, which would undo the progress.",
      "Finally, a plan has to be one you will keep following. Some people do better with a visible repayment target; others with a visible savings balance. Behaviour is part of the arithmetic."
    ],
    "example": {
      "title": "$10,000 of extra cash, two possible uses",
      "intro": "Hypothetical figures. You have $10,000 available and a $10,000 credit card balance at 19.99% interest. The investment return is an assumption, not a prediction, and the arithmetic is simplified (no compounding, taxes or fees).",
      "table": {
        "head": [
          "Choice",
          "Approximate annual effect"
        ],
        "rows": [
          [
            "Repay the card",
            "about $1,999 of interest avoided"
          ],
          [
            "Invest at an assumed 5%",
            "about $500 of growth (not guaranteed)"
          ]
        ]
      },
      "notes": [
        "At a credit-card rate the comparison is lopsided. With a 4.5% mortgage and an assumed 5% return it would be much closer, and tax treatment, risk and flexibility would carry more weight.",
        "An emergency buffer changes the picture: if repaying everything leaves no cash, a surprise expense may simply go back on the card."
      ]
    },
    "misunderstandings": [
      {
        "myth": "Always pay off debt first.",
        "reality": "High-rate debt usually deserves priority, but employer matching, a basic buffer and low-rate debt can change the order."
      },
      {
        "myth": "Investing beats repaying debt because markets rise over time.",
        "reality": "Markets can fall as well as rise. The interest you avoid on a debt is certain."
      },
      {
        "myth": "An emergency fund is optional if I have room on a credit card.",
        "reality": "Using credit to cover emergencies is how many balances start."
      },
      {
        "myth": "It is either-or.",
        "reality": "Many people split their dollars between a buffer, debt repayment and saving. The proportions depend on rates, risk and comfort."
      }
    ],
    "tradeoffs": [
      "Repaying debt gives certainty but reduces liquidity.",
      "Saving preserves flexibility but may earn less than the interest you are paying.",
      "Registered accounts have contribution limits and withdrawal rules.",
      "Tax advantages such as deductions and employer matching can tilt the comparison, so do not leave them out.",
      "Not everything is quantifiable. Peace of mind counts, too."
    ],
    "questions": [
      "What interest rate am I paying on each debt, and what could I realistically earn elsewhere?",
      "How many months of essential expenses could I cover without borrowing?",
      "Is there any employer matching or tax deduction I would give up?",
      "What would make this plan easier to stick with?"
    ],
    "sources": [
      {
        "label": "Financial Consumer Agency of Canada — Getting help from a credit counsellor",
        "url": "https://www.canada.ca/en/financial-consumer-agency/services/debt/debt-help.html"
      },
      {
        "label": "Financial Consumer Agency of Canada",
        "url": "https://www.canada.ca/en/financial-consumer-agency.html",
        "note": "Consumer education on credit, borrowing and saving."
      }
    ],
    "related": [
      "tfsa-vs-rrsp",
      "consumer-proposals-explained",
      "investment-risk-vs-goal-risk"
    ],
    "contactTopic": "education",
    "invitationAbout": "paying down debt versus saving",
    "url": "/insights/savings-or-debt-first",
    "readingMinutes": 2
  },
  {
    "slug": "questions-before-any-financial-product",
    "kind": "insight",
    "title": "Eight questions to ask before you buy any financial product — including from me",
    "seoTitle": "Eight questions before you buy a financial product",
    "description": "How a professional is paid, what they are licensed to do, and what a product cannot do for you. Questions worth asking of anyone.",
    "question": "How can I judge a financial recommendation before I act on it?",
    "category": "decision-making",
    "problem": "Financial products are complicated, and the person explaining one may be paid when you buy it. That does not make the advice wrong, but it makes asking good questions part of your own due diligence.",
    "overview": [
      "Whoever you speak with — a bank, an advisor, an insurance agent or a website — the same questions apply. Asking them is not rude; clear answers are part of good service.",
      "Registration and licensing depend on what is being sold. Investment advisors and dealers are registered with provincial securities regulators, and you can check registration through the Canadian Securities Administrators’ National Registration Search. Insurance sales are licensed by provincial insurance regulators. Ask which licence covers the specific product being discussed.",
      "Compensation matters too. Some professionals are paid fees you pay directly; others are paid commissions by the product provider; some receive both. None of these is automatically better, but each creates different incentives, and you are entitled to know which applies.",
      "Then ask about the product itself: what it does, what it costs over time, what happens if you stop, and what it does not do."
    ],
    "misunderstandings": [
      {
        "myth": "A recommendation from someone friendly is a safe one.",
        "reality": "Friendliness is not a credential. Verify registration or licensing independently."
      },
      {
        "myth": "If a product is sold to many people, it must be right for me.",
        "reality": "Suitability depends on your goals, timeline and existing resources."
      },
      {
        "myth": "Fees are whatever is on the first page.",
        "reality": "Look for ongoing costs, withdrawal or surrender charges, and what happens if you stop paying."
      },
      {
        "myth": "Asking questions signals distrust.",
        "reality": "A good professional expects them."
      }
    ],
    "tradeoffs": [
      "Lower-cost options may come with less service; higher-cost ones may come with more. Judge what you receive for what you pay.",
      "Commissions can fund services that would otherwise be paid for directly. The question is whether you understand the arrangement.",
      "Complex products can do something useful that simple ones cannot, and they usually cost more. Make sure you actually need the feature.",
      "No list of questions replaces independent verification of licensing, or a second opinion on a large decision."
    ],
    "questions": [
      "What licence or registration allows you to recommend this product, and how can I verify it?",
      "How are you paid if I buy it, and is that different for the alternatives?",
      "What are all the costs, now and over time?",
      "What problem does this solve for me specifically, and what are the alternatives, including doing nothing?",
      "What are the main risks and limits, and what would make this the wrong choice for me?",
      "What happens if I stop, withdraw or cancel? Are there charges or time limits?",
      "What do I need to disclose, and what happens if my answers are incomplete or change later?",
      "Can I have the key terms in writing, and time to think before I decide?"
    ],
    "sources": [
      {
        "label": "Canadian Securities Administrators — National Registration Search",
        "url": "https://www.securities-administrators.ca/nrs/nrsearchprep.aspx",
        "note": "Check whether an individual or firm is registered to sell securities. Insurance licences are separate: check with your provincial insurance regulator."
      },
      {
        "label": "Financial Consumer Agency of Canada — Life insurance",
        "url": "https://www.canada.ca/en/financial-consumer-agency/services/insurance/life.html"
      },
      {
        "label": "Financial Consumer Agency of Canada",
        "url": "https://www.canada.ca/en/financial-consumer-agency.html"
      }
    ],
    "related": [
      "income-depends-on-you",
      "investment-risk-vs-goal-risk",
      "savings-or-debt-first"
    ],
    "contactTopic": "education",
    "invitationAbout": "how to evaluate financial advice",
    "url": "/insights/questions-before-any-financial-product",
    "readingMinutes": 2
  }  ,
  {
    "slug": "canadian-mortgage-renewal-shock-liquidity-trap",
    "kind": "insight",
    "title": "The Canadian Mortgage Renewal Shock: Why Raiding Your TFSA or RRSP Is Often a Costly Trap",
    "seoTitle": "Canadian Mortgage Renewal Shock: Why Raiding TFSAs or RRSPs Is a Trap",
    "description": "With over $350B in Canadian mortgages confronting renewal payment shock, homeowners are liquidating registered accounts to prepay principal. Here is the balance-sheet analysis of why this often destroys family wealth.",
    "question": "As my Canadian mortgage rate spikes at renewal, should I withdraw from my TFSA or RRSP to pay down my mortgage principal?",
    "category": "debt-and-cashflow",
    "problem": "The psychological anxiety of higher monthly mortgage payments tempts Canadian households to treat brick-and-mortar debt reduction as an absolute good—ignoring permanent tax-shelter destruction, structural illiquidity, and asymmetric balance-sheet risk.",
    "overview": [
      "Over $350 billion in Canadian residential mortgages originated during the historic sub-2.5% rate window are confronting renewal at rates 250 to 350 basis points higher. For an average Canadian household carrying a $500,000 balance, this translates to an immediate payment shock of $600 to $1,200 per month. The intuitive, emotionally seductive reaction advocated across mainstream internet forums is simple: \"Raid your investments, pay down the debt, and secure a guaranteed return equal to your mortgage rate.\"",
      "Yet from an institutional balance-sheet perspective, this conventional wisdom commits a critical error: it evaluates debt in a vacuum rather than assessing total household capital efficiency. A home is an illiquid asset. It cannot buy groceries, cover an unexpected medical emergency, or sustain mortgage service during a temporary career interruption. When a family liquidates liquid capital to prepay mortgage principal, they convert liquid sovereignty into illiquid drywall.",
      "The asymmetry deepens when registered accounts are involved. An RRSP withdrawal is not merely taxed at your full marginal income tax rate (triggering immediate withholding tax of up to 30% plus top-up liability at tax filing); it permanently extinguishes that contribution room forever. You cannot \"re-contribute\" those funds when rates stabilize. You have effectively paid the Canada Revenue Agency up to 40%–53% in frictional tax leakage simply to reduce a 5% debt.",
      "Even within a Tax-Free Savings Account (TFSA), where contribution room is recovered the following calendar year, the opportunity cost is mathematically punishing. A $50,000 TFSA compounded over 15 to 20 years in a balanced global portfolio at a historic 6.5% real return grows completely tax-free to over $176,000. Using that $50,000 to prepay a 5.2% mortgage saves interest over the 5-year term, but deprives the family of irreplaceable tax-free compounding that would otherwise fund their retirement and insulate them from future Old Age Security (OAS) clawbacks.",
      "A McKinsey-grade treasury framework treats personal balance sheets like enterprise capital structures: maintain adequate operating liquidity, match asset duration with liabilities, and never sacrifice high-tax-value registered shelters to solve a short-term cashflow friction that could be managed through structured amortization, budget realignments, or dedicated non-registered liquidity buffers."
    ],
    "example": {
      "title": "Case Study: The $60,000 Prepayment Dilemma (15-Year Horizon)",
      "intro": "Consider an Ontario household renewing a $500,000 mortgage at 5.4% interest. They have $60,000 saved inside their TFSAs earning an average 6.5% return. They compare withdrawing $60,000 to make an immediate lump-sum mortgage prepayment versus preserving their TFSA and restructuring cashflow.",
      "table": {
        "head": ["Metric", "Strategy A: Liquidate TFSA for Mortgage Prepayment", "Strategy B: Preserve TFSA & Restructure Cashflow"],
        "rows": [
          ["Initial Registered Wealth", "$0 (TFSA emptied to prepay mortgage)", "$60,000 (kept in tax-sheltered investment)"],
          ["Monthly Payment Relief", "~$358 / month saved in mortgage service", "$0 monthly reduction (standard renewal)"],
          ["Liquid Emergency Reserves", "$5,000 in chequing (High illiquidity risk)", "$60,000 accessible tax-free at any time"],
          ["15-Year TFSA Terminal Value", "$0 (assuming forgone contributions)", "$154,310 (compounded tax-free at 6.5%)"],
          ["15-Year Mortgage Interest Saved", "~$48,600 saved on mortgage balance", "$0 extra interest saved"],
          ["Net Balance Sheet Advantage", "Saves $48.6k in interest, zero liquid buffer", "+$105,710 net positive household net worth delta"]
        ]
      },
      "notes": [
        "Figures assume a 5.4% 5-year renewal renewing into long-term 4.5% rate thereafter, and a conservative 6.5% annual return within the TFSA.",
        "Strategy B results in over $105,000 greater net family net worth at year 15, while preserving uninterrupted emergency liquidity throughout the renewal cycle."
      ]
    },
    "misunderstandings": [
      {
        "myth": "Paying down a 5% mortgage gives you a guaranteed 5% return that always beats investing.",
        "reality": "Mortgage prepayment yields an illiquid, paper return trapped inside real estate. It cannot be accessed without selling the home, breaking the mortgage, or qualifying for a HELOC (which banks can freeze or reprice during economic downturns). Liquid flexibility carries immense economic option value that simple interest arithmetic ignores."
      },
      {
        "myth": "I can tap my RRSP to make a lump-sum payment and lower my monthly burden.",
        "reality": "RRSP withdrawals are treated as taxable income, pushing you into higher marginal brackets and triggering immediate withholding taxes. Crucially, RRSP contribution room is permanently lost upon withdrawal. The tax damage almost always dwarfs the mortgage interest saved."
      },
      {
        "myth": "Having zero debt is always safer than having both mortgage debt and liquid savings.",
        "reality": "A homeowner with a $300,000 mortgage and $150,000 in liquid registered reserves can withstand prolonged layoffs, illness, or emergency repairs without stress. A homeowner with a fully paid-off house and $3,000 in the bank is functionally insolvent if income stops."
      }
    ],
    "tradeoffs": [
      "Psychological comfort: Debt reduction provides immediate emotional certainty, whereas market compounding requires volatility tolerance.",
      "Emergency access: Prepaying mortgage principal transfers capital from your control into the lender's custody, making re-borrowing contingent on bank approval.",
      "Tax efficiency: Registered accounts (TFSA, FHSA, RRSP) offer finite lifetime shelter; once surrendered, the compounded tax-free yield cannot be retroactively purchased."
    ],
    "questions": [
      "What is my household's net after-tax cost of borrowing versus our expected long-term registered return?",
      "If our primary earner were unable to work for 6 to 12 months, how many months of total expenses are liquid without selling the property?",
      "Have we explored extending amortization or re-budgeting discretionary expenses before touching tax-sheltered capital?",
      "Would using a non-registered emergency fund or high-interest cash account provide the needed payment bridge without burning registered contribution room?"
    ],
    "sources": [
      {
        "label": "Bank of Canada: Financial System Review (Household Vulnerabilities & Mortgages)",
        "url": "https://www.bankofcanada.ca/core-functions/financial-system/financial-system-review/",
        "note": "Official data on Canadian mortgage renewals and household debt-service ratios."
      },
      {
        "label": "Canada Revenue Agency: Withholding Rates on RRSP Withdrawals",
        "url": "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/rrsps-related-plans/making-withdrawals.html",
        "note": "Statutory rules and tax liabilities on premature registered withdrawals."
      },
      {
        "label": "Statistics Canada: National Balance Sheet and Financial Flow Accounts",
        "url": "https://www150.statcan.gc.ca/n1/daily-quotidien/240912/dq240912a-eng.htm",
        "note": "Official Canadian household net worth, debt-to-income, and asset liquidity statistics."
      }
    ],
    "related": [
      "savings-or-debt-first",
      "tfsa-vs-rrsp",
      "investment-risk-vs-goal-risk",
      "income-depends-on-you"
    ],
    "contactTopic": "investing",
    "invitationAbout": "navigating your mortgage renewal strategy and evaluating your household liquidity balance sheet",
    "url": "/insights/canadian-mortgage-renewal-shock-liquidity-trap",
    "readingMinutes": 6
  }

  ,
  {
    "slug": "canadian-capital-gains-deemed-disposition-estate-trap",
    "kind": "insight",
    "title": "Capital Gains & Deemed Disposition at Death: Why Canada’s 'Final Sale' Is the Silent Estate Tax",
    "seoTitle": "Canada Capital Gains & Deemed Disposition at Death Estate Tax Guide",
    "description": "Canada has no formal inheritance tax, but the CRA’s statutory 'deemed disposition at death' triggers capital gains tax on cottages, rental properties, and private corporation shares. How the 50% inclusion rule works.",
    "question": "How does Canada’s statutory 'deemed disposition' tax at death impact our family cottage, investment properties, and private corporation shares under current capital gains rules?",
    "category": "debt-and-cashflow",
    "problem": "Many Canadian families assume that because Canada lacks an inheritance tax, wealth transfers smoothly to heirs. In reality, Section 70(5) of the Income Tax Act treats all appreciated assets as if sold at fair market value immediately prior to death, generating a substantial, immediate tax liability without delivering any cash to pay the CRA.",
    "overview": [
      "A widespread misconception in Canadian wealth planning is that Canada has no estate or inheritance tax. While technically accurate—there is no succession duty as found in the United States or the United Kingdom—Canada enforces one of the most significant capital taxation mechanisms in the developed world: the statutory 'Deemed Disposition at Death' under Subsection 70(5) of the Income Tax Act.",
      "Under Subsection 70(5), every Canadian taxpayer is legally deemed to have disposed of all capital property—including secondary residences, recreational cottages, rental real estate, non-registered investment portfolios, and shares of Canadian-Controlled Private Corporations (CCPCs)—at Fair Market Value (FMV) immediately prior to death. While a statutory rollover allows tax-free transfer to a surviving spouse, upon the second spouse's death, the entire accumulated capital gain is recognized on the final terminal tax return.",
      "Although a federal proposal in Budget 2024 suggested raising the inclusion rate to 66.7%, that proposed increase was subsequently cancelled. The Canadian capital gains inclusion rate remains established at 50% under Section 38 of the Income Tax Act. However, even at a 50% inclusion rate, decades of compound appreciation on cottages, rental properties, and corporate shares result in massive tax bills.",
      "The primary threat is not merely the quantum of tax, but the structural liquidity mismatch. The Canada Revenue Agency demands cash payment on the terminal return (typically due by April 30 of the following year, or six months after death, whichever is later). If the estate consists primarily of illiquid assets—such as a beloved family cottage or private operating shares—and lacks segregated liquid capital, heirs are frequently forced into distressed property liquidations or costly borrowing simply to satisfy the CRA.",
      "Effective estate planning requires analyzing your estate's terminal balance sheet long before death: evaluating Section 85/86 estate freezes to cap founder tax liability, extracting corporate Capital Dividend Account (CDA) balances tax-free, and creating dedicated, tax-sheltered liquidity that delivers liquid cash exactly when the tax assessment arrives."
    ],
    "example": {
      "title": "Case Study: The $1.25M Family Cottage Estate Settlement",
      "intro": "Consider an Ontario or Atlantic Canadian family whose primary cottage was purchased in 1998 for $180,000, now appraised at $1,250,000 (an accrued capital gain of $1,070,000). Upon the passing of the surviving parent, the estate must settle the deemed disposition tax before title can transfer cleanly to the children.",
      "table": {
        "head": ["Estate Parameter", "Unstructured Estate (Default CRA Settlement)", "Structured Private Wealth Architecture"],
        "rows": [
          ["Adjusted Cost Base (ACB)", "$180,000 original purchase cost", "$180,000 original purchase cost"],
          ["Fair Market Value at Deemed Disposition", "$1,250,000 appraised value", "$1,250,000 appraised value"],
          ["Total Accrued Capital Gain", "$1,070,000 taxable capital appreciation", "$1,070,000 taxable capital appreciation"],
          ["Taxable Capital Gain (Statutory 50% Rule)", "$535,000 included in terminal income", "$535,000 included in terminal income"],
          ["Estimated Terminal Tax Liability (~53.5%)", "~$286,225 due in cash to the CRA", "~$286,225 due in cash to the CRA"],
          ["Estate Settlement Liquidity Source", "None (Heirs forced to sell cottage or obtain mortgage)", "Dedicated tax-exempt permanent life policy"],
          ["Family Outcome", "Loss of generational property & emotional distress", "Cottage preserved 100% intact for children and grandchildren"]
        ]
      },
      "notes": [
        "Terminal tax rate assumes the top combined federal/provincial marginal bracket (~53.5% in Ontario, Nova Scotia, and New Brunswick). The 50% inclusion rate applies under Section 38 of the Income Tax Act.",
        "Without dedicated liquidity planning, survey data indicates that a substantial portion of recreational properties face forced sales during estate settlement."
      ]
    },
    "misunderstandings": [
      {
        "myth": "I can transfer the cottage deed to my adult children for $1.00 now to eliminate the capital gains tax at death.",
        "reality": "This is one of the most financially catastrophic mistakes in Canadian tax. Under Subsection 69(1) of the Income Tax Act, a gift or non-arm's-length transfer below FMV triggers deemed disposition for the parent at full market value, creating an immediate tax bill today. Worse, the child's cost base becomes $1.00, resulting in double taxation when they eventually sell."
      },
      {
        "myth": "Putting my children on joint tenancy with right of survivorship solves the deemed disposition problem.",
        "reality": "Joint tenancy does not evade capital gains tax. Under the Supreme Court of Canada precedent (Pecore v. Pecore), gratuitous transfers to adult children are presumed to be held in a resulting trust for the estate. Furthermore, joint tenancy exposes family assets to the children's potential creditors, lawsuits, or marital divorce claims."
      },
      {
        "myth": "Corporate holding companies protect investments from high estate taxes.",
        "reality": "CCPCs holding passive portfolios face high refundable tax mechanics (Part I and Part IV). At death, corporate shares are deemed disposed of at fair market value, creating potential double-taxation (corporate level plus shareholder level) unless post-mortem pipeline or loss-carryback planning (Subsection 164(6)) is executed within strict statutory deadlines."
      }
    ],
    "tradeoffs": [
      "Estate freeze timing: An estate freeze caps the founder's tax liability, but relinquishes future capital appreciation to the next generation.",
      "Inter-vivos gifting: Gifting property during your lifetime accelerates immediate capital gains tax realization in exchange for removing future growth from your estate.",
      "Liquidity funding: Allocating annual cashflow into tax-exempt permanent life contracts requires ongoing premium discipline, but guarantees tax-free capital delivered precisely when needed."
    ],
    "questions": [
      "What is the projected terminal capital gains liability across all family secondary properties and non-registered assets?",
      "Do our intended beneficiaries have the external liquid cash to write a six-figure cheque to the CRA within six months of second death?",
      "For business owners: has our corporate Capital Dividend Account (CDA) been audited to pull existing tax-free capital out of the company?",
      "Have we explored a Section 85/86 estate freeze or family trust structure to stem the growth of future estate taxes?"
    ],
    "sources": [
      {
        "label": "Canada Revenue Agency: Subsection 70(5) Deemed Disposition on Death",
        "url": "https://www.canada.ca/en/revenue-agency/services/tax/individuals/life-events/doing-taxes-someone-died/deemed-disposition.html",
        "note": "Statutory rules governing deemed realization of capital property upon death."
      },
      {
        "label": "Canada Revenue Agency: Capital Gains and Section 38 Inclusion Rules",
        "url": "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/personal-income/line-12700-capital-gains.html",
        "note": "Official CRA guidance confirming statutory 50% inclusion rate."
      },
      {
        "label": "Supreme Court of Canada: Pecore v. Pecore, 2007 SCC 17",
        "url": "https://decisions.scc-csc.ca/scc-csc/scc-csc/en/item/2355/index.do",
        "note": "Landmark ruling on joint bank accounts, gratuitous transfers, and resulting trust presumptions."
      }
    ],
    "related": [
      "canadian-mortgage-renewal-shock-liquidity-trap",
      "savings-or-debt-first",
      "tfsa-vs-rrsp",
      "income-depends-on-you"
    ],
    "contactTopic": "investing",
    "invitationAbout": "structuring estate liquidity, navigating capital gains rules, and safeguarding family wealth transitions",
    "url": "/insights/canadian-capital-gains-deemed-disposition-estate-trap",
    "readingMinutes": 8
  }

  ,
  {
    "slug": "term-vs-permanent-life-insurance",
    "kind": "guide",
    "title": "Term vs permanent life insurance: how to choose in Canada",
    "seoTitle": "Term vs Permanent Life Insurance Canada Decision Guide",
    "description": "Term insurance covers temporary liabilities like mortgages and child-rearing. Permanent insurance covers lifelong capital gains taxes and estate liquidity. How to choose.",
    "question": "What is the difference between term and permanent life insurance in Canada, and when does each make sense?",
    "category": "protection",
    "figuresAsOf": "Industry standard contractual features across Canadian life insurance carriers",
    "problem": "Life insurance is often presented as an ideological battle between 'Buy term and invest the difference' and 'Permanent whole life builds wealth.' In reality, they are two different tools designed for two fundamentally different financial problems.",
    "overview": [
      "Life insurance in Canada exists to solve one of two financial realities: temporary debt replacement during working years, or permanent liquidity needs upon death. Choosing between term and permanent insurance starts with understanding which of these two problems you are solving.",
      "Term life insurance provides pure death benefit protection for a fixed period—typically 10, 20, or 30 years, or up to age 65. If you pass away during the term, your beneficiaries receive a tax-free lump sum. If you outlive the term, the policy expires with zero residual cash value. Because you are only paying for pure mortality risk during healthy working years, term premiums are highly affordable, making it the ideal tool to cover a mortgage, replace family income, and protect dependent children until they become financially self-sufficient.",
      "Permanent life insurance (such as Whole Life or Universal Life) is designed to stay in force for your entire lifetime, guaranteed to pay out whenever death occurs, provided required premiums are maintained. Permanent policies also accumulate a tax-sheltered cash surrender value. In Canada, permanent insurance is primarily an estate planning and tax shelter tool: it is used to fund terminal capital gains taxes on family cottages and rental properties under Subsection 70(5), pass corporate retained earnings out of a private corporation tax-free through the Capital Dividend Account (CDA), or leave an equalized legacy among children.",
      "A critical advantage in Canadian term policies is the Contractual Conversion Privilege. Most individual term policies permit you to convert all or part of your term coverage into permanent insurance at any point before age 65 or 70 without providing medical evidence or undergoing health underwriting. This allows young families to purchase high amounts of low-cost term protection today while preserving their option to lock in permanent estate coverage later in life regardless of future health changes."
    ],
    "example": {
      "title": "Hypothetical Comparison: 35-Year-Old Canadian Non-Smoker ($500,000 Coverage)",
      "intro": "A 35-year-old Canadian professional evaluates $500,000 in life insurance coverage. They compare a 20-Year Level Term policy against a Permanent Participating Whole Life policy.",
      "table": {
        "head": ["Feature", "20-Year Term Life Insurance", "Permanent Whole Life Insurance"],
        "rows": [
          ["Coverage Horizon", "Fixed 20 years (expires at age 55)", "Lifelong guarantee (pays at age 85, 95, etc.)"],
          ["Initial Monthly Premium", "Low (~$30 to $45 / month)", "Higher (~$350 to $500 / month)"],
          ["Primary Purpose", "Replace income, mortgage payoff, children's support", "Estate capital gains tax, business transfer, legacy"],
          ["Cash Surrender Value", "None (pure insurance risk protection)", "Builds tax-sheltered cash value over time"],
          ["Conversion Option", "Convertible to permanent without medical exam", "Already permanent; policy loan options available"],
          ["Tax Treatment of Payout", "100% Tax-free to beneficiaries", "100% Tax-free to beneficiaries / CDA credit"]
        ]
      },
      "notes": [
        "Figures are hypothetical illustrations of Canadian standard risk classifications.",
        "Many Canadian families combine both: large term coverage for temporary liabilities plus a modest permanent base for lifetime estate settlement."
      ]
    },
    "misunderstandings": [
      {
        "myth": "Mortgage insurance through the bank is the same thing as individual term life insurance.",
        "reality": "Bank mortgage life insurance is creditor insurance where the bank is the beneficiary, the payout declines as your mortgage balance decreases while premiums remain flat, and underwriting often happens post-claim. Individual term life insurance is underwritten upfront, maintains a level death benefit, and pays cash directly to your family to use as they choose."
      },
      {
        "myth": "Permanent insurance is always better because term insurance 'wastes' money if you don't die.",
        "reality": "Term insurance is not a waste; it is risk transfer, exactly like home or auto insurance. Paying a modest premium so your family doesn't lose their home if you pass away prematurely is efficient risk management. Buying permanent insurance when you actually need maximum temporary coverage often results in severe under-insurance because of the higher cost."
      },
      {
        "myth": "You cannot change a term policy once you buy it.",
        "reality": "Quality Canadian term policies include a conversion rider allowing you to convert your term coverage into permanent whole life or universal life without medical underwriting, protecting you against future uninsurability if your health deteriorates."
      }
    ],
    "tradeoffs": [
      "Cost vs. Coverage Quantum: Term insurance allows young families to purchase $1,000,000+ of protection on a modest budget, whereas permanent insurance requires higher capital commitments.",
      "Temporary vs. Lifelong Need: Term insurance eventually expires or becomes prohibitively expensive upon renewal; permanent insurance guarantees a payout regardless of how long you live.",
      "Simplicity vs. Tax Optimization: Term is straightforward pure insurance; permanent life involves contractual dividend scales, crediting rates, and complex tax legislation (Section 148 of the ITA)."
    ],
    "questions": [
      "Is the need I am protecting temporary (mortgage, dependent children) or permanent (cottage capital gains tax, estate legacy)?",
      "If I died tomorrow, what exact dollar amount would my family need to replace my net income and retire all joint debts?",
      "Does my term policy include a guaranteed conversion privilege to permanent coverage without a medical exam?",
      "For business owners: would corporate-owned life insurance allow us to extract retained earnings through the Capital Dividend Account tax-free?"
    ],
    "sources": [
      {
        "label": "Financial Consumer Agency of Canada — Life Insurance Explained",
        "url": "https://www.canada.ca/en/financial-consumer-agency/services/insurance/life.html",
        "note": "Official Canadian government guide on term vs permanent life insurance policies."
      },
      {
        "label": "Canadian Life and Health Insurance Association (CLHIA) — Consumer Guide",
        "url": "https://www.clhia.ca/",
        "note": "Industry standards on policy underwriting, conversion privileges, and beneficiary protections."
      },
      {
        "label": "Canada Revenue Agency — Subsection 148: Life Insurance Policies",
        "url": "https://www.canada.ca/en/revenue-agency/services/tax/technical-information/income-tax/income-tax-folios-index/series-3-property-investments-savings-plans/series-3-property-investments-savings-plan-folio-9-life-insurance/income-tax-folio-s3-f9-c1-lottery-winnings-miscellaneous-receipts-income-losses-life-insurance-policies.html",
        "note": "Tax treatment of death benefits and cash surrender values under the Income Tax Act."
      }
    ],
    "related": [
      "income-depends-on-you",
      "canadian-capital-gains-deemed-disposition-estate-trap",
      "questions-before-any-financial-product",
      "savings-or-debt-first"
    ],
    "contactTopic": "protection",
    "invitationAbout": "evaluating term vs permanent insurance options and calculating family coverage requirements",
    "url": "/education/term-vs-permanent-life-insurance",
    "readingMinutes": 5
  }

  ,
{
  "slug": "internationally-trained-doctors-nurses-first-year",
  "kind": "guide",
  "title": "Internationally trained doctors and nurses: your first year of money in Canada",
  "seoTitle": "Trained abroad: your first year of money in Canada",
  "description": "Licensing takes time and your income may start late. How tax, credit, savings and benefits work in a first year while your credentials are being recognized.",
  "question": "How should I plan my money in Canada while my licence and credentials are still being recognized?",
  "category": "newcomers",
  "figuresAsOf": "2026 TFSA limit and CRA and FCAC guidance as published on the pages listed under Sources",
  "problem": "A physician or nurse trained abroad often arrives with years of experience and no Canadian licence yet. The risk is not a lack of skill. It is a gap between the day your costs start and the day your professional income does, and nobody can tell you exactly how long that gap will be.",
  "overview": [
    "Plan around the gap, not the salary. Your regulator sets the steps, fees and order for licensing in your province, and the timeline can change. A sensible first-year plan asks how many months your savings can cover if recognition takes longer than hoped.",
    "Tax residency starts early. CRA says you become a resident for income tax purposes when you have enough residential ties in Canada, and that for most newcomers this starts the first day you live here. Your first return is due after the year you arrive. CRA\u2019s own example: someone who arrived in 2025 files that return by April 30, 2026. The deadline is June 15 if you or your spouse or common-law partner are self-employed. CRA also uses your return to work out benefits and credits, even if you have no income to report, and says you can apply for benefits and credits as soon as you arrive if you meet the eligibility criteria.",
    "Savings you bring with you. A Canadian resident who holds specified foreign property with a total cost of more than CAD $100,000 at any time in the year files Form T1135 with their tax return. The test uses cost, not market value. You do not file it for the year you first become a resident. In later years, the cost of property you owned on arrival is its fair market value on the day you became a resident. The rules are technical, so a tax professional is the right person to confirm what applies to you.",
    "Registered accounts start from zero. TFSA room begins on the day you become a resident, if you are 18 or older, and nothing accumulates for the years before. The 2026 limit is $7,000. RRSP room is generally built from 18% of your earned income in the previous year, up to the annual maximum, so it can be small in your first year. An FHSA requires you to be a resident, 18 or older, and a first-time home buyer as CRA defines it, and you give the issuer your Social Insurance Number.",
    "Credit starts here too. The Financial Consumer Agency of Canada (FCAC) says Canadian credit scores usually range from 300 to 900 and come from reports kept by two main bureaus, Equifax and TransUnion. It notes that a limited credit history may make it harder to borrow, get a credit card or rent a home. Do not assume your history from home carries over; ask each lender what it will consider.",
    "Banking and your SIN. Banks must confirm your identity with original identification, and foreign passports are on the approved list. Some institutions may ask you to visit a branch in person. A Social Insurance Number is a nine-digit number needed to work in Canada or access government programs and benefits. A temporary resident\u2019s SIN starts with 9 and expires with their immigration documents. It is private, and you are responsible for protecting it.",
    "Help with licensing costs. The federal Foreign Credential Recognition program lists loans of up to $30,000, offered through participating organizations, to help with licensing and exam fees, additional training or tuition. Eligibility depends on your immigration status and province. A loan is still debt, so the terms matter as much as the amount.",
    "Sending money home. FCAC says the real cost of sending money abroad includes transfer fees, exchange-rate costs and charges paid by the recipient, and that a low fee may be offset by a less favourable exchange rate. Compare the total, not just the headline fee."
  ],
  "example": {
    "title": "How long recognition takes changes the whole plan",
    "intro": "Hypothetical figures. A household arrives with CAD $30,000 in savings. Monthly living costs are $3,200, and exam, licensing and preparation costs are $6,000 in total. The table ignores any interim income to show the effect of timing alone.",
    "table": {
      "head": [
        "Item",
        "8 months to first professional pay",
        "14 months to first professional pay"
      ],
      "rows": [
        [
          "Living costs ($3,200 \u00d7 months)",
          "$25,600",
          "$44,800"
        ],
        [
          "Exam, licensing and preparation",
          "$6,000",
          "$6,000"
        ],
        [
          "Total needed",
          "$31,600",
          "$50,800"
        ],
        [
          "Savings on arrival",
          "$30,000",
          "$30,000"
        ],
        [
          "Shortfall (our calculation)",
          "$1,600",
          "$20,800"
        ]
      ]
    },
    "notes": [
      "All numbers here are invented to show how the arithmetic works. They are not typical costs and not a prediction of how long recognition takes.",
      "Six more months of waiting turns a small shortfall into a large one. That is why the longer timeline, not the hopeful one, is the useful number to plan around.",
      "Interim income, a partner\u2019s earnings, family support or a loan would change the picture. Each has its own trade-offs."
    ]
  },
  "misunderstandings": [
    {
      "myth": "My credit history and my credentials come with me.",
      "reality": "Credit generally starts from the beginning here, and professional licensing is a separate process run for your profession in your province or territory. The federal program describes recognition as verifying that foreign education, skills and experience are equivalent to Canadian standards."
    },
    {
      "myth": "If I have no Canadian income yet, I do not need to think about a tax return.",
      "reality": "CRA says it uses your return each year, even if you have no income to report, and that it works out benefits and credits from it. Your first return is due after the year you arrive."
    },
    {
      "myth": "Money I keep abroad is not CRA\u2019s concern once I live here.",
      "reality": "A Canadian resident whose specified foreign property cost more than CAD $100,000 at any time in a year generally files Form T1135 with that year\u2019s return, except for the year they first become a resident. Ask a tax professional what applies to you."
    },
    {
      "myth": "I will have as much TFSA and RRSP room as colleagues who have lived here for years.",
      "reality": "TFSA room starts on the day you become a resident, and RRSP room builds from earned income. Newcomers usually start with much less."
    },
    {
      "myth": "A low transfer fee means sending money home is cheap.",
      "reality": "FCAC warns that providers may make up for a low fee with a less favourable exchange rate. Compare the total cost, including what the recipient pays."
    }
  ],
  "tradeoffs": [
    "Money you commit to a registered account or send abroad is money not available for licensing fees and living costs while your income is uncertain. Think about how quickly you could reach it.",
    "A credit card builds a Canadian record if you use it responsibly, but carries high interest if the balance is not paid in full.",
    "A recognition loan can cover exam and training fees, but it adds a repayment you will carry before your professional income starts.",
    "Taking interim work can protect your savings, but it may take time from exam preparation. The right balance differs for each person.",
    "Rules differ by profession, province, immigration status and family situation. Treat this guide as a starting point and check with your regulator and the official sources below."
  ],
  "questions": [
    "What are all the licensing steps, fees and realistic timelines for my profession in my province, according to the regulator?",
    "How many months can my savings cover if recognition takes six months longer than I hope?",
    "What work am I allowed to do in the meantime under my immigration status?",
    "Do I hold foreign property whose total cost could exceed CAD $100,000 after my arrival year?",
    "Which benefits and credits might my family qualify for, and have I applied?",
    "Does my province\u2019s public health plan start right away, or is there a gap I need to plan for?",
    "What is the total cost, including exchange rate, of sending money home?",
    "Would I count as a first-time home buyer for an FHSA, and how does CRA treat a home I owned abroad?",
    "Which of these questions should I ask a tax professional this year?"
  ],
  "sources": [
    {
      "label": "Canada Revenue Agency \u2014 Newcomers to Canada and the CRA",
      "url": "https://www.canada.ca/en/revenue-agency/services/tax/international-non-residents/individuals-leaving-entering-canada-non-residents/newcomers-canada-immigrants.html",
      "note": "Residency for tax purposes, first return, benefits and credits."
    },
    {
      "label": "Canada Revenue Agency \u2014 Questions and answers about Form T1135",
      "url": "https://www.canada.ca/en/revenue-agency/services/tax/international-non-residents/information-been-moved/foreign-reporting/questions-answers-about-form-t1135.html",
      "note": "Foreign property over CAD $100,000, arrival-year rule, cost on arrival."
    },
    {
      "label": "Canada Revenue Agency \u2014 Before you contribute to a TFSA",
      "url": "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/tax-free-savings-account/contributing/before.html",
      "note": "TFSA room for new residents; 2026 limit."
    },
    {
      "label": "Canada Revenue Agency \u2014 How contributions affect your RRSP deduction limit",
      "url": "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/rrsps-related-plans/contributing-a-rrsp-prpp/contributions-affect-your-rrsp-prpp-deduction-limit.html"
    },
    {
      "label": "Canada Revenue Agency \u2014 Opening and closing your FHSAs",
      "url": "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/first-home-savings-account/opening-closing-and-fhsa.html"
    },
    {
      "label": "Government of Canada \u2014 Social Insurance Number",
      "url": "https://www.canada.ca/en/employment-social-development/services/sin.html"
    },
    {
      "label": "Government of Canada \u2014 Foreign Credential Recognition",
      "url": "https://www.canada.ca/en/employment-social-development/programs/foreign-credential-recognition.html",
      "note": "Recognition loans and participating organizations. Check current eligibility."
    },
    {
      "label": "Financial Consumer Agency of Canada \u2014 Opening a bank account",
      "url": "https://www.canada.ca/en/financial-consumer-agency/services/banking/opening-bank-account.html"
    },
    {
      "label": "Financial Consumer Agency of Canada \u2014 Credit report and score basics",
      "url": "https://www.canada.ca/en/financial-consumer-agency/services/credit-reports-score/credit-report-score-basics.html"
    },
    {
      "label": "Financial Consumer Agency of Canada \u2014 Sending money to someone in another country",
      "url": "https://www.canada.ca/en/financial-consumer-agency/services/payment/international-money-transfers.html"
    }
  ],
  "related": [
    "new-to-canada-money-basics",
    "tfsa-vs-rrsp",
    "fhsa-explained"
  ],
  "contactTopic": "newcomer",
  "invitationAbout": "your first year of money in Canada",
  "url": "/education/internationally-trained-doctors-nurses-first-year",
  "readingMinutes": 6
}
];