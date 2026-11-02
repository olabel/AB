import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Calendar, CheckCircle2, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { useLanguage } from "../context/LanguageContext.tsx";

interface CalculatorLeadCaptureProps {
  calculatorName: string;
  summaryText: string;
  className?: string;
}

export const CalculatorLeadCapture: React.FC<CalculatorLeadCaptureProps> = ({
  calculatorName,
  summaryText,
  className = "",
}) => {
  const { isFr } = useLanguage();
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSendPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim() || !email.includes("@")) {
      setErrorMsg(isFr ? "Veuillez entrer une adresse courriel valide." : "Please enter a valid email address.");
      return;
    }

    if (!consent) {
      setErrorMsg(
        isFr
          ? "Veuillez cocher la case pour confirmer votre consentement selon la LCAP."
          : "Please check the box to confirm your consent under Canadian anti-spam legislation."
      );
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim() || "Client",
          email: email.trim(),
          topic: "calculator",
          province: "National (Canada & US)",
          message: `Calculated Plan: ${calculatorName}\n\nSummary Breakdown:\n${summaryText}`,
          consentPrivacy: true,
          consentEducational: true,
          formLoadedAt: Date.now() - 4000,
          honeypot: "",
        }),
      });

      const data = await response.json();

      if (!response.ok && data.error !== "delivery_failed") {
        throw new Error(data.message || "Unable to send plan.");
      }

      setSubmitted(true);
    } catch (err: any) {
      setErrorMsg(
        err.message ||
          (isFr
            ? "Impossible d'envoyer le plan pour le moment. Veuillez planifier un échange direct."
            : "Could not send the plan right now. Please schedule a direct review call.")
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className={`mt-6 p-6 sm:p-7 bg-[#fcfaf5] border-2 border-[#2e4a3b]/30 rounded-[2px] space-y-5 shadow-xs relative overflow-hidden ${className}`}
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2e4a3b] via-[#75581f] to-[#2e4a3b]" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#ece6da] pb-4">
        <div>
          <span className="text-[0.68rem] uppercase tracking-wider text-[#75581f] font-bold block">
            {isFr ? "Conserver vos résultats" : "Save Your Calculations"}
          </span>
          <h4 className="font-serif text-lg sm:text-xl text-[#1c1b18] font-medium leading-snug">
            {isFr ? "Recevez ce plan personnalisé par courriel" : "Email me this customized plan"}
          </h4>
        </div>

        <a
          href="https://calendly.com/olabel/30min"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary text-xs py-2.5 px-4 inline-flex items-center gap-1.5 whitespace-nowrap shadow-xs"
        >
          <Calendar className="w-3.5 h-3.5 text-[#d6c298]" />
          <span>{isFr ? "Réserver une révision de 30 min" : "Book a 30-min review"}</span>
        </a>
      </div>

      {submitted ? (
        <div className="p-4 bg-[#2e4a3b] text-[#f7f3eb] rounded-[2px] flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-[#d6c298] shrink-0" />
          <div className="text-xs leading-relaxed">
            <strong>{isFr ? "Plan envoyé avec succès !" : "Plan summary dispatched!"}</strong>{" "}
            {isFr
              ? `Une copie de vos résultats a été envoyée à ${email}. Ahmed Bello examinera également les paramètres avec vous si vous souhaitez approfondir.`
              : `A record of your calculations has been dispatched to ${email}. If you’d like to stress-test your numbers, use the booking button to schedule a review.`}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSendPlan} className="space-y-3.5">
          {errorMsg && (
            <div className="p-2.5 bg-[#fdf0ed] border border-[#d97768] text-[#8a3324] text-xs rounded-[2px]">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
            <input
              type="text"
              name="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder={isFr ? "Prénom (optionnel)" : "First name (optional)"}
              className="sm:col-span-4 text-xs p-2.5 bg-white border border-[#d6cebd] rounded-[2px] focus:outline-none focus:border-[#2e4a3b]"
            />
            <input
              type="email"
              required
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={isFr ? "Votre adresse courriel *" : "Your email address *"}
              className="sm:col-span-5 text-xs p-2.5 bg-white border border-[#d6cebd] rounded-[2px] focus:outline-none focus:border-[#2e4a3b]"
            />
            <button
              type="submit"
              disabled={submitting}
              className="sm:col-span-3 btn btn-secondary text-xs py-2.5 px-3 whitespace-nowrap flex items-center justify-center gap-1.5"
            >
              {submitting ? (
                <span>{isFr ? "Envoi..." : "Sending..."}</span>
              ) : (
                <>
                  <Mail className="w-3.5 h-3.5 text-[#2e4a3b]" />
                  <span>{isFr ? "M'envoyer ce plan" : "Email me this plan"}</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-start gap-2 pt-0.5">
            <input
              id={`calc-consent-${calculatorName.replace(/\s+/g, "-").toLowerCase()}`}
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 accent-[#2e4a3b]"
            />
            <label
              htmlFor={`calc-consent-${calculatorName.replace(/\s+/g, "-").toLowerCase()}`}
              className="text-[0.7rem] text-[#625d52] leading-tight cursor-pointer"
            >
              {isFr ? (
                <>
                  J'accepte de recevoir une copie de ce plan personnalisé et des résumés éducatifs ponctuels d'Ahmed Bello selon la législation canadienne (LCAP). Désabonnement en un clic. Consultez l'
                  <Link to="/fr/privacy" className="underline hover:text-[#2e4a3b]">
                    avis de confidentialité
                  </Link>
                  .
                </>
              ) : (
                <>
                  I consent to receive a copy of this customized calculation plan and occasional educational briefings from Ahmed Bello under Canada’s Anti-Spam Legislation (CASL). Unsubscribe anytime with 1 click. Read the{" "}
                  <Link to="/privacy" className="underline hover:text-[#2e4a3b]">
                    privacy notice
                  </Link>
                  .
                </>
              )}
            </label>
          </div>
        </form>
      )}
    </div>
  );
};
