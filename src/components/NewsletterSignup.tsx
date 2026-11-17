import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, CheckCircle2, ArrowRight, ShieldCheck } from "lucide-react";
import { useLanguage } from "../context/LanguageContext.tsx";
import { trackNewsletterSubmit } from "../lib/track.ts";
import { TurnstileWidget } from "./TurnstileWidget.tsx";
import { siteConfig } from "../config/site.ts";

interface NewsletterSignupProps {
  title?: string;
  description?: string;
  source?: string;
  className?: string;
}

export const NewsletterSignup: React.FC<NewsletterSignupProps> = ({
  title,
  description,
  source = "general",
  className = "",
}) => {
  const { isFr } = useLanguage();
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [formLoadedAt] = useState<number>(() => Date.now());

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const resolvedTitle =
    title ||
    (isFr ? "Le Point sur les Règles Financières" : "Canadian Money Rules Briefing");
  const resolvedDescription =
    description ||
    (isFr
      ? "Analyses pratiques en langage clair lorsque les règles fiscales canadiennes, les plafonds enregistrés annuels (CELI, REER, CELIAPP) ou les politiques de retraite publique évoluent. Désabonnement en tout temps."
      : "Occasional plain-language briefings when key Canadian tax rules, annual registered account limits (TFSA/RRSP/FHSA), or public pension policies change. Unsubscribe anytime.");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setErrorMsg(
        isFr
          ? "Veuillez saisir une adresse courriel valide."
          : "Please enter a valid email address."
      );
      return;
    }

    if (!consent) {
      setErrorMsg(
        isFr
          ? "Veuillez cocher la case pour confirmer votre consentement en vertu de la loi canadienne anti-pourriel (LCAP)."
          : "Please check the box to confirm your consent under Canadian anti-spam legislation."
      );
      return;
    }

    setSubmitting(true);
    const generatedRef = "NEWS-" + Math.floor(100000 + Math.random() * 900000);

    // Dispatch directly to server endpoint where validation, bot controls, and Admin SDK are enforced
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: firstName.trim() || (isFr ? "Lecteur" : "Reader"),
          email: cleanEmail,
          topic: "newsletter",
          message: `Newsletter subscription from page source: ${source}`,
          consentPrivacy: true,
          consentEducational: true,
          turnstileToken,
          honeypot,
          formLoadedAt,
          referenceNo: generatedRef,
          language: isFr ? "fr" : "en",
          source: `newsletter_${source}`,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message ||
            (isFr
              ? "Échec de l'inscription. Veuillez réessayer."
              : "Failed to subscribe. Please try again.")
        );
      }

      setSuccess(true);
      trackNewsletterSubmit(source);
    } catch (err: any) {
      setErrorMsg(
        err.message ||
          (isFr
            ? `Impossible de finaliser votre inscription pour le moment. Contactez Ahmed Bello directement au ${siteConfig.publicPhone} ou à ${siteConfig.publicEmail}.`
            : `Could not complete your subscription right now. Please reach out to Ahmed Bello directly at ${siteConfig.publicPhone} or ${siteConfig.publicEmail}.`)
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className={`bg-[#fcfaf5] border border-[#d6cebd] p-8 md:p-10 rounded-[2px] shadow-sm relative overflow-hidden ${className}`}
    >
      {/* Architectural top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#2e4a3b]" />

      <div className="max-w-2xl mx-auto text-center space-y-3 mb-6">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-[#2e4a3b]/10 text-[#2e4a3b] rounded-[2px] text-xs font-semibold uppercase tracking-wider">
          <Mail className="w-3.5 h-3.5 text-[#75581f]" />
          <span>{isFr ? "Bulletins Éducatifs Périodiques" : "Occasional Educational Briefings"}</span>
        </div>

        <h3 className="h3 text-2xl sm:text-3xl text-[#1c1b18]">
          {resolvedTitle}
        </h3>

        <p className="text-sm text-[#46423a] leading-relaxed max-w-xl mx-auto">
          {resolvedDescription}
        </p>
      </div>

      {success ? (
        <div className="max-w-md mx-auto p-6 bg-[#2e4a3b] text-[#f7f3eb] rounded-[2px] text-center space-y-3">
          <div className="w-10 h-10 rounded-[2px] bg-[#f7f3eb] text-[#2e4a3b] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h4 className="font-serif text-xl text-[#f7f3eb]">
            {isFr ? "Demande de confirmation envoyée" : "Confirmation Request Sent"}
          </h4>
          <p className="text-xs text-[#ece6da] leading-relaxed">
            {isFr ? (
              <>
                Merci pour votre demande d'inscription. Veuillez vérifier votre boîte de réception à{" "}
                <strong className="text-white">{email}</strong> et cliquer sur le lien de confirmation pour valider votre abonnement.
              </>
            ) : (
              <>
                Thank you for requesting to subscribe. Please check your inbox at{" "}
                <strong className="text-white">{email}</strong> and click the confirmation link to complete your subscription.
              </>
            )}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4">
          {/* Honeypot field for bot suppression */}
          <input
            type="text"
            name="honeypot"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
          />

          {errorMsg && (
            <div className="p-3 bg-[#fdf0ed] border border-[#d97768] text-[#8a3324] text-xs rounded-[2px] text-center">
              {errorMsg}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2.5">
            <input
              type="text"
              name="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder={isFr ? "Prénom (optionnel)" : "First name (optional)"}
              className="text-xs sm:text-sm p-3 bg-[#f7f3eb] border border-[#d6cebd] rounded-[2px] focus:outline-none focus:border-[#2e4a3b] sm:w-1/3"
            />
            <input
              type="email"
              required
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={isFr ? "Votre adresse courriel *" : "Enter your email address *"}
              className="text-xs sm:text-sm p-3 bg-[#f7f3eb] border border-[#d6cebd] rounded-[2px] focus:outline-none focus:border-[#2e4a3b] flex-1"
            />
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary text-xs sm:text-sm py-3 px-6 whitespace-nowrap flex items-center justify-center gap-1.5 shadow-sm"
            >
              {submitting ? (
                <span>{isFr ? "Inscription..." : "Subscribing..."}</span>
              ) : (
                <>
                  <span>{isFr ? "S'inscrire" : "Subscribe"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

          <TurnstileWidget onVerify={setTurnstileToken} />

          {/* CASL & Privacy Consent */}
          <div className="flex items-start gap-2 pt-1 text-left">
            <input
              id={`consent-${source}`}
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 accent-[#2e4a3b]"
            />
            <label
              htmlFor={`consent-${source}`}
              className="text-[0.72rem] text-[#625d52] leading-tight cursor-pointer"
            >
              {isFr ? (
                <>
                  J'accepte de recevoir des courriels éducatifs ponctuels d'Ahmed Bello en vertu de la Loi canadienne anti-pourriel (LCAP). Désabonnement en 1 clic à tout moment. Consultez l'{" "}
                  <Link to="/fr/privacy" className="underline hover:text-[#2e4a3b]">
                    avis de confidentialité
                  </Link>
                  .
                </>
              ) : (
                <>
                  I consent to receive occasional educational emails from Ahmed Bello under Canada’s Anti-Spam Legislation (CASL). I can unsubscribe anytime with one click. Read the{" "}
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

      {/* Compliance notes */}
      <div className="mt-6 pt-5 border-t border-[#ece6da] flex flex-wrap items-center justify-center gap-6 text-[0.7rem] text-[#625d52]">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#2e4a3b]" />
          {isFr ? "Conformité stricte LCAP" : "Strict CASL Compliance"}
        </span>
        <span>{isFr ? "Contenu strictement éducatif" : "Educational Updates Only"}</span>
        <span>{isFr ? "Désabonnement en 1 clic" : "1-Click Easy Unsubscribe"}</span>
      </div>
    </div>
  );
};
