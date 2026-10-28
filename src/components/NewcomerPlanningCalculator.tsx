import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Calculator,
  Compass,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Clock,
  ShieldAlert,
  Sparkles,
  BookOpen,
  Building,
  GraduationCap,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext.tsx";

interface NewcomerPlanningCalculatorProps {
  className?: string;
  defaultProfession?: "general" | "healthcare" | "tech";
}

export const NewcomerPlanningCalculator: React.FC<NewcomerPlanningCalculatorProps> = ({
  className = "",
  defaultProfession = "general",
}) => {
  const { language } = useLanguage();
  const isFr = language === "fr";

  // Calculator Inputs
  const [householdType, setHouseholdType] = useState<"single" | "couple" | "family">("couple");
  const [professionTrack, setProfessionTrack] = useState<"healthcare" | "regulated" | "general">(
    defaultProfession === "healthcare" ? "healthcare" : "regulated"
  );
  const [monthsToLicense, setMonthsToLicense] = useState<number>(10);
  const [monthlyRent, setMonthlyRent] = useState<number>(2100);
  const [monthlyLiving, setMonthlyLiving] = useState<number>(1400);
  const [licensingFees, setLicensingFees] = useState<number>(6500);
  const [setupCosts, setSetupCosts] = useState<number>(4500);
  const [interimMonthlyIncome, setInterimMonthlyIncome] = useState<number>(1200);
  const [currentSavings, setCurrentSavings] = useState<number>(35000);

  // Quick Presets
  const applyPreset = (preset: "physician_nurse" | "it_engineer" | "general_newcomer") => {
    if (preset === "physician_nurse") {
      setProfessionTrack("healthcare");
      setMonthsToLicense(12);
      setLicensingFees(7500);
      setSetupCosts(5000);
      setMonthlyRent(2200);
      setMonthlyLiving(1500);
      setInterimMonthlyIncome(800);
    } else if (preset === "it_engineer") {
      setProfessionTrack("regulated");
      setMonthsToLicense(6);
      setLicensingFees(2500);
      setSetupCosts(4000);
      setMonthlyRent(2100);
      setMonthlyLiving(1300);
      setInterimMonthlyIncome(1500);
    } else {
      setProfessionTrack("general");
      setMonthsToLicense(6);
      setLicensingFees(1200);
      setSetupCosts(3500);
      setMonthlyRent(1900);
      setMonthlyLiving(1200);
      setInterimMonthlyIncome(1800);
    }
  };

  // Calculations
  const calculations = useMemo(() => {
    const totalMonthlyCost = monthlyRent + monthlyLiving;
    const netMonthlyBurn = Math.max(0, totalMonthlyCost - interimMonthlyIncome);
    const livingGapTotal = netMonthlyBurn * monthsToLicense;
    const initialOneTimeTotal = licensingFees + setupCosts;
    const recommendedBuffer = Math.round(totalMonthlyCost * 2); // 2 months emergency cushion
    const totalTargetNeeded = livingGapTotal + initialOneTimeTotal + recommendedBuffer;
    const variance = currentSavings - totalTargetNeeded;
    const runwayMonths =
      netMonthlyBurn > 0 ? Math.floor((currentSavings - initialOneTimeTotal) / netMonthlyBurn) : 99;

    return {
      totalMonthlyCost,
      netMonthlyBurn,
      livingGapTotal,
      initialOneTimeTotal,
      recommendedBuffer,
      totalTargetNeeded,
      variance,
      runwayMonths: Math.max(0, runwayMonths),
      isShortfall: variance < 0,
    };
  }, [
    monthlyRent,
    monthlyLiving,
    interimMonthlyIncome,
    monthsToLicense,
    licensingFees,
    setupCosts,
    currentSavings,
  ]);

  return (
    <div
      className={`bg-[#fcfaf5] border-2 border-[#2e4a3b] p-6 sm:p-8 lg:p-10 rounded-[2px] shadow-sm ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#d6cebd]">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-[#2e4a3b]/10 text-[#2e4a3b] rounded-[2px] text-xs font-semibold uppercase tracking-wider mb-2">
            <Calculator className="w-3.5 h-3.5 text-[#75581f]" />
            <span>
              {isFr
                ? "Simulateur financier pour nouveaux arrivants"
                : "Interactive First-Year Runway Planner"}
            </span>
          </div>
          <h3
            className="font-serif text-2xl sm:text-3xl text-[#1c1b18] tracking-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {isFr
              ? "Calculateur des besoins financiers de 1re année"
              : "Newcomer First-Year Financial Runway Calculator"}
          </h3>
          <p className="text-xs sm:text-sm text-[#46423a] mt-1 max-w-2xl leading-relaxed">
            {isFr
              ? "Évaluez l'épargne initiale nécessaire pour couvrir vos coûts de subsistance, l'évaluation de vos diplômes et les examens professionnels avant le début de votre plein revenu."
              : "Estimate the realistic savings needed to navigate credential recognition, provincial licensing exams, and living expenses before your Canadian professional income begins."}
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-1.5 shrink-0">
          <span className="text-[0.7rem] uppercase tracking-wider text-[#75581f] font-semibold mr-1">
            {isFr ? "Profils :" : "Presets:"}
          </span>
          <button
            type="button"
            onClick={() => applyPreset("physician_nurse")}
            className="px-2.5 py-1 text-xs bg-[#f7f3eb] hover:bg-[#2e4a3b] hover:text-[#f7f3eb] border border-[#d6cebd] rounded-[2px] transition-colors"
          >
            {isFr ? "Médecin / Infirmier" : "Doctor / Nurse"}
          </button>
          <button
            type="button"
            onClick={() => applyPreset("it_engineer")}
            className="px-2.5 py-1 text-xs bg-[#f7f3eb] hover:bg-[#2e4a3b] hover:text-[#f7f3eb] border border-[#d6cebd] rounded-[2px] transition-colors"
          >
            {isFr ? "Génie / Informatique" : "Engineer / IT"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
        {/* Left Inputs (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Timeline & Gap */}
          <div className="p-4 bg-[#f7f3eb] border border-[#d6cebd] rounded-[2px] space-y-3">
            <div className="flex items-center justify-between">
              <label
                htmlFor="input-months"
                className="text-xs font-semibold text-[#1c1b18] uppercase tracking-wider flex items-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5 text-[#75581f]" />
                <span>
                  {isFr
                    ? "1. Délai estimé avant premier salaire professionnel"
                    : "1. Estimated Months to First Professional Salary"}
                </span>
              </label>
              <span className="font-serif text-lg font-bold text-[#2e4a3b]">
                {monthsToLicense} {isFr ? "mois" : "months"}
              </span>
            </div>
            <input
              id="input-months"
              type="range"
              min="3"
              max="24"
              step="1"
              value={monthsToLicense}
              onChange={(e) => setMonthsToLicense(Number(e.target.value))}
              className="w-full accent-[#2e4a3b] cursor-pointer"
            />
            <div className="flex justify-between text-[0.7rem] text-[#625d52]">
              <span>3 {isFr ? "mois" : "mos"} (Rapide)</span>
              <span>12 {isFr ? "mois" : "mos"} (Moyenne santé)</span>
              <span>24 {isFr ? "mois" : "mos"} (Spécialités)</span>
            </div>
          </div>

          {/* Section 2: Monthly Living Expenses */}
          <div className="p-4 bg-[#f7f3eb] border border-[#d6cebd] rounded-[2px] space-y-4">
            <h4 className="text-xs font-semibold text-[#1c1b18] uppercase tracking-wider flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-[#75581f]" />
              <span>
                {isFr ? "2. Dépenses mensuelles du ménage (CAD)" : "2. Monthly Household Expenses (CAD)"}
              </span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="input-rent" className="block text-[0.75rem] text-[#625d52] mb-1">
                  {isFr ? "Loyer & Charges (chauffage, élec)" : "Rent & Utilities (heat, hydro)"}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs text-[#75581f]">$</span>
                  <input
                    id="input-rent"
                    type="number"
                    value={monthlyRent}
                    onChange={(e) => setMonthlyRent(Number(e.target.value) || 0)}
                    className="w-full text-xs p-2 pl-7 bg-white border border-[#d6cebd] rounded-[2px] focus:outline-none focus:border-[#2e4a3b]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="input-living" className="block text-[0.75rem] text-[#625d52] mb-1">
                  {isFr ? "Épicerie, transport, cellulaire" : "Food, transit, phone & internet"}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs text-[#75581f]">$</span>
                  <input
                    id="input-living"
                    type="number"
                    value={monthlyLiving}
                    onChange={(e) => setMonthlyLiving(Number(e.target.value) || 0)}
                    className="w-full text-xs p-2 pl-7 bg-white border border-[#d6cebd] rounded-[2px] focus:outline-none focus:border-[#2e4a3b]"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="input-income" className="block text-[0.75rem] text-[#625d52] mb-1">
                {isFr
                  ? "Revenu mensuel transitoire ou conjoint (si applicable)"
                  : "Interim Monthly Survival / Partner Income (if any)"}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs text-[#75581f]">$</span>
                <input
                  id="input-income"
                  type="number"
                  value={interimMonthlyIncome}
                  onChange={(e) => setInterimMonthlyIncome(Number(e.target.value) || 0)}
                  className="w-full text-xs p-2 pl-7 bg-white border border-[#d6cebd] rounded-[2px] focus:outline-none focus:border-[#2e4a3b]"
                />
              </div>
              <p className="text-[0.68rem] text-[#625d52] mt-1 italic">
                {isFr
                  ? "Emploi de transition ou allocations familiales du Canada (CCB une fois admissible)."
                  : "Bridge employment, survival jobs, or Canada Child Benefit once eligible."}
              </p>
            </div>
          </div>

          {/* Section 3: Professional Fees & Arrival Setup */}
          <div className="p-4 bg-[#f7f3eb] border border-[#d6cebd] rounded-[2px] space-y-4">
            <h4 className="text-xs font-semibold text-[#1c1b18] uppercase tracking-wider flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-[#75581f]" />
              <span>
                {isFr
                  ? "3. Frais de reconnaissance & Installation initiale"
                  : "3. Credential Recognition & Initial Setup Costs"}
              </span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="input-licensing" className="block text-[0.75rem] text-[#625d52] mb-1">
                  {isFr ? "Examens, traductions, ordres pros" : "Exam fees, WES/college licensing"}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs text-[#75581f]">$</span>
                  <input
                    id="input-licensing"
                    type="number"
                    value={licensingFees}
                    onChange={(e) => setLicensingFees(Number(e.target.value) || 0)}
                    className="w-full text-xs p-2 pl-7 bg-white border border-[#d6cebd] rounded-[2px] focus:outline-none focus:border-[#2e4a3b]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="input-setup" className="block text-[0.75rem] text-[#625d52] mb-1">
                  {isFr ? "Dépôt loyer, vêtements d'hiver, meubles" : "Rental deposit, winter gear, basic setup"}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs text-[#75581f]">$</span>
                  <input
                    id="input-setup"
                    type="number"
                    value={setupCosts}
                    onChange={(e) => setSetupCosts(Number(e.target.value) || 0)}
                    className="w-full text-xs p-2 pl-7 bg-white border border-[#d6cebd] rounded-[2px] focus:outline-none focus:border-[#2e4a3b]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Current Savings Available */}
          <div className="p-4 bg-[#f7f3eb] border border-[#d6cebd] rounded-[2px] space-y-2">
            <label
              htmlFor="input-savings"
              className="text-xs font-semibold text-[#1c1b18] uppercase tracking-wider flex items-center gap-1.5"
            >
              <DollarSign className="w-3.5 h-3.5 text-[#75581f]" />
              <span>
                {isFr
                  ? "4. Épargne totale disponible à l'arrivée (CAD)"
                  : "4. Total Liquid Savings Available on Arrival (CAD)"}
              </span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-sm text-[#75581f]">$</span>
              <input
                id="input-savings"
                type="number"
                value={currentSavings}
                onChange={(e) => setCurrentSavings(Number(e.target.value) || 0)}
                className="w-full text-sm font-semibold p-2.5 pl-8 bg-white border border-[#d6cebd] rounded-[2px] focus:outline-none focus:border-[#2e4a3b]"
              />
            </div>
          </div>
        </div>

        {/* Right Outputs & Strategic Assessment (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          {/* Main Assessment Card */}
          <div
            className={`p-6 rounded-[2px] border ${
              calculations.isShortfall
                ? "bg-[#14211a] text-[#f7f3eb] border-[#2e4a3b]"
                : "bg-[#2e4a3b] text-[#f7f3eb] border-[#2e4a3b]"
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#d6c298]/30">
              <span className="text-[0.7rem] uppercase tracking-wider text-[#d6c298] font-semibold">
                {isFr ? "Bilan de survie financière" : "First-Year Runway Analysis"}
              </span>
              <span className="text-xs font-mono px-2 py-0.5 bg-white/10 rounded-[2px] text-[#f7f3eb]">
                {calculations.runwayMonths} {isFr ? "mois d'autonomie" : "months runway"}
              </span>
            </div>

            <div className="mt-4 space-y-1">
              <span className="text-xs text-[#ece6da]/80">
                {isFr ? "Cible totale requise (1re année) :" : "Total Capital Target Needed:"}
              </span>
              <div className="font-serif text-3xl sm:text-4xl text-[#d6c298]">
                ${calculations.totalTargetNeeded.toLocaleString()}
              </div>
            </div>

            {/* Variance Alert */}
            <div className="mt-4 pt-4 border-t border-[#d6c298]/20 flex items-start gap-2.5">
              {calculations.isShortfall ? (
                <AlertTriangle className="w-5 h-5 text-[#d97768] shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-[#d6c298] shrink-0 mt-0.5" />
              )}
              <div>
                <p className="text-sm font-semibold text-[#f7f3eb]">
                  {calculations.isShortfall
                    ? isFr
                      ? `Écart à financer : -${Math.abs(calculations.variance).toLocaleString()}$ CAD`
                      : `Funding Shortfall: -$${Math.abs(calculations.variance).toLocaleString()} CAD`
                    : isFr
                    ? `Coussin excédentaire : +${calculations.variance.toLocaleString()}$ CAD`
                    : `Surplus Cushion: +$${calculations.variance.toLocaleString()} CAD`}
                </p>
                <p className="text-xs text-[#ece6da]/80 mt-1 leading-relaxed">
                  {calculations.isShortfall
                    ? isFr
                      ? `Vos économies actuelles couvrent environ ${calculations.runwayMonths} mois sur les ${monthsToLicense} mois prévus. Envisagez un prêt fédéral de reconnaissance des titres (jusqu'à 30 000 $) ou un emploi de transition.`
                      : `Your current savings cover approximately ${calculations.runwayMonths} of the ${monthsToLicense} months required. Consider looking into Foreign Credential Recognition loans (up to $30,000) or bridging work.`
                    : isFr
                    ? "Votre réserve couvre le calendrier prévu avec un coussin de sécurité de 2 mois pour parer aux imprévus d'examens ou de logistique."
                    : "Your reserves satisfy the planned gap timeline with a dedicated 2-month emergency safety buffer for licensing or relocation delays."}
                </p>
              </div>
            </div>

            {/* Cost Breakdown Details */}
            <div className="mt-6 pt-4 border-t border-[#d6c298]/20 space-y-2 text-xs">
              <div className="flex justify-between text-[#ece6da]/80">
                <span>{isFr ? "Dépenses de subsistance nettes :" : "Living Gap Burn:"}</span>
                <span className="font-semibold text-white">
                  ${calculations.livingGapTotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-[#ece6da]/80">
                <span>{isFr ? "Examens & Ordres pros :" : "Licensing & Exams:"}</span>
                <span className="font-semibold text-white">
                  ${licensingFees.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-[#ece6da]/80">
                <span>{isFr ? "Frais d'installation & Dépôt :" : "Initial Setup & Deposits:"}</span>
                <span className="font-semibold text-white">
                  ${setupCosts.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-[#ece6da]/80">
                <span>{isFr ? "Coussin d'urgence (2 mois) :" : "2-Month Emergency Buffer:"}</span>
                <span className="font-semibold text-[#d6c298]">
                  ${calculations.recommendedBuffer.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Educational Linkage */}
          <div className="p-4 bg-[#f7f3eb] border border-[#d6cebd] rounded-[2px] text-xs space-y-2">
            <span className="font-semibold text-[#1c1b18] block">
              {isFr ? "Ressource officielle liée :" : "Relevant Guide from the Library:"}
            </span>
            <Link
              to="/education/internationally-trained-doctors-nurses-first-year"
              className="text-[#2e4a3b] font-serif text-sm hover:underline block leading-snug"
            >
              {isFr
                ? "Médecins et infirmiers formés à l'étranger : votre 1re année d'argent au Canada →"
                : "Internationally trained doctors and nurses: your first year of money in Canada &rarr;"}
            </Link>
            <p className="text-[0.7rem] text-[#625d52]">
              {isFr
                ? "Comprenez la résidence fiscale, les plafonds du CELI et la déclaration T1135 des avoirs étrangers."
                : "Learn about tax residency timing, TFSA start rules, and CRA Form T1135 foreign property reporting."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
