import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, CheckCircle2, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

interface NewsletterSignupProps {
  title?: string;
  description?: string;
  source?: string;
  className?: string;
}

export const NewsletterSignup: React.FC<NewsletterSignupProps> = ({
  title = "The Intentional Wealth Briefing",
  description = "One plain-language breakdown per month on Canadian tax shelters, retirement mechanics, and personal finance strategy. Zero sales pitches. Unsubscribe anytime.",
  source = "general",
  className = "",
}) => {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [formLoadedAt] = useState<number>(() => Date.now());

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim() || !email.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    if (!consent) {
      setErrorMsg("Please check the box to confirm your consent under Canadian anti-spam legislation.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: firstName.trim() || "Reader",
          email: email.trim(),
          topic: "newsletter",
          message: `Newsletter subscription from page source: ${source}`,
          consentPrivacy: true,
          consentEducational: true,
          honeypot,
          formLoadedAt,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to subscribe. Please try again.");
      }

      setSuccess(true);
    } catch (err: any) {
      setErrorMsg(
        err.message || "Could not complete your subscription. Please check your connection or contact directly."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className={`bg-[#fcfaf5] border border-[#d6cebd] p-8 md:p-10 rounded-[2px] shadow-sm relative overflow-hidden ${className}`}
    >
      {/* Subtle architectural brass accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2e4a3b] via-[#75581f] to-[#2e4a3b]" />

      <div className="max-w-2xl mx-auto text-center space-y-3 mb-6">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-[#2e4a3b]/10 text-[#2e4a3b] rounded-[2px] text-xs font-semibold uppercase tracking-wider">
          <Mail className="w-3.5 h-3.5 text-[#75581f]" />
          <span>Monthly Educational Briefing</span>
        </div>

        <h3
          className="font-serif text-2xl sm:text-3xl text-[#1c1b18] tracking-tight"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {title}
        </h3>

        <p className="text-sm text-[#46423a] leading-relaxed max-w-xl mx-auto">
          {description}
        </p>
      </div>

      {success ? (
        <div className="max-w-md mx-auto p-6 bg-[#2e4a3b] text-[#f7f3eb] rounded-[2px] text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-[#f7f3eb] text-[#2e4a3b] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h4 className="font-serif text-xl text-[#f7f3eb]">You’re Subscribed!</h4>
          <p className="text-xs text-[#ece6da] leading-relaxed">
            Thank you for joining. You will receive our next monthly briefing directly at{" "}
            <strong className="text-white">{email}</strong>. No clutter, only actionable Canadian financial analysis.
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
              placeholder="First name (optional)"
              className="text-xs sm:text-sm p-3 bg-[#f7f3eb] border border-[#d6cebd] rounded-[2px] focus:outline-none focus:border-[#2e4a3b] sm:w-1/3"
            />
            <input
              type="email"
              required
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address *"
              className="text-xs sm:text-sm p-3 bg-[#f7f3eb] border border-[#d6cebd] rounded-[2px] focus:outline-none focus:border-[#2e4a3b] flex-1"
            />
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary text-xs sm:text-sm py-3 px-6 whitespace-nowrap flex items-center justify-center gap-1.5 shadow-sm"
            >
              {submitting ? (
                <span>Subscribing...</span>
              ) : (
                <>
                  <span>Subscribe</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

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
              I consent to receive monthly educational emails from Ahmed Bello under Canada’s Anti-Spam Legislation (CASL). I can unsubscribe anytime with one click. Read our{" "}
              <Link to="/privacy" className="underline hover:text-[#2e4a3b]">
                privacy notice
              </Link>
              .
            </label>
          </div>
        </form>
      )}

      {/* Trust reassurance icons */}
      <div className="mt-6 pt-5 border-t border-[#ece6da] flex flex-wrap items-center justify-center gap-6 text-[0.7rem] text-[#625d52]">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#2e4a3b]" />
          Strict CASL Compliance
        </span>
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#75581f]" />
          Zero Spam / No Sales Pitches
        </span>
        <span>1-Click Easy Unsubscribe</span>
      </div>
    </div>
  );
};
