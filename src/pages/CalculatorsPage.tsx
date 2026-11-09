import React, { useState } from "react";
import { Link } from "react-router-dom";
import { SEO } from "../components/SEO.tsx";
import { useLanguage } from "../context/LanguageContext.tsx";
import { NewcomerPlanningCalculator } from "../components/NewcomerPlanningCalculator.tsx";
import { CalculatorLeadCapture } from "../components/CalculatorLeadCapture.tsx";
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
  Sparkles,
  Layers,
  HelpCircle,
} from "lucide-react";

type CalculatorTab = "newcomer" | "mortgage" | "tfsa-rrsp" | "ccpc-passive";

export const CalculatorsPage: React.FC = () => {
  const { language } = useLanguage();
  const isFr = language === "fr";
  const [activeTab, setActiveTab] = useState<CalculatorTab>("newcomer");

  // --------------------------------------------------------------------------
  // Calculator 2: Mortgage Renewal Shock State
  // --------------------------------------------------------------------------
  const [mortgageBalance, setMortgageBalance] = useState<number>(480000);
  const [currentRate, setCurrentRate] = useState<number>(2.49);
  const [renewalRate, setRenewalRate] = useState<number>(5.29);
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
  const [assumedReturn, setAssumedReturn] = useState<number>(6.0);

  // Marginal tax estimation (Federal + Average Provincial)
  const estimateTaxRate = (inc: number): number => {
    if (inc <= 55867) return 0.20;
    if (inc <= 111733) return 0.31;
    if (inc <= 173205) return 0.43;
    if (inc <= 246752) return 0.48;
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
    <div className="py-12 md:py-16">
      <SEO
        title={
          isFr
            ? "Simulateurs Financiers Canadiens : Piste Nouveaux Arrivants, CELI vs REER & Protection"
            : "Canadian Financial Planning Calculators: Newcomer Runway, TFSA vs RRSP & Protection"
        }
        description={
          isFr
            ? "Calculez votre potentiel de croissance à l'abri de l'impôt, la réserve financière pour nouveaux arrivants et la protection du revenu familial."
            : "Calculate your tax-sheltered growth potential, newcomer financial runway, and household income protection gap in real time."
        }
        canonicalUrl={isFr ? "/fr/calculators" : "/calculators"}
      />

      {/* 1. Header */}
      <section className="section pb-12 pt-4 border-b border-[#d6cebd]">
        <div className="wrap max-w-5xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#2e4a3b]/10 text-[#2e4a3b] border border-[#2e4a3b]/25 rounded-[2px] text-xs font-semibold uppercase tracking-wider">
            <Calculator className="w-3.5 h-3.5 text-[#75581f]" />
            <span>{isFr ? "Outils de Modélisation Financière" : "Quantitative Decision Models"}</span>
          </div>

          <h1
            className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1c1b18] leading-[1.12] tracking-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {isFr
              ? "Modélisez vos décisions financières avec rigueur."
              : "Stress-test your financial choices before taking action."}
          </h1>

          <p className="lede text-base sm:text-lg text-[#46423a] leading-relaxed max-w-3xl">
            {isFr
              ? "Chaque outil ci-dessous est conçu selon les règles et formules officielles de l'ARC, de la Banque du Canada et de la Loi de l'impôt sur le revenu. Sans biais commercial, sans produits imposés."
              : "Every model below is calibrated to official Canada Revenue Agency statutes, Bank of Canada monetary data, and the Income Tax Act. Unbiased, transparent balance-sheet arithmetic without sales gimmicks."}
          </p>

          {/* Calculator Selector Tabs */}
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              type="button"
              onClick={() => setActiveTab("newcomer")}
              className={`p-3.5 text-left rounded-[2px] border transition-all flex flex-col justify-between ${
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
              onClick={() => setActiveTab("mortgage")}
              className={`p-3.5 text-left rounded-[2px] border transition-all flex flex-col justify-between ${
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
              onClick={() => setActiveTab("tfsa-rrsp")}
              className={`p-3.5 text-left rounded-[2px] border transition-all flex flex-col justify-between ${
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
                  {isFr ? "Arbitrage fiscal" : "Tax rate arbitrage"}
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("ccpc-passive")}
              className={`p-3.5 text-left rounded-[2px] border transition-all flex flex-col justify-between ${
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
        </div>
      </section>

      {/* 2. Main Interactive Calculator Workspace */}
      <section className="section py-12 md:py-16">
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
                        <span className="font-mono text-[#2e4a3b] font-bold">${mortgageBalance.toLocaleString()}</span>
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
                          <span className="font-mono text-[#2e4a3b] font-bold">{currentRate}%</span>
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
                          <span className="font-mono text-[#8a3324] font-bold">{renewalRate}%</span>
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
                          <span className="font-mono text-[#1c1b18] font-bold">{amortizationYears} {isFr ? "ans" : "yrs"}</span>
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
                          <span className="font-mono text-[#75581f] font-bold">${registeredSavings.toLocaleString()}</span>
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
                        <span className="text-lg font-mono font-bold">${oldPayment} / mo</span>
                      </div>
                      <div>
                        <span className="text-[0.7rem] text-[#d6c298] block">{isFr ? "Nouveau paiement" : "New Payment"}</span>
                        <span className="text-xl font-mono font-bold text-white">${newPayment} / mo</span>
                      </div>
                    </div>

                    <div className="p-3.5 bg-[#8a3324]/20 border border-[#8a3324]/40 rounded-[2px] flex items-center justify-between">
                      <span className="text-xs text-[#ece6da]">
                        {isFr ? "Choc mensuel net :" : "Monthly Payment Shock:"}
                      </span>
                      <span className="font-mono text-base font-bold text-[#f7f3eb]">
                        +${monthlyPaymentIncrease} / mo
                      </span>
                    </div>

                    <div className="text-xs text-[#ece6da]/80 leading-relaxed pt-1">
                      {isFr
                        ? `Ce saut de taux représentera +${fiveYearIncrease.toLocaleString()} $ d'intérêts et de mensualités supplémentaires sur le prochain terme de 5 ans.`
                        : `Over the next 5-year term, this rate step-up demands an extra $${fiveYearIncrease.toLocaleString()} in household cash flow.`}
                    </div>
                  </div>

                  {/* Comparative Strategy Callout */}
                  <div className="p-5 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] space-y-3 text-xs">
                    <span className="font-serif text-sm font-semibold text-[#1c1b18] block">
                      {isFr ? "Dilemme : Vider son CELI pour rembourser ?" : "The TFSA Liquidation Trade-off"}
                    </span>
                    <p className="text-[#46423a] leading-relaxed">
                      {isFr
                        ? `Rembourser ${registeredSavings.toLocaleString()} $ réduirait votre mensualité de ~${monthlySavingsFromPrepay} $/mois. Cependant, ce même capital composé à 6,5 % dans votre CELI atteindrait ~${tfsa15YearFutureValue.toLocaleString()} $ nets d'impôt dans 15 ans.`
                        : `Prepaying $${registeredSavings.toLocaleString()} reduces your mortgage service by ~$${monthlySavingsFromPrepay}/mo. However, leaving that capital compounded at 6.5% tax-free grows to ~$${tfsa15YearFutureValue.toLocaleString()} in 15 years.`}
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

          {/* TAB 3: TFSA VS RRSP ARBITRAGE CALCULATOR */}
          {activeTab === "tfsa-rrsp" && (
            <div className="space-y-6">
              <div className="border-b border-[#ece6da] pb-3">
                <span className="text-[0.68rem] uppercase tracking-wider text-[#75581f] font-bold block">
                  {isFr ? "Optimisation Fiscale des Régimes Enregistrés" : "Registered Tax Shelter Optimizer"}
                </span>
                <h2 className="font-serif text-2xl text-[#1c1b18]">
                  {isFr ? "Calculateur d'Arbitrage CELI vs REER" : "TFSA vs. RRSP Tax Rate Arbitrage Calculator"}
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
                        <span className="font-mono text-[#2e4a3b] font-bold">${currentIncome.toLocaleString()}</span>
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
                        <span className="font-mono text-[#75581f] font-bold">${retirementIncome.toLocaleString()}</span>
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
                          <span>{isFr ? "Cotisation annuelle" : "Annual Contribution"}</span>
                          <span className="font-mono text-[#1c1b18] font-bold">${annualContribution.toLocaleString()}</span>
                        </div>
                        <input
                          type="range"
                          min={2000}
                          max={31560}
                          step={500}
                          value={annualContribution}
                          onChange={(e) => setAnnualContribution(Number(e.target.value))}
                          className="w-full accent-[#2e4a3b]"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-medium text-[#1c1b18] mb-1.5">
                          <span>{isFr ? "Horizon (années)" : "Horizon (Years)"}</span>
                          <span className="font-mono text-[#1c1b18] font-bold">{yearsToRetirement} {isFr ? "ans" : "yrs"}</span>
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
                        <span className="font-mono font-bold text-white text-base">${tfsaTerminal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-[#ece6da]/70">{isFr ? "Valeur nette REER (remboursement réinvesti)" : "RRSP Terminal (Net of Taxes):"}</span>
                        <span className="font-mono font-bold text-[#d6c298] text-base">${rrspAfterTaxTerminal.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-[#2e4a3b]/40 border border-[#d6c298]/30 rounded-[2px]">
                      <span className="text-[0.68rem] uppercase tracking-wider text-[#d6c298] block">
                        {rrspArbitrageDelta >= 0
                          ? isFr ? "Avantage REER" : "RRSP Advantage"
                          : isFr ? "Avantage CELI" : "TFSA Advantage"}
                      </span>
                      <span className="text-lg font-mono font-bold text-white">
                        {rrspArbitrageDelta >= 0
                          ? isFr ? `+${rrspArbitrageDelta.toLocaleString()} $ net` : `+$${rrspArbitrageDelta.toLocaleString()} Net`
                          : isFr ? `+${Math.abs(rrspArbitrageDelta).toLocaleString()} $ net` : `+$${Math.abs(rrspArbitrageDelta).toLocaleString()} Net`}
                      </span>
                      <p className="text-[0.7rem] text-[#ece6da]/80 mt-1">
                        {currentMarginalRate > retirementMarginalRate
                          ? isFr
                            ? "Le REER profite d'un arbitrage fiscal favorable car votre taux marginal actuel dépasse celui prévu à la retraite."
                            : "The RRSP creates positive tax arbitrage because your current marginal tax bracket exceeds your expected retirement bracket."
                          : isFr
                            ? "Le CELI est supérieur ou équivalent, et offre une liquidité totale sans risque de récupération de la SV (OAS)."
                            : "The TFSA matches or exceeds the RRSP, providing full liquidity without triggering OAS clawbacks."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <CalculatorLeadCapture
                calculatorName="TFSA vs RRSP Arbitrage Optimizer"
                summaryText={`Current Income: $${currentIncome.toLocaleString()} (${(currentMarginalRate * 100).toFixed(0)}% marginal rate)
Retirement Income: $${retirementIncome.toLocaleString()} (${(retirementMarginalRate * 100).toFixed(0)}% marginal rate)
Annual Contribution: $${annualContribution.toLocaleString()} over ${yearsToRetirement} years at ${assumedReturn}% return
TFSA Terminal Value: $${tfsaTerminal.toLocaleString()} (100% tax-free)
RRSP Terminal Value (Net of Taxes): $${rrspAfterTaxTerminal.toLocaleString()}
Net Arbitrage Advantage: $${Math.abs(rrspArbitrageDelta).toLocaleString()} in favor of ${rrspArbitrageDelta >= 0 ? "RRSP" : "TFSA"}`}
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
                        <span className="font-mono text-[#2e4a3b] font-bold">${activeBusinessIncome.toLocaleString()}</span>
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
                        <span className="font-mono text-[#8a3324] font-bold">${passiveInvestmentIncome.toLocaleString()}</span>
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
                            ⚠️ Dépasse le seuil légal de 50 000 $ de ${(passiveInvestmentIncome - 50000).toLocaleString()} $. Réduction 5:1 déclenchée.
                          </span>
                        ) : (
                          <span className="text-[#2e4a3b] font-semibold">
                            ✓ Inférieur au seuil de 50 000 $. Plein plafond DPE de 500 000 $ préservé.
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
                        <span className="font-mono font-bold text-[#d97768]">-${sbdGrindAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#ece6da]/70">{isFr ? "Plafond restant à 12,2 % :" : "Remaining Limit at 12.2%:"}</span>
                        <span className="font-mono font-bold text-white">${remainingSbdLimit.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#ece6da]/70">{isFr ? "Bénéfice poussé à 26,5 % :" : "Operating Income Pushed to 26.5%:"}</span>
                        <span className="font-mono font-bold text-[#d6c298]">${regularTaxedAbi.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="p-3.5 bg-[#8a3324]/20 border border-[#8a3324]/40 rounded-[2px] flex items-center justify-between">
                      <span className="text-xs text-[#ece6da]">
                        {isFr ? "Impôt corporatif supplémentaire :" : "Extra Corporate Tax Owed:"}
                      </span>
                      <span className="font-mono text-base font-bold text-white">
                        +${extraCorporateTaxOwing.toLocaleString()} / an
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
      <section className="section py-16 bg-[#fcfaf5] border-t border-[#d6cebd]">
        <div className="wrap max-w-5xl space-y-8">
          <div className="max-w-3xl space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#75581f] font-bold block">
              {isFr ? "Guide Quantitatif & Modélisation Fiscale" : "Quantitative Analysis & Tax Drag Modeling"}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#1c1b18]">
              {isFr
                ? "Comparaison de la Croissance Composée à l'Abri de l'Impôt vs Compte Imposable au Canada"
                : "Tax-Advantaged vs Taxable Compound Growth Comparison in Canada"}
            </h2>
            <p className="text-sm sm:text-base text-[#46423a] leading-relaxed">
              {isFr
                ? "Au Canada, le frottement fiscal annuel constitue le frein le plus destructeur pour la constitution d'un patrimoine à long terme. Chaque dollar d'intérêt, de dividende étranger ou de gain en capital réalisé dans un compte non enregistré subit une imposition immédiate qui réduit l'effet multiplicateur des intérêts composés."
                : "In Canadian financial planning, annual tax drag represents the single largest headwind to long-term wealth accumulation. In a non-registered (taxable) account, interest is taxed at 100% of your top marginal rate, foreign dividends lose foreign withholding tax without federal dividend tax credits, and realized capital gains incur taxable events that permanently disrupt compounding velocity."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 bg-white border border-[#d6cebd] rounded-[2px] space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#2e4a3b] font-bold block">
                {isFr ? "CELI & CELIAPP (0 % d'impôt)" : "TFSA & FHSA (0% Tax Drag)"}
              </span>
              <h3 className="font-serif text-lg text-[#1c1b18] font-semibold">
                {isFr ? "Croissance 100 % Pure" : "Pure Tax-Free Compounding"}
              </h3>
              <p className="text-xs text-[#46423a] leading-relaxed">
                {isFr
                  ? "Les rendements (intérêts, dividendes, plus-values) fructifient sans aucun frottement fiscal. Les retraits sont non imposables et n'ont aucun impact sur les prestations gouvernementales (PSV, SRG, ACE)."
                  : "Every dollar of capital gain, eligible Canadian dividend, and fixed income interest compounds with zero friction. Withdrawals never trigger income-tested clawbacks (OAS/GIS/CCB) and regenerate contribution room the following calendar year."}
              </p>
            </div>

            <div className="p-5 bg-white border border-[#d6cebd] rounded-[2px] space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#75581f] font-bold block">
                {isFr ? "REER (Déduction & Arbitrage)" : "RRSP (Tax Arbitrage Model)"}
              </span>
              <h3 className="font-serif text-lg text-[#1c1b18] font-semibold">
                {isFr ? "Report d'Impôt avec Effet de Levier" : "Pre-Tax Compounding Power"}
              </h3>
              <p className="text-xs text-[#46423a] leading-relaxed">
                {isFr
                  ? "La déduction fiscale immédiate génère un remboursement. En le réinvestissant systématiquement, vous comblez l'impôt payable au décaissement à la retraite, créant un arbitrage positif si votre tranche baisse."
                  : "Upfront tax deductions lower taxable earned income immediately. Systematically reinvesting the tax refund neutralizes deferred tax liabilities at withdrawal, capturing significant positive arbitrage when retiring in lower tax brackets."}
              </p>
            </div>

            <div className="p-5 bg-white border border-[#d6cebd] rounded-[2px] space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#8a3324] font-bold block">
                {isFr ? "Compte Imposable (Frottement Fiscal)" : "Taxable Non-Registered Drag"}
              </span>
              <h3 className="font-serif text-lg text-[#1c1b18] font-semibold">
                {isFr ? "Érosion Annuelle du Capital" : "Annual Compounding Friction"}
              </h3>
              <p className="text-xs text-[#46423a] leading-relaxed">
                {isFr
                  ? "Les impôts prélevés chaque année sur les revenus de placement réduisent le rendement effectif net de 1,5 % à 2,8 % par an. Sur 25 ans, plus de 30 % du capital final potentiel est ainsi perdu en impôt."
                  : "Annual taxation on interest, foreign distributions, and rebalancing slices between 1.5% and 2.8% off your effective net annual return, confiscating upwards of 30% to 40% of cumulative final wealth over a 25-year investment horizon."}
              </p>
            </div>
          </div>

          {/* Mathematical Proof Table */}
          <div className="overflow-x-auto border border-[#d6cebd] rounded-[2px] bg-white">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#14211a] text-[#f7f3eb]">
                  <th className="p-3.5 font-semibold">{isFr ? "Horizon Temporel" : "Horizon"}</th>
                  <th className="p-3.5 font-semibold">{isFr ? "Cotisation Cumulée (10 000 $/an)" : "Cumulative Principal ($10k/yr)"}</th>
                  <th className="p-3.5 font-semibold text-[#d6c298]">{isFr ? "Compte Enregistré (7 % pur)" : "Tax-Advantaged (7% Nominal)"}</th>
                  <th className="p-3.5 font-semibold text-[#d97768]">{isFr ? "Compte Imposable (4,8 % net d'impôt)" : "Taxable Account (4.8% Net After Drag)"}</th>
                  <th className="p-3.5 font-semibold text-white">{isFr ? "Capital Préservé à l'Abri" : "Net Wealth Preserved"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ece6da] font-mono">
                <tr className="hover:bg-[#fcfaf5]">
                  <td className="p-3.5 font-sans font-medium text-[#1c1b18]">{isFr ? "10 Ans" : "10 Years"}</td>
                  <td className="p-3.5 text-[#46423a]">$100,000</td>
                  <td className="p-3.5 font-bold text-[#2e4a3b]">$147,836</td>
                  <td className="p-3.5 text-[#8a3324]">$127,150</td>
                  <td className="p-3.5 font-bold text-[#2e4a3b]">+$20,686 (+16.3%)</td>
                </tr>
                <tr className="hover:bg-[#fcfaf5]">
                  <td className="p-3.5 font-sans font-medium text-[#1c1b18]">{isFr ? "20 Ans" : "20 Years"}</td>
                  <td className="p-3.5 text-[#46423a]">$200,000</td>
                  <td className="p-3.5 font-bold text-[#2e4a3b]">$438,652</td>
                  <td className="p-3.5 text-[#8a3324]">$330,660</td>
                  <td className="p-3.5 font-bold text-[#2e4a3b]">+$107,992 (+32.7%)</td>
                </tr>
                <tr className="hover:bg-[#fcfaf5]">
                  <td className="p-3.5 font-sans font-medium text-[#1c1b18]">{isFr ? "30 Ans" : "30 Years"}</td>
                  <td className="p-3.5 text-[#46423a]">$300,000</td>
                  <td className="p-3.5 font-bold text-[#2e4a3b]">$1,010,730</td>
                  <td className="p-3.5 text-[#8a3324]">$662,118</td>
                  <td className="p-3.5 font-bold text-[#2e4a3b]">+$348,612 (+52.6%)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-[#625d52] italic">
            {isFr
              ? "Hypothèse purement illustrative : calcul basé sur un placement annuel de 10 000 $ au taux nominal composé de 7 %. Le compte imposable suppose un taux d'imposition marginal combiné de 43 % et une rotation modérée de portefeuille entraînant un frein fiscal de 2,2 % par an."
              : "Hypothetical mathematical illustration: assumes $10,000 annual contribution at 7% nominal compounded return. Taxable account assumes a 43% combined marginal bracket on income and realized distributions, creating a 2.2% annual tax drag (net return 4.8%). Actual returns and tax obligations vary."}
          </p>
        </div>
      </section>

      {/* 3. Advisory CTA */}
      <section className="section py-16 bg-[#fcfaf5] border-t border-[#d6cebd] text-center">
        <div className="wrap max-w-3xl space-y-4">
          <h2 className="font-serif text-2xl sm:text-3xl text-[#1c1b18]">
            {isFr
              ? "Prêt à stress-tester vos chiffres avec un professionnel agréé ?"
              : "Ready to stress-test your numbers with an independent professional?"}
          </h2>
          <p className="text-sm text-[#46423a] max-w-xl mx-auto">
            {isFr
              ? "Planifiez un échange sans pression commerciale pour examiner vos comptes enregistrés, votre trésorerie ou votre société."
              : "Schedule a 30-minute introductory conversation to review your balance sheet, registered shelters, or corporate treasury with zero sales pressure."}
          </p>
          <div className="pt-2">
            <a
              href="https://calendly.com/olabel/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary text-sm px-7 py-3 inline-flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-[#d6c298]" />
              <span>{isFr ? "Réserver un appel de 30 minutes sur Calendly" : "Schedule 30-Min Call on Calendly"}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
