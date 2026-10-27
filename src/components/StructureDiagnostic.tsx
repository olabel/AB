import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CheckSquare, AlertCircle, ArrowRight, RefreshCw, Award } from "lucide-react";

interface Question {
  id: number;
  title: string;
  options: { label: string; score: number; feedback: string }[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    title: "How many months of essential living expenses could you cover in non-volatile cash if income paused tomorrow?",
    options: [
      { label: "Less than 1 month (or relying on credit cards)", score: 0, feedback: "Urgent need for a Tier 1 Liquid Moat to stop high-interest debt creation." },
      { label: "1 to 2 months", score: 1, feedback: "Modest buffer; vulnerable to combined surprise costs or employment gaps." },
      { label: "3 to 6 months in dedicated, liquid non-volatile accounts", score: 3, feedback: "Excellent Tier 1 foundation. Prevents forced borrowing." },
      { label: "More than 12 months in cash", score: 2, feedback: "Strong security, but excess cash may be suffering from annual inflation drag." },
    ],
  },
  {
    id: 2,
    title: "If illness or injury stopped your work for 6 months, how much of your net take-home pay would continue automatically?",
    options: [
      { label: "0% — No private or group disability coverage", score: 0, feedback: "Critical exposure: your ability to earn is your single largest lifetime asset." },
      { label: "Only basic employer group coverage (often capped or taxable)", score: 1, feedback: "Group coverage is a start, but frequently has restrictive definitions or caps." },
      { label: "60% to 70% via comprehensive, portable disability coverage", score: 3, feedback: "Rock-solid Tier 2 Income Protection Wall." },
      { label: "Unsure of exact group terms and definitions", score: 1, feedback: "Reviewing your benefit booklet is a vital first step." },
    ],
  },
  {
    id: 3,
    title: "How are your registered tax-sheltered accounts currently prioritized?",
    options: [
      { label: "I save in standard taxable bank accounts or crypto without checking registered room", score: 0, feedback: "Missing out on Canadian tax sheltering (FHSA, TFSA, RRSP)." },
      { label: "I use whatever account my bank suggested first", score: 1, feedback: "Ad-hoc account choices frequently cause unnecessary tax drag." },
      { label: "I intentionally sequence FHSA ($8k), TFSA ($7k), and RRSP based on my marginal tax rate", score: 3, feedback: "Optimal Tier 3 Tax-Sheltered Sequencing." },
      { label: "I focus primarily on aggressive debt paydown first", score: 2, feedback: "Good discipline; verify if employer matching or high deductions shift the arithmetic." },
    ],
  },
  {
    id: 4,
    title: "Have you modeled how your retirement withdrawals will interact with CPP and OAS start ages?",
    options: [
      { label: "No — I plan to take government pensions as soon as I can", score: 0, feedback: "Taking CPP early permanently cuts payments by 36% without evaluating longevity." },
      { label: "I know my rough retirement date but haven't coordinated account drawdown order", score: 1, feedback: "Uncoordinated withdrawals risk higher tax brackets and OAS clawback." },
      { label: "Yes — I have mapped tax-bracket smoothing and the +42% CPP age-70 deferral benefit", score: 3, feedback: "Mastery of Tier 4 Decumulation & Longevity Design." },
      { label: "Retirement is more than 20 years away; focusing on growth", score: 2, feedback: "Appropriate horizon; ensuring compounding works in proper tax containers is key." },
    ],
  },
];

export const StructureDiagnostic: React.FC = () => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const handleSelect = (questionId: number, optionIdx: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  const answeredCount = Object.keys(answers).length;
  const isAllAnswered = answeredCount === QUESTIONS.length;

  const totalScore = Object.entries(answers).reduce((sum, [qId, optIdx]) => {
    const q = QUESTIONS.find((item) => item.id === Number(qId));
    return sum + (q ? q.options[optIdx].score : 0);
  }, 0);

  const getAssessmentTier = () => {
    if (totalScore >= 10) {
      return {
        level: "Resilient Interlocking Structure",
        badge: "High Intentionality",
        summary: "Your financial pieces are well coordinated. Your focus should be on annual tax optimization, ongoing room review, and estate harmony.",
        topic: "general",
      };
    } else if (totalScore >= 6) {
      return {
        level: "Partially Structured with Gaps",
        badge: "Moderate Friction",
        summary: "You have strong elements (e.g. good savings habits or emergency funds), but significant exposure in income protection or tax-shelter sequencing.",
        topic: "accounts",
      };
    } else {
      return {
        level: "Fragmented / High Vulnerability",
        badge: "Action Recommended",
        summary: "Your accounts operate in isolation. A single life disruption could cause high-interest borrowing or permanent tax penalties. A structured blueprint is urgent.",
        topic: "protection",
      };
    }
  };

  const assessment = getAssessmentTier();

  return (
    <section className="p-8 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#d6cebd] pb-4">
        <div>
          <span className="eyebrow text-xs text-[#75581f]">Interactive Self-Diagnostic</span>
          <h3 className="h2 text-[#1c1b18] text-2xl mt-1">
            How Intentional is Your Current Money Structure?
          </h3>
        </div>
        <span className="font-mono text-xs text-[#2e4a3b] font-semibold bg-[#f7f3eb] px-3 py-1.5 border border-[#d6cebd] rounded-[2px]">
          {answeredCount} of {QUESTIONS.length} Answered
        </span>
      </div>

      {!isCompleted ? (
        <div className="space-y-6">
          <p className="text-xs md:text-sm text-[#46423a] leading-relaxed">
            Answer these 4 fundamental structural questions to receive an instant diagnostic of your financial resilience
            under Canadian tax and protection rules.
          </p>

          <div className="space-y-6">
            {QUESTIONS.map((q) => {
              const selectedIdx = answers[q.id];
              return (
                <div key={q.id} className="p-5 bg-[#f7f3eb] border border-[#d6cebd] rounded-[2px] space-y-3">
                  <h4 className="font-serif text-lg text-[#1c1b18] font-normal">
                    <span className="font-mono text-xs font-semibold text-[#75581f] mr-2">0{q.id}.</span>
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
              Generate Structure Diagnostic &rarr;
            </button>
          </div>
        </div>
      ) : (
        <div className="p-6 md:p-8 bg-[#f7f3eb] border-2 border-[#2e4a3b] rounded-[2px] space-y-6">
          <div className="flex items-center justify-between gap-3 border-b border-[#d6cebd] pb-4">
            <div className="flex items-center gap-2.5">
              <Award className="w-6 h-6 text-[#75581f]" aria-hidden="true" />
              <div>
                <span className="text-xs font-mono text-[#75581f] uppercase tracking-wider font-semibold">
                  Diagnostic Result
                </span>
                <h4 className="font-serif text-2xl text-[#1c1b18]">{assessment.level}</h4>
              </div>
            </div>
            <span className="px-3 py-1 bg-[#2e4a3b] text-[#f7f3eb] text-xs font-semibold rounded-[2px]">
              Score: {totalScore} / 12
            </span>
          </div>

          <p className="text-sm md:text-base text-[#1c1b18] leading-relaxed">
            {assessment.summary}
          </p>

          {/* Breakdown per question */}
          <div className="space-y-3 pt-2">
            <h5 className="eyebrow text-xs text-[#2e4a3b]">Structural Recommendations</h5>
            <div className="space-y-2">
              {QUESTIONS.map((q) => {
                const optIdx = answers[q.id];
                const opt = q.options[optIdx];
                return (
                  <div key={q.id} className="p-3 bg-[#fcfaf5] border border-[#d6cebd] text-xs space-y-0.5">
                    <span className="font-semibold text-[#1c1b18]">Item 0{q.id}:</span>{" "}
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
              className="text-xs text-[#625d52] underline flex items-center gap-1 hover:text-[#1c1b18]"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retake diagnostic</span>
            </button>
            <Link
              to={`/contact?topic=${assessment.topic}`}
              className="btn btn-primary text-xs py-2 px-5"
            >
              Review these results with Ahmed &rarr;
            </Link>
          </div>
        </div>
      )}
    </section>
  );
};
