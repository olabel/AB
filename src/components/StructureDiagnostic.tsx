import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.tsx";
import { RefreshCw, Award } from "lucide-react";

interface Question {
  id: number;
  title: string;
  options: { label: string; score: number; feedback: string }[];
}

const QUESTIONS_EN: Question[] = [
  {
    id: 1,
    title: "How many months of essential living expenses could you cover in accessible cash if income paused tomorrow?",
    options: [
      { label: "Less than 1 month (or relying on credit cards)", score: 0, feedback: "Priority one is building an accessible cash reserve so surprises do not land on high-interest credit." },
      { label: "1 to 2 months", score: 1, feedback: "Helpful start, though still tight if two unexpected expenses hit at once." },
      { label: "3 to 6 months in dedicated, principal-stable accounts", score: 3, feedback: "Solid Tier 1 foundation that prevents forced borrowing." },
      { label: "More than 12 months in cash", score: 2, feedback: "High security, though holding too much idle cash can lose purchasing power to inflation." },
    ],
  },
  {
    id: 2,
    title: "If illness or injury stopped your work for 6 months, how much of your net take-home pay would continue automatically?",
    options: [
      { label: "0% (No private or group disability coverage)", score: 0, feedback: "Major gap: your ability to earn an income funds every other goal you have." },
      { label: "Only basic employer group coverage (often capped or taxable)", score: 1, feedback: "Group coverage helps, though employer plans frequently have caps and taxable payouts." },
      { label: "60% to 70% via comprehensive, portable disability coverage", score: 3, feedback: "Strong Tier 2 income protection." },
      { label: "Unsure of exact group terms and definitions", score: 1, feedback: "Reviewing your employer benefits booklet is a quick, practical first step." },
    ],
  },
  {
    id: 3,
    title: "How are your registered tax-sheltered accounts currently prioritized?",
    options: [
      { label: "I save in regular taxable accounts without checking registered room", score: 0, feedback: "You may be paying unnecessary tax by leaving FHSA, TFSA, or RRSP room unused." },
      { label: "I use whichever account my bank suggested first", score: 1, feedback: "Choosing accounts ad hoc often leads to paying more tax than necessary." },
      { label: "I intentionally sequence FHSA ($8k), TFSA ($7k), and RRSP based on my tax bracket", score: 3, feedback: "Well-aligned Tier 3 registered account ordering." },
      { label: "I focus primarily on aggressive debt paydown first", score: 2, feedback: "Good discipline; check whether employer matches or tax refunds beat your debt rate." },
    ],
  },
  {
    id: 4,
    title: "Have you modeled how your retirement withdrawals will interact with CPP and OAS start ages?",
    options: [
      { label: "No, I plan to take government pensions as soon as I can", score: 0, feedback: "Claiming CPP at 60 cuts payments by 36% permanently and deserves a proper check before deciding." },
      { label: "I know my rough retirement date but haven't coordinated withdrawal order", score: 1, feedback: "Uncoordinated withdrawals risk higher tax brackets and OAS clawbacks later." },
      { label: "Yes, I have mapped tax-bracket smoothing and the +42% CPP age-70 option", score: 3, feedback: "Strong Tier 4 retirement drawdown readiness." },
      { label: "Retirement is more than 20 years away; focusing on accumulation", score: 2, feedback: "Right focus for now; keeping savings in the right tax-sheltered accounts makes future options easier." },
    ],
  },
];

const QUESTIONS_FR: Question[] = [
  {
    id: 1,
    title: "Combien de mois de dépenses essentielles pouvez-vous couvrir en liquidités stables si votre revenu cessait demain ?",
    options: [
      { label: "Moins de 1 mois (ou recours aux cartes de crédit)", score: 0, feedback: "Priorité immédiate : constituer une réserve accessible pour éviter l'endettement à taux élevé." },
      { label: "1 à 2 mois", score: 1, feedback: "Bon point de départ, mais vulnérable si deux imprévus surviennent en même temps." },
      { label: "3 à 6 mois dans un compte liquide et stable", score: 3, feedback: "Excellente base au Palier 1 pour éviter d'emprunter en urgence." },
      { label: "Plus de 12 mois en espèces", score: 2, feedback: "Sécurité élevée, mais l'excédent dormant perd du pouvoir d'achat face à l'inflation." },
    ],
  },
  {
    id: 2,
    title: "Si une maladie ou blessure vous arrêtait 6 mois, quelle part de votre revenu net serait remplacée ?",
    options: [
      { label: "0 % (Aucune couverture invalidité collective ou privée)", score: 0, feedback: "Lacune importante : votre capacité de gain finance tous vos autres objectifs." },
      { label: "Seulement une couverture collective de base (souvent plafonnée ou imposable)", score: 1, feedback: "Les régimes collectifs aident, mais comportent souvent des plafonds et sont imposables." },
      { label: "60 % à 70 % via une protection invalidité individuelle complète", score: 3, feedback: "Solide protection du revenu au Palier 2." },
      { label: "Incertain des clauses exactes de mon régime collectif", score: 1, feedback: "Relire le livret d'assurance collective est une première étape simple et utile." },
    ],
  },
  {
    id: 3,
    title: "Comment priorisez-vous actuellement vos comptes enregistrés ?",
    options: [
      { label: "J'épargne en compte imposable sans vérifier mes droits enregistrés", score: 0, feedback: "Vous payez possiblement trop d'impôt en laissant des droits CELIAPP, CELI ou REER inutilisés." },
      { label: "J'utilise le compte que ma banque m'a proposé en premier", score: 1, feedback: "Les choix ponctuels génèrent souvent plus d'impôt qu'un ordre réfléchi." },
      { label: "J'ordonne CELIAPP (8 k$), CELI (7 k$) et REER selon mon palier d'imposition", score: 3, feedback: "Ordre de cotisation très efficace au Palier 3." },
      { label: "Je rembourse d'abord mes dettes en priorité", score: 2, feedback: "Bonne discipline ; vérifiez si un REER employeur ou un retour d'impôt bat votre taux d'intérêt." },
    ],
  },
  {
    id: 4,
    title: "Avez-vous modélisé le lien entre vos retraits de retraite et l'âge de demande du RPC et de la PSV ?",
    options: [
      { label: "Non, je compte demander mes rentes dès que possible", score: 0, feedback: "Prendre le RPC/RRQ à 60 ans réduit le versement de 36 % à vie : mieux vaut vérifier avant." },
      { label: "J'ai une date de retraite en tête mais sans ordre de retrait précis", score: 1, feedback: "Sans coordination, les retraits risquent de provoquer des hausses d'impôt et la récupération de la PSV." },
      { label: "Oui, j'ai comparé le lissage fiscal et l'option +42 % du RPC à 70 ans", score: 3, feedback: "Excellente préparation au Palier 4." },
      { label: "Ma retraite est dans plus de 20 ans ; je vise d'abord l'épargne", score: 2, feedback: "Priorité logique ; privilégier les bons abris fiscaux facilitera vos choix futurs." },
    ],
  },
];

export const StructureDiagnostic: React.FC = () => {
  const { isFr } = useLanguage();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const questions = isFr ? QUESTIONS_FR : QUESTIONS_EN;

  const handleSelect = (questionId: number, optionIdx: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  const answeredCount = Object.keys(answers).length;
  const isAllAnswered = answeredCount === questions.length;

  const totalScore = Object.entries(answers).reduce((sum, [qId, optIdx]) => {
    const q = questions.find((item) => item.id === Number(qId));
    return sum + (q ? q.options[optIdx].score : 0);
  }, 0);

  const getAssessmentTier = () => {
    if (totalScore >= 10) {
      return isFr
        ? {
            level: "Plan bien coordonné",
            badge: "Bonne cohérence",
            summary: "Vos comptes et protections sont bien alignés. Votre priorité est le suivi annuel des plafonds, des impôts et des bénéficiaires.",
            topic: "general",
          }
        : {
            level: "Well-Coordinated Plan",
            badge: "Well Aligned",
            summary: "Your accounts and protections work well together. Your focus should be annual tax planning, room checks, and keeping beneficiaries updated.",
            topic: "general",
          };
    } else if (totalScore >= 6) {
      return isFr
        ? {
            level: "Partiellement coordonné avec lacunes",
            badge: "À renforcer",
            summary: "Vous avez déjà de bonnes bases (épargne régulière ou réserve), mais des écarts subsistent en protection du revenu ou en ordre de cotisation.",
            topic: "accounts",
          }
        : {
            level: "Partially Coordinated with Gaps",
            badge: "Room to Improve",
            summary: "You have strong habits already (such as regular savings or cash reserves), with noticeable gaps in income protection or account order.",
            topic: "accounts",
          };
    } else {
      return isFr
        ? {
            level: "Comptes dispersés / Risque élevé",
            badge: "Révision recommandée",
            summary: "Vos comptes fonctionnent séparément. Un imprévu pourrait entraîner un endettement coûteux ou des impôts évitables. Un plan clair vaut la peine.",
            topic: "protection",
          }
        : {
            level: "Disconnected / High Exposure",
            badge: "Review Recommended",
            summary: "Your accounts operate separately. One unexpected disruption could force high-interest borrowing or avoidable taxes. Putting a written plan in place is the next step.",
            topic: "protection",
          };
    }
  };

  const assessment = getAssessmentTier();

  return (
    <section className="p-8 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#d6cebd] pb-4">
        <div>
          <span className="eyebrow text-xs text-[#75581f]">
            {isFr ? "Auto-évaluation rapide" : "Quick Self-Check"}
          </span>
          <h3 className="h2 text-[#1c1b18] text-2xl mt-1">
            {isFr
              ? "Dans quelle mesure votre plan financier est-il coordonné ?"
              : "How Well Coordinated Is Your Current Plan?"}
          </h3>
        </div>
        <span className="tabular-nums text-xs text-[#2e4a3b] font-semibold bg-[#f7f3eb] px-3 py-1.5 border border-[#d6cebd] rounded-[2px]">
          {isFr ? `${answeredCount} sur ${questions.length} répondues` : `${answeredCount} of ${questions.length} Answered`}
        </span>
      </div>

      {!isCompleted ? (
        <div className="space-y-6">
          <p className="text-xs md:text-sm text-[#46423a] leading-relaxed">
            {isFr
              ? "Répondez à ces 4 questions simples pour obtenir un aperçu rapide de la solidité de vos liquidités, protections et comptes enregistrés au Canada."
              : "Answer these 4 quick questions to get an instant check on how your cash reserves, income protection, and Canadian registered accounts line up."}
          </p>

          <div className="space-y-6">
            {questions.map((q) => {
              const selectedIdx = answers[q.id];
              return (
                <div key={q.id} className="p-5 bg-[#f7f3eb] border border-[#d6cebd] rounded-[2px] space-y-3">
                  <h4 className="font-serif text-lg text-[#1c1b18] font-normal">
                    <span className="tabular-nums text-xs font-semibold text-[#75581f] mr-2">0{q.id}.</span>
                    {q.title}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {q.options.map((opt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelect(q.id, idx)}
                        className={`p-3 text-left text-xs rounded-[2px] border transition-all cursor-pointer ${
                          selectedIdx === idx
                            ? "bg-[#2e4a3b] text-white border-[#2e4a3b] font-medium"
                            : "bg-[#fcfaf5] text-[#46423a] border-[#d6cebd] hover:border-[#2e4a3b]"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              disabled={!isAllAnswered}
              onClick={() => setIsCompleted(true)}
              className="btn btn-primary text-xs py-2.5 px-6 disabled:opacity-50"
            >
              {isFr ? "Voir mon bilan →" : "See My Checkup →"}
            </button>
          </div>
        </div>
      ) : (
        <div className="p-6 md:p-8 bg-[#f7f3eb] border border-[#2e4a3b] rounded-[2px] space-y-6">
          <div className="flex items-center justify-between gap-3 border-b border-[#d6cebd] pb-4">
            <div className="flex items-center gap-2.5">
              <Award className="w-6 h-6 text-[#75581f]" aria-hidden="true" />
              <div>
                <span className="eyebrow text-[#75581f]">
                  {isFr ? "Résultat du bilan" : "Checkup Result"}
                </span>
                <h4 className="font-serif text-2xl text-[#1c1b18]">{assessment.level}</h4>
              </div>
            </div>
            <span className="px-3 py-1 bg-[#2e4a3b] text-[#f7f3eb] text-xs font-semibold rounded-[2px]">
              {isFr ? `Score : ${totalScore} / 12` : `Score: ${totalScore} / 12`}
            </span>
          </div>

          <p className="text-sm md:text-base text-[#1c1b18] leading-relaxed">
            {assessment.summary}
          </p>

          {/* Breakdown per question */}
          <div className="space-y-3 pt-2">
            <h5 className="eyebrow text-xs text-[#2e4a3b]">
              {isFr ? "Points clés par domaine" : "Key Notes by Area"}
            </h5>
            <div className="space-y-2">
              {questions.map((q) => {
                const optIdx = answers[q.id];
                const opt = q.options[optIdx];
                return (
                  <div key={q.id} className="p-3 bg-[#fcfaf5] border border-[#d6cebd] text-xs space-y-0.5">
                    <span className="font-semibold text-[#1c1b18]">
                      {isFr ? `Point 0${q.id} :` : `Item 0${q.id}:`}
                    </span>{" "}
                    <span className="text-[#46423a]">{opt.feedback}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-[#d6cebd] flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => {
                setAnswers({});
                setIsCompleted(false);
              }}
              className="text-xs text-[#625d52] underline flex items-center gap-1 hover:text-[#1c1b18] cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{isFr ? "Refaire le bilan" : "Retake checkup"}</span>
            </button>
            <Link
              to={`${isFr ? "/fr" : ""}/contact?topic=${assessment.topic}`}
              className="btn btn-primary text-xs py-2 px-5"
            >
              {isFr ? "Revoir ces résultats avec Ahmed →" : "Review these results with Ahmed →"}
            </Link>
          </div>
        </div>
      )}
    </section>
  );
};
