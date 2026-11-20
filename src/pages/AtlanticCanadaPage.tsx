import React, { useState } from "react";
import { Link } from "react-router-dom";
import { SEO } from "../components/SEO.tsx";
import { useLanguage } from "../context/LanguageContext.tsx";
import { siteConfig, getCtaLabel, getSecondaryCtaLabel } from "../config/site.ts";
import { buildRouteJsonLd } from "../config/schema.ts";
import { CalculatorLeadCapture } from "../components/CalculatorLeadCapture.tsx";
import { trackBookingClick, trackCtaClick } from "../lib/track.ts";
import {
  MapPin,
  Calendar,
  ArrowRight,
  Building2,
  Home,
  Compass,
  Scale,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  BookOpen,
} from "lucide-react";

interface ProvinceBenchmark {
  provinceEn: string;
  provinceFr: string;
  smallBizRate: string;
  generalCorpRate: string;
  transferTaxEn: string;
  transferTaxFr: string;
  probateFeeEn: string;
  probateFeeFr: string;
}

const ATLANTIC_BENCHMARKS: ProvinceBenchmark[] = [
  {
    provinceEn: "New Brunswick (Dieppe, Moncton, Fredericton, Saint John)",
    provinceFr: "Nouveau-Brunswick (Dieppe, Moncton, Fredericton, Saint-Jean)",
    smallBizRate: "2.5% (11.5% combined)",
    generalCorpRate: "14.0% (29.0% combined)",
    transferTaxEn: "1.0% provincial RPTT (no broad first-time buyer rebate)",
    transferTaxFr: "1,0 % DTIM provincial (aucun rabais général 1er acheteur)",
    probateFeeEn: "$5 per $1,000 (~0.5%) on estate assets over $20,000",
    probateFeeFr: "5 $ par 1 000 $ (~0,5 %) au-delà de 20 000 $",
  },
  {
    provinceEn: "Nova Scotia (Halifax Regional Municipality & Province-Wide)",
    provinceFr: "Nouvelle-Écosse (Halifax et ensemble de la province)",
    smallBizRate: "1.5% up to $700k (10.5% <=$500k; 16.5% $500k-$700k)",
    generalCorpRate: "14.0% (29.0% combined)",
    transferTaxEn: "0.5% to 1.5% municipal Deed Transfer Tax (1.5% in HRM)",
    transferTaxFr: "0,5 % à 1,5 % taxe municipale (1,5 % à Halifax)",
    probateFeeEn: "$1,002.65 base + $16.95 per $1,000 (~1.695%) above $100,000",
    probateFeeFr: "1 002,65 $ de base + 16,95 $ par 1 000 $ (~1,695 %) > 100 000 $",
  },
  {
    provinceEn: "Prince Edward Island (Charlottetown & Summerside)",
    provinceFr: "Île-du-Prince-Édouard (Charlottetown et Summerside)",
    smallBizRate: "1.0% up to $600k (10.0% <=$500k)",
    generalCorpRate: "15.0% (30.0% combined)",
    transferTaxEn: "1.0% over $30,000 (full FTHB exemption, no price cap)",
    transferTaxFr: "1,0 % au-delà de 30 000 $ (exonération 1er acheteur sans plafond)",
    probateFeeEn: "Flat tiers up to $400 + $4 per $1,000 (~0.4%) above $100,000",
    probateFeeFr: "Paliers jusqu'à 400 $ + 4 $ par 1 000 $ (~0,4 %) > 100 000 $",
  },
  {
    provinceEn: "Newfoundland and Labrador (St. John's & Corner Brook)",
    provinceFr: "Terre-Neuve-et-Labrador (St. John's et Corner Brook)",
    smallBizRate: "2.0% (11.0% combined; cut Jan 1, 2026)",
    generalCorpRate: "15.0% (30.0% combined)",
    transferTaxEn: "Registry registration fee schedule ($100 base + $0.40/$100 > $500)",
    transferTaxFr: "Droits d'enregistrement foncier (100 $ + 0,40 $ par 100 $ > 500 $)",
    probateFeeEn: "$60 base + $6 per $1,000 (~0.6%) over $1,000",
    probateFeeFr: "60 $ de base + 6 $ par 1 000 $ (~0,6 %) au-delà de 1 000 $",
  },
];

export const AtlanticCanadaPage: React.FC = () => {
  const { isFr } = useLanguage();
  const prefix = isFr ? "/fr" : "";
  const ctaLabel = getCtaLabel(isFr);
  const secondaryCtaLabel = getSecondaryCtaLabel(isFr);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const seoTitle = isFr
    ? "Planification Financière Dieppe & N.-B. | Ahmed Bello"
    : "Financial Planning Dieppe, Moncton & NB | Ahmed Bello";
  const seoDesc = isFr
    ? "Planification financière à Dieppe, Moncton et en Atlantique : impôt SPCC N.-B. (2,5 %), droits immobiliers, homologation, AIP et comptes CELI/REER."
    : "Financial planning in Dieppe, Moncton, NB and Atlantic Canada: 2.5% NB CCPC tax, transfer taxes, probate fees, AIP settlement, and TFSA/RRSP strategy.";

  const faqs = isFr
    ? [
        {
          q: "Les acheteurs d'une première maison au Nouveau-Brunswick ont-ils droit à une exemption de droits de mutation ?",
          a: "Non. Contrairement à l'Ontario, à la Colombie-Britannique ou à l'Île-du-Prince-Édouard, le Nouveau-Brunswick perçoit un impôt provincial sur le transfert de biens réels de 1,0 % sans remboursement provincial général pour les premiers acheteurs. Sur une maison de 425 000 $ à Dieppe ou Moncton, prévoyez 4 250 $ en argent comptant dès la clôture, en plus des frais juridiques et d'inspection.",
        },
        {
          q: "Quel est le taux d'impôt des petites entreprises (SPCC) au Nouveau-Brunswick en 2026 ?",
          a: "Une société privée sous contrôle canadien (SPCC) admissible bénéficie d'un taux provincial de 2,5 % au Nouveau-Brunswick sur les premiers 500 000 $ de revenu actif d'entreprise, soit un taux combiné fédéral-provincial de 11,5 %. Toutefois, si le revenu de placement passif de la société dépasse 50 000 $, cette limite de 500 000 $ diminue de 5 $ pour chaque dollar excédentaire, faisant passer le taux jusqu'à 29,0 %.",
        },
        {
          q: "Comment éviter les frais d'homologation élevés en Nouvelle-Écosse et au Nouveau-Brunswick ?",
          a: "Le Nouveau-Brunswick facture 5 $ par 1 000 $ (~0,5 %) au-delà de 20 000 $ d'actifs passant par la succession, tandis que la Nouvelle-Écosse atteint 16,95 $ par 1 000 $ (~1,695 %) au-delà de 100 000 $. Désigner directement des bénéficiaires sur vos polices d'assurance vie, contrats de fonds distincts, CELI et REER permet à ces capitaux d'être versés directement aux survivants sans passer par le tribunal d'homologation.",
        },
        {
          q: "Quelle différence entre les fonds exigés par le Programme d'immigration au Canada atlantique (PICA) et le coût réel d'arrivée ?",
          a: "La preuve de fonds officielle du PICA ne représente que 12,5 % du seuil de faible revenu fédéral lorsqu'une offre d'emploi validée existe, ce qui est souvent inférieur aux dépenses réelles de premier hiver à Moncton, Dieppe ou Halifax (dépôt de logement, véhicule d'hiver, assurance auto sans historique canadien et délai d'attente de l'Assurance-maladie du N.-B.).",
        },
      ]
    : [
        {
          q: "Do first-time home buyers in Dieppe, Moncton, or New Brunswick receive a transfer tax rebate?",
          a: "No. Unlike Ontario, British Columbia, or Prince Edward Island, New Brunswick charges a 1.0% provincial Real Property Transfer Tax with no general first-time buyer exemption. On a $425,000 home in Dieppe or Moncton, buyers need $4,250 in cash specifically for transfer tax on closing day, making the tax-free FHSA and RRSP Home Buyers' Plan even more valuable.",
        },
        {
          q: "What is the New Brunswick small business corporate tax rate on a CCPC?",
          a: "Qualifying Canadian-controlled private corporations in New Brunswick pay a 2.5% provincial small business rate plus 9.0% federal, creating an 11.5% combined tax rate on the first $500,000 of active business income. If corporate passive investment income exceeds $50,000, the $500,000 ceiling grinds down by $5 per $1, shifting income to the 29.0% general corporate rate.",
        },
        {
          q: "How do probate fees compare between New Brunswick and Nova Scotia?",
          a: "New Brunswick assesses $5 per $1,000 (0.5%) on probated estate value above $20,000, while Nova Scotia climbs to $16.95 per $1,000 (~1.695%) above $100,000. Naming direct beneficiaries on TFSA, RRSP, life insurance, and segregated fund contracts allows proceeds to bypass the estate probate calculation and reach heirs faster.",
        },
        {
          q: "How much cash buffer do Atlantic Immigration Program (AIP) newcomers actually need in Moncton or Dieppe?",
          a: "While AIP proof-of-funds minimums with a qualifying job offer can be modest, newly arrived families typically face upfront apartment deposits, a winterized vehicle purchase, higher initial auto insurance premiums without Canadian claims history, and interim private health coverage before provincial Medicare begins.",
        },
      ];

  const AtlanticChecklistSummary = isFr
    ? [
        "Liste de vérification financière 2026 : Dieppe, N.-B. et Canada atlantique",
        "1. Immobilier N.-B. : prévoir 1,0 % de droits de transfert à la clôture (aucune exemption 1er acheteur) + cumul CELIAPP (40 k$) et RAP (60 k$).",
        "2. SPCC au N.-B. : taux combiné de 11,5 % jusqu'à 500 000 $, surveiller le seuil de 50 000 $ de revenus passifs (art. 125(5.1)).",
        "3. Successions : N.-B. 0,5 % et N.-É. ~1,695 % en homologation. Vérifier les bénéficiaires désignés (CELI, REER, assurances, fonds distincts).",
        "4. Nouveaux arrivants (PICA) : bâtir un historique de crédit canadien dès la 1re semaine et soumettre les lettres d'expérience automobile.",
      ].join("\n")
    : [
        "2026 Dieppe, NB & Atlantic Canada Financial Planning Checklist",
        "1. New Brunswick Closing Cash: Budget 1.0% provincial Real Property Transfer Tax (no NB first-time buyer rebate) and combine $40k FHSA + $60k HBP.",
        "2. NB Corporate Strategy: Protect the 11.5% combined small business tax rate by tracking the $50,000 passive income threshold under ITA 125(5.1).",
        "3. Probate Exposure: NB (~0.5%) and NS (~1.695%) estate probate fees apply to un-named estate assets. Review beneficiary designations regularly.",
        "4. AIP Settlement Runway: Bring foreign driving experience letters for insurance discounts and open a newcomer credit account in week one.",
      ].join("\n");

  const localizedGuides = [
    {
      to: `${prefix}/education/dieppe-moncton-first-time-homebuyer-fhsa-nb-rebates`,
      tag: isFr ? "Immobilier N.-B." : "NB Real Estate",
      title: isFr
        ? "Acheter une première maison à Dieppe et Moncton : CELIAPP, RAP et taxe de 1 %"
        : "First-Time Homebuyer Strategy in Dieppe, Moncton & New Brunswick",
      desc: isFr
        ? "Chiffres réels sur le droit de transfert foncier au N.-B., le remboursement SCHL Éco Plus de 25 % et le cumul de 100 000 $."
        : "Cash math for NB's 1.0% Real Property Transfer Tax, stacking $40k FHSA + $60k HBP, and the 25% CMHC Eco Plus refund.",
    },
    {
      to: `${prefix}/insights/new-brunswick-ccpc-corporate-tax-small-business-strategy`,
      tag: isFr ? "SPCC & Entreprises" : "NB Corporate Tax",
      title: isFr
        ? "SPCC au Nouveau-Brunswick : taux de 11,5 %, seuil de 50 000 $ et CDC"
        : "New Brunswick CCPC Tax, $50k Passive Income & CDA Extraction",
      desc: isFr
        ? "Protégez la déduction pour petite entreprise à 11,5 % contre la réduction vers 29 % et évitez l'homologation sur les actifs corporatifs."
        : "Protect the 11.5% combined NB small business rate from the 29.0% passive grind and coordinate corporate estate liquidity.",
    },
    {
      to: `${prefix}/education/atlantic-canada-newcomer-aip-money-guide`,
      tag: isFr ? "Nouveaux arrivants (PICA)" : "AIP Settlement",
      title: isFr
        ? "Finances des nouveaux arrivants à Dieppe, Moncton et en Atlantique (PICA)"
        : "Atlantic Canada & AIP Newcomer Money Guide: Proof of Funds vs. Real Costs",
      desc: isFr
        ? "Délai d'assurance-maladie du N.-B., rabais d'assurance auto, carte de crédit et comptes CELI dès la 1re année."
        : "Navigate NB Medicare timing, foreign driving history credits, bilingual career transitions, and first-year TFSA/T1135 rules.",
    },
    {
      to: `${prefix}/education/halal-tfsa-rrsp-fhsa-investing-canada`,
      tag: isFr ? "Finance Islamique" : "Halal Investing",
      title: isFr
        ? "Investir conforme à la charia au Canada : CELI, REER, CELIAPP et Zakat"
        : "Halal TFSA, RRSP & FHSA Investing in Canada: AAOIFI Screening & Zakah",
      desc: isFr
        ? "Comment bâtir un portefeuille d'actions conforme aux normes AAOIFI sans intérêts (Riba) dans les abris fiscaux canadiens."
        : "How Canadian Muslim families and professionals invest tax-efficiently without interest (Riba) using AAOIFI-screened equity.",
    },
  ];

  return (
    <div className="bg-[#f7f3eb]">
      <SEO
        title={seoTitle}
        description={seoDesc}
        canonicalUrl={isFr ? "/fr/atlantic-canada" : "/atlantic-canada"}
        jsonLd={buildRouteJsonLd({
          pathname: isFr ? "/fr/atlantic-canada" : "/atlantic-canada",
          title: seoTitle,
          description: seoDesc,
          heading: isFr
            ? "Planification financière à Dieppe, Moncton et au Canada atlantique"
            : "Financial Planning in Dieppe, Moncton & Atlantic Canada",
          isFr,
          faqs: faqs.map((f) => ({ question: f.q, answer: f.a })),
        })}
      />

      {/* 1. Local & Regional Authority Hero */}
      <section className="section border-b border-[#d6cebd]">
        <div className="wrap max-w-5xl space-y-5">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#2e4a3b]">
            <MapPin className="w-4 h-4 text-[#75581f]" aria-hidden="true" />
            <span>
              {isFr
                ? "Dieppe & Grand Moncton, N.-B. • Nouveau-Brunswick, Nouvelle-Écosse, Î.-P.-É., T.-N.-L."
                : "Dieppe & Greater Moncton, NB • New Brunswick, Nova Scotia, PEI & NL"}
            </span>
          </div>

          <h1 className="h1 text-[#1c1b18]">
            {isFr
              ? "Planification financière adaptée aux réalités du Nouveau-Brunswick et du Canada atlantique."
              : "Financial planning built around New Brunswick and Atlantic Canada rules."}
          </h1>

          <p className="lede measure">
            {isFr
              ? "La majorité des guides financiers canadiens sont écrits pour l'Ontario ou la Colombie-Britannique. Basé à Dieppe au Nouveau-Brunswick, j'aide les familles, médecins, entrepreneurs et nouveaux arrivants de l'Atlantique à planifier selon nos propres taux d'imposition, droits de mutation, frais d'homologation et programmes d'immigration."
              : "Most national money advice assumes Ontario or BC rules. Practising from Dieppe in Greater Moncton, New Brunswick, I help Atlantic Canadian families, business owners, healthcare workers, and newcomers plan around provincial tax rates, closing costs, and probate laws."}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-5">
            <a
              href={siteConfig.schedulingUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackBookingClick("atlantic_canada_hero")}
              className="btn btn-primary inline-flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-[#d6c298]" aria-hidden="true" />
              <span>{ctaLabel}</span>
            </a>

            <Link to={`${prefix}/calculators`} className="arrow-link text-sm sm:text-base">
              <span>{isFr ? "Lancer les simulateurs canadiens" : "Open interactive calculators"}</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Four Atlantic Regional Realities */}
      <section className="section bg-[#fcfaf5] border-b border-[#d6cebd]">
        <div className="wrap max-w-5xl space-y-8">
          <div className="space-y-2">
            <span className="eyebrow block">
              {isFr ? "Particularités provinciales" : "Provincial Rules That Matter"}
            </span>
            <h2 className="h2 text-[#1c1b18]">
              {isFr
                ? "Quatre règles de l'Atlantique qui changent vos chiffres"
                : "Four Atlantic Canada rules that change household math"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card-editorial p-6 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#2e4a3b]">
                <Home className="w-4 h-4 text-[#75581f]" aria-hidden="true" />
                <span>{isFr ? "Achat immobilier N.-B. & N.-É." : "NB & NS Property Closing Cash"}</span>
              </div>
              <h3 className="h3 text-[#1c1b18]">
                {isFr
                  ? "Pas de rabais provincial de transfert au Nouveau-Brunswick"
                  : "New Brunswick charges 1.0% transfer tax with no first-time buyer rebate"}
              </h3>
              <p className="small text-[#46423a] leading-relaxed">
                {isFr
                  ? "Les acheteurs de Dieppe, Moncton ou Fredericton doivent prévoir 1,0 % comptant dès le notaire (4 250 $ sur 425 000 $). Cumuler CELIAPP et RAP devient déterminant pour protéger la mise de fonds."
                  : "Buyers in Dieppe, Moncton, and Fredericton pay 1.0% Real Property Transfer Tax in cash on closing ($4,250 on a $425,000 home). Coordinating FHSA tax refunds and HBP funds protects down-payment liquidity."}
              </p>
            </div>

            <div className="card-editorial p-6 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#2e4a3b]">
                <Building2 className="w-4 h-4 text-[#75581f]" aria-hidden="true" />
                <span>{isFr ? "Sociétés SPCC (N.-B. / Atlantique)" : "NB & Atlantic CCPC Tax Integration"}</span>
              </div>
              <h3 className="h3 text-[#1c1b18]">
                {isFr
                  ? "Protéger le taux corporatif combiné de 11,5 % au N.-B."
                  : "Defending the 11.5% small business rate against the 29.0% passive grind"}
              </h3>
              <p className="small text-[#46423a] leading-relaxed">
                {isFr
                  ? "Avec un taux provincial de 2,5 % au N.-B. jusqu'à 500 000 $, perdre la déduction pour petite entreprise à cause du seuil passif de 50 000 $ crée un écart d'impôt corporatif de 17,5 points."
                  : "With New Brunswick's 2.5% small business rate up to $500,000, triggering the $50k–$150k passive income clawback shifts corporate income by 17.5 percentage points to the 29.0% general rate."}
              </p>
            </div>

            <div className="card-editorial p-6 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#2e4a3b]">
                <Scale className="w-4 h-4 text-[#75581f]" aria-hidden="true" />
                <span>{isFr ? "Homologation & Successions" : "Estate Probate Exposure"}</span>
              </div>
              <h3 className="h3 text-[#1c1b18]">
                {isFr
                  ? "0,5 % au N.-B. jusqu'à ~1,695 % en Nouvelle-Écosse"
                  : "Probate fees range from 0.5% in NB up to ~1.695% in Nova Scotia"}
              </h3>
              <p className="small text-[#46423a] leading-relaxed">
                {isFr
                  ? "Les placements sans bénéficiaire direct nommé s'ajoutent à la valeur soumise à la cour. Des désignations valides sur les régimes enregistrés, polices d'assurance et fonds distincts accélèrent le règlement."
                  : "Un-named estate balances face court probate fees and delays. Properly coordinated beneficiary designations on registered accounts, life policies, and segregated funds transfer wealth cleanly outside probate."}
              </p>
            </div>

            <div className="card-editorial p-6 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#2e4a3b]">
                <Compass className="w-4 h-4 text-[#75581f]" aria-hidden="true" />
                <span>{isFr ? "Immigration PICA & Soignants" : "AIP Newcomers & Bilingual Careers"}</span>
              </div>
              <h3 className="h3 text-[#1c1b18]">
                {isFr
                  ? "Budget d'arrivée réaliste dans le Grand Moncton"
                  : "AIP settlement buffers beyond federal minimum proof of funds"}
              </h3>
              <p className="small text-[#46423a] leading-relaxed">
                {isFr
                  ? "Entre les frais d'équivalence en santé, l'achat d'un véhicule fiable et l'assurance sans dossier canadien, nos guides préparent vos réserves des 12 premiers mois sans erreur fiscale."
                  : "From healthcare licensing fees and winter vehicle financing to auto insurance credit history letters, planning the first 12 months in Atlantic Canada prevents early liquidity traps."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Atlantic Provinces 2026 Tax, Transfer & Probate Comparison Table */}
      <section className="section border-b border-[#d6cebd]">
        <div className="wrap max-w-6xl space-y-6">
          <div className="space-y-2">
            <span className="eyebrow block">
              {isFr ? "Tableau comparatif 2026" : "2026 Atlantic Provinces Reference"}
            </span>
            <h2 className="h2 text-[#1c1b18]">
              {isFr
                ? "Taux corporatifs, droits immobiliers et homologation dans les 4 provinces"
                : "Corporate tax, property transfer, and probate rules across Atlantic Canada"}
            </h2>
            <p className="small text-[#625d52]">
              {isFr
                ? "Données éducatives basées sur les lois provinciales et les barèmes fédéraux publiés en vigueur. Vérifiez toujours votre dossier avec un comptable ou notaire de votre province."
                : "Educational summary of published provincial statutes alongside federal 9.0% small business and 15.0% general corporate rates. Verify transaction specifics with your local CPA or lawyer."}
            </p>
          </div>

          <div className="overflow-x-auto card-editorial">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-[#14211a] text-[#f7f3eb]">
                  <th className="p-3.5 font-semibold">{isFr ? "Province" : "Province & Cities"}</th>
                  <th className="p-3.5 font-semibold">{isFr ? "Taux PME (DPE)" : "Small Business Tax (SBD)"}</th>
                  <th className="p-3.5 font-semibold">{isFr ? "Taux général SPCC" : "General Corp Rate"}</th>
                  <th className="p-3.5 font-semibold">{isFr ? "Droits immobiliers" : "Property Transfer Tax"}</th>
                  <th className="p-3.5 font-semibold">{isFr ? "Frais d'homologation" : "Estate Probate Fees"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ece6da]">
                {ATLANTIC_BENCHMARKS.map((row) => (
                  <tr key={row.provinceEn} className="hover:bg-[#fcfaf5]">
                    <td className="p-3.5 font-medium text-[#1c1b18]">
                      {isFr ? row.provinceFr : row.provinceEn}
                    </td>
                    <td className="p-3.5 tabular-nums font-medium text-[#2e4a3b]">{row.smallBizRate}</td>
                    <td className="p-3.5 tabular-nums text-[#46423a]">{row.generalCorpRate}</td>
                    <td className="p-3.5 text-[#46423a]">
                      {isFr ? row.transferTaxFr : row.transferTaxEn}
                    </td>
                    <td className="p-3.5 text-[#46423a]">
                      {isFr ? row.probateFeeFr : row.probateFeeEn}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 4. Deep-Dive Regional & Niche Long-Tail Playbooks */}
      <section className="section bg-[#fcfaf5] border-b border-[#d6cebd]">
        <div className="wrap max-w-5xl space-y-6">
          <div className="space-y-1">
            <span className="eyebrow block">
              {isFr ? "Guides spécialisés" : "In-Depth Guides & Analyses"}
            </span>
            <h2 className="h2 text-[#1c1b18]">
              {isFr
                ? "Ressources détaillées pour le Grand Moncton, l'Atlantique et vos priorités"
                : "Targeted guides for New Brunswick, newcomers, business owners & ethical investors"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {localizedGuides.map((guide) => (
              <Link
                key={guide.to}
                to={guide.to}
                onClick={() => trackCtaClick("atlantic_hub_guide", guide.to)}
                className="card-editorial p-6 flex flex-col justify-between hover:border-[#2e4a3b] transition-colors group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#75581f]">
                    <BookOpen className="w-3.5 h-3.5 text-[#2e4a3b]" aria-hidden="true" />
                    <span>{guide.tag}</span>
                  </div>
                  <h3 className="h3 text-[#1c1b18] group-hover:text-[#2e4a3b] transition-colors leading-snug">
                    {guide.title}
                  </h3>
                  <p className="small text-[#46423a] leading-relaxed">{guide.desc}</p>
                </div>
                <span className="pt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#2e4a3b]">
                  <span>{isFr ? "Lire le guide complet" : "Read full guide"}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Frequently Asked Regional Questions */}
      <section className="section border-b border-[#d6cebd]">
        <div className="wrap max-w-4xl space-y-6">
          <div className="space-y-1">
            <span className="eyebrow block">
              {isFr ? "Questions fréquentes" : "Regional FAQ"}
            </span>
            <h2 className="h2 text-[#1c1b18]">
              {isFr
                ? "Questions fréquentes au Nouveau-Brunswick et en Atlantique"
                : "Common financial questions across New Brunswick and Atlantic Canada"}
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={faq.q} className="card-editorial overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-[#fcfaf5] transition-colors cursor-pointer"
                  >
                    <span className="font-serif text-lg text-[#1c1b18] leading-snug">{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#2e4a3b] shrink-0" aria-hidden="true" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#625d52] shrink-0" aria-hidden="true" />
                    )}
                  </button>
                  <div className={isOpen ? "px-5 pb-5 pt-1 text-sm text-[#46423a] leading-relaxed border-t border-[#ece6da]" : "hidden"}>
                    <p>{faq.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Regional Checklist Email Capture & Closing CTA */}
      <section className="section bg-[#fcfaf5]">
        <div className="wrap max-w-4xl space-y-10">
          <CalculatorLeadCapture
            calculatorName="Atlantic Canada & NB 2026 Financial Checklist"
            analyticsCalculatorName="atlantic_canada_checklist"
            analyticsTopic="general"
            topic="general"
            className="!mt-0"
            summaryText={AtlanticChecklistSummary}
            customSubheading={
              isFr ? "Ressource régionale gratuite (N.-B. & Atlantique)" : "Free Regional Resource (NB & Atlantic Canada)"
            }
            customHeading={
              isFr
                ? "Recevoir la liste financière 2026 pour Dieppe, N.-B. et l'Atlantique"
                : "Email me the 2026 New Brunswick & Atlantic Canada Checklist"
            }
            customButtonLabel={
              isFr ? "M'envoyer l'aide-mémoire régional" : "Email Me the Regional Checklist"
            }
          />

          <div className="text-center space-y-4 pt-4 border-t border-[#d6cebd]">
            <div className="inline-flex items-center gap-2 text-xs font-medium text-[#75581f]">
              <ShieldCheck className="w-4 h-4 text-[#2e4a3b]" aria-hidden="true" />
              <span>
                {isFr
                  ? "Rencontres bilingues en personne à Dieppe/Moncton ou en visioconférence partout au Canada"
                  : "Bilingual meetings in Dieppe/Greater Moncton or virtually across Canada"}
              </span>
            </div>
            <h2 className="h2 text-[#1c1b18]">
              {isFr
                ? "Parlons de vos projets financiers en français ou en anglais."
                : "Discuss your family, corporate, or settlement numbers in English or French."}
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-1">
              <a
                href={siteConfig.schedulingUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackBookingClick("atlantic_canada_bottom")}
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
          </div>
        </div>
      </section>
    </div>
  );
};
