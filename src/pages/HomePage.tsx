import React from "react";
import { Link } from "react-router-dom";
import { BrandMark } from "../components/BrandMark.tsx";
import { Portrait } from "../components/Portrait.tsx";
import { SEO } from "../components/SEO.tsx";
import { buildRouteJsonLd } from "../config/schema.ts";
import { HowThePiecesFit } from "../components/HowThePiecesFit.tsx";
import { CalculatorLeadCapture } from "../components/CalculatorLeadCapture.tsx";
import { siteConfig, getCtaLabel, getSecondaryCtaLabel } from "../config/site.ts";
import { useLanguage } from "../context/LanguageContext.tsx";
import { trackBookingClick } from "../lib/track.ts";
import {
  Calendar,
  ArrowRight,
  Compass,
  Building2,
  Stethoscope,
  Users,
  AlertTriangle,
} from "lucide-react";

export const HomePage: React.FC = () => {
  const { isFr } = useLanguage();
  const prefix = isFr ? "/fr" : "";
  const ctaLabel = getCtaLabel(isFr);
  const secondaryCtaLabel = getSecondaryCtaLabel(isFr);

  const homeTitle = isFr
    ? "Ahmed Bello | Planification financière à Dieppe, NB"
    : "Ahmed Bello | Financial Planning in Dieppe, NB";
  const homeDescription = isFr
    ? "Stratégie patrimoniale fiscalement efficiente et protection du revenu pour familles canadiennes, SPCC, professionnels de santé et nouveaux arrivants."
    : "Tax-efficient wealth strategy, income protection, and registered account planning for Canadian families, CCPCs, healthcare pros, and newcomers.";
  const canonicalPath = isFr ? "/fr" : "/";

  const homeJsonLd = React.useMemo(
    () =>
      buildRouteJsonLd({
        pathname: canonicalPath,
        title: homeTitle,
        description: homeDescription,
        heading: isFr
          ? "Ahmed Bello | Professionnel en Solutions Financières Agréé"
          : "Ahmed Bello | Licensed Financial Solutions Professional",
        isFr,
      }),
    [canonicalPath, homeDescription, homeTitle, isFr]
  );

  return (
    <div className="bg-[#f7f3eb]">
      <SEO
        title={homeTitle}
        description={homeDescription}
        canonicalUrl={canonicalPath}
        jsonLd={homeJsonLd}
      />

      {/* 1. Hero: Clear Positioning, Single Primary CTA & Single Text Link */}
      <section className="section border-b border-[#d6cebd]">
        <div className="wrap max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Direct Value Proposition */}
            <div className="lg:col-span-7 space-y-5 rise">
              <span className="eyebrow block">
                {isFr
                  ? "Dieppe, Nouveau-Brunswick • Pratique indépendante au Canada"
                  : "Dieppe, New Brunswick • Independent Canadian Practice"}
              </span>

              <h1 className="display text-[#1c1b18]">
                {isFr ? (
                  <>
                    Planification financière pour{" "}
                    <span className="font-serif italic font-normal text-[#2e4a3b]">
                      familles, entrepreneurs
                    </span>{" "}
                    et soignants au Canada.
                  </>
                ) : (
                  <>
                    Financial planning for{" "}
                    <span className="font-serif italic font-normal text-[#2e4a3b]">
                      families, business owners
                    </span>{" "}
                    &amp; healthcare professionals.
                  </>
                )}
              </h1>

              <p className="lede measure">
                {isFr
                  ? "J'aide les ménages, entrepreneurs et professionnels de la santé au Canada à coordonner leurs comptes enregistrés, leur protection du revenu et leur fiscalité. Chaque rencontre débute par un examen simple de vos chiffres et priorités, à votre rythme."
                  : "I help Canadian families, business owners, and healthcare professionals coordinate their registered accounts, income protection, and tax decisions. Every engagement starts with a plain-language look at your numbers and priorities, at your own pace."}
              </p>

              {/* Single Primary Button + Single Text Link */}
              <div className="pt-2 flex flex-wrap items-center gap-6">
                <a
                  href={siteConfig.schedulingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackBookingClick("home_hero")}
                  className="btn btn-primary inline-flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4 text-[#d6c298]" aria-hidden="true" />
                  <span>{ctaLabel}</span>
                </a>

                <Link to={`${prefix}/calculators`} className="arrow-link text-sm sm:text-base">
                  <span>{isFr ? "Essayer les simulateurs" : "Explore financial calculators"}</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </div>

              {/* Concise WFGIA Commission Disclosure & How I'm Paid Link */}
              <p className="small text-[#625d52] pt-1 max-w-xl">
                {isFr
                  ? "Représentant indépendant affilié à WFGIA, rémunéré par commission lors du placement d'un produit. "
                  : "Independent representative contracted with WFGIA, compensated by carrier commissions upon product placement. "}
                <Link to={`${prefix}/disclosures`} className="link">
                  {isFr ? "Comment je suis rémunéré" : "How I'm paid"}
                </Link>
                .
              </p>
            </div>

            {/* Right Column: Canonical Portrait from siteConfig */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end rise rise-2">
              <div className="w-full max-w-sm space-y-3">
                <Portrait
                  alt={
                    isFr
                      ? "Ahmed Bello, professionnel agréé en solutions financières à Dieppe, NB"
                      : "Ahmed Bello, Licensed Financial Solutions Professional in Dieppe, NB"
                  }
                  variant="hero"
                  loading="eager"
                  fetchPriority="high"
                />
                <div className="flex items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-2.5">
                    <BrandMark size={26} className="w-6.5 h-6.5 shrink-0 text-[#2e4a3b]" />
                    <div>
                      <p className="font-serif text-lg text-[#1c1b18] leading-tight">Ahmed Bello</p>
                      <p className="text-xs text-[#75581f] font-medium">
                        {isFr
                          ? "Professionnel en solutions financières agréé"
                          : siteConfig.designation}
                      </p>
                    </div>
                  </div>
                  <Link to={`${prefix}/about`} className="arrow-link text-xs shrink-0">
                    {isFr ? "À propos →" : "About →"}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Practice Pillars */}
      <section className="section border-b border-[#d6cebd] bg-[#fcfaf5]">
        <div className="wrap max-w-6xl space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="eyebrow block">
                {isFr ? "Pôles de pratique" : "Who I work with"}
              </span>
              <h2 className="h2 text-[#1c1b18] mt-1">
                {isFr ? "À qui s'adresse notre pratique" : "Who the practice is built for"}
              </h2>
            </div>
            <p className="small text-[#625d52] max-w-md">
              {isFr
                ? "Un accompagnement structuré autour de quatre réalités financières canadiennes précises."
                : "Structured planning built around four common Canadian financial crossroads."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <Link
              to={`${prefix}/for/families`}
              className="card-editorial p-6 hover:border-[#2e4a3b] transition-colors group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <Users className="w-5 h-5 text-[#2e4a3b]" aria-hidden="true" />
                <h3 className="h3 text-[#1c1b18] group-hover:text-[#2e4a3b] transition-colors">
                  {isFr ? "Familles canadiennes" : "Canadian Families"}
                </h3>
                <p className="small text-[#46423a]">
                  {isFr
                    ? "Renouvellement hypothécaire, cumul CELIAPP et RAP, REEE, REEI et protection du revenu familial."
                    : "Mortgage renewals, FHSA + RRSP HBP pooling, RESPs & RDSP disability grants, and family income protection."}
                </p>
              </div>
              <span className="pt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[#2e4a3b]">
                <span>{isFr ? "Explorer" : "Explore guidance"}</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </span>
            </Link>

            <Link
              to={`${prefix}/for/business-owners`}
              className="card-editorial p-6 hover:border-[#2e4a3b] transition-colors group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <Building2 className="w-5 h-5 text-[#75581f]" aria-hidden="true" />
                <h3 className="h3 text-[#1c1b18] group-hover:text-[#2e4a3b] transition-colors">
                  {isFr ? "Entrepreneurs & SPCC" : "Incorporated Owners"}
                </h3>
                <p className="small text-[#46423a]">
                  {isFr
                    ? "Seuil de 50 000 $ de revenus passifs (DPE), compte de dividendes en capital et réserve corporative."
                    : "Managing the $50,000 passive income limit, Capital Dividend Account strategy, and retained earnings."}
                </p>
              </div>
              <span className="pt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[#2e4a3b]">
                <span>{isFr ? "Explorer" : "Explore guidance"}</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </span>
            </Link>

            <Link
              to={`${prefix}/for/healthcare`}
              className="card-editorial p-6 hover:border-[#2e4a3b] transition-colors group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <Stethoscope className="w-5 h-5 text-[#2e4a3b]" aria-hidden="true" />
                <h3 className="h3 text-[#1c1b18] group-hover:text-[#2e4a3b] transition-colors">
                  {isFr ? "Professionnels de santé" : "Healthcare Workers"}
                </h3>
                <p className="small text-[#46423a]">
                  {isFr
                    ? "Trésorerie pendant l'équivalence des diplômes, incorporation médicale et protection invalidité."
                    : "Credential recognition cash flow, physician incorporation, and non-cancellable disability protection."}
                </p>
              </div>
              <span className="pt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[#2e4a3b]">
                <span>{isFr ? "Explorer" : "Explore guidance"}</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </span>
            </Link>

            <Link
              to={`${prefix}/for/newcomers`}
              className="card-editorial p-6 hover:border-[#2e4a3b] transition-colors group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <Compass className="w-5 h-5 text-[#75581f]" aria-hidden="true" />
                <h3 className="h3 text-[#1c1b18] group-hover:text-[#2e4a3b] transition-colors">
                  {isFr ? "Nouveaux arrivants" : "Newcomers to Canada"}
                </h3>
                <p className="small text-[#46423a]">
                  {isFr
                    ? "Réserve de première année, historique de crédit canadien et déclaration T1135."
                    : "First-year settlement reserves, building Canadian credit history, and CRA Form T1135 compliance."}
                </p>
              </div>
              <span className="pt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[#2e4a3b]">
                <span>{isFr ? "Explorer" : "Explore guidance"}</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </span>
            </Link>
          </div>

          <div className="pt-4 border-t border-[#d6cebd] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="small text-[#46423a]">
              {isFr
                ? "Établi à Dieppe, N.-B. : consultez nos repères provinciaux sur les sociétés SPCC, l'homologation et les droits immobiliers au Canada atlantique."
                : "Practising from Dieppe, NB: compare corporate small business taxes, property transfer rules, and probate across Atlantic Canada."}
            </p>
            <Link to={`${prefix}/atlantic-canada`} className="arrow-link text-sm shrink-0">
              <span>{isFr ? "Guide Dieppe & Canada atlantique" : "Dieppe & Atlantic Canada guide"}</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2.5 How the Pieces Fit */}
      <HowThePiecesFit />

      {/* 3. Interactive Calculators Strip */}
      <section className="section border-b border-[#d6cebd]">
        <div className="wrap max-w-6xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="eyebrow block">
                {isFr ? "Simulateurs interactifs" : "Interactive Calculators"}
              </span>
              <h2 className="h2 text-[#1c1b18] mt-1">
                {isFr ? "Modélisez vos chiffres" : "Run the numbers before deciding"}
              </h2>
            </div>
            <Link to={`${prefix}/calculators`} className="arrow-link text-sm shrink-0">
              <span>{isFr ? "Tous les simulateurs" : "Open all calculators"} →</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to={`${prefix}/calculators?tab=newcomer#calculator-tool`}
              className="card-editorial p-5 hover:border-[#2e4a3b] transition-colors"
            >
              <span className="text-xs text-[#75581f] font-semibold block mb-1">01</span>
              <h3 className="font-serif text-lg text-[#1c1b18]">
                {isFr ? "Trésorerie 1re année" : "Newcomer Runway"}
              </h3>
              <p className="small text-[#625d52] mt-1">
                {isFr
                  ? "Estimez vos réserves de première année et coûts d'équivalence."
                  : "Estimate living reserves and credential exam costs."}
              </p>
            </Link>

            <Link
              to={`${prefix}/calculators?tab=mortgage#calculator-tool`}
              className="card-editorial p-5 hover:border-[#2e4a3b] transition-colors"
            >
              <span className="text-xs text-[#75581f] font-semibold block mb-1">02</span>
              <h3 className="font-serif text-lg text-[#1c1b18]">
                {isFr ? "Choc hypothécaire" : "Mortgage Renewal"}
              </h3>
              <p className="small text-[#625d52] mt-1">
                {isFr
                  ? "Comparez la hausse de mensualités et l'effet sur votre CELI."
                  : "Measure payment changes and TFSA trade-offs."}
              </p>
            </Link>

            <Link
              to={`${prefix}/calculators?tab=tfsa-rrsp#calculator-tool`}
              className="card-editorial p-5 hover:border-[#2e4a3b] transition-colors"
            >
              <span className="text-xs text-[#75581f] font-semibold block mb-1">03</span>
              <h3 className="font-serif text-lg text-[#1c1b18]">
                {isFr ? "CELI vs REER" : "TFSA vs RRSP"}
              </h3>
              <p className="small text-[#625d52] mt-1">
                {isFr
                  ? "Comparez la valeur nette après impôt selon vos tranches."
                  : "Compare after-tax wealth across tax brackets."}
              </p>
            </Link>

            <Link
              to={`${prefix}/calculators/amt`}
              className="card-editorial p-5 hover:border-[#2e4a3b] transition-colors"
            >
              <span className="text-xs text-[#75581f] font-semibold block mb-1">04</span>
              <h3 className="font-serif text-lg text-[#1c1b18]">
                {isFr ? "Impôt minimum (IMR)" : "Federal AMT"}
              </h3>
              <p className="small text-[#625d52] mt-1">
                {isFr
                  ? "Évaluez votre exposition à l'impôt minimum de remplacement."
                  : "Check federal Alternative Minimum Tax exposure."}
              </p>
            </Link>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#d6cebd]">
            <div className="flex items-center gap-2 small text-[#46423a]">
              <AlertTriangle className="w-4 h-4 text-[#75581f] shrink-0" aria-hidden="true" />
              <span>
                {isFr
                  ? "Consultez les pièges fiscaux et subventions souvent oubliés au Canada."
                  : "Review common Canadian tax traps, deadlines, and overlooked government grants."}
              </span>
            </div>
            <Link to={`${prefix}/costly-blindspots`} className="arrow-link text-sm shrink-0">
              <span>{isFr ? "Voir les pièges financiers" : "View costly blindspots"} →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 3.5. Inline Lead-Magnet / Checklist Capture */}
      <section className="section border-b border-[#d6cebd] bg-[#fcfaf5]">
        <div className="wrap max-w-4xl">
          <div className="space-y-2 mb-6">
            <span className="eyebrow block">
              {isFr ? "Aide-mémoire gratuit • Édition 2026" : "Free 2026 Checklist • No Call Required"}
            </span>
            <h2 className="h2 text-[#1c1b18]">
              {isFr
                ? "Pas encore prêt pour un appel ? Recevez l'aide-mémoire financier 2026."
                : "Not ready for a call? Start with the 2026 Canadian Money Check."}
            </h2>
            <p className="body text-[#46423a] max-w-2xl">
              {isFr
                ? "Recevez par courriel les plafonds 2026 (CELI, REER, CELIAPP), les points clés avant un renouvellement hypothécaire et les échéances fiscales à ne pas manquer."
                : "Get a plain-language email breakdown of 2026 TFSA, RRSP, and FHSA limits, mortgage renewal checks, and missed CRA credit deadlines."}
            </p>
          </div>

          <CalculatorLeadCapture
            calculatorName="2026 Canadian Money & Tax Checklist"
            analyticsCalculatorName="home_checklist"
            analyticsTopic="general"
            topic="general"
            className="!mt-0"
            summaryText={
              isFr
                ? [
                    "Aide-mémoire financier canadien 2026 (demandé depuis l'accueil) :",
                    "1. Plafonds : CELI 7 000 $ (7 500 $ en 2027), REER jusqu'à 33 810 $ (35 390 $ en 2027), CELIAPP 8 000 $/an.",
                    "2. Renouvellement hypothécaire : évaluation du choc de mensualité et comparaison avec la liquidité CELI.",
                    "3. Pièges fréquents : subventions REEE inutilisées, remboursement SCHL écoénergétique (24 mois) et règle des 10 ans T1-ADJ.",
                  ].join("\n")
                : [
                    "2026 Canadian Money & Tax Checklist (requested from homepage):",
                    "1. Limits: TFSA $7,000 ($7,500 in 2027), RRSP up to $33,810 ($35,390 in 2027), FHSA $8,000/yr ($16,000 max with carry-forward once opened).",
                    "2. Mortgage Renewal Check: Compare higher monthly payments vs. keeping liquid emergency savings in a TFSA.",
                    "3. Missed Money Checks: Unused RESP grants, CMHC 25% energy-efficient refund (24-month window), and 10-year CRA T1-ADJ adjustments.",
                  ].join("\n")
            }
            customSubheading={isFr ? "Envoi immédiat par courriel" : "Sent Directly to Your Inbox"}
            customHeading={
              isFr
                ? "Recevoir la liste de vérification 2026 par courriel"
                : "Email me the 2026 Canadian Money & Tax Checklist"
            }
            customButtonLabel={isFr ? "Envoyer mon aide-mémoire" : "Email Me the Checklist"}
          />
        </div>
      </section>

      {/* 4. November 2026 Briefing Callout */}
      <section className="section border-b border-[#d6cebd] bg-[#14211a] text-[#f7f3eb] on-dark">
        <div className="wrap max-w-6xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2e4a3b] pb-4">
            <span className="eyebrow">
              {isFr ? "Veille réglementaire • Novembre 2026" : "2026 Money Rules • November Update"}
            </span>
            <Link to={`${prefix}/what-changed`} className="arrow-link text-xs">
              <span>{isFr ? "Lire les 7 mises à jour →" : "Read all 7 updates →"}</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2 border-t border-[#d6c298]/25 pt-4">
              <span className="text-xs font-medium text-[#d6c298] block">
                {isFr ? "Budget fédéral 2026" : "Federal Budget 2026"}
              </span>
              <h3 className="font-serif text-xl text-white">
                {isFr ? "Seuil T1135 à 200 000 $ & REER" : "T1135 $200k Threshold & RRSPs"}
              </h3>
              <p className="small text-[#ece6da]/85">
                {isFr
                  ? "Propositions du 5 novembre : seuil T1135 porté à 200 000 $, date de cotisation au 15 mai (2027) et consultations REER à vie."
                  : "Tabled Nov 5: proposes raising Form T1135 threshold to $200k, a unified May 15 date from 2027, and RRSP-for-life study."}
              </p>
            </div>

            <div className="space-y-2 border-t border-[#d6c298]/25 pt-4">
              <span className="text-xs font-medium text-[#d6c298] block">
                {isFr ? "Banque du Canada" : "Bank of Canada"}
              </span>
              <h3 className="font-serif text-xl text-white">
                {isFr ? "Taux directeur relevé à 2,50 %" : "Overnight Rate at 2.50%"}
              </h3>
              <p className="small text-[#ece6da]/85">
                {isFr
                  ? "Hausse de 25 pb le 28 octobre (taux préférentiel à 4,70 %). Impact direct sur les hypothèques variables et marges."
                  : "Raised 25 bps on Oct 28 (prime at 4.70%). Variable borrowing and HELOC servicing adjust accordingly."}
              </p>
            </div>

            <div className="space-y-2 border-t border-[#d6c298]/25 pt-4">
              <span className="text-xs font-medium text-[#d6c298] block">
                {isFr ? "Plafonds ARC 2027" : "CRA 2027 Limits"}
              </span>
              <h3 className="font-serif text-xl text-white">
                {isFr ? "CELI 7 500 $ & REER 35 390 $" : "2027 TFSA $7,500 & RRSP $35,390"}
              </h3>
              <p className="small text-[#ece6da]/85">
                {isFr
                  ? "MGA du RPC à 76 700 $, taux prescrit T4 maintenu à 3 % pour les prêts familiaux et inclusion des gains à 50 %."
                  : "2027 CPP YMPE reaches $76,700, Q4 prescribed rate holds at 3%, and 50% capital gains inclusion stays in force."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Closing CTA */}
      <section className="section text-center">
        <div className="wrap max-w-3xl space-y-5">
          <h2 className="display text-[#1c1b18]">
            {isFr
              ? "Une bonne décision commence par une question claire."
              : "A sound financial decision starts with a clear question."}
          </h2>

          <p className="lede measure mx-auto">
            {isFr
              ? "Renouvellement hypothécaire, épargne enregistrée ou protection familiale : regardons vos chiffres ensemble."
              : "Whether reviewing a mortgage renewal, registered accounts, or family protection, let's look at the numbers together."}
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-5">
            <a
              href={siteConfig.schedulingUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackBookingClick("home_bottom")}
              className="btn btn-primary inline-flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-[#d6c298]" aria-hidden="true" />
              <span>{ctaLabel}</span>
            </a>

            <Link to={`${prefix}/contact`} className="arrow-link text-sm sm:text-base">
              <span>{secondaryCtaLabel}</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <p className="small text-[#625d52] pt-2 max-w-xl mx-auto">
            {isFr
              ? "Représentant indépendant affilié à WFGIA, rémunéré par commission lors du placement d'un produit. "
              : "Independent representative contracted with WFGIA, compensated by carrier commissions upon product placement. "}
            <Link to={`${prefix}/disclosures`} className="link">
              {isFr ? "Comment je suis rémunéré" : "How I'm paid"}
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
};
