import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { SEO } from "../components/SEO.tsx";
import { useLanguage } from "../context/LanguageContext.tsx";
import { CalculatorLeadCapture } from "../components/CalculatorLeadCapture.tsx";
import { calculateFederalAmt, type AmtInput, type AmtResult } from "../lib/amt.ts";
import { FEDERAL_AMT_PARAMETERS, AMT_FIGURES_AS_OF } from "../config/taxParameters.ts";
import { trackBookingClick, trackCalculatorCompleted } from "../lib/track.ts";
import {
  Calculator,
  Scale,
  AlertTriangle,
  Info,
  CheckCircle2,
  Calendar,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  FileText,
  DollarSign,
  TrendingDown,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export const AmtCalculatorPage: React.FC = () => {
  const { isFr } = useLanguage();
  const prefix = isFr ? "/fr" : "";

  // User input states - Defaults to current 2026 tax year
  const [taxYear, setTaxYear] = useState<2024 | 2025 | 2026>(2026);
  const [employmentIncome, setEmploymentIncome] = useState<number>(120000);
  const [otherIncome, setOtherIncome] = useState<number>(0);
  const [realizedCapitalGains, setRealizedCapitalGains] = useState<number>(400000);
  const [eligibleDividends, setEligibleDividends] = useState<number>(0);
  const [nonEligibleDividends, setNonEligibleDividends] = useState<number>(0);
  const [deductions, setDeductions] = useState<number>(5000);
  const [donations, setDonations] = useState<number>(30000);
  const [priorYearAmtCarryForward, setPriorYearAmtCarryForward] = useState<number>(0);

  // Track initial calculator completion once on load
  useEffect(() => {
    trackCalculatorCompleted("amt");
  }, []);

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
    <div className="py-12 md:py-16">
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
      <section className="section pb-8 pt-4 border-b border-[#d6cebd]">
        <div className="wrap max-w-5xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to={isFr ? "/fr/calculators" : "/calculators"}
              className="text-xs font-semibold text-[#75581f] hover:underline inline-flex items-center gap-1"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>{isFr ? "Tous les simulateurs" : "All Calculators"}</span>
            </Link>
            <span className="text-[#d6cebd]">/</span>
            <span className="text-xs font-bold text-[#2e4a3b] uppercase tracking-wider">
              {isFr ? "Lois C-59 & C-69 (IMR Fédéral)" : "Bills C-59 & C-69 Federal AMT"}
            </span>
          </div>

          <h1
            className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1c1b18] leading-[1.15] tracking-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {isFr
              ? "Calculateur d'Impôt Minimum de Remplacement (IMR)"
              : "Alternative Minimum Tax (AMT) Calculator Canada"}
          </h1>

          <p className="text-base sm:text-lg text-[#46423a] leading-relaxed max-w-3xl">
            {isFr
              ? "Modélisez l'impact des réformes fédérales de l'IMR (lois C-59 et C-69) sur vos gains en capital, vos dividendes, vos dons de bienfaisance et vos crédits de report d'IMR sur 7 ans."
              : "Model how federal tax reforms under Bills C-59 and C-69 impact your business exits, real estate capital gains, charitable donations, and 7-year carry-forward recovery."}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
            <span className="px-2.5 py-1 bg-[#2e4a3b]/10 text-[#2e4a3b] font-mono rounded-[2px] font-semibold border border-[#2e4a3b]/20">
              {AMT_FIGURES_AS_OF}
            </span>
            <span className="px-2.5 py-1 bg-[#ece6da] text-[#46423a] font-mono rounded-[2px]">
              ITA 127.5–127.55 & ITA 120.2
            </span>
          </div>
        </div>
      </section>

      {/* Scope & Notice Banner */}
      <section className="section py-4 bg-[#fcfaf5] border-b border-[#ece6da]">
        <div className="wrap max-w-5xl">
          <div className="flex items-start gap-3 p-3.5 bg-white border border-[#d6cebd] rounded-[2px] text-xs text-[#46423a]">
            <Info className="w-4 h-4 text-[#75581f] shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="text-[#1c1b18]">
                {isFr ? "Précision sur le champ d'application :" : "Statutory Scope Notice:"}
              </strong>{" "}
              {result.provincialScopeNote}
            </div>
          </div>
        </div>
      </section>

      {/* Calculator Workspace */}
      <section className="section py-10 md:py-14">
        <div className="wrap max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Form Inputs (7 cols) */}
            <div className="lg:col-span-7 space-y-6 bg-white p-6 sm:p-7 border border-[#d6cebd] rounded-[2px] shadow-xs">
              <div className="flex items-center justify-between border-b border-[#ece6da] pb-3 flex-wrap gap-2">
                <h2 className="font-serif text-xl text-[#1c1b18] font-semibold">
                  {isFr ? "Paramètres de Revenus & Déductions" : "Income & Deduction Parameters"}
                </h2>
                <div className="flex items-center gap-1 bg-[#fcfaf5] p-1 border border-[#d6cebd] rounded-[2px]">
                  <button
                    type="button"
                    onClick={() => setTaxYear(2024)}
                    className={`px-2 py-1 text-xs font-semibold rounded-[2px] transition-colors ${
                      taxYear === 2024 ? "bg-[#2e4a3b] text-[#f7f3eb]" : "text-[#46423a] hover:text-[#1c1b18]"
                    }`}
                  >
                    2024 ({formatCAD(FEDERAL_AMT_PARAMETERS.basicExemption2024.value)})
                  </button>
                  <button
                    type="button"
                    onClick={() => setTaxYear(2025)}
                    className={`px-2 py-1 text-xs font-semibold rounded-[2px] transition-colors ${
                      taxYear === 2025 ? "bg-[#2e4a3b] text-[#f7f3eb]" : "text-[#46423a] hover:text-[#1c1b18]"
                    }`}
                  >
                    2025 ({formatCAD(FEDERAL_AMT_PARAMETERS.basicExemption2025.value)})
                  </button>
                  <button
                    type="button"
                    onClick={() => setTaxYear(2026)}
                    className={`px-2 py-1 text-xs font-semibold rounded-[2px] transition-colors ${
                      taxYear === 2026 ? "bg-[#2e4a3b] text-[#f7f3eb]" : "text-[#46423a] hover:text-[#1c1b18]"
                    }`}
                  >
                    2026 ({formatCAD(FEDERAL_AMT_PARAMETERS.basicExemption2026.value)})
                  </button>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                {/* 1. Employment Income */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label htmlFor="amt-emp" className="font-semibold text-[#1c1b18]">
                      {isFr ? "Revenu d'emploi / T4 ($)" : "Employment Income / T4 ($)"}
                    </label>
                    <span className="font-mono text-[#75581f] font-medium">{formatCAD(amtInput.employmentIncome || 0)}</span>
                  </div>
                  <input
                    id="amt-emp"
                    type="number"
                    min={0}
                    step={1000}
                    value={employmentIncome}
                    onChange={(e) => setEmploymentIncome(Number(e.target.value) || 0)}
                    className="w-full p-2.5 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] focus:outline-none focus:border-[#2e4a3b] font-mono text-xs"
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
                      <span className="text-[10px] bg-[#8a3324]/10 text-[#8a3324] font-bold px-1.5 py-0.2 rounded">
                        100% IMR
                      </span>
                    </label>
                    <span className="font-mono text-[#8a3324] font-bold">{formatCAD(amtInput.realizedCapitalGains || 0)}</span>
                  </div>
                  <input
                    id="amt-capgains"
                    type="number"
                    min={0}
                    step={5000}
                    value={realizedCapitalGains}
                    onChange={(e) => setRealizedCapitalGains(Number(e.target.value) || 0)}
                    className="w-full p-2.5 bg-white border border-[#d6cebd] rounded-[2px] focus:outline-none focus:border-[#2e4a3b] font-mono text-xs"
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
                      className="w-full p-2 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] font-mono text-xs"
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
                      className="w-full p-2 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] font-mono text-xs"
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
                      className="w-full p-2 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] font-mono text-xs"
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
                      className="w-full p-2 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] font-mono text-xs"
                    />
                    <p className="text-[10px] text-[#625d52] mt-0.5">
                      {isFr ? "Frais financiers, garde d'enfants (50 % sous IMR)." : "Carrying charges, child care (50% under AMT)."}
                    </p>
                  </div>
                </div>

                {/* 5. Charitable Donations */}
                <div className="p-3 bg-[#fcfaf5] border border-[#d6cebd]/80 rounded-[2px]">
                  <div className="flex justify-between items-center mb-1">
                    <label htmlFor="amt-donations" className="font-semibold text-[#1c1b18] flex items-center gap-1">
                      <span>{isFr ? "Dons de bienfaisance admissibles ($)" : "Charitable Donations ($)"}</span>
                      <span className="text-[10px] bg-[#2e4a3b]/15 text-[#2e4a3b] font-bold px-1.5 py-0.2 rounded">
                        80% Crédit IMR
                      </span>
                    </label>
                    <span className="font-mono text-[#2e4a3b] font-bold">{formatCAD(amtInput.charitableDonations || 0)}</span>
                  </div>
                  <input
                    id="amt-donations"
                    type="number"
                    min={0}
                    step={1000}
                    value={donations}
                    onChange={(e) => setDonations(Number(e.target.value) || 0)}
                    className="w-full p-2.5 bg-white border border-[#d6cebd] rounded-[2px] font-mono text-xs"
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
                    <span className="font-mono text-[#2e4a3b] font-medium">{formatCAD(amtInput.priorYearAmtCarryForward || 0)}</span>
                  </div>
                  <input
                    id="amt-carry"
                    type="number"
                    min={0}
                    step={1000}
                    value={priorYearAmtCarryForward}
                    onChange={(e) => setPriorYearAmtCarryForward(Number(e.target.value) || 0)}
                    className="w-full p-2.5 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] font-mono text-xs"
                  />
                  <p className="text-[11px] text-[#625d52] mt-0.5">
                    {isFr
                      ? "Crédit d'IMR accumulé au cours des 7 années antérieures, applicable si votre impôt régulier dépasse l'IMR."
                      : "Unused AMT paid within the prior 7 taxation years, available if regular tax exceeds AMT this year."}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Comparative Results & Real-Time Verdict (5 cols) */}
            <div className="lg:col-span-5 space-y-5">
              {/* Verdict Card */}
              <div
                className={`p-6 border-2 rounded-[2px] shadow-sm space-y-4 transition-colors ${
                  result.amtApplies
                    ? "bg-[#fdf0ed] border-[#d97768] text-[#1c1b18]"
                    : "bg-[#f4f7f4] border-[#2e4a3b] text-[#1c1b18]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[0.68rem] uppercase tracking-wider font-bold text-[#75581f] flex items-center gap-1">
                    <Scale className="w-3.5 h-3.5" />
                    <span>{isFr ? "Verdict Fiscal Fédéral" : "Federal Tax Comparison"}</span>
                  </span>
                  <span
                    className={`text-[0.68rem] uppercase font-bold px-2 py-0.5 rounded-[2px] ${
                      result.amtApplies ? "bg-[#8a3324] text-white" : "bg-[#2e4a3b] text-white"
                    }`}
                  >
                    {result.amtApplies
                      ? isFr
                        ? "IMR APPLICABLE"
                        : "AMT APPLIES"
                      : isFr
                      ? "IMPÔT RÉGULIER"
                      : "REGULAR TAX"}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-xs text-[#625d52]">
                    {result.amtApplies
                      ? isFr
                        ? "Supplément d'IMR fédéral exigible :"
                        : "Additional Federal AMT Payable:"
                      : isFr
                      ? "Aucun supplément d'IMR exigible"
                      : "No Additional AMT Payable"}
                  </div>
                  <div className="font-serif text-3xl sm:text-4xl font-bold text-[#1c1b18]">
                    {formatCAD(result.estimatedAmtPayable)}
                  </div>
                </div>

                <p className="text-xs leading-relaxed text-[#46423a]">
                  {result.amtApplies ? (
                    isFr ? (
                      <>
                        Votre impôt minimum de remplacement estimé (<strong>{formatCAD(result.amtEstimate)}</strong>) dépasse
                        votre impôt régulier fédéral (<strong>{formatCAD(result.regularFederalTax)}</strong>) de{" "}
                        <strong>{formatCAD(result.estimatedAmtPayable)}</strong>. Vous devez acquitter ce surplus sur votre
                        déclaration T1 fédérale.
                      </>
                    ) : (
                      <>
                        Your estimated Alternative Minimum Tax (<strong>{formatCAD(result.amtEstimate)}</strong>) exceeds
                        regular federal tax (<strong>{formatCAD(result.regularFederalTax)}</strong>) by{" "}
                        <strong>{formatCAD(result.estimatedAmtPayable)}</strong>. You must remit this higher amount on line 127
                        of your federal Schedule 1.
                      </>
                    )
                  ) : isFr ? (
                    <>
                      Votre impôt régulier fédéral (<strong>{formatCAD(result.regularFederalTax)}</strong>) est supérieur ou
                      égal à votre IMR (<strong>{formatCAD(result.amtEstimate)}</strong>). L'IMR ne s'applique pas cette
                      année.
                    </>
                  ) : (
                    <>
                      Your regular federal Part I tax (<strong>{formatCAD(result.regularFederalTax)}</strong>) is equal to or
                      higher than your AMT estimate (<strong>{formatCAD(result.amtEstimate)}</strong>). AMT does not apply
                      this year.
                    </>
                  )}
                </p>

                {/* 7-Year Carry-Forward Box */}
                <div className="pt-3 border-t border-[#d6cebd] text-xs space-y-1">
                  <div className="flex justify-between font-medium">
                    <span>{isFr ? "Crédit de report d'IMR généré (7 ans) :" : "7-Year Carry-Forward Generated:"}</span>
                    <span className="font-mono font-bold text-[#2e4a3b]">
                      {formatCAD(result.estimatedCarryForwardCredit)}
                    </span>
                  </div>
                  {result.carryForwardApplied > 0 && (
                    <div className="flex justify-between font-medium text-[#75581f]">
                      <span>{isFr ? "Crédit antérieur utilisé cette année :" : "Prior-Year Credit Utilized:"}</span>
                      <span className="font-mono font-bold">-{formatCAD(result.carryForwardApplied)}</span>
                    </div>
                  )}
                  <p className="text-[11px] text-[#625d52] italic pt-1">
                    {isFr
                      ? "En vertu de l'art. 120.2 de la LIR, l'IMR payé peut être déduit de votre impôt régulier futur sur une période de 7 ans."
                      : "Under ITA Section 120.2, AMT paid generates a credit recoverable against regular tax over the following 7 tax years."}
                  </p>
                </div>
              </div>

              {/* Step-by-Step Breakdown Table */}
              <div className="bg-[#fcfaf5] border border-[#d6cebd] p-4 rounded-[2px] space-y-3 text-xs">
                <h3 className="font-semibold text-[#1c1b18] uppercase tracking-wider text-[11px] border-b border-[#ece6da] pb-1.5 flex items-center justify-between">
                  <span>{isFr ? "Décomposition Actuarielle Fédérale" : "Federal Arithmetic Audit"}</span>
                  <span className="font-mono text-[10px] text-[#75581f]">{taxYear}</span>
                </h3>

                <div className="space-y-1.5 font-mono text-[11px]">
                  <div className="flex justify-between py-1 border-b border-[#ece6da]">
                    <span className="text-[#46423a] font-sans">{isFr ? "Revenu imposable régulier :" : "Regular Taxable Income:"}</span>
                    <span className="font-bold text-[#1c1b18]">{formatCAD(result.regularTaxableIncome)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#ece6da]">
                    <span className="text-[#46423a] font-sans">{isFr ? "Revenu imposable rajusté (IMR) :" : "AMT Adjusted Taxable Income:"}</span>
                    <span className="font-bold text-[#8a3324]">{formatCAD(result.amtAdjustedTaxableIncome)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#ece6da]">
                    <span className="text-[#46423a] font-sans">{isFr ? "Exemption de base :" : "Basic Federal Exemption:"}</span>
                    <span className="text-[#2e4a3b]">-{formatCAD(result.amtExemptionApplied)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#ece6da]">
                    <span className="text-[#46423a] font-sans">{isFr ? "Assiette nette d'IMR :" : "Net AMT Base Subject to Tax:"}</span>
                    <span className="font-bold text-[#1c1b18]">{formatCAD(result.amtTaxableBase)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#ece6da]">
                    <span className="text-[#46423a] font-sans">{isFr ? "Taux fixe d'IMR fédéral :" : "Federal AMT Statutory Rate:"}</span>
                    <span className="text-[#1c1b18]">20.5%</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#ece6da]">
                    <span className="text-[#46423a] font-sans">{isFr ? "IMR brut avant crédits :" : "Gross AMT Before Credits:"}</span>
                    <span className="text-[#1c1b18]">{formatCAD(result.amtGrossTax)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#ece6da]">
                    <span className="text-[#46423a] font-sans">{isFr ? "Crédits IMR admis (art. 127.531) :" : "Allowed AMT Credits (s. 127.531):"}</span>
                    <span className="text-[#2e4a3b]">-{formatCAD(result.amtCreditsAllowed)}</span>
                  </div>
                  <div className="flex justify-between py-1 pt-2 font-bold text-xs bg-white p-2 rounded-[2px] border border-[#d6cebd]">
                    <span className="text-[#1c1b18] font-sans">{isFr ? "Impôt fédéral dû (le plus élevé) :" : "Total Federal Tax Due:"}</span>
                    <span className={result.amtApplies ? "text-[#8a3324]" : "text-[#2e4a3b]"}>
                      {formatCAD(result.totalFederalTaxPayable)}
                    </span>
                  </div>
                </div>

                {/* Honest Scope Note in Results Panel */}
                <div className="pt-2 border-t border-[#ece6da] text-[10px] text-[#75581f] leading-relaxed">
                  <p>{unmodelledDisclaimer}</p>
                </div>
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
      <section className="section py-12 bg-[#fcfaf5] border-t border-[#d6cebd]">
        <div className="wrap max-w-4xl space-y-6">
          <div className="border-b border-[#ece6da] pb-3">
            <span className="text-[0.68rem] uppercase tracking-wider text-[#75581f] font-bold block mb-1">
              {isFr ? "Démonstration Chiffrée" : "Comprehensive Scenario"}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#1c1b18]">
              {isFr ? "Exemple Hypothétique Traité" : "Hypothetical Worked Example"}
            </h2>
            <p className="text-xs sm:text-sm text-[#625d52] mt-1">
              {isFr
                ? "Démonstration chiffrée selon les règles des lois C-59 et C-69 pour l'année d'imposition 2024."
                : "Step-by-step arithmetic calibrated strictly to 2024 Bills C-59 and C-69 statutory rules."}
            </p>
          </div>

          <div className="p-5 sm:p-6 bg-white border border-[#d6cebd] rounded-[2px] space-y-4 text-xs sm:text-sm text-[#46423a] leading-relaxed shadow-xs">
            <p>
              {isFr ? (
                <>
                  Considérons <strong>Alexandre</strong>, un professionnel cadre résidant au Canada. En 2024, il touche un
                  salaire d'emploi T4 de <strong>120 000 $</strong>. Durant l'année, il vend un portefeuille d'actions hors
                  régime enregistré et réalise un gain en capital de <strong>400 000 $</strong>. En fin d'année, il verse un don
                  de bienfaisance de <strong>30 000 $</strong> à un organisme de bienfaisance enregistré canadien, et réclame
                  5 000 $ de déductions pour frais de garde.
                </>
              ) : (
                <>
                  Consider <strong>Alex</strong>, an executive in Canada. In 2024, Alex earns <strong>$120,000</strong> in
                  regular T4 salary. During the year, Alex sells non-registered equities, realizing a <strong>$400,000</strong>{" "}
                  gross capital gain. To support a community cause, Alex makes a <strong>$30,000</strong> donation to a
                  registered Canadian charity and claims $5,000 in child care deductions.
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
                <tbody className="divide-y divide-[#ece6da] font-mono text-[11px]">
                  <tr className="hover:bg-[#fcfaf5]">
                    <td className="p-3 font-sans font-medium text-[#1c1b18]">{isFr ? "Salaire T4" : "T4 Salary"}</td>
                    <td className="p-3">$120,000</td>
                    <td className="p-3">$120,000</td>
                    <td className="p-3 font-sans text-[#625d52]">{isFr ? "Inclus à 100 % dans les deux calculs" : "100% included in both"}</td>
                  </tr>
                  <tr className="hover:bg-[#fcfaf5]">
                    <td className="p-3 font-sans font-medium text-[#1c1b18]">{isFr ? "Gain en capital (400 000 $)" : "Capital Gain ($400,000)"}</td>
                    <td className="p-3">$200,000 (50%)</td>
                    <td className="p-3 font-bold text-[#8a3324]">$400,000 (100%)</td>
                    <td className="p-3 font-sans text-[#625d52]">
                      {isFr ? "L'IMR inclut 100 % du gain (vs 50 % régulier)" : "AMT mandates 100% inclusion under Bill C-59"}
                    </td>
                  </tr>
                  <tr className="hover:bg-[#fcfaf5]">
                    <td className="p-3 font-sans font-medium text-[#1c1b18]">{isFr ? "Déductions (5 000 $)" : "Deductions ($5,000)"}</td>
                    <td className="p-3">-$5,000 (100%)</td>
                    <td className="p-3">-$2,500 (50%)</td>
                    <td className="p-3 font-sans text-[#625d52]">
                      {isFr ? "Déductions admissibles plafonnées à 50 % sous IMR" : "Deductions capped at 50% under AMT"}
                    </td>
                  </tr>
                  <tr className="hover:bg-[#fcfaf5] bg-[#ece6da]/30">
                    <td className="p-3 font-sans font-bold text-[#1c1b18]">{isFr ? "Revenu Imposable" : "Taxable Base"}</td>
                    <td className="p-3 font-bold">$315,000</td>
                    <td className="p-3 font-bold text-[#8a3324]">$517,500</td>
                    <td className="p-3 font-sans text-[#625d52]">{isFr ? "Écart d'assiette de 202 500 $" : "$202,500 wider taxable base"}</td>
                  </tr>
                  <tr className="hover:bg-[#fcfaf5]">
                    <td className="p-3 font-sans font-medium text-[#1c1b18]">{isFr ? "Exemption de base" : "Basic Exemption"}</td>
                    <td className="p-3">{isFr ? "S/O (Barème par tranches)" : "N/A (Graduated brackets)"}</td>
                    <td className="p-3 font-bold text-[#2e4a3b]">-$173,205</td>
                    <td className="p-3 font-sans text-[#625d52]">{isFr ? "Exemption fédérale 2024 indexée" : "Indexed 2024 4th bracket threshold"}</td>
                  </tr>
                  <tr className="hover:bg-[#fcfaf5]">
                    <td className="p-3 font-sans font-medium text-[#1c1b18]">{isFr ? "Crédits Dons (30 000 $)" : "Donation Tax Credit ($30,000)"}</td>
                    <td className="p-3">-$8,700 (100%)</td>
                    <td className="p-3 font-bold text-[#2e4a3b]">-$6,960 (80%)</td>
                    <td className="p-3 font-sans text-[#625d52]">
                      {isFr ? "Crédit pour dons admis à 80 % sous l'IMR (loi C-69)" : "Donation credit allowed at 80% under Bill C-69"}
                    </td>
                  </tr>
                  <tr className="hover:bg-[#fcfaf5] bg-[#fdf0ed]">
                    <td className="p-3 font-sans font-bold text-[#1c1b18]">{isFr ? "Impôt Fédéral Net" : "Net Federal Tax"}</td>
                    <td className="p-3 font-bold">$61,260</td>
                    <td className="p-3 font-bold text-[#8a3324]">$63,620</td>
                    <td className="p-3 font-sans text-[#8a3324] font-medium">
                      {isFr ? "L'IMR dépasse l'impôt régulier de 2 360 $" : "AMT exceeds regular tax by $2,360"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-xs text-[#625d52] pt-1 leading-relaxed">
              {isFr
                ? "Résultat : Alexandre doit verser 2 360 $ de taxe fédérale supplémentaire en 2024. Cependant, ces 2 360 $ ne sont pas perdus : ils constituent un crédit de report d'IMR en vertu de l'article 120.2 de la LIR, récupérable sur les 7 années suivantes dès que son impôt régulier dépassera son IMR."
                : "Result: Alex pays $2,360 in additional federal tax for 2024. Crucially, this $2,360 is not permanently lost: under Section 120.2 of the Income Tax Act, it creates an AMT carry-forward credit that can be applied to reduce regular tax over the next 7 years."}
            </p>
          </div>
        </div>
      </section>

      {/* Plain-Language Explanations */}
      <section className="section py-12 md:py-16">
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
                <span className="text-[0.68rem] font-mono uppercase tracking-wider text-[#d6c298] font-bold block">
                  {isFr ? "Guide Stratégique Approfondi" : "In-Depth Editorial Guide"}
                </span>
                <h3 className="font-serif text-lg sm:text-xl font-medium text-[#f7f3eb]">
                  {isFr
                    ? "L'impôt minimum de remplacement canadien : Guide pour hauts revenus"
                    : "The Canadian Alternative Minimum Tax (AMT): Navigating Post-2024 Reform"}
                </h3>
                <p className="text-xs text-[#ece6da] max-w-xl">
                  {isFr
                    ? "Explorez notre analyse détaillée sur l'exemption pour gains en capital (EDGC), la vente d'actions admissibles de petite entreprise et les stratégies de dons philanthropiques."
                    : "Read our comprehensive briefing on Lifetime Capital Gains Exemption (LCGE) friction, QSBC share exits, and structured philanthropic donation sequencing."}
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
      <section className="section py-12 bg-[#fcfaf5] border-t border-[#d6cebd]">
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
                    className="w-full p-4 text-left flex items-center justify-between gap-3 hover:bg-[#fcfaf5] transition-colors"
                  >
                    <span className="font-serif text-sm sm:text-base font-semibold text-[#1c1b18] leading-snug">
                      {faq.q}
                    </span>
                    <span className="p-1 text-[#75581f] shrink-0">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="p-4 pt-1 text-xs sm:text-sm text-[#46423a] leading-relaxed border-t border-[#ece6da] bg-[#fcfaf5]/40 animate-fadeIn">
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
      <section className="section py-12 md:py-16 border-t border-[#d6cebd]">
        <div className="wrap max-w-4xl space-y-8">
          <div className="p-5 bg-[#ece6da]/50 border-l-3 border-[#8d8677] text-xs text-[#46423a] leading-relaxed space-y-2">
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
            <h2 className="font-serif text-2xl sm:text-3xl text-[#1c1b18]">
              {isFr
                ? "Vous préparez une vente d'entreprise ou une transaction majeure ?"
                : "Planning a major liquidity event or business exit?"}
            </h2>
            <p className="text-sm text-[#46423a] max-w-xl mx-auto">
              {isFr
                ? "Planifiez un entretien introductif de 30 minutes avec Ahmed Bello pour examiner vos options de structuration sans aucune démarche commerciale."
                : "Schedule a 30-minute introductory conversation with Ahmed Bello to review your multi-year balance sheet and tax structure with zero sales pressure."}
            </p>
            <div className="pt-2">
              <a
                href="https://calendly.com/olabel/30min"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackBookingClick("amt_calculator_bottom")}
                className="btn btn-primary text-xs sm:text-sm px-6 py-3 inline-flex items-center gap-2"
              >
                <Calendar className="w-4 h-4 text-[#d6c298]" />
                <span>{isFr ? "Réserver un appel de 30 minutes sur Calendly" : "Schedule 30-Min Call on Calendly"}</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
