import React, { useState } from "react";
import { Calculator, CheckCircle2, Info } from "lucide-react";
import { useLanguage } from "../context/LanguageContext.tsx";
import { CalculatorLeadCapture } from "./CalculatorLeadCapture.tsx";
import { trackCalculatorCompleted } from "../lib/track.ts";

type IncomeTier = "lower" | "standard" | "unsure";

export const RespGrantQuickWidget: React.FC = () => {
  const { isFr } = useLanguage();

  const [childAge, setChildAge] = useState<number>(4);
  const [missedPriorYears, setMissedPriorYears] = useState<number>(2);
  const [annualContribution, setAnnualContribution] = useState<number>(2500);
  const [incomeTier, setIncomeTier] = useState<IncomeTier>("standard");
  const [interacted, setInteracted] = useState<boolean>(false);

  const recordInteraction = () => {
    if (!interacted) {
      setInteracted(true);
      trackCalculatorCompleted("resp_grant_widget");
    }
  };

  // ESDC Basic CESG rules:
  // 20% on first $2,500/yr ($500 max regular), OR up to $5,000/yr ($1,000 max basic CESG) when catch-up room exists.
  // Lifetime CESG cap per beneficiary: $7,200. Grants run through calendar year child turns 17.
  const canCatchUp = missedPriorYears >= 1 && childAge <= 17;
  const maxGrantableContributionThisYear = canCatchUp ? 5000 : 2500;
  const grantEligibleContribution =
    childAge <= 17 ? Math.min(maxGrantableContributionThisYear, Math.max(0, annualContribution)) : 0;
  const basicCesgThisYear = Math.round(grantEligibleContribution * 0.20);

  const yearsRemainingIncludingCurrent = Math.max(0, 18 - childAge);
  const projectedBasicLifetime = Math.min(
    7200,
    basicCesgThisYear + Math.max(0, yearsRemainingIncludingCurrent - 1) * Math.min(500, Math.round(annualContribution * 0.20))
  );

  const formatMoney = (val: number) =>
    new Intl.NumberFormat(isFr ? "fr-CA" : "en-CA", {
      style: "currency",
      currency: "CAD",
      maximumFractionDigits: 0,
    }).format(val);

  const summaryText = [
    `Child's Current Age: ${childAge}`,
    `Prior Uncontributed Calendar Years: ${missedPriorYears} (${canCatchUp ? "Catch-up active: up to $1,000 basic CESG/yr on $5,000" : "Standard $500/yr basic CESG limit"})`,
    `Planned Annual RESP Contribution: ${formatMoney(annualContribution)}`,
    `Estimated Basic CESG Match This Year (20%): ${formatMoney(basicCesgThisYear)}`,
    `Projected Basic CESG Through Age 17 (capped at $7,200 lifetime): ${formatMoney(projectedBasicLifetime)}`,
    `Family Income / Benefit Profile: ${incomeTier === "lower" ? "Lower-income profile: review Canada Learning Bond ($500 yr 1 + $100/yr to $2,000) and Additional CESG" : "Standard / verify Additional CESG tiers on Canada.ca"}`,
  ].join("\n");

  return (
    <section
      id="resp-grant-widget"
      className="card-editorial border-[#2e4a3b]/50 p-6 sm:p-7 space-y-6 scroll-mt-28"
    >
      <div className="space-y-1 border-b border-[#ece6da] pb-4">
        <div className="flex items-center gap-2 eyebrow text-[#75581f]">
          <Calculator className="w-3.5 h-3.5" />
          <span>{isFr ? "Calculateur Subvention REEE (15 secondes)" : "15-Second RESP Grant & Catch-Up Check"}</span>
        </div>
        <h2 className="font-serif text-xl sm:text-2xl text-[#1c1b18] font-semibold">
          {isFr
            ? "Calculez la SCEE (20 %) et vos droits de rattrapage"
            : "Estimate your Canada Education Savings Grant & catch-up room"}
        </h2>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <label htmlFor="resp-age" className="font-semibold text-[#1c1b18]">
                {isFr ? "Âge de l'enfant cette année" : "Child's age this calendar year"}
              </label>
              <span className="tabular-nums font-semibold text-[#2e4a3b]">
                {childAge} {isFr ? "ans" : "yrs"}
              </span>
            </div>
            <input
              id="resp-age"
              type="range"
              min={0}
              max={17}
              step={1}
              value={childAge}
              onChange={(e) => {
                setChildAge(Number(e.target.value));
                recordInteraction();
              }}
              className="w-full accent-[#2e4a3b]"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <label htmlFor="resp-missed" className="font-semibold text-[#1c1b18]">
                {isFr ? "Années antérieures sans cotisation" : "Prior years with no RESP contribution"}
              </label>
              <span className="tabular-nums font-semibold text-[#2e4a3b]">
                {missedPriorYears} {isFr ? "an(s)" : "yr(s)"}
              </span>
            </div>
            <input
              id="resp-missed"
              type="range"
              min={0}
              max={15}
              step={1}
              value={missedPriorYears}
              onChange={(e) => {
                setMissedPriorYears(Number(e.target.value));
                recordInteraction();
              }}
              className="w-full accent-[#2e4a3b]"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <label htmlFor="resp-contrib" className="font-semibold text-[#1c1b18]">
                {isFr ? "Cotisation annuelle prévue" : "Planned RESP contribution this year"}
              </label>
              <span className="tabular-nums font-semibold text-[#2e4a3b]">{formatMoney(annualContribution)}</span>
            </div>
            <input
              id="resp-contrib"
              type="range"
              min={0}
              max={5000}
              step={250}
              value={annualContribution}
              onChange={(e) => {
                setAnnualContribution(Number(e.target.value));
                recordInteraction();
              }}
              className="w-full accent-[#2e4a3b]"
            />
          </div>

          <div className="p-3.5 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] space-y-2">
            <span className="text-xs font-semibold text-[#1c1b18] block">
              {isFr ? "Profil de revenu familial (BEC / SCEE bonifiée)" : "Household profile (CLB & Additional CESG awareness)"}
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {(
                [
                  { id: "lower", en: "Modest / CCB", fr: "Revenu modeste" },
                  { id: "standard", en: "Standard 20%", fr: "Standard 20 %" },
                  { id: "unsure", en: "Unsure", fr: "Incertain" },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setIncomeTier(opt.id);
                    recordInteraction();
                  }}
                  className={`py-2 px-2 text-[11px] font-medium rounded-[2px] border transition-colors cursor-pointer ${
                    incomeTier === opt.id
                      ? "bg-[#2e4a3b] text-[#f7f3eb] border-[#2e4a3b]"
                      : "bg-white text-[#46423a] border-[#d6cebd] hover:border-[#2e4a3b]"
                  }`}
                >
                  {isFr ? opt.fr : opt.en}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 bg-[#2e4a3b] text-[#f7f3eb] rounded-[2px]">
          <span className="text-[11px] uppercase tracking-wider text-[#d6c298] font-semibold block">
            {isFr ? "SCEE de base cette année" : "Est. Basic CESG This Year"}
          </span>
          <span className="font-serif text-2xl font-bold text-white mt-1 block">
            {formatMoney(basicCesgThisYear)}
          </span>
          <span className="text-[11px] text-[#ece6da]/85 block mt-0.5">
            {canCatchUp
              ? isFr
                ? "Rattrapage actif (max. 1 000 $/an)"
                : "Catch-up eligible (up to $1,000/yr)"
              : isFr
              ? "Plafond annuel courant : 500 $"
              : "Standard annual cap: $500"}
          </span>
        </div>

        <div className="p-4 bg-[#f7f3eb] border border-[#d6cebd] rounded-[2px]">
          <span className="text-[11px] uppercase tracking-wider text-[#625d52] font-semibold block">
            {isFr ? "SCEE totale estimée (≤ 17 ans)" : "Projected Basic Grant (to Age 17)"}
          </span>
          <span className="font-serif text-2xl font-bold text-[#1c1b18] mt-1 block">
            {formatMoney(projectedBasicLifetime)}
          </span>
          <span className="text-[11px] text-[#625d52] block mt-0.5">
            {isFr ? "Plafond à vie : 7 200 $ / enfant" : "CRA lifetime limit: $7,200 / child"}
          </span>
        </div>

        <div className="p-4 bg-[#f7f3eb] border border-[#2e4a3b]/40 rounded-[2px]">
          <span className="text-[11px] uppercase tracking-wider text-[#75581f] font-semibold block">
            {isFr ? "Bon d'études (BEC)" : "Canada Learning Bond (CLB)"}
          </span>
          <span className="font-serif text-xl font-bold text-[#2e4a3b] mt-1 block">
            {incomeTier === "lower"
              ? isFr
                ? "Jusqu'à 2 000 $ (0 $ requis)"
                : "Up to $2,000 ($0 deposit)"
              : isFr
              ? "Selon revenu ACE"
              : "Income-tested"}
          </span>
          <span className="text-[11px] text-[#625d52] block mt-0.5">
            {isFr ? "500 $ an 1 + 100 $/an admissible" : "$500 first yr + $100/yr eligible"}
          </span>
        </div>
      </div>

      {childAge >= 16 && (
        <div className="p-3.5 bg-[#fcfaf5] border border-[#75581f]/40 rounded-[2px] text-xs text-[#46423a] flex items-start gap-2">
          <Info className="w-4 h-4 text-[#75581f] shrink-0 mt-0.5" />
          <span>
            {isFr
              ? "Règle des 16-17 ans : pour obtenir la SCEE à 16 ou 17 ans, un minimum cumulatif de 2 000 $ doit avoir été cotisé avant la fin de l'année des 15 ans (ou 100 $/an pendant 4 années antérieures)."
              : "Age 16–17 rule: to receive CESG at age 16 or 17, at least $2,000 must have been contributed before the end of the calendar year the child turned 15 (or at least $100/year in any 4 prior years)."}
          </span>
        </div>
      )}

      <p className="text-[11px] text-[#625d52] flex items-start gap-1.5 leading-relaxed">
        <CheckCircle2 className="w-3.5 h-3.5 text-[#2e4a3b] shrink-0 mt-0.5" />
        <span>
          {isFr
            ? "Estimation éducative uniquement (SCEE de base 20 %, plafond annuel 500 $ ou 1 000 $ en rattrapage, plafond à vie de 7 200 $, plafond de cotisation à vie de 50 000 $). Consultez Canada.ca pour les seuils de revenu exacts de la SCEE bonifiée et du BEC."
            : "Educational estimate only (20% basic CESG up to $500/yr or $1,000/yr catch-up, $7,200 lifetime grant limit, $50,000 lifetime contribution cap). Confirm current Additional CESG & CLB income thresholds on Canada.ca."}
        </span>
      </p>

      <CalculatorLeadCapture
        calculatorName="RESP Grant & Catch-Up Planner"
        analyticsCalculatorName="resp_grant_widget"
        analyticsTopic="family"
        topic="family"
        summaryText={summaryText}
        customSubheading={isFr ? "Plan d'Action REEE Gratuit" : "Free Child Education Grant Plan"}
        customHeading={
          isFr
            ? "Recevez ce calcul REEE et la liste de vérification des subventions"
            : "Email me this RESP grant estimate & provider checklist"
        }
        customButtonLabel={
          isFr
            ? "Envoyer mon estimation et la liste REEE"
            : "Send Me My RESP Grant Checklist"
        }
      />
    </section>
  );
};
