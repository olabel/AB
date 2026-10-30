import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.tsx";
import { SEO } from "../components/SEO.tsx";
import { siteConfig } from "../config/site.ts";
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
} from "lucide-react";

export const IslamicInvestingPage: React.FC = () => {
  const { isFr } = useLanguage();

  // Interactive Simulator State
  const [initialCapital, setInitialCapital] = useState<number>(25000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(500);
  const [years, setYears] = useState<number>(10);
  const [expectedReturn, setExpectedReturn] = useState<number>(7); // 7% annualized nominal

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

  // Financial Projections Calculation
  const inflationRate = 0.025; // 2.5% annual inflation
  const months = years * 12;
  const monthlyRate = Math.pow(1 + expectedReturn / 100, 1 / 12) - 1;

  // 1. Nominal Compound Growth in Halal Equity Index
  let equityNominal = initialCapital;
  for (let m = 0; m < months; m++) {
    equityNominal = equityNominal * (1 + monthlyRate) + monthlyContribution;
  }

  // 2. Total Cash Deposited
  const totalPrincipal = initialCapital + monthlyContribution * months;

  // 3. Cash in 0% Chequing account after inflation (real purchasing power)
  // Each monthly contribution also decays based on when it was added
  const discountFactor = Math.pow(1 + inflationRate, years);
  const cashRealValue = totalPrincipal / discountFactor;
  const purchasingPowerLoss = totalPrincipal - cashRealValue;

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate submission / logging lead
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
            ? "Investissement Islamique & Indice Actions ACWI BlackRock | Ahmed Bello"
            : "Islamic Investing & Halal Global Equity Index (BlackRock) | Ahmed Bello"
        }
        description={
          isFr
            ? "Fonds indiciel actions islamiques ACWI (BlackRock) chez iA Groupe financier. Filtrage rigoureux AAOIFI, 100 % conforme à la charia pour CELI, REER, CELIAPP, REEE et sociétés privées au Canada."
            : "Islamic Equity Index ACWI (BlackRock) through iA Financial Group. 100% Shari'ah-compliant global equity investing under AAOIFI standards. Available for TFSA, RRSP, FHSA, RESP, and Corporate holding accounts in Canada."
        }
        canonicalUrl={isFr ? "/fr/investing/islamic-equity" : "/investing/islamic-equity"}
        keywords={[
          "Islamic investing Canada",
          "Halal investment funds Canada",
          "Islamic Equity Index ACWI BlackRock",
          "iA Financial Group Islamic Fund",
          "Halal TFSA RRSP Canada",
          "Shariah compliant investing Canada",
          "Halal stock index BlackRock",
          "Investissement islamique Canada",
          "Fonds halal CELI REER",
        ]}
      />

      <div className="wrap max-w-5xl">
        {/* 1. HERO SECTION */}
        <section className="mb-16 border-b border-[#d6cebd] pb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#2e4a3b]/10 border border-[#2e4a3b]/30 rounded-xs text-xs font-semibold text-[#2e4a3b] uppercase tracking-wider mb-5">
            <ShieldCheck className="w-4 h-4 text-[#2e4a3b]" />
            <span>
              {isFr
                ? "Fonds Garanti Indice Actions Islamiques ACWI (BlackRock)"
                : "Islamic Equity Index ACWI (BlackRock) Segregated Fund"}
            </span>
          </div>

          <h1
            className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#1c1b18] tracking-tight mb-6 leading-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {isFr
              ? "Bâtir votre patrimoine sans compromis. Actions mondiales 100 % conformes à la charia au Canada."
              : "Grow Your Wealth With Absolute Conviction. 100% Halal Global Equities for Canadian Families & Businesses."}
          </h1>

          <p className="text-lg sm:text-xl text-[#46423a] max-w-3xl leading-relaxed mb-8 font-serif">
            {isFr
              ? "Replicant l'indice MSCI ACWI Islamic sous la sous-gestion de BlackRock et administré par iA Groupe financier. Un filtrage financier et sectoriel rigoureux certifié AAOIFI, accessible directement dans vos comptes canadiens enregistrés : CELI, REER, CELIAPP, REEE et sociétés de gestion."
              : "Replicating the MSCI ACWI Islamic Index under the sub-advisorship of BlackRock Asset Management, offered through iA Financial Group. Rigorously screened under AAOIFI standards and fully integrated into Canadian tax shelters: TFSA, RRSP, FHSA, RESP, and Corporate Holding Companies."}
          </p>

          {/* Institutional Trust Matrix */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-8">
            <div className="p-3.5 bg-[#fcfaf5] border border-[#d6cebd] rounded-xs">
              <span className="text-[0.68rem] uppercase tracking-wider text-[#75581f] font-semibold block mb-1">
                {isFr ? "Indice Sous-jacent" : "Underlying Index"}
              </span>
              <span className="font-serif text-base font-bold text-[#1c1b18] block">
                MSCI ACWI Islamic
              </span>
              <span className="text-[0.7rem] text-[#625d52]">All Country World Equities</span>
            </div>

            <div className="p-3.5 bg-[#fcfaf5] border border-[#d6cebd] rounded-xs">
              <span className="text-[0.68rem] uppercase tracking-wider text-[#75581f] font-semibold block mb-1">
                {isFr ? "Sous-gestionnaire" : "Sub-Advisor"}
              </span>
              <span className="font-serif text-base font-bold text-[#1c1b18] block">
                BlackRock
              </span>
              <span className="text-[0.7rem] text-[#625d52]">World's Leading Asset Manager</span>
            </div>

            <div className="p-3.5 bg-[#fcfaf5] border border-[#d6cebd] rounded-xs">
              <span className="text-[0.68rem] uppercase tracking-wider text-[#75581f] font-semibold block mb-1">
                {isFr ? "Norme de Conformité" : "Screening Standard"}
              </span>
              <span className="font-serif text-base font-bold text-[#1c1b18] block">
                AAOIFI Standard
              </span>
              <span className="text-[0.7rem] text-[#625d52]">Independent Shariah Board</span>
            </div>

            <div className="p-3.5 bg-[#fcfaf5] border border-[#d6cebd] rounded-xs">
              <span className="text-[0.68rem] uppercase tracking-wider text-[#75581f] font-semibold block mb-1">
                {isFr ? "Émetteur Institutionnel" : "Institutional Carrier"}
              </span>
              <span className="font-serif text-base font-bold text-[#1c1b18] block">
                iA Financial Group
              </span>
              <span className="text-[0.7rem] text-[#625d52]">Est. 1892 &bull; TSX: IAG</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#lead-form"
              className="px-6 py-3 bg-[#2e4a3b] hover:bg-[#253d30] text-[#f7f3eb] font-semibold text-sm rounded-xs transition-colors shadow-sm inline-flex items-center gap-2"
            >
              <span>{isFr ? "Planifier une session stratégique Halal" : "Request Halal Strategy Consultation"}</span>
              <ArrowRight className="w-4 h-4 text-[#d6c298]" />
            </a>

            <a
              href="#simulator"
              className="px-5 py-3 bg-[#fcfaf5] hover:bg-[#ece6da] text-[#1c1b18] border border-[#d6cebd] font-medium text-sm rounded-xs transition-colors inline-flex items-center gap-2"
            >
              <Calculator className="w-4 h-4 text-[#2e4a3b]" />
              <span>{isFr ? "Simulateur Croissance vs Inflation" : "Halal Wealth vs. Inflation Simulator"}</span>
            </a>
          </div>
        </section>

        {/* 2. THE SILENT COST OF INACTION: CASH AT 0% */}
        <section className="mb-16 p-6 sm:p-8 bg-[#1a2c22] text-[#f7f3eb] rounded-xs border border-[#2e4a3b] relative overflow-hidden">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#d6c298]">
              <AlertTriangle className="w-4 h-4 text-[#d6c298]" />
              <span>{isFr ? "Le Défi Majeur des Familles Musulmanes au Canada" : "The Core Dilemma for Canadian Muslim Investors"}</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl text-[#f7f3eb] leading-snug">
              {isFr
                ? "Pourquoi laisser vos économies à 0 % dans un compte chèques détruit silencieusement votre pouvoir d'achat."
                : "Leaving your savings in 0% chequing accounts silently destroys your family's purchasing power."}
            </h2>

            <p className="text-sm sm:text-base text-[#ece6da]/90 leading-relaxed">
              {isFr
                ? "Par souci scrupuleux d'éviter les intérêts (Riba) et les placements douteux, des millions de dollars appartenant à des familles et professionnels musulmans dorment sur des comptes sans intérêt. Mais avec une inflation annuelle de 2 % à 3 %, 100 000 $ en liquide perdent l'équivalent de plus de 26 000 $ de pouvoir d'achat sur une seule décennie. Vous n'avez pas besoin de choisir entre votre foi et la croissance de votre patrimoine."
                : "Out of a rightful desire to avoid interest (Riba) and non-compliant investments, millions of dollars in Canadian Muslim households remain parked in zero-interest chequing accounts. However, with cumulative inflation running at 2%–3% annually, $100,000 sitting in cash loses over $26,000 of real purchasing power over a single decade. You do not have to choose between your Islamic principles and the financial future of your children."}
            </p>

            <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-[#24392e] rounded-xs border border-[#2e4a3b]">
                <div className="text-[#d6c298] font-bold text-sm mb-0.5">0% Riba</div>
                <div className="text-[#ece6da]/80">{isFr ? "Aucune obligation ou titre à intérêt" : "Zero interest-bearing bond exposure"}</div>
              </div>
              <div className="p-3 bg-[#24392e] rounded-xs border border-[#2e4a3b]">
                <div className="text-[#d6c298] font-bold text-sm mb-0.5">100% Productif</div>
                <div className="text-[#ece6da]/80">{isFr ? "Actions réelles d'entreprises mondiales" : "Real ownership in world-leading equities"}</div>
              </div>
              <div className="p-3 bg-[#24392e] rounded-xs border border-[#2e4a3b]">
                <div className="text-[#d6c298] font-bold text-sm mb-0.5">100% Légal</div>
                <div className="text-[#ece6da]/80">{isFr ? "Abris fiscaux canadiens enregistrés" : "Full Canadian registered tax protection"}</div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. TWO-TIER SHARI'AH SCREENING METHODOLOGY */}
        <section className="mb-16">
          <div className="mb-8">
            <span className="eyebrow text-xs uppercase tracking-wider text-[#75581f] block mb-1">
              {isFr ? "Méthodologie Certifiée" : "Governing Methodology"}
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-[#1c1b18] mb-3">
              {isFr
                ? "Le double filtre de conformité : secteur d'activité et ratios de bilan"
                : "The Two-Tier Shari'ah Screening Framework (AAOIFI Standard)"}
            </h2>
            <p className="text-sm sm:text-base text-[#46423a] max-w-3xl leading-relaxed">
              {isFr
                ? "L'indice actions islamiques ACWI (BlackRock) ne se contente pas d'exclure les secteurs interdits : il audite également la structure d'endettement et de trésorerie de chaque entreprise selon les normes internationales de l'AAOIFI."
                : "The Islamic Equity Index ACWI (BlackRock) applies a rigorous two-step audit governed by MSCI's independent Shari'ah Supervisory Committee in accordance with international AAOIFI standards."}
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
                  ? "Toute entreprise dont l'activité principale ou une part substantielle des revenus provient de secteurs incompatibles avec l'éthique islamique est immédiatement exclue du portefeuille :"
                  : "Any company deriving core revenue from sectors prohibited under Islamic commercial jurisprudence is strictly eliminated from the investable universe:"}
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
                  <span>{isFr ? "Armement conventionnel, armes à feu et armées privées" : "Weapons, firearms, and defense contractor defense armaments"}</span>
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
                {isFr ? "Contrôle de la dette et des liquidités" : "AAOIFI Debt & Cash Ratio Thresholds"}
              </h3>

              <p className="text-xs sm:text-sm text-[#46423a] leading-relaxed">
                {isFr
                  ? "Même une entreprise dans un secteur licite (ex. technologie, santé) doit respecter des limites comptables strictes pour éviter l'exposition excessive aux dettes et intérêts :"
                  : "Even permissible businesses (e.g. software, medical devices, retail) must pass rigorous quantitative tests to ensure they do not carry excessive leverage or interest-bearing cash:"}
              </p>

              <div className="space-y-3 pt-1">
                <div className="p-3 bg-white border border-[#d6cebd] rounded-xs">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#1c1b18] mb-1">
                    <span>{isFr ? "Dette totale / Actif total" : "Total Debt / Total Assets"}</span>
                    <span className="text-[#2e4a3b] font-mono font-bold">&lt; 33.33%</span>
                  </div>
                  <p className="text-[0.72rem] text-[#625d52]">
                    {isFr ? "Empêche les sociétés lourdement endettées dépendantes du crédit bancaire usuraire." : "Disqualifies highly leveraged companies dependent on conventional interest financing."}
                  </p>
                </div>

                <div className="p-3 bg-white border border-[#d6cebd] rounded-xs">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#1c1b18] mb-1">
                    <span>{isFr ? "Liquidités & Titres rémunérés / Actif" : "Cash & Interest Securities / Assets"}</span>
                    <span className="text-[#2e4a3b] font-mono font-bold">&lt; 33.33%</span>
                  </div>
                  <p className="text-[0.72rem] text-[#625d52]">
                    {isFr ? "Empêche les sociétés qui accumulent des revenus d'intérêts sur d'énormes dépôts bancaires." : "Prevents holding companies that generate passive interest income on treasury deposits."}
                  </p>
                </div>

                <div className="p-3 bg-white border border-[#d6cebd] rounded-xs">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#1c1b18] mb-1">
                    <span>{isFr ? "Revenus accessoires non conformes" : "Incidental Non-Permissible Revenue"}</span>
                    <span className="text-[#2e4a3b] font-mono font-bold">&lt; 5.0%</span>
                  </div>
                  <p className="text-[0.72rem] text-[#625d52]">
                    {isFr ? "Obligation de purification (don aux œuvres caritatives) sur toute fraction marginale." : "Must be purified annually via charitable donation according to published MSCI ratios."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. CANADIAN REGISTERED TAX SHELTERS */}
        <section className="mb-16">
          <div className="mb-8">
            <span className="eyebrow text-xs uppercase tracking-wider text-[#75581f] block mb-1">
              {isFr ? "Optimisation Fiscale Canadienne" : "Canadian Tax Integration"}
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-[#1c1b18] mb-3">
              {isFr
                ? "Détenez vos actions islamiques dans vos abris fiscaux officiels"
                : "Eligible Across All Major Canadian Tax-Sheltered Accounts"}
            </h2>
            <p className="text-sm sm:text-base text-[#46423a] max-w-3xl leading-relaxed">
              {isFr
                ? "L'indice actions islamiques ACWI (BlackRock) s'intègre harmonieusement dans vos régimes enregistrés pour éliminer ou reporter légalement l'impôt canadien :"
                : "The Islamic Equity Index ACWI (BlackRock) fund contract qualifies for every registered plan under the Canadian Income Tax Act, compounding tax-free or tax-deferred:"}
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
                  ? "Croissance 100 % libre d'impôt et retraits non imposables en tout temps. Tout gain en capital généré par les actions mondiales vous revient intégralement."
                  : "100% tax-free growth and tax-free withdrawals at any time. Capital gains on Shari'ah global equities are completely shielded from Canadian taxation."}
              </p>
            </div>

            <div className="p-5 bg-[#fcfaf5] border border-[#d6cebd] rounded-xs space-y-2">
              <div className="flex items-center gap-2 text-[#2e4a3b] font-bold text-sm">
                <Building2 className="w-4 h-4 text-[#75581f]" />
                <span>RRSP (REER)</span>
              </div>
              <p className="text-xs text-[#46423a] leading-relaxed">
                {isFr
                  ? "Déduisez vos cotisations de votre revenu imposable actuel au taux marginal élevé, tout en accumulant des actions mondiales sans impôt annuel."
                  : "Deduct contributions against your high marginal income tax bracket today, compounding Halal global equities without annual tax drag until retirement."}
              </p>
            </div>

            <div className="p-5 bg-[#fcfaf5] border border-[#d6cebd] rounded-xs space-y-2">
              <div className="flex items-center gap-2 text-[#2e4a3b] font-bold text-sm">
                <Home className="w-4 h-4 text-[#75581f]" />
                <span>FHSA (CELIAPP)</span>
              </div>
              <p className="text-xs text-[#46423a] leading-relaxed">
                {isFr
                  ? "Pour l'achat d'une première propriété : cotisations déductibles d'impôt et retrait admissible 100 % libre d'impôt pour votre mise de fonds (jusqu'à 40 000 $)."
                  : "The first-time home buyer powerhouse: tax-deductible going in, completely tax-free coming out for a qualifying home purchase (up to $40,000 lifetime)."}
              </p>
            </div>

            <div className="p-5 bg-[#fcfaf5] border border-[#d6cebd] rounded-xs space-y-2">
              <div className="flex items-center gap-2 text-[#2e4a3b] font-bold text-sm">
                <GraduationCap className="w-4 h-4 text-[#75581f]" />
                <span>RESP (REEE)</span>
              </div>
              <p className="text-xs text-[#46423a] leading-relaxed">
                {isFr
                  ? "Bénéficiez de la subvention canadienne pour l'épargne-études (SCEE) de 20 % du gouvernement fédéral, investie directement dans des actions éthiques."
                  : "Capture the 20% federal Canada Education Savings Grant (CESG) match from the Canadian government, invested directly in Shari'ah-compliant global equity."}
              </p>
            </div>

            <div className="p-5 bg-[#fcfaf5] border border-[#d6cebd] rounded-xs space-y-2">
              <div className="flex items-center gap-2 text-[#2e4a3b] font-bold text-sm">
                <Briefcase className="w-4 h-4 text-[#75581f]" />
                <span>{isFr ? "Sociétés de Gestion (SPCC)" : "Corporate Holding (CCPC)"}</span>
              </div>
              <p className="text-xs text-[#46423a] leading-relaxed">
                {isFr
                  ? "Pour médecins, dentistes, consultants TI et entrepreneurs : investissez les bénéfices non répartis de votre société avec les protections des contrats de fonds distincts."
                  : "For Muslim physicians, IT consultants, and business owners: deploy corporate retained earnings with institutional creditor protection and named beneficiaries."}
              </p>
            </div>

            <div className="p-5 bg-[#fcfaf5] border border-[#d6cebd] rounded-xs space-y-2">
              <div className="flex items-center gap-2 text-[#2e4a3b] font-bold text-sm">
                <Lock className="w-4 h-4 text-[#75581f]" />
                <span>{isFr ? "Avantages Fonds Distincts" : "Segregated Fund Advantages"}</span>
              </div>
              <p className="text-xs text-[#46423a] leading-relaxed">
                {isFr
                  ? "Garanties à l'échéance et au décès (75 %/75 % ou 75 %/100 %), désignation directe de bénéficiaires hors succession et protection potentielle contre les créanciers."
                  : "Maturity & death guarantees, direct named beneficiary bypass of costly provincial probate fees, and potential statutory creditor protection under insurance law."}
              </p>
            </div>
          </div>
        </section>

        {/* 5. INTERACTIVE SIMULATOR: HALAL WEALTH VS. INFLATION */}
        <section id="simulator" className="mb-16 p-6 sm:p-8 bg-[#fcfaf5] border border-[#d6cebd] rounded-xs">
          <div className="max-w-3xl mb-8">
            <span className="eyebrow text-xs uppercase tracking-wider text-[#75581f] block mb-1">
              {isFr ? "Calculateur Interactif" : "Interactive Simulator"}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#1c1b18] mb-2">
              {isFr ? "Simulateur : Actions Islamiques vs Inaction en Liquide" : "Halal Global Equity vs. 0% Cash Inaction"}
            </h2>
            <p className="text-xs sm:text-sm text-[#46423a] leading-relaxed">
              {isFr
                ? "Comparez l'effet de l'inflation sur des liquidités stagnantes face au potentiel de croissance à long terme d'un portefeuille d'actions islamiques mondiales diversifié."
                : "See what happens when you deploy capital into productive global commerce versus leaving money idle in zero-interest bank accounts eroded by Canadian inflation."}
            </p>
          </div>

          {/* Sliders */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

          {/* Projection Results Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 bg-white border border-[#d6cebd] rounded-xs mb-6">
            <div className="space-y-1">
              <span className="text-[0.68rem] uppercase tracking-wider text-[#625d52] font-semibold block">
                {isFr ? "Total Cotisé (Principal)" : "Total Capital Invested"}
              </span>
              <div className="font-serif text-2xl font-bold text-[#1c1b18]">
                ${Math.round(totalPrincipal).toLocaleString()}
              </div>
              <p className="text-[0.7rem] text-[#625d52]">
                {isFr ? "Votre épargne nette injectée" : "Net out-of-pocket savings"}
              </p>
            </div>

            <div className="space-y-1 p-3 bg-[#8d2b2b]/5 border border-[#8d2b2b]/20 rounded-xs">
              <span className="text-[0.68rem] uppercase tracking-wider text-[#8d2b2b] font-bold block">
                {isFr ? "Valeur Réelle du Cash à 0 %" : "0% Cash Purchasing Power"}
              </span>
              <div className="font-serif text-2xl font-bold text-[#8d2b2b]">
                ${Math.round(cashRealValue).toLocaleString()}
              </div>
              <p className="text-[0.7rem] text-[#8d2b2b]">
                {isFr ? `Perte d'inflation : -$${Math.round(purchasingPowerLoss).toLocaleString()}` : `Inflation erosion: -$${Math.round(purchasingPowerLoss).toLocaleString()}`}
              </p>
            </div>

            <div className="space-y-1 p-3 bg-[#2e4a3b]/5 border border-[#2e4a3b]/30 rounded-xs">
              <span className="text-[0.68rem] uppercase tracking-wider text-[#2e4a3b] font-bold block">
                {isFr ? "Projection Actions Islamiques (7%)" : "Projected Halal Equity Value (7%)"}
              </span>
              <div className="font-serif text-2xl font-bold text-[#2e4a3b]">
                ${Math.round(equityNominal).toLocaleString()}
              </div>
              <p className="text-[0.7rem] text-[#2e4a3b]">
                {isFr
                  ? `Gain potentiel composé : +$${Math.round(equityNominal - totalPrincipal).toLocaleString()}`
                  : `Compounded growth: +$${Math.round(equityNominal - totalPrincipal).toLocaleString()}`}
              </p>
            </div>
          </div>

          <div className="text-[0.68rem] text-[#625d52] italic">
            * {isFr
              ? "Calcul purement illustratif basé sur un rendement annualisé hypothétique de 7 % et une inflation moyenne de 2,5 %. Les rendements passés ne garantissent pas les rendements futurs. Les investissements en actions comportent un risque de fluctuation de marché."
              : "For illustrative purposes only based on a hypothetical 7% nominal annual return and 2.5% inflation. Past performance does not guarantee future results. Equity investments involve market fluctuations."}
          </div>
        </section>

        {/* 6. HIGH-CONVERTING MUSLIM INVESTOR LEAD FORM */}
        <section id="lead-form" className="mb-16 p-6 sm:p-10 bg-[#14211a] text-[#f7f3eb] rounded-xs border border-[#2e4a3b] shadow-xl">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#d6c298]/15 border border-[#d6c298]/40 rounded-xs text-[0.7rem] font-semibold uppercase tracking-wider text-[#d6c298]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#d6c298]" />
                <span>{isFr ? "Accompagnement Confidentiel & Sans Engagement" : "Private & No-Obligation Consultation"}</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-4xl text-[#f7f3eb]">
                {isFr ? "Planifiez Votre Stratégie d'Investissement Halal" : "Start Your Halal Investment Strategy"}
              </h2>

              <p className="text-xs sm:text-sm text-[#ece6da]/80 max-w-xl mx-auto leading-relaxed">
                {isFr
                  ? "Que vous ayez des liquidités en banque, un REER ou CELI à transférer d'une grande banque canadienne, ou des surplus dans votre société de gestion, examinons vos options en toute conformité."
                  : "Whether you have idle cash to deploy, an existing RRSP/TFSA to transfer tax-free from a Canadian big bank, or corporate retained earnings, let's explore your Shari'ah options."}
              </p>
            </div>

            {formSubmitted ? (
              <div className="p-6 bg-[#1a2c22] border border-[#d6c298] rounded-xs text-center space-y-4 animate-in fade-in duration-300">
                <CheckCircle2 className="w-12 h-12 text-[#d6c298] mx-auto" />
                <h3 className="font-serif text-xl font-bold text-[#f7f3eb]">
                  {isFr ? "Votre demande a été bien reçue !" : "Your Consultation Request is Confirmed"}
                </h3>
                <p className="text-xs sm:text-sm text-[#ece6da]/90 leading-relaxed max-w-md mx-auto">
                  {isFr
                    ? "Merci pour votre démarche. Ahmed Bello prendra contact avec vous sous 24 heures pour vous présenter les détails du fonds indice actions islamiques ACWI (BlackRock) et les démarches de transfert."
                    : "Thank you for reaching out. Ahmed Bello will review your situation and follow up within 24 business hours with direct documentation on the Islamic Equity Index ACWI (BlackRock) and transfer steps."}
                </p>
                {siteConfig.schedulingUrl && (
                  <div className="pt-2">
                    <a
                      href={siteConfig.schedulingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#d6c298] hover:bg-[#e4d4b3] text-[#1a2c22] font-semibold text-xs rounded-xs transition-colors"
                    >
                      <span>{isFr ? "Choisir immédiatement une heure sur Calendly" : "Pick an Instant Time on Calendly"}</span>
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
                      <option value="transfer">Transfer from Existing Bank (RBC/TD/BMO/CIBC)</option>
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
                      <option value="monthly-500">$300 - $1,000 / month (PAC / Prélèvement)</option>
                      <option value="10k-25k">$10,000 - $25,000 (Lump Sum / Transfert)</option>
                      <option value="25k-50k">$25,000 - $50,000</option>
                      <option value="50k-100k">$50,000 - $100,000</option>
                      <option value="100k-250k">$100,000 - $250,000</option>
                      <option value="250k+">$250,000+ (High Net Worth / Corporate)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#ece6da] mb-1">
                    {isFr
                      ? "Où se trouvent vos fonds actuellement ? (Optionnel)"
                      : "Current Institution / Cash Status (Optional)"}
                  </label>
                  <input
                    type="text"
                    name="currentBank"
                    value={formData.currentBank}
                    onChange={handleFormChange}
                    placeholder={isFr ? "ex. Compte chèques RBC, REER chez TD, etc." : "e.g. Idle cash in TD chequing, old RRSP with Scotia, etc."}
                    className="w-full px-3 py-2 bg-[#1a2c22] border border-[#2e4a3b] rounded-xs text-xs text-[#f7f3eb] placeholder-[#ece6da]/40 focus:outline-none focus:border-[#d6c298]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#ece6da] mb-1">
                    {isFr ? "Vos questions ou priorités particulières (Optionnel)" : "Your Specific Questions or Priorities (Optional)"}
                  </label>
                  <textarea
                    name="notes"
                    rows={3}
                    value={formData.notes}
                    onChange={handleFormChange}
                    placeholder={
                      isFr
                        ? "Précisez vos objectifs, questions sur la certification de conformité ou le calendrier de transfert..."
                        : "Describe your family goals, Shari'ah purification questions, or timing..."
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
                        : isFr ? "Demander Ma Session Stratégique Halal →" : "Request My Halal Strategy Session →"}
                    </span>
                  </button>
                </div>

                <p className="text-[0.68rem] text-[#ece6da]/60 text-center pt-2">
                  {isFr
                    ? "Vos données demeurent strictement confidentielles. Aucune obligation. Aucun démarchage agressif."
                    : "Strictly confidential. No spam. No high-pressure sales. Respectful financial education."}
                </p>
              </form>
            )}
          </div>
        </section>

        {/* 7. FREQUENTLY ASKED QUESTIONS BY MUSLIM INVESTORS */}
        <section className="mb-16">
          <div className="mb-8">
            <span className="eyebrow text-xs uppercase tracking-wider text-[#75581f] block mb-1">
              {isFr ? "Questions Fréquentes" : "Investor FAQ"}
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-[#1c1b18] mb-3">
              {isFr
                ? "Questions courantes des investisseurs musulmans au Canada"
                : "Frequently Asked Questions About Shari'ah Compliance"}
            </h2>
          </div>

          <div className="space-y-4">
            <div className="p-5 bg-[#fcfaf5] border border-[#d6cebd] rounded-xs space-y-2">
              <h3 className="font-serif text-base font-bold text-[#1c1b18] flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#2e4a3b]" />
                <span>
                  {isFr
                    ? "Qui certifie la conformité islamique de ce fonds ?"
                    : "Who certifies the Shari'ah compliance of the underlying index?"}
                </span>
              </h3>
              <p className="text-xs sm:text-sm text-[#46423a] leading-relaxed">
                {isFr
                  ? "L'indice sous-jacent est le MSCI ACWI Islamic Index, géré et sous-conseillé par BlackRock. Sa conformité est supervisée et auditée par le Shari'ah Supervisory Board de MSCI, composé de savants islamiques reconnus à l'échelle internationale conformément aux normes de l'AAOIFI (Accounting and Auditing Organization for Islamic Financial Institutions)."
                  : "The underlying index is the MSCI ACWI Islamic Index sub-advised by BlackRock. Its compliance is continually audited and certified by MSCI's independent Shari'ah Supervisory Board in adherence to the globally accepted standards established by AAOIFI (Accounting and Auditing Organization for Islamic Financial Institutions)."}
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
                  ? "Même au sein d'entreprises conformes (ex. fabricants d'ordinateurs ou de dispositifs médicaux), une fraction marginale de revenu (ex. 0,2 % provenant d'intérêts bancaires sur leur trésorerie) peut exister. MSCI et BlackRock publient chaque trimestre les ratios précis de purification afin que cette fraction minime puisse être donnée à une œuvre de bienfaisance sans revendiquer de récompense religieuse."
                  : "Even in permitted companies (e.g. software or medical technologies), minor incidental interest from operating bank balances may represent a small fraction (e.g. 0.2%). MSCI and BlackRock publish exact quarterly purification factors so you can calculate and donate that minor portion to recognized Canadian charities."}
              </p>
            </div>

            <div className="p-5 bg-[#fcfaf5] border border-[#d6cebd] rounded-xs space-y-2">
              <h3 className="font-serif text-base font-bold text-[#1c1b18] flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#2e4a3b]" />
                <span>
                  {isFr
                    ? "Puis-je transférer mon REER ou CELI existant d'une grande banque sans payer d'impôt ?"
                    : "Can I transfer my existing TFSA or RRSP from RBC, TD, Scotia, or BMO without tax penalties?"}
                </span>
              </h3>
              <p className="text-xs sm:text-sm text-[#46423a] leading-relaxed">
                {isFr
                  ? "Oui. Les transferts d'institutions financières canadiennes s'effectuent directement d'institution à institution au moyen des formulaires officiels de l'ARC (formulaire T2033). Il s'agit d'un transfert direct sans impact fiscal, sans perte de droits de cotisation et sans retrait imposable."
                  : "Yes. Transfers between Canadian financial institutions are executed directly using standard CRA transfer forms (Form T2033). The capital transfers directly inside the registered tax shelter without triggering taxable income, without losing contribution room, and without early withdrawal penalties."}
              </p>
            </div>

            <div className="p-5 bg-[#fcfaf5] border border-[#d6cebd] rounded-xs space-y-2">
              <h3 className="font-serif text-base font-bold text-[#1c1b18] flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#2e4a3b]" />
                <span>
                  {isFr
                    ? "Qu'est-ce que le contrat de fonds distincts apporte de plus aux familles et entrepreneurs ?"
                    : "What unique benefits does a segregated fund contract provide?"}
                </span>
              </h3>
              <p className="text-xs sm:text-sm text-[#46423a] leading-relaxed">
                {isFr
                  ? "Contrairement aux FNB ordinaires achetés en courtage libre, le fonds distinct émis par iA Groupe financier offre une protection du capital à l'échéance et au décès (garanties 75/75 ou 75/100), une désignation directe de bénéficiaires qui évite les frais et délais d'homologation successorale (probate), ainsi qu'une protection potentielle contre les poursuites de créanciers en vertu des lois provinciales sur les assurances."
                  : "Unlike bare mutual funds or brokerage ETFs, segregated fund policies issued through iA Financial Group include maturity and death benefit guarantees (75%/75% or 75%/100%), direct beneficiary designation bypassing costly probate court delays and fees, and potential statutory creditor protection under provincial insurance legislation."}
              </p>
            </div>
          </div>
        </section>

        {/* 8. REGULATORY DISCLAIMER */}
        <div className="p-4 bg-[#ece6da]/60 border-l-2 border-[#8d8677] text-xs text-[#46423a] leading-relaxed">
          <strong>{isFr ? "Divulgation réglementaire :" : "Regulatory Disclosure:"}</strong>{" "}
          {isFr
            ? "Ce document est conçu à des fins d'éducation financière et d'information générale concernant le fonds Indice actions islamiques ACWI (BlackRock) offert par iA Groupe financier. Il ne constitue pas une offre d'achat ni un conseil d'investissement personnalisé. Les fonds distincts sont des contrats d'assurance régis par les lois provinciales applicables. Toute décision d'investissement doit faire l'objet d'un examen des objectifs personnels, de la tolérance au risque et du prospectus officiel."
            : "This page is prepared for financial education and informational purposes regarding the Islamic Equity Index ACWI (BlackRock) segregated fund offered through iA Financial Group. It does not constitute an individualized investment recommendation or solicitation. Segregated funds are insurance contracts governed by applicable provincial insurance acts. Past performance is no guarantee of future returns."}{" "}
          <Link to={isFr ? "/fr/disclosures" : "/disclosures"} className="underline text-[#2e4a3b]">
            {isFr ? "Consulter nos divulgations complètes" : "Review full disclosures"}
          </Link>
          .
        </div>
      </div>
    </div>
  );
};
