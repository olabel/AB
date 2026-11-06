import React, { useState } from "react";
import { Link } from "react-router-dom";
import { SEO } from "../components/SEO.tsx";
import { useLanguage } from "../context/LanguageContext.tsx";
import { siteConfig } from "../config/site.ts";
import {
  Calendar,
  Sparkles,
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
  officialSource: {
    label: string;
    url: string;
  };
}

const RULE_CHANGES: RuleChangeItem[] = [
  {
    id: "nov-2026-boc-rate-cut",
    month: "November",
    year: 2026,
    category: "rates",
    categoryLabelEn: "Monetary Policy & Interest Rates",
    categoryLabelFr: "Politique monétaire & Taux d'intérêt",
    titleEn: "Bank of Canada Lowers Overnight Rate to 2.50%: Prime Rate Drops to 4.70%",
    titleFr: "La Banque du Canada abaisse le taux directeur à 2,50 % : le taux préférentiel passe à 4,70 %",
    summaryEn:
      "The Bank of Canada reduced its benchmark policy rate by another 25 basis points to 2.50%, bringing chartered bank prime lending rates down to 4.70%. This continues the easing cycle designed to support domestic household consumption and reduce debt servicing friction across variable-rate borrowing facilities.",
    summaryFr:
      "La Banque du Canada a réduit son taux directeur de 25 points de base pour le porter à 2,50 %, ramenant le taux préférentiel des banques à 4,70 %. Cet assouplissement vise à stimuler la consommation et alléger le fardeau des emprunteurs à taux variable.",
    ahmedAnalysisEn:
      "My Take: For Canadian families with variable-rate mortgages, your monthly interest cost continues to decline, freeing up cash flow. However, if you are sitting on substantial cash in traditional high-interest savings accounts (HISAs), your yield is rapidly shrinking from 5% down toward 2.5%. Now is the time to redeploy idle cash into structured tax-free compounding inside your TFSA or FHSA rather than letting inflation erode stagnant balances.",
    ahmedAnalysisFr:
      "Mon analyse : Pour les familles canadiennes détenant une hypothèque à taux variable, les frais d'intérêt continuent de baisser. En revanche, les rendements des comptes d'épargne à intérêt élevé (CELI) chutent de 5 % vers 2,5 %. C'est le moment idéal pour réallouer les liquidités excédentaires vers des véhicules fiscalement avantageux.",
    actionItemsEn: [
      "Review your current mortgage rate breakdown: calculate the spread between your current contract rate and 3-year or 5-year fixed offerings.",
      "Re-evaluate cash yields: check if your emergency fund is earning competitive yield or lagging behind current inflation.",
      "Coordinate pre-authorized contributions into tax-sheltered accounts before interest rates compress further.",
    ],
    actionItemsFr: [
      "Analysez votre taux hypothécaire actuel : comparez l'écart entre votre taux variable et les offres fixes sur 3 ou 5 ans.",
      "Réévaluez le rendement de vos liquidités : assurez-vous que votre fonds d'urgence ne stagne pas sous l'inflation.",
      "Automatisez vos cotisations vers vos comptes enregistrés (CELI, REER, CELIAPP) pour maximiser la capitalisation.",
    ],
    officialSource: {
      label: "Bank of Canada - Monetary Policy Decision",
      url: "https://www.bankofcanada.ca/core-functions/monetary-policy/key-interest-rate/",
    },
  },
  {
    id: "nov-2026-osfi-straight-switch",
    month: "November",
    year: 2026,
    category: "mortgage",
    categoryLabelEn: "Mortgage Lending & Regulation",
    categoryLabelFr: "Réglementation hypothécaire",
    titleEn: "OSFI Guideline B-20 Straight-Switch Enforcement: No Stress Test for Uninsured Renewals",
    titleFr: "Application de la ligne directrice B-20 du BSIF : fin du test de résistance pour les transferts sans assurance",
    summaryEn:
      "The Office of the Superintendent of Financial Institutions (OSFI) has officially removed the Minimum Qualifying Rate (MQR stress test) requirement for borrowers executing straight switches of uninsured residential mortgages between federally regulated financial institutions. Conventional borrowers with 20%+ equity can now switch lenders at term expiry without requalifying at contract rate + 2.00%.",
    summaryFr:
      "Le Bureau du surintendant des institutions financières (BSIF) a officiellement éliminé le test de résistance pour les transferts simples d'hypothèques résidentielles non assurées entre institutions sous réglementation fédérale. Les propriétaires avec 20 % ou plus d'équité peuvent changer de prêteur au renouvellement sans test de simulation de crise.",
    ahmedAnalysisEn:
      "My Take: This is the single biggest win for Canadian homeowners in five years. Previously, hundreds of thousands of borrowers were trapped with their existing bank because they couldn't pass the 7%+ stress test to move elsewhere, allowing incumbent banks to offer uncompetitive renewal rates. You now have full bargaining power. You can take a bona fide rate offer from a competing lender and demand your bank match it, or execute a straight switch with zero stress test friction.",
    ahmedAnalysisFr:
      "Mon analyse : C'est la plus grande victoire pour les propriétaires canadiens depuis cinq ans. Auparavant, des milliers d'emprunteurs étaient captifs de leur banque actuelle faute de pouvoir réussir le test à 7 %+. Vous avez désormais un réel pouvoir de négociation pour faire jouer la concurrence.",
    actionItemsEn: [
      "Check your title registration: verify whether your existing mortgage is registered as a Standard Charge or Collateral Charge.",
      "Lock in renewal quotes 120 days prior to term maturity; never accept the bank's initial mailer rate.",
      "Ensure you do not add cash-out equity or extend your remaining amortization, as either modification voids the stress test exemption.",
    ],
    actionItemsFr: [
      "Vérifiez l'enregistrement de votre titre : identifiez s'il s'agit d'une charge standard ou d'une charge subsidiaire (collaterale).",
      "Magasinez votre renouvellement 120 jours avant l'échéance; ne signez jamais la première offre postale de votre banque.",
      "Ne demandez aucun refinancement d'équité ni allongement de durée, car cela annulerait l'exemption du test.",
    ],
    officialSource: {
      label: "OSFI - Guideline B-20 Straight Switch Policy Announcement",
      url: "https://www.osfi-bsif.gc.ca/en/news/osfi-removes-underwriting-barriers-straight-switches-uninsured-mortgages",
    },
  },
  {
    id: "oct-2026-cra-prescribed-rate",
    month: "October",
    year: 2026,
    category: "tax",
    categoryLabelEn: "Tax Rules & Income Splitting",
    categoryLabelFr: "Fiscalité & Fractionnement du revenu",
    titleEn: "CRA Prescribed Interest Rate Drops to 4%: Spousal Loan Strategies Re-Open",
    titleFr: "Le taux prescrit de l'ARC descend à 4 % : renaissance des prêts prescrits entre conjoints",
    summaryEn:
      "The Canada Revenue Agency (CRA) quarterly prescribed interest rate under Section 4301 of the Income Tax Regulations decreased from 5% to 4%. This rate governs non-arm's length spousal loans, employee loans, and shareholder debt calculations.",
    summaryFr:
      "Le taux d'intérêt prescrit trimestriel de l'Agence du revenu du Canada (ARC) en vertu de l'article 4301 du Règlement de l'impôt sur le revenu est passé de 5 % à 4 %. Ce taux régit les prêts prescrits entre conjoints et les dettes d'actionnaires.",
    ahmedAnalysisEn:
      "My Take: When one spouse earns significantly more than the other (e.g., top 53% marginal bracket vs. 20% bracket), attribution rules under Section 74.1 usually prevent the higher earner from simply gifting investment funds. By establishing a formal Spousal Prescribed Rate Loan at 4%, the lower-earning spouse invests the capital, reports investment returns at their lower tax rate, and pays 4% annual interest back to the higher earner. This locks in income splitting for the lifetime of the loan, regardless of future rate increases.",
    ahmedAnalysisFr:
      "Mon analyse : Lorsqu'un conjoint gagne nettement plus que l'autre, les règles d'attribution empêchent le transfert direct de fonds à investir. Avec un prêt prescrit à 4 %, le conjoint à faible revenu investit le capital, déclare les gains à son taux marginal plus bas et verse 4 % d'intérêt annuel au prêteur. Cet avantage est verrouillé à vie.",
    actionItemsEn: [
      "Model household income divergence: assess whether the tax spread justifies a spousal loan structure.",
      "Draft a formal promissory note with an experienced tax lawyer specifying the 4% prescribed rate.",
      "Calendar the mandatory annual deadline: interest must be paid each year on or before January 30th to avoid triggering CRA attribution.",
    ],
    actionItemsFr: [
      "Calculez l'écart d'imposition du couple pour valider la rentabilité d'un prêt prescrit.",
      "Rédigez un billet à ordre conforme stipulant le taux prescrit de 4 %.",
      "Notez la date butoir stricte du 30 janvier de chaque année pour le versement des intérêts sous peine de pénalités de l'ARC.",
    ],
    officialSource: {
      label: "Canada Revenue Agency - Prescribed Interest Rates",
      url: "https://www.canada.ca/en/revenue-agency/services/tax/prescribed-interest-rates.html",
    },
  },
  {
    id: "sep-2026-bill-c69-capital-gains",
    month: "September",
    year: 2026,
    category: "corporate",
    categoryLabelEn: "Corporate & Wealth Architecture",
    categoryLabelFr: "Fiscalité corporative & Patrimoine",
    titleEn: "Bill C-69 Two-Tier Capital Gains Inclusion Rate in Full Effect: $250,000 Threshold",
    titleFr: "Entrée en vigueur complète du taux d'inclusion des gains en capital de la Loi C-69",
    summaryEn:
      "Following the formal enactment of Bill C-69 implementing Budget 2024 measures, Canada's capital gains inclusion rate is strictly two-tiered: 50% on annual individual net capital gains up to $250,000, and 66.67% on gains exceeding $250,000. All corporate dispositions and trust capital gains face 66.67% inclusion from dollar one.",
    summaryFr:
      "Suite à la promulgation de la Loi C-69, le taux d'inclusion des gains en capital au Canada est à deux paliers : 50 % sur les premiers 250 000 $ de gains nets annuels pour les particuliers, et 66,67 % sur l'excédent. Pour les sociétés (SPCC) et fiducies, le taux de 66,67 % s'applique dès le premier dollar.",
    ahmedAnalysisEn:
      "My Take: Incorporated business owners, medical professionals, and owners of appreciated secondary real estate (such as family cottages) are hit hardest. Because corporate investment portfolios don't get the $250,000 individual threshold, your corporate tax on realized gains jumps by roughly 33%. Furthermore, active corporations earning over $50,000 in passive investment income face the 5-for-1 Small Business Deduction grind under Section 125(5.1). We are working with clients to restructure corporate holdings into tax-sheltered corporate life insurance and Capital Dividend Account (CDA) strategies to legally bypass this trap.",
    ahmedAnalysisFr:
      "Mon analyse : Les entrepreneurs incorporés et les propriétaires de chalets familiaux sont les plus touchés. Les sociétés privées ne bénéficient pas du seuil individuel de 250 000 $. En outre, tout gain de placement passif dépassant 50 000 $ réduit votre déduction accordée aux petites entreprises de 5 $ par dollar. Une restructuration d'actifs corporatifs s'impose.",
    actionItemsEn: [
      "Review corporate retained earnings: calculate your corporation's Adjusted Aggregate Investment Income (AAII) on Schedule 7.",
      "Audit family cottage Adjusted Cost Base (ACB): collect historical receipts for capital additions and assess Form T2091 designations.",
      "Explore corporate-owned life insurance: cash value accumulates completely exempt from annual AAII passive income reporting under ITA Section 148.",
    ],
    actionItemsFr: [
      "Examinez les bénéfices non répartis de votre société : calculez le revenu de placement passif rajusté (RPPR) sur l'annexe 7 de la T2.",
      "Rassemblez les factures de rénovations majeures pour rehausser le prix de base rajusté (PBR) de votre chalet familial.",
      "Explorez l'assurance vie universelle ou avec participation détenue par la société : la croissance de la valeur de rachat est 100 % exonérée d'impôt passif.",
    ],
    officialSource: {
      label: "Department of Finance Canada - Capital Gains Inclusion Rate Measures",
      url: "https://www.canada.ca/en/department-finance/news/2024/06/capital-gains-inclusion-rate.html",
    },
  },
  {
    id: "aug-2026-fhsa-audit-rules",
    month: "August",
    year: 2026,
    category: "tax",
    categoryLabelEn: "Registered Accounts & Compliance",
    categoryLabelFr: "Comptes enregistrés & Conformité",
    titleEn: "CRA Form RC727 Enforcement on Multi-Institution FHSA Over-Contributions",
    titleFr: "Contrôles accrus de l'ARC : Formulaire RC727 et cotisations excédentaires au CELIAPP",
    summaryEn:
      "The Canada Revenue Agency has initiated automated cross-matching of FHSA records via T4FHSA reporting slips. The CRA is issuing formal assessments for excess contributions under Section 207.02 (1% per month penalty) and enforcing non-resident freezes under Section 128.1.",
    summaryFr:
      "L'ARC a intensifié ses vérifications automatisées des feuillets T4FHSA pour identifier les dépassements de plafonds de cotisation. Les contribuables ayant dépassé le plafond annuel de 8 000 $ ou devenus non-résidents reçoivent des avis de cotisation assortis de la pénalité de 1 % par mois.",
    ahmedAnalysisEn:
      "My Take: The most common mistake I see is clients opening FHSAs with two different institutions (e.g., an automated robo-advisor and a bank) and contributing $8,000 to each, mistakenly believing the limit is per institution. It is tied strictly to your Social Insurance Number. If you over-contribute, the 1% per month clock does not stop until you file Form RC727 for a designated removal or absorb it with unused RRSP room. If you left Canada to work abroad, remember: you cannot make qualifying tax-free home purchase withdrawals as a non-resident.",
    ahmedAnalysisFr:
      "Mon analyse : L'erreur la plus fréquente consiste à ouvrir des CELIAPP dans deux institutions différentes et à verser 8 000 $ dans chacune. Le plafond est lié à votre numéro d'assurance sociale (NAS). Pour stopper la pénalité de 1 % mensuelle, vous devez déposer le formulaire RC727 au plus vite.",
    actionItemsEn: [
      "Log into CRA My Account to verify your official 2026 FHSA and TFSA contribution room limits.",
      "If you accidentally over-contributed, file Form RC727 immediately to initiate a tax-free designated removal.",
      "If moving abroad for work, pause all contributions and review non-resident 25% Part XIII withholding implications before withdrawing.",
    ],
    actionItemsFr: [
      "Connectez-vous à Mon dossier de l'ARC pour vérifier vos plafonds officiels de cotisation au CELIAPP et au CELI.",
      "En cas de cotisation excédentaire, soumettez sans délai le formulaire RC727 pour retirer les fonds sans retenue d'impôt.",
      "Si vous vous installez à l'étranger, suspendez vos cotisations pour éviter la taxe de non-résident de 25 %.",
    ],
    officialSource: {
      label: "CRA - First Home Savings Account (FHSA) Rules & RC727",
      url: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/first-home-savings-account.html",
    },
  },
  {
    id: "jul-2026-rrsp-hbp-60k",
    month: "July",
    year: 2026,
    category: "mortgage",
    categoryLabelEn: "First-Time Home Buyers",
    categoryLabelFr: "Acheteurs d'une première maison",
    titleEn: "RRSP Home Buyers' Plan (HBP) $60,000 Withdrawal Cap & 5-Year Grace Period",
    titleFr: "Régime d'accession à la propriété (RAP) : retrait de 60 000 $ et grâce de 5 ans",
    summaryEn:
      "The enhanced $60,000 RRSP Home Buyers' Plan limit provides eligible first-time homebuyers with expanded access to their tax-sheltered savings. Combined with the 5-year grace period before mandatory 15-year repayments must begin, buyers have unprecedented flexibility to combine HBP with the FHSA.",
    summaryFr:
      "Le plafond bonifié de 60 000 $ du RAP permet aux premiers acheteurs d'accéder à une mise de fonds accrue depuis leur REER. Avec la période de grâce de 5 ans avant d'entamer le remboursement sur 15 ans, les acheteurs peuvent cumuler RAP et CELIAPP de façon stratégique.",
    ahmedAnalysisEn:
      "My Take: When you combine the $40,000 FHSA and $60,000 RRSP HBP, an individual buyer can deploy $100,000—and a purchasing couple can pool $200,000—toward their down payment. Remember the crucial distinction: the FHSA withdrawal is 100% tax-free and never needs to be repaid, whereas the HBP is an interest-free loan from your future self that must be repaid over 15 equal annual installments starting in Year 5.",
    ahmedAnalysisFr:
      "Mon analyse : En combinant 40 000 $ en CELIAPP et 60 000 $ en RAP, un acheteur peut mobiliser 100 000 $ (200 000 $ pour un couple) pour sa mise de fonds. Retenez la différence clé : le CELIAPP est un retrait libre d'impôt sans obligation de remboursement, alors que le RAP est un prêt à rembourser sur 15 ans.",
    actionItemsEn: [
      "Coordinate contribution timing: funds must remain in your RRSP for at least 89 days before qualifying HBP withdrawal.",
      "Max out your FHSA first before putting extra cash into RRSP for HBP, since FHSA withdrawals never have to be repaid.",
      "Set a calendar reminder for Year 5 to schedule annual 1/15th HBP repayments to prevent the CRA from adding the unpaid amount to taxable income.",
    ],
    actionItemsFr: [
      "Respectez la règle des 89 jours : vos fonds doivent séjourner au moins 90 jours dans le REER avant le retrait RAP.",
      "Maximisez le CELIAPP en priorité absolue, car il ne nécessite aucun remboursement futur.",
      "Prévoyez vos remboursements annuels du 1/15 dès la 5e année pour éviter que l'ARC n'ajoute la tranche non payée à votre revenu imposable.",
    ],
    officialSource: {
      label: "CRA - Home Buyers' Plan (HBP) Guidelines",
      url: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/rrsps-related-plans/what-home-buyers-plan.html",
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
    <div className="py-12 md:py-16 bg-[#f7f3eb]">
      <SEO
        title={
          isFr
            ? "Changements aux Règles Financières au Canada | Ahmed Bello"
            : "What Changed in Canadian Money Rules | Ahmed Bello"
        }
        description={
          isFr
            ? "Revue mensuelle rédigée par Ahmed Bello : décisions de la Banque du Canada, règles de transfert hypothécaire B-20 du BSIF, plafonds CELIAPP/REER et fiscalité."
            : "Monthly Canadian financial intelligence by licensed professional Ahmed Bello: Bank of Canada rate shifts, OSFI straight-switch rules, CRA tax ceilings, and mortgage guidelines."
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
              {isFr ? "Changements aux Règles Financières" : "What Changed in Money Rules"}
            </li>
          </ol>
        </nav>

        {/* Page Hero */}
        <header className="pb-10 border-b border-[#d6cebd] space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#2e4a3b]/10 text-[#2e4a3b] border border-[#2e4a3b]/25 rounded-[2px] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#75581f]" />
            <span>
              {isFr ? "Revue Réglementaire & Fiscale Mensuelle" : "Monthly Advisor Regulatory Briefing"}
            </span>
          </div>

          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#1c1b18] leading-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {isFr
              ? "Ce qui a changé dans les règles financières au Canada"
              : "What Changed in Canadian Money Rules"}
          </h1>

          <p className="text-base sm:text-lg text-[#4a463d] font-serif italic max-w-3xl leading-relaxed">
            {isFr
              ? "Chaque mois, les institutions canadiennes (Banque du Canada, BSIF, ARC, ministère des Finances) modifient les taux d'intérêt, les règles d'admissibilité hypothécaire et les seuils fiscaux. Voici mon décryptage professionnel de ce qui compte réellement pour votre patrimoine familial."
              : "Every month, Canadian federal regulators, the Bank of Canada, OSFI, and the CRA adjust interest rates, mortgage qualification rules, and tax thresholds. Here is my direct, plain-language assessment of what changed, why it matters, and the exact steps to take."}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-[#625d52]">
            <span className="flex items-center gap-1.5 font-medium text-[#1c1b18]">
              <ShieldCheck className="w-4 h-4 text-[#2e4a3b]" />
              {isFr ? "Analysé et vérifié par Ahmed Bello" : "Authored & verified by Ahmed Bello"}
            </span>
            <span aria-hidden="true">&bull;</span>
            <span>{isFr ? "Édition de novembre 2026" : "November 2026 Edition"}</span>
            <span aria-hidden="true">&bull;</span>
            <span>{isFr ? "6 mises à jour majeures analysées" : "6 major regulatory updates analyzed"}</span>
          </div>
        </header>

        {/* Filter Toolbar */}
        <div className="py-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#d6cebd]/70">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "all", labelEn: "All Updates", labelFr: "Toutes les mises à jour" },
              { id: "rates", labelEn: "Rates & Bank of Canada", labelFr: "Taux & Banque du Canada" },
              { id: "mortgage", labelEn: "Mortgages & Housing", labelFr: "Hypothèques & Immobilier" },
              { id: "tax", labelEn: "CRA & Tax Rules", labelFr: "ARC & Fiscalité" },
              { id: "corporate", labelEn: "Corporate & Wealth", labelFr: "Sociétés & Patrimoine" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedCategory(f.id)}
                className={`px-3 py-1.5 text-xs rounded-[2px] transition-colors border font-medium ${
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
              className="bg-[#f2ece1] border border-[#d6cebd] rounded-xs p-6 sm:p-8 space-y-6 shadow-xs relative"
            >
              {/* Card Meta & Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#d6cebd]/60 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#2e4a3b]/10 text-[#2e4a3b] font-mono text-[11px] font-semibold uppercase tracking-wider rounded-xs border border-[#2e4a3b]/20">
                    <Calendar className="w-3 h-3" />
                    {item.month} {item.year}
                  </span>
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
                <h2
                  className="text-2xl sm:text-3xl font-serif text-[#1c1b18] mb-3 leading-snug"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {isFr ? item.titleFr : item.titleEn}
                </h2>
                <p className="text-sm sm:text-base text-[#4a463d] leading-relaxed">
                  {isFr ? item.summaryFr : item.summaryEn}
                </p>
              </div>

              {/* Ahmed's Direct Take Callout */}
              <div className="bg-[#2e4a3b]/10 border-l-4 border-[#2e4a3b] p-4 sm:p-5 rounded-r-xs space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#2e4a3b]">
                  <Sparkles className="w-4 h-4 text-[#75581f]" />
                  <span>{isFr ? "L'analyse d'Ahmed Bello" : "Ahmed's Advisor Analysis"}</span>
                </div>
                <p className="text-xs sm:text-sm text-[#1c1b18] font-serif italic leading-relaxed">
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
                      <span className="text-[#75581f] font-mono font-bold mt-0.5">&rsaquo;</span>
                      <span className="leading-relaxed">{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom Practice Banner */}
        <section className="bg-[#14211a] text-[#f7f3eb] rounded-xs p-8 sm:p-10 border border-[#2e4a3b] space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#2e4a3b] border border-[#d6c298]/30 rounded-xs text-[11px] text-[#d6c298] font-medium tracking-wide">
            <ShieldCheck className="w-3.5 h-3.5 text-[#d6c298]" />
            <span>{isFr ? "Accompagnement Personnalisé" : "Personalized Financial Review"}</span>
          </div>

          <h2
            className="text-2xl sm:text-3xl font-serif text-[#f7f3eb] leading-snug"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {isFr
              ? "Une de ces nouvelles règles a-t-elle un impact sur votre foyer ?"
              : "Did one of these regulatory changes impact your household or business?"}
          </h2>

          <p className="text-sm sm:text-base text-[#d6cebd] max-w-2xl leading-relaxed">
            {isFr
              ? "Que vous ayez une hypothèque à renouveler, des comptes enregistrés à optimiser ou une société à structurer, discutons-en sans frais ni pression de vente."
              : "Whether you have an upcoming mortgage renewal, registered accounts to balance, or a Canadian corporation to protect, let's review your exact numbers with zero obligation."}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              to={isFr ? "/fr/contact" : "/contact"}
              className="inline-flex items-center gap-2 px-5 py-3 bg-[#d6c298] hover:bg-[#c2ad82] text-[#14211a] font-medium text-xs sm:text-sm rounded-xs transition-colors"
            >
              <span>{isFr ? "Poser une question à Ahmed" : "Send a Question to Ahmed"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {siteConfig.schedulingUrl && (
              <a
                href={siteConfig.schedulingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 bg-[#2e4a3b] hover:bg-[#385b48] text-[#f7f3eb] border border-[#d6c298]/40 font-medium text-xs sm:text-sm rounded-xs transition-colors"
              >
                <Calendar className="w-4 h-4 text-[#d6c298]" />
                <span>{isFr ? "Planifier un appel de 30 min" : "Schedule 30-Min Strategy Call"}</span>
              </a>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
