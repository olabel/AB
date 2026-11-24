import React, { useState } from "react";
import { Link } from "react-router-dom";
import { SEO } from "../components/SEO.tsx";
import { useLanguage } from "../context/LanguageContext.tsx";
import { siteConfig, getCtaLabel, getSecondaryCtaLabel } from "../config/site.ts";
import { trackBookingClick } from "../lib/track.ts";
import {
  Calendar,
  TrendingDown,
  Scale,
  ShieldCheck,
  Building2,
  Home,
  PiggyBank,
  ArrowRight,
  CheckCircle2,
  FileText,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

interface RuleChangeItem {
  id: string;
  month: string;
  year: number;
  category: "rates" | "tax" | "mortgage" | "corporate";
  categoryLabelEn: string;
  categoryLabelFr: string;
  titleEn: string;
  titleFr: string;
  summaryEn: string;
  summaryFr: string;
  ahmedAnalysisEn: string;
  ahmedAnalysisFr: string;
  actionItemsEn: string[];
  actionItemsFr: string[];
  relatedLink?: {
    toEn: string;
    toFr: string;
    labelEn: string;
    labelFr: string;
  };
  officialSource: {
    label: string;
    url: string;
  };
}

const RULE_CHANGES: RuleChangeItem[] = [
  {
    id: "nov-2026-budget-2026-t1135-may15-rrsp",
    month: "November",
    year: 2026,
    category: "tax",
    categoryLabelEn: "Federal Budget 2026 & Tax Filing",
    categoryLabelFr: "Budget fédéral 2026 & Déclarations",
    titleEn: "Budget 2026 Proposals: Form T1135 Threshold Raised to $200k, Unified May 15 Filing & RRSP-for-Life Study",
    titleFr: "Budget fédéral 2026 : seuil T1135 porté à 200 000 $, date unique au 15 mai et étude REER à vie",
    summaryEn:
      "Tabled on November 5, 2026, Federal Budget 2026 (\"Masters of Our Destiny\") left general personal and corporate income tax rates unchanged while proposing major administrative shifts: doubling the Form T1135 foreign property reporting threshold from $100,000 to $200,000 CAD cost (with simplified reporting up to $500,000 for tax years ending after 2026), moving to a unified May 15 T1 filing and payment deadline starting with the 2027 tax year, raising tax instalment thresholds ($7,500 outside Quebec; $4,500 in Quebec) starting in 2028, and launching consultations (open through January 8, 2027) on an \"RRSP-for-life\" that removes mandatory age-71 RRIF conversion while keeping mandatory minimum withdrawals after 71.",
    summaryFr:
      "Déposé le 5 novembre 2026, le Budget fédéral 2026 (« Maîtres chez nous ») maintient les taux généraux d'impôt tout en proposant des changements administratifs majeurs : doublement du seuil T1135 (biens étrangers) de 100 000 $ à 200 000 $ CA (déclaration simplifiée jusqu'à 500 000 $ après 2026), date unique au 15 mai pour les T1 et paiements à compter de l'année 2027, relèvement des seuils d'acomptes provisionnels (7 500 $ hors Québec ; 4 500 $ au Québec) dès 2028 et consultations jusqu'au 8 janvier 2027 sur un « REER à vie » supprimant la conversion obligatoire à 71 ans tout en maintenant les retraits minimums annuels.",
    ahmedAnalysisEn:
      "My Take: For professionals holding US ETFs in non-registered brokerage accounts or international assets after immigrating to Canada, raising the Form T1135 cost threshold from $100,000 to $200,000 (for tax years ending after 2026 once enacted) removes a frequent $2,500 late-filing penalty trap. Equally important for planning: Budget measures are proposals until Royal Assent, so continue following existing $100,000 T1135 rules for 2025–2026 returns, and remember the proposed RRSP-for-life still preserves mandatory minimum withdrawals past age 71.",
    ahmedAnalysisFr:
      "Mon analyse : Pour les familles et nouveaux arrivants détenant des FNB américains hors régime enregistré ou des actifs étrangers, le relèvement proposé du seuil T1135 à 200 000 $ (après 2026 une fois sanctionné) éliminera un piège fréquent de pénalités (jusqu'à 2 500 $/an). Ces annonces restent toutefois des propositions jusqu'à la sanction royale : respectez le seuil de 100 000 $ pour 2025-2026, et retenez que les retraits minimums après 71 ans demeureraient obligatoires sous le REER à vie.",
    actionItemsEn: [
      "Keep tracking non-registered foreign asset cost basis against the existing $100,000 CAD threshold for 2025–2026 returns until the $200,000 proposal (tax years ending after 2026) is enacted.",
      "Note the proposed unified May 15 T1 deadline applies starting with the 2027 taxation year (spring 2028); 2026 returns remain due April 30, 2027 (June 15 to file for self-employed, taxes still due April 30).",
      "Review how 2028 instalment thresholds ($7,500 outside Quebec; $4,500 in Quebec) and RRSP-for-life minimum-withdrawal rules affect retirement cash flow.",
    ],
    actionItemsFr: [
      "Continuez de surveiller vos biens étrangers hors REER/CELI par rapport au seuil actuel de 100 000 $ pour 2025-2026 tant que la loi n'est pas sanctionnée.",
      "Retenez que la date unique du 15 mai ne viserait qu'à partir de l'année fiscale 2027 (printemps 2028) ; pour 2026, l'échéance du 30 avril s'applique.",
      "Tenez compte des seuils d'acomptes 2028 (7 500 $ hors Québec ; 4 500 $ au Québec) et des retraits minimums maintenus après 71 ans dans vos projections.",
    ],
    relatedLink: {
      toEn: "/education/new-to-canada-money-basics",
      toFr: "/fr/education/new-to-canada-money-basics",
      labelEn: "Read Newcomer & Cross-Border Basics Guide",
      labelFr: "Consulter le guide pour nouveaux arrivants",
    },
    officialSource: {
      label: "Department of Finance Canada - Budget 2026",
      url: "https://budget.canada.ca/2026",
    },
  },
  {
    id: "nov-2026-cra-2027-registered-limits",
    month: "November",
    year: 2026,
    category: "tax",
    categoryLabelEn: "Registered Shelters & CPP Indexation",
    categoryLabelFr: "Régimes enregistrés & Plafonds RRQ/RPC",
    titleEn: "CRA Confirms 2027 Limits: TFSA Rises to $7,500, RRSP to $35,390, YMPE $76,700 & YAMPE $87,400",
    titleFr: "Plafonds 2027 confirmés par l'ARC : CELI à 7 500 $, REER à 35 390 $, MGA 76 700 $ & MGAP 87 400 $",
    summaryEn:
      "Driven by CRA's 2.6% inflation indexation factor for 2027, the Tax-Free Savings Account (TFSA) annual limit rises to $7,500 on January 1, 2027 (up from $7,000 for 2024–2026), bringing cumulative lifetime TFSA room since 2009 to $116,500 ($109,000 through 2026). Separately, the 2027 RRSP dollar limit rises to $35,390 (up from $33,810 in 2026, requiring $196,611 of 2026 earned income), the 2027 Money Purchase limit climbs to $36,390, CPP YMPE climbs to $76,700 (2026: $74,600), and CPP2 YAMPE climbs to $87,400 (2026: $85,000).",
    summaryFr:
      "Porté par le facteur d'indexation de 2,6 % de l'ARC pour 2027, le plafond annuel du CELI passe à 7 500 $ le 1er janvier 2027 (contre 7 000 $ de 2024 à 2026), portant les droits cumulatifs depuis 2009 à 116 500 $ (109 000 $ jusqu'en 2026). Parallèlement, le plafond REER 2027 grimpe à 35 390 $ (contre 33 810 $ en 2026, exigeant 196 611 $ de revenu gagné en 2026), le plafond CD 2027 atteint 36 390 $, le MGA du RPC monte à 76 700 $ (2026 : 74 600 $) et le MGAP (RPC2) à 87 400 $ (2026 : 85 000 $).",
    ahmedAnalysisEn:
      "My Take: Having 2027's $7,500 TFSA boost confirmed gives households an extra $500 per adult of tax-free shelter on January 1 alongside 2027's higher $35,390 RRSP cap. Remember the timing rule before year-end: if you plan to draw TFSA cash soon for a home closing or lump-sum expense, completing the withdrawal by December 31 restores that room on January 1 alongside your new $7,500 allocation.",
    ahmedAnalysisFr:
      "Mon analyse : La confirmation du passage du CELI à 7 500 $ en 2027 offre 500 $ supplémentaires d'abri fiscal par adulte dès le 1er janvier, en plus du plafond REER porté à 35 390 $. Rappel de fin d'année : tout retrait CELI effectué avant le 31 décembre régénère vos droits le 1er janvier en s'additionnant à la nouvelle tranche de 7 500 $.",
    actionItemsEn: [
      "Verify your exact 2026 RRSP deduction limit ($33,810 max) on your Notice of Assessment before the early-2027 deadline; budget for the $35,390 ceiling next tax year.",
      "Schedule any planned near-term TFSA withdrawals before December 31 so withdrawn room re-opens on January 1 along with the new $7,500 2027 annual room.",
      "Factor 2027 YMPE ($76,700) and YAMPE ($87,400) payroll deductions into household cash-flow and owner-manager T4/dividend compensation planning.",
    ],
    actionItemsFr: [
      "Vérifiez votre plafond REER exact de 2026 (max. 33 810 $) sur votre avis de cotisation dans Mon dossier ARC ; prévoyez 35 390 $ pour l'an prochain.",
      "Planifiez tout retrait CELI prévu à court terme avant le 31 décembre pour libérer vos droits au 1er janvier avec la nouvelle tranche de 7 500 $.",
      "Intégrez les nouveaux plafonds MGA (76 700 $) et MGAP (87 400 $) dans la planification salariale T4/dividendes et les flux de trésorerie.",
    ],
    relatedLink: {
      toEn: "/education/tfsa-vs-rrsp-vs-fhsa-which-to-maximize-first",
      toFr: "/fr/education/tfsa-vs-rrsp-vs-fhsa-which-to-maximize-first",
      labelEn: "Compare TFSA vs. RRSP vs. FHSA Priority",
      labelFr: "Comparer l'ordre de priorité CELI / REER / CELIAPP",
    },
    officialSource: {
      label: "Canada Revenue Agency - MP, DB, RRSP, DPSP, ALDA, TFSA & YMPE/YAMPE Limits",
      url: "https://www.canada.ca/en/revenue-agency/services/tax/registered-plans-administrators/pspa/mp-rrsp-dpsp-tfsa-limits-ympe.html",
    },
  },
  {
    id: "nov-2026-budget-corporate-growth-incentive",
    month: "November",
    year: 2026,
    category: "corporate",
    categoryLabelEn: "Corporate & Personal Tax",
    categoryLabelFr: "Fiscalité corporative & Patrimoine",
    titleEn: "Budget 2026 Corporate Rules: $15M Canada Growth Incentive, Pro-Corp Exclusions & SBD Planning",
    titleFr: "Budget 2026 pour les sociétés : Incitatif de croissance de 15 M$, exclusions et gestion DPE",
    summaryEn:
      "Alongside retaining Canada's 50% capital gains inclusion rate and the $1.25 million base Lifetime Capital Gains Exemption (indexed to $1,275,000 for 2026), Budget 2026 proposes the Productivity Mega Deduction (lowering the marginal effective tax rate on qualifying new business investments from 13% to 6.4%), an expanded small-business rollover, and the $15 million Canada Growth Incentive on qualifying shares issued November 5, 2026 through 2036 (under $100M asset limits and a 36-month hold). Crucially, professional corporations (medicine, law, accounting, engineering, architecture, and consulting) and skill-based service practices are expressly excluded from the $15M CGI.",
    summaryFr:
      "Tout en maintenant l'inclusion des gains en capital à 50 % et l'ECGC indexée à 1 275 000 $ en 2026, le Budget 2026 propose la Méga-déduction pour la productivité (taux effectif ramené de 13 % à 6,4 %) et l'Incitatif de croissance du Canada (exonérant jusqu'à 15 M$ de gains sur actions admissibles émises entre le 5 novembre 2026 et 2037, sous réserve d'un actif sous 100 M$ et d'une détention de 36 mois). Point crucial : les sociétés professionnelles (médecins, avocats, comptables, ingénieurs, consultants) en sont expressément exclues.",
    ahmedAnalysisEn:
      "My Take: Incorporated physicians, lawyers, and consultants must read the fine print carefully: professional corporations cannot rely on the $15M Canada Growth Incentive on an exit, making existing LCGE qualification ($1,275,000 in 2026) and passive-income management even more vital. Across all CCPCs, passive portfolios above $50,000 in Adjusted Aggregate Investment Income (AAII) still face the 5-for-1 Small Business Deduction grind under ITA s. 125(5.1), and realized gains still interact with personal AMT.",
    ahmedAnalysisFr:
      "Mon analyse : Les médecins, avocats et consultants incorporés doivent lire les exclusions de près : les sociétés professionnelles n'ont pas accès à l'exonération de 15 M$ de l'Incitatif de croissance, ce qui rend la gestion de l'ECGC (1 275 000 $ en 2026) et des revenus passifs encore plus déterminante. Tout portefeuille passif dépassant 50 000 $ de RPAA continue de réduire la DPE à raison de 5 $ pour 1 $ sous le par. 125(5.1).",
    actionItemsEn: [
      "Audit T2 Schedule 7 Adjusted Aggregate Investment Income (AAII) to monitor proximity to the $50,000 SBD passive-income grind threshold.",
      "Do not assume a medical, legal, accounting, or consulting corporation qualifies for the proposed $15M Canada Growth Incentive—verify statutory exclusions with your CPA.",
      "Coordinate corporate Capital Dividend Account (CDA) payouts alongside personal AMT thresholds before executing asset or share sales.",
    ],
    actionItemsFr: [
      "Vérifiez l'annexe 7 de votre T2 pour mesurer la proximité du seuil de 50 000 $ de revenu passif réduisant la DPE.",
      "Ne présumez jamais qu'une société médicale, juridique ou de services-conseils est admissible à l'Incitatif de croissance de 15 M$ ; validez avec votre CPA.",
      "Coordonnez les versements du Compte de dividendes en capital (CDC) avec l'IMR personnel avant toute transaction importante.",
    ],
    relatedLink: {
      toEn: "/insights/canadian-ccpc-passive-income-grind-sbd-tax-trap",
      toFr: "/fr/insights/canadian-ccpc-passive-income-grind-sbd-tax-trap",
      labelEn: "Read CCPC $50k Passive Income Grind Guide",
      labelFr: "Lire le guide sur le seuil passif de 50 000 $ des SPCC",
    },
    officialSource: {
      label: "Department of Finance Canada - Budget 2026",
      url: "https://budget.canada.ca/2026",
    },
  },
  {
    id: "oct-2026-boc-rate-hike-250",
    month: "October",
    year: 2026,
    category: "rates",
    categoryLabelEn: "Monetary Policy & Interest Rates",
    categoryLabelFr: "Politique monétaire & Taux d'intérêt",
    titleEn: "Bank of Canada Raises Policy Rate to 2.50% (Oct 28, 2026): Prime Lending Moves to 4.70%",
    titleFr: "La Banque du Canada relève le taux directeur à 2,50 % (28 oct. 2026) : taux préférentiel à 4,70 %",
    summaryEn:
      "After holding its target for the overnight rate steady at 2.25% from January through September 2026, the Bank of Canada raised the policy rate by 25 basis points to 2.50% on October 28, 2026 (Bank Rate 2.75%; deposit rate 2.45%). Major Canadian chartered banks raised their prime rates from 4.45% to 4.70% in response. The final scheduled rate announcement of 2026 is December 9.",
    summaryFr:
      "Après avoir maintenu son taux directeur à 2,25 % de janvier à septembre 2026, la Banque du Canada l'a relevé de 25 points de base à 2,50 % le 28 octobre 2026 (taux d'escompte 2,75 % ; taux de dépôt 2,45 %). En conséquence, les grandes banques canadiennes ont porté leur taux préférentiel de 4,45 % à 4,70 %. La dernière annonce prévue pour 2026 aura lieu le 9 décembre.",
    ahmedAnalysisEn:
      "My Take: A 25 bps policy hike reminds borrowers that rates move in cycles, not straight lines. If you carry a variable-rate mortgage (especially a fixed-payment variable structure where higher rates shift payment allocation toward interest), HELOC, or floating corporate line of credit, your borrowing cost moved up to prime 4.70% minus or plus spread. Meanwhile, fixed 3- to 5-year mortgage pricing continues to track Government of Canada bond yields closely ahead of the December 9 decision.",
    ahmedAnalysisFr:
      "Mon analyse : Ce relèvement de 25 points de base rappelle que les taux évoluent par cycles. Les emprunteurs à taux variable, marge hypothécaire (HELOC) ou marge commerciale voient leur coût indexé sur un taux préférentiel de 4,70 %. Pour les renouvellements fixes à 3 ou 5 ans, surveillez les rendements obligataires du gouvernement du Canada d'ici l'annonce du 9 décembre.",
    actionItemsEn: [
      "Check whether your variable mortgage has static monthly payments or adjustable payments so you aren't surprised by amortization lengthening.",
      "Compare your current variable rate against competitive 3-year and 5-year fixed renewal quotes before December 9.",
      "Stress-test your emergency reserve (3–6 months of core expenses) and floating-rate debt servicing costs at prime +0.50%.",
    ],
    actionItemsFr: [
      "Vérifiez si votre hypothèque variable a des paiements fixes ou ajustables pour éviter un allongement discret de l'amortissement.",
      "Comparez votre taux variable actuel aux offres fixes 3 ans et 5 ans en prévision de la décision du 9 décembre.",
      "Assurez-vous que votre fonds d'urgence couvre 3 à 6 mois de dépenses essentielles avec un taux préférentiel à 4,70 %.",
    ],
    relatedLink: {
      toEn: "/insights/canadian-mortgage-renewal-shock-liquidity-trap",
      toFr: "/fr/insights/canadian-mortgage-renewal-shock-liquidity-trap",
      labelEn: "Read Mortgage Renewal & Liquidity Guide",
      labelFr: "Lire l'analyse sur le renouvellement hypothécaire",
    },
    officialSource: {
      label: "Bank of Canada - Policy Interest Rate",
      url: "https://www.bankofcanada.ca/core-functions/monetary-policy/key-interest-rate/",
    },
  },
  {
    id: "oct-2026-cra-prescribed-rate-3pct",
    month: "October",
    year: 2026,
    category: "tax",
    categoryLabelEn: "Tax Rules & Income Splitting",
    categoryLabelFr: "Fiscalité & Fractionnement du revenu",
    titleEn: "CRA Q4 2026 Prescribed Rate at 3% for Spousal Loans (7% Arrears Interest on Overdue Taxes)",
    titleFr: "Taux prescrit T4 2026 de l'ARC à 3 % pour prêts entre conjoints (7 % sur soldes dus)",
    summaryEn:
      "For Q4 2026 (October 1 to December 31, 2026), the CRA prescribed annual interest rate for taxable benefits on employee, shareholder, and spousal/family low-interest loans remains at 3% (unchanged from Q3 2026). Meanwhile, the prescribed rate charged by the CRA on overdue taxes, CPP contributions, and EI premiums is 7%, and the interest paid on non-corporate taxpayer overpayments is 5% (corporate overpayments: 3%).",
    summaryFr:
      "Pour le T4 2026 (du 1er octobre au 31 décembre 2026), le taux d'intérêt prescrit par l'ARC pour les prêts à faible intérêt (employés, actionnaires et conjoints) demeure fixé à 3 %. En parallèle, l'intérêt facturé par l'ARC sur les impôts, cotisations RPC et primes d'AE en souffrance s'établit à 7 %, tandis que les remboursements aux particuliers portent intérêt à 5 % (3 % pour les sociétés).",
    ahmedAnalysisEn:
      "My Take: A 3% prescribed rate offers a much wider planning spread for higher-bracket earners considering a formal spousal loan than the 5%–6% rates seen during peak tightening. Remember two strict CRA rules: interest must actually be paid every year on or before January 30 (one day late voids attribution protection permanently), and leaving unpaid CRA tax balances outstanding at 7% non-deductible arrears interest is rarely worth keeping cash sitting in a lower-yielding account.",
    ahmedAnalysisFr:
      "Mon analyse : Un taux prescrit de 3 % élargit la marge de fractionnement du revenu pour les couples ayant un écart fiscal important et des placements non enregistrés significatifs. Deux règles demeurent strictes : les intérêts doivent être payés au plus tard le 30 janvier de chaque année (sinon les règles d'attribution s'appliquent définitivement), et aucun rendement garanti ne justifie de payer 7 % d'intérêt non déductible à l'ARC.",
    actionItemsEn: [
      "If setting up a new 3% spousal loan before December 31, work with tax and legal professionals to document a formal demand promissory note and traceable fund transfers.",
      "Calendar the non-negotiable January 30 annual interest payment deadline with proof of payment.",
      "Prioritize clearing overdue CRA balances charging 7% non-deductible interest before optimizing lower-priority savings goals.",
    ],
    actionItemsFr: [
      "Si vous mettez en place un prêt prescrit à 3 %, faites rédiger un billet à ordre formel et documentez le virement avec vos conseillers juridiques et fiscaux.",
      "Notez la date impérative du 30 janvier chaque année pour le paiement des intérêts avec preuve bancaire.",
      "Réglez en priorité tout solde dû à l'ARC facturé à 7 % d'intérêt non déductible.",
    ],
    relatedLink: {
      toEn: "/education/prescribed-rate-spousal-loans-tax-arbitrage-guide",
      toFr: "/fr/education/prescribed-rate-spousal-loans-tax-arbitrage-guide",
      labelEn: "Read Prescribed Rate Spousal Loan Guide",
      labelFr: "Lire le guide sur les prêts au taux prescrit",
    },
    officialSource: {
      label: "Canada Revenue Agency - Prescribed Interest Rates (Q4 2026)",
      url: "https://www.canada.ca/en/revenue-agency/services/tax/prescribed-interest-rates.html",
    },
  },
  {
    id: "active-2026-osfi-b20-lti-straight-switch",
    month: "Active",
    year: 2026,
    category: "mortgage",
    categoryLabelEn: "Mortgage Underwriting & Renewals",
    categoryLabelFr: "Souscription & Renouvellements hypothécaires",
    titleEn: "OSFI Mortgage Rules in Effect: 4.5x Loan-to-Income (LTI) Cap & Uninsured Straight-Switch Exemption",
    titleFr: "Règles du BSIF en vigueur : plafond ratio prêt-revenu (4,5x) et transfert sans test de résistance",
    summaryEn:
      "Under OSFI's Guideline B-20 framework, federally regulated lenders operate under portfolio-level 4.5x Loan-to-Income (LTI) constraints on new uninsured mortgages while applying the Minimum Qualifying Rate (MQR) stress test on new purchases and refinances. For existing homeowners at renewal, however, straight switches of uninsured residential mortgages (no increase to principal balance or remaining amortization) remain exempt from re-applying the MQR stress test. OSFI also clarified that Capital Adequacy Requirements (CAR) updates for rental properties apply strictly to institutional capital reserves, not Guideline B-20 borrower underwriting.",
    summaryFr:
      "En vertu de la ligne directrice B-20 du BSIF, les prêteurs fédéraux appliquent des limites de portefeuille basées sur un ratio prêt-revenu de 4,5x pour les nouveaux prêts non assurés, en plus du test de résistance (taux de qualification minimal). Toutefois, au renouvellement, les transferts simples (sans hausse du capital ni allongement d'amortissement) d'hypothèques non assurées entre prêteurs fédéraux demeurent exemptés du test de résistance. Le BSIF a également précisé que les mises à jour CAR sur les immeubles locatifs visent les réserves des banques et non l'admissibilité des emprunteurs sous B-20.",
    ahmedAnalysisEn:
      "My Take: Homebuyers stretching for a first purchase feel the 4.5x LTI lender cap most sharply in high-price metros, making down-payment sizing critical. Meanwhile, renewing homeowners who aren't increasing their mortgage balance have a strong bargaining position: lenders know you can complete a straight switch without re-qualifying under the stress test, so solicit written renewal offers 120 days early rather than accepting an uncompetitive auto-renewal letter.",
    ahmedAnalysisFr:
      "Mon analyse : Les acheteurs dans les marchés onéreux ressentent davantage le plafond de 4,5x le revenu chez les prêteurs fédéraux, d'où l'importance de la mise de fonds. En revanche, les propriétaires en renouvellement conservent un fort levier : demandez des soumissions écrites 120 jours avant l'échéance plutôt que d'accepter passivement l'offre initiale de votre banque.",
    actionItemsEn: [
      "Verify whether your existing mortgage is a Standard Charge or Collateral Charge well ahead of your renewal window.",
      "Shop competing renewal rates 90 to 120 days prior to maturity without altering principal or amortization if you want straight-switch protection.",
      "New buyers: benchmark total mortgage principal against 4.5x gross household income early in your house hunt.",
    ],
    actionItemsFr: [
      "Vérifiez si votre titre hypothécaire est enregistré à charge standard ou à charge subsidiaire avant d'amorcer vos démarches.",
      "Comparez les offres 90 à 120 jours avant l'échéance sans modifier le solde ni la durée pour préserver l'exemption au transfert.",
      "Nouveaux acheteurs : mesurez votre besoin d'emprunt par rapport au repère de 4,5 fois le revenu brut du ménage.",
    ],
    relatedLink: {
      toEn: "/education/switching-uninsured-mortgages-without-osfi-stress-test",
      toFr: "/fr/education/switching-uninsured-mortgages-without-osfi-stress-test",
      labelEn: "Read Uninsured Straight-Switch Mortgage Guide",
      labelFr: "Lire le guide sur les transferts sans test de résistance",
    },
    officialSource: {
      label: "OSFI - Guideline B-20 Straight-Switch Policy",
      url: "https://www.osfi-bsif.gc.ca/en/news/osfi-removes-underwriting-barriers-straight-switches-uninsured-mortgages",
    },
  },
  {
    id: "active-2026-14pct-rate-amt-fhsa-hbp",
    month: "Active",
    year: 2026,
    category: "corporate",
    categoryLabelEn: "2026 Marginal Rates, AMT & Home Buyers",
    categoryLabelFr: "Taux 2026, IMR & Premiers acheteurs",
    titleEn: "2026–2027 Federal Tax Rules: 14% Lowest Bracket, $181,440/$186,157 AMT Exemption & $60k HBP",
    titleFr: "Règles fédérales 2026-2027 : palier de base à 14 %, exemption IMR (181 440 $/186 157 $) et RAP 60 000 $",
    summaryEn:
      "For 2026, Canada's lowest federal marginal rate is 14.0% on taxable income up to $58,523 ($16,452 Basic Personal Amount), indexing 2.6% for 2027 to $60,044 ($16,879 max BPA). Large capital realizations fall under the post-2024 Alternative Minimum Tax (Bills C-59 & C-69: 20.5% flat rate, $181,440 exemption in 2026 / $186,157 in 2027, 100% capital gains inclusion, and 80% donation credit allowance). Separately, CRA's T4FHSA matching enforces 1%/month excess penalties (Form RC727), and $60,000 HBP + $40,000 FHSA stacking remains active.",
    summaryFr:
      "Pour 2026, le premier palier fédéral est de 14,0 % jusqu'à 58 523 $ (MPB de 16 452 $), s'indexant de 2,6 % en 2027 à 60 044 $ (MPB max. de 16 879 $). Les gains importants restent soumis à l'IMR réformé (20,5 %, exemption de 181 440 $ en 2026 et 186 157 $ en 2027, inclusion à 100 % des gains et crédit pour dons admis à 80 %). Côté habitation, l'ARC contrôle les feuillets T4FHSA (1 %/mois via RC727) et le cumul CELIAPP 40 000 $ + RAP 60 000 $ demeure en vigueur.",
    ahmedAnalysisEn:
      "My Take: Every year brings a mismatch between headline tax brackets and actual net exposure on big life events: selling a rental or private shares can trigger federal AMT even with the 50% regular inclusion rate, while opening two FHSAs across separate institutions still triggers CRA's 1%/month penalty. Use dedicated calculators to stress-test capital events and registered room before acting.",
    ahmedAnalysisFr:
      "Mon analyse : L'écart entre le taux marginal courant et l'impôt réel lors d'une grande transaction demeure sous-estimé : une vente d'immeuble ou d'actions peut déclencher l'IMR malgré le maintien de l'inclusion régulière à 50 %, et deux CELIAPP ouverts dans des banques distinctes s'additionnent sur le même NAS.",
    actionItemsEn: [
      "Run large 2026 capital gain or charitable giving scenarios through our Federal AMT Calculator ($181,440 2026 exemption) before closing.",
      "Confirm total FHSA contributions across all financial institutions in CRA My Account; file Form RC727 immediately if an over-contribution occurred.",
      "First-time home buyers: fund FHSA ($8,000/yr, $40k lifetime, never repaid) ahead of extra RRSP HBP ($60,000 limit, 90-day hold, 15-year repayment).",
    ],
    actionItemsFr: [
      "Simulez tout gain en capital ou don important de 2026 avec notre calculateur IMR fédéral (exemption de 181 440 $ en 2026).",
      "Additionnez toutes vos cotisations CELIAPP dans Mon dossier ARC et produisez le formulaire RC727 sans délai en cas d'excédent.",
      "Premiers acheteurs : priorisez le CELIAPP (sans remboursement) avant de compléter le RAP (60 000 $ à rembourser sur 15 ans).",
    ],
    relatedLink: {
      toEn: "/calculators/amt",
      toFr: "/fr/calculators/amt",
      labelEn: "Open 2026 Federal AMT Calculator",
      labelFr: "Ouvrir le calculateur IMR fédéral 2026",
    },
    officialSource: {
      label: "Canada Revenue Agency - Capital Gains & Personal Income Tax",
      url: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/personal-income/line-12700-capital-gains.html",
    },
  },
];

export const WhatChangedPage: React.FC = () => {
  const { isFr } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredChanges = RULE_CHANGES.filter((item) => {
    if (selectedCategory === "all") return true;
    return item.category === selectedCategory;
  });

  return (
    <section className="section bg-[#f7f3eb]">
      <SEO
        title={
          isFr
            ? "Règles financières 2026 au Canada | Ahmed Bello"
            : "2026 Money Rules & CRA Updates | Ahmed Bello"
        }
        description={
          isFr
            ? "Mises à jour nov. 2026 : Budget 2026, CELI 2027 à 7 500 $ et REER à 35 390 $, taux directeur à 2,50 %, taux prescrit à 3 % et BSIF B-20."
            : "Nov 2026 Canadian money rules: Federal Budget 2026, 2027 $7,500 TFSA & $35,390 RRSP limits, BoC 2.50% rate, CRA 3% rate, and OSFI B-20 rules."
        }
        canonicalUrl={isFr ? "/fr/what-changed" : "/what-changed"}
      />

      <div className="wrap max-w-5xl">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-[#625d52]">
          <ol className="flex items-center gap-2 list-none p-0">
            <li>
              <Link to={isFr ? "/fr" : "/"} className="hover:text-[#2e4a3b] transition-colors">
                {isFr ? "Accueil" : "Home"}
              </Link>
            </li>
            <li aria-hidden="true">&rsaquo;</li>
            <li className="text-[#1c1b18] font-medium">
              {isFr ? "Règles financières 2026" : "2026 Money Rules"}
            </li>
          </ol>
        </nav>

        {/* Page Hero */}
        <header className="pb-10 border-b border-[#d6cebd] space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#2e4a3b]">
            <Scale className="w-3.5 h-3.5 text-[#75581f]" />
            <span>
              {isFr ? "Revue Réglementaire & Fiscale Mensuelle" : "Monthly Advisor Regulatory Briefing"}
            </span>
          </div>

          <h1 className="h1 text-[#1c1b18]">
            {isFr
              ? "Ce qui a changé dans les règles financières au Canada"
              : "What Changed in Canadian Money Rules"}
          </h1>

          <p className="lede measure font-serif italic">
            {isFr
              ? "Chaque mois, la Banque du Canada, le ministère des Finances, le BSIF et l'ARC ajustent les taux d'intérêt, les règles hypothécaires et les plafonds fiscaux. Voici notre synthèse vérifiée de l'édition de novembre 2026 et des mesures concrètes à retenir."
              : "Every month, federal regulators, the Bank of Canada, Department of Finance, OSFI, and the CRA adjust interest rates, mortgage guidelines, and tax limits. Here is a verified November 2026 assessment of what changed, what remains proposed, and practical steps to check."}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-[#625d52]">
            <span className="flex items-center gap-1.5 font-medium text-[#1c1b18]">
              <ShieldCheck className="w-4 h-4 text-[#2e4a3b]" />
              {isFr ? "Vérifié par Ahmed Bello" : "Compiled & verified by Ahmed Bello"}
            </span>
            <span aria-hidden="true">&bull;</span>
            <span>{isFr ? "Mis à jour : 24 novembre 2026" : "Updated: November 24, 2026"}</span>
            <span aria-hidden="true">&bull;</span>
            <span>
              {isFr
                ? `${RULE_CHANGES.length} analyses réglementaires`
                : `${RULE_CHANGES.length} regulatory updates analyzed`}
            </span>
          </div>

          <p className="text-xs text-[#625d52] leading-relaxed pt-1">
            {isFr
              ? "Information éducative générale uniquement. Les mesures du Budget fédéral 2026 demeurent des propositions jusqu'à leur sanction royale. Confirmez vos chiffres exacts auprès d'un CPA ou d'un conseiller juridique."
              : "General educational summary only. Federal Budget 2026 measures remain proposals until enacted by Parliament. Confirm rules for your specific situation with a qualified tax or legal professional."}
          </p>
        </header>

        {/* Filter Toolbar */}
        <div className="py-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#d6cebd]/70">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "all", labelEn: "All Updates", labelFr: "Toutes les mises à jour" },
              { id: "rates", labelEn: "Rates & Bank of Canada", labelFr: "Taux & Banque du Canada" },
              { id: "mortgage", labelEn: "Mortgages & Housing", labelFr: "Hypothèques & Immobilier" },
              { id: "tax", labelEn: "Budget 2026 & CRA Rules", labelFr: "Budget 2026 & Règles ARC" },
              { id: "corporate", labelEn: "Corporate, AMT & Brackets", labelFr: "Sociétés, IMR & Paliers" },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setSelectedCategory(f.id)}
                className={`px-3 py-1.5 text-xs rounded-[2px] transition-colors border font-medium cursor-pointer ${
                  selectedCategory === f.id
                    ? "bg-[#2e4a3b] text-[#f7f3eb] border-[#2e4a3b]"
                    : "bg-[#ece6da]/60 text-[#4a463d] border-[#d6cebd] hover:border-[#2e4a3b] hover:text-[#1c1b18]"
                }`}
              >
                {isFr ? f.labelFr : f.labelEn}
              </button>
            ))}
          </div>

          <div className="text-xs text-[#625d52]">
            {filteredChanges.length}{" "}
            {isFr ? "mises à jour répertoriées" : "regulatory briefings displayed"}
          </div>
        </div>

        {/* Chronological Briefings List (Newest first) */}
        <div className="py-8 space-y-12">
          {filteredChanges.map((item) => (
            <article
              key={item.id}
              className="bg-[#f2ece1] border border-[#d6cebd] rounded-[2px] p-6 sm:p-8 space-y-6 shadow-xs relative"
            >
              {/* Card Meta & Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#d6cebd]/60 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#2e4a3b]">
                    <Calendar className="w-3.5 h-3.5" />
                    {item.month} {item.year}
                  </span>
                  <span aria-hidden="true" className="text-[#d6cebd]">&bull;</span>
                  <span className="text-xs text-[#75581f] font-medium uppercase tracking-wider">
                    {isFr ? item.categoryLabelFr : item.categoryLabelEn}
                  </span>
                </div>

                <a
                  href={item.officialSource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-[#625d52] hover:text-[#2e4a3b] transition-colors"
                >
                  <span>{item.officialSource.label}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Title & Official Summary */}
              <div>
                <h2 className="h2 text-[#1c1b18] mb-3">
                  {isFr ? item.titleFr : item.titleEn}
                </h2>
                <p className="text-sm sm:text-base text-[#4a463d] leading-relaxed">
                  {isFr ? item.summaryFr : item.summaryEn}
                </p>
              </div>

              {/* Ahmed's Direct Take Callout */}
              <div className="border-l-2 border-[#2e4a3b] bg-[#fcfaf5] pl-4 sm:pl-5 py-3 pr-4 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#2e4a3b]">
                  <Scale className="w-4 h-4 text-[#75581f]" />
                  <span>{isFr ? "L'analyse d'Ahmed Bello" : "Ahmed's Advisor Analysis"}</span>
                </div>
                <p className="text-xs sm:text-sm text-[#1c1b18] font-serif leading-relaxed">
                  {isFr ? item.ahmedAnalysisFr : item.ahmedAnalysisEn}
                </p>
              </div>

              {/* Action Checklist */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1c1b18] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2e4a3b]" />
                  <span>{isFr ? "Plan d'action concret" : "Practical Action Steps"}</span>
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-[#4a463d] list-none p-0">
                  {(isFr ? item.actionItemsFr : item.actionItemsEn).map((action, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="text-[#75581f] font-bold mt-0.5">&rsaquo;</span>
                      <span className="leading-relaxed">{action}</span>
                    </li>
                  ))}
                </ul>

                {item.relatedLink && (
                  <div className="pt-2">
                    <Link
                      to={isFr ? item.relatedLink.toFr : item.relatedLink.toEn}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#fcfaf5] hover:bg-[#2e4a3b] text-[#2e4a3b] hover:text-[#f7f3eb] border border-[#2e4a3b]/30 rounded-[2px] text-xs font-medium transition-colors"
                    >
                      <span>{isFr ? item.relatedLink.labelFr : item.relatedLink.labelEn}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* Bottom Practice Banner */}
        <section className="bg-[#14211a] text-[#f7f3eb] rounded-[2px] p-8 sm:p-10 border border-[#2e4a3b] space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#2e4a3b] border border-[#d6c298]/30 rounded-[2px] text-[11px] text-[#d6c298] font-medium tracking-wide">
            <ShieldCheck className="w-3.5 h-3.5 text-[#d6c298]" />
            <span>{isFr ? "Accompagnement Personnalisé" : "Personalized Financial Review"}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif text-[#f7f3eb] leading-snug">
            {isFr
              ? "Une de ces nouvelles règles a-t-elle un impact sur votre foyer ?"
              : "Did one of these regulatory changes impact your household or business?"}
          </h2>

          <p className="text-sm sm:text-base text-[#d6cebd] max-w-2xl leading-relaxed">
            {isFr
              ? "Que vous ayez une hypothèque à renouveler, des comptes enregistrés à optimiser ou une société à structurer, regardons vos chiffres clairement ensemble."
              : "Whether you have an upcoming mortgage renewal, registered accounts to balance, or a Canadian corporation to protect, let's walk through your exact numbers."}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-5">
            {siteConfig.schedulingUrl && (
              <a
                href={siteConfig.schedulingUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackBookingClick("what_changed_bottom")}
                className="btn bg-[#d6c298] hover:bg-[#c2ad82] text-[#14211a] font-medium text-xs sm:text-sm rounded-[2px] transition-colors inline-flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>{getCtaLabel(isFr)}</span>
              </a>
            )}
            <Link
              to={isFr ? "/fr/contact" : "/contact"}
              className="arrow-link text-sm text-[#d6c298] hover:text-white"
            >
              <span>{getSecondaryCtaLabel(isFr)}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </section>
  );
};
