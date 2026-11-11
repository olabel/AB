import React from "react";
import { Link } from "react-router-dom";
import { BrandMark } from "../components/BrandMark.tsx";
import { SEO } from "../components/SEO.tsx";
import { HowThePiecesFit } from "../components/HowThePiecesFit.tsx";
import { siteConfig } from "../config/site.ts";
import { useLanguage } from "../context/LanguageContext.tsx";
import {
  Calendar,
  ArrowRight,
  ShieldCheck,
  Calculator,
  Compass,
  Home,
  Building2,
  Stethoscope,
  Users,
  Sparkles,
  TrendingDown,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export const HomePage: React.FC = () => {
  const { language, isFr } = useLanguage();
  const prefix = isFr ? "/fr" : "";

  return (
    <div className="bg-[#f7f3eb]">
      <SEO
        title={
          isFr
            ? "Architecture Financière & Protection du Revenu | Ahmed Bello Solutions Financières"
            : "Canadian Wealth & Protection Architecture | Ahmed Bello Financial Solutions"
        }
        description={
          isFr
            ? "Stratégie patrimoniale fiscalement efficiente, protection du revenu familial et préservation du capital pour familles canadiennes, SPCC, professionnels de la santé et nouveaux arrivants."
            : "Tailored tax-efficient wealth strategy, family income protection, and capital preservation for Canadian families, CCPCs, healthcare professionals, and newcomers."
        }
        canonicalUrl={isFr ? "/fr" : "/"}
      />

      {/* 1. Hero: Crystal-Clear Positioning within 5 Seconds */}
      <section className="section pb-14 pt-8 md:pt-14 border-b border-[#d6cebd]">
        <div className="wrap max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Direct Value Proposition */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#2e4a3b]/10 text-[#2e4a3b] border border-[#2e4a3b]/25 rounded-[2px] text-[11px] font-semibold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2e4a3b]" />
                <span>
                  {isFr
                    ? "Cabinet Financier Indépendant • Agréé Partout au Canada"
                    : "Independent Financial Practice • Licensed Across Canada"}
                </span>
              </div>

              <h1 className="display text-[#1c1b18] leading-[1.08] tracking-tight">
                {isFr ? (
                  <>
                    Architecture financière pour{" "}
                    <span className="font-serif italic font-normal text-[#2e4a3b]">
                      familles, entrepreneurs
                    </span>{" "}
                    et soignants au Canada.
                  </>
                ) : (
                  <>
                    Financial architecture for{" "}
                    <span className="font-serif italic font-normal text-[#2e4a3b]">
                      families, business owners
                    </span>{" "}
                    &amp; healthcare professionals.
                  </>
                )}
              </h1>

              <p className="lede text-base sm:text-lg text-[#46423a] leading-relaxed max-w-2xl">
                {isFr
                  ? "Structuration patrimoniale et protection du revenu pour les Canadiens confrontés à des tournants financiers majeurs : renouvellement hypothécaire, optimisation des régimes enregistrés (CELI, REER, CELIAPP), fiscalité des SPCC et intégration financière des nouveaux arrivants. Représentant indépendant affilié à WFGIA : rémunération par commission selon les solutions convenues, sans obligation d'achat."
                  : "Independent wealth structuring and income protection for Canadians facing high-stakes transitions: mortgage renewal shocks, registered account tax sequencing (TFSA/RRSP/FHSA), corporate passive income rules, and newcomer financial runways. Independent representative contracted with WFGIA: compensation is commission-based upon product placement, with zero obligation to purchase."}
              </p>

              {/* Direct Actions */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href={siteConfig.schedulingUrl || "https://calendly.com/olabel/30min"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary text-sm px-6 py-3 shadow-xs inline-flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4 text-[#d6c298]" />
                  <span>
                    {isFr ? "Planifier un appel de 30 min" : "Schedule 30-Min Strategy Call"}
                  </span>
                </a>

                <Link
                  to={`${prefix}/calculators`}
                  className="btn btn-ghost text-sm px-5 py-3 border border-[#d6cebd] hover:border-[#2e4a3b] inline-flex items-center gap-2"
                >
                  <Calculator className="w-4 h-4 text-[#75581f]" />
                  <span>{isFr ? "Simulateurs Financiers" : "Run Financial Simulators"}</span>
                </Link>

                <Link
                  to={`${prefix}/what-changed`}
                  className="text-xs font-semibold text-[#2e4a3b] hover:underline px-2 py-3 inline-flex items-center gap-1"
                >
                  <span>{isFr ? "Règles 2026 →" : "Nov 2026 Money Rules →"}</span>
                </Link>
              </div>

              {/* Quick Trust Highlights */}
              <div className="pt-3 border-t border-[#d6cebd]/60 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-[#625d52]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2e4a3b] shrink-0" />
                  <span>{isFr ? "Rémunération transparente" : "Clear Commission Terms"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2e4a3b] shrink-0" />
                  <span>{isFr ? "Accès multi-institutions" : "Multi-Carrier Access"}</span>
                </div>
                <div className="flex items-center gap-1.5 col-span-2 sm:col-span-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#75581f] shrink-0" />
                  <span>{isFr ? "Membre indépendant WFG" : "Independent WFG Member"}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Ahmed Bello Portrait & Credentials Card */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="w-full max-w-sm bg-[#fcfaf5] border border-[#d6cebd] p-4 rounded-[2px] shadow-sm">
                <div className="border border-[#75581f]/20 bg-[#ece6da]/40 p-1 rounded-[1px] relative overflow-hidden">
                  <img
                    src="/assets/aistudio/unnamed_dd5949a8.webp"
                    alt="Ahmed Bello, Licensed Financial Solutions Professional"
                    className="w-full aspect-[4/5] object-cover object-top rounded-[1px]"
                    width={380}
                    height={475}
                    loading="eager"
                  />
                  <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-[#d6c298]" />
                  <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-[#d6c298]" />
                </div>

                <div className="mt-3.5 pt-3 border-t border-[#d6cebd] flex items-center justify-between gap-3 text-left">
                  <div className="flex items-center gap-2.5">
                    <BrandMark size={28} className="w-7 h-7 shrink-0 text-[#2e4a3b]" />
                    <div>
                      <p className="font-serif text-lg text-[#1c1b18] leading-tight">Ahmed Bello</p>
                      <p className="text-[0.68rem] uppercase tracking-wider text-[#75581f] font-semibold">
                        {siteConfig.designation}
                      </p>
                    </div>
                  </div>
                  <Link
                    to={`${prefix}/about`}
                    className="text-xs text-[#2e4a3b] font-medium hover:underline shrink-0"
                  >
                    {isFr ? "Parcours →" : "About →"}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Practice Pillars: Who the Practice Serves */}
      <section className="section py-14 border-b border-[#d6cebd] bg-[#fcfaf5]">
        <div className="wrap max-w-6xl space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="eyebrow text-xs text-[#75581f]">
                {isFr ? "Pôles de Pratique" : "Practice Pillars"}
              </span>
              <h2 className="h2 text-[#1c1b18] mt-1">
                {isFr ? "À qui s'adresse notre cabinet" : "Who the practice is built for"}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#625d52] max-w-md">
              {isFr
                ? "Nous accompagnons quatre profils distincts aux prises avec des décisions financières canadiennes stratégiques."
                : "Focused financial architecture designed around specific, high-stakes Canadian balance-sheet crossroads."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Pillar 1: Families */}
            <Link
              to={`${prefix}/for/families`}
              className="p-5 bg-[#f7f3eb] border border-[#d6cebd] rounded-[2px] hover:border-[#2e4a3b] transition-all group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-9 h-9 rounded-full bg-[#2e4a3b]/10 text-[#2e4a3b] flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <h3 className="font-serif text-lg text-[#1c1b18] group-hover:text-[#2e4a3b] transition-colors leading-snug">
                  {isFr ? "Familles Canadiennes" : "Canadian Families"}
                </h3>
                <p className="text-xs text-[#46423a] leading-relaxed">
                  {isFr
                    ? "Choc de renouvellement hypothécaire, optimisation combinée CELIAPP + RAP (100k$ non taxé), REEE et protection du revenu familial."
                    : "Mortgage renewal shock management, pooling $100k+ in FHSA and RRSP Home Buyers' Plan room, and life insurance income protection."}
                </p>
              </div>
              <div className="pt-4 flex items-center gap-1 text-xs font-semibold text-[#2e4a3b]">
                <span>{isFr ? "Voir l'orientation" : "Explore guidance"}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Pillar 2: Business Owners */}
            <Link
              to={`${prefix}/for/business-owners`}
              className="p-5 bg-[#f7f3eb] border border-[#d6cebd] rounded-[2px] hover:border-[#2e4a3b] transition-all group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-9 h-9 rounded-full bg-[#75581f]/10 text-[#75581f] flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <h3 className="font-serif text-lg text-[#1c1b18] group-hover:text-[#2e4a3b] transition-colors leading-snug">
                  {isFr ? "Entrepreneurs & SPCC" : "Incorporated Owners"}
                </h3>
                <p className="text-xs text-[#46423a] leading-relaxed">
                  {isFr
                    ? "Éviter le piège de la réduction 5:1 de la DPE au-delà de 50 000 $ de revenus passifs (art. 125(5.1)) et extractions par Compte de dividendes en capital (CDC)."
                    : "Navigating the $50,000 corporate passive income clawback under Section 125(5.1), Capital Dividend Account (CDA) extraction, and retained earnings sheltering."}
                </p>
              </div>
              <div className="pt-4 flex items-center gap-1 text-xs font-semibold text-[#2e4a3b]">
                <span>{isFr ? "Voir l'orientation" : "Explore guidance"}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Pillar 3: Healthcare */}
            <Link
              to={`${prefix}/for/healthcare`}
              className="p-5 bg-[#f7f3eb] border border-[#d6cebd] rounded-[2px] hover:border-[#2e4a3b] transition-all group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-9 h-9 rounded-full bg-[#2e4a3b]/10 text-[#2e4a3b] flex items-center justify-center">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <h3 className="font-serif text-lg text-[#1c1b18] group-hover:text-[#2e4a3b] transition-colors leading-snug">
                  {isFr ? "Professionnels de Santé" : "Healthcare Workers"}
                </h3>
                <p className="text-xs text-[#46423a] leading-relaxed">
                  {isFr
                    ? "Gestion de trésorerie pendant l'équivalence des diplômes médicaux, assurance invalidité sans annulation pour médecins et infirmiers."
                    : "Credential recognition runway modeling for foreign-trained clinicians, locum cash flow management, and non-cancellable disability coverage."}
                </p>
              </div>
              <div className="pt-4 flex items-center gap-1 text-xs font-semibold text-[#2e4a3b]">
                <span>{isFr ? "Voir l'orientation" : "Explore guidance"}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Pillar 4: Newcomers */}
            <Link
              to={`${prefix}/for/newcomers`}
              className="p-5 bg-[#f7f3eb] border border-[#d6cebd] rounded-[2px] hover:border-[#2e4a3b] transition-all group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-9 h-9 rounded-full bg-[#75581f]/10 text-[#75581f] flex items-center justify-center">
                  <Compass className="w-4 h-4" />
                </div>
                <h3 className="font-serif text-lg text-[#1c1b18] group-hover:text-[#2e4a3b] transition-colors leading-snug">
                  {isFr ? "Nouveaux Arrivants" : "Newcomers to Canada"}
                </h3>
                <p className="text-xs text-[#46423a] leading-relaxed">
                  {isFr
                    ? "Planification de la réserve d'installation (1re année), établissement du dossier de crédit, date charnière de résidence fiscale et déclaration T1135."
                    : "First-year settlement runway simulation, rapid credit score building, tax residency start timing, and CRA Form T1135 foreign property compliance."}
                </p>
              </div>
              <div className="pt-4 flex items-center gap-1 text-xs font-semibold text-[#2e4a3b]">
                <span>{isFr ? "Voir l'orientation" : "Explore guidance"}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 2.5 How the Pieces Fit: Architectural Balance-Sheet Integration */}
      <HowThePiecesFit />

      {/* 3. Interactive Decision Models Strip */}
      <section className="section py-14 border-b border-[#d6cebd]">
        <div className="wrap max-w-6xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="eyebrow text-xs text-[#2e4a3b]">
                {isFr ? "Modélisation Quantitative" : "Interactive Calculators"}
              </span>
              <h2 className="h2 text-[#1c1b18] mt-0.5">
                {isFr ? "Simulez vos chiffres en direct" : "Quantitative balance-sheet models"}
              </h2>
            </div>
            <Link
              to={`${prefix}/calculators`}
              className="btn btn-ghost text-xs py-2 px-4 border border-[#d6cebd] hover:border-[#2e4a3b] shrink-0 inline-flex items-center gap-1.5"
            >
              <span>{isFr ? "Ouvrir les 4 simulateurs" : "Open all 4 calculators"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Link
              to={`${prefix}/calculators`}
              className="p-4 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] hover:border-[#2e4a3b] transition-all"
            >
              <span className="font-mono text-xs text-[#75581f] font-semibold block mb-1">01</span>
              <h4 className="font-serif text-base text-[#1c1b18] font-bold">
                {isFr ? "Trésorerie 1re Année" : "Newcomer Runway"}
              </h4>
              <p className="text-[0.72rem] text-[#625d52] mt-1">
                {isFr
                  ? "Modélisez vos coûts d'équivalence et mois de réserve."
                  : "Calculate living burn & foreign credential exam costs."}
              </p>
            </Link>

            <Link
              to={`${prefix}/calculators`}
              className="p-4 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] hover:border-[#2e4a3b] transition-all"
            >
              <span className="font-mono text-xs text-[#75581f] font-semibold block mb-1">02</span>
              <h4 className="font-serif text-base text-[#1c1b18] font-bold">
                {isFr ? "Choc Hypothécaire" : "Mortgage Renewal"}
              </h4>
              <p className="text-[0.72rem] text-[#625d52] mt-1">
                {isFr
                  ? "Mesurez le saut de mensualité et le coût d'opportunité CELI."
                  : "Measure payment delta & the cost of raiding your TFSA."}
              </p>
            </Link>

            <Link
              to={`${prefix}/calculators`}
              className="p-4 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] hover:border-[#2e4a3b] transition-all"
            >
              <span className="font-mono text-xs text-[#75581f] font-semibold block mb-1">03</span>
              <h4 className="font-serif text-base text-[#1c1b18] font-bold">
                {isFr ? "Arbitrage CELI vs REER" : "TFSA vs RRSP"}
              </h4>
              <p className="text-[0.72rem] text-[#625d52] mt-1">
                {isFr
                  ? "Comparez la richesse nette selon vos taux d'impôt."
                  : "Model terminal after-tax wealth with refund reinvestment."}
              </p>
            </Link>

            <Link
              to={`${prefix}/calculators`}
              className="p-4 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] hover:border-[#2e4a3b] transition-all"
            >
              <span className="font-mono text-xs text-[#75581f] font-semibold block mb-1">04</span>
              <h4 className="font-serif text-base text-[#1c1b18] font-bold">
                {isFr ? "Plafond Passif SPCC" : "CCPC $50k Grind"}
              </h4>
              <p className="text-[0.72rem] text-[#625d52] mt-1">
                {isFr
                  ? "Calculez l'érosion 5:1 de votre déduction PME (DPE)."
                  : "Calculate Section 125(5.1) 5-for-1 SBD tax clawback."}
              </p>
            </Link>
          </div>

          {/* Contextual link to statutory blindspots */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-3.5 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] text-xs gap-3">
            <div className="flex items-center gap-2 text-[#46423a]">
              <AlertTriangle className="w-4 h-4 text-[#75581f] shrink-0" />
              <span>
                <strong>{isFr ? "Guide de vigilance :" : "Statutory vigilance:"}</strong>{" "}
                {isFr
                  ? "Explorez les règles statutaires et subventions méconnues souvent découvertes trop tard."
                  : "Explore verified Canadian money rules, grants, and tax traps most people discover too late."}
              </span>
            </div>
            <Link
              to={`${prefix}/costly-blindspots`}
              className="text-[#2e4a3b] font-semibold hover:underline shrink-0 flex items-center gap-1"
            >
              <span>{isFr ? "Consulter les pièges financiers →" : "View costly blindspots →"}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. November 2026 Regulatory Intelligence Briefing Callout */}
      <section className="section py-14 border-b border-[#d6cebd] bg-[#14211a] text-[#f7f3eb] on-dark">
        <div className="wrap max-w-6xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2e4a3b] pb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#d6c298]" />
              <span className="text-xs uppercase tracking-wider text-[#d6c298] font-semibold">
                {isFr ? "Veille Réglementaire • Novembre 2026" : "Monthly Advisor Briefing • November 2026"}
              </span>
            </div>
            <Link
              to={`${prefix}/what-changed`}
              className="text-xs text-[#d6c298] hover:text-white font-medium inline-flex items-center gap-1"
            >
              <span>{isFr ? "Lire toutes les 6 analyses de novembre →" : "Read all 6 November updates →"}</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-4 bg-[#2e4a3b]/30 border border-[#d6c298]/20 rounded-[2px] space-y-2">
              <span className="text-[11px] font-mono text-[#d6c298] block">Banque du Canada</span>
              <h4 className="font-serif text-base text-white font-semibold">
                {isFr ? "Taux directeur abaissé à 2,50 %" : "Overnight Rate Cut to 2.50%"}
              </h4>
              <p className="text-xs text-[#ece6da]/80 leading-relaxed">
                {isFr
                  ? "Taux préférentiel à 4,70 %. Allégement des dettes variables mais érosion rapide des comptes épargne à intérêt élevé (HISA)."
                  : "Prime rate drops to 4.70%. Variable borrowing costs ease, while static cash in savings accounts faces rapid return compression."}
              </p>
            </div>

            <div className="p-4 bg-[#2e4a3b]/30 border border-[#d6c298]/20 rounded-[2px] space-y-2">
              <span className="text-[11px] font-mono text-[#d6c298] block">BSIF (OSFI) B-20</span>
              <h4 className="font-serif text-base text-white font-semibold">
                {isFr ? "Fin du test pour transferts simples" : "Straight Switches Unburdened"}
              </h4>
              <p className="text-xs text-[#ece6da]/80 leading-relaxed">
                {isFr
                  ? "Les emprunteurs non assurés avec 20 % d'équité peuvent transférer de banque sans requalification au test de résistance."
                  : "Conventional mortgage borrowers with 20%+ equity can now switch lenders at maturity without requalifying under the stress test."}
              </p>
            </div>

            <div className="p-4 bg-[#2e4a3b]/30 border border-[#d6c298]/20 rounded-[2px] space-y-2">
              <span className="text-[11px] font-mono text-[#d6c298] block">ARC &amp; Loi C-69</span>
              <h4 className="font-serif text-base text-white font-semibold">
                {isFr ? "Gains en capital à 66,7 %" : "66.7% Corporate Capital Gains"}
              </h4>
              <p className="text-xs text-[#ece6da]/80 leading-relaxed">
                {isFr
                  ? "Inclusion à 66,7 % dès le 1er dollar pour les sociétés. Nécessite une restructuration par Compte de dividendes en capital."
                  : "Corporate portfolios face 66.7% inclusion from dollar one. Restructuring via Capital Dividend Account strategies is essential."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Clear Advisory Philosophy & Closing CTA */}
      <section className="section py-16 text-center">
        <div className="wrap max-w-3xl space-y-5">
          <h2 className="display text-[#1c1b18]">
            {isFr
              ? "Une décision financière éclairée commence toujours par une question franche."
              : "A sound financial decision begins with a clear, unbiased question."}
          </h2>

          <p className="lede text-base sm:text-lg text-[#46423a] max-w-xl mx-auto leading-relaxed">
            {isFr
              ? "Que vous deviez renégocier une hypothèque, optimiser la trésorerie de votre société ou protéger les revenus de votre foyer, examinons vos chiffres ensemble."
              : "Whether navigating a mortgage renewal, sheltering corporate retained earnings, or protecting family cash flow, let's look at the numbers together."}
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={siteConfig.schedulingUrl || "https://calendly.com/olabel/30min"}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary text-sm px-8 py-3 shadow-xs inline-flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-[#d6c298]" />
              <span>
                {isFr ? "Réserver un appel de 30 min sur Calendly" : "Schedule 30-Min Call on Calendly"}
              </span>
            </a>

            <Link to={`${prefix}/contact`} className="btn btn-ghost text-sm px-6 py-3 border border-[#d6cebd]">
              {isFr ? "Envoyer une question par courriel →" : "Send a Question via Email →"}
            </Link>
          </div>

          <p className="text-xs text-[#625d52] pt-2">
            {isFr
              ? "Ahmed Bello est un représentant indépendant affilié à World Financial Group Assurance du Canada Inc. (WFGIA). Rémunéré à commission sur le placement de produits financiers agréés. Aucun frais de consultation caché, aucune obligation d'achat."
              : "Ahmed Bello is an independent representative associated with World Financial Group Insurance Agency of Canada Inc. (WFGIA). Compensated through carrier commissions upon product placement. No consultation fees, zero obligation to purchase."}
          </p>
        </div>
      </section>
    </div>
  );
};
