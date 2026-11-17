import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { SEO } from "../components/SEO.tsx";
import { useLanguage } from "../context/LanguageContext.tsx";
import { CalculatorLeadCapture } from "../components/CalculatorLeadCapture.tsx";
import { calculateFederalAmt, type AmtInput, type AmtResult } from "../lib/amt.ts";
import { getTaxParametersForYear, AMT_FIGURES_AS_OF } from "../config/taxParameters.ts";
import { siteConfig, getCtaLabel } from "../config/site.ts";
import { trackBookingClick, trackCalculatorCompleted } from "../lib/track.ts";
import {
  Calculator,
  Scale,
  Info,
  Calendar,
  ArrowRight,
  ShieldAlert,
  FileText,
  DollarSign,
  TrendingDown,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export const AmtCalculatorPage: React.FC = () => {
  const { isFr } = useLanguage();
  const prefix = isFr ? "/fr" : "";
  const ctaLabel = getCtaLabel(isFr);

  // User input states - Starts empty (0) until user enters figures or loads the sample scenario
  const [taxYear, setTaxYear] = useState<2024 | 2025 | 2026>(2026);
  const [employmentIncome, setEmploymentIncome] = useState<number>(0);
  const [otherIncome, setOtherIncome] = useState<number>(0);
  const [realizedCapitalGains, setRealizedCapitalGains] = useState<number>(0);
  const [eligibleDividends, setEligibleDividends] = useState<number>(0);
  const [nonEligibleDividends, setNonEligibleDividends] = useState<number>(0);
  const [deductions, setDeductions] = useState<number>(0);
  const [donations, setDonations] = useState<number>(0);
  const [priorYearAmtCarryForward, setPriorYearAmtCarryForward] = useState<number>(0);
  const [isSampleActive, setIsSampleActive] = useState<boolean>(false);
  const [hasTrackedCompletion, setHasTrackedCompletion] = useState<boolean>(false);

  const taxParams = useMemo(() => getTaxParametersForYear(taxYear), [taxYear]);

  const hasInputs =
    employmentIncome > 0 ||
    otherIncome > 0 ||
    realizedCapitalGains > 0 ||
    eligibleDividends > 0 ||
    nonEligibleDividends > 0 ||
    deductions > 0 ||
    donations > 0 ||
    priorYearAmtCarryForward > 0;

  useEffect(() => {
    if (hasInputs && !hasTrackedCompletion) {
      trackCalculatorCompleted("amt");
      setHasTrackedCompletion(true);
    }
  }, [hasInputs, hasTrackedCompletion]);

  const loadSampleScenario = () => {
    setTaxYear(2026);
    setEmploymentIncome(60000);
    setOtherIncome(0);
    setRealizedCapitalGains(500000);
    setEligibleDividends(0);
    setNonEligibleDividends(0);
    setDeductions(5000);
    setDonations(30000);
    setPriorYearAmtCarryForward(0);
    setIsSampleActive(true);
  };

  const resetInputs = () => {
    setEmploymentIncome(0);
    setOtherIncome(0);
    setRealizedCapitalGains(0);
    setEligibleDividends(0);
    setNonEligibleDividends(0);
    setDeductions(0);
    setDonations(0);
    setPriorYearAmtCarryForward(0);
    setIsSampleActive(false);
  };

  // FAQ accordion open states
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const amtInput: AmtInput = useMemo(
    () => ({
      taxYear,
      employmentIncome: Math.max(0, employmentIncome || 0),
      otherIncome: Math.max(0, otherIncome || 0),
      realizedCapitalGains: Math.max(0, realizedCapitalGains || 0),
      eligibleDividends: Math.max(0, eligibleDividends || 0),
      nonEligibleDividends: Math.max(0, nonEligibleDividends || 0),
      deductions: Math.max(0, deductions || 0),
      charitableDonations: Math.max(0, donations || 0),
      priorYearAmtCarryForward: Math.max(0, priorYearAmtCarryForward || 0),
    }),
    [
      taxYear,
      employmentIncome,
      otherIncome,
      realizedCapitalGains,
      eligibleDividends,
      nonEligibleDividends,
      deductions,
      donations,
      priorYearAmtCarryForward,
    ]
  );

  const result: AmtResult = useMemo(() => calculateFederalAmt(amtInput), [amtInput]);

  const formatCAD = (val: number): string => {
    return new Intl.NumberFormat(isFr ? "fr-CA" : "en-CA", {
      style: "currency",
      currency: "CAD",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const unmodelledDisclaimer = isFr
    ? "Les dons de titres négociés, l'exonération cumulative des gains en capital (ECGC), les déductions pour options d'achat d'actions des employés et autres rajustements fiscaux ne sont pas modélisés dans cette estimation."
    : "Donations of securities, the lifetime capital gains exemption, employee stock option deductions and other adjustments are not modelled in this estimate.";

  const summaryText = `Tax Year: ${taxYear}
Employment: ${formatCAD(amtInput.employmentIncome || 0)}
Capital Gains: ${formatCAD(amtInput.realizedCapitalGains || 0)}
Donations: ${formatCAD(amtInput.charitableDonations || 0)}
Regular Federal Tax: ${formatCAD(result.regularFederalTax)}
Federal AMT: ${formatCAD(result.amtEstimate)}
AMT Applies: ${result.amtApplies ? "YES" : "NO"}
Additional AMT Payable: ${formatCAD(result.estimatedAmtPayable)}
7-Year Carry-Forward Generated: ${formatCAD(result.estimatedCarryForwardCredit)}

Scope Notice:
${result.provincialScopeNote}

Unmodelled Items:
${unmodelledDisclaimer}`;

  const faqs = isFr
    ? [
        {
          q: "Qu'est-ce que l'impôt minimum de remplacement (IMR) au Canada ?",
          a: "L'impôt minimum de remplacement (IMR), prévu aux articles 127.5 à 127.55 de la Loi de l'impôt sur le revenu, est un calcul fiscal parallèle au régime d'imposition ordinaire. Un contribuable calcule son impôt selon les deux systèmes et paie le montant le plus élevé des deux. Son but est d'empêcher les hauts revenus de réduire leur impôt à zéro en cumulant des déductions fiscales et des gains de capital préférentiels.",
        },
        {
          q: "Quels changements majeurs les lois C-59 et C-69 ont-elles apportés à l'IMR ?",
          a: "Le projet de loi C-59 a restructuré le cadre de l'IMR : le taux fédéral fixe a augmenté de 15 % à 20,5 % ; l'exemption de base a été indexée au seuil de la 4e tranche fédérale (173 205 $ en 2024, 177 882 $ en 2025, 181 440 $ en 2026) ; et le taux d'inclusion des gains en capital sous l'IMR a été fixé à 100 %. Par la suite, le projet de loi C-69 a haussé l'admissibilité du crédit d'impôt pour dons de bienfaisance à 80 % sous l'IMR (art. 127.531(c)), tout en maintenant les autres crédits personnels non remboursables à 50 %.",
        },
        {
          q: "Puis-je récupérer l'IMR payé au cours des années d'imposition futures ?",
          a: "Oui. En vertu de l'article 120.2 de la LIR, l'IMR fédéral payé constitue un crédit reportable sur les sept années d'imposition subséquentes. Au cours d'une année où votre impôt régulier dépasse votre IMR, vous pouvez déduire ce crédit reporté pour réduire votre impôt régulier jusqu'au niveau de l'IMR de l'année en cours.",
        },
        {
          q: "Pourquoi ce simulateur n'inclut-il pas l'IMR provincial ?",
          a: "L'IMR provincial n'est pas inclus. La plupart des provinces ajoutent une quote-part de l'IMR fédéral (par exemple environ 33,67 % en Ontario ou 33,7 % en Colombie-Britannique), tandis que le Québec applique ses propres barèmes distincts. Ce simulateur se concentre rigoureusement sur le calcul fédéral officiel de l'Agence du revenu du Canada.",
        },
        {
          q: "Comment la planification financière peut-elle atténuer ou éviter l'IMR ?",
          a: "Des stratégies de planification rigoureuses permettent souvent de neutraliser l'IMR : échelonner la réalisation des gains en capital sur plusieurs années civiles, utiliser des réserves pour gains en capital (art. 40(1)a)(iii)), coordonner les dons de bienfaisance avec des années de revenus ordinaires élevés, ou maximiser les cotisations REER pour réduire le revenu imposable global.",
        },
      ]
    : [
        {
          q: "What is the Alternative Minimum Tax (AMT) in Canada?",
          a: "The Alternative Minimum Tax (AMT), codified under Sections 127.5 to 127.55 of the Income Tax Act, is a parallel tax system that runs alongside regular Canadian Part I tax. Taxpayers calculate their tax liability under both methods and pay whichever amount is higher. Its objective is ensuring high-income individuals who benefit from preferential tax deductions, exemptions, and capital gains pay an appropriate proportional share of federal tax.",
        },
        {
          q: "What major changes took effect under Bills C-59 and C-69?",
          a: "Bill C-59 restructured the foundational AMT framework: the flat minimum tax rate rose from 15.0% to 20.5% (matching the 2nd federal tax bracket); the basic exemption was tied to the 4th federal tax bracket ($173,205 in 2024, $177,882 in 2025, and $181,440 in 2026); and capital gains inclusion rose to 100%. Following extensive stakeholder consultation, Bill C-69 amended Section 127.531(c) to allow 80% of the charitable donation tax credit under AMT (up from the earlier 50% proposal), while maintaining standard non-refundable credits at 50%.",
        },
        {
          q: "Can I recover the AMT I pay in future tax years?",
          a: "Yes. Under Section 120.2 of the Income Tax Act, federal AMT paid forms a minimum tax carry-forward credit that can be carried forward for up to 7 subsequent taxation years. In any future year where your regular federal Part I tax exceeds your calculated AMT, you can apply this carry-forward credit to reduce regular tax down to the AMT floor.",
        },
        {
          q: "Why doesn't this calculator include provincial AMT?",
          a: "Provincial AMT is not included. Most provinces add a share of federal AMT (for example, Ontario assesses approximately 33.67% and British Columbia assesses approximately 33.7%), while Quebec administers an independent provincial schedule. This calculator models the official federal statutory formula under Bills C-59 and C-69.",
        },
        {
          q: "How can tax planning help prevent or mitigate AMT exposure?",
          a: "Taxpayers facing large liquidity events can implement intentional multi-year planning: capital gains reserves under Section 40(1)(a)(iii), timing major charitable gifts into tax years with higher ordinary employment income, staging equity liquidations across distinct calendar years, and utilizing available RRSP deductions to reduce aggregate taxable income.",
        },
      ];

  return (
    <div>
      <SEO
        title={
          isFr
            ? "Calculateur d'Impôt Minimum de Remplacement | Ahmed Bello"
            : "Alternative Minimum Tax Calculator Canada | Ahmed Bello"
        }
        description={
          isFr
            ? "Estimez si l'impôt minimum de remplacement canadien (IMR) s'applique à vos gains, dividendes et dons. Simulateur fédéral gratuit."
            : "Estimate whether Canada's alternative minimum tax applies to you. Free calculator for capital gains, dividends, donations and carry-forward."
        }
        canonicalUrl={isFr ? "/fr/calculators/amt" : "/calculators/amt"}
      />

      {/* Hero Header */}
      <section className="section border-b border-[#d6cebd]">
        <div className="wrap max-w-5xl space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Link
              to={isFr ? "/fr/calculators" : "/calculators"}
              className="font-semibold text-[#75581f] hover:underline inline-flex items-center gap-1"
            >
              <Calculator className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{isFr ? "Tous les simulateurs" : "All Calculators"}</span>
            </Link>
            <span className="text-[#d6cebd]">/</span>
            <span className="eyebrow">{isFr ? "Simulateur d'IMR fédéral" : "Federal AMT Estimator"}</span>
          </div>

          <h1 className="h1 text-[#1c1b18]">
            {isFr
              ? "Calculateur d'Impôt Minimum de Remplacement (IMR)"
              : "Alternative Minimum Tax (AMT) Calculator Canada"}
          </h1>

          <p className="lede measure">
            {isFr
              ? `Basé sur les chiffres publiés par l'ARC pour ${taxYear}. Estimations à des fins éducatives seulement.`
              : `Based on published CRA figures for ${taxYear}. Estimates for education only.`}
          </p>

          <p className="small text-[#625d52]">
            {AMT_FIGURES_AS_OF}
          </p>
        </div>
      </section>

      {/* Scope & Notice Banner */}
      <section className="py-4 bg-[#fcfaf5] border-b border-[#ece6da]">
        <div className="wrap max-w-5xl">
          <div className="flex items-start gap-3 text-xs text-[#46423a]">
            <Info className="w-4 h-4 text-[#75581f] shrink-0 mt-0.5" aria-hidden="true" />
            <div className="leading-relaxed">
              <strong className="text-[#1c1b18]">
                {isFr ? "Portée fédérale :" : "Statutory scope:"}
              </strong>{" "}
              {result.provincialScopeNote}
            </div>
          </div>
        </div>
      </section>

      {/* Calculator Workspace */}
      <section className="section">
        <div className="wrap max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Form Inputs (7 cols) */}
            <div className="lg:col-span-7 space-y-6 card-editorial p-6 sm:p-7">
              <div className="flex items-center justify-between border-b border-[#ece6da] pb-3 flex-wrap gap-3">
                <div>
                  <h2 className="font-serif text-xl text-[#1c1b18]">
                    {isFr ? "Paramètres de revenus et déductions" : "Income & Deduction Parameters"}
                  </h2>
                  {isSampleActive && (
                    <span className="text-xs font-medium text-[#75581f] block mt-0.5">
                      {isFr ? "Scénario exemple affiché (modifiez tout champ ci-dessous)" : "Sample scenario loaded (edit any figure below)"}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={isSampleActive ? resetInputs : loadSampleScenario}
                    className="text-xs font-medium text-[#2e4a3b] underline hover:text-[#14211a] cursor-pointer"
                  >
                    {isSampleActive
                      ? isFr ? "Réinitialiser à zéro" : "Clear figures"
                      : isFr ? "Charger un scénario exemple" : "Load sample scenario"}
                  </button>
                </div>
              </div>

              {/* Tax Year Selector */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#ece6da] text-xs">
                <span className="font-semibold text-[#1c1b18]">
                  {isFr ? "Année d'imposition (exemption de base) :" : "Tax year (basic exemption):"}
                </span>
                <div className="flex items-center gap-1 bg-[#f7f3eb] p-1 border border-[#d6cebd] rounded-[2px]">
                  {([2024, 2025, 2026] as const).map((yr) => {
                    const yrParams = getTaxParametersForYear(yr);
                    return (
                      <button
                        key={yr}
                        type="button"
                        onClick={() => setTaxYear(yr)}
                        className={`px-2.5 py-1 text-xs font-semibold rounded-[2px] transition-colors cursor-pointer ${
                          taxYear === yr ? "bg-[#2e4a3b] text-[#f7f3eb]" : "text-[#46423a] hover:text-[#1c1b18]"
                        }`}
                      >
                        {yr} ({formatCAD(yrParams.amtExemption)})
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4 text-xs">
                {/* 1. Employment Income */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label htmlFor="amt-emp" className="font-semibold text-[#1c1b18]">
                      {isFr ? "Revenu d'emploi / T4 ($)" : "Employment Income / T4 ($)"}
                    </label>
                    <span className="tabular-nums text-[#75581f] font-medium">{formatCAD(amtInput.employmentIncome || 0)}</span>
                  </div>
                  <input
                    id="amt-emp"
                    type="number"
                    min={0}
                    step={1000}
                    value={employmentIncome}
                    onChange={(e) => setEmploymentIncome(Number(e.target.value) || 0)}
                    className="w-full p-2.5 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] focus:outline-none focus:border-[#2e4a3b] tabular-nums text-xs"
                  />
                  <p className="text-[11px] text-[#625d52] mt-0.5">
                    {isFr ? "Traitements, salaires, commissions imposables réguliers." : "Regular salary, wages, and bonuses."}
                  </p>
                </div>

                {/* 2. Realized Capital Gains */}
                <div className="p-3 bg-[#fcfaf5] border border-[#d6cebd]/80 rounded-[2px] space-y-1">
                  <div className="flex justify-between items-center mb-1">
                    <label htmlFor="amt-capgains" className="font-semibold text-[#1c1b18] flex items-center gap-1">
                      <span>{isFr ? "Gains en capital bruts réalisés ($)" : "Realized Gross Capital Gains ($)"}</span>
                      <span className="text-[10px] bg-[#8a3324]/10 text-[#8a3324] font-bold px-1.5 py-0.2 rounded-[2px]">
                        {isFr ? "100 % IMR" : "100% AMT"}
                      </span>
                    </label>
                    <span className="tabular-nums text-[#8a3324] font-bold">{formatCAD(amtInput.realizedCapitalGains || 0)}</span>
                  </div>
                  <input
                    id="amt-capgains"
                    type="number"
                    min={0}
                    step={5000}
                    value={realizedCapitalGains}
                    onChange={(e) => setRealizedCapitalGains(Number(e.target.value) || 0)}
                    className="w-full p-2.5 bg-white border border-[#d6cebd] rounded-[2px] focus:outline-none focus:border-[#2e4a3b] tabular-nums text-xs"
                  />
                  <p className="text-[11px] text-[#625d52]">
                    {isFr
                      ? "Inclus à 50 % sous le régime régulier, mais à 100 % sous l'IMR (loi C-59)."
                      : "Taxed at 50% under regular tax, but 100% included under AMT under Bill C-59."}
                  </p>
                </div>

                {/* 3. Dividends (Eligible & Non-Eligible) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="amt-el-div" className="block font-semibold text-[#1c1b18] mb-1">
                      {isFr ? "Dividendes déterminés reçus ($)" : "Eligible Dividends (Cash) ($)"}
                    </label>
                    <input
                      id="amt-el-div"
                      type="number"
                      min={0}
                      step={1000}
                      value={eligibleDividends}
                      onChange={(e) => setEligibleDividends(Number(e.target.value) || 0)}
                      className="w-full p-2 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] tabular-nums text-xs"
                    />
                    <p className="text-[10px] text-[#625d52] mt-0.5">
                      {isFr ? "Montant net reçu (0 % majoration sous IMR)." : "Cash amount (no gross-up under AMT)."}
                    </p>
                  </div>

                  <div>
                    <label htmlFor="amt-nonel-div" className="block font-semibold text-[#1c1b18] mb-1">
                      {isFr ? "Dividendes ordinaires reçus ($)" : "Non-Eligible Dividends ($)"}
                    </label>
                    <input
                      id="amt-nonel-div"
                      type="number"
                      min={0}
                      step={1000}
                      value={nonEligibleDividends}
                      onChange={(e) => setNonEligibleDividends(Number(e.target.value) || 0)}
                      className="w-full p-2 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] tabular-nums text-xs"
                    />
                    <p className="text-[10px] text-[#625d52] mt-0.5">
                      {isFr ? "SPCC / PME canadiennes." : "Small business CCPC dividends."}
                    </p>
                  </div>
                </div>

                {/* 4. Other Income & Deductions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="amt-other" className="block font-semibold text-[#1c1b18] mb-1">
                      {isFr ? "Autres revenus ($)" : "Other Income ($)"}
                    </label>
                    <input
                      id="amt-other"
                      type="number"
                      min={0}
                      step={1000}
                      value={otherIncome}
                      onChange={(e) => setOtherIncome(Number(e.target.value) || 0)}
                      className="w-full p-2 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] tabular-nums text-xs"
                    />
                    <p className="text-[10px] text-[#625d52] mt-0.5">
                      {isFr ? "Intérêts, pensions, loyers nets." : "Interest, pension, net rentals."}
                    </p>
                  </div>

                  <div>
                    <label htmlFor="amt-ded" className="block font-semibold text-[#1c1b18] mb-1">
                      {isFr ? "Déductions admissibles ($)" : "Deductions Claimed ($)"}
                    </label>
                    <input
                      id="amt-ded"
                      type="number"
                      min={0}
                      step={500}
                      value={deductions}
                      onChange={(e) => setDeductions(Number(e.target.value) || 0)}
                      className="w-full p-2 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] tabular-nums text-xs"
                    />
                    <p className="text-[10px] text-[#625d52] mt-0.5">
                      {isFr ? "Cotisations REER et déductions admissibles." : "RRSP and eligible income deductions."}
                    </p>
                  </div>
                </div>

                {/* 5. Charitable Donations */}
                <div className="p-3 bg-[#fcfaf5] border border-[#d6cebd]/80 rounded-[2px]">
                  <div className="flex justify-between items-center mb-1">
                    <label htmlFor="amt-donations" className="font-semibold text-[#1c1b18] flex items-center gap-1">
                      <span>{isFr ? "Dons de bienfaisance admissibles ($)" : "Charitable Donations ($)"}</span>
                      <span className="text-[10px] bg-[#2e4a3b]/15 text-[#2e4a3b] font-bold px-1.5 py-0.2 rounded-[2px]">
                        {isFr ? "80 % Crédit IMR" : "80% AMT Credit"}
                      </span>
                    </label>
                    <span className="tabular-nums text-[#2e4a3b] font-bold">{formatCAD(amtInput.charitableDonations || 0)}</span>
                  </div>
                  <input
                    id="amt-donations"
                    type="number"
                    min={0}
                    step={1000}
                    value={donations}
                    onChange={(e) => setDonations(Number(e.target.value) || 0)}
                    className="w-full p-2.5 bg-white border border-[#d6cebd] rounded-[2px] tabular-nums text-xs"
                  />
                  <p className="text-[11px] text-[#625d52] mt-0.5">
                    {isFr
                      ? "La loi C-69 (art. 127.531(c)) accorde 80 % du crédit d'impôt pour dons sous l'IMR (au lieu des 50 % initialement proposés)."
                      : "Bill C-69 (ITA s. 127.531(c)) allows 80% of the charitable donation tax credit against AMT (up from the 50% originally proposed)."}
                  </p>
                  <p className="text-[10px] text-[#75581f] mt-1 italic border-t border-[#ece6da] pt-1">
                    {unmodelledDisclaimer}
                  </p>
                </div>

                {/* 6. Prior-Year AMT Carry-Forward */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label htmlFor="amt-carry" className="font-semibold text-[#1c1b18]">
                      {isFr ? "Report d'IMR d'années antérieures (art. 120.2) ($)" : "Prior-Year AMT Carry-Forward (ITA 120.2) ($)"}
                    </label>
                    <span className="tabular-nums text-[#2e4a3b] font-medium">{formatCAD(amtInput.priorYearAmtCarryForward || 0)}</span>
                  </div>
                  <input
                    id="amt-carry"
                    type="number"
                    min={0}
                    step={1000}
                    value={priorYearAmtCarryForward}
                    onChange={(e) => setPriorYearAmtCarryForward(Number(e.target.value) || 0)}
                    className="w-full p-2.5 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] tabular-nums text-xs"
                  />
                  <p className="text-[11px] text-[#625d52] mt-0.5">
                    {isFr
                      ? "Crédit d'IMR accumulé au cours des 7 années antérieures, applicable si votre impôt régulier dépasse l'IMR."
                      : "Unused AMT paid within the prior 7 taxation years, available if regular tax exceeds AMT this year."}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Calm Neutral Comparative Results Panel (5 cols) */}
            <div className="lg:col-span-5 space-y-5">
              {/* Calm Neutral Verdict Card */}
              <div className="card-editorial p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-[#ece6da] pb-3">
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#75581f] flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{isFr ? "Estimation fédérale" : "Federal Tax Estimate"}</span>
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-[2px] bg-[#ece6da] text-[#1c1b18]">
                    {!hasInputs
                      ? isFr
                        ? "En attente de chiffres"
                        : "Enter figures"
                      : result.amtApplies
                      ? isFr
                        ? "IMR applicable"
                        : "AMT applies"
                      : isFr
                      ? "Impôt régulier"
                      : "Regular tax"}
                  </span>
                </div>

                {!hasInputs ? (
                  <div className="space-y-4 py-2">
                    <p className="text-sm text-[#46423a] leading-relaxed">
                      {isFr
                        ? "Saisissez vos montants ci-contre ou chargez l'exemple traité pour estimer votre impôt minimum de remplacement fédéral."
                        : "Enter your income, capital gains, or donations to estimate whether federal AMT applies, or load the sample scenario."}
                    </p>
                    <button
                      type="button"
                      onClick={loadSampleScenario}
                      className="btn btn-primary w-full text-sm cursor-pointer"
                    >
                      {isFr ? "Charger le scénario exemple (gain de 500 k$)" : "Load sample scenario ($500k gain)"}
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-1">
                      <div className="text-xs text-[#625d52]">
                        {result.amtApplies
                          ? isFr
                            ? "Supplément d'IMR fédéral estimé :"
                            : "Estimated Additional Federal AMT:"
                          : isFr
                          ? "Supplément d'IMR fédéral :"
                          : "Additional Federal AMT:"}
                      </div>
                      <div className="font-serif text-3xl sm:text-4xl text-[#1c1b18] tabular-nums">
                        {formatCAD(result.estimatedAmtPayable)}
                      </div>
                    </div>

                    {/* One-sentence plain-language meaning */}
                    <p className="text-sm leading-relaxed text-[#46423a]">
                      {result.amtApplies
                        ? isFr
                          ? `Votre IMR estimé (${formatCAD(result.amtEstimate)}) dépasse l'impôt régulier (${formatCAD(result.regularFederalTax)}), créant un supplément temporaire récupérable sur 7 ans.`
                          : `Your estimated AMT (${formatCAD(result.amtEstimate)}) exceeds regular federal tax (${formatCAD(result.regularFederalTax)}), creating a temporary advance recoverable over the next 7 years.`
                        : isFr
                        ? `Votre impôt régulier (${formatCAD(result.regularFederalTax)}) reste supérieur ou égal à l'IMR (${formatCAD(result.amtEstimate)}), aucun supplément d'IMR ne s'applique.`
                        : `Your regular federal tax (${formatCAD(result.regularFederalTax)}) equals or exceeds AMT (${formatCAD(result.amtEstimate)}), so no additional AMT applies.`}
                    </p>

                    {/* 7-Year Carry-Forward Row */}
                    <div className="pt-3 border-t border-[#ece6da] text-xs space-y-1.5">
                      <div className="flex justify-between font-medium text-[#1c1b18]">
                        <span>{isFr ? "Crédit reportable sur 7 ans :" : "7-Year Carry-Forward Generated:"}</span>
                        <span className="font-semibold text-[#2e4a3b] tabular-nums">
                          {formatCAD(result.estimatedCarryForwardCredit)}
                        </span>
                      </div>
                      {result.carryForwardApplied > 0 && (
                        <div className="flex justify-between font-medium text-[#75581f]">
                          <span>{isFr ? "Crédit antérieur utilisé :" : "Prior-Year Credit Utilized:"}</span>
                          <span className="font-semibold tabular-nums">-{formatCAD(result.carryForwardApplied)}</span>
                        </div>
                      )}
                    </div>

                    {/* Single Clear Next Step */}
                    <div className="pt-3 border-t border-[#ece6da]">
                      <a
                        href={siteConfig.schedulingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackBookingClick("amt_result_next_step")}
                        className="btn btn-primary w-full text-sm inline-flex items-center justify-center gap-2"
                      >
                        <Calendar className="w-4 h-4 text-[#d6c298]" aria-hidden="true" />
                        <span>{ctaLabel}</span>
                      </a>
                    </div>
                  </>
                )}
              </div>

              {/* Step-by-Step Breakdown Table */}
              <div className="card-editorial p-5 space-y-3 text-xs">
                <h3 className="font-semibold text-[#1c1b18] uppercase tracking-wider text-xs border-b border-[#ece6da] pb-2 flex items-center justify-between">
                  <span>{isFr ? "Détail du calcul fédéral" : "Federal Calculation Breakdown"}</span>
                  <span className="text-[#75581f] tabular-nums">{taxYear}</span>
                </h3>

                <div className="space-y-1.5 tabular-nums text-xs">
                  <div className="flex justify-between py-1 border-b border-[#ece6da]">
                    <span className="text-[#46423a]">{isFr ? "Revenu imposable régulier :" : "Regular Taxable Income:"}</span>
                    <span className="font-semibold text-[#1c1b18]">{formatCAD(result.regularTaxableIncome)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#ece6da]">
                    <span className="text-[#46423a]">{isFr ? "Revenu imposable rajusté (IMR) :" : "AMT Adjusted Taxable Income:"}</span>
                    <span className="font-semibold text-[#1c1b18]">{formatCAD(result.amtAdjustedTaxableIncome)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#ece6da]">
                    <span className="text-[#46423a]">{isFr ? "Exemption de base :" : "Basic Federal Exemption:"}</span>
                    <span className="text-[#2e4a3b]">-{formatCAD(result.amtExemptionApplied)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#ece6da]">
                    <span className="text-[#46423a]">{isFr ? "Assiette nette d'IMR :" : "Net AMT Base:"}</span>
                    <span className="font-semibold text-[#1c1b18]">{formatCAD(result.amtTaxableBase)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#ece6da]">
                    <span className="text-[#46423a]">{isFr ? "Taux d'IMR fédéral :" : "Federal AMT Rate:"}</span>
                    <span className="text-[#1c1b18]">20.5%</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#ece6da]">
                    <span className="text-[#46423a]">{isFr ? "IMR brut avant crédits :" : "Gross AMT Before Credits:"}</span>
                    <span className="text-[#1c1b18]">{formatCAD(result.amtGrossTax)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#ece6da]">
                    <span className="text-[#46423a]">{isFr ? "Crédits admis (art. 127.531) :" : "Allowed Credits (s. 127.531):"}</span>
                    <span className="text-[#2e4a3b]">-{formatCAD(result.amtCreditsAllowed)}</span>
                  </div>
                  <div className="flex justify-between py-2 font-semibold text-sm text-[#1c1b18]">
                    <span>{isFr ? "Impôt fédéral dû :" : "Total Federal Tax Due:"}</span>
                    <span>{formatCAD(result.totalFederalTaxPayable)}</span>
                  </div>
                </div>

                {/* Honest Scope Note */}
                <p className="pt-2 border-t border-[#ece6da] text-xs text-[#625d52] leading-relaxed">
                  {unmodelledDisclaimer}
                </p>
              </div>

              {/* Lead Capture */}
              <CalculatorLeadCapture
                calculatorName="amt"
                analyticsCalculatorName="amt"
                analyticsTopic="amt"
                topic="amt"
                summaryText={summaryText}
                customHeading={
                  isFr
                    ? "Recevoir mon audit personnalisé d'IMR par courriel"
                    : "Email me this complete AMT audit breakdown"
                }
                customSubheading={
                  isFr ? "Dossier de planification fiscale" : "Tax Planning Record"
                }
                customButtonLabel={
                  isFr ? "M'envoyer mon dossier d'IMR" : "Email me my AMT analysis"
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* Hypothetical Worked Example Section */}
      <section className="section bg-[#fcfaf5] border-t border-[#d6cebd]">
        <div className="wrap max-w-4xl space-y-6">
          <div className="border-b border-[#ece6da] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[0.68rem] uppercase tracking-wider text-[#75581f] font-bold block mb-1">
                {isFr ? "Démonstration Chiffrée" : "Comprehensive Scenario"}
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#1c1b18]">
                {isFr ? "Exemple Hypothétique Traité" : "Hypothetical Worked Example"}
              </h2>
              <p className="text-xs sm:text-sm text-[#625d52] mt-1">
                {isFr
                  ? "Démonstration chiffrée selon les barèmes fédéraux 2026 et les règles des lois C-59 et C-69."
                  : "Step-by-step arithmetic calculated using published 2026 federal brackets and Bills C-59 and C-69 rules."}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                loadSampleScenario();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="btn btn-ghost border border-[#d6cebd] hover:border-[#2e4a3b] text-xs px-3.5 py-2 shrink-0 self-start sm:self-auto cursor-pointer"
            >
              {isFr ? "Charger dans le calculateur ↑" : "Load into calculator ↑"}
            </button>
          </div>

          <div className="p-5 sm:p-6 bg-white border border-[#d6cebd] rounded-[2px] space-y-4 text-xs sm:text-sm text-[#46423a] leading-relaxed shadow-xs">
            <p>
              {isFr ? (
                <>
                  Considérons <strong>Alexandre</strong>, résident canadien en 2026. Il déclare un salaire d'emploi T4 modéré de{" "}
                  <strong>60 000 $</strong> tout en réalisant un gain en capital important de <strong>500 000 $</strong> lors de
                  la vente d'un immeuble ou d'un portefeuille hors régime enregistré. Il verse également <strong>5 000 $</strong> au
                  REER et effectue un don de bienfaisance de <strong>30 000 $</strong> en espèces à un organisme enregistré canadien.
                </>
              ) : (
                <>
                  Consider <strong>Alex</strong>, a Canadian resident in 2026. Alex earns a modest T4 salary of{" "}
                  <strong>$60,000</strong> while realizing a one-time <strong>$500,000</strong> gross capital gain from selling
                  non-registered investments or property. Alex also claims <strong>$5,000</strong> in RRSP deductions and makes a{" "}
                  <strong>$30,000</strong> cash donation to a registered Canadian charity.
                </>
              )}
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#14211a] text-[#f7f3eb]">
                    <th className="p-3 font-semibold">{isFr ? "Paramètre Fiscal" : "Tax Component"}</th>
                    <th className="p-3 font-semibold">{isFr ? "Régime Régulier Part I" : "Regular Part I Tax"}</th>
                    <th className="p-3 font-semibold text-[#d6c298]">{isFr ? "Régime d'IMR (Lois C-59/C-69)" : "Federal AMT (Bills C-59/C-69)"}</th>
                    <th className="p-3 font-semibold">{isFr ? "Explication de la Formule" : "Statutory Explanation"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ece6da] tabular-nums text-xs">
                  <tr className="hover:bg-[#fcfaf5]">
                    <td className="p-3 font-sans font-medium text-[#1c1b18]">{isFr ? "Salaire T4" : "T4 Salary"}</td>
                    <td className="p-3">$60,000</td>
                    <td className="p-3">$60,000</td>
                    <td className="p-3 font-sans text-[#625d52]">{isFr ? "Inclus à 100 % dans les deux calculs" : "100% included in both"}</td>
                  </tr>
                  <tr className="hover:bg-[#fcfaf5]">
                    <td className="p-3 font-sans font-medium text-[#1c1b18]">{isFr ? "Gain en capital (500 000 $)" : "Capital Gain ($500,000)"}</td>
                    <td className="p-3">$250,000 (50%)</td>
                    <td className="p-3 font-bold text-[#8a3324]">$500,000 (100%)</td>
                    <td className="p-3 font-sans text-[#625d52]">
                      {isFr ? "L'IMR inclut 100 % du gain (vs 50 % régulier)" : "AMT mandates 100% inclusion under Bill C-59"}
                    </td>
                  </tr>
                  <tr className="hover:bg-[#fcfaf5]">
                    <td className="p-3 font-sans font-medium text-[#1c1b18]">{isFr ? "Déduction REER (5 000 $)" : "Deductions ($5,000)"}</td>
                    <td className="p-3">-$5,000</td>
                    <td className="p-3">-$5,000</td>
                    <td className="p-3 font-sans text-[#625d52]">
                      {isFr ? "Déduction admissible déduite du revenu imposable" : "Eligible deduction subtracted from taxable income"}
                    </td>
                  </tr>
                  <tr className="hover:bg-[#fcfaf5] bg-[#ece6da]/30">
                    <td className="p-3 font-sans font-bold text-[#1c1b18]">{isFr ? "Revenu Imposable" : "Taxable Base"}</td>
                    <td className="p-3 font-bold">$305,000</td>
                    <td className="p-3 font-bold text-[#8a3324]">$555,000</td>
                    <td className="p-3 font-sans text-[#625d52]">{isFr ? "Écart d'assiette de 250 000 $" : "$250,000 wider adjusted base"}</td>
                  </tr>
                  <tr className="hover:bg-[#fcfaf5]">
                    <td className="p-3 font-sans font-medium text-[#1c1b18]">{isFr ? "Exemption de base 2026" : "2026 Basic Exemption"}</td>
                    <td className="p-3">{isFr ? "S/O (Barème par tranches)" : "N/A (Graduated brackets)"}</td>
                    <td className="p-3 font-bold text-[#2e4a3b]">-$181,440</td>
                    <td className="p-3 font-sans text-[#625d52]">{isFr ? "Assiette nette IMR = 373 560 $ (× 20,5 % = 76 580 $)" : "Net AMT base = $373,560 (× 20.5% = $76,580 gross)"}</td>
                  </tr>
                  <tr className="hover:bg-[#fcfaf5]">
                    <td className="p-3 font-sans font-medium text-[#1c1b18]">{isFr ? "Crédits MPB & Dons (30 000 $)" : "BPA & Donation Credits ($30k)"}</td>
                    <td className="p-3">-$12,165 (100%)</td>
                    <td className="p-3 font-bold text-[#2e4a3b]">-$9,041</td>
                    <td className="p-3 font-sans text-[#625d52]">
                      {isFr ? "MPB admis à 50 % + Dons admis à 80 % (loi C-69)" : "50% BPA ($1,152) + 80% donation credit ($7,890 under Bill C-69)"}
                    </td>
                  </tr>
                  <tr className="hover:bg-[#fcfaf5] bg-[#f7f3eb]">
                    <td className="p-3 font-sans font-bold text-[#1c1b18]">{isFr ? "Impôt fédéral net" : "Net Federal Tax"}</td>
                    <td className="p-3 font-bold">$62,461</td>
                    <td className="p-3 font-bold text-[#1c1b18]">$67,539</td>
                    <td className="p-3 font-sans text-[#46423a] font-medium">
                      {isFr ? "L'IMR dépasse l'impôt régulier de 5 078 $" : "AMT exceeds regular tax by $5,078"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-xs text-[#625d52] pt-1 leading-relaxed">
              {isFr
                ? "Résultat : Alexandre doit verser 5 078 $ d'IMR fédéral supplémentaire en 2026. Cependant, ces 5 078 $ constituent un crédit de report d'IMR en vertu de l'article 120.2 de la LIR, récupérable sur les 7 années suivantes dès que son impôt régulier dépassera son IMR."
                : "Result: Alex pays $5,078 in additional federal AMT for 2026. Importantly, this $5,078 is not permanently lost: under Section 120.2 of the Income Tax Act, it creates an AMT carry-forward credit recoverable against regular tax over the next 7 years."}
            </p>
          </div>
        </div>
      </section>

      {/* Plain-Language Explanations */}
      <section className="section">
        <div className="wrap max-w-4xl space-y-10">
          <div className="space-y-3">
            <span className="text-[0.68rem] uppercase tracking-wider text-[#75581f] font-bold block">
              {isFr ? "Comprendre les Mécanismes" : "Structural Mechanics"}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#1c1b18]">
              {isFr
                ? "Comment fonctionne l'impôt minimum de remplacement canadien ?"
                : "How Canada's Alternative Minimum Tax Operates"}
            </h2>
            <p className="text-sm text-[#46423a] leading-relaxed">
              {isFr
                ? "L'IMR n'est pas un impôt distinct à payer en plus de vos impôts réguliers ; il s'agit d'un plancher fiscal obligatoire calculé parallèlement à votre déclaration de revenus ordinaire."
                : "The Alternative Minimum Tax is not an extra standalone surcharge; it is a statutory floor computed parallel to your regular income tax return."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-[#46423a]">
            <div className="p-5 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] space-y-2">
              <h3 className="font-serif text-base font-semibold text-[#1c1b18] flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#75581f]" />
                <span>{isFr ? "1. L'élargissement de l'assiette fiscale" : "1. The Broadened Tax Base"}</span>
              </h3>
              <p className="leading-relaxed">
                {isFr
                  ? "Sous le régime régulier, les gains en capital ne sont imposés qu'à 50 %. L'IMR réintègre 100 % des gains en capital bruts dans l'assiette imposable rajustée, éliminant tout traitement préférentiel lors du calcul de contrôle."
                  : "Under regular rules, capital gains enjoy a 50% inclusion rate. Under the reformed AMT, 100% of realized capital gains are pulled into the adjusted minimum tax base, stripping away preferential capital gains shelter during the parallel test."}
              </p>
            </div>

            <div className="p-5 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] space-y-2">
              <h3 className="font-serif text-base font-semibold text-[#1c1b18] flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-[#8a3324]" />
                <span>{isFr ? "2. Le traitement des crédits pour dons (80 %)" : "2. 80% Donation Credit Allowance"}</span>
              </h3>
              <p className="leading-relaxed">
                {isFr
                  ? "Alors que la proposition initiale de la loi C-59 prévoyait une limite de 50 %, le projet de loi C-69 a établi l'admissibilité des crédits pour dons de bienfaisance à 80 % sous l'IMR (art. 127.531(c)), protégeant mieux la générosité des philanthropes."
                  : "While the initial Bill C-59 proposals suggested a 50% restriction, enacted legislation in Bill C-69 amended Section 127.531(c) to allow 80% of the charitable donation tax credit against AMT, reducing exposure for generous donors."}
              </p>
            </div>

            <div className="p-5 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] space-y-2">
              <h3 className="font-serif text-base font-semibold text-[#1c1b18] flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-[#2e4a3b]" />
                <span>{isFr ? "3. L'exemption de base indexée" : "3. Indexed Basic Exemption"}</span>
              </h3>
              <p className="leading-relaxed">
                {isFr
                  ? "Pour protéger la classe moyenne, l'exemption de base a été indexée au seuil de la 4e tranche fédérale : 173 205 $ en 2024, 177 882 $ en 2025 et 181 440 $ en 2026. Les contribuables dont le revenu imposable rajusté est inférieur à ce seuil ne paient aucun IMR."
                  : "To shield middle-income Canadians, the exemption rose to match the 4th federal tax bracket: $173,205 in 2024, $177,882 in 2025, and $181,440 in 2026. Anyone whose adjusted taxable income remains below this statutory threshold is entirely protected from AMT."}
              </p>
            </div>

            <div className="p-5 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] space-y-2">
              <h3 className="font-serif text-base font-semibold text-[#1c1b18] flex items-center gap-1.5">
                <TrendingDown className="w-4 h-4 text-[#75581f]" />
                <span>{isFr ? "4. La règle de récupération sur 7 ans" : "4. The 7-Year Recovery Rule"}</span>
              </h3>
              <p className="leading-relaxed">
                {isFr
                  ? "L'article 120.2 de la Loi de l'impôt permet de déduire l'IMR acquitté sur vos impôts réguliers des 7 années suivantes. Si vos revenus futurs génèrent un impôt régulier supérieur à l'IMR, vous récupérez votre mise de fonds."
                  : "Section 120.2 of the Income Tax Act allows taxpayers to claim an AMT carry-forward credit over the subsequent 7 taxation years. When future regular tax exceeds AMT, you recover your advance tax dollar-for-dollar."}
              </p>
            </div>
          </div>

          {/* Deep-link to the comprehensive AMT guide */}
          <div className="p-6 bg-[#2e4a3b] text-[#f7f3eb] rounded-[2px] space-y-3 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[0.68rem] uppercase tracking-wider text-[#d6c298] font-semibold block">
                  {isFr ? "Guide Stratégique Approfondi" : "In-Depth Editorial Guide"}
                </span>
                <h3 className="font-serif text-lg sm:text-xl font-medium text-[#f7f3eb]">
                  {isFr
                    ? "L'impôt minimum de remplacement canadien : Guide pour hauts revenus"
                    : "The Canadian Alternative Minimum Tax (AMT): Understanding Post-2024 Reforms"}
                </h3>
                <p className="text-xs text-[#ece6da] max-w-xl">
                  {isFr
                    ? "Explorez notre analyse détaillée sur l'exemption pour gains en capital (EDGC), la vente d'actions admissibles de petite entreprise et les stratégies de dons philanthropiques."
                    : "Read our comprehensive briefing on Lifetime Capital Gains Exemption (LCGE) rules, QSBC share exits, and structured philanthropic donation sequencing."}
                </p>
              </div>

              <Link
                to={`${prefix}/insights/canadian-alternative-minimum-tax-amt-high-earners-guide`}
                className="btn bg-[#d6c298] text-[#14211a] hover:bg-white text-xs py-2.5 px-4 inline-flex items-center gap-1.5 font-semibold shrink-0 transition-colors"
              >
                <span>{isFr ? "Lire le guide complet" : "Read Full Guide"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5 FAQ Accordions */}
      <section className="section bg-[#fcfaf5] border-t border-[#d6cebd]">
        <div className="wrap max-w-4xl space-y-6">
          <div className="border-b border-[#ece6da] pb-3">
            <span className="text-[0.68rem] uppercase tracking-wider text-[#75581f] font-bold block mb-1">
              {isFr ? "Foire Aux Questions" : "Frequently Asked Questions"}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#1c1b18]">
              {isFr ? "Questions Fréquentes sur l'IMR" : "Frequently Asked Questions on Canadian AMT"}
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="border border-[#d6cebd] rounded-[2px] bg-white overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-3 hover:bg-[#fcfaf5] transition-colors cursor-pointer"
                  >
                    <span className="font-serif text-sm sm:text-base font-semibold text-[#1c1b18] leading-snug">
                      {faq.q}
                    </span>
                    <span className="p-1 text-[#75581f] shrink-0">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="p-4 pt-1 text-xs sm:text-sm text-[#46423a] leading-relaxed border-t border-[#ece6da] bg-[#fcfaf5]/40 rise">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Formal Disclaimers & Booking CTA */}
      <section className="section border-t border-[#d6cebd]">
        <div className="wrap max-w-4xl space-y-8">
          <div className="p-5 bg-[#ece6da]/50 border border-[#d6cebd] rounded-[2px] text-xs text-[#46423a] leading-relaxed space-y-2">
            <strong className="text-[#1c1b18] block uppercase tracking-wider text-[11px]">
              {isFr ? "Avis de non-responsabilité et cadre légal" : "Estimate-Only Disclaimers & Legal Notice"}
            </strong>
            <p>
              {isFr
                ? "Ce simulateur d'impôt minimum de remplacement est fourni exclusivement à des fins d'information et d'éducation générale. Il modélise les dispositions fédérales de la Loi de l'impôt sur le revenu du Canada (modifiée par les projets de loi C-59 et C-69). Il ne constitue aucunement un avis fiscal, juridique, financier ou comptable formel, ni une déclaration officielle auprès de l'Agence du revenu du Canada. L'obligation fiscale réelle dépend de l'ensemble des annexes de votre déclaration T1 et de vos formulaires provinciaux. Consultez toujours un comptable professionnel agréé (CPA) ou un conseiller fiscal accrédité avant de procéder à une transaction majeure ou de déposer votre déclaration."
                : "This Alternative Minimum Tax calculator is provided strictly for educational modeling and estimate purposes. It reflects federal statutory provisions under the Canadian Income Tax Act as modified by Bills C-59 and C-69. It does not constitute formal tax, legal, financial, or accounting advice, nor an official CRA filing determination. Actual tax liability depends on all schedules of your personal T1 return and provincial forms. Always consult a Chartered Professional Accountant (CPA) or licensed tax professional before executing major liquidity transactions."}
            </p>
          </div>

          <div className="text-center space-y-4 pt-4">
            <h2 className="h2 text-[#1c1b18]">
              {isFr
                ? "Vous préparez une vente d'entreprise ou une transaction majeure ?"
                : "Planning a major liquidity event or business exit?"}
            </h2>
            <p className="lede measure mx-auto">
              {isFr
                ? "Faisons le point sur la structure de votre bilan avant de finaliser avec votre CPA."
                : "Review how your tax shelters and liquidity plan fit together before finalizing with your CPA."}
            </p>
            <div className="pt-2">
              <a
                href={siteConfig.schedulingUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackBookingClick("amt_calculator_bottom")}
                className="btn btn-primary inline-flex items-center gap-2"
              >
                <Calendar className="w-4 h-4 text-[#d6c298]" aria-hidden="true" />
                <span>{ctaLabel}</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
