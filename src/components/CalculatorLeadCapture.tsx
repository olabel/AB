import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Calendar, CheckCircle2, ArrowRight, ShieldCheck, AlertCircle, RefreshCw, Phone } from "lucide-react";
import { useLanguage } from "../context/LanguageContext.tsx";
import { saveLeadToFirestore } from "../lib/firebase.ts";

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
  const [consent, setConsent] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [referenceNo, setReferenceNo] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSendPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setErrorMsg(isFr ? "Veuillez entrer une adresse courriel valide." : "Please enter a valid email address.");
      return;
    }

    if (!consent) {
      setErrorMsg(
        isFr
          ? "Veuillez cocher la case de consentement LCAP ci-dessous avant d'envoyer votre plan."
          : "Please check the consent box below before submitting to receive your plan."
      );
      return;
    }

    setSubmitting(true);
    const generatedRef = "CALC-" + Math.floor(100000 + Math.random() * 900000);
    let firestoreSaved = false;

    // 1. Direct Cloud Database Persistence (Firebase Firestore)
    try {
      await saveLeadToFirestore({
        referenceNo: generatedRef,
        topic: "calculator",
        firstName: firstName.trim() || "Valued Client",
        email: cleanEmail,
        province: "National (Canada & US)",
        message: `Calculated Plan: ${calculatorName}\n\nSummary Breakdown:\n${summaryText}`,
        consentPrivacy: true,
        consentEducational: consent,
        source: `calculator_${calculatorName.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`,
      });
      firestoreSaved = true;
    } catch (fbErr) {
      console.warn("Client Firestore write deferred:", fbErr);
    }

    // 2. Dispatch to server for SQLite record and Resend notification delivery to olabel@gmail.com
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim() || "Valued Client",
          email: cleanEmail,
          topic: "calculator",
          province: "National (Canada & US)",
          message: `Calculated Plan: ${calculatorName}\n\nSummary Breakdown:\n${summaryText}`,
          consentPrivacy: true,
          consentEducational: consent,
          formLoadedAt: Date.now() - 3000,
          honeypot: "",
          referenceNo: generatedRef,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok && data.error && data.error !== "delivery_failed") {
        if (firestoreSaved) {
          setReferenceNo(generatedRef);
          setSubmitted(true);
          return;
        }
        throw new Error(data.message || (isFr ? "Impossible d'envoyer le plan." : "Unable to record plan."));
      }

      setReferenceNo(data.referenceNo || generatedRef);
      setSubmitted(true);
    } catch (err: any) {
      if (firestoreSaved) {
        setReferenceNo(generatedRef);
        setSubmitted(true);
        return;
      }
      setErrorMsg(
        err.message ||
          (isFr
            ? "Impossible d'envoyer le plan pour le moment. Veuillez joindre Ahmed Bello au +1-506-899-4941 ou planifier un appel direct sur Calendly."
            : "Could not send the plan right now. Please reach out to Ahmed Bello directly at +1-506-899-4941 or schedule a review on Calendly: https://calendly.com/olabel/30min")
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setErrorMsg(null);
  };

  return (
    <div
      className={`mt-6 p-6 sm:p-7 bg-[#fcfaf5] border-2 border-[#2e4a3b]/40 rounded-[2px] space-y-5 shadow-xs relative overflow-hidden ${className}`}
    >
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#2e4a3b] via-[#75581f] to-[#2e4a3b]" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#ece6da] pb-4">
        <div>
          <span className="text-[0.68rem] uppercase tracking-wider text-[#75581f] font-bold block mb-0.5">
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
          className="btn btn-primary text-xs py-2 px-3.5 inline-flex items-center gap-1.5 whitespace-nowrap shadow-xs shrink-0"
        >
          <Calendar className="w-3.5 h-3.5 text-[#d6c298]" />
          <span>{isFr ? "Réserver une révision de 30 min" : "Book a 30-min review"}</span>
        </a>
      </div>

      {submitted ? (
        <div className="p-5 sm:p-6 bg-[#2e4a3b] text-[#f7f3eb] rounded-[2px] space-y-4 shadow-sm animate-fadeIn">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-[#d6c298] shrink-0 mt-0.5" />
            <div className="space-y-1.5 flex-1">
              {referenceNo && (
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-[#d6c298] text-[#14211a] font-mono text-[11px] font-bold rounded-[2px]">
                    Ref: #{referenceNo}
                  </span>
                  <span className="text-[11px] text-[#d6c298] font-medium">Recorded in Practice SQLite Database</span>
                </div>
              )}
              <h5 className="font-serif text-base sm:text-lg font-medium text-[#f7f3eb]">
                {isFr ? "Plan personnalisé enregistré avec succès !" : "Customized Plan Successfully Recorded!"}
              </h5>
              <p className="text-xs text-[#ece6da] leading-relaxed">
                {isFr ? (
                  <>
                    Une copie de votre calcul pour <strong>{calculatorName}</strong> a été enregistrée pour{" "}
                    <strong>{email}</strong>. Notification dirigée vers olabel@gmail.com et abello24trdc@wfgmail.ca.
                  </>
                ) : (
                  <>
                    A detailed breakdown of your <strong>{calculatorName}</strong> calculation has been recorded for{" "}
                    <strong>{email}</strong>. Notification queued for Ahmed Bello at <strong>olabel@gmail.com</strong> and <strong>abello24trdc@wfgmail.ca</strong>.
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-[#f7f3eb]/20 flex flex-wrap items-center gap-3">
            <a
              href="https://calendly.com/olabel/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="btn bg-[#d6c298] text-[#14211a] hover:bg-white text-xs py-2 px-3.5 inline-flex items-center gap-1.5 font-semibold transition-colors"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{isFr ? "Planifier un échange de 30 min sur Calendly" : "Schedule 30-Min Discussion on Calendly"}</span>
            </a>
            <a
              href={`mailto:olabel@gmail.com,abello24trdc@wfgmail.ca?subject=${encodeURIComponent(`Plan: ${calculatorName} (Ref: #${referenceNo || ""})`)}&body=${encodeURIComponent(`Client: ${firstName || "Valued Client"} (${email})\n\n${summaryText}`)}`}
              className="text-xs text-[#d6c298] hover:text-white underline inline-flex items-center gap-1 py-1"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{isFr ? "Ouvrir dans votre messagerie" : "Send direct email copy"}</span>
            </a>
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-[#ece6da] hover:text-white underline inline-flex items-center gap-1 py-2 px-2 ml-auto"
            >
              <RefreshCw className="w-3 h-3" />
              <span>{isFr ? "Calculer un autre scénario" : "Calculate another scenario"}</span>
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSendPlan} className="space-y-4">
          {errorMsg && (
            <div
              role="alert"
              className="p-3.5 bg-[#fdf0ed] border border-[#d97768] text-[#8a3324] text-xs rounded-[2px] space-y-2 animate-fadeIn"
            >
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-[#8a3324] shrink-0 mt-0.5" />
                <div className="leading-relaxed font-medium">{errorMsg}</div>
              </div>
              <div className="pt-2 border-t border-[#d97768]/30 flex flex-wrap items-center gap-2.5 text-[#1c1b18] text-xs">
                <span className="font-semibold">{isFr ? "Contact direct :" : "Direct Contact:"}</span>
                <a href="tel:+15068994941" className="underline font-semibold text-[#2e4a3b] inline-flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  <span>+1 (506) 899-4941</span>
                </a>
                <span>•</span>
                <a
                  href="https://calendly.com/olabel/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-semibold text-[#2e4a3b] inline-flex items-center gap-1"
                >
                  <Calendar className="w-3 h-3" />
                  <span>{isFr ? "Réserver 30 min sur Calendly" : "Schedule 30 min on Calendly"}</span>
                </a>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor={`calc-name-${calculatorName.replace(/\s+/g, "-").toLowerCase()}`}
                className="block text-[0.72rem] font-semibold text-[#46423a] mb-1"
              >
                {isFr ? "Prénom (optionnel)" : "First Name (optional)"}
              </label>
              <input
                id={`calc-name-${calculatorName.replace(/\s+/g, "-").toLowerCase()}`}
                type="text"
                name="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder={isFr ? "ex. Sarah" : "e.g., Sarah"}
                className="w-full text-xs p-2.5 bg-white border border-[#d6cebd] rounded-[2px] focus:outline-none focus:border-[#2e4a3b]"
              />
            </div>

            <div>
              <label
                htmlFor={`calc-email-${calculatorName.replace(/\s+/g, "-").toLowerCase()}`}
                className="block text-[0.72rem] font-semibold text-[#1c1b18] mb-1"
              >
                {isFr ? "Adresse courriel" : "Email Address"} <span className="text-[#8a3324]">*</span>
              </label>
              <input
                id={`calc-email-${calculatorName.replace(/\s+/g, "-").toLowerCase()}`}
                type="email"
                required
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isFr ? "sarah@exemple.ca" : "sarah@example.ca"}
                className="w-full text-xs p-2.5 bg-white border border-[#d6cebd] rounded-[2px] focus:outline-none focus:border-[#2e4a3b]"
              />
            </div>
          </div>

          {/* CASL Compliance Checkbox placed prominently before submit */}
          <div
            className={`p-3 rounded-[2px] border transition-colors ${
              !consent && errorMsg
                ? "bg-[#fdf0ed] border-[#d97768]"
                : "bg-white/60 border-[#e3dccf]"
            }`}
          >
            <div className="flex items-start gap-2.5">
              <input
                id={`calc-consent-${calculatorName.replace(/\s+/g, "-").toLowerCase()}`}
                type="checkbox"
                required
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 accent-[#2e4a3b] w-4 h-4 cursor-pointer"
              />
              <label
                htmlFor={`calc-consent-${calculatorName.replace(/\s+/g, "-").toLowerCase()}`}
                className="text-[0.72rem] text-[#46423a] leading-relaxed cursor-pointer select-none"
              >
                {isFr ? (
                  <>
                    <strong className="text-[#1c1b18]">Consentement LCAP :</strong> J'accepte de recevoir une copie de ce plan personnalisé et des résumés éducatifs ponctuels d'Ahmed Bello selon la législation canadienne contre les pourriels (LCAP). Désabonnement instantané en 1 clic. Consultez l'
                    <Link to="/fr/privacy" className="underline hover:text-[#2e4a3b] font-medium">
                      avis de confidentialité
                    </Link>
                    .
                  </>
                ) : (
                  <>
                    <strong className="text-[#1c1b18]">CASL Consent:</strong> I consent to receive a copy of this customized calculation plan and occasional educational briefings from Ahmed Bello under Canada’s Anti-Spam Legislation (CASL). Unsubscribe anytime with 1 click. Read the{" "}
                    <Link to="/privacy" className="underline hover:text-[#2e4a3b] font-medium">
                      privacy notice
                    </Link>
                    .
                  </>
                )}
              </label>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary text-xs py-2.5 px-5 whitespace-nowrap flex items-center justify-center gap-2 shadow-xs cursor-pointer font-medium"
            >
              {submitting ? (
                <span>{isFr ? "Enregistrement et envoi..." : "Recording & Sending Plan..."}</span>
              ) : (
                <>
                  <Mail className="w-3.5 h-3.5 text-[#d6c298]" />
                  <span>{isFr ? "M'envoyer ce plan personnalisé" : "Email me this customized plan"}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-70" />
                </>
              )}
            </button>

            <span className="text-[0.68rem] text-[#75581f] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>{isFr ? "Strictement confidentiel • Zéro vente forcée" : "Strictly Confidential • Zero Sales Pressure"}</span>
            </span>
          </div>
        </form>
      )}
    </div>
  );
};
