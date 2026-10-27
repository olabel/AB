import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FileText, ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";

interface CaseStudy {
  id: string;
  tag: string;
  title: string;
  context: string;
  initialFriction: string[];
  engineeredSolution: string[];
  outcome: string;
  contactTopic: string;
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: "first-home",
    tag: "Dual-Income First-Time Buyers",
    title: "Structuring Down Payment Growth While Cutting Tax",
    context: "Sarah and Daniel (ages 29 & 31, Ontario). Combined household income $145,000. Goal: purchase first home in 3 years.",
    initialFriction: [
      "$48,000 idle in non-registered low-interest bank accounts generating taxable interest each year.",
      "Unaware of the First Home Savings Account (FHSA) annual carry-forward cap of $8,000.",
      "Carrying a $12,000 car financing loan at 7.9% interest while simultaneously trying to save.",
    ],
    engineeredSolution: [
      "Opened individual FHSAs for each partner before December 31, contributing $8,000 each to capture $16,000 in immediate tax deductions.",
      "Reinvested the combined tax refunds ($5,280) alongside surplus cash to extinguish the 7.9% auto debt.",
      "Established a 4-month emergency buffer in high-interest TFSAs to protect against unexpected job transitions prior to mortgage approval.",
    ],
    outcome:
      "Saved over $11,000 in personal income taxes across two years, wiped out high-interest car debt, and created a fully protected $80,000 down payment runway.",
    contactTopic: "accounts",
  },
  {
    id: "single-earner",
    tag: "Family Financial Protection",
    title: "Closing the $3,200 Monthly Household Income Deficit",
    context: "Marcus and Elena (ages 36 & 38, Alberta). Two children (ages 3 & 6). Marcus is the sole income earner ($115,000).",
    initialFriction: [
      "Employer group disability coverage had a 2-year cap, restrictive 'any occupation' definition, and was fully taxable upon payout.",
      "A 6-month disability would create an immediate $3,200/month shortfall between mortgage/living costs and net benefit payouts.",
      "Zero education savings started for either child due to feeling 'stretched thin' each month.",
    ],
    engineeredSolution: [
      "Structured individual portable disability coverage with an 'own occupation' rider, ensuring tax-free monthly replacement benefits.",
      "Implemented a 20-year level term life policy precisely sized to clear the remaining mortgage and fund child dependants until post-secondary age.",
      "Automated $208/month into a family RESP, securing the full $500/year Canada Education Savings Grant (CESG) match from the federal government.",
    ],
    outcome:
      "Elena and the children’s standard of living was fully protected from catastrophic disruption, with guaranteed grants compounding toward future tuition.",
    contactTopic: "protection",
  },
  {
    id: "pre-retiree",
    tag: "Retirement Decumulation",
    title: "Decoupling CPP & OAS Timing to Avoid Tax Drag",
    context: "Robert (age 63, British Columbia). Planning to retire at 65 with $450,000 in RRSPs and $90,000 in TFSAs.",
    initialFriction: [
      "Planned to take CPP at 65 by default, accepting an unoptimized baseline amount.",
      "Risk of high mandatory RRIF withdrawals starting at age 72 pushing taxable income into Old Age Security (OAS) recovery tax (clawback) territory.",
      "No coordinated order of account withdrawals to minimize lifetime taxes.",
    ],
    engineeredSolution: [
      "Planned an intentional 'RRSP meltdown' bridge between ages 64 and 70: drawing from RRSP/RRIF in lower income tax brackets before pensions kick in.",
      "Deferred CPP and OAS start date to age 70, locking in a permanent +42% CPP increase and +36% OAS increase as guaranteed, inflation-indexed government income.",
      "Protected TFSA balances as non-income-tested reserves for healthcare needs and legacy transfer in later decades.",
    ],
    outcome:
      "Increased guaranteed lifetime pension income by over $6,200 annually, minimized lifetime tax bracket spikes, and eliminated OAS clawback exposure.",
    contactTopic: "retirement",
  },
];

export const StructuralCaseStudies: React.FC = () => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>("first-home");
  const activeCase = CASE_STUDIES.find((c) => c.id === selectedCaseId) || CASE_STUDIES[0];

  return (
    <section className="p-8 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] space-y-8">
      <div className="max-w-3xl space-y-3">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#2e4a3b]" aria-hidden="true" />
          <span className="eyebrow text-xs text-[#75581f]">Anonymized Structural Blueprints</span>
        </div>
        <h3 className="h2 text-[#1c1b18] text-2xl md:text-3xl leading-snug">
          How intentional financial engineering looks in practice.
        </h3>
        <p className="text-sm md:text-base text-[#46423a] leading-relaxed">
          These anonymized case studies illustrate how real Canadian households moved from isolated, fragmented
          accounts to synchronized, resilient financial structures. (All numbers are illustrative; advice is tailored
          to personal circumstances).
        </p>
      </div>

      {/* Case Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#d6cebd] pb-3">
        {CASE_STUDIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setSelectedCaseId(c.id)}
            className={`px-4 py-2 text-xs font-medium rounded-[2px] transition-all cursor-pointer ${
              selectedCaseId === c.id
                ? "bg-[#2e4a3b] text-[#f7f3eb] font-semibold"
                : "bg-[#f7f3eb] text-[#46423a] border border-[#d6cebd] hover:border-[#2e4a3b]"
            }`}
          >
            {c.tag}
          </button>
        ))}
      </div>

      {/* Active Case Blueprint View */}
      <div className="p-6 md:p-8 bg-[#f7f3eb] border border-[#d6cebd] rounded-[2px] space-y-6">
        <div className="space-y-1.5">
          <span className="text-xs font-mono font-semibold text-[#75581f] uppercase tracking-wider">
            {activeCase.tag}
          </span>
          <h4 className="font-serif text-2xl text-[#1c1b18]">{activeCase.title}</h4>
          <p className="text-xs md:text-sm text-[#46423a] italic">{activeCase.context}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Friction / Vulnerabilities */}
          <div className="p-5 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] space-y-3">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-[#8f2a1d]">
              Initial Friction & Structural Gaps
            </h5>
            <ul className="space-y-2 list-none p-0 text-xs text-[#46423a]">
              {activeCase.initialFriction.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#8f2a1d] font-bold">&times;</span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Engineered Blueprint Solution */}
          <div className="p-5 bg-[#fcfaf5] border border-[#2e4a3b] rounded-[2px] space-y-3">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-[#2e4a3b]">
              Engineered Structural Blueprint
            </h5>
            <ul className="space-y-2 list-none p-0 text-xs text-[#1c1b18]">
              {activeCase.engineeredSolution.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2e4a3b] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Structural Outcome */}
        <div className="p-4 bg-[#2e4a3b]/10 border-l-3 border-[#2e4a3b] rounded-r-[2px] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[#2e4a3b] text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Architectural Result</span>
            </div>
            <p className="text-xs md:text-sm text-[#1c1b18] font-medium leading-relaxed">
              {activeCase.outcome}
            </p>
          </div>
          <Link
            to={`/contact?topic=${activeCase.contactTopic}`}
            className="btn btn-primary text-xs py-2 px-4 whitespace-nowrap shrink-0"
          >
            Ask about this framework &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
};
