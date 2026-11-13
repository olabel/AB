import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.tsx";
import {
  Shield,
  Home,
  TrendingUp,
  Building2,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Layers,
  Scale,
  Info,
} from "lucide-react";

type ScenarioId = "mortgage_shock" | "corporate_aaii" | "income_disruption";

export const HowThePiecesFit: React.FC = () => {
  const { isFr } = useLanguage();
  const prefix = isFr ? "/fr" : "";
  const [activeScenario, setActiveScenario] = useState<ScenarioId>("mortgage_shock");

  const scenarios = {
    mortgage_shock: {
      id: "mortgage_shock" as const,
      tabTitle: isFr ? "1. Choc de Renouvellement Hypothécaire" : "1. Mortgage Renewal Shock",
      badge: isFr ? "Scénario : Hausse de mensualité à l'échéance" : "Scenario: Payment Spike at Maturity",
      problemTitle: isFr
        ? "L'erreur classique en vase clos : Vider son CELI pour rembourser du capital"
        : "The Silo Mistake: Raiding the TFSA to Pay Down Principal",
      problemDesc: isFr
        ? "Face à une hausse des taux au renouvellement, des emprunteurs liquident précipitamment un CELI investi pour effectuer un remboursement anticipé. Ils sacrifient ainsi la croissance composée à l'abri de l'impôt et compromettent leur réserve de liquidités en cas de coup dur."
        : "Faced with renewal payment increases, borrowers reflexively liquidate equity-growth TFSAs to make lump-sum payments. This permanently impairs compounding tax-free growth and leaves the household illiquid if an emergency strikes.",
      solutionTitle: isFr
        ? "L'approche coordonnée : Évaluation de transfert & réalignement de trésorerie"
        : "The Coordinated Approach: Switch Evaluation & Cash Flow Realignment",
      solutionDesc: isFr
        ? "En coordination avec votre courtier hypothécaire agréé, nous évaluons les options de transfert sans requalification au stress test (BSIF B-20). Nous modélisons l'impact global sur votre budget, structurons le remboursement des dettes non déductibles et préservons votre CELI, en réinvestissant les retours d'impôt REER/CELIAPP."
        : "In coordination with your licensed mortgage broker, we evaluate straight-switch options without stress test requalification under OSFI Guideline B-20. We model overall balance-sheet cash flow, eliminate high-interest liabilities, and protect compounding TFSA assets, coordinating tax refunds to absorb payment changes.",
      impactMetric: isFr ? "Exemple illustratif : ~64 200 $ (hypothèse 10 ans)" : "Hypothetical illustration: ~$64,200 (10-yr assumption)",
      assumptions: isFr
        ? "Hypothèse purement illustrative : basée sur un prêt de 500 000 $, un écart de taux de 3,5 % vs 4,8 % et un rendement composé CELI de 7 % sur 10 ans. Les résultats réels dépendent des conditions du prêteur et de la performance des marchés."
        : "Hypothetical illustration only: assumes $500,000 mortgage, 3.5% vs 4.8% rate spread, and 7% TFSA compound return over 10 years. Actual results depend on lender approval, prevailing rates, and market performance.",
      affectedPillars: [1, 2],
    },
    corporate_aaii: {
      id: "corporate_aaii" as const,
      tabTitle: isFr ? "2. Piège des 50k$ de Placements SPCC" : "2. Corporate $50k Passive Trap",
      badge: isFr ? "Scénario : 70 000 $ de revenus passifs dans la société" : "Scenario: $70,000 AAII in Corporate Holdings",
      problemTitle: isFr
        ? "L'erreur classique en vase clos : Accumuler des liquidités passives imposées à taux fort"
        : "The Silo Mistake: Stashing Excess Retained Earnings in Corporate GICs",
      problemDesc: isFr
        ? "Selon l'article 125(5.1) de la LIR, chaque dollar de revenu passif au-delà de 50 000 $ réduit la Déduction pour petite entreprise (DPE) de 5 $. Avec 70 000 $ de passif, la société perd 100 000 $ d'accès au taux PME de 9 % et voit cette tranche imposée au taux général de 26,5 %."
        : "Under ITA Section 125(5.1), every $1 of corporate passive investment income above $50,000 claws back $5 of the Small Business Deduction. At $70,000 of passive income, $100,000 of active business profits are pushed from the 9% SBD rate to the 26.5% general corporate rate.",
      solutionTitle: isFr
        ? "L'approche coordonnée : Collaboration CPA, optimisation CDC & abri corporatif"
        : "The Coordinated Approach: CPA Collaboration, CDA Extraction & Corporate Protection",
      solutionDesc: isFr
        ? "De concert avec votre expert-comptable (CPA) qui prépare vos déclarations fiscales et élections de dividendes en capital (CDC), nous modélisons les surplus de trésorerie pour maximiser vos régimes enregistrés personnels et évaluer des solutions de protection et d'assurance exonérées adaptées aux sociétés."
        : "Working alongside your independent corporate CPA who prepares corporate tax filings and CDA dividend elections, we model surplus treasury flows, coordinate personal TFSA/RRSP maximization, and evaluate corporately held tax-exempt wealth protection solutions.",
      impactMetric: isFr ? "Exemple illustratif : jusqu'à 17 500 $/an d'écart DPE" : "Hypothetical illustration: up to $17,500/yr SBD spread",
      assumptions: isFr
        ? "Hypothèse purement illustrative : illustre l'écart d'impôt de 17,5 % entre le taux général de 26,5 % et le taux PME de 9 % sur 100 000 $ de bénéfice actif requalifié selon l'art. 125(5.1). Les taux effectifs varient selon la province."
        : "Hypothetical illustration only: reflects the 17.5% spread between 26.5% general and 9% small business corporate rates on $100k active income clawed back under Section 125(5.1). Exact provincial rates vary.",
      affectedPillars: [2, 3],
    },
    income_disruption: {
      id: "income_disruption" as const,
      tabTitle: isFr ? "3. Choc Médical ou Invalidité Imprévue" : "3. Unexpected Medical/Disability Event",
      badge: isFr ? "Scénario : 6 mois d'arrêt d'activité professionnelle" : "Scenario: 6-Month Absence from Professional Practice",
      problemTitle: isFr
        ? "L'erreur classique en vase clos : Liquidations de détresse d'actifs REER/CELI"
        : "The Silo Mistake: Distress Liquidation of RRSP & Real Estate Assets",
      problemDesc: isFr
        ? "Sans couverture invalidité adaptée, un arrêt de travail imprévu contraint le foyer à décaisser des REER avec retenue fiscale immédiate et imposition au taux marginal le plus élevé, tout en risquant des défauts de paiement de dettes."
        : "Without adequate income protection, an illness or injury forces clinicians or entrepreneurs to liquidate registered accounts at peak tax brackets (up to 53.53%), defaulting on credit facilities and permanently damaging their balance sheet.",
      solutionTitle: isFr
        ? "L'approche coordonnée : Bouclier non imposable & maintien du plan de retraite"
        : "The Coordinated Approach: Non-Taxable Benefit Buffer & Unbroken Compounding",
      solutionDesc: isFr
        ? "La prestation mensuelle d'assurance invalidité non imposable prend en charge le service de la dette et les charges courantes. La réserve d'urgence absorbe les délais de carence, et vos portefeuilles de placement poursuivent leur croissance sans aucune vente forcée."
        : "Tax-free monthly disability benefits service mortgage, debts, and lifestyle overhead. A liquid cash buffer bridges waiting periods, ensuring registered retirement and corporate investment accounts continue compounding with zero forced sales.",
      impactMetric: isFr ? "Exemple illustratif : Continuité intégrale du capital" : "Hypothetical illustration: Protected Capital Base",
      assumptions: isFr
        ? "Hypothèse purement illustrative : suppose le remplacement de 65 % du revenu brut par une prestation non imposable et un fonds d'urgence de 6 mois. Sous réserve des conditions de souscription de l'assureur."
        : "Hypothetical illustration only: assumes 65% gross income replacement via tax-free disability benefit and a 6-month liquid cash buffer. Subject to carrier underwriting approval and contract terms.",
      affectedPillars: [0, 1],
    },
  };

  const current = scenarios[activeScenario];

  const pillars = [
    {
      idx: 0,
      icon: Shield,
      tag: isFr ? "PILIER 01" : "PILLAR 01",
      title: isFr ? "Bouclier de Trésorerie & Revenu" : "Cash Flow & Income Shield",
      subtitle: isFr ? "Défense du bilan familial" : "Household Balance Sheet Defense",
      items: isFr
        ? ["Réserve d'urgence 3 à 6 mois liquide", "Protection du revenu en cas d'invalidité", "Assurance vie temporaire & permanente stratégique"]
        : ["3–6 month liquid cash buffer", "Own-occupation disability protection", "Strategic term & permanent life liquidity"],
      link: `${prefix}/about`,
      note: isFr ? "Solutions d'assurance vie et santé souscrites auprès d'assureurs agréés au Canada." : "Life and health insurance solutions underwritten by authorized Canadian carriers.",
    },
    {
      idx: 1,
      icon: Home,
      tag: isFr ? "PILIER 02" : "PILLAR 02",
      title: isFr ? "Architecture Hypothécaire & Dette" : "Debt & Mortgage Architecture",
      subtitle: isFr ? "Optimisation du coût du passif" : "Liability Cost Optimization",
      items: isFr
        ? ["Évaluation de transferts simples (BSIF B-20)", "Arbitrage fixe vs variable & amortissement", "Élimination des dettes tournantes à taux élevé"]
        : ["Straight-switch evaluation under OSFI B-20", "Fixed vs variable spread & amortization discipline", "Eliminating high-interest consumer debt drag"],
      link: `${prefix}/calculators`,
      note: isFr ? "Prêts et hypothèques arrangés par l'entremise de courtiers ou prêteurs hypothécaires agréés." : "Mortgage lending arranged through licensed third-party mortgage brokers/lenders.",
    },
    {
      idx: 2,
      icon: TrendingUp,
      tag: isFr ? "PILIER 03" : "PILLAR 03",
      title: isFr ? "Hiérarchie des Régimes Fiscaux" : "Tax-Sheltered Wealth Sequencing",
      subtitle: isFr ? "Ordre optimal de cotisation" : "Optimal Capital Allocation Order",
      items: isFr
        ? ["CELIAPP prioritaire (40 000 $ déductibles & exonérés)", "REER avec réinvestissement systématique du retour", "CELI pour croissance perpétuelle libre d'impôt"]
        : ["FHSA first-dollar priority ($40k tax-deductible/free)", "RRSP tax arbitrage with refund reinvestment", "TFSA perpetual tax-free compound compounding"],
      link: `${prefix}/calculators`,
      note: isFr ? "Modélisation éducative de l'ordre d'allocation des régimes fiscaux canadiens." : "Educational modeling of Canadian registered account sequencing and tax brackets.",
    },
    {
      idx: 3,
      icon: Building2,
      tag: isFr ? "PILIER 04" : "PILLAR 04",
      title: isFr ? "Trésorerie SPCC & Succession" : "Corporate & Estate Treasury",
      subtitle: isFr ? "Préservation du capital intergénérationnel" : "Retained Earnings & Succession",
      items: isFr
        ? ["Protection du plafond de 50 000 $ de DPE (art. 125(5.1))", "Coordination CDC avec votre expert-comptable (CPA)", "Prêts au taux prescrit aux conjoints (art. 74.5(2))"]
        : ["Safeguarding the $50k SBD passive cap (ITA 125(5.1))", "CDA coordination with your corporate CPA", "Prescribed rate spousal loans under ITA 74.5(2)"],
      link: `${prefix}/for/business-owners`,
      note: isFr ? "Déclarations fiscales et avis juridiques fournis par votre CPA et fiscaliste indépendant." : "Tax return filings and legal restructuring are provided by your independent CPA and legal counsel.",
    },
  ];

  return (
    <section className="section py-16 border-b border-[#d6cebd] bg-[#f7f3eb]">
      <div className="wrap max-w-6xl space-y-10">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#d6cebd] pb-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#2e4a3b]/10 text-[#2e4a3b] border border-[#2e4a3b]/25 rounded-[2px] text-[11px] font-semibold uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5" />
              <span>{isFr ? "Méthodologie Systémique" : "Systemic Architecture"}</span>
            </div>
            <h2 className="display text-[#1c1b18] text-2xl sm:text-3xl md:text-4xl">
              {isFr ? "Comment les pièces s'articulent" : "How the pieces fit together"}
            </h2>
            <p className="text-sm sm:text-base text-[#46423a] leading-relaxed">
              {isFr
                ? "Vos finances ne sont pas une série de produits isolés (une hypothèque ici, un REER là, une assurance ailleurs). C'est un système interdépendant où une décision prise sur un compte affecte immédiatement l'impôt, la liquidité et la vulnérabilité de l'ensemble."
                : "Your financial life is not a collection of isolated products (a mortgage here, an RRSP there, an insurance policy elsewhere). It is an interdependent balance sheet where a shift in one account immediately alters your taxes, borrowing capacity, and risk."}
            </p>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs text-[#75581f] font-mono font-semibold bg-[#ece6da]/50 px-3 py-2 border border-[#d6cebd] rounded-[2px]">
            <Scale className="w-4 h-4 text-[#75581f]" />
            <span>{isFr ? "Architecture patrimoniale intégrée" : "Integrated Wealth Architecture"}</span>
          </div>
        </div>

        {/* 4 Interactive Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {pillars.map((p) => {
            const Icon = p.icon;
            const isHighlighted = current.affectedPillars.includes(p.idx);

            return (
              <div
                key={p.idx}
                className={`p-5 rounded-[2px] border transition-all flex flex-col justify-between ${
                  isHighlighted
                    ? "bg-[#fcfaf5] border-[#2e4a3b] shadow-sm ring-1 ring-[#2e4a3b]/30"
                    : "bg-[#fcfaf5]/70 border-[#d6cebd] opacity-85 hover:opacity-100 hover:border-[#75581f]"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold tracking-widest text-[#75581f]">
                      {p.tag}
                    </span>
                    <div
                      className={`w-7 h-7 rounded-[2px] flex items-center justify-center ${
                        isHighlighted ? "bg-[#2e4a3b] text-white" : "bg-[#ece6da] text-[#46423a]"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-serif text-base sm:text-lg text-[#1c1b18] font-bold leading-tight">
                      {p.title}
                    </h3>
                    <p className="text-[11px] text-[#75581f] font-medium mt-0.5">{p.subtitle}</p>
                  </div>

                  <ul className="space-y-2 pt-2 border-t border-[#d6cebd]/60">
                    {p.items.map((it, i) => (
                      <li key={i} className="text-xs text-[#46423a] flex items-start gap-1.5 leading-snug">
                        <span className="text-[#2e4a3b] font-bold mt-0.5">•</span>
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>

                  <p className="text-[10px] text-[#75581f] pt-1 border-t border-[#d6cebd]/40 leading-tight">
                    {p.note}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-[#d6cebd]/50">
                  <Link
                    to={p.link}
                    className="text-[11px] font-semibold text-[#2e4a3b] hover:text-[#1c1b18] inline-flex items-center gap-1 group"
                  >
                    <span>{isFr ? "Approfondir" : "Explore pillar"}</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Stress-Test Simulation Box */}
        <div className="bg-[#14211a] text-[#f7f3eb] border border-[#2e4a3b] rounded-[2px] p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2e4a3b] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-[#d6c298]" />
                <span className="text-xs font-mono uppercase tracking-wider text-[#d6c298] font-semibold">
                  {isFr ? "Simulateur de choc systémique" : "Live Interdependence Test"}
                </span>
              </div>
              <p className="text-xs text-[#ece6da]/70 mt-1">
                {isFr
                  ? "Choisissez un événement financier pour voir comment une réaction en silo détruit de la valeur vs. une réponse coordonnée :"
                  : "Select a Canadian financial milestone to observe how a silo reaction destroys value vs. an integrated solution:"}
              </p>
            </div>

            <div className="flex flex-wrap sm:inline-flex gap-1 p-1 bg-[#1c2e24] border border-[#2e4a3b] rounded-[2px]">
              {(["mortgage_shock", "corporate_aaii", "income_disruption"] as ScenarioId[]).map((scId) => (
                <button
                  key={scId}
                  onClick={() => setActiveScenario(scId)}
                  className={`text-[11px] px-3 py-1.5 rounded-[1px] font-medium transition-all ${
                    activeScenario === scId
                      ? "bg-[#d6c298] text-[#14211a] font-bold shadow-xs"
                      : "text-[#ece6da]/80 hover:text-white"
                  }`}
                >
                  {scId === "mortgage_shock" && (isFr ? "1. Hypothèque" : "1. Mortgage")}
                  {scId === "corporate_aaii" && (isFr ? "2. SPCC Passif" : "2. Corporate $50k")}
                  {scId === "income_disruption" && (isFr ? "3. Invalidité" : "3. Disability")}
                </button>
              ))}
            </div>
          </div>

          {/* Scenario Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: The Costly Trap (Silo) */}
            <div className="lg:col-span-5 bg-[#251515]/60 border border-red-900/40 p-5 rounded-[2px] space-y-3">
              <div className="flex items-center gap-2 text-red-300">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                <h4 className="font-serif text-sm font-semibold tracking-wide">
                  {current.problemTitle}
                </h4>
              </div>
              <p className="text-xs text-red-100/80 leading-relaxed">
                {current.problemDesc}
              </p>
              <div className="pt-2 text-[11px] font-mono text-red-300/80 border-t border-red-900/30">
                {isFr ? "Conséquence : Perte de rendement & liquidité restreinte" : "Result: Compromised compounding & emergency illiquidity"}
              </div>
            </div>

            {/* Right: The Integrated Solution (Systemic) */}
            <div className="lg:col-span-7 bg-[#2e4a3b]/40 border border-[#d6c298]/30 p-5 rounded-[2px] space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-[#d6c298]">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-[#d6c298]" />
                  <h4 className="font-serif text-sm font-semibold tracking-wide">
                    {current.solutionTitle}
                  </h4>
                </div>
                <span className="text-[10px] font-mono bg-[#d6c298] text-[#14211a] font-bold px-2 py-0.5 rounded-[1px] shrink-0">
                  {current.impactMetric}
                </span>
              </div>
              <p className="text-xs text-[#ece6da]/90 leading-relaxed">
                {current.solutionDesc}
              </p>
              <div className="p-2.5 bg-[#14211a]/80 border border-[#d6c298]/20 rounded-[2px] text-[10px] text-[#ece6da]/70 flex items-start gap-1.5 leading-snug">
                <Info className="w-3.5 h-3.5 text-[#d6c298] shrink-0 mt-0.5" />
                <span>{current.assumptions}</span>
              </div>
              <div className="pt-2 flex items-center justify-between text-[11px] border-t border-[#2e4a3b]">
                <span className="text-[#d6c298]/80 font-mono">
                  {isFr ? "Piliers mobilisés de concert" : "Synchronized Pillars"}
                </span>
                <Link
                  to={`${prefix}/calculators`}
                  className="text-xs font-semibold text-[#d6c298] hover:text-white inline-flex items-center gap-1"
                >
                  <span>{isFr ? "Tester avec vos chiffres →" : "Model your numbers →"}</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Compliance & Compensation Statement */}
          <div className="pt-3 border-t border-[#2e4a3b]/60 text-[10px] text-[#ece6da]/60 space-y-1">
            <p>
              {isFr
                ? "Divulgation de rémunération : Ahmed Bello est un représentant en solutions financières indépendant sous contrat avec World Financial Group Insurance Agency of Canada Inc. (WFGIA). La mise en place de régimes de protection et de produits financiers agréés procure une rémunération à commission versée par les institutions financières partenaires. Aucun frais de dossier caché."
                : "Compensation Disclosure: Ahmed Bello is an independent financial solutions representative contracted with World Financial Group Insurance Agency of Canada Inc. (WFGIA). Product placement and financial solutions may provide carrier commission compensation from participating Canadian financial and insurance institutions. No hidden consultation fees."}
            </p>
            <p>
              {isFr
                ? "Avis de portée professionnelle : Les calculs et analyses présentés sont fournis à titre strictement éducatif et ne constituent pas des conseils juridiques, comptables ou fiscaux. Les déclarations fiscales d'entreprise et élections de dividendes sont préparées par votre expert-comptable (CPA). Les prêts et hypothèques sont souscrits par l'entremise de prêteurs et courtiers hypothécaires agréés."
                : "Professional Scope Notice: All figures and analyses are provided for educational modeling only and do not constitute legal, accounting, or tax advice. Corporate tax returns and dividend elections are prepared by your independent CPA. Lending and mortgages are arranged through licensed mortgage brokers or institutional lenders."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
