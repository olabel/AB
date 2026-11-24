import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { siteConfig, getCtaLabel } from "../config/site.ts";
import { Portrait } from "../components/Portrait.tsx";
import {
  AlertCircle,
  CheckCircle2,
  Calendar,
  ArrowUpRight,
  Clock,
  MailCheck,
  ShieldCheck,
  Phone,
  Mail,
} from "lucide-react";
import { SEO } from "../components/SEO.tsx";
import { useLanguage } from "../context/LanguageContext.tsx";
import { TurnstileWidget } from "../components/TurnstileWidget.tsx";
import { trackLeadSubmit, trackBookingClick } from "../lib/track.ts";

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

const TOPIC_OPTIONS = [
  { id: "general", labelEn: "General financial education", labelFr: "Éducation financière générale" },
  { id: "accounts", labelEn: "Registered accounts (TFSA, RRSP, FHSA)", labelFr: "Comptes enregistrés (CELI, REER, CELIAPP)" },
  { id: "investing", labelEn: "Investments and risk management", labelFr: "Investissements et gestion du risque" },
  { id: "protection", labelEn: "Income protection & life insurance", labelFr: "Protection du revenu & assurance vie" },
  { id: "family", labelEn: "Family planning & education savings (RESP)", labelFr: "Planification familiale & épargne-études (REEE)" },
  { id: "retirement", labelEn: "Retirement & public pensions (CPP/OAS)", labelFr: "Retraite & rentes publiques (RPC/SV)" },
  { id: "debt", labelEn: "Debt strategy & mortgage structure", labelFr: "Stratégie d'endettement & hypothèque" },
  { id: "newcomer", labelEn: "New to Canada settlement finances", labelFr: "Finances de 1re année pour nouveaux arrivants" },
  { id: "amt", labelEn: "Alternative Minimum Tax (AMT) analysis", labelFr: "Impôt minimum de remplacement (IMR)" },
  { id: "pension-checklist", labelEn: "Pension commuted value decision review", labelFr: "Analyse de valeur de rachat de pension" },
  { id: "mentorship", labelEn: "Independent practice mentorship (LLQP)", labelFr: "Mentorat de pratique indépendante (PAAP)" },
  { id: "other", labelEn: "Other financial question", labelFr: "Autre question financière" },
];

export const ContactPage: React.FC = () => {
  const { language, isFr } = useLanguage();
  const prefix = isFr ? "/fr" : "";
  const [searchParams] = useSearchParams();
  const topicParam = searchParams.get("topic") || "";

  // Find prefilled topic from URL, defaulting cleanly to general enquiry
  const initialTopic = TOPIC_OPTIONS.some((t) => t.id === topicParam)
    ? topicParam
    : "general";

  const [formLoadedAt] = useState<number>(() => Date.now());
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [province, setProvince] = useState("");
  const [topic, setTopic] = useState(initialTopic);
  const [message, setMessage] = useState("");
  const [consentEducational, setConsentEducational] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
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

  useEffect(() => {
    if (Object.keys(fieldErrors).length > 0) {
      errorSummaryRef.current?.focus();
    }
  }, [fieldErrors]);

  const sanitizeInput = (val: string): string => {
    return val
      .replace(/\0/g, "")
      .replace(/[<>]/g, "")
      .trim();
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    const cleanFirst = sanitizeInput(firstName);
    const cleanEmail = sanitizeInput(email);
    const cleanPhone = sanitizeInput(phone);

    const unicodeNameRegex = /^[\p{L}\p{M}\s'’‘.-]{1,80}$/u;
    if (cleanFirst.length > 80) {
      errors.firstName = isFr ? "Le prénom doit comporter moins de 80 caractères." : "First name must be under 80 characters.";
    } else if (cleanFirst && !unicodeNameRegex.test(cleanFirst)) {
      errors.firstName = isFr ? "Le prénom contient des caractères non autorisés." : "First name contains invalid characters.";
    }

    if (!cleanEmail) {
      errors.email = isFr ? "Veuillez indiquer votre adresse courriel." : "Please provide your email address.";
    } else if (cleanEmail.length > 100) {
      errors.email = isFr ? "L'adresse courriel doit comporter moins de 100 caractères." : "Email address must be under 100 characters.";
    } else if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/.test(cleanEmail)) {
      errors.email = isFr ? "Veuillez entrer une adresse courriel valide." : "Please enter a valid email address.";
    }

    if (cleanPhone && !/^[0-9+\-()\s]{7,25}$/.test(cleanPhone)) {
      errors.phone = isFr ? "Format de téléphone invalide (ou laissez vide)." : "Please enter a valid phone number or leave blank.";
    }

    if (province && !PROVINCES_AND_TERRITORIES.includes(province)) {
      errors.province = isFr ? "Veuillez sélectionner une province valide ou laisser optionnel." : "Please select a valid province or leave optional.";
    }

    if (message.length > 1500) {
      errors.message = isFr ? "Le message ne doit pas dépasser 1 500 caractères." : "Message must not exceed 1,500 characters.";
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setStatus("submitting");

    const generatedRef = "ENQ-" + Math.floor(100000 + Math.random() * 900000);
    const resolvedTopic = topic && TOPIC_OPTIONS.some((t) => t.id === topic) ? topic : "general";

    // Dispatch directly to Server Backend (/api/contact)
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: sanitizeInput(firstName) || "Reader",
          email: sanitizeInput(email),
          phone: sanitizeInput(phone),
          province: province || "National (Canada & US)",
          topic: resolvedTopic,
          message: sanitizeInput(message),
          consentPrivacy: true,
          consentEducational,
          honeypot,
          website_hp: honeypot,
          turnstileToken,
          formLoadedAt,
          referenceNo: generatedRef,
          language: isFr ? "fr" : "en",
          source: "contact_form",
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setErrorMessage(
          data.message ||
            (isFr
              ? `Impossible d'envoyer votre message pour le moment. Vous pouvez joindre Ahmed Bello directement par téléphone au ${siteConfig.publicPhone} ou réserver en ligne : ${siteConfig.schedulingUrl}`
              : `Unable to submit right now. Please reach out directly to Ahmed Bello at ${siteConfig.publicPhone} or book online: ${siteConfig.schedulingUrl}`)
        );
        setStatus("error");
        return;
      }

      setStatus("success");
      trackLeadSubmit(topic);
    } catch {
      setStatus("error");
      setErrorMessage(
        isFr
          ? `Problème de connexion réseau. Veuillez joindre Ahmed Bello directement au ${siteConfig.publicPhone} ou réserver en ligne : ${siteConfig.schedulingUrl}`
          : `Network connection issue. Please contact Ahmed Bello directly at ${siteConfig.publicPhone} or book online: ${siteConfig.schedulingUrl}`
      );
    }
  };

  return (
    <div>
      <SEO
        title={isFr ? "Démarrer une Conversation | Ahmed Bello" : "Start a Conversation | Ahmed Bello"}
        description={
          isFr
            ? "Échangez directement avec Ahmed Bello sur vos comptes CELI, REER, CELIAPP, votre protection ou votre hypothèque, avec des réponses claires."
            : "Send a financial question directly to Ahmed Bello on TFSA, RRSP, FHSA, income protection, or mortgage renewals with clear, plain-language answers."
        }
        canonicalUrl={isFr ? "/fr/contact" : "/contact"}
      />

      {/* Header */}
      <section className="section border-b border-[#d6cebd]">
        <div className="wrap max-w-4xl space-y-4">
          <span className="eyebrow text-xs">
            {isFr ? "Démarrer une conversation" : "Start a conversation"}
          </span>
          <h1 className="h1 text-[#1c1b18] leading-tight">
            {isFr
              ? "Quelle question financière souhaitez-vous éclaircir ?"
              : "What financial question is on your mind?"}
          </h1>
          <p className="lede measure">
            {isFr
              ? "Partagez ce que vous essayez de comprendre, et nous identifierons ensemble la démarche la plus pertinente."
              : "Tell me a little about what you are trying to understand, and we can determine an appropriate next step."}
          </p>
        </div>
      </section>

      {/* Main Grid: Info (Left) + Form (Right) */}
      <section className="section">
        <div className="wrap max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column: Context, What happens next, Don't send */}
            <aside className="lg:col-span-5 space-y-8 order-2 lg:order-1">
              {/* Direct Advisor Reassurance Card */}
              <div className="card-editorial p-5 space-y-4">
                <div className="flex items-center gap-4">
                  <Portrait variant="avatar" alt="Ahmed Bello" loading="eager" />
                  <div>
                    <span className="eyebrow text-[0.65rem] text-[#75581f] block">
                      {isFr ? "Consultation Directe" : "Direct Consultation"}
                    </span>
                    <p className="font-serif text-lg text-[#1c1b18] leading-tight mt-0.5">Ahmed Bello</p>
                    <p className="text-[0.72rem] text-[#46423a] font-medium leading-tight mt-0.5">
                      {siteConfig.designation}
                    </p>
                    <p className="text-[0.7rem] text-[#2e4a3b] font-semibold mt-1">
                      {isFr
                        ? "Cabinet Financier Indépendant • Canada"
                        : "Independent Financial Practice • Canada"}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-[#46423a] leading-relaxed border-t border-[#d6cebd] pt-3">
                  {isFr
                    ? "« Chaque demande envoyée via ce formulaire est reçue et examinée directement par moi-même. Vous recevrez une réponse éducative et factuelle basée sur les règles officielles. »"
                    : "“Every enquiry sent through this form is received and reviewed directly by me. You will receive an educational, evidence-based response grounded in official Canadian rules.”"}
                </p>
              </div>

            {/* What happens next - Detailed Journey */}
            <div className="p-6 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] space-y-5">
              <div className="flex items-center gap-2">
                <span className="eyebrow text-xs text-[#75581f]">
                  {isFr ? "Déroulement de la démarche" : "Submission Journey"}
                </span>
              </div>
              <h2 className="font-serif text-xl text-[#1c1b18]">
                {isFr
                  ? "Que se passe-t-il après l'envoi de ce formulaire ?"
                  : "What happens when you submit this form?"}
              </h2>

              <ol className="space-y-4 text-xs text-[#46423a] list-none p-0">
                <li className="flex items-start gap-3">
                  <span className="tabular-nums text-[#2e4a3b] font-semibold bg-[#f7f3eb] px-1.5 py-0.5 border border-[#d6cebd] rounded-[2px]">
                    01
                  </span>
                  <div>
                    <strong className="text-[#1c1b18] block mb-0.5">
                      {isFr ? "Transmission sécurisée et chiffrée" : "Automated Validation & Secure Routing"}
                    </strong>
                    <span>
                      {isFr
                        ? "Votre message est immédiatement assaini et transmis via protocole HTTPS sécurisé directement dans ma boîte de réception. Aucune revente de données."
                        : "Your submission is immediately sanitized against malicious injection and transmitted via encrypted HTTPS directly to Ahmed’s secure Canadian inbox."}
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="tabular-nums text-[#2e4a3b] font-semibold bg-[#f7f3eb] px-1.5 py-0.5 border border-[#d6cebd] rounded-[2px]">
                    02
                  </span>
                  <div>
                    <strong className="text-[#1c1b18] block mb-0.5">
                      {isFr ? "Examen personnel par Ahmed (1 à 2 jours)" : "Personal Review by Ahmed (1–2 Business Days)"}
                    </strong>
                    <span>
                      {isFr
                        ? "Je lis personnellement votre message, examine votre sujet (CELI/REER, protection, nouveaux arrivants) et prépare une première réponse factuelle."
                        : "Ahmed personally reads your message, examines your stated topic (e.g. TFSA/RRSP, income protection, newcomer rules), and prepares an evidence-based initial response."}
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="tabular-nums text-[#2e4a3b] font-semibold bg-[#f7f3eb] px-1.5 py-0.5 border border-[#d6cebd] rounded-[2px]">
                    03
                  </span>
                  <div>
                    <strong className="text-[#1c1b18] block mb-0.5">
                      {isFr ? "Prochaines étapes axées sur la clarté" : "Clarity-First Next Steps"}
                    </strong>
                    <span>
                      {isFr
                        ? `Si pertinent, je vous proposerai un appel gratuit de ${siteConfig.callDurationMinutes} minutes ou vous orienterai vers un spécialiste (CPA, syndic). Vous décidez de la suite.`
                        : `You receive a thoughtful response. If appropriate, we can set up a free ${siteConfig.callDurationMinutes}-minute call or refer you to an external specialist (e.g. CPA, LIT).`}
                    </span>
                  </div>
                </li>
              </ol>

              <div className="pt-3 border-t border-[#ece6da] flex items-center justify-between text-[0.75rem] text-[#625d52]">
                <span>{isFr ? "Aucune séquence de vente automatisée" : "No automated marketing sequences"}</span>
                <span className="font-semibold text-[#2e4a3b]">
                  {isFr ? "Réponse directe" : "Direct response"}
                </span>
              </div>
            </div>

            {/* Please don't send */}
            <div className="p-6 bg-[#f7f3eb] border border-[#8f2a1d]/35 rounded-[2px] space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8f2a1d]">
                {isFr ? "Veuillez ne pas transmettre" : "Please don’t send"}
              </h3>
              <p className="text-xs text-[#46423a] leading-relaxed">
                {isFr
                  ? "Vos numéros de compte bancaire, numéro d'assurance sociale (NAS), pièces d'identité ou détails médicaux confidentiels. Un formulaire web n'est pas conçu pour ces éléments ; je vous indiquerai la méthode sécurisée si nécessaire."
                  : "Account numbers, your Social Insurance Number (SIN) or other government ID numbers, medical details, or financial documents. A website form is not the place for them."}
              </p>
            </div>

            {/* Direct Contact info */}
            <div className="p-6 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] space-y-3 text-xs text-[#46423a]">
              <h3 className="font-semibold text-xs uppercase tracking-wider text-[#75581f]">
                {isFr ? "Coordonnées Directes" : "Direct Contact"}
              </h3>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#2e4a3b]" />
                <a href={`mailto:${siteConfig.publicEmail}`} className="underline text-[#2e4a3b] font-medium">
                  {siteConfig.publicEmail}
                </a>
              </p>
              {siteConfig.publicPhone && (
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#2e4a3b]" />
                  <a href={`tel:${siteConfig.publicPhone.replace(/\s+/g, "")}`} className="underline text-[#2e4a3b] font-medium">
                    {siteConfig.publicPhone}
                  </a>
                </p>
              )}
            </div>
          </aside>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            {/* Direct Calendly Booking Invitation Banner */}
            {siteConfig.schedulingUrl && (
              <div className="mb-6 p-4 sm:p-5 bg-[#2e4a3b]/5 border border-[#2e4a3b]/25 rounded-[2px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-[2px] bg-[#2e4a3b] text-[#f7f3eb] flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                    <Calendar className="w-4 h-4 text-[#d6c298]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#1c1b18]">
                      {isFr ? "Vous préférez réserver directement un créneau ?" : "Prefer to book a time directly?"}
                    </h3>
                    <p className="text-xs text-[#46423a] mt-0.5">
                      {isFr
                        ? `Planifiez un appel gratuit de ${siteConfig.callDurationMinutes} minutes directement sur l'agenda d'Ahmed.`
                        : `Schedule a free ${siteConfig.callDurationMinutes}-minute conversation directly on Ahmed's calendar.`}
                    </p>
                  </div>
                </div>
                <a
                  href={siteConfig.schedulingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackBookingClick("contact_page")}
                  className="btn btn-primary text-xs py-2 px-4 whitespace-nowrap self-stretch sm:self-auto text-center inline-flex items-center justify-center gap-1.5"
                >
                  <span>{getCtaLabel(isFr)}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#d6c298]" />
                </a>
              </div>
            )}

            {/* Success State */}
            {status === "success" ? (
              <div
                tabIndex={-1}
                className="card-editorial border-[#2e4a3b] p-6 sm:p-8 space-y-6"
              >
                <div className="flex items-center gap-3 text-[#2e4a3b] pb-4 border-b border-[#d6cebd]">
                  <div className="w-10 h-10 rounded-[2px] bg-[#2e4a3b]/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-[#2e4a3b]" />
                  </div>
                  <div>
                    <span className="eyebrow text-[0.65rem] text-[#75581f] block">
                      {isFr ? "Demande Confirmée" : "Enquiry Confirmed"}
                    </span>
                    <h2 className="h3 text-[#2e4a3b] text-xl sm:text-2xl font-serif">
                      {isFr
                        ? firstName.trim()
                          ? `Merci, ${firstName.trim()} : Votre message a été transmis`
                          : "Merci : Votre message a été transmis"
                        : firstName.trim()
                        ? `Thank You, ${firstName.trim()}: Your Message Was Sent`
                        : "Thank You: Your Message Was Sent"}
                    </h2>
                  </div>
                </div>

                <div className="p-4 bg-[#2e4a3b]/10 border border-[#2e4a3b]/25 rounded-[2px] flex items-start gap-3">
                  <MailCheck className="w-5 h-5 text-[#2e4a3b] shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-[#1c1b18] leading-relaxed">
                    {isFr
                      ? `${firstName.trim() ? `Merci, ${firstName.trim()}. ` : ""}Votre demande a été reçue en toute sécurité. Ahmed Bello examine personnellement les questions entrantes et vous répondra avec des explications factuelles d'ici 1 à 2 jours ouvrables.`
                      : `${firstName.trim() ? `Thank you, ${firstName.trim()}. ` : ""}Your enquiry has been received securely. Ahmed Bello personally reviews incoming questions and will follow up with objective educational insights within 1–2 business days.`}
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs uppercase tracking-wider font-semibold text-[#1c1b18] flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#75581f]" />
                    <span>{isFr ? "Prochaines étapes" : "What happens next"}</span>
                  </h3>
                  <div className="space-y-2 text-xs sm:text-sm text-[#46423a]">
                    <div className="p-3 bg-[#f7f3eb] border border-[#d6cebd] rounded-[2px]">
                      <strong className="text-[#1c1b18] block mb-0.5">
                        {isFr ? "Étape 1 : Examen du sujet" : "Step 1: Personal Review"}
                      </strong>
                      <span>
                        {isFr
                          ? "J'examine votre note et évalue les règles canadiennes ou repères de bilan applicables."
                          : "I personally review your note and evaluate the relevant Canadian rules or balance-sheet considerations."}
                      </span>
                    </div>

                    <div className="p-3 bg-[#f7f3eb] border border-[#d6cebd] rounded-[2px]">
                      <strong className="text-[#1c1b18] block mb-0.5">
                        {isFr ? "Étape 2 : Réponse personnalisée" : "Step 2: Direct Response Within 1–2 Days"}
                      </strong>
                      <span>
                        {isFr
                          ? "Vous recevrez une réponse éducative par courriel axée sur vos chiffres et les règles officielles."
                          : "You will receive an educational, factual answer by email focused on your numbers and official rules."}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 flex flex-wrap items-center gap-4 text-xs">
                  <Link to={`${prefix}/education`} className="text-[#2e4a3b] font-semibold hover:underline">
                    {isFr ? "← Parcourir la bibliothèque éducative" : "← Explore the Education Library"}
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setStatus("idle");
                      setMessage("");
                    }}
                    className="text-[#625d52] hover:text-[#1c1b18] underline ml-auto cursor-pointer"
                  >
                    {isFr ? "Envoyer un autre message" : "Send another message"}
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="p-6 md:p-8 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] space-y-6 shadow-xs"
              >
                {/* Honeypot hidden input */}
                <input
                  type="text"
                  name="website_hp"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="hidden"
                />

                {/* Accessible Error Summary */}
                {Object.keys(fieldErrors).length > 0 && (
                  <div
                    ref={errorSummaryRef}
                    tabIndex={-1}
                    role="alert"
                    className="p-4 bg-[#fbe7a1]/40 border border-[#8f2a1d] rounded-[2px] text-xs space-y-2 focus:outline-none"
                  >
                    <div className="flex items-center gap-2 text-[#8f2a1d] font-semibold text-sm">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>
                        {isFr
                          ? "Veuillez corriger les erreurs avant d'envoyer :"
                          : "Please correct the errors before submitting:"}
                      </span>
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

                {/* Server Error Message */}
                {status === "error" && errorMessage && (
                  <div
                    role="alert"
                    className="p-4 bg-[#8f2a1d]/10 border border-[#8f2a1d] text-[#8f2a1d] rounded-[2px] text-xs font-medium space-y-2"
                  >
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-[#8f2a1d] mt-0.5" />
                      <p className="leading-relaxed">{errorMessage}</p>
                    </div>
                  </div>
                )}

                {/* Email (Required) & First Name (Optional) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="field-email" className="block text-xs font-semibold text-[#1c1b18] mb-1">
                      {isFr ? "Adresse courriel *" : "Email address *"}
                    </label>
                    <input
                      id="field-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={isFr ? "nom@exemple.ca" : "name@example.ca"}
                      className={`w-full text-xs p-2.5 bg-white border rounded-[2px] focus:outline-none ${
                        fieldErrors.email ? "border-[#8f2a1d]" : "border-[#d6cebd] focus:border-[#2e4a3b]"
                      }`}
                    />
                  </div>

                  <div>
                    <label htmlFor="field-firstName" className="block text-xs font-semibold text-[#1c1b18] mb-1">
                      {isFr ? "Prénom (optionnel)" : "First name (optional)"}
                    </label>
                    <input
                      id="field-firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder={isFr ? "ex. Sarah ou Jean" : "e.g. Sarah or Michael"}
                      className={`w-full text-xs p-2.5 bg-white border rounded-[2px] focus:outline-none ${
                        fieldErrors.firstName ? "border-[#8f2a1d]" : "border-[#d6cebd] focus:border-[#2e4a3b]"
                      }`}
                    />
                  </div>
                </div>

                {/* Message Textarea (Primary Prompt) */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label htmlFor="field-message" className="text-xs font-semibold text-[#1c1b18]">
                      {isFr ? "Votre question ou message" : "Your question or message"}
                    </label>
                    <span className="text-[0.7rem] text-[#625d52]">
                      {message.length} / 1500
                    </span>
                  </div>
                  <textarea
                    id="field-message"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={
                      isFr
                        ? "Décrivez brièvement ce que vous souhaitez éclaircir..."
                        : "Describe what you are trying to figure out or understand..."
                    }
                    className="w-full text-xs p-2.5 bg-white border border-[#d6cebd] rounded-[2px] focus:outline-none focus:border-[#2e4a3b]"
                  />
                </div>

                {/* Optional Context Fields (Topic, Province, Phone) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                  <div>
                    <label htmlFor="field-topic" className="block text-xs font-semibold text-[#46423a] mb-1">
                      {isFr ? "Sujet (optionnel)" : "Topic (optional)"}
                    </label>
                    <select
                      id="field-topic"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="w-full text-xs p-2.5 bg-white border border-[#d6cebd] rounded-[2px] focus:outline-none focus:border-[#2e4a3b]"
                    >
                      {TOPIC_OPTIONS.map((t) => (
                        <option key={t.id} value={t.id}>
                          {isFr ? t.labelFr : t.labelEn}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="field-province" className="block text-xs font-semibold text-[#46423a] mb-1">
                      {isFr ? "Province (optionnel)" : "Province (optional)"}
                    </label>
                    <select
                      id="field-province"
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      className={`w-full text-xs p-2.5 bg-white border rounded-[2px] focus:outline-none ${
                        fieldErrors.province ? "border-[#8f2a1d]" : "border-[#d6cebd] focus:border-[#2e4a3b]"
                      }`}
                    >
                      <option value="">{isFr ? "Partout au Canada" : "Anywhere in Canada"}</option>
                      {PROVINCES_AND_TERRITORIES.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="field-phone" className="block text-xs font-semibold text-[#46423a] mb-1">
                      {isFr ? "Téléphone (optionnel)" : "Phone (optional)"}
                    </label>
                    <input
                      id="field-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1-506-000-0000"
                      className="w-full text-xs p-2.5 bg-white border border-[#d6cebd] rounded-[2px] focus:outline-none focus:border-[#2e4a3b]"
                    />
                  </div>
                </div>

                {/* Turnstile Widget (renders silently or verifies if production key is set) */}
                <TurnstileWidget onVerify={(token) => setTurnstileToken(token)} />

                {/* Optional Educational Briefing Opt-in + Clear Privacy Notice */}
                <div className="space-y-3 pt-2 border-t border-[#ece6da]">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consentEducational}
                      onChange={(e) => setConsentEducational(e.target.checked)}
                      className="mt-0.5 accent-[#2e4a3b]"
                    />
                    <span className="text-xs text-[#46423a] leading-relaxed">
                      {isFr
                        ? "Optionnel : Envoyez-moi aussi les résumés ponctuels lors de changements des règles fiscales canadiennes (désabonnement en 1 clic)."
                        : "Optional: Also send me occasional plain-language updates when Canadian tax rules or registered account limits change (unsubscribe anytime)."}
                    </span>
                  </label>

                  <p className="text-[0.72rem] text-[#625d52] flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#2e4a3b] shrink-0" />
                    <span>
                      {isFr ? (
                        <>
                          En envoyant ce message, vous acceptez qu'il soit utilisé pour vous répondre selon notre{" "}
                          <Link to="/fr/privacy" className="underline text-[#2e4a3b]">
                            avis de confidentialité
                          </Link>
                          .
                        </>
                      ) : (
                        <>
                          By sending this question, you agree we may use your details to reply in accordance with our{" "}
                          <Link to="/privacy" className="underline text-[#2e4a3b]">
                            privacy notice
                          </Link>
                          .
                        </>
                      )}
                    </span>
                  </p>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="btn btn-primary text-xs sm:text-sm py-3 px-8 w-full sm:w-auto text-center font-medium shadow-xs cursor-pointer"
                  >
                    {status === "submitting"
                      ? isFr
                        ? "Envoi en cours..."
                        : "Sending enquiry..."
                      : isFr
                      ? "Envoyer ma question à Ahmed →"
                      : "Send Question to Ahmed →"}
                  </button>
                </div>
              </form>
            )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
