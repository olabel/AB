import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Shield, TrendingUp, Layers, Compass, AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";

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

const TIERS: StructureTier[] = [
  {
    id: "foundation",
    number: "01",
    title: "Cash Flow & Liquid Reserves Moat",
    category: "Foundation",
    purpose: "Ensure day-to-day liquidity without relying on revolving credit lines.",
    components: [
      "3–6 months essential living expenses in non-volatile cash accounts",
      "Automated monthly cash-flow allocation (Fixed vs Discretionary)",
      "Dedicated sinking fund for irregular annual costs (property tax, maintenance)",
    ],
    vulnerabilityWithout:
      "A sudden expense (roof repair, transmission breakdown) immediately lands on a 19.99% credit card, unraveling monthly savings.",
    intentionalDesign:
      "Buffer accounts absorb the friction. High-rate debt is never created, preserving peace of mind and financial momentum.",
  },
  {
    id: "defense",
    number: "02",
    title: "Income Protection & Living Benefits Wall",
    category: "Defensive Bastion",
    purpose: "Shield the family's largest asset: the ability to earn an income across decades.",
    components: [
      "Individual disability coverage replacing 60–70% of gross take-home pay",
      "Critical illness lump-sum coverage for defined major health diagnoses",
      "Term life coverage matched to mortgage duration and dependent dependency runway",
    ],
    vulnerabilityWithout:
      "A 9-month illness stops salary, depletes registered accounts with penalty taxes, and forces premature home sales.",
    intentionalDesign:
      "Income replacement benefits pay essential costs. Growth investments and registered accounts remain untouched and compounding.",
  },
  {
    id: "growth",
    number: "03",
    title: "Tax-Sheltered Wealth Accumulation",
    category: "Growth Engine",
    purpose: "Maximize registered account room before subjecting dollars to Canadian non-registered tax drag.",
    components: [
      "FHSA ($8,000/yr up to $40,000) for tax-deductible home savings",
      "TFSA ($7,000/yr limit for 2026) for tax-free compounding and emergency flexibility",
      "RRSP contributions prioritized when current marginal tax rate exceeds expected retirement rate",
      "RESP with 20% Canada Education Savings Grant ($500/yr per child)",
    ],
    vulnerabilityWithout:
      "Dollars sit in standard taxable accounts or savings wrappers, losing 25–45% of real returns annually to marginal tax drag.",
    intentionalDesign:
      "Account sequencing directs each dollar into its highest-leverage tax shelter first, capturing employer matches and government grants.",
  },
  {
    id: "distribution",
    number: "04",
    title: "Retirement Decumulation & Pension Timing",
    category: "Apex Coordination",
    purpose: "Harmonize public pensions, registered plans, and taxable withdrawals to minimize lifetime tax.",
    components: [
      "Actuarial CPP start timing (evaluating the +42% deferral increase at age 70)",
      "OAS deferral calculation and Old Age Security recovery tax (clawback) avoidance",
      "RRSP-to-RRIF drawdown sequencing to smooth tax brackets across ages 65–85",
      "Beneficiary and estate design ensuring friction-free intergenerational transfer",
    ],
    vulnerabilityWithout:
      "Taking CPP at 60 by habit triggers a permanent -36% pension cut and accidental OAS benefit clawbacks later in life.",
    intentionalDesign:
      "Withdrawals are sequenced by tax bracket. Inflation-indexed guaranteed public pensions are leveraged as permanent longevity insurance.",
  },
];

const SCENARIOS: StressScenario[] = [
  {
    id: "disability",
    name: "Scenario A: Sudden 6-Month Income Interruption",
    description: "An unexpected illness or orthopedic surgery prevents full-time work for 6 months.",
    unstructuredOutcome:
      "Cash is gone within 45 days. The household borrows at 19.99% interest, liquidates $15,000 from an RRSP (paying withholding tax and permanently losing contribution room), and halts all education savings.",
    structuredOutcome:
      "Individual disability coverage replaces 65% of take-home pay after the elimination period. The Tier 1 liquid moat covers the deductible. Registered growth accounts and investments remain 100% intact.",
  },
  {
    id: "market-drop",
    name: "Scenario B: 30% Global Market Correction",
    description: "Broad equity markets decline 30% over 8 months during the wealth accumulation years.",
    unstructuredOutcome:
      "Panic sets in because investments were held in inappropriate short-term buckets. The owner sells at the bottom to fund an upcoming tax bill or home purchase, turning a paper drop into a permanent capital loss.",
    structuredOutcome:
      "Short-term goals (under 3 years) are safely in non-volatile instruments. Long-term registered holdings are left untouched to participate in the recovery, benefiting from disciplined ongoing contributions.",
  },
  {
    id: "interest-spike",
    name: "Scenario C: Mortgage Renewal at +3.00% Higher Rate",
    description: "Mortgage renewal raises monthly housing expenses by $650 per month.",
    unstructuredOutcome:
      "Household budget enters an immediate deficit. Monthly savings are cancelled, emergency cash is exhausted, and credit lines expand every month.",
    structuredOutcome:
      "The cash-flow moat was architected with a 15% discretionary cushion. Spending is adjusted without panic, debt payments are sustained, and core long-term protection stays active.",
  },
];

export const MoneyStructureStudio: React.FC = () => {
  const [activeTierId, setActiveTierId] = useState<string>("foundation");
  const [activeScenarioId, setActiveScenarioId] = useState<string>("disability");

  const currentTier = TIERS.find((t) => t.id === activeTierId) || TIERS[0];
  const currentScenario = SCENARIOS.find((s) => s.id === activeScenarioId) || SCENARIOS[0];

  return (
    <div className="space-y-12">
      {/* Introduction Card */}
      <div className="p-8 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] space-y-4">
        <div className="flex items-center gap-2.5">
          <Layers className="w-5 h-5 text-[#2e4a3b]" aria-hidden="true" />
          <span className="eyebrow text-xs text-[#75581f]">The Engineering Behind Intentional Money</span>
        </div>
        <h3 className="h2 text-[#1c1b18] text-2xl md:text-3xl leading-snug">
          A financial structure is not a collection of products. It is an interlocking system.
        </h3>
        <p className="text-base text-[#46423a] leading-relaxed max-w-3xl">
          Most Canadians own accounts in isolation: a bank chequing account here, an RRSP there, an employer group policy
          they’ve never read. When life changes, these disconnected parts collide. Below is the four-tier architectural
          framework Ahmed Bello uses to engineer resilient financial clarity.
        </p>
      </div>

      {/* Part 1: The 4-Tier Interactive Architecture */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#d6cebd] pb-3">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-[#1c1b18]">
            Explore the 4 Tiers of an Intentional Money Structure
          </h4>
          <span className="text-xs text-[#625d52]">Select a tier to examine its blueprint</span>
        </div>

        {/* Tier Selector Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {TIERS.map((tier) => {
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
                  className={`font-mono text-xs font-semibold block mb-1 ${
                    isSelected ? "text-[#d6c298]" : "text-[#75581f]"
                  }`}
                >
                  TIER {tier.number}
                </span>
                <span className="font-serif text-lg leading-tight block font-normal">
                  {tier.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Tier Blueprint Detail */}
        <div className="p-8 bg-[#f7f3eb] border-2 border-[#2e4a3b] rounded-[2px] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#d6cebd] pb-4">
            <div>
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#75581f]">
                Tier {currentTier.number} Architectural Spec &bull; {currentTier.category}
              </span>
              <h4 className="font-serif text-2xl md:text-3xl text-[#1c1b18] mt-1">
                {currentTier.title}
              </h4>
            </div>
            <span className="px-3 py-1 bg-[#2e4a3b]/10 text-[#2e4a3b] text-xs font-medium rounded-[2px] self-start sm:self-center">
              Essential Foundation
            </span>
          </div>

          <p className="text-base text-[#1c1b18] font-serif italic text-lg leading-relaxed">
            &ldquo;{currentTier.purpose}&rdquo;
          </p>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-2">
            {/* Core Structural Elements */}
            <div className="md:col-span-6 space-y-3">
              <h5 className="eyebrow text-xs text-[#2e4a3b]">Core Structural Elements</h5>
              <ul className="space-y-2.5 list-none p-0 text-xs md:text-sm text-[#46423a]">
                {currentTier.components.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-[#2e4a3b] shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contrast: Without Structure vs Intentional Design */}
            <div className="md:col-span-6 space-y-4">
              <div className="p-4 bg-[#8f2a1d]/10 border-l-2 border-[#8f2a1d] rounded-r-[2px] space-y-1">
                <span className="text-[0.7rem] font-semibold uppercase tracking-wider text-[#8f2a1d] block">
                  Vulnerability If Left Unstructured
                </span>
                <p className="text-xs text-[#46423a] leading-relaxed">
                  {currentTier.vulnerabilityWithout}
                </p>
              </div>

              <div className="p-4 bg-[#2e4a3b]/10 border-l-2 border-[#2e4a3b] rounded-r-[2px] space-y-1">
                <span className="text-[0.7rem] font-semibold uppercase tracking-wider text-[#2e4a3b] block">
                  Intentional Architectural Design
                </span>
                <p className="text-xs text-[#1c1b18] leading-relaxed">
                  {currentTier.intentionalDesign}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Part 2: Interactive Financial Stress-Tester */}
      <div className="p-8 bg-[#14211a] text-[#f7f3eb] rounded-[2px] space-y-8 on-dark border border-[#2e4a3b]">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#d6c298]" aria-hidden="true" />
            <span className="eyebrow text-xs text-[#d6c298]">Structural Resilience Testing</span>
          </div>
          <h4 className="font-serif text-2xl md:text-3xl text-white">
            Simulate a Life Shock: How does an intentional structure hold up?
          </h4>
          <p className="text-sm text-[#ece6da]/80 max-w-2xl leading-relaxed">
            A financial plan is only as good as its performance on a bad day. Select a realistic Canadian life event
            to see the difference between fragmented finances and an intentional structure.
          </p>
        </div>

        {/* Scenario Buttons */}
        <div className="flex flex-wrap gap-2.5">
          {SCENARIOS.map((scen) => (
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
            <span className="text-xs text-[#d6c298] uppercase font-mono tracking-wider">Simulated Event</span>
            <p className="font-serif text-xl text-white mt-1">{currentScenario.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Unstructured Failure Mode */}
            <div className="p-5 bg-[#261515] border border-[#8f2a1d]/40 rounded-[2px] space-y-3">
              <div className="flex items-center gap-2 text-[#e57373]">
                <AlertTriangle className="w-4 h-4" aria-hidden="true" />
                <h5 className="text-xs font-semibold uppercase tracking-wider">Without Intentional Structure</h5>
              </div>
              <p className="text-xs md:text-sm text-[#ece6da]/80 leading-relaxed">
                {currentScenario.unstructuredOutcome}
              </p>
            </div>

            {/* Structured Success Mode */}
            <div className="p-5 bg-[#122b1f] border border-[#3d6350] rounded-[2px] space-y-3">
              <div className="flex items-center gap-2 text-[#81c784]">
                <Shield className="w-4 h-4" aria-hidden="true" />
                <h5 className="text-xs font-semibold uppercase tracking-wider text-[#d6c298]">
                  With Ahmed Bello’s Intentional Structure
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
            Want to see how your own household pieces connect before a shock occurs?
          </p>
          <Link to="/contact" className="btn btn-primary text-xs py-2 px-5 shrink-0">
            Start a Conversation with Ahmed &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};
