import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.tsx";
import { Shield, Layers, Compass, AlertTriangle, CheckCircle } from "lucide-react";

interface StructureTier {
  id: string;
  number: string;
  title: string;
  category: string;
  purpose: string;
  components: string[];
  vulnerabilityWithout: string;
  intentionalDesign: string;
}

interface StressScenario {
  id: string;
  name: string;
  description: string;
  unstructuredOutcome: string;
  structuredOutcome: string;
}

const TIERS_EN: StructureTier[] = [
  {
    id: "foundation",
    number: "01",
    title: "Cash Flow & Emergency Reserves",
    category: "Liquidity Foundation",
    purpose: "Maintain day-to-day cash stability without falling back on high-interest credit lines.",
    components: [
      "3–6 months of essential living expenses in liquid, principal-stable accounts",
      "Clear monthly cash-flow separation between fixed obligations and discretionary spending",
      "Dedicated savings reserve for irregular annual costs (property taxes, car repairs, home upkeep)",
    ],
    vulnerabilityWithout:
      "A sudden household bill (roof repair, car trouble) immediately goes onto a 19.99% credit card, disrupting monthly savings for months.",
    intentionalDesign:
      "Dedicated cash buffers absorb unexpected bills without creating high-rate debt, keeping savings habits steady.",
  },
  {
    id: "defense",
    number: "02",
    title: "Income & Family Protection",
    category: "Risk Management",
    purpose: "Protect the household's largest financial asset: the ability to earn an income over decades.",
    components: [
      "Individual disability coverage replacing roughly 60–70% of gross take-home income",
      "Critical illness lump-sum coverage for defined major medical diagnoses",
      "Term life insurance matched to mortgage length and the years dependents rely on household income",
    ],
    vulnerabilityWithout:
      "A 9-month illness pauses paycheques, forces early registered account withdrawals with penalty tax, or puts housing stability at risk.",
    intentionalDesign:
      "Replacement benefits cover essential monthly obligations so long-term savings and registered accounts stay intact.",
  },
  {
    id: "growth",
    number: "03",
    title: "Tax-Sheltered Account Prioritization",
    category: "Savings & Tax Efficiency",
    purpose: "Use Canadian registered contribution room intentionally before exposing growth to annual taxable drag.",
    components: [
      "FHSA ($8,000/yr up to $40,000 lifetime) for tax-deductible first-home savings",
      "TFSA ($7,000/yr limit for 2026) for tax-free growth and flexible access",
      "RRSP contributions timed when current marginal tax rates exceed expected retirement rates",
      "RESP contributions capturing the 20% Canada Education Savings Grant ($500/yr per child)",
    ],
    vulnerabilityWithout:
      "Savings sit in regular taxable accounts, losing 25–45% of investment growth each year to marginal income tax.",
    intentionalDesign:
      "Each new dollar goes to the account with the strongest tax and grant advantage first, capturing employer matches and government grants.",
  },
  {
    id: "distribution",
    number: "04",
    title: "Retirement Drawdown & Pension Timing",
    category: "Income Coordination",
    purpose: "Coordinate government pensions, registered plans, and taxable withdrawals to smooth lifetime tax.",
    components: [
      "CPP start-age analysis (comparing the -36% reduction at 60 vs. the +42% increase at 70)",
      "OAS deferral review and Old Age Security recovery tax (clawback) mitigation",
      "RRSP-to-RRIF drawdown sequencing across ages 65–85 to avoid sudden tax-bracket spikes",
      "Updated beneficiary designations and estate clarity for smooth family transfer",
    ],
    vulnerabilityWithout:
      "Claiming CPP at 60 out of habit locks in a permanent 36% reduction and increases exposure to OAS clawbacks once RRIF minimums start.",
    intentionalDesign:
      "Withdrawals are sequenced by tax bracket, using inflation-indexed public pensions as reliable lifetime income.",
  },
];

const TIERS_FR: StructureTier[] = [
  {
    id: "foundation",
    number: "01",
    title: "Trésorerie et réserves d'urgence",
    category: "Base de liquidité",
    purpose: "Assurer la stabilité du budget courant sans recourir aux marges de crédit ou cartes à taux élevé.",
    components: [
      "3 à 6 mois de dépenses essentielles dans des comptes liquides et stables",
      "Suivi clair entre les charges fixes mensuelles et les dépenses discrétionnaires",
      "Cagnotte dédiée aux dépenses annuelles irrégulières (taxes foncières, entretien, auto)",
    ],
    vulnerabilityWithout:
      "Un imprévu (toiture, réparation automobile) finit aussitôt sur une carte de crédit à 19,99 %, freinant l'épargne mensuelle.",
    intentionalDesign:
      "La réserve de liquidités absorbe l'imprévu sans endettement coûteux, préservant votre capacité d'épargne.",
  },
  {
    id: "defense",
    number: "02",
    title: "Protection du revenu et de la famille",
    category: "Gestion des risques",
    purpose: "Protéger le principal actif financier du ménage : sa capacité de gagner un revenu au fil des décennies.",
    components: [
      "Assurance invalidité individuelle remplaçant environ 60 à 70 % du revenu net courant",
      "Assurance maladies graves offrant un capital forfaitaire en cas de diagnostic majeur",
      "Assurance vie temporaire calibrée sur la durée de l'hypothèque et des personnes à charge",
    ],
    vulnerabilityWithout:
      "Un arrêt de travail de 9 mois coupe le revenu, force des retraits REER coûteux en impôt et fragilise le maintien de la résidence.",
    intentionalDesign:
      "Les prestations de remplacement couvrent les obligations essentielles sans obliger à liquider vos comptes enregistrés.",
  },
  {
    id: "growth",
    number: "03",
    title: "Priorisation des comptes enregistrés",
    category: "Fiscalité et épargne",
    purpose: "Utiliser pleinement les plafonds fiscaux canadiens avant d'exposer vos placements à l'impôt annuel.",
    components: [
      "CELIAPP (8 000 $/an jusqu'à 40 000 $) pour l'épargne-logement déductible et libre d'impôt",
      "CELI (plafond de 7 000 $ en 2026) pour une croissance libre d'impôt et des retraits souples",
      "Cotisations REER priorisées lorsque votre taux marginal actuel dépasse celui anticipé à la retraite",
      "REEE profitant de la Subvention canadienne de 20 % (500 $/an par enfant)",
    ],
    vulnerabilityWithout:
      "L'épargne dort dans des comptes imposables standards et perd de 25 à 45 % de son rendement annuel en impôt marginal.",
    intentionalDesign:
      "Chaque dollar est dirigé vers l'enveloppe la plus avantageuse fiscalement afin de capter les subventions et cotisations employeur.",
  },
  {
    id: "distribution",
    number: "04",
    title: "Décaissement et calendrier des rentes",
    category: "Coordination à la retraite",
    purpose: "Harmoniser rentes publiques, régimes enregistrés et comptes imposables pour lisser l'impôt à vie.",
    components: [
      "Analyse de l'âge de début du RPC/RRQ (-36 % à 60 ans c. +42 % à 70 ans)",
      "Calcul du report de la PSV et prévention de l'impôt de récupération (clawback)",
      "Séquence de retrait REER/FERR entre 65 et 85 ans pour éviter les sauts de palier fiscal",
      "Désignations de bénéficiaires à jour pour simplifier le règlement successoral",
    ],
    vulnerabilityWithout:
      "Prendre sa rente à 60 ans par automatisme fixe une réduction permanente de 36 % et expose davantage la PSV aux récupérations plus tard.",
    intentionalDesign:
      "Les retraits suivent un ordre fiscal précis et s'appuient sur des rentes publiques indexées comme revenu garanti à vie.",
  },
];

const SCENARIOS_EN: StressScenario[] = [
  {
    id: "disability",
    name: "Scenario A: Sudden 6-Month Income Interruption",
    description: "An unexpected illness or surgery prevents full-time work for 6 months.",
    unstructuredOutcome:
      "Cash runs out within 45 days. The household borrows at 19.99% interest, withdraws $15,000 from an RRSP (triggering withholding tax and permanently losing contribution room), and pauses children's education savings.",
    structuredOutcome:
      "Individual disability coverage replaces 65% of take-home pay after the waiting period. The Tier 1 emergency reserve bridges the deductible period while registered accounts remain untouched.",
  },
  {
    id: "market-drop",
    name: "Scenario B: 30% Global Market Correction",
    description: "Broad equity markets drop 30% over 8 months during prime accumulation years.",
    unstructuredOutcome:
      "Short-term cash needs were left in volatile investments. Selling near the bottom to pay an upcoming tax bill or down payment turns a temporary decline into a permanent loss.",
    structuredOutcome:
      "Near-term goals (under 3 years) sit in principal-stable accounts. Long-term registered holdings stay invested through the downturn and benefit from regular contributions.",
  },
  {
    id: "interest-spike",
    name: "Scenario C: Mortgage Renewal +$650/Month",
    description: "A rate reset at renewal adds $650 per month to required housing payments.",
    unstructuredOutcome:
      "Monthly cash flow swings into deficit. Savings stop, cash buffers shrink, and credit line balances climb month after month.",
    structuredOutcome:
      "Monthly cash flow was planned with breathing room. Discretionary spending adjusts calmly, mortgage payments stay current, and core protection remains in force.",
  },
];

const SCENARIOS_FR: StressScenario[] = [
  {
    id: "disability",
    name: "Scénario A : Arrêt de revenu de 6 mois",
    description: "Une maladie ou une chirurgie imprévue empêche de travailler à temps plein pendant 6 mois.",
    unstructuredOutcome:
      "Les liquidités s'épuisent en 45 jours. Le ménage emprunte à 19,99 %, retire 15 000 $ d'un REER (avec retenue d'impôt et perte définitive des droits) et interrompt l'épargne REEE.",
    structuredOutcome:
      "L'assurance invalidité individuelle remplace 65 % du revenu net après le délai de carence. La réserve d'urgence couvre la transition et les placements enregistrés restent intacts.",
  },
  {
    id: "market-drop",
    name: "Scénario B : Baisse boursière de 30 %",
    description: "Les marchés boursiers reculent de 30 % sur 8 mois en pleine phase d'accumulation.",
    unstructuredOutcome:
      "L'épargne à court terme était exposée aux actions. Vendre au creux pour payer un impôt ou une mise de fonds transforme une baisse passagère en perte définitive.",
    structuredOutcome:
      "Les projets à moins de 3 ans restent dans des comptes stables. Les placements enregistrés à long terme demeurent investis durant la correction.",
  },
  {
    id: "interest-spike",
    name: "Scénario C : Renouvellement à +650 $/mois",
    description: "Une hausse de taux au renouvellement augmente la mensualité hypothécaire de 650 $.",
    unstructuredOutcome:
      "Le budget mensuel passe en déficit. L'épargne est annulée, la réserve fond et la marge de crédit augmente chaque mois.",
    structuredOutcome:
      "Le budget intégrait déjà une marge de manœuvre. Les dépenses variables s'ajustent sans panique, les versements restent à jour et les protections demeurent actives.",
  },
];

export const MoneyStructureStudio: React.FC = () => {
  const { isFr } = useLanguage();
  const [activeTierId, setActiveTierId] = useState<string>("foundation");
  const [activeScenarioId, setActiveScenarioId] = useState<string>("disability");

  const tiers = isFr ? TIERS_FR : TIERS_EN;
  const scenarios = isFr ? SCENARIOS_FR : SCENARIOS_EN;
  const currentTier = tiers.find((t) => t.id === activeTierId) || tiers[0];
  const currentScenario = scenarios.find((s) => s.id === activeScenarioId) || scenarios[0];

  return (
    <div className="space-y-12">
      {/* Introduction Card */}
      <div className="p-8 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] space-y-4">
        <div className="flex items-center gap-2.5">
          <Layers className="w-5 h-5 text-[#2e4a3b]" aria-hidden="true" />
          <span className="eyebrow text-xs text-[#75581f]">
            {isFr ? "Méthode en 4 paliers" : "Four-Tier Planning Method"}
          </span>
        </div>
        <h3 className="h2 text-[#1c1b18] text-2xl md:text-3xl leading-snug">
          {isFr
            ? "Un plan financier solide ne se résume pas à des comptes séparés. Tout fonctionne ensemble."
            : "A sound financial plan is more than a list of accounts. Every piece affects the others."}
        </h3>
        <p className="text-base text-[#46423a] leading-relaxed max-w-3xl">
          {isFr
            ? "Beaucoup de Canadiens accumulent des produits sans coordination : un compte chèques ici, un REER là, une assurance collective rarement relue. Quand un imprévu survient, ces décisions isolées entrent en conflit. Voici les quatre paliers sur lesquels s'appuie Ahmed Bello pour bâtir un plan cohérent."
            : "Many Canadians open accounts one by one: a chequing account here, an RRSP there, and a workplace benefits booklet nobody reads. When life changes, disconnected decisions pull against each other. Explore the four connected tiers below."}
        </p>
      </div>

      {/* Part 1: The 4-Tier Interactive Breakdown */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#d6cebd] pb-3">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-[#1c1b18]">
            {isFr
              ? "Explorer les 4 paliers d'un plan coordonné"
              : "Explore the 4 Tiers of a Coordinated Financial Plan"}
          </h4>
          <span className="text-xs text-[#625d52]">
            {isFr ? "Sélectionnez un palier pour voir le détail" : "Select a tier to review its role"}
          </span>
        </div>

        {/* Tier Selector Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {tiers.map((tier) => {
            const isSelected = tier.id === activeTierId;
            return (
              <button
                key={tier.id}
                type="button"
                onClick={() => setActiveTierId(tier.id)}
                className={`p-4 text-left border rounded-[2px] transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#2e4a3b] text-[#f7f3eb] border-[#2e4a3b] shadow-xs"
                    : "bg-[#fcfaf5] text-[#1c1b18] border-[#d6cebd] hover:border-[#2e4a3b]"
                }`}
              >
                <span
                  className={`tabular-nums text-xs font-semibold tracking-wider block mb-1 ${
                    isSelected ? "text-[#d6c298]" : "text-[#75581f]"
                  }`}
                >
                  {isFr ? `PALIER ${tier.number}` : `TIER ${tier.number}`}
                </span>
                <span className="font-serif text-lg leading-tight block font-normal">
                  {tier.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Tier Detail */}
        <div className="p-8 bg-[#f7f3eb] border border-[#2e4a3b] rounded-[2px] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#d6cebd] pb-4">
            <div>
              <span className="eyebrow text-[#75581f]">
                {isFr ? `Palier ${currentTier.number}` : `Tier ${currentTier.number}`} &bull; {currentTier.category}
              </span>
              <h4 className="font-serif text-2xl md:text-3xl text-[#1c1b18] mt-1">
                {currentTier.title}
              </h4>
            </div>
          </div>

          <p className="text-base text-[#1c1b18] font-serif text-lg leading-relaxed">
            &ldquo;{currentTier.purpose}&rdquo;
          </p>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-2">
            {/* Core Elements */}
            <div className="md:col-span-6 space-y-3">
              <h5 className="eyebrow text-xs text-[#2e4a3b]">
                {isFr ? "Éléments clés à mettre en place" : "Core Elements"}
              </h5>
              <ul className="space-y-2.5 list-none p-0 text-xs md:text-sm text-[#46423a]">
                {currentTier.components.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-[#2e4a3b] shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contrast: Without Plan vs Coordinated Plan */}
            <div className="md:col-span-6 space-y-4">
              <div className="p-4 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] space-y-1">
                <span className="text-[0.7rem] font-semibold uppercase tracking-wider text-[#8f2a1d] block">
                  {isFr ? "Risque sans coordination" : "Exposure Without Coordination"}
                </span>
                <p className="text-xs text-[#46423a] leading-relaxed">
                  {currentTier.vulnerabilityWithout}
                </p>
              </div>

              <div className="p-4 bg-[#f7f3eb] border border-[#2e4a3b]/40 rounded-[2px] space-y-1">
                <span className="text-[0.7rem] font-semibold uppercase tracking-wider text-[#2e4a3b] block">
                  {isFr ? "Approche coordonnée" : "Coordinated Approach"}
                </span>
                <p className="text-xs text-[#1c1b18] leading-relaxed">
                  {currentTier.intentionalDesign}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Part 2: Interactive Stress Test */}
      <div className="p-8 bg-[#14211a] text-[#f7f3eb] rounded-[2px] space-y-8 on-dark border border-[#2e4a3b]">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#d6c298]" aria-hidden="true" />
            <span className="eyebrow text-xs text-[#d6c298]">
              {isFr ? "Test de résistance" : "Real-Life Stress Test"}
            </span>
          </div>
          <h4 className="font-serif text-2xl md:text-3xl text-white">
            {isFr
              ? "Simuler un imprévu : comment réagit un plan coordonné ?"
              : "Test a Real-Life Shock: How Does a Coordinated Plan Hold Up?"}
          </h4>
          <p className="text-sm text-[#ece6da]/80 max-w-2xl leading-relaxed">
            {isFr
              ? "La solidité d'un plan se mesure lors d'un imprévu. Choisissez un événement courant au Canada pour comparer des comptes gérés séparément à une planification coordonnée."
              : "A financial plan shows its real value during a disruption. Choose a common Canadian scenario below to compare disconnected accounts against a coordinated plan."}
          </p>
        </div>

        {/* Scenario Buttons */}
        <div className="flex flex-wrap gap-2.5">
          {scenarios.map((scen) => (
            <button
              key={scen.id}
              type="button"
              onClick={() => setActiveScenarioId(scen.id)}
              className={`px-4 py-2.5 text-xs font-medium rounded-[2px] transition-all cursor-pointer ${
                activeScenarioId === scen.id
                  ? "bg-[#d6c298] text-[#14211a] font-semibold"
                  : "bg-[#2e4a3b]/40 text-[#ece6da] border border-[#d6c298]/30 hover:bg-[#2e4a3b]"
              }`}
            >
              {scen.name}
            </button>
          ))}
        </div>

        {/* Active Scenario Comparison Grid */}
        <div className="p-6 bg-[#1a2d24] border border-[#d6c298]/20 rounded-[2px] space-y-6">
          <div className="border-b border-[#d6c298]/20 pb-3">
            <span className="text-xs text-[#d6c298] uppercase font-semibold tracking-wider">
              {isFr ? "Événement simulé" : "Simulated Event"}
            </span>
            <p className="font-serif text-xl text-white mt-1">{currentScenario.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Unstructured Failure Mode */}
            <div className="p-5 bg-[#261515] border border-[#8f2a1d]/40 rounded-[2px] space-y-3">
              <div className="flex items-center gap-2 text-[#e57373]">
                <AlertTriangle className="w-4 h-4" aria-hidden="true" />
                <h5 className="text-xs font-semibold uppercase tracking-wider">
                  {isFr ? "Comptes isolés" : "Disconnected Accounts"}
                </h5>
              </div>
              <p className="text-xs md:text-sm text-[#ece6da]/80 leading-relaxed">
                {currentScenario.unstructuredOutcome}
              </p>
            </div>

            {/* Coordinated Mode */}
            <div className="p-5 bg-[#122b1f] border border-[#3d6350] rounded-[2px] space-y-3">
              <div className="flex items-center gap-2 text-[#81c784]">
                <Shield className="w-4 h-4" aria-hidden="true" />
                <h5 className="text-xs font-semibold uppercase tracking-wider text-[#d6c298]">
                  {isFr ? "Plan coordonné avec Ahmed Bello" : "With a Coordinated Plan"}
                </h5>
              </div>
              <p className="text-xs md:text-sm text-[#ece6da]/90 leading-relaxed">
                {currentScenario.structuredOutcome}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-[#d6c298]/20">
          <p className="text-xs text-[#ece6da]/70">
            {isFr
              ? "Vous souhaitez vérifier comment vos comptes et protections interagissent avant un imprévu ?"
              : "Want to see how your accounts, cash flow, and protections fit together before an unexpected change?"}
          </p>
          <Link to={isFr ? "/fr/contact" : "/contact"} className="btn btn-primary text-xs py-2 px-5 shrink-0">
            {isFr ? "Parler avec Ahmed →" : "Start a Conversation with Ahmed →"}
          </Link>
        </div>
      </div>
    </div>
  );
};
