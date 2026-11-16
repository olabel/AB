import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.tsx";
import { FileText, CheckCircle2, ShieldCheck } from "lucide-react";

interface CaseStudy {
  id: string;
  tag: string;
  title: string;
  context: string;
  startingGaps: string[];
  coordinatedSteps: string[];
  outcome: string;
  contactTopic: string;
}

const CASE_STUDIES_EN: CaseStudy[] = [
  {
    id: "first-home",
    tag: "Dual-Income First-Time Buyers",
    title: "Growing a Down Payment While Reducing Income Tax",
    context: "Sarah and Daniel (ages 29 & 31, Ontario). Combined household income $145,000. Goal: buy a first home in 3 years.",
    startingGaps: [
      "$48,000 sitting in low-interest non-registered bank accounts earning taxable interest each year.",
      "Had not opened First Home Savings Accounts (FHSAs) to use the $8,000 annual room per person.",
      "Carrying a $12,000 car loan at 7.9% interest while trying to save at the same time.",
    ],
    coordinatedSteps: [
      "Opened individual FHSAs before December 31, contributing $8,000 each for $16,000 in immediate tax deductions.",
      "Directed their combined tax refunds ($5,280) plus monthly surplus cash to pay off the 7.9% auto loan.",
      "Set aside a 4-month emergency buffer in TFSAs so mortgage approval would not be disrupted by an income pause.",
    ],
    outcome:
      "Reduced personal income taxes by over $11,000 across two years, cleared the 7.9% car loan, and built an $80,000 down payment plan.",
    contactTopic: "accounts",
  },
  {
    id: "single-earner",
    tag: "Family Income Protection",
    title: "Closing a $3,200 Monthly Household Income Gap",
    context: "Marcus and Elena (ages 36 & 38, Alberta). Two children (ages 3 & 6). Marcus earns the family's sole $115,000 salary.",
    startingGaps: [
      "Employer disability insurance had a 2-year limit, an 'any occupation' definition after year two, and taxable benefits.",
      "A 6-month illness would leave a $3,200/month shortfall between net benefits and mortgage/living expenses.",
      "No education savings started yet for either child because monthly cash flow felt tight.",
    ],
    coordinatedSteps: [
      "Added portable individual disability coverage with an 'own occupation' definition, delivering tax-free monthly benefits.",
      "Put a 20-year level term life policy in place sized to cover the remaining mortgage and support the children through post-secondary years.",
      "Automated $208/month into a family RESP to capture the full $500/year Canada Education Savings Grant per child.",
    ],
    outcome:
      "Protected Elena and the children's monthly budget from a major income loss while building regular government-matched education savings.",
    contactTopic: "protection",
  },
  {
    id: "pre-retiree",
    tag: "Retirement Drawdown",
    title: "Coordinating CPP & OAS Timing to Smooth Lifetime Tax",
    context: "Robert (age 63, British Columbia). Planning to retire at 65 with $450,000 in RRSPs and $90,000 in TFSAs.",
    startingGaps: [
      "Planned to take CPP at 65 automatically without comparing the higher guaranteed payment at age 70.",
      "Large mandatory RRIF withdrawals after age 71 risked pushing taxable income into the OAS recovery tax (clawback) range.",
      "No written order of withdrawals across RRSP, TFSA, and pension income.",
    ],
    coordinatedSteps: [
      "Used an intentional RRSP drawdown bridge between ages 64 and 70 while taxable income sat in lower tax brackets.",
      "Deferred CPP and OAS to age 70, adding +42% to CPP and +36% to OAS as inflation-indexed lifetime income.",
      "Kept TFSA funds intact as non-income-tested reserves for future health costs and estate flexibility.",
    ],
    outcome:
      "Raised guaranteed inflation-indexed pension income by over $6,200/year, smoothed lifetime tax brackets, and avoided OAS clawback.",
    contactTopic: "retirement",
  },
];

const CASE_STUDIES_FR: CaseStudy[] = [
  {
    id: "first-home",
    tag: "Premiers acheteurs (deux revenus)",
    title: "Faire croître la mise de fonds tout en réduisant l'impôt",
    context: "Sarah et Daniel (29 et 31 ans, Ontario). Revenu familial combiné de 145 000 $. Objectif : acheter une première maison dans 3 ans.",
    startingGaps: [
      "48 000 $ dormaient dans des comptes bancaires ordinaires produisant des intérêts imposables chaque année.",
      "Aucun CELIAPP ouvert pour utiliser les 8 000 $ de droits annuels déductibles par personne.",
      "Un prêt automobile de 12 000 $ à 7,9 % ralentissait l'épargne mensuelle.",
    ],
    coordinatedSteps: [
      "Ouverture de deux CELIAPP avant le 31 décembre avec 8 000 $ chacun, générant 16 000 $ en déductions fiscales immédiates.",
      "Affectation des remboursements d'impôt (5 280 $) et d'un surplus mensuel pour solder le prêt auto à 7,9 %.",
      "Constitution d'une réserve d'urgence de 4 mois en CELI pour sécuriser l'approbation hypothécaire.",
    ],
    outcome:
      "Plus de 11 000 $ d'économie d'impôt sur deux ans, dette auto éliminée et mise de fonds cible de 80 000 $ structurée.",
    contactTopic: "accounts",
  },
  {
    id: "single-earner",
    tag: "Protection du revenu familial",
    title: "Combler un déficit mensuel de 3 200 $ en cas d'arrêt",
    context: "Marcus et Elena (36 et 38 ans, Alberta). Deux enfants (3 et 6 ans). Marcus gagne l'unique salaire de 115 000 $.",
    startingGaps: [
      "L'assurance invalidité collective était limitée à 2 ans, avec une définition restrictive et des prestations imposables.",
      "Une maladie de 6 mois créerait un manque à gagner de 3 200 $/mois face à l'hypothèque et aux dépenses courantes.",
      "Aucune épargne-études commencée pour les enfants par manque de visibilité budgétaire.",
    ],
    coordinatedSteps: [
      "Souscription d'une assurance invalidité individuelle transférable « profession propre » avec prestations nettes d'impôt.",
      "Mise en place d'une assurance vie temporaire 20 ans couvrant l'hypothèque et le soutien des enfants jusqu'aux études.",
      "Virement automatisé de 208 $/mois vers un REEE familial pour capter la Subvention de 500 $/an par enfant.",
    ],
    outcome:
      "Niveau de vie d'Elena et des enfants protégé en cas d'invalidité et épargne-études bonifiée par les subventions fédérales.",
    contactTopic: "protection",
  },
  {
    id: "pre-retiree",
    tag: "Décaissement à la retraite",
    title: "Coordonner RPC et PSV pour lisser l'impôt à vie",
    context: "Robert (63 ans, Colombie-Britannique). Retraite prévue à 65 ans avec 450 000 $ en REER et 90 000 $ en CELI.",
    startingGaps: [
      "Prévoyait demander ses rentes à 65 ans par défaut sans comparer le montant garanti à 70 ans.",
      "Risque que les retraits minimums du FERR après 71 ans déclenchent la récupération de la PSV (clawback).",
      "Aucun ordre de retrait défini entre REER, CELI et rentes publiques.",
    ],
    coordinatedSteps: [
      "Décaissement ciblé du REER entre 64 et 70 ans pendant les années à faible taux d'imposition.",
      "Report du RPC et de la PSV à 70 ans, majorant le revenu indexé à vie de +42 % (RPC) et +36 % (PSV).",
      "Conservation du CELI comme réserve non prise en compte dans le calcul du revenu de la PSV.",
    ],
    outcome:
      "Revenu garanti et indexé augmenté de plus de 6 200 $/an, paliers fiscaux lissés et récupération de PSV évitée.",
    contactTopic: "retirement",
  },
];

export const StructuralCaseStudies: React.FC = () => {
  const { isFr } = useLanguage();
  const [selectedCaseId, setSelectedCaseId] = useState<string>("first-home");
  const studies = isFr ? CASE_STUDIES_FR : CASE_STUDIES_EN;
  const activeCase = studies.find((c) => c.id === selectedCaseId) || studies[0];

  return (
    <section className="p-8 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] space-y-8">
      <div className="max-w-3xl space-y-3">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#2e4a3b]" aria-hidden="true" />
          <span className="eyebrow text-xs text-[#75581f]">
            {isFr ? "Études de cas anonymisées" : "Anonymized Case Examples"}
          </span>
        </div>
        <h3 className="h2 text-[#1c1b18] text-2xl md:text-3xl leading-snug">
          {isFr
            ? "À quoi ressemble une planification coordonnée en pratique."
            : "How coordinated financial planning works in practice."}
        </h3>
        <p className="text-sm md:text-base text-[#46423a] leading-relaxed">
          {isFr
            ? "Ces exemples illustratifs montrent comment des ménages canadiens sont passés de comptes dispersés à un plan clair et cohérent. (Les chiffres sont fournis à titre indicatif; chaque recommandation dépend de votre situation personnelle.)"
            : "These illustrative examples show how Canadian households moved from disconnected accounts to a clear, practical financial plan. (All numbers are illustrative; recommendations depend on individual circumstances.)"}
        </p>
      </div>

      {/* Case Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#d6cebd] pb-3">
        {studies.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setSelectedCaseId(c.id)}
            className={`px-4 py-2 text-xs font-medium rounded-[2px] transition-all cursor-pointer ${
              selectedCaseId === c.id
                ? "bg-[#2e4a3b] text-[#f7f3eb] font-semibold"
                : "bg-[#f7f3eb] text-[#46423a] border border-[#d6cebd] hover:border-[#2e4a3b]"
            }`}
          >
            {c.tag}
          </button>
        ))}
      </div>

      {/* Active Case View */}
      <div className="p-6 md:p-8 bg-[#f7f3eb] border border-[#d6cebd] rounded-[2px] space-y-6">
        <div className="space-y-1.5">
          <span className="eyebrow text-[#75581f]">
            {activeCase.tag}
          </span>
          <h4 className="font-serif text-2xl text-[#1c1b18]">{activeCase.title}</h4>
          <p className="text-xs md:text-sm text-[#46423a] italic">{activeCase.context}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Starting Gaps */}
          <div className="p-5 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] space-y-3">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-[#8f2a1d]">
              {isFr ? "Points de départ et lacunes" : "Starting Gaps & Risks"}
            </h5>
            <ul className="space-y-2 list-none p-0 text-xs text-[#46423a]">
              {activeCase.startingGaps.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#8f2a1d] font-bold">&times;</span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Coordinated Solution */}
          <div className="p-5 bg-[#fcfaf5] border border-[#2e4a3b] rounded-[2px] space-y-3">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-[#2e4a3b]">
              {isFr ? "Actions coordonnées" : "Coordinated Action Plan"}
            </h5>
            <ul className="space-y-2 list-none p-0 text-xs text-[#1c1b18]">
              {activeCase.coordinatedSteps.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2e4a3b] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Outcome */}
        <div className="p-4 bg-[#fcfaf5] border border-[#2e4a3b]/40 rounded-[2px] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[#2e4a3b] text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>{isFr ? "Résultat concret" : "Practical Outcome"}</span>
            </div>
            <p className="text-xs md:text-sm text-[#1c1b18] font-medium leading-relaxed">
              {activeCase.outcome}
            </p>
          </div>
          <Link
            to={`${isFr ? "/fr" : ""}/contact?topic=${activeCase.contactTopic}`}
            className="btn btn-primary text-xs py-2 px-4 whitespace-nowrap shrink-0"
          >
            {isFr ? "Poser une question →" : "Ask about this approach →"}
          </Link>
        </div>
      </div>
    </section>
  );
};
