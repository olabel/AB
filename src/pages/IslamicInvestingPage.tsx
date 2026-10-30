import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.tsx";
import { SEO } from "../components/SEO.tsx";
import { siteConfig } from "../config/site.ts";
import { IslamicIndexPerformanceChart } from "../components/IslamicIndexPerformanceChart.tsx";
import {
  ShieldCheck,
  TrendingUp,
  Landmark,
  Scale,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Calculator,
  Lock,
  Building2,
  GraduationCap,
  Home,
  Briefcase,
  HelpCircle,
  FileText,
  Calendar,
  Sparkles,
  ExternalLink,
  Percent,
} from "lucide-react";

export const IslamicInvestingPage: React.FC = () => {
  const { isFr } = useLanguage();

  // Balanced Multi-Scenario Simulator State
  const [initialCapital, setInitialCapital] = useState<number>(25000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(500);
  const [years, setYears] = useState<number>(10);
  const [cashInterestRate, setCashInterestRate] = useState<number>(2.0); // 2.0% high-yield cash return
  const [equityScenario, setEquityScenario] = useState<"conservative" | "balanced" | "dynamic">("balanced");
  const [estimatedFeeDrag, setEstimatedFeeDrag] = useState<number>(1.5); // 1.5% MER / management expense

  // Lead Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    cityProvince: "",
    accountType: "tfsa",
    estimatedAmount: "25k-50k",
    currentBank: "",
    notes: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Financial Calculations
  const inflationRate = 0.025; // 2.5% central bank target inflation
  const months = years * 12;

  // Gross equity rates by scenario
  const grossReturn =
    equityScenario === "conservative" ? 4.5 : equityScenario === "balanced" ? 6.5 : 8.5;
  const netEquityReturn = Math.max(0.5, grossReturn - estimatedFeeDrag);

  // Compound Growth in Net Equity Strategy
  const monthlyEquityRate = Math.pow(1 + netEquityReturn / 100, 1 / 12) - 1;
  let equityNominal = initialCapital;
  for (let m = 0; m < months; m++) {
    equityNominal = equityNominal * (1 + monthlyEquityRate) + monthlyContribution;
  }

  // Compound Growth in Cash / High-Interest Savings Account
  const monthlyCashRate = Math.pow(1 + cashInterestRate / 100, 1 / 12) - 1;
  let cashNominal = initialCapital;
  for (let m = 0; m < months; m++) {
    cashNominal = cashNominal * (1 + monthlyCashRate) + monthlyContribution;
  }

  // Total Capital Out of Pocket
  const totalPrincipal = initialCapital + monthlyContribution * months;

  // Real purchasing power after inflation (2.5%)
  const discountFactor = Math.pow(1 + inflationRate, years);
  const cashRealValue = cashNominal / discountFactor;
  const equityRealValue = equityNominal / discountFactor;

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setFormSubmitted(true);
    }, 600);
  };

  return (
    <div className="py-10 md:py-16 bg-[#f7f3eb]">
      <SEO
        title={
          isFr
            ? "Investissement en Actions Islamiques & Cadre Éducatif Canadien | Ahmed Bello"
            : "Shari'ah-Compliant Global Equity Index Investing | Canadian Educational Framework"
        }
        description={
          isFr
            ? "Cadre éducatif objectif sur l'investissement en actions islamiques selon les normes AAOIFI. Réplication d'indices (MSCI ACWI Islamic) et intégration dans les régimes enregistrés canadiens (CELI, REER, CELIAPP, REEE)."
            : "Objective educational guide on Shari'ah-compliant global equity index investing under AAOIFI standards. Benchmark tracking (MSCI ACWI Islamic Index) and Canadian registered accounts (TFSA, RRSP, FHSA, RESP, Corporate)."
        }
        canonicalUrl={isFr ? "/fr/investing/islamic-equity" : "/investing/islamic-equity"}
        keywords={[
          "Shariah compliant investing Canada",
          "Islamic equity index Canada",
          "Halal investing TFSA RRSP",
          "AAOIFI screening standards Canada",
          "MSCI ACWI Islamic Index",
          "Halal financial planning Canada",
          "Investissement islamique Canada",
          "Actions halal CELI REER",
        ]}
      />

      <div className="wrap max-w-5xl">
        {/* 1. HERO SECTION */}
        <section className="mb-16 border-b border-[#d6cebd] pb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#2e4a3b]/10 border border-[#2e4a3b]/30 rounded-xs text-xs font-semibold text-[#2e4a3b] uppercase tracking-wider mb-5">
            <ShieldCheck className="w-4 h-4 text-[#2e4a3b]" />
            <span>
              {isFr
                ? "Cadre Éducatif d'Investissement Indépendant"
                : "Independent Financial Education Framework"}
            </span>
          </div>

          <h1
            className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#1c1b18] tracking-tight mb-6 leading-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {isFr
              ? "Investissement en Actions Islamiques au Canada : Comprendre les Règles, Indices & Abris Fiscaux."
              : "Shari'ah-Compliant Global Equity Index Investing in Canada: Principles, Benchmarks & Tax Shelters."}
          </h1>

          <p className="text-lg sm:text-xl text-[#46423a] max-w-3xl leading-relaxed mb-8 font-serif">
            {isFr
              ? "Une analyse pédagogique et indépendante de l'investissement conforme à la charia selon les normes internationales de l'AAOIFI. Découvrez le fonctionnement des indices mondiaux de référence (comme le MSCI ACWI Islamic), les règles de filtrage de bilan et leur intégration dans vos comptes enregistrés canadiens."
              : "An objective educational framework for Muslim Canadian families and business owners exploring Shari'ah-compliant global equity investing under international AAOIFI standards. Learn how benchmark index tracking works, how balance sheet purification applies, and how registered tax shelters connect."}
          </p>

          {/* Institutional Knowledge Matrix */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-8">
            <div className="p-3.5 bg-[#fcfaf5] border border-[#d6cebd] rounded-xs">
              <span className="text-[0.68rem] uppercase tracking-wider text-[#75581f] font-semibold block mb-1">
                {isFr ? "Indice de Référence" : "Benchmark Standard"}
              </span>
              <span className="font-serif text-base font-bold text-[#1c1b18] block">
                MSCI ACWI Islamic
              </span>
              <span className="text-[0.7rem] text-[#625d52]">{isFr ? "Actions mondiales filtrées" : "Global Screened Equities"}</span>
            </div>

            <div className="p-3.5 bg-[#fcfaf5] border border-[#d6cebd] rounded-xs">
              <span className="text-[0.68rem] uppercase tracking-wider text-[#75581f] font-semibold block mb-1">
                {isFr ? "Cadre de Gouvernance" : "Screening Standard"}
              </span>
              <span className="font-serif text-base font-bold text-[#1c1b18] block">
                AAOIFI Standard
              </span>
              <span className="text-[0.7rem] text-[#625d52]">{isFr ? "Comité Sharia indépendant" : "Independent Shariah Board"}</span>
            </div>

            <div className="p-3.5 bg-[#fcfaf5] border border-[#d6cebd] rounded-xs">
              <span className="text-[0.68rem] uppercase tracking-wider text-[#75581f] font-semibold block mb-1">
                {isFr ? "Abris Fiscaux Canadiens" : "Eligible Tax Shelters"}
              </span>
              <span className="font-serif text-base font-bold text-[#1c1b18] block">
                TFSA, RRSP, FHSA
              </span>
              <span className="text-[0.7rem] text-[#625d52]">{isFr ? "REEE & Sociétés (SPCC)" : "RESP & Corporate CCPCs"}</span>
            </div>

            <div className="p-3.5 bg-[#fcfaf5] border border-[#d6cebd] rounded-xs">
              <span className="text-[0.68rem] uppercase tracking-wider text-[#75581f] font-semibold block mb-1">
                {isFr ? "Accès Indépendant" : "Access Facilitation"}
              </span>
              <span className="font-serif text-base font-bold text-[#1c1b18] block">
                Multi-Carrier
              </span>
              <span className="text-[0.7rem] text-[#625d52]">{isFr ? "Institutions autorisées au Canada" : "Licensed Canadian Carriers"}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#performance-chart"
              className="px-5 py-3 bg-[#2e4a3b] hover:bg-[#253d30] text-[#f7f3eb] font-semibold text-sm rounded-xs transition-colors shadow-xs inline-flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4 text-[#d6c298]" />
              <span>{isFr ? "Consulter l'Historique de l'Indice" : "Explore Benchmark Historical Trend"}</span>
            </a>

            <a
              href="#simulator"
              className="px-5 py-3 bg-[#fcfaf5] hover:bg-[#ece6da] text-[#1c1b18] border border-[#d6cebd] font-medium text-sm rounded-xs transition-colors inline-flex items-center gap-2"
            >
              <Calculator className="w-4 h-4 text-[#2e4a3b]" />
              <span>{isFr ? "Simulateur Comparatif Équilibré" : "Balanced Multi-Scenario Simulator"}</span>
            </a>
          </div>
        </section>

        {/* 2. THE MATHEMATICAL REALITY OF IDLE CASH & INFLATION */}
        <section className="mb-16 p-6 sm:p-8 bg-[#1a2c22] text-[#f7f3eb] rounded-xs border border-[#2e4a3b] relative overflow-hidden">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#d6c298]">
              <AlertTriangle className="w-4 h-4 text-[#d6c298]" />
              <span>{isFr ? "Réalité Financière : L'Érosion par l'Inflation" : "Financial Reality: The Drag of Inflation on Liquid Assets"}</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl text-[#f7f3eb] leading-snug">
              {isFr
                ? "L'impact mathématique de l'inflation sur les liquidités stagnantes."
                : "The mathematical impact of persistent inflation on idle liquidity."}
            </h2>

            <p className="text-sm sm:text-base text-[#ece6da]/90 leading-relaxed">
              {isFr
                ? "Par souci légitime d'éviter les intérêts (Riba) et les instruments financiers non conformes, de nombreuses familles et professionnels musulmans conservent des sommes importantes sur des comptes chèques ou des comptes sans rendement. Cependant, à un taux d'inflation annuel moyen de 2 % à 3 %, un montant de 100 000 $ en liquidités perd entre 18 000 $ et 25 600 $ de pouvoir d'achat réel sur 10 ans (17 965 $ à 2,0 %, 21 880 $ à 2,5 % et 25 591 $ à 3,0 %). Comprendre les options d'investissement productif permet de préserver le patrimoine familial sans compromettre vos principes."
                : "Out of a principled commitment to avoid conventional interest (Riba) and doubtful financial instruments, many Canadian Muslim families maintain substantial reserves in zero-return bank accounts. However, at a standard 2% to 3% annual inflation rate, $100,000 held in cash loses approximately $18,000 to $25,600 of purchasing power over a 10-year period ($17,965 at 2.0%, $21,880 at 2.5%, and $25,591 at 3.0%). Understanding productive equity participation provides a disciplined pathway to protect household purchasing power while maintaining adherence to Islamic commercial jurisprudence."}
            </p>

            <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-[#24392e] rounded-xs border border-[#2e4a3b]">
                <div className="text-[#d6c298] font-bold text-sm mb-0.5">{isFr ? "Exclusion du Riba" : "Zero Interest Debt"}</div>
                <div className="text-[#ece6da]/80">{isFr ? "Élimination des obligations et banques d'intérêt" : "Zero conventional debt or bond financing"}</div>
              </div>
              <div className="p-3 bg-[#24392e] rounded-xs border border-[#2e4a3b]">
                <div className="text-[#d6c298] font-bold text-sm mb-0.5">{isFr ? "Économie Réelle" : "Real Enterprise"}</div>
                <div className="text-[#ece6da]/80">{isFr ? "Participation productive au capital d'entreprises" : "Direct ownership in productive global companies"}</div>
              </div>
              <div className="p-3 bg-[#24392e] rounded-xs border border-[#2e4a3b]">
                <div className="text-[#d6c298] font-bold text-sm mb-0.5">{isFr ? "Transparence Pédagogique" : "Educational Clarity"}</div>
                <div className="text-[#ece6da]/80">{isFr ? "Aucun produit exclusif ou vendeur captif" : "Independent multi-carrier education"}</div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. D3 / RECHARTS HISTORICAL PERFORMANCE VISUALIZATION */}
        <section id="performance-chart" className="mb-16">
          <div className="mb-6">
            <span className="eyebrow text-xs uppercase tracking-wider text-[#75581f] block mb-1">
              {isFr ? "Analyse Empirique & Transparence" : "Empirical Analysis & Transparency"}
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-[#1c1b18] mb-2">
              {isFr
                ? "Performance Historique de l'Indice Mondial Islamique"
                : "Historical Performance of the Global Islamic Equity Benchmark"}
            </h2>
            <p className="text-xs sm:text-sm text-[#46423a] max-w-3xl leading-relaxed">
              {isFr
                ? "L'indice de référence mondial MSCI ACWI Islamic est audité selon les règles de l'AAOIFI. Ce graphique présente son évolution sur plus d'une décennie face aux indices conventionnels, incluant les périodes de baisse comme 2018 et 2022."
                : "The MSCI ACWI Islamic Index benchmark follows strict AAOIFI screening. This interactive chart displays over a decade of real market history compared with conventional benchmarks, transparently illustrating both expansion periods and market corrections."}
            </p>
          </div>

          <IslamicIndexPerformanceChart isFr={isFr} />
        </section>

        {/* 4. TWO-TIER SHARI'AH SCREENING METHODOLOGY */}
        <section className="mb-16">
          <div className="mb-8">
            <span className="eyebrow text-xs uppercase tracking-wider text-[#75581f] block mb-1">
              {isFr ? "Méthodologie de Filtrage Certifiée" : "Certified Screening Framework"}
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-[#1c1b18] mb-3">
              {isFr
                ? "Le double filtre de conformité : secteur d'activité et ratios de bilan"
                : "The Two-Tier Shari'ah Screening Framework (AAOIFI Standard)"}
            </h2>
            <p className="text-sm sm:text-base text-[#46423a] max-w-3xl leading-relaxed">
              {isFr
                ? "Les indices actions islamiques appliquent un double processus d'audit indépendant supervisé par des savants en jurisprudence financière selon les normes de l'AAOIFI :"
                : "Islamic equity indices apply a rigorous two-step audit governed by independent Shari'ah boards in accordance with international AAOIFI standards:"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Screen 1: Sector Exclusions */}
            <div className="p-6 bg-[#fcfaf5] border border-[#d6cebd] rounded-xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#75581f]">
                <Scale className="w-4 h-4 text-[#2e4a3b]" />
                <span>{isFr ? "Étape 1 : Exclusions Sectorielles Strictes" : "Tier 1: Business Activity Exclusions"}</span>
              </div>

              <h3 className="font-serif text-xl font-bold text-[#1c1b18]">
                {isFr ? "Entreprises et activités non licites" : "Non-Permissible Sectors Removed"}
              </h3>

              <p className="text-xs sm:text-sm text-[#46423a] leading-relaxed">
                {isFr
                  ? "Toute entreprise dont l'activité principale ou une part substantielle des revenus provient de secteurs incompatibles avec l'éthique islamique est strictement exclue :"
                  : "Any company deriving core revenue from sectors prohibited under Islamic commercial jurisprudence is strictly eliminated:"}
              </p>

              <ul className="space-y-2 text-xs text-[#1c1b18]">
                <li className="flex items-start gap-2">
                  <span className="text-[#8d2b2b] font-bold">&times;</span>
                  <span>{isFr ? "Banques commerciales et services financiers traditionnels basés sur l'intérêt (Riba)" : "Conventional banking, lending, and interest (Riba)-bearing financial services"}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#8d2b2b] font-bold">&times;</span>
                  <span>{isFr ? "Production, distribution ou vente d'alcool" : "Alcohol production, wholesaling, and retail"}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#8d2b2b] font-bold">&times;</span>
                  <span>{isFr ? "Produits porcins et viande non halal" : "Pork-related products and non-halal meat processing"}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#8d2b2b] font-bold">&times;</span>
                  <span>{isFr ? "Jeux de hasard, casinos, paris sportifs et loteries" : "Gambling, casinos, sports betting, and lotteries"}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#8d2b2b] font-bold">&times;</span>
                  <span>{isFr ? "Divertissement adulte conventionnel et médias inappropriés" : "Adult entertainment and pornography"}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#8d2b2b] font-bold">&times;</span>
                  <span>{isFr ? "Armement conventionnel, armes à feu et armées privées" : "Weapons, firearms, and defense contractor armaments"}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#8d2b2b] font-bold">&times;</span>
                  <span>{isFr ? "Fabrication et distribution de produits du tabac" : "Tobacco products and distribution"}</span>
                </li>
              </ul>
            </div>

            {/* Screen 2: Financial Balance Sheet Ratios */}
            <div className="p-6 bg-[#fcfaf5] border border-[#d6cebd] rounded-xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#75581f]">
                <Landmark className="w-4 h-4 text-[#2e4a3b]" />
                <span>{isFr ? "Étape 2 : Ratios Financiers de Bilan" : "Tier 2: Balance Sheet Financial Screening"}</span>
              </div>

              <h3 className="font-serif text-xl font-bold text-[#1c1b18]">
                {isFr ? "Contrôle de l'endettement et de la trésorerie" : "AAOIFI Debt & Cash Ratio Thresholds"}
              </h3>

              <p className="text-xs sm:text-sm text-[#46423a] leading-relaxed">
                {isFr
                  ? "Même une entreprise dans un secteur licite (technologie, santé) doit respecter des limites comptables strictes pour éviter l'exposition excessive à la dette usuraire :"
                  : "Even permissible businesses (e.g. software, medical devices, clean energy) must pass strict quantitative balance sheet audits:"}
              </p>

              <div className="space-y-3 pt-1">
                <div className="p-3 bg-white border border-[#d6cebd] rounded-xs">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#1c1b18] mb-1">
                    <span>{isFr ? "Dette totale / Actif total" : "Total Debt / Total Assets"}</span>
                    <span className="text-[#2e4a3b] font-mono font-bold">&lt; 33.33%</span>
                  </div>
                  <p className="text-[0.72rem] text-[#625d52]">
                    {isFr ? "Exclut les sociétés lourdement endettées dépendantes du crédit bancaire rémunéré par l'intérêt." : "Disqualifies highly leveraged companies dependent on conventional interest financing."}
                  </p>
                </div>

                <div className="p-3 bg-white border border-[#d6cebd] rounded-xs">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#1c1b18] mb-1">
                    <span>{isFr ? "Liquidités & Titres à intérêt / Actif" : "Cash & Interest Securities / Assets"}</span>
                    <span className="text-[#2e4a3b] font-mono font-bold">&lt; 33.33%</span>
                  </div>
                  <p className="text-[0.72rem] text-[#625d52]">
                    {isFr ? "Empêche les sociétés de générer d'importants revenus passifs d'intérêts sur leurs dépôts de trésorerie." : "Prevents companies from accumulating passive interest income on treasury deposits."}
                  </p>
                </div>

                <div className="p-3 bg-white border border-[#d6cebd] rounded-xs">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#1c1b18] mb-1">
                    <span>{isFr ? "Revenus accessoires non conformes" : "Incidental Non-Permissible Revenue"}</span>
                    <span className="text-[#2e4a3b] font-mono font-bold">&lt; 5.0%</span>
                  </div>
                  <p className="text-[0.72rem] text-[#625d52]">
                    {isFr ? "Obligation de purification trimestrielle (don à des organismes de bienfaisance canadiens) selon les ratios officiels publiés." : "Must be purified quarterly via charitable donations according to published index purification factors."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. CANADIAN REGISTERED TAX SHELTERS - NUANCED & PRECISE */}
        <section className="mb-16">
          <div className="mb-8">
            <span className="eyebrow text-xs uppercase tracking-wider text-[#75581f] block mb-1">
              {isFr ? "Optimisation Fiscale Canadienne" : "Canadian Registered Accounts"}
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-[#1c1b18] mb-3">
              {isFr
                ? "Détenir des actions islamiques dans les abris fiscaux enregistrés de l'ARC"
                : "Holding Shari'ah Global Equities Inside Canadian Registered Accounts"}
            </h2>
            <p className="text-sm sm:text-base text-[#46423a] max-w-3xl leading-relaxed">
              {isFr
                ? "L'investissement indiciel conforme à la charia est admissible aux comptes enregistrés au Canada. Voici les règles précises et les nuances fiscales applicables :"
                : "Shari'ah-screened index investments can be held within standard Canadian registered accounts. Key statutory rules and tax considerations include:"}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-5 bg-[#fcfaf5] border border-[#d6cebd] rounded-xs space-y-2">
              <div className="flex items-center gap-2 text-[#2e4a3b] font-bold text-sm">
                <Sparkles className="w-4 h-4 text-[#75581f]" />
                <span>TFSA (CELI)</span>
              </div>
              <p className="text-xs text-[#46423a] leading-relaxed">
                {isFr
                  ? "Les gains en capital et retraits sont totalement exemptés de l'impôt canadien. Note : une retenue à la source étrangère (ex. 15 % sur les dividendes d'actions internationales) peut s'appliquer sans donner droit à un crédit pour impôt étranger dans un CELI."
                  : "Capital gains and qualifying withdrawals are 100% exempt from Canadian income taxes. Nuance: foreign dividend withholding taxes (such as 15% non-resident tax on international equities) may be deducted at source and cannot be claimed as a Canadian foreign tax credit inside a TFSA."}
              </p>
            </div>

            <div className="p-5 bg-[#fcfaf5] border border-[#d6cebd] rounded-xs space-y-2">
              <div className="flex items-center gap-2 text-[#2e4a3b] font-bold text-sm">
                <Building2 className="w-4 h-4 text-[#75581f]" />
                <span>RRSP (REER)</span>
              </div>
              <p className="text-xs text-[#46423a] leading-relaxed">
                {isFr
                  ? "Cotisations déductibles du revenu imposable actuel pour réduire votre tranche d'impôt marginale. La croissance est à impôt différé jusqu'au retrait à la retraite."
                  : "Contributions deduct against current earned income to reduce your high marginal tax bracket. Capital gains and dividends compound tax-deferred until withdrawal in retirement."}
              </p>
            </div>

            <div className="p-5 bg-[#fcfaf5] border border-[#d6cebd] rounded-xs space-y-2">
              <div className="flex items-center gap-2 text-[#2e4a3b] font-bold text-sm">
                <Home className="w-4 h-4 text-[#75581f]" />
                <span>FHSA (CELIAPP)</span>
              </div>
              <p className="text-xs text-[#46423a] leading-relaxed">
                {isFr
                  ? "Plafond de cotisation à vie de 40 000 $ (8 000 $/an). Lors de l'achat d'une première propriété admissible, la totalité des sommes accumulées (cotisations et rendements sans plafond) se retire 100 % libre d'impôt."
                  : "Lifetime contribution limit of $40,000 ($8,000/year). For qualifying first home purchases, the entire accumulated balance (principal and all compound growth, with NO dollar cap on withdrawals) is withdrawn 100% tax-free."}
              </p>
            </div>

            <div className="p-5 bg-[#fcfaf5] border border-[#d6cebd] rounded-xs space-y-2">
              <div className="flex items-center gap-2 text-[#2e4a3b] font-bold text-sm">
                <GraduationCap className="w-4 h-4 text-[#75581f]" />
                <span>RESP (REEE)</span>
              </div>
              <p className="text-xs text-[#46423a] leading-relaxed">
                {isFr
                  ? "Permet d'obtenir la Subvention canadienne pour l'épargne-études (SCEE) de 20 % du gouvernement fédéral (jusqu'à 7 200 $ à vie par enfant), investie dans des actions éthiques."
                  : "Captures the 20% federal Canada Education Savings Grant (CESG) match from the Canadian government (up to $7,200 lifetime per child), compounding inside Shari'ah-screened global equities."}
              </p>
            </div>

            <div className="p-5 bg-[#fcfaf5] border border-[#d6cebd] rounded-xs space-y-2">
              <div className="flex items-center gap-2 text-[#2e4a3b] font-bold text-sm">
                <Briefcase className="w-4 h-4 text-[#75581f]" />
                <span>{isFr ? "Sociétés de Gestion (SPCC)" : "Corporate Holding (CCPC)"}</span>
              </div>
              <p className="text-xs text-[#46423a] leading-relaxed">
                {isFr
                  ? "Pour professionnels incorporés et entrepreneurs : investissement des surplus non répartis tout en surveillant le seuil de 50 000 $ de revenus passifs pour préserver la Déduction pour petite entreprise."
                  : "For incorporated professionals and business owners: deploying retained earnings with structured oversight of the $50,000 passive investment income grind against the Small Business Deduction."}
              </p>
            </div>

            <div className="p-5 bg-[#fcfaf5] border border-[#d6cebd] rounded-xs space-y-2">
              <div className="flex items-center gap-2 text-[#2e4a3b] font-bold text-sm">
                <Lock className="w-4 h-4 text-[#75581f]" />
                <span>{isFr ? "Structures de Contrats Distincts" : "Segregated Contract Features"}</span>
              </div>
              <p className="text-xs text-[#46423a] leading-relaxed">
                {isFr
                  ? "Lorsque l'accès est structuré via un contrat de fonds distinct émis par une compagnie d'assurance canadienne, des garanties de capital, une désignation de bénéficiaires hors succession et une protection contre les créanciers peuvent s'appliquer."
                  : "When facilitated through segregated fund contracts issued by Canadian life carriers (such as iA Financial Group), maturity guarantees, direct beneficiary designations bypassing probate, and statutory creditor protection may apply."}
              </p>
            </div>
          </div>
        </section>

        {/* 6. FAIR & BALANCED MULTI-SCENARIO SIMULATOR */}
        <section id="simulator" className="mb-16 p-6 sm:p-8 bg-[#fcfaf5] border border-[#d6cebd] rounded-xs">
          <div className="max-w-3xl mb-8">
            <span className="eyebrow text-xs uppercase tracking-wider text-[#75581f] block mb-1">
              {isFr ? "Outil Pédagogique Transparent" : "Transparent Educational Tool"}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#1c1b18] mb-2">
              {isFr
                ? "Simulateur Comparatif : Épargne Rémunérée vs Actions Islamiques (Net de Frais)"
                : "Balanced Multi-Scenario Simulator: Savings Account vs. Net Shari'ah Equity"}
            </h2>
            <p className="text-xs sm:text-sm text-[#46423a] leading-relaxed">
              {isFr
                ? "Un comparateur réaliste tenant compte des rendements de comptes d'épargne réels, des frais de gestion estimés (RFG / MER) et de l'inflation de 2,5 %."
                : "A fair, transparent comparison reflecting real savings account interest, estimated fund management fees (MER), market volatility, and a 2.5% inflation baseline."}
            </p>
          </div>

          {/* Primary Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="text-[#1c1b18]">{isFr ? "Capital Initial :" : "Initial Capital:"}</span>
                <span className="text-[#2e4a3b] font-mono">${initialCapital.toLocaleString()} CAD</span>
              </div>
              <input
                type="range"
                min="5000"
                max="250000"
                step="5000"
                value={initialCapital}
                onChange={(e) => setInitialCapital(Number(e.target.value))}
                className="w-full accent-[#2e4a3b]"
              />
              <div className="flex justify-between text-[0.65rem] text-[#625d52] mt-1">
                <span>$5,000</span>
                <span>$250,000</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="text-[#1c1b18]">{isFr ? "Épargne Mensuelle :" : "Monthly Contribution:"}</span>
                <span className="text-[#2e4a3b] font-mono">${monthlyContribution.toLocaleString()} / mo</span>
              </div>
              <input
                type="range"
                min="0"
                max="3000"
                step="100"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                className="w-full accent-[#2e4a3b]"
              />
              <div className="flex justify-between text-[0.65rem] text-[#625d52] mt-1">
                <span>$0</span>
                <span>$3,000 / mo</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="text-[#1c1b18]">{isFr ? "Horizon Temporel :" : "Time Horizon:"}</span>
                <span className="text-[#2e4a3b] font-mono">{years} {isFr ? "ans" : "years"}</span>
              </div>
              <input
                type="range"
                min="3"
                max="25"
                step="1"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full accent-[#2e4a3b]"
              />
              <div className="flex justify-between text-[0.65rem] text-[#625d52] mt-1">
                <span>3 {isFr ? "ans" : "yrs"}</span>
                <span>25 {isFr ? "ans" : "yrs"}</span>
              </div>
            </div>
          </div>

          {/* Secondary Controls: Cash Rate & Equity Scenario */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-[#f2ecdf] border border-[#d6cebd] rounded-xs mb-8 text-xs">
            <div>
              <label className="font-semibold text-[#1c1b18] block mb-1">
                {isFr ? "Taux d'Épargne Réel / CPG :" : "Savings / GIC Interest Rate:"}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0.0"
                  max="4.0"
                  step="0.25"
                  value={cashInterestRate}
                  onChange={(e) => setCashInterestRate(Number(e.target.value))}
                  className="w-full accent-[#75581f]"
                />
                <span className="font-mono font-bold text-[#1c1b18] w-12 text-right">
                  {cashInterestRate.toFixed(2)}%
                </span>
              </div>
              <span className="text-[0.65rem] text-[#625d52]">
                {isFr ? "Comptes d'épargne ou CPG canadiens" : "Real Canadian high-yield savings"}
              </span>
            </div>

            <div>
              <label className="font-semibold text-[#1c1b18] block mb-1">
                {isFr ? "Scénario Actions Islamiques (Brut) :" : "Islamic Equity Scenario (Gross):"}
              </label>
              <select
                value={equityScenario}
                onChange={(e) => setEquityScenario(e.target.value as any)}
                className="w-full py-1.5 px-2 bg-white border border-[#d6cebd] rounded-xs text-xs"
              >
                <option value="conservative">{isFr ? "Conservateur : 4,5 %" : "Conservative: 4.5% gross"}</option>
                <option value="balanced">{isFr ? "Équilibré : 6,5 %" : "Balanced: 6.5% gross"}</option>
                <option value="dynamic">{isFr ? "Historique dynamique : 8,5 %" : "Historical Dynamic: 8.5% gross"}</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-[#1c1b18] block mb-1">
                {isFr ? "Frais de Gestion Estimés (RFG) :" : "Estimated Fund Fees (MER Drag):"}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.25"
                  value={estimatedFeeDrag}
                  onChange={(e) => setEstimatedFeeDrag(Number(e.target.value))}
                  className="w-full accent-[#2e4a3b]"
                />
                <span className="font-mono font-bold text-[#2e4a3b] w-12 text-right">
                  -{estimatedFeeDrag.toFixed(2)}%
                </span>
              </div>
              <span className="text-[0.65rem] text-[#625d52]">
                {isFr ? `Rendement net projeté : ${netEquityReturn.toFixed(2)} %` : `Net projected return: ${netEquityReturn.toFixed(2)}%`}
              </span>
            </div>
          </div>

          {/* Results Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 bg-white border border-[#d6cebd] rounded-xs mb-6">
            <div className="space-y-1">
              <span className="text-[0.68rem] uppercase tracking-wider text-[#625d52] font-semibold block">
                {isFr ? "Total Épargné (Principal)" : "Total Capital Injected"}
              </span>
              <div className="font-serif text-2xl font-bold text-[#1c1b18]">
                ${Math.round(totalPrincipal).toLocaleString()}
              </div>
              <p className="text-[0.7rem] text-[#625d52]">
                {isFr ? "Votre capital net investi" : "Net out-of-pocket savings"}
              </p>
            </div>

            <div className="space-y-1 p-3 bg-[#f7f3eb] border border-[#d6cebd] rounded-xs">
              <span className="text-[0.68rem] uppercase tracking-wider text-[#75581f] font-bold block">
                {isFr ? `Épargne à ${cashInterestRate}% (Nominal)` : `Savings @ ${cashInterestRate}% (Nominal)`}
              </span>
              <div className="font-serif text-2xl font-bold text-[#1c1b18]">
                ${Math.round(cashNominal).toLocaleString()}
              </div>
              <p className="text-[0.7rem] text-[#46423a]">
                {isFr
                  ? `Pouvoir d'achat réel après 2,5 % d'inflation : $${Math.round(cashRealValue).toLocaleString()}`
                  : `Real purchasing power after 2.5% inflation: $${Math.round(cashRealValue).toLocaleString()}`}
              </p>
            </div>

            <div className="space-y-1 p-3 bg-[#2e4a3b]/5 border border-[#2e4a3b]/30 rounded-xs">
              <span className="text-[0.68rem] uppercase tracking-wider text-[#2e4a3b] font-bold block">
                {isFr ? `Actions Islamiques (${netEquityReturn.toFixed(1)} % Net)` : `Islamic Equity (${netEquityReturn.toFixed(1)}% Net)`}
              </span>
              <div className="font-serif text-2xl font-bold text-[#2e4a3b]">
                ${Math.round(equityNominal).toLocaleString()}
              </div>
              <p className="text-[0.7rem] text-[#2e4a3b]">
                {isFr
                  ? `Pouvoir d'achat réel après 2,5 % d'inflation : $${Math.round(equityRealValue).toLocaleString()}`
                  : `Real purchasing power after 2.5% inflation: $${Math.round(equityRealValue).toLocaleString()}`}
              </p>
            </div>
          </div>

          <div className="p-3 bg-[#ece6da]/40 border-l-2 border-[#8d8677] text-[0.7rem] text-[#46423a] leading-relaxed">
            <strong>{isFr ? "Précision méthodologique :" : "Methodological Transparency:"}</strong>{" "}
            {isFr
              ? "Les investissements en actions comportent un risque de perte en capital et des fluctuations de marché. Les calculs ci-dessus sont purement illustratifs et intègrent un taux d'inflation hypothétique de 2,5 % et une déduction de frais de gestion. Les rendements réels varient chaque année et ne sont pas garantis."
              : "Equity investments involve market risk and periodic drawdowns. Projections above are hypothetical and incorporate an estimated 2.5% inflation rate and estimated fund management fee deduction. Actual returns fluctuate annually and are not guaranteed."}
          </div>
        </section>

        {/* 7. OBJECTIVE CONSULTATION REQUEST FORM */}
        <section id="lead-form" className="mb-16 p-6 sm:p-10 bg-[#14211a] text-[#f7f3eb] rounded-xs border border-[#2e4a3b] shadow-xl">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#d6c298]/15 border border-[#d6c298]/40 rounded-xs text-[0.7rem] font-semibold uppercase tracking-wider text-[#d6c298]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#d6c298]" />
                <span>{isFr ? "Accompagnement Éducatif Indépendant" : "Independent Educational Consultation"}</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-4xl text-[#f7f3eb]">
                {isFr ? "Discuter de Votre Stratégie d'Investissement Conforme" : "Explore Your Halal Investment Strategy"}
              </h2>

              <p className="text-xs sm:text-sm text-[#ece6da]/80 max-w-xl mx-auto leading-relaxed">
                {isFr
                  ? "Que vous ayez des liquidités en attente, un compte enregistré à transférer d'une institution financière canadienne, ou des questions de conformité AAOIFI, analysons vos options en toute indépendance."
                  : "Whether you have unallocated liquidity, an existing registered account to transfer directly between Canadian institutions, or specific AAOIFI compliance questions, let's explore your options objectively."}
              </p>
            </div>

            {formSubmitted ? (
              <div className="p-6 bg-[#1a2c22] border border-[#d6c298] rounded-xs text-center space-y-4 animate-in fade-in duration-300">
                <CheckCircle2 className="w-12 h-12 text-[#d6c298] mx-auto" />
                <h3 className="font-serif text-xl font-bold text-[#f7f3eb]">
                  {isFr ? "Votre demande a été bien reçue" : "Your Consultation Request is Confirmed"}
                </h3>
                <p className="text-xs sm:text-sm text-[#ece6da]/90 leading-relaxed max-w-md mx-auto">
                  {isFr
                    ? "Merci pour votre démarche. Ahmed Bello prendra contact avec vous sous 24 heures pour échanger sur vos objectifs et vous présenter les options disponibles auprès des institutions canadiennes agréées."
                    : "Thank you for reaching out. Ahmed Bello will review your situation and follow up within 24 business hours to discuss your objectives and explain available institutional solutions."}
                </p>
                {siteConfig.schedulingUrl && (
                  <div className="pt-2">
                    <a
                      href={siteConfig.schedulingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#d6c298] hover:bg-[#e4d4b3] text-[#1a2c22] font-semibold text-xs rounded-xs transition-colors"
                    >
                      <span>{isFr ? "Réserver une session de 30 min sur Calendly" : "Schedule 30-Min Call on Calendly"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#ece6da] mb-1">
                      {isFr ? "Nom complet *" : "Full Name *"}
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleFormChange}
                      placeholder={isFr ? "ex. Tariq Mansoor" : "e.g. Tariq Mansoor"}
                      className="w-full px-3 py-2 bg-[#1a2c22] border border-[#2e4a3b] rounded-xs text-xs text-[#f7f3eb] placeholder-[#ece6da]/40 focus:outline-none focus:border-[#d6c298]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#ece6da] mb-1">
                      {isFr ? "Courriel *" : "Email Address *"}
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleFormChange}
                      placeholder="tariq@example.com"
                      className="w-full px-3 py-2 bg-[#1a2c22] border border-[#2e4a3b] rounded-xs text-xs text-[#f7f3eb] placeholder-[#ece6da]/40 focus:outline-none focus:border-[#d6c298]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#ece6da] mb-1">
                      {isFr ? "Téléphone *" : "Phone Number *"}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleFormChange}
                      placeholder="(506) 000-0000"
                      className="w-full px-3 py-2 bg-[#1a2c22] border border-[#2e4a3b] rounded-xs text-xs text-[#f7f3eb] placeholder-[#ece6da]/40 focus:outline-none focus:border-[#d6c298]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#ece6da] mb-1">
                      {isFr ? "Ville et Province au Canada *" : "City & Province in Canada *"}
                    </label>
                    <input
                      type="text"
                      name="cityProvince"
                      required
                      value={formData.cityProvince}
                      onChange={handleFormChange}
                      placeholder={isFr ? "ex. Moncton, NB ou Toronto, ON" : "e.g. Moncton, NB or Calgary, AB"}
                      className="w-full px-3 py-2 bg-[#1a2c22] border border-[#2e4a3b] rounded-xs text-xs text-[#f7f3eb] placeholder-[#ece6da]/40 focus:outline-none focus:border-[#d6c298]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#ece6da] mb-1">
                      {isFr ? "Type de Compte Visé *" : "Target Account Structure *"}
                    </label>
                    <select
                      name="accountType"
                      value={formData.accountType}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 bg-[#1a2c22] border border-[#2e4a3b] rounded-xs text-xs text-[#f7f3eb] focus:outline-none focus:border-[#d6c298]"
                    >
                      <option value="tfsa">TFSA (CELI) - Tax-Free</option>
                      <option value="rrsp">RRSP (REER) - Tax-Deductible</option>
                      <option value="fhsa">FHSA (CELIAPP) - First Home</option>
                      <option value="resp">RESP (REEE) - Children's Education</option>
                      <option value="corporate">Corporate Holding / CCPC (Société)</option>
                      <option value="transfer">Direct Transfer from Existing Institution</option>
                      <option value="multiple">Multiple Accounts / Comprehensive Strategy</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#ece6da] mb-1">
                      {isFr ? "Montant Estimé à Allouer *" : "Estimated Amount to Deploy *"}
                    </label>
                    <select
                      name="estimatedAmount"
                      value={formData.estimatedAmount}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 bg-[#1a2c22] border border-[#2e4a3b] rounded-xs text-xs text-[#f7f3eb] focus:outline-none focus:border-[#d6c298]"
                    >
                      <option value="monthly-500">$300 - $1,000 / month (PAC / Recurring)</option>
                      <option value="10k-25k">$10,000 - $25,000</option>
                      <option value="25k-50k">$25,000 - $50,000</option>
                      <option value="50k-100k">$50,000 - $100,000</option>
                      <option value="100k-250k">$100,000 - $250,000</option>
                      <option value="250k+">$250,000+ (Corporate / High Net Worth)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#ece6da] mb-1">
                    {isFr
                      ? "Institution actuelle des fonds (Optionnel)"
                      : "Current Financial Institution (Optional)"}
                  </label>
                  <input
                    type="text"
                    name="currentBank"
                    value={formData.currentBank}
                    onChange={handleFormChange}
                    placeholder={isFr ? "ex. Compte chèques RBC, REER chez TD, etc." : "e.g. Idle cash in chequing, existing RRSP at TD, etc."}
                    className="w-full px-3 py-2 bg-[#1a2c22] border border-[#2e4a3b] rounded-xs text-xs text-[#f7f3eb] placeholder-[#ece6da]/40 focus:outline-none focus:border-[#d6c298]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#ece6da] mb-1">
                    {isFr ? "Vos priorités ou questions particulières (Optionnel)" : "Your Specific Priorities or Questions (Optional)"}
                  </label>
                  <textarea
                    name="notes"
                    rows={3}
                    value={formData.notes}
                    onChange={handleFormChange}
                    placeholder={
                      isFr
                        ? "Précisez vos objectifs, questions sur la certification de conformité ou le calendrier de transfert..."
                        : "Describe your family goals, questions about AAOIFI screening, or transfer timing..."
                    }
                    className="w-full px-3 py-2 bg-[#1a2c22] border border-[#2e4a3b] rounded-xs text-xs text-[#f7f3eb] placeholder-[#ece6da]/40 focus:outline-none focus:border-[#d6c298]"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 bg-[#d6c298] hover:bg-[#e4d4b3] text-[#1a2c22] font-semibold text-xs sm:text-sm rounded-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                  >
                    <span>
                      {isSubmitting
                        ? isFr ? "Transmission en cours..." : "Submitting Request..."
                        : isFr ? "Demander Ma Session Stratégique →" : "Request My Educational Strategy Session →"}
                    </span>
                  </button>
                </div>

                <p className="text-[0.68rem] text-[#ece6da]/60 text-center pt-2">
                  {isFr
                    ? "Vos données demeurent strictement confidentielles. Aucune obligation. Aucune démarche commerciale agressive."
                    : "Strictly confidential. No spam. No aggressive sales pressure. Independent financial education."}
                </p>
              </form>
            )}
          </div>
        </section>

        {/* 8. FREQUENTLY ASKED QUESTIONS - NUANCED & VERIFIED */}
        <section className="mb-16">
          <div className="mb-8">
            <span className="eyebrow text-xs uppercase tracking-wider text-[#75581f] block mb-1">
              {isFr ? "Questions Fréquentes & Réponses Vérifiées" : "Investor FAQ & Official Rules"}
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-[#1c1b18] mb-3">
              {isFr
                ? "Questions courantes sur la conformité islamique et la fiscalité canadienne"
                : "Frequently Asked Questions About Shari'ah Compliance & Canadian Rules"}
            </h2>
          </div>

          <div className="space-y-4">
            <div className="p-5 bg-[#fcfaf5] border border-[#d6cebd] rounded-xs space-y-2">
              <h3 className="font-serif text-base font-bold text-[#1c1b18] flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#2e4a3b]" />
                <span>
                  {isFr
                    ? "Qui certifie la conformité islamique des indices mondiaux de référence ?"
                    : "Who certifies the Shari'ah compliance of benchmark indices?"}
                </span>
              </h3>
              <p className="text-xs sm:text-sm text-[#46423a] leading-relaxed">
                {isFr
                  ? "L'indice de référence mondial MSCI ACWI Islamic est audité par un conseil de surveillance de la charia (Shari'ah Supervisory Board) indépendant composé de savants internationaux renommés en finance islamique, appliquant rigoureusement les normes de l'AAOIFI (Accounting and Auditing Organization for Islamic Financial Institutions)."
                  : "The MSCI ACWI Islamic Index benchmark is audited by an independent Shari'ah Supervisory Board comprising globally recognized Islamic financial scholars adhering strictly to AAOIFI (Accounting and Auditing Organization for Islamic Financial Institutions) standards."}
              </p>
            </div>

            <div className="p-5 bg-[#fcfaf5] border border-[#d6cebd] rounded-xs space-y-2">
              <h3 className="font-serif text-base font-bold text-[#1c1b18] flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#2e4a3b]" />
                <span>
                  {isFr
                    ? "Comment s'effectue le transfert direct d'un REER ou d'un CELI depuis une autre institution ?"
                    : "How do direct transfers work between Canadian financial institutions (Form T2033 vs. RC240)?"}
                </span>
              </h3>
              <p className="text-xs sm:text-sm text-[#46423a] leading-relaxed">
                {isFr
                  ? "Pour les REER et régimes de retraite, le transfert direct s'effectue au moyen du formulaire officiel T2033 de l'ARC. Pour les CELI, le transfert direct d'émetteur à émetteur s'effectue au moyen du formulaire RC240 (ou de la documentation de transfert admissible de l'institution réceptrice). Dans les deux cas, le transfert s'effectue directement d'institution à institution, sans désenregistrement, sans retenue fiscale et sans perte de vos droits de cotisation."
                  : "For RRSPs and registered retirement plans, direct transfers are executed using CRA Form T2033 (Direct Transfer under Subsection 146(16) or 146.3(2)). For TFSAs, direct transfers between issuers are governed by CRA Form RC240 (Direct Transfer Between TFSA Issuers) or the receiving issuer's registered transfer documentation under Section 146.2. In both instances, capital transfers directly institution-to-institution without deregistration, without triggering taxable income, and without forfeiting contribution room."}
              </p>
            </div>

            <div className="p-5 bg-[#fcfaf5] border border-[#d6cebd] rounded-xs space-y-2">
              <h3 className="font-serif text-base font-bold text-[#1c1b18] flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#2e4a3b]" />
                <span>
                  {isFr
                    ? "Comment fonctionne la purification des dividendes ?"
                    : "How does dividend purification work?"}
                </span>
              </h3>
              <p className="text-xs sm:text-sm text-[#46423a] leading-relaxed">
                {isFr
                  ? "Même au sein d'entreprises respectant les filtres de secteur et de bilan (ex. entreprises de matériel médical ou d'informatique), une fraction marginale de revenu (ex. 0,2 % provenant d'intérêts bancaires sur leurs liquidités de fonctionnement) peut exister. Les gestionnaires d'indices publient périodiquement les facteurs de purification exacts permettant à l'investisseur de calculer et verser cette quote-part minime à des organismes de bienfaisance reconnus au Canada."
                  : "Even permissible operating businesses (e.g. software, medical equipment) may generate minor incidental interest on operational cash balances (e.g. 0.1% to 0.3%). Index calculators publish periodic purification factors enabling investors to calculate and donate that minor incidental fraction to registered Canadian charities."}
              </p>
            </div>

            <div className="p-5 bg-[#fcfaf5] border border-[#d6cebd] rounded-xs space-y-2">
              <h3 className="font-serif text-base font-bold text-[#1c1b18] flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#2e4a3b]" />
                <span>
                  {isFr
                    ? "Quelle est la différence entre un FNB en courtage et un contrat de fonds distinct ?"
                    : "What is the difference between brokerage ETFs and segregated fund contracts?"}
                </span>
              </h3>
              <p className="text-xs sm:text-sm text-[#46423a] leading-relaxed">
                {isFr
                  ? "Un FNB ordinaire acheté via une plateforme de courtage est un titre mobilier sans garantie de capital ni protection légale contre les créanciers. À l'inverse, un contrat de fonds distinct émis par une compagnie d'assurance de personnes canadienne (comme les options indicielles islamiques d'iA Groupe financier sous-conseillées par BlackRock) intègre des garanties statutaires à l'échéance et au décès (75/75 ou 75/100), une désignation directe de bénéficiaires évitant les frais d'homologation successorale, et une protection potentielle contre les créanciers en vertu des lois provinciales sur les assurances."
                  : "Standard brokerage ETFs are securities without capital guarantees, without probate bypass, and without statutory creditor protection. In contrast, segregated fund contracts issued through Canadian life carriers (such as the Islamic index options offered through iA Financial Group sub-advised by BlackRock) integrate statutory maturity/death guarantees, direct named beneficiary bypass of court probate fees, and potential creditor protection under provincial insurance legislation."}
              </p>
            </div>
          </div>
        </section>

        {/* 9. REGULATORY DISCLAIMER */}
        <div className="p-4 bg-[#ece6da]/60 border-l-2 border-[#8d8677] text-xs text-[#46423a] leading-relaxed">
          <strong>{isFr ? "Divulgation réglementaire d'indépendance :" : "Independent Regulatory Disclosure:"}</strong>{" "}
          {isFr
            ? "Ce document est publié à des fins d'éducation financière générale et d'information objective concernant l'investissement en actions islamiques au Canada. Ahmed Bello est un professionnel indépendant agréé en solutions financières. Aucune recommandation d'achat spécifique n'est formulée sans analyse préalable de votre situation financière, de votre tolérance au risque et de vos objectifs personnels."
            : "This educational resource provides objective information on Shari'ah-compliant equity investing in Canada. Ahmed Bello is an independent licensed financial solutions professional and does not act as a captive promoter of any single fund or institution. Regulated insurance and segregated fund solutions are implemented exclusively following personalized suitability analysis in authorized Canadian jurisdictions."}{" "}
          <Link to={isFr ? "/fr/disclosures" : "/disclosures"} className="underline text-[#2e4a3b]">
            {isFr ? "Consulter nos divulgations complètes" : "Review full disclosures"}
          </Link>
          .
        </div>
      </div>
    </div>
  );
};
