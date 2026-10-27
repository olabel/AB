import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Tbc } from "../components/Tbc.tsx";
import { siteConfig } from "../config/site.ts";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";

const PROVINCES_AND_TERRITORIES = [
  "Alberta",
  "British Columbia",
  "Manitoba",
  "New Brunswick",
  "Newfoundland and Labrador",
  "Northwest Territories",
  "Nova Scotia",
  "Nunavut",
  "Ontario",
  "Prince Edward Island",
  "Quebec",
  "Saskatchewan",
  "Yukon",
];

const TOPIC_OPTIONS: { id: string; label: string }[] = [
  { id: "general", label: "General financial education" },
  { id: "accounts", label: "Savings accounts (TFSA, RRSP, FHSA, etc.)" },
  { id: "investing", label: "Investments and risk" },
  { id: "protection", label: "Financial protection and income replacement" },
  { id: "family", label: "Family planning and education savings (RESP)" },
  { id: "retirement", label: "Retirement and public pensions (CPP/OAS)" },
  { id: "newcomer", label: "Newcomer to Canada" },
  { id: "other", label: "Other financial question" },
];

export const ContactPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const topicParam = searchParams.get("topic") || "";

  // Find prefilled topic from URL
  const initialTopic = TOPIC_OPTIONS.some((t) => t.id === topicParam)
    ? topicParam
    : topicParam === "education"
    ? "general"
    : "";

  const [formLoadedAt] = useState<number>(() => Date.now());
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [province, setProvince] = useState("");
  const [topic, setTopic] = useState(initialTopic);
  const [message, setMessage] = useState("");
  const [consentPrivacy, setConsentPrivacy] = useState(false);
  const [consentEducational, setConsentEducational] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error" | "not_configured">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const errorSummaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (topicParam) {
      if (TOPIC_OPTIONS.some((t) => t.id === topicParam)) {
        setTopic(topicParam);
      } else if (topicParam === "education") {
        setTopic("general");
      }
    }
  }, [topicParam]);

  // Focus error summary when errors appear
  useEffect(() => {
    if (Object.keys(fieldErrors).length > 0) {
      errorSummaryRef.current?.focus();
    }
  }, [fieldErrors]);

  // Strict client-side sanitization helper against script/HTML/header injection
  const sanitizeInput = (val: string): string => {
    return val
      .replace(/\0/g, "") // strip null bytes
      .replace(/[<>]/g, "") // remove HTML tag brackets
      .trim();
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    const cleanFirst = sanitizeInput(firstName);
    const cleanEmail = sanitizeInput(email);
    const cleanPhone = sanitizeInput(phone);

    if (!cleanFirst) {
      errors.firstName = "Please provide your first name.";
    } else if (cleanFirst.length > 60) {
      errors.firstName = "First name must be under 60 characters.";
    } else if (!/^[A-Za-zÀ-ÿ\s'-]+$/.test(cleanFirst)) {
      errors.firstName = "First name contains invalid characters.";
    }

    if (!cleanEmail) {
      errors.email = "Please provide your email address.";
    } else if (cleanEmail.length > 100) {
      errors.email = "Email address must be under 100 characters.";
    } else if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/.test(cleanEmail)) {
      errors.email = "Please enter a valid email address.";
    }

    if (cleanPhone && !/^[0-9+\-()\s]{7,25}$/.test(cleanPhone)) {
      errors.phone = "Please enter a valid phone number or leave blank.";
    }

    if (!province || !PROVINCES_AND_TERRITORIES.includes(province)) {
      errors.province = "Please select your province or territory.";
    }

    if (!topic || !TOPIC_OPTIONS.some((t) => t.id === topic)) {
      errors.topic = "Please select a main financial topic.";
    }

    if (message.length > 1500) {
      errors.message = "Message must not exceed 1,500 characters.";
    }

    if (!consentPrivacy) {
      errors.consentPrivacy = "You must agree to the privacy notice before submitting.";
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setStatus("error");
      return;
    }

    setFieldErrors({});
    setStatus("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: sanitizeInput(firstName),
          email: sanitizeInput(email),
          phone: sanitizeInput(phone),
          province,
          topic,
          message: sanitizeInput(message),
          consentPrivacy,
          consentEducational,
          honeypot: sanitizeInput(honeypot),
          formLoadedAt,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.status === 503 || data.code === "not_configured") {
        // Honest not configured state
        setStatus("not_configured");
        setErrorMessage(
          data.message || "Not sent. This form isn’t connected to an inbox yet."
        );
        return;
      }

      if (!response.ok) {
        if (response.status === 400 && data.errors) {
          setFieldErrors(data.errors);
          setStatus("error");
        } else {
          setStatus("error");
          setErrorMessage(
            data.message || "Something went wrong while sending your message. Please try again later."
          );
        }
        return;
      }

      // Success
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage("Network error occurred. Your message could not be sent right now.");
    }
  };

  return (
    <div className="py-12 md:py-16">
      {/* Header */}
      <section className="section pb-12 pt-4 border-b border-[#d6cebd]">
        <div className="wrap max-w-4xl space-y-4">
          <span className="eyebrow text-xs">Start a conversation</span>
          <h1 className="h1 text-[#1c1b18] leading-tight">
            What financial question is on your mind?
          </h1>
          <p className="lede text-lg md:text-xl text-[#46423a] leading-relaxed">
            Tell me a little about what you are trying to understand, and we can determine an appropriate next step.
          </p>
        </div>
      </section>

      {/* Main Grid: Info (Left) + Form (Right) */}
      <div className="wrap max-w-5xl py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Context, What happens next, Don't send */}
          <aside className="lg:col-span-5 space-y-8 order-2 lg:order-1">
            {/* Direct Advisor Reassurance Card */}
            <div className="p-5 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] space-y-4 shadow-2xs">
              <div className="flex items-center gap-4">
                <div className="w-16 h-20 shrink-0 border border-[#75581f]/30 bg-[#f7f3eb] p-0.5 rounded-[1px] overflow-hidden">
                  <img
                    src={siteConfig.headshotUrl}
                    alt="Ahmed Bello"
                    className="w-full h-full object-cover object-top rounded-[1px]"
                    width={64}
                    height={80}
                  />
                </div>
                <div>
                  <span className="eyebrow text-[0.65rem] text-[#75581f] block">Direct Consultation</span>
                  <p className="font-serif text-lg text-[#1c1b18] leading-tight mt-0.5">Ahmed Bello</p>
                  <p className="text-[0.72rem] text-[#46423a] font-medium leading-tight mt-0.5">
                    {siteConfig.designation}
                  </p>
                  <p className="text-[0.7rem] text-[#2e4a3b] font-semibold mt-1">
                    Independent Financial Practice &bull; Canada
                  </p>
                </div>
              </div>
              <p className="text-xs text-[#46423a] leading-relaxed border-t border-[#d6cebd] pt-3">
                “Every enquiry sent through this form is received and reviewed directly by me. You will receive an educational, evidence-based response without sales pressure or unsolicited pitches.”
              </p>
            </div>

            {/* What happens next - Detailed Journey */}
            <div className="p-6 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] space-y-5">
              <div className="flex items-center gap-2">
                <span className="eyebrow text-xs text-[#75581f]">Submission Journey</span>
              </div>
              <h2 className="font-serif text-xl text-[#1c1b18]">
                What happens when you submit this form?
              </h2>
              
              <ol className="space-y-4 text-xs text-[#46423a] list-none p-0">
                <li className="flex items-start gap-3">
                  <span className="font-mono text-[#2e4a3b] font-bold bg-[#f7f3eb] px-1.5 py-0.5 border border-[#d6cebd] rounded-[2px]">
                    01
                  </span>
                  <div>
                    <strong className="text-[#1c1b18] block mb-0.5">Automated Validation & Secure Routing</strong>
                    <span>
                      Your submission is immediately sanitized against malicious injection and transmitted via encrypted HTTPS directly to Ahmed’s secure Canadian inbox. No advertising tracking and no data broker sales.
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-mono text-[#2e4a3b] font-bold bg-[#f7f3eb] px-1.5 py-0.5 border border-[#d6cebd] rounded-[2px]">
                    02
                  </span>
                  <div>
                    <strong className="text-[#1c1b18] block mb-0.5">Personal Review by Ahmed (1–2 Business Days)</strong>
                    <span>
                      Ahmed personally reads your message, examines your stated topic (e.g. TFSA/RRSP, income protection, newcomer rules), and prepares an evidence-based initial response.
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-mono text-[#2e4a3b] font-bold bg-[#f7f3eb] px-1.5 py-0.5 border border-[#d6cebd] rounded-[2px]">
                    03
                  </span>
                  <div>
                    <strong className="text-[#1c1b18] block mb-0.5">Clarity-First Next Steps</strong>
                    <span>
                      You receive a thoughtful response. If appropriate, Ahmed will invite you to an exploratory 25-minute conversation or refer you to an external specialist (e.g. CPA, LIT). You decide if you want to proceed.
                    </span>
                  </div>
                </li>
              </ol>

              <div className="pt-3 border-t border-[#ece6da] flex items-center justify-between text-[0.75rem] text-[#625d52]">
                <span>No automated marketing sequences</span>
                <span className="font-semibold text-[#2e4a3b]">No sales pressure</span>
              </div>
            </div>

            {/* Please don't send */}
            <div className="p-6 bg-[#f7f3eb] border-l-2 border-[#8f2a1d] rounded-r-[2px] space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8f2a1d]">
                Please don’t send
              </h3>
              <p className="text-xs text-[#46423a] leading-relaxed">
                Account numbers, your Social Insurance Number (SIN) or other government ID numbers,
                medical details, or financial documents. A website form is not the place for them,
                and I will tell you the safe way to share anything that is needed.
              </p>
            </div>

            {/* Other ways to reach me */}
            <div className="p-6 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] space-y-3 text-xs text-[#46423a]">
              <h3 className="font-semibold text-xs uppercase tracking-wider text-[#75581f]">
                Direct Contact
              </h3>
              <p>
                Email:{" "}
                <a href="mailto:enquiries@ahmedbello.ca" className="underline text-[#2e4a3b] font-medium">
                  enquiries@ahmedbello.ca
                </a>
              </p>

              {/* Optional scheduling link: hidden until supplied */}
              {siteConfig.schedulingUrl && (
                <p>
                  <a href={siteConfig.schedulingUrl} className="underline text-[#2e4a3b]">
                    Schedule a time directly &rarr;
                  </a>
                </p>
              )}

              <p className="text-[0.75rem] text-[#625d52] pt-2 border-t border-[#ece6da]">
                This site is for general enquiries. It is not for emergencies or urgent financial or medical matters.
              </p>
            </div>
          </aside>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            {/* Development Placeholder Banner (only shown while in pre-launch draft mode) */}
            {siteConfig.schedulingUrl && (
              <div className="mb-6 p-4 bg-[#fbe7a1]/70 border border-[#e5cf85] rounded-[2px] text-xs text-[#4a3a00] flex items-start gap-2.5">
                <Info className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <strong>Direct booking:</strong> An online scheduling link is active.
                </div>
              </div>
            )}

            {/* Success State */}
            {status === "success" ? (
              <div
                tabIndex={-1}
                className="p-8 bg-[#fcfaf5] border-2 border-[#2e4a3b] rounded-[2px] space-y-4"
              >
                <div className="flex items-center gap-3 text-[#2e4a3b]">
                  <CheckCircle2 className="w-7 h-7" aria-hidden="true" />
                  <h2 className="h3 text-[#2e4a3b] text-2xl font-serif">Message received</h2>
                </div>
                <p className="text-sm md:text-base text-[#1c1b18] leading-relaxed">
                  Thank you, {firstName}. I have received your enquiry regarding {topic}. I will review your message
                  and reply to <strong>{email}</strong> with an appropriate next step.
                </p>
                <div className="pt-4 border-t border-[#d6cebd] flex flex-wrap gap-4">
                  <Link to="/education" className="btn btn-primary text-xs py-2 px-4">
                    Browse the education library &rarr;
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setStatus("idle");
                      setMessage("");
                    }}
                    className="btn btn-ghost text-xs py-2 px-4"
                  >
                    Send another question
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="p-6 md:p-8 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] space-y-6 shadow-xs"
              >
                {/* Accessible Error Summary */}
                {Object.keys(fieldErrors).length > 0 && (
                  <div
                    ref={errorSummaryRef}
                    tabIndex={-1}
                    role="alert"
                    aria-labelledby="error-summary-title"
                    className="p-4 bg-[#fbe7a1]/40 border-l-4 border-[#8f2a1d] rounded-r-[2px] text-xs space-y-2 focus:outline-none"
                  >
                    <div className="flex items-center gap-2 text-[#8f2a1d] font-semibold text-sm" id="error-summary-title">
                      <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>Please correct the errors before submitting:</span>
                    </div>
                    <ul className="list-disc pl-5 space-y-1 text-[#8f2a1d]">
                      {Object.entries(fieldErrors).map(([key, msg]) => (
                        <li key={key}>
                          <a href={`#field-${key}`} className="underline hover:text-black">
                            {msg}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Not Configured Warning Message (honest failure) */}
                {status === "not_configured" && (
                  <div
                    role="alert"
                    className="p-4 bg-[#fbe7a1] border border-[#e5cf85] text-[#4a3a00] rounded-[2px] text-xs space-y-1.5"
                  >
                    <p className="font-semibold text-sm">
                      {errorMessage || "Not sent. This form isn’t connected to an inbox yet."}
                    </p>
                    <p>
                      Your inputs have been preserved above. In development or testing, configure RESEND_API_KEY
                      and CONTACT_TO_EMAIL secrets on the server to enable email transmission.
                    </p>
                  </div>
                )}

                {/* Server Error Message */}
                {status === "error" && errorMessage && (
                  <div
                    role="alert"
                    className="p-4 bg-[#8f2a1d]/10 border border-[#8f2a1d] text-[#8f2a1d] rounded-[2px] text-xs font-medium"
                  >
                    {errorMessage}
                  </div>
                )}

                {/* Honeypot field (hidden visually and from screen readers) */}
                <div style={{ display: "none" }} aria-hidden="true">
                  <label htmlFor="website-hp">Website</label>
                  <input
                    id="website-hp"
                    type="text"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                {/* Field 1: First Name */}
                <div>
                  <label htmlFor="field-firstName" className="label">
                    First name <span className="text-[#8f2a1d]">*</span>
                  </label>
                  <input
                    id="field-firstName"
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    aria-invalid={!!fieldErrors.firstName}
                    aria-describedby={fieldErrors.firstName ? "error-firstName" : undefined}
                    className="field"
                    placeholder="e.g. Sarah"
                  />
                  {fieldErrors.firstName && (
                    <p id="error-firstName" className="text-xs text-[#8f2a1d] mt-1">
                      {fieldErrors.firstName}
                    </p>
                  )}
                </div>

                {/* Field 2 & 3: Email and Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="field-email" className="label">
                      Email address <span className="text-[#8f2a1d]">*</span>
                    </label>
                    <input
                      id="field-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      aria-invalid={!!fieldErrors.email}
                      aria-describedby={fieldErrors.email ? "error-email" : undefined}
                      className="field"
                      placeholder="name@example.com"
                    />
                    {fieldErrors.email && (
                      <p id="error-email" className="text-xs text-[#8f2a1d] mt-1">
                        {fieldErrors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="field-phone" className="label">
                      Phone number <span className="text-[#625d52] font-normal">(optional)</span>
                    </label>
                    <input
                      id="field-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="field"
                      placeholder="(555) 000-0000"
                    />
                  </div>
                </div>

                {/* Field 4: Province or Territory */}
                <div>
                  <label htmlFor="field-province" className="label">
                    Province or territory <span className="text-[#8f2a1d]">*</span>
                  </label>
                  <select
                    id="field-province"
                    required
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    aria-invalid={!!fieldErrors.province}
                    aria-describedby={fieldErrors.province ? "error-province" : undefined}
                    className="field bg-white"
                  >
                    <option value="">Select your province or territory...</option>
                    {PROVINCES_AND_TERRITORIES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.province && (
                    <p id="error-province" className="text-xs text-[#8f2a1d] mt-1">
                      {fieldErrors.province}
                    </p>
                  )}
                  <p className="text-[0.75rem] text-[#625d52] mt-1">
                    Financial services can only be offered where licensed.
                  </p>
                </div>

                {/* Field 5: Main Topic */}
                <div>
                  <label htmlFor="field-topic" className="label">
                    Main topic <span className="text-[#8f2a1d]">*</span>
                  </label>
                  <select
                    id="field-topic"
                    required
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    aria-invalid={!!fieldErrors.topic}
                    aria-describedby={fieldErrors.topic ? "error-topic" : undefined}
                    className="field bg-white"
                  >
                    <option value="">Select what you are trying to understand...</option>
                    {TOPIC_OPTIONS.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.topic && (
                    <p id="error-topic" className="text-xs text-[#8f2a1d] mt-1">
                      {fieldErrors.topic}
                    </p>
                  )}
                </div>

                {/* Field 6: Message (Optional, 1,500 chars max with live counter) */}
                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <label htmlFor="field-message" className="label mb-0">
                      Message <span className="text-[#625d52] font-normal">(optional)</span>
                    </label>
                    <span
                      className={`text-xs font-mono tabular-nums ${
                        message.length > 1500 ? "text-[#8f2a1d] font-bold" : "text-[#625d52]"
                      }`}
                    >
                      {message.length} / 1,500
                    </span>
                  </div>
                  <textarea
                    id="field-message"
                    rows={5}
                    maxLength={1500}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    aria-invalid={!!fieldErrors.message}
                    aria-describedby={fieldErrors.message ? "error-message" : undefined}
                    className="field min-h-[7rem] resize-y"
                    placeholder="Tell me a little about your question or circumstances (please do not include account numbers, SIN, or medical details)..."
                  />
                  {fieldErrors.message && (
                    <p id="error-message" className="text-xs text-[#8f2a1d] mt-1">
                      {fieldErrors.message}
                    </p>
                  )}
                </div>

                {/* Checkboxes: Privacy Consent (required) & Educational Emails (optional) */}
                <div className="space-y-4 pt-2 border-t border-[#ece6da]">
                  {/* Required Privacy Consent */}
                  <div className="flex items-start gap-3">
                    <input
                      id="field-consentPrivacy"
                      type="checkbox"
                      required
                      checked={consentPrivacy}
                      onChange={(e) => setConsentPrivacy(e.target.checked)}
                      aria-invalid={!!fieldErrors.consentPrivacy}
                      aria-describedby={fieldErrors.consentPrivacy ? "error-consentPrivacy" : undefined}
                      className="mt-1 w-4 h-4 rounded border-[#8d8677] text-[#2e4a3b] focus:ring-[#2e4a3b]"
                    />
                    <label htmlFor="field-consentPrivacy" className="text-xs text-[#46423a] leading-relaxed">
                      I have read and consent to the{" "}
                      <Link to="/privacy" target="_blank" className="underline text-[#2e4a3b]">
                        privacy notice
                      </Link>
                      . I understand that submitting this message does not create an advisory relationship or
                      guarantee any service. <span className="text-[#8f2a1d]">*</span>
                    </label>
                  </div>
                  {fieldErrors.consentPrivacy && (
                    <p id="error-consentPrivacy" className="text-xs text-[#8f2a1d] pl-7">
                      {fieldErrors.consentPrivacy}
                    </p>
                  )}

                  {/* Optional Educational Emails Checkbox */}
                  <div className="flex items-start gap-3">
                    <input
                      id="field-consentEducational"
                      type="checkbox"
                      checked={consentEducational}
                      onChange={(e) => setConsentEducational(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-[#8d8677] text-[#2e4a3b] focus:ring-[#2e4a3b]"
                    />
                    <label htmlFor="field-consentEducational" className="text-xs text-[#46423a] leading-relaxed">
                      Send me educational financial guides and updates when published. (Optional; you can unsubscribe at any time).
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4 border-t border-[#d6cebd]">
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="btn btn-primary w-full sm:w-auto text-base px-8 py-3.5"
                  >
                    {status === "submitting" ? "Sending enquiry..." : "Send Financial Enquiry"}
                  </button>
                  <p className="text-[0.75rem] text-[#625d52] mt-3">
                    Submitting this form does not create an advisory relationship or obligate you in any way.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
