import React, { useState } from "react";
import { Calculator, CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.tsx";
import { CalculatorLeadCapture } from "./CalculatorLeadCapture.tsx";
import { trackCalculatorCompleted, trackCtaClick } from "../lib/track.ts";

const TAX_BRACKETS = [
  { id: "low", rate: 0.20, labelEn: "~20% (Under ~$57k income)", labelFr: "~20 % (Revenu < ~57 k$)" },
  { id: "mid", rate: 0.30, labelEn: "~30% ($57k – $115k income)", labelFr: "~30 % (57 k$ – 115 k$)" },
  { id: "upper", rate: 0.43, labelEn: "~43% ($115k – $180k income)", labelFr: "~43 % (115 k$ – 180 k$)" },
  { id: "top", rate: 0.50, labelEn: "~50% ($180k+ income)", labelFr: "~50 % (Revenu > 180 k$)" },
];

type HorizonGoal = "retirement" | "flexible" | "first-home";
type FutureRate = "lower" | "same" | "higher";

export const TfsaVsRrspQuickWidget: React.FC = () => {
  const { isFr } = useLanguage();
  const prefix = isFr ? "/fr" : "";

  const [currentRate, setCurrentRate] = useState<number>(0.30);
  const [contribution, setContribution] = useState<number>(7000);
  const [goal, setGoal] = useState<HorizonGoal>("retirement");
  const [futureRate, setFutureRate] = useState<FutureRate>("lower");
  const [interacted, setInteracted] = useState<boolean>(false);

  const recordInteraction = () => {
    if (!interacted) {
      setInteracted(true);
      trackCalculatorCompleted("tfsa_vs_rrsp_widget");
    }
  };

  const estimatedRrspRefund = Math.round(contribution * currentRate);
  // Same pre-tax dollars illustration over 20 years at 5% illustrative annual return:
  const growthFactor = Math.pow(1.05, 20);
  const projectedFutureTaxRate =
    futureRate === "lower"
      ? Math.max(0.15, currentRate - 0.10)
      : futureRate === "higher"
      ? Math.min(0.54, currentRate + 0.08)
      : currentRate;

  const rrspAfterTax = Math.round(contribution * growthFactor * (1 - projectedFutureTaxRate));
  const tfsaEquivalentPreTax = Math.round(contribution * (1 - currentRate) * growthFactor);

  const educationalLean =
    goal === "first-home"
      ? {
          titleEn: "Consider FHSA first (up to $8,000/yr), then TFSA vs. RRSP",
          titleFr: "Évaluez le CELIAPP d'abord (8 000 $/an), puis CELI vs REER",
          reasonEn:
            "For an eligible first home, an FHSA pairs an RRSP-style tax deduction with TFSA-style tax-free qualifying withdrawals that never require repayment.",
          reasonFr:
            "Pour une première maison admissible, le CELIAPP combine la déduction du REER et le retrait libre d'impôt sans remboursement du CELI.",
        }
      : goal === "flexible" || futureRate === "higher" || currentRate <= 0.20
      ? {
          titleEn: "TFSA typically fits flexibility & lower-bracket years better",
          titleFr: "Le CELI avantage généralement la flexibilité et les tranches modérées",
          reasonEn:
            "At ~20% tax or when you may need withdrawals before retirement (or expect higher future income/OAS clawback sensitivity), tax-free TFSA withdrawals leave future room and government benefits intact.",
          reasonFr:
            "À ~20 % d'impôt ou en cas de retrait avant la retraite, les retraits du CELI demeurent libres d'impôt, recréent vos droits le 1er janvier suivant et n'affectent pas la SV ou l'ACE.",
        }
      : {
          titleEn: "RRSP shines when today's bracket exceeds retirement withdrawals (especially if refund is reinvested)",
          titleFr: "Le REER excelle si votre taux actuel dépasse celui de la retraite (avec remboursement réinvesti)",
          reasonEn:
            "Deferring tax from a ~30%–50% peak bracket into a lower retirement bracket can boost after-tax wealth—provided you reinvest the tax refund rather than spending it.",
          reasonFr:
            "Reporter l'impôt d'une tranche de 30 % à 50 % vers une tranche plus faible à la retraite augmente le capital net après impôt—à condition de réinvestir votre remboursement d'impôt.",
        };

  const formatMoney = (val: number) =>
    new Intl.NumberFormat(isFr ? "fr-CA" : "en-CA", {
      style: "currency",
      currency: "CAD",
      maximumFractionDigits: 0,
    }).format(val);

  const summaryText = [
    `Annual Contribution Modeled: ${formatMoney(contribution)} (2026 CRA TFSA limit: $7,000; RRSP max: 18% of prior-year income up to $33,810)`,
    `Current Illustrative Marginal Tax Rate: ${Math.round(currentRate * 100)}%`,
    `Primary Goal: ${goal}`,
    `Expected Retirement Tax Rate vs Today: ${futureRate} (~${Math.round(projectedFutureTaxRate * 100)}%)`,
    `Estimated Year-1 RRSP Tax Refund: ${formatMoney(estimatedRrspRefund)}`,
    `Educational Priority Lean: ${educationalLean.titleEn}`,
  ].join("\n");

  return (
    <section
      id="tfsa-rrsp-widget"
      className="bg-white border-2 border-[#2e4a3b]/40 rounded-[2px] p-6 sm:p-7 space-y-6 shadow-xs scroll-mt-28"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#ece6da] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-[#75581f] font-bold">
            <Calculator className="w-3.5 h-3.5" />
            <span>{isFr ? "Vérification Rapide (15 secondes)" : "15-Second Account Priority Check"}</span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl text-[#1c1b18] font-semibold">
            {isFr
              ? "Comparez CELI et REER avec vos chiffres réels"
              : "See how TFSA vs. RRSP compares at your tax bracket"}
          </h2>
        </div>
        <Link
          to={`${prefix}/calculators?tab=tfsa-rrsp#calculator-tool`}
          onClick={() => trackCtaClick("tfsa_rrsp_widget", "open_full_simulator")}
          className="text-xs font-semibold text-[#2e4a3b] hover:underline inline-flex items-center gap-1 shrink-0"
        >
          <span>{isFr ? "Simulateur complet 30 ans" : "Open 30-year compounding tool"}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-4">
          <div>
            <label htmlFor="tr-bracket" className="block text-xs font-semibold text-[#1c1b18] mb-1.5">
              {isFr ? "Taux marginal d'imposition actuel estimé" : "Current illustrative marginal tax rate"}
            </label>
            <select
              id="tr-bracket"
              value={currentRate}
              onChange={(e) => {
                setCurrentRate(Number(e.target.value));
                recordInteraction();
              }}
              className="w-full text-xs p-2.5 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] text-[#1c1b18] focus:outline-none focus:border-[#2e4a3b]"
            >
              {TAX_BRACKETS.map((b) => (
                <option key={b.id} value={b.rate}>
                  {isFr ? b.labelFr : b.labelEn}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <label htmlFor="tr-contrib" className="font-semibold text-[#1c1b18]">
                {isFr ? "Montant brut prévu" : "Amount you are allocating (pre-tax / gross)"}
              </label>
              <span className="font-mono font-semibold text-[#2e4a3b]">{formatMoney(contribution)}</span>
            </div>
            <input
              id="tr-contrib"
              type="range"
              min={1000}
              max={20000}
              step={500}
              value={contribution}
              onChange={(e) => {
                setContribution(Number(e.target.value));
                recordInteraction();
              }}
              className="w-full accent-[#2e4a3b]"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-3.5 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] space-y-2">
            <span className="text-xs font-semibold text-[#1c1b18] block">
              {isFr ? "Objectif principal de cette somme" : "Primary goal for these dollars"}
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {(
                [
                  { id: "retirement", en: "Retirement", fr: "Retraite" },
                  { id: "flexible", en: "Flexible access", fr: "Flexibilité" },
                  { id: "first-home", en: "First home", fr: "1re maison" },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setGoal(opt.id);
                    recordInteraction();
                  }}
                  className={`py-2 px-2 text-[11px] font-medium rounded-[2px] border transition-colors cursor-pointer ${
                    goal === opt.id
                      ? "bg-[#2e4a3b] text-[#f7f3eb] border-[#2e4a3b]"
                      : "bg-white text-[#46423a] border-[#d6cebd] hover:border-[#2e4a3b]"
                  }`}
                >
                  {isFr ? opt.fr : opt.en}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3.5 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] space-y-2">
            <span className="text-xs font-semibold text-[#1c1b18] block">
              {isFr ? "Taux d'impôt prévu au retrait" : "Expected tax rate when withdrawing"}
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {(
                [
                  { id: "lower", en: "Lower later", fr: "Plus bas" },
                  { id: "same", en: "About same", fr: "Identique" },
                  { id: "higher", en: "Higher later", fr: "Plus élevé" },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setFutureRate(opt.id);
                    recordInteraction();
                  }}
                  className={`py-2 px-2 text-[11px] font-medium rounded-[2px] border transition-colors cursor-pointer ${
                    futureRate === opt.id
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

      {/* Outputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 bg-[#f7f3eb] border border-[#d6cebd] rounded-[2px]">
          <span className="text-[11px] uppercase tracking-wider text-[#625d52] font-semibold block">
            {isFr ? "Remboursement REER an 1" : "Est. Year-1 RRSP Refund"}
          </span>
          <span className="font-serif text-2xl font-bold text-[#1c1b18] mt-1 block">
            {formatMoney(estimatedRrspRefund)}
          </span>
          <span className="text-[11px] text-[#625d52] block mt-0.5">
            {isFr ? "À réinvestir pour l'équivalence" : "Must be reinvested to match TFSA"}
          </span>
        </div>

        <div className="p-4 bg-[#2e4a3b] text-[#f7f3eb] rounded-[2px]">
          <span className="text-[11px] uppercase tracking-wider text-[#d6c298] font-semibold block">
            {isFr ? "REER net (20 ans à 5 %)" : "RRSP After-Tax (20 yr @ 5%)"}
          </span>
          <span className="font-serif text-2xl font-bold text-white mt-1 block">
            {formatMoney(rrspAfterTax)}
          </span>
          <span className="text-[11px] text-[#ece6da]/85 block mt-0.5">
            {isFr
              ? `Impôt supposé au retrait : ~${Math.round(projectedFutureTaxRate * 100)} %`
              : `Assumes ~${Math.round(projectedFutureTaxRate * 100)}% withdrawal tax`}
          </span>
        </div>

        <div className="p-4 bg-[#f7f3eb] border border-[#2e4a3b]/40 rounded-[2px]">
          <span className="text-[11px] uppercase tracking-wider text-[#75581f] font-semibold block">
            {isFr ? "CELI équivalent net (20 ans)" : "TFSA Equivalent (20 yr @ 5%)"}
          </span>
          <span className="font-serif text-2xl font-bold text-[#2e4a3b] mt-1 block">
            {formatMoney(tfsaEquivalentPreTax)}
          </span>
          <span className="text-[11px] text-[#625d52] block mt-0.5">
            {isFr ? "0 $ d'impôt au retrait, 0 $ récupération SV" : "$0 tax at withdrawal, no OAS clawback"}
          </span>
        </div>
      </div>

      <div className="p-4 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] space-y-1">
        <span className="text-xs font-semibold text-[#2e4a3b] block">
          {isFr ? educationalLean.titleFr : educationalLean.titleEn}
        </span>
        <p className="text-xs text-[#46423a] leading-relaxed">
          {isFr ? educationalLean.reasonFr : educationalLean.reasonEn}
        </p>
      </div>

      <p className="text-[11px] text-[#625d52] flex items-start gap-1.5 leading-relaxed">
        <CheckCircle2 className="w-3.5 h-3.5 text-[#2e4a3b] shrink-0 mt-0.5" />
        <span>
          {isFr
            ? "Illustration éducative uniquement (plafond CELI 2026 de 7 000 $, plafond REER 2026 jusqu'à 33 810 $ à 18 % du revenu gagné antérieur). Vérifiez vos droits exacts dans Mon dossier ARC."
            : "Educational illustration only (2026 TFSA annual limit $7,000; 2026 RRSP limit 18% of prior-year earned income up to $33,810). Verify your exact contribution room in CRA My Account."}
        </span>
      </p>

      <CalculatorLeadCapture
        calculatorName="TFSA vs RRSP Priority Summary"
        analyticsCalculatorName="tfsa_vs_rrsp_widget"
        analyticsTopic="accounts"
        topic="accounts"
        summaryText={summaryText}
        customSubheading={isFr ? "Synthèse Gratuite par Courriel" : "Free Email Priority Summary"}
        customHeading={
          isFr
            ? "Recevez cette comparaison CELI vs REER et les points à vérifier"
            : "Email me this TFSA vs. RRSP summary & tax checklist"
        }
        customButtonLabel={
          isFr
            ? "Envoyer ma synthèse CELI vs REER"
            : "Send Me My TFSA vs. RRSP Summary"
        }
      />
    </section>
  );
};
