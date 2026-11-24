import React, { useState } from "react";
import { Calculator, AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.tsx";
import { CalculatorLeadCapture } from "./CalculatorLeadCapture.tsx";
import { trackCalculatorCompleted, trackCtaClick } from "../lib/track.ts";

const MARGINAL_BRACKETS = [
  { id: "low", rate: 0.20, labelEn: "~20% (Under ~$58.5k income)", labelFr: "~20 % (Revenu < ~58,5 k$)" },
  { id: "mid", rate: 0.30, labelEn: "~30% ($58.5k to $117k income)", labelFr: "~30 % (58,5 k$ à 117 k$)" },
  { id: "upper", rate: 0.43, labelEn: "~43% ($117k to $181.4k income)", labelFr: "~43 % (117 k$ à 181,4 k$)" },
  { id: "top", rate: 0.50, labelEn: "~50% ($181.4k+ income)", labelFr: "~50 % (Revenu > 181,4 k$)" },
];

export const FhsaQuickEstimator: React.FC = () => {
  const { isFr } = useLanguage();
  const prefix = isFr ? "/fr" : "";

  const [hasOpenedPriorYear, setHasOpenedPriorYear] = useState<boolean>(true);
  const [priorUnusedRoom, setPriorUnusedRoom] = useState<number>(8000);
  const [plannedContribution, setPlannedContribution] = useState<number>(8000);
  const [marginalRate, setMarginalRate] = useState<number>(0.30);
  const [includeHbpStack, setIncludeHbpStack] = useState<boolean>(true);
  const [withPartner, setWithPartner] = useState<boolean>(false);
  const [interacted, setInteracted] = useState<boolean>(false);

  const effectiveCarryForward = hasOpenedPriorYear ? Math.min(8000, Math.max(0, priorUnusedRoom)) : 0;
  const maxAvailableThisYear = Math.min(40000, 8000 + effectiveCarryForward);
  const validContribution = Math.min(maxAvailableThisYear, Math.max(0, plannedContribution));
  const excessOverYearLimit = Math.max(0, plannedContribution - maxAvailableThisYear);
  const estimatedTaxRefund = Math.round(validContribution * marginalRate);
  const netOutOfPocketCost = Math.max(0, validContribution - estimatedTaxRefund);

  const fhsaCapPerPerson = 40000;
  const hbpCapPerPerson = 60000;
  const multiplier = withPartner ? 2 : 1;
  const maxHomeCapital =
    multiplier * (fhsaCapPerPerson + (includeHbpStack ? hbpCapPerPerson : 0));

  const formatMoney = (val: number) =>
    new Intl.NumberFormat(isFr ? "fr-CA" : "en-CA", {
      style: "currency",
      currency: "CAD",
      maximumFractionDigits: 0,
    }).format(val);

  const recordInteraction = () => {
    if (!interacted) {
      setInteracted(true);
      trackCalculatorCompleted("fhsa_estimator");
    }
  };

  const leadSummary = [
    `FHSA Account Opened Prior Year: ${hasOpenedPriorYear ? "Yes" : "No (starts $8,000 clock on open)"}`,
    `Eligible Carry-Forward Room: ${formatMoney(effectiveCarryForward)} (capped at $8,000 CRA limit)`,
    `Maximum Current-Year Room: ${formatMoney(maxAvailableThisYear)}`,
    `Planned Contribution: ${formatMoney(validContribution)}`,
    `Illustrative Marginal Tax Rate: ${Math.round(marginalRate * 100)}%`,
    `Estimated Tax Deduction Savings: ${formatMoney(estimatedTaxRefund)} (Net out-of-pocket: ${formatMoney(netOutOfPocketCost)})`,
    `Projected Tax-Free Down Payment Ceiling (${withPartner ? "Couple" : "Individual"}${includeHbpStack ? " + $60k HBP stack" : ""}): ${formatMoney(maxHomeCapital)}`,
  ].join("\n");

  return (
    <section
      id="fhsa-estimator"
      className="card-editorial border-[#2e4a3b]/50 p-6 sm:p-7 space-y-6 scroll-mt-28"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#ece6da] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 eyebrow text-[#75581f]">
            <Calculator className="w-3.5 h-3.5" />
            <span>{isFr ? "Simulateur Rapide CELIAPP & RAP" : "Interactive FHSA & HBP Estimator"}</span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl text-[#1c1b18] font-semibold">
            {isFr
              ? "Estimez votre économie d'impôt et votre mise de fonds maximale"
              : "Estimate your FHSA tax refund and first-home capital"}
          </h2>
        </div>
        <Link
          to={`${prefix}/calculators?tab=tfsa-rrsp#calculator-tool`}
          onClick={() => trackCtaClick("fhsa_article_estimator", "full_calculators")}
          className="text-xs font-semibold text-[#2e4a3b] hover:underline inline-flex items-center gap-1 shrink-0"
        >
          <span>{isFr ? "Comparer CELI / REER" : "Compare TFSA vs RRSP"}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-4">
          <div className="p-3.5 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] space-y-2">
            <span className="text-xs font-semibold text-[#1c1b18] block">
              {isFr
                ? "Avez-vous déjà ouvert un CELIAPP avant cette année ?"
                : "Did you already open an FHSA in a prior year?"}
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setHasOpenedPriorYear(true);
                  recordInteraction();
                }}
                className={`py-2 px-3 text-xs font-medium rounded-[2px] border transition-colors cursor-pointer ${
                  hasOpenedPriorYear
                    ? "bg-[#2e4a3b] text-[#f7f3eb] border-[#2e4a3b]"
                    : "bg-white text-[#46423a] border-[#d6cebd] hover:border-[#2e4a3b]"
                }`}
              >
                {isFr ? "Oui (report actif)" : "Yes (carry-forward active)"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setHasOpenedPriorYear(false);
                  recordInteraction();
                }}
                className={`py-2 px-3 text-xs font-medium rounded-[2px] border transition-colors cursor-pointer ${
                  !hasOpenedPriorYear
                    ? "bg-[#2e4a3b] text-[#f7f3eb] border-[#2e4a3b]"
                    : "bg-white text-[#46423a] border-[#d6cebd] hover:border-[#2e4a3b]"
                }`}
              >
                {isFr ? "Non (1re ouverture)" : "No (opening this year)"}
              </button>
            </div>
          </div>

          {hasOpenedPriorYear && (
            <div>
              <div className="flex justify-between text-xs mb-1">
                <label htmlFor="fhsa-carryforward" className="font-semibold text-[#1c1b18]">
                  {isFr ? "Droits inutilisés reportés (max. 8 000 $)" : "Unused room carried from prior year (max $8,000)"}
                </label>
                <span className="tabular-nums font-semibold text-[#2e4a3b]">{formatMoney(effectiveCarryForward)}</span>
              </div>
              <input
                id="fhsa-carryforward"
                type="range"
                min={0}
                max={8000}
                step={500}
                value={priorUnusedRoom}
                onChange={(e) => {
                  setPriorUnusedRoom(Number(e.target.value));
                  recordInteraction();
                }}
                className="w-full accent-[#2e4a3b]"
              />
            </div>
          )}

          <div>
            <div className="flex justify-between text-xs mb-1">
              <label htmlFor="fhsa-contrib" className="font-semibold text-[#1c1b18]">
                {isFr ? "Cotisation prévue cette année" : "Planned FHSA contribution this year"}
              </label>
              <span className="tabular-nums font-semibold text-[#2e4a3b]">{formatMoney(plannedContribution)}</span>
            </div>
            <input
              id="fhsa-contrib"
              type="range"
              min={1000}
              max={16000}
              step={500}
              value={plannedContribution}
              onChange={(e) => {
                setPlannedContribution(Number(e.target.value));
                recordInteraction();
              }}
              className="w-full accent-[#2e4a3b]"
            />
            {excessOverYearLimit > 0 && (
              <p className="mt-1.5 text-[11px] text-[#8a3324] flex items-center gap-1.5 font-medium">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {isFr
                    ? `Attention : dépassement de ${formatMoney(excessOverYearLimit)} par rapport à votre plafond annuel de ${formatMoney(maxAvailableThisYear)} (pénalité de 1 %/mois).`
                    : `Excess warning: ${formatMoney(excessOverYearLimit)} above your ${formatMoney(maxAvailableThisYear)} room triggers a 1%/month CRA excess tax.`}
                </span>
              </p>
            )}
          </div>
        </div>

        {/* Bracket & Stacking Options */}
        <div className="space-y-4">
          <div>
            <label htmlFor="fhsa-bracket" className="block text-xs font-semibold text-[#1c1b18] mb-1.5">
              {isFr ? "Taux marginal d'imposition combiné estimé" : "Illustrative combined marginal tax rate"}
            </label>
            <select
              id="fhsa-bracket"
              value={marginalRate}
              onChange={(e) => {
                setMarginalRate(Number(e.target.value));
                recordInteraction();
              }}
              className="w-full text-xs p-2.5 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] text-[#1c1b18] focus:outline-none focus:border-[#2e4a3b]"
            >
              {MARGINAL_BRACKETS.map((b) => (
                <option key={b.id} value={b.rate}>
                  {isFr ? b.labelFr : b.labelEn}
                </option>
              ))}
            </select>
          </div>

          <div className="p-3.5 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] space-y-2.5 text-xs">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={includeHbpStack}
                onChange={(e) => {
                  setIncludeHbpStack(e.target.checked);
                  recordInteraction();
                }}
                className="accent-[#2e4a3b] w-4 h-4"
              />
              <span className="text-[#1c1b18] font-medium">
                {isFr
                  ? "Cumuler avec le RAP REER (60 000 $ / personne)"
                  : "Stack with RRSP Home Buyers' Plan ($60,000 / buyer)"}
              </span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={withPartner}
                onChange={(e) => {
                  setWithPartner(e.target.checked);
                  recordInteraction();
                }}
                className="accent-[#2e4a3b] w-4 h-4"
              />
              <span className="text-[#1c1b18] font-medium">
                {isFr
                  ? "Achat conjoint à deux premiers acheteurs"
                  : "Buying as a couple (both qualify as first-time buyers)"}
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Results Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 bg-[#f7f3eb] border border-[#d6cebd] rounded-[2px]">
          <span className="text-[11px] uppercase tracking-wider text-[#625d52] font-semibold block">
            {isFr ? "Plafond admissible cette année" : "Available Room This Year"}
          </span>
          <span className="font-serif text-2xl font-bold text-[#1c1b18] mt-1 block">
            {formatMoney(maxAvailableThisYear)}
          </span>
        </div>

        <div className="p-4 bg-[#2e4a3b] text-[#f7f3eb] rounded-[2px]">
          <span className="text-[11px] uppercase tracking-wider text-[#d6c298] font-semibold block">
            {isFr ? "Économie d'impôt estimée" : "Estimated Tax Refund"}
          </span>
          <span className="font-serif text-2xl font-bold text-white mt-1 block">
            {formatMoney(estimatedTaxRefund)}
          </span>
          <span className="text-[11px] text-[#ece6da]/85 block mt-0.5">
            {isFr
              ? `Coût réel net : ${formatMoney(netOutOfPocketCost)}`
              : `Net after-refund cost: ${formatMoney(netOutOfPocketCost)}`}
          </span>
        </div>

        <div className="p-4 bg-[#f7f3eb] border border-[#2e4a3b]/40 rounded-[2px]">
          <span className="text-[11px] uppercase tracking-wider text-[#75581f] font-semibold block">
            {isFr ? "Capital maximal cumulable" : "Max Tax-Free Purchase Pool"}
          </span>
          <span className="font-serif text-2xl font-bold text-[#2e4a3b] mt-1 block">
            {formatMoney(maxHomeCapital)}
          </span>
          <span className="text-[11px] text-[#625d52] block mt-0.5">
            {includeHbpStack
              ? isFr
                ? "CELIAPP + RAP REER (hors rendement)"
                : "FHSA principal + HBP limit"
              : isFr
              ? "Cotisations CELIAPP uniquement"
              : "FHSA contributions alone"}
          </span>
        </div>
      </div>

      <p className="text-[11px] text-[#625d52] flex items-start gap-1.5 leading-relaxed">
        <CheckCircle2 className="w-3.5 h-3.5 text-[#2e4a3b] shrink-0 mt-0.5" />
        <span>
          {isFr
            ? "Estimation éducative uniquement basée sur les plafonds fédéraux 2026 de l'ARC (8 000 $/an, 40 000 $ à vie, report max. 8 000 $, plafond RAP de 60 000 $ et remboursement de TPS pour premier acheteur jusqu'à 50 000 $ sur les constructions neuves). Les cotisations CELIAPP suivent l'année civile du 1er janvier au 31 décembre (sans délai de 60 jours)."
            : "Educational estimate only using published 2026 CRA limits ($8,000 annual / $40,000 lifetime FHSA cap, $8,000 carry-forward cap, and $60,000 RRSP HBP limit). Qualifying new builds up to $1M can also stack the March 2026 First-Time Home Buyers' GST Rebate (up to $50,000). FHSA deposits follow the Jan 1–Dec 31 calendar year with no 60-day extension."}
        </span>
      </p>

      {/* Embedded Low-Friction Lead Magnet */}
      <CalculatorLeadCapture
        calculatorName="FHSA + HBP First-Home Estimator"
        analyticsCalculatorName="fhsa_estimator"
        analyticsTopic="accounts"
        topic="accounts"
        summaryText={leadSummary}
        customSubheading={isFr ? "Aide-Mémoire Gratuit par Courriel" : "Free Email Summary & Opening Checklist"}
        customHeading={
          isFr
            ? "Recevez ce calcul et la liste de vérification CELIAPP + RAP"
            : "Email me this FHSA estimate and First-Home Opening Checklist"
        }
        customButtonLabel={
          isFr
            ? "Envoyer mon estimation et la liste"
            : "Send Me My FHSA Estimate & Checklist"
        }
      />
    </section>
  );
};
