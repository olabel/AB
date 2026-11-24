import React, { useState, useEffect } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { SEO } from "../components/SEO.tsx";
import { useLanguage } from "../context/LanguageContext.tsx";
import { NewcomerPlanningCalculator } from "../components/NewcomerPlanningCalculator.tsx";
import { CalculatorLeadCapture } from "../components/CalculatorLeadCapture.tsx";
import { trackBookingClick, trackCalculatorCompleted } from "../lib/track.ts";
import { siteConfig, getCtaLabel } from "../config/site.ts";
import { getTaxParametersForYear } from "../config/taxParameters.ts";
import {
  Calculator,
  Compass,
  Home,
  PiggyBank,
  Building2,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Scale,
  Calendar,
  Layers,
  HelpCircle,
} from "lucide-react";

export type CalculatorTab = "newcomer" | "mortgage" | "tfsa-rrsp" | "ccpc-passive";

/**
 * Future value of an annuity due: annual contributions made at the START of each year.
 * FV = annual * (1 + rate) * ((1 + rate)^years - 1) / rate
 */
export function futureValue(annual: number, rate: number, years: number): number {
  if (years <= 0 || annual <= 0) return 0;
  if (rate <= 0) return annual * years;
  return annual * (1 + rate) * ((Math.pow(1 + rate, years) - 1) / rate);
}

export const CalculatorsPage: React.FC = () => {
  const { language } = useLanguage();
  const isFr = language === "fr";
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const resolveTab = (): CalculatorTab => {
    const q = searchParams.get("tab")?.toLowerCase();
    const h = location.hash.replace("#", "").toLowerCase();
    const target = q || h;
    if (target === "newcomer" || target === "runway") return "newcomer";
    if (target === "mortgage" || target === "renewal") return "mortgage";
    if (target === "tfsa-rrsp" || target === "growth" || target === "arbitrage") return "tfsa-rrsp";
    if (target === "ccpc-passive" || target === "corporate" || target === "sbd") return "ccpc-passive";
    return "newcomer";
  };

  const [activeTab, setActiveTab] = useState<CalculatorTab>(resolveTab);

  useEffect(() => {
    const tab = resolveTab();
    setActiveTab(tab);
    if (location.hash === "#calculator-tool" || location.hash.includes("calculator")) {
      const el = document.getElementById("calculator-tool");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location.search, location.hash]);

  const formatCurrency = (val: number): string => {
    return new Intl.NumberFormat(isFr ? "fr-CA" : "en-CA", {
      style: "currency",
      currency: "CAD",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatPercent = (val: number): string => {
    return new Intl.NumberFormat(isFr ? "fr-CA" : "en-CA", {
      style: "percent",
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(val);
  };

  // Proof table data computed strictly from futureValue(10000, rate, years) with start-of-year annuity due
  const proofHorizons = [10, 20, 30].map((years) => {
    const cumulative = years * 10000;
    const adv = Math.round(futureValue(10000, 0.07, years));
    const tax = Math.round(futureValue(10000, 0.048, years));
    const diff = adv - tax;
    const pct = diff / tax;
    return {
      years,
      cumulative,
      adv,
      tax,
      diff,
      pct,
    };
  });

  // --------------------------------------------------------------------------
  // Calculator 2: Mortgage Renewal Shock State
  // --------------------------------------------------------------------------
  const [mortgageBalance, setMortgageBalance] = useState<number>(480000);
  const [currentRate, setCurrentRate] = useState<number>(2.49);
  const [renewalRate, setRenewalRate] = useState<number>(4.89);
  const [amortizationYears, setAmortizationYears] = useState<number>(22);
  const [registeredSavings, setRegisteredSavings] = useState<number>(50000);

  // Mortgage calculations
  // Mortgage calculations: Canadian standard semi-annual compounding
  const calcMonthlyPayment = (balance: number, annualRatePct: number, years: number) => {
    if (balance <= 0 || years <= 0) return 0;
    if (annualRatePct <= 0) return balance / (years * 12);
    // Canadian conventional mortgage semi-annual compounding formula:
    const monthlyRate = Math.pow(1 + annualRatePct / 200, 2 / 12) - 1;
    const numPayments = years * 12;
    return (
      (balance * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
      (Math.pow(1 + monthlyRate, numPayments) - 1)
    );
  };

  const oldPayment = Math.round(calcMonthlyPayment(mortgageBalance, currentRate, amortizationYears));
  const newPayment = Math.round(calcMonthlyPayment(mortgageBalance, renewalRate, amortizationYears));
  const monthlyPaymentIncrease = Math.max(0, newPayment - oldPayment);
  const fiveYearIncrease = monthlyPaymentIncrease * 60;

  // Comparison: Option A (Prepay $50k) vs Option B (Keep TFSA compounding at 6.5%)
  const paymentWithPrepay = Math.round(
    calcMonthlyPayment(Math.max(0, mortgageBalance - registeredSavings), renewalRate, amortizationYears)
  );
  const monthlySavingsFromPrepay = Math.max(0, newPayment - paymentWithPrepay);
  const tfsa15YearFutureValue = Math.round(registeredSavings * Math.pow(1 + 0.065, 15));

  // --------------------------------------------------------------------------
  // Calculator 3: TFSA vs RRSP Arbitrage State
  // --------------------------------------------------------------------------
  const [currentIncome, setCurrentIncome] = useState<number>(95000);
  const [retirementIncome, setRetirementIncome] = useState<number>(55000);
  const [annualContribution, setAnnualContribution] = useState<number>(7000);
  const [yearsToRetirement, setYearsToRetirement] = useState<number>(20);
  const assumedReturn = 6.0;

  // Marginal tax estimation (Federal + Average Provincial)
  const estimateTaxRate = (inc: number): number => {
    const b = getTaxParametersForYear().brackets;
    if (inc <= b[0].upTo) return 0.20;
    if (inc <= b[1].upTo) return 0.31;
    if (inc <= b[2].upTo) return 0.43;
    if (inc <= b[3].upTo) return 0.48;
    return 0.53;
  };

  const currentMarginalRate = estimateTaxRate(currentIncome);
  const retirementMarginalRate = estimateTaxRate(retirementIncome);
  const r = assumedReturn / 100;
  const growthFactor = Math.pow(1 + r, yearsToRetirement);
  const annuityFactor = r === 0 ? yearsToRetirement : (growthFactor - 1) / r;

  // TFSA Terminal: Out-of-pocket after-tax cash invested tax-free
  const tfsaTerminal = Math.round(annualContribution * annuityFactor);

  // RRSP Terminal with tax refund reinvestment:
  // Contributing pre-tax amount that equals annualContribution after-tax
  const rrspPreTaxDeposit = annualContribution / Math.max(0.01, 1 - currentMarginalRate);
  const rrspPreTaxTerminal = Math.round(rrspPreTaxDeposit * annuityFactor);
  const rrspAfterTaxTerminal = Math.round(rrspPreTaxTerminal * (1 - retirementMarginalRate));
  const rrspArbitrageDelta = rrspAfterTaxTerminal - tfsaTerminal;

  // --------------------------------------------------------------------------
  // Calculator 4: CCPC Passive Income & SBD Grind State
  // --------------------------------------------------------------------------
  const [activeBusinessIncome, setActiveBusinessIncome] = useState<number>(450000);
  const [passiveInvestmentIncome, setPassiveInvestmentIncome] = useState<number>(85000);

  // Subsection 125(5.1) 5:1 grind above $50k AAII
  const aaiiExcess = Math.max(0, passiveInvestmentIncome - 50000);
  const sbdGrindAmount = Math.min(500000, aaiiExcess * 5);
  const remainingSbdLimit = Math.max(0, 500000 - sbdGrindAmount);

  // Tax rates (e.g. Ontario: Small Business 12.2%, General Corporate 26.5%)
  const eligibleAbi = Math.min(activeBusinessIncome, remainingSbdLimit);
  const regularTaxedAbi = Math.max(0, activeBusinessIncome - eligibleAbi);
  // Baseline without passive drag: eligible up to full 500k limit
  const standardEligible = Math.min(activeBusinessIncome, 500000);
  const standardIneligible = Math.max(0, activeBusinessIncome - 500000);
  const standardTax = standardEligible * 0.122 + standardIneligible * 0.265;
  const actualTax = eligibleAbi * 0.122 + regularTaxedAbi * 0.265;
  const extraCorporateTaxOwing = Math.round(Math.max(0, actualTax - standardTax));

  return (
    <div>
      <SEO
        title={
          isFr
            ? "Simulateurs Financiers Canadiens | Ahmed Bello"
            : "Canadian Financial Planning Calculators | Ahmed Bello"
        }
        description={
          isFr
            ? "Comparez CELI, REER et CELIAPP, calculez votre coussin d'arrivée, simulez votre hypothèque et évaluez la DPE en temps réel."
            : "Compare TFSA vs. RRSP vs. FHSA growth, newcomer financial runway, mortgage renewals, and CCPC passive income in real time."
        }
        canonicalUrl={isFr ? "/fr/calculators" : "/calculators"}
      />

      {/* 1. Header */}
      <section className="section border-b border-[#d6cebd]">
        <div className="wrap max-w-5xl space-y-5">
          <span className="eyebrow block">
            {isFr ? "Outils de modélisation financière" : "Planning Calculators"}
          </span>

          <h1 className="h1 text-[#1c1b18]">
            {isFr
              ? "Modélisez vos décisions financières avec rigueur."
              : "Stress-test your financial choices before taking action."}
          </h1>

          <p className="lede measure">
            {isFr
              ? "Basé sur les chiffres publiés par l'ARC (plafonds 2026 et indexation 2027). Estimations à des fins éducatives seulement."
              : "Based on published CRA figures (2026 ceilings and confirmed 2027 indexation). Estimates for education only."}
          </p>

          {/* Calculator Selector Tabs */}
          <div id="calculator-tool" className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5 scroll-mt-24">
            <button
              type="button"
              onClick={() => {
                setActiveTab("newcomer");
                trackCalculatorCompleted("newcomer");
              }}
              className={`p-3.5 text-left rounded-[2px] border transition-all flex flex-col justify-between cursor-pointer ${
                activeTab === "newcomer"
                  ? "bg-[#2e4a3b] text-[#f7f3eb] border-[#2e4a3b] shadow-xs"
                  : "bg-[#fcfaf5] text-[#1c1b18] border-[#d6cebd] hover:border-[#2e4a3b]"
              }`}
            >
              <Compass className={`w-4 h-4 mb-2 ${activeTab === "newcomer" ? "text-[#d6c298]" : "text-[#75581f]"}`} />
              <div>
                <span className="text-xs font-bold block leading-snug">
                  {isFr ? "Nouveaux arrivants" : "Newcomer Runway"}
                </span>
                <span className={`text-[0.68rem] block ${activeTab === "newcomer" ? "text-[#ece6da]/80" : "text-[#625d52]"}`}>
                  {isFr ? "Trésorerie 1re année" : "Settlement reserves"}
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("mortgage");
                trackCalculatorCompleted("mortgage");
              }}
              className={`p-3.5 text-left rounded-[2px] border transition-all flex flex-col justify-between cursor-pointer ${
                activeTab === "mortgage"
                  ? "bg-[#2e4a3b] text-[#f7f3eb] border-[#2e4a3b] shadow-xs"
                  : "bg-[#fcfaf5] text-[#1c1b18] border-[#d6cebd] hover:border-[#2e4a3b]"
              }`}
            >
              <Home className={`w-4 h-4 mb-2 ${activeTab === "mortgage" ? "text-[#d6c298]" : "text-[#75581f]"}`} />
              <div>
                <span className="text-xs font-bold block leading-snug">
                  {isFr ? "Choc Hypothécaire" : "Mortgage Renewal"}
                </span>
                <span className={`text-[0.68rem] block ${activeTab === "mortgage" ? "text-[#ece6da]/80" : "text-[#625d52]"}`}>
                  {isFr ? "Impact sur mensualités" : "Payment shock analyzer"}
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("tfsa-rrsp");
                trackCalculatorCompleted("tfsa-rrsp");
              }}
              className={`p-3.5 text-left rounded-[2px] border transition-all flex flex-col justify-between cursor-pointer ${
                activeTab === "tfsa-rrsp"
                  ? "bg-[#2e4a3b] text-[#f7f3eb] border-[#2e4a3b] shadow-xs"
                  : "bg-[#fcfaf5] text-[#1c1b18] border-[#d6cebd] hover:border-[#2e4a3b]"
              }`}
            >
              <PiggyBank className={`w-4 h-4 mb-2 ${activeTab === "tfsa-rrsp" ? "text-[#d6c298]" : "text-[#75581f]"}`} />
              <div>
                <span className="text-xs font-bold block leading-snug">
                  {isFr ? "CELI vs REER" : "TFSA vs RRSP"}
                </span>
                <span className={`text-[0.68rem] block ${activeTab === "tfsa-rrsp" ? "text-[#ece6da]/80" : "text-[#625d52]"}`}>
                  {isFr ? "Écart de taux marginal" : "Tax bracket spread"}
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("ccpc-passive");
                trackCalculatorCompleted("ccpc-passive");
              }}
              className={`p-3.5 text-left rounded-[2px] border transition-all flex flex-col justify-between cursor-pointer ${
                activeTab === "ccpc-passive"
                  ? "bg-[#2e4a3b] text-[#f7f3eb] border-[#2e4a3b] shadow-xs"
                  : "bg-[#fcfaf5] text-[#1c1b18] border-[#d6cebd] hover:border-[#2e4a3b]"
              }`}
            >
              <Building2 className={`w-4 h-4 mb-2 ${activeTab === "ccpc-passive" ? "text-[#d6c298]" : "text-[#75581f]"}`} />
              <div>
                <span className="text-xs font-bold block leading-snug">
                  {isFr ? "SPCC : Plafond 50k$" : "CCPC Passive Grind"}
                </span>
                <span className={`text-[0.68rem] block ${activeTab === "ccpc-passive" ? "text-[#ece6da]/80" : "text-[#625d52]"}`}>
                  {isFr ? "Plafond DPE (Art. 125)" : "SBD 5:1 clawback"}
                </span>
              </div>
            </button>
          </div>

          {/* Dedicated AMT Calculator Card */}
          <div className="mt-5 card-editorial p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <span className="eyebrow block text-[#75581f]">
                {isFr ? "Calculateur fédéral dédié" : "Standalone Tax Estimator"}
              </span>
              <h2 className="h3 text-[#1c1b18]">
                {isFr
                  ? "Simulateur d'Impôt Minimum de Remplacement (IMR)"
                  : "Alternative Minimum Tax (AMT) Calculator Canada"}
              </h2>
              <p className="small text-[#46423a] max-w-2xl">
                {isFr
                  ? "Estimez si l'impôt minimum de remplacement fédéral s'applique à vos gains en capital, dividendes ou dons importants selon les chiffres publiés pour 2026."
                  : "Estimate whether federal Alternative Minimum Tax applies to your capital gains, dividends, or major charitable gifts using published 2026 CRA figures."}
              </p>
            </div>

            <Link
              to={isFr ? "/fr/calculators/amt" : "/calculators/amt"}
              className="btn btn-primary text-sm inline-flex items-center gap-2 whitespace-nowrap shrink-0"
            >
              <Scale className="w-4 h-4 text-[#d6c298]" aria-hidden="true" />
              <span>{isFr ? "Ouvrir le simulateur IMR" : "Open AMT Calculator"}</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Main Interactive Calculator Workspace */}
      <section className="section">
        <div className="wrap max-w-5xl">
          {/* TAB 1: NEWCOMER RUNWAY CALCULATOR */}
          {activeTab === "newcomer" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#ece6da] pb-3">
                <div>
                  <h2 className="font-serif text-2xl text-[#1c1b18]">
                    {isFr ? "Simulateur de Trésorerie pour Nouveaux Arrivants" : "Newcomer First-Year Financial Runway Simulator"}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#625d52]">
                    {isFr
                      ? "Calculez le capital de sécurité nécessaire pendant la reconnaissance de vos diplômes et vos premiers mois au Canada."
                      : "Model the exact emergency capital required to bridge foreign credential verification and settlement in Canada."}
                  </p>
                </div>
              </div>
              <NewcomerPlanningCalculator />
            </div>
          )}

          {/* TAB 2: MORTGAGE RENEWAL SHOCK ANALYZER */}
          {activeTab === "mortgage" && (
            <div className="space-y-6">
              <div className="border-b border-[#ece6da] pb-3">
                <span className="text-[0.68rem] uppercase tracking-wider text-[#75581f] font-bold block">
                  {isFr ? "Analyseur de Trésorerie Immobilière" : "Household Debt Service Model"}
                </span>
                <h2 className="font-serif text-2xl text-[#1c1b18]">
                  {isFr ? "Analyseur du Choc de Renouvellement Hypothécaire" : "Mortgage Renewal Shock & Balance-Sheet Analyzer"}
                </h2>
                <p className="text-xs sm:text-sm text-[#625d52]">
                  {isFr
                    ? "Mesurez l'augmentation de vos mensualités et évaluez pourquoi liquider votre CELI pour rembourser du capital est souvent un piège."
                    : "Quantify your payment increase and evaluate the opportunity cost of raiding liquid registered accounts to prepay mortgage principal."}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Inputs */}
                <div className="lg:col-span-7 bg-[#fcfaf5] border border-[#d6cebd] p-6 sm:p-7 rounded-[2px] space-y-5">
                  <h3 className="font-serif text-lg text-[#1c1b18] font-semibold border-b border-[#ece6da] pb-2">
                    {isFr ? "Paramètres du Prêt" : "Loan & Reserve Parameters"}
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-medium text-[#1c1b18] mb-1.5">
                        <span>{isFr ? "Solde hypothécaire actuel" : "Current Mortgage Balance"}</span>
                        <span className="tabular-nums text-[#2e4a3b] font-bold">{formatCurrency(mortgageBalance)}</span>
                      </div>
                      <input
                        type="range"
                        min={150000}
                        max={1200000}
                        step={10000}
                        value={mortgageBalance}
                        onChange={(e) => setMortgageBalance(Number(e.target.value))}
                        className="w-full accent-[#2e4a3b]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between text-xs font-medium text-[#1c1b18] mb-1.5">
                          <span>{isFr ? "Taux actuel" : "Current Rate"}</span>
                          <span className="tabular-nums text-[#2e4a3b] font-bold">{currentRate}%</span>
                        </div>
                        <input
                          type="range"
                          min={1.5}
                          max={4.5}
                          step={0.1}
                          value={currentRate}
                          onChange={(e) => setCurrentRate(Number(e.target.value))}
                          className="w-full accent-[#2e4a3b]"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-medium text-[#1c1b18] mb-1.5">
                          <span>{isFr ? "Taux de renouvellement" : "Renewal Rate"}</span>
                          <span className="tabular-nums text-[#8a3324] font-bold">{renewalRate}%</span>
                        </div>
                        <input
                          type="range"
                          min={3.5}
                          max={7.5}
                          step={0.1}
                          value={renewalRate}
                          onChange={(e) => setRenewalRate(Number(e.target.value))}
                          className="w-full accent-[#8a3324]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between text-xs font-medium text-[#1c1b18] mb-1.5">
                          <span>{isFr ? "Amortissement restant" : "Remaining Amortization"}</span>
                          <span className="tabular-nums text-[#1c1b18] font-bold">{amortizationYears} {isFr ? "ans" : "yrs"}</span>
                        </div>
                        <input
                          type="range"
                          min={10}
                          max={30}
                          step={1}
                          value={amortizationYears}
                          onChange={(e) => setAmortizationYears(Number(e.target.value))}
                          className="w-full accent-[#2e4a3b]"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-medium text-[#1c1b18] mb-1.5">
                          <span>{isFr ? "Épargne CELI disponible" : "Liquid TFSA Reserves"}</span>
                          <span className="tabular-nums text-[#75581f] font-bold">{formatCurrency(registeredSavings)}</span>
                        </div>
                        <input
                          type="range"
                          min={10000}
                          max={150000}
                          step={5000}
                          value={registeredSavings}
                          onChange={(e) => setRegisteredSavings(Number(e.target.value))}
                          className="w-full accent-[#75581f]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Outputs & Comparative Assessment */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="bg-[#14211a] text-[#f7f3eb] p-6 rounded-[2px] space-y-4 border border-[#2e4a3b]">
                    <span className="text-[0.68rem] uppercase tracking-wider text-[#d6c298] font-semibold block">
                      {isFr ? "Impact Mensuel au Renouvellement" : "Renewal Monthly Impact"}
                    </span>

                    <div className="grid grid-cols-2 gap-3 border-b border-[#2e4a3b] pb-4">
                      <div>
                        <span className="text-[0.7rem] text-[#ece6da]/70 block">{isFr ? "Paiement actuel" : "Current Payment"}</span>
                        <span className="text-lg tabular-nums font-bold">
                          {formatCurrency(oldPayment)} {isFr ? "/ mois" : "/ mo"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[0.7rem] text-[#d6c298] block">{isFr ? "Nouveau paiement" : "New Payment"}</span>
                        <span className="text-xl tabular-nums font-bold text-white">
                          {formatCurrency(newPayment)} {isFr ? "/ mois" : "/ mo"}
                        </span>
                      </div>
                    </div>

                    <div className="p-3.5 bg-[#8a3324]/20 border border-[#8a3324]/40 rounded-[2px] flex items-center justify-between">
                      <span className="text-xs text-[#ece6da]">
                        {isFr ? "Choc mensuel net :" : "Monthly Payment Shock:"}
                      </span>
                      <span className="tabular-nums text-base font-bold text-[#f7f3eb]">
                        +{formatCurrency(monthlyPaymentIncrease)} {isFr ? "/ mois" : "/ mo"}
                      </span>
                    </div>

                    <div className="text-xs text-[#ece6da]/80 leading-relaxed pt-1">
                      {isFr
                        ? `Ce saut de taux représentera +${formatCurrency(fiveYearIncrease)} d'intérêts et de mensualités supplémentaires sur le prochain terme de 5 ans.`
                        : `Over the next 5-year term, this rate step-up demands an extra ${formatCurrency(fiveYearIncrease)} in household cash flow.`}
                    </div>
                  </div>

                  {/* Comparative Strategy Callout */}
                  <div className="p-5 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] space-y-3 text-xs">
                    <span className="font-serif text-sm font-semibold text-[#1c1b18] block">
                      {isFr ? "Dilemme : Vider son CELI pour rembourser ?" : "The TFSA Liquidation Trade-off"}
                    </span>
                    <p className="text-[#46423a] leading-relaxed">
                      {isFr
                        ? `Rembourser ${formatCurrency(registeredSavings)} réduirait votre mensualité de ~${formatCurrency(monthlySavingsFromPrepay)} / mois. Cependant, ce même capital composé à 6,5 % dans votre CELI atteindrait ~${formatCurrency(tfsa15YearFutureValue)} nets d'impôt dans 15 ans.`
                        : `Prepaying ${formatCurrency(registeredSavings)} reduces your mortgage service by ~${formatCurrency(monthlySavingsFromPrepay)}/mo. However, leaving that capital compounded at 6.5% tax-free grows to ~${formatCurrency(tfsa15YearFutureValue)} in 15 years.`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Lead Capture */}
              <CalculatorLeadCapture
                calculatorName="Mortgage Renewal Shock Analyzer"
                summaryText={`Current Mortgage Balance: $${mortgageBalance.toLocaleString()}
Current Rate: ${currentRate}% vs Renewal Rate: ${renewalRate}%
Current Monthly Payment: $${oldPayment}/mo
New Monthly Payment: $${newPayment}/mo
Net Monthly Increase: +$${monthlyPaymentIncrease}/mo (+$${fiveYearIncrease.toLocaleString()} over 5 years)
TFSA Prepayment Dilemma: $${registeredSavings.toLocaleString()} would save ~$${monthlySavingsFromPrepay}/mo in service, but costs ~$${tfsa15YearFutureValue.toLocaleString()} in tax-free 15-year compounding.`}
              />
            </div>
          )}

          {/* TAB 3: TFSA VS RRSP COMPARISON CALCULATOR */}
          {activeTab === "tfsa-rrsp" && (
            <div className="space-y-6">
              <div className="border-b border-[#ece6da] pb-3">
                <span className="text-[0.68rem] uppercase tracking-wider text-[#75581f] font-bold block">
                  {isFr ? "Optimisation Fiscale des Régimes Enregistrés" : "Registered Tax Shelter Optimizer"}
                </span>
                <h2 className="font-serif text-2xl text-[#1c1b18]">
                  {isFr ? "Comparateur d'Impôt CELI vs REER" : "TFSA vs. RRSP Tax Bracket Comparison Calculator"}
                </h2>
                <p className="text-xs sm:text-sm text-[#625d52]">
                  {isFr
                    ? "Évaluez quel compte rapporte le plus selon l'écart entre votre taux d'imposition marginal actuel et celui à la retraite."
                    : "Model the exact after-tax terminal wealth created by current vs retirement marginal tax brackets and refund reinvestment."}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-7 bg-[#fcfaf5] border border-[#d6cebd] p-6 sm:p-7 rounded-[2px] space-y-5">
                  <h3 className="font-serif text-lg text-[#1c1b18] font-semibold border-b border-[#ece6da] pb-2">
                    {isFr ? "Hypothèses de Revenu & Taux" : "Tax & Contribution Inputs"}
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-medium text-[#1c1b18] mb-1.5">
                        <span>{isFr ? "Revenu annuel brut actuel" : "Current Annual Gross Income"}</span>
                        <span className="tabular-nums text-[#2e4a3b] font-bold">{formatCurrency(currentIncome)}</span>
                      </div>
                      <input
                        type="range"
                        min={45000}
                        max={260000}
                        step={5000}
                        value={currentIncome}
                        onChange={(e) => setCurrentIncome(Number(e.target.value))}
                        className="w-full accent-[#2e4a3b]"
                      />
                      <span className="text-[0.68rem] text-[#625d52]">
                        {isFr ? "Taux marginal estimé : " : "Estimated Current Marginal Rate: "}
                        <strong className="text-[#2e4a3b]">{(currentMarginalRate * 100).toFixed(0)}%</strong>
                      </span>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-medium text-[#1c1b18] mb-1.5">
                        <span>{isFr ? "Revenu annuel prévu à la retraite" : "Estimated Annual Retirement Income"}</span>
                        <span className="tabular-nums text-[#75581f] font-bold">{formatCurrency(retirementIncome)}</span>
                      </div>
                      <input
                        type="range"
                        min={25000}
                        max={160000}
                        step={5000}
                        value={retirementIncome}
                        onChange={(e) => setRetirementIncome(Number(e.target.value))}
                        className="w-full accent-[#75581f]"
                      />
                      <span className="text-[0.68rem] text-[#625d52]">
                        {isFr ? "Taux marginal à la retraite : " : "Estimated Retirement Marginal Rate: "}
                        <strong className="text-[#75581f]">{(retirementMarginalRate * 100).toFixed(0)}%</strong>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between text-xs font-medium text-[#1c1b18] mb-1.5">
                          <span>{isFr ? "Cotisation annuelle (REER : 33 810 $ en 2026 / 35 390 $ en 2027)" : "Annual Contribution (RRSP cap: $33,810 '26 / $35,390 '27)"}</span>
                          <span className="tabular-nums text-[#1c1b18] font-bold">{formatCurrency(annualContribution)}</span>
                        </div>
                        <input
                          type="range"
                          min={2000}
                          max={35390}
                          step={500}
                          value={annualContribution}
                          onChange={(e) => setAnnualContribution(Number(e.target.value))}
                          className="w-full accent-[#2e4a3b]"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-medium text-[#1c1b18] mb-1.5">
                          <span>{isFr ? "Horizon (années)" : "Horizon (Years)"}</span>
                          <span className="tabular-nums text-[#1c1b18] font-bold">{yearsToRetirement} {isFr ? "ans" : "yrs"}</span>
                        </div>
                        <input
                          type="range"
                          min={5}
                          max={35}
                          step={1}
                          value={yearsToRetirement}
                          onChange={(e) => setYearsToRetirement(Number(e.target.value))}
                          className="w-full accent-[#2e4a3b]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Outputs */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="bg-[#14211a] text-[#f7f3eb] p-6 rounded-[2px] space-y-4 border border-[#2e4a3b]">
                    <span className="text-[0.68rem] uppercase tracking-wider text-[#d6c298] font-semibold block">
                      {isFr ? "Résultat Après Impôt au Terme" : "After-Tax Terminal Comparison"}
                    </span>

                    <div className="space-y-3 border-b border-[#2e4a3b] pb-4">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-[#ece6da]/70">{isFr ? "Valeur nette CELI (100 % libre d'impôt)" : "TFSA Terminal (100% Tax-Free):"}</span>
                        <span className="tabular-nums font-bold text-white text-base">{formatCurrency(tfsaTerminal)}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-[#ece6da]/70">{isFr ? "Valeur nette REER (remboursement réinvesti)" : "RRSP Terminal (Net of Taxes):"}</span>
                        <span className="tabular-nums font-bold text-[#d6c298] text-base">{formatCurrency(rrspAfterTaxTerminal)}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-[#2e4a3b]/40 border border-[#d6c298]/30 rounded-[2px]">
                      <span className="text-[0.68rem] uppercase tracking-wider text-[#d6c298] block">
                        {rrspArbitrageDelta >= 0
                          ? isFr ? "Avantage REER" : "RRSP Advantage"
                          : isFr ? "Avantage CELI" : "TFSA Advantage"}
                      </span>
                      <span className="text-lg tabular-nums font-bold text-white">
                        {rrspArbitrageDelta >= 0
                          ? `+${formatCurrency(rrspArbitrageDelta)} ${isFr ? "net" : "Net"}`
                          : `+${formatCurrency(Math.abs(rrspArbitrageDelta))} ${isFr ? "net" : "Net"}`}
                      </span>
                      <p className="text-[0.7rem] text-[#ece6da]/80 mt-1">
                        {currentMarginalRate > retirementMarginalRate
                          ? isFr
                            ? "Le REER procure un avantage fiscal net car votre taux marginal actuel dépasse celui prévu à la retraite."
                            : "The RRSP creates a tax-rate advantage because your current marginal tax bracket exceeds your expected retirement bracket."
                          : isFr
                            ? "Le CELI est supérieur ou équivalent, et offre une liquidité totale sans risque de récupération de la SV (OAS)."
                            : "The TFSA matches or exceeds the RRSP, providing full liquidity without triggering OAS clawbacks."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <CalculatorLeadCapture
                calculatorName="TFSA vs RRSP Comparison Calculator"
                summaryText={`Current Income: $${currentIncome.toLocaleString()} (${(currentMarginalRate * 100).toFixed(0)}% marginal rate)
Retirement Income: $${retirementIncome.toLocaleString()} (${(retirementMarginalRate * 100).toFixed(0)}% marginal rate)
Annual Contribution: $${annualContribution.toLocaleString()} over ${yearsToRetirement} years at ${assumedReturn}% return
TFSA Terminal Value: $${tfsaTerminal.toLocaleString()} (100% tax-free)
RRSP Terminal Value (Net of Taxes): $${rrspAfterTaxTerminal.toLocaleString()}
Net Tax Advantage: $${Math.abs(rrspArbitrageDelta).toLocaleString()} in favor of ${rrspArbitrageDelta >= 0 ? "RRSP" : "TFSA"}`}
              />
            </div>
          )}

          {/* TAB 4: CCPC PASSIVE INCOME & SBD GRIND CALCULATOR */}
          {activeTab === "ccpc-passive" && (
            <div className="space-y-6">
              <div className="border-b border-[#ece6da] pb-3">
                <span className="text-[0.68rem] uppercase tracking-wider text-[#75581f] font-bold block">
                  {isFr ? "Fiscalité Corporative & SPCC" : "Corporate Treasury & SBD Preservation"}
                </span>
                <h2 className="font-serif text-2xl text-[#1c1b18]">
                  {isFr ? "Calculateur du Plafond de Revenus Passifs (50 000 $)" : "CCPC $50,000 Passive Income Limit & SBD Grind Calculator"}
                </h2>
                <p className="text-xs sm:text-sm text-[#625d52]">
                  {isFr
                    ? "Mesurez l'érosion de votre déduction pour petite entreprise sous le paragraphe 125(5.1) et l'impôt supplémentaire exigé sur vos bénéfices d'exploitation."
                    : "Calculate the exact 5:1 clawback of your Small Business Deduction and operating corporate tax surcharges under Subsection 125(5.1)."}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-7 bg-[#fcfaf5] border border-[#d6cebd] p-6 sm:p-7 rounded-[2px] space-y-5">
                  <h3 className="font-serif text-lg text-[#1c1b18] font-semibold border-b border-[#ece6da] pb-2">
                    {isFr ? "Bénéfices d'Exploitation & Placements" : "Corporate Income Inputs"}
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-medium text-[#1c1b18] mb-1.5">
                        <span>{isFr ? "Revenu d'entreprise exploitée activement (BPA)" : "Active Business Income (ABI)"}</span>
                        <span className="tabular-nums text-[#2e4a3b] font-bold">{formatCurrency(activeBusinessIncome)}</span>
                      </div>
                      <input
                        type="range"
                        min={100000}
                        max={600000}
                        step={10000}
                        value={activeBusinessIncome}
                        onChange={(e) => setActiveBusinessIncome(Number(e.target.value))}
                        className="w-full accent-[#2e4a3b]"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-medium text-[#1c1b18] mb-1.5">
                        <span>{isFr ? "Revenu passif de placement annuel (RPAA)" : "Adjusted Aggregate Investment Income (AAII)"}</span>
                        <span className="tabular-nums text-[#8a3324] font-bold">{formatCurrency(passiveInvestmentIncome)}</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={180000}
                        step={2500}
                        value={passiveInvestmentIncome}
                        onChange={(e) => setPassiveInvestmentIncome(Number(e.target.value))}
                        className="w-full accent-[#8a3324]"
                      />
                      <span className="text-[0.68rem] text-[#625d52]">
                        {passiveInvestmentIncome > 50000 ? (
                          <span className="text-[#8a3324] font-semibold">
                            {isFr
                              ? `Dépasse le seuil légal de 50 000 $ de ${formatCurrency(passiveInvestmentIncome - 50000)}. Réduction 5:1 déclenchée.`
                              : `Exceeds $50,000 statutory threshold by ${formatCurrency(passiveInvestmentIncome - 50000)}. 5:1 clawback active.`}
                          </span>
                        ) : (
                          <span className="text-[#2e4a3b] font-semibold">
                            {isFr
                              ? "Inférieur au seuil de 50 000 $. Plein plafond DPE de 500 000 $ préservé."
                              : "Below $50,000 threshold. Full $500,000 SBD limit preserved."}
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Outputs */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="bg-[#14211a] text-[#f7f3eb] p-6 rounded-[2px] space-y-4 border border-[#2e4a3b]">
                    <span className="text-[0.68rem] uppercase tracking-wider text-[#d6c298] font-semibold block">
                      {isFr ? "Conséquences Fiscales Corporatives" : "Corporate Tax Penalty"}
                    </span>

                    <div className="space-y-2 border-b border-[#2e4a3b] pb-4 text-xs">
                      <div className="flex justify-between">
                        <span className="text-[#ece6da]/70">{isFr ? "Érosion du plafond DPE (5:1) :" : "SBD Limit Slashed (5:1):"}</span>
                        <span className="tabular-nums font-bold text-[#d97768]">-{formatCurrency(sbdGrindAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#ece6da]/70">{isFr ? "Plafond restant à 12,2 % :" : "Remaining Limit at 12.2%:"}</span>
                        <span className="tabular-nums font-bold text-white">{formatCurrency(remainingSbdLimit)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#ece6da]/70">{isFr ? "Bénéfice poussé à 26,5 % :" : "Operating Income Pushed to 26.5%:"}</span>
                        <span className="tabular-nums font-bold text-[#d6c298]">{formatCurrency(regularTaxedAbi)}</span>
                      </div>
                    </div>

                    <div className="p-3.5 bg-[#8a3324]/20 border border-[#8a3324]/40 rounded-[2px] flex items-center justify-between">
                      <span className="text-xs text-[#ece6da]">
                        {isFr ? "Impôt corporatif supplémentaire :" : "Extra Corporate Tax Owed:"}
                      </span>
                      <span className="tabular-nums text-base font-bold text-white">
                        +{formatCurrency(extraCorporateTaxOwing)} {isFr ? "/ an" : "/ yr"}
                      </span>
                    </div>

                    <p className="text-[0.7rem] text-[#ece6da]/80 leading-relaxed">
                      {isFr
                        ? "Des solutions de trésorerie comme l'assurance vie exonérée détenue par la société ou un Régime de pension individuel (RPI) permettent d'abriter ces surplus sans générer de RPAA."
                        : "Treasury frameworks like corporate-owned life insurance or Individual Pension Plans (IPPs) shelter surplus retained capital from AAII calculations, preserving your low small business rate."}
                    </p>
                  </div>
                </div>
              </div>

              <CalculatorLeadCapture
                calculatorName="CCPC Passive Income SBD Grind Calculator"
                summaryText={`Active Business Income (ABI): $${activeBusinessIncome.toLocaleString()}
Annual Passive Investment Income (AAII): $${passiveInvestmentIncome.toLocaleString()}
SBD Business Limit Reduction (5:1 Formula): -$${sbdGrindAmount.toLocaleString()}
Remaining Small Business Limit: $${remainingSbdLimit.toLocaleString()}
Income Pushed to General Rate (26.5%): $${regularTaxedAbi.toLocaleString()}
Extra Annual Corporate Tax Due to Passive Drag: +$${extraCorporateTaxOwing.toLocaleString()}/year`}
              />
            </div>
          )}
        </div>
      </section>

      {/* Long-Tail SEO Educational Guide: Tax-Advantaged vs Taxable Compound Growth */}
      <section className="section bg-[#fcfaf5] border-t border-[#d6cebd]">
        <div className="wrap max-w-5xl space-y-8">
          <div className="max-w-3xl space-y-3">
            <span className="eyebrow block text-[#75581f]">
              {isFr ? "Guide quantitatif & modélisation fiscale" : "Quantitative Analysis & Tax Drag"}
            </span>
            <h2 className="h2 text-[#1c1b18]">
              {isFr
                ? "Comparaison de la croissance composée à l'abri de l'impôt vs compte imposable au Canada"
                : "Tax-Advantaged vs Taxable Compound Growth Comparison in Canada"}
            </h2>
            <p className="small sm:text-base text-[#46423a] leading-relaxed">
              {isFr
                ? "Au Canada, le frottement fiscal annuel constitue un frein majeur à l'accumulation à long terme. Chaque dollar d'intérêt, de dividende étranger ou de gain en capital réalisé dans un compte non enregistré subit une imposition immédiate qui ralentit les intérêts composés."
                : "In Canadian financial planning, annual tax drag slows long-term wealth accumulation. In a non-registered (taxable) account, interest is taxed at your marginal rate, foreign dividends lose withholding tax, and realized capital gains trigger ongoing taxable events."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-editorial p-5 space-y-2">
              <span className="text-xs uppercase tracking-wider text-[#2e4a3b] font-semibold block">
                {isFr ? "CELI & CELIAPP (0 % d'impôt)" : "TFSA & FHSA (0% Tax Drag)"}
              </span>
              <h3 className="font-serif text-lg text-[#1c1b18]">
                {isFr ? "Croissance sans impôt annuel" : "Pure Tax-Free Compounding"}
              </h3>
              <p className="small text-[#46423a]">
                {isFr
                  ? "Les rendements fructifient sans frottement fiscal. Les retraits sont non imposables et n'affectent pas les prestations gouvernementales (SV, SRG, ACE)."
                  : "Capital gains, dividends, and interest compound without annual tax drag, and withdrawals do not trigger OAS or CCB clawbacks."}
              </p>
            </div>

            <div className="card-editorial p-5 space-y-2">
              <span className="text-xs uppercase tracking-wider text-[#75581f] font-semibold block">
                {isFr ? "REER (Report d'impôt)" : "RRSP (Pre-Tax Deferral)"}
              </span>
              <h3 className="font-serif text-lg text-[#1c1b18]">
                {isFr ? "Report d'impôt" : "Pre-Tax Compounding Power"}
              </h3>
              <p className="small text-[#46423a]">
                {isFr
                  ? "La déduction fiscale génère un remboursement immédiat qui, réinvesti, compense l'impôt futur au retrait à la retraite."
                  : "Upfront deductions generate a refund that offsets future tax at withdrawal when reinvested consistently."}
              </p>
            </div>

            <div className="card-editorial p-5 space-y-2">
              <span className="text-xs uppercase tracking-wider text-[#625d52] font-semibold block">
                {isFr ? "Compte imposable" : "Taxable Non-Registered"}
              </span>
              <h3 className="font-serif text-lg text-[#1c1b18]">
                {isFr ? "Frottement fiscal annuel" : "Annual Tax Drag"}
              </h3>
              <p className="small text-[#46423a]">
                {isFr
                  ? "L'impôt annuel sur les revenus et rééquilibrages réduit le rendement effectif net de 1,5 % à 2,8 % par an sur de longs horizons."
                  : "Annual tax on interest, distributions, and rebalancing reduces net annual compounding by 1.5% to 2.8% over long horizons."}
              </p>
            </div>
          </div>

          {/* Mathematical Proof Table */}
          <div className="overflow-x-auto border border-[#d6cebd] rounded-[2px] bg-[#fcfaf5]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#14211a] text-[#f7f3eb]">
                  <th className="p-3.5 font-semibold">{isFr ? "Horizon" : "Horizon"}</th>
                  <th className="p-3.5 font-semibold">{isFr ? "Cotisation cumulée (10 000 $/an)" : "Cumulative Principal ($10k/yr)"}</th>
                  <th className="p-3.5 font-semibold text-[#d6c298]">{isFr ? "Compte enregistré (7,0 %)" : "Tax-Advantaged (7.0%)"}</th>
                  <th className="p-3.5 font-semibold">{isFr ? "Compte imposable (4,8 % net)" : "Taxable Account (4.8% Net)"}</th>
                  <th className="p-3.5 font-semibold text-white">{isFr ? "Écart préservé" : "Net Wealth Preserved"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ece6da] tabular-nums">
                {proofHorizons.map((row) => (
                  <tr key={row.years} className="hover:bg-[#f7f3eb]">
                    <td className="p-3.5 font-sans font-medium text-[#1c1b18]">
                      {isFr ? `${row.years} ans` : `${row.years} Years`}
                    </td>
                    <td className="p-3.5 text-[#46423a]">{formatCurrency(row.cumulative)}</td>
                    <td className="p-3.5 font-bold text-[#2e4a3b]">{formatCurrency(row.adv)}</td>
                    <td className="p-3.5 text-[#625d52]">{formatCurrency(row.tax)}</td>
                    <td className="p-3.5 font-bold text-[#2e4a3b]">
                      +{formatCurrency(row.diff)} (+{formatPercent(row.pct)})
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="small text-[#625d52] space-y-1.5 pt-1">
            <p>
              <strong className="text-[#1c1b18]">
                {isFr
                  ? "Formule d'annuité due (cotisations au début de chaque année) :"
                  : "Annuity Due Formula (contributions at start of each year):"}
              </strong>{" "}
              <code className="font-mono bg-[#ece6da]/60 px-1.5 py-0.5 rounded-[2px] text-[#1c1b18] text-xs">
                FV = P × (1 + r) × [((1 + r)ⁿ − 1) / r]
              </code>
            </p>
            <p className="italic">
              {isFr
                ? "Estimation éducative supposant P = 10 000 $/an sur n années (7,0 % enregistré vs 4,8 % après impôt en compte non enregistré)."
                : "Educational estimate assuming P = $10,000/yr over n years (7.0% tax-sheltered vs 4.8% net after-tax in non-registered investments)."}
            </p>
          </div>
        </div>
      </section>

      {/* 3. Advisory CTA */}
      <section className="section bg-[#fcfaf5] border-t border-[#d6cebd] text-center">
        <div className="wrap max-w-3xl space-y-4">
          <h2 className="h2 text-[#1c1b18]">
            {isFr
              ? "Besoin d'examiner vos chiffres ensemble ?"
              : "Want to walk through your numbers together?"}
          </h2>
          <p className="lede measure mx-auto">
            {isFr
              ? "Examinez votre situation sans pression pour valider la priorité de vos comptes enregistrés ou de votre trésorerie."
              : "Review your registered account priorities or cash flow questions in a brief, clear call."}
          </p>
          <div className="pt-2">
            <a
              href={siteConfig.schedulingUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackBookingClick("calculators_page_bottom")}
              className="btn btn-primary inline-flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-[#d6c298]" aria-hidden="true" />
              <span>{getCtaLabel(isFr)}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
