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
      badge: isFr ? "Scénario : Hausse de 680 $/mois à l'échéance" : "Scenario: $680/mo Payment Spike at Maturity",
      problemTitle: isFr
        ? "L'erreur classique en vase clos : Vider son CELI pour rembourser du capital"
        : "The Silo Mistake: Raiding the TFSA to Pay Down Principal",
      problemDesc: isFr
        ? "Face à un bond des mensualités de 4,7 % au renouvellement, beaucoup liquident un CELI investi à 7 % pour éteindre une dette hypothécaire. Ils détruisent ainsi l'effet cumulé des intérêts composés libres d'impôt et sacrifient leur liquidité d'urgence."
        : "Faced with renewal payment shocks, borrowers reflexively liquidate equity-growth TFSAs to make lump-sum payments. This permanently impairs compounding tax-free growth and leaves the household illiquid if an emergency strikes.",
      solutionTitle: isFr
        ? "L'approche intégrée : Transfert sans stress test & arbitrage de trésorerie"
        : "The Integrated Architecture: Straight Switch & Cash Flow Restructuring",
      solutionDesc: isFr
        ? "Grâce à la réforme BSIF B-20 (novembre 2024), nous transférons l'hypothèque sans requalification au stress test vers un prêteur plus compétitif. Nous consolidons les dettes non déductibles et préservons l'actif CELI, tout en réallouant le surplus vers le CELIAPP ou REER pour générer un retour fiscal compensatoire."
        : "Leveraging OSFI Guideline B-20 straight-switch rules, we move the mortgage to a competitive lender without stress test requalification. We eliminate non-deductible revolving debt and protect compounding TFSA assets, redirecting refund dollars from RRSP/FHSA contributions to offset the net payment delta.",
      impactMetric: isFr ? "+64 200 $ de patrimoine préservé sur 10 ans" : "+$64,200 10-Yr Net Wealth Preserved",
      affectedPillars: [1, 2], // 0-indexed: 1 = Debt/Mortgage, 2 = Tax Shelters
    },
    corporate_aaii: {
      id: "corporate_aaii" as const,
      tabTitle: isFr ? "2. Piège des 50k$ de Placements SPCC" : "2. Corporate $50k Passive Trap",
      badge: isFr ? "Scénario : 70 000 $ de revenus passifs dans la société" : "Scenario: $70,000 AAII in Corporate Holdings",
      problemTitle: isFr
        ? "L'erreur classique en vase clos : Conserver des liquidités passives imposées à 50,17 %"
        : "The Silo Mistake: Stashing Excess Retained Earnings in Corporate GICs",
      problemDesc: isFr
        ? "Selon l'article 125(5.1) de la Loi de l'impôt sur le revenu (LIR), chaque dollar de revenu passif au-delà de 50 000 $ réduit la Déduction pour petite entreprise (DPE) de 5 $. Avec 70 000 $ de passif, la société perd 100 000 $ d'admissibilité au taux PME de 9 % et paie 26,5 % d'impôt d'emblée."
        : "Under ITA Section 125(5.1), every $1 of corporate passive investment income above $50,000 claws back $5 of the Small Business Deduction. At $70,000 of passive income, $100,000 of active business profits are pushed from the 9% SBD rate to the 26.5% general corporate rate.",
      solutionTitle: isFr
        ? "L'approche intégrée : Extraction CDC, purge fiscale et structure abritée"
        : "The Integrated Architecture: CDA Extraction & Tax-Exempt Corporate Holding",
      solutionDesc: isFr
        ? "Nous calculons le solde du Compte de dividendes en capital (CDC) pour distribuer des liquidités libres d'impôt à l'actionnaire, maximisons les CELI et REER personnels, et redéployons la trésorerie excédentaire vers des actifs exempts d'impôt corporatif ou un RRI (Régime de retraite individuel) pour rétablir la DPE intégrale."
        : "We audit the corporate Capital Dividend Account (CDA) to extract tax-free dividends to the shareholder, fully top up personal TFSAs/RRSPs, and transition surplus treasury into tax-sheltered corporate vehicles or an IPP (Individual Pension Plan), restoring the full 9% small business limit.",
      impactMetric: isFr ? "17 500 $/an d'impôt corporatif récupéré" : "$17,500/yr Active Corporate Tax Saved",
      affectedPillars: [2, 3], // 2 = Tax Shelters, 3 = Corporate Treasury
    },
    income_disruption: {
      id: "income_disruption" as const,
      tabTitle: isFr ? "3. Choc Médical ou Invalidité Imprévue" : "3. Unexpected Medical/Disability Event",
      badge: isFr ? "Scénario : 6 mois d'arrêt d'activité professionnelle" : "Scenario: 6-Month Absence from Professional Practice",
      problemTitle: isFr
        ? "L'erreur classique en vase clos : Liquidations de détresse d'actifs REER/CELI"
        : "The Silo Mistake: Distress Liquidation of RRSP & Real Estate Assets",
      problemDesc: isFr
        ? "Sans couverture invalidité non annulable de profession habituelle, un arrêt de travail force le ménage à décaisser des REER avec retenue d'impôt immédiate pouvant atteindre 53,5 %, tout en manquant des paiements hypothécaires et en ruinant le score de crédit."
        : "Without non-cancellable 'own-occupation' income protection, an illness or injury forces clinicians or entrepreneurs to liquidate registered accounts at peak tax brackets (up to 53.53%), defaulting on credit facilities and permanently damaging their balance sheet.",
      solutionTitle: isFr
        ? "L'approche intégrée : Bouclier non imposable & maintien du plan de retraite"
        : "The Integrated Architecture: Non-Taxable Benefit Buffer & Unbroken Compounding",
      solutionDesc: isFr
        ? "La prestation mensuelle d'invalidité non imposable couvre l'intégralité du service de la dette (hypothèque et marges) et des dépenses courantes. La réserve d'urgence de 6 mois absorbe les délais, et les portefeuilles de placement poursuivent leur croissance sans aucune vente forcée."
        : "Tax-free monthly disability benefits fully service mortgage, debts, and lifestyle overhead. A 6-month liquid cash buffer bridges waiting periods, ensuring registered retirement and corporate investment accounts continue compounding with zero forced sales.",
      impactMetric: isFr ? "100 % du capital de retraite préservé" : "100% Retirement Assets Insulated",
      affectedPillars: [0, 1], // 0 = Defense, 1 = Debt/Mortgage
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
        ? ["Réserve d'urgence 3 à 6 mois liquide", "Invalidité profession habituelle non annulable", "Assurance vie temporaire & permanente stratégique"]
        : ["3–6 month liquid cash buffer", "Own-occupation disability protection", "Strategic term & permanent life liquidity"],
      link: `${prefix}/about`,
    },
    {
      idx: 1,
      icon: Home,
      tag: isFr ? "PILIER 02" : "PILLAR 02",
      title: isFr ? "Architecture Hypothécaire & Dette" : "Debt & Mortgage Architecture",
      subtitle: isFr ? "Optimisation du coût du passif" : "Liability Cost Optimization",
      items: isFr
        ? ["Transferts simples sans stress test (BSIF B-20)", "Arbitrage fixe vs variable & amortissement", "Élimination des dettes tournantes non déductibles"]
        : ["Straight switches without stress test (OSFI B-20)", "Fixed vs variable spread & amortization discipline", "Eliminating high-interest consumer debt drag"],
      link: `${prefix}/calculators`,
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
    },
    {
      idx: 3,
      icon: Building2,
      tag: isFr ? "PILIER 04" : "PILLAR 04",
      title: isFr ? "Trésorerie SPCC & Succession" : "Corporate & Estate Treasury",
      subtitle: isFr ? "Préservation du capital intergénérationnel" : "Retained Earnings & Succession",
      items: isFr
        ? ["Protection du plafond de 50 000 $ de DPE (art. 125(5.1))", "Extraction libre d'impôt par Compte de dividendes en capital (CDC)", "Prêts au taux prescrit aux conjoints (art. 74.5(2))"]
        : ["Safeguarding the $50k SBD passive cap (ITA 125(5.1))", "Tax-free extraction via Capital Dividend Account (CDA)", "Prescribed rate spousal loans under ITA 74.5(2)"],
      link: `${prefix}/for/business-owners`,
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
            <span>{isFr ? "Vision globale sans conflits d'intérêts" : "Holistic Balance Sheet Integration"}</span>
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
                      className={`w-7 h-7 rounded-full flex items-center justify-center ${
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
                  ? "Choisissez un événement financier pour voir comment une réaction en silo détruit de la valeur vs. une réponse architecturée :"
                  : "Select a Canadian financial milestone to observe how a silo reaction destroys value vs. an integrated solution:"}
              </p>
            </div>

            <div className="inline-flex p-1 bg-[#1c2e24] border border-[#2e4a3b] rounded-[2px]">
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
              <div className="flex items-center justify-between gap-3">
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
        </div>
      </div>
    </section>
  );
};
