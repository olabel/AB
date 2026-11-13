import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  Award,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Users,
  Calendar,
  ArrowUpRight,
  Clock,
  Briefcase,
  HelpCircle,
  Send,
  Check,
  ChevronRight,
  Phone,
  Mail,
  Compass,
  Building,
  Target,
  Globe2,
  Layers,
  BarChart3,
  BookOpen,
} from "lucide-react";
import { siteConfig } from "../config/site.ts";
import { BrandMark } from "../components/BrandMark.tsx";
import { SEO } from "../components/SEO.tsx";
import { useLanguage } from "../context/LanguageContext.tsx";
import { trackBookingClick, trackLeadSubmit } from "../lib/track.ts";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  jurisdiction: string;
  licensingStatus: string;
  availability: string;
  background: string;
  message: string;
  consentPrivacy: boolean;
  honeypot: string;
}

const CANADIAN_PROVINCES = [
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

const US_REGIONS = [
  "United States — Northeast",
  "United States — Southeast",
  "United States — Midwest",
  "United States — Southwest",
  "United States — West Coast",
  "United States — Other State",
];

export const CareersPage: React.FC = () => {
  const { language } = useLanguage();
  const isFr = language === "fr";

  // Form State
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "Canada",
    jurisdiction: "New Brunswick",
    licensingStatus: "not_licensed",
    availability: "part_time",
    background: "",
    message: "",
    consentPrivacy: false,
    honeypot: "",
  });

  const [formLoadedAt] = useState<number>(() => Date.now());
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Interactive Architecture Simulation Tab
  const [activeTab, setActiveTab] = useState<"architecture" | "progression" | "compensation">("architecture");

  // Interactive Quiz State
  const [quizCountry, setQuizCountry] = useState<string>("Canada");
  const [quizStatus, setQuizStatus] = useState<string>("studying");
  const [quizTime, setQuizTime] = useState<string>("part_time");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => {
        const next = { ...prev, [name]: value };
        if (name === "country") {
          next.jurisdiction = value === "Canada" ? "New Brunswick" : "United States — Northeast";
        }
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.firstName.trim()) {
      setErrorMessage(isFr ? "Veuillez indiquer votre prénom." : "Please provide your first name.");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setErrorMessage(isFr ? "Veuillez indiquer une adresse courriel valide." : "Please provide a valid email address.");
      return;
    }
    if (!formData.consentPrivacy) {
      setErrorMessage(isFr ? "Veuillez accepter l'avis de confidentialité pour continuer." : "Please accept the privacy notice to proceed.");
      return;
    }

    setSubmitting(true);
    const generatedRef = "APP-" + Math.floor(100000 + Math.random() * 900000);

    const detailedMessage = `
Candidate Application Details:
- Full Name: ${formData.firstName} ${formData.lastName}
- Country: ${formData.country}
- Province / State / Region: ${formData.jurisdiction}
- Licensing Status: ${formData.licensingStatus}
- Availability: ${formData.availability}
- Current Career / Background: ${formData.background || "Not specified"}
- Motivation & Goals: ${formData.message || "Ready to learn"}
    `.trim();

    // Dispatch directly to authenticated server backend (/api/contact)
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          phone: formData.phone,
          province: formData.jurisdiction,
          topic: "mentorship",
          message: detailedMessage,
          consentPrivacy: formData.consentPrivacy,
          consentEducational: true,
          honeypot: formData.honeypot,
          formLoadedAt,
          referenceNo: generatedRef,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message ||
            (isFr
              ? "Impossible de transmettre votre candidature pour le moment. Veuillez contacter Ahmed Bello directement au +1-506-899-4941 ou réserver via Calendly : https://calendly.com/olabel/30min"
              : "Unable to submit application right now. Please reach out to Ahmed Bello directly at +1-506-899-4941 or book via Calendly: https://calendly.com/olabel/30min")
        );
      }

      trackLeadSubmit("mentorship");
      setSubmitSuccess(true);
    } catch (err: any) {
      setErrorMessage(
        err.message ||
          (isFr
            ? "Une erreur inattendue s'est produite. Veuillez contacter Ahmed Bello au +1-506-899-4941 ou prendre rendez-vous sur Calendly : https://calendly.com/olabel/30min"
            : "An unexpected error occurred. Please contact Ahmed Bello directly at +1-506-899-4941 or schedule via Calendly: https://calendly.com/olabel/30min")
      );
    } finally {
      setSubmitting(false);
    }
  };

  const faqs = isFr
    ? [
        {
          q: "Que signifie « mentorat de pratique professionnelle » ? Y a-t-il des frais cachés ?",
          a: "Aucun frais de scolarité ni frais de bureau n'est facturé par notre programme de mentorat. Notre programme d'études, nos guides de préparation et notre accompagnement 1-à-1 sur le terrain sont offerts sans aucun droit de franchise ni abonnement mensuel. Les seuls débours à prévoir sont les droits officiels d'inscription aux examens et d'immatriculation professionnelle payés directement aux régulateurs provinciaux (cours du PAAP/LLQP au Canada) ou aux départements d'assurance d'État (aux États-Unis).",
        },
        {
          q: "Ce mentorat couvre-t-il à la fois le Canada et les États-Unis ?",
          a: "Oui. Notre cabinet indépendant et notre infrastructure de mentorat professionnel opèrent dans les 10 provinces et 3 territoires canadiens ainsi qu'à travers les États-Unis. Que vous prépariez le PAAP/LLQP canadien ou les licences d'assurance vie et santé aux É.-U., nous assurons le parrainage réglementaire, les plans d'études et l'accès direct aux assureurs.",
        },
        {
          q: "Faut-il détenir un diplôme préalable en finance, économie ou comptabilité ?",
          a: "Aucun diplôme spécifique en finance n'est requis. De nombreux conseillers indépendants accomplis viennent de l'enseignement, du secteur de la santé, de l'ingénierie, de la gestion ou des services à la clientèle. Les qualités déterminantes sont l'éthique personnelle, la soif d'apprendre, la rigueur de travail et la volonté sincère d'accompagner les familles dans leurs décisions patrimoniales.",
        },
        {
          q: "Puis-je débuter à temps partiel tout en conservant mon emploi actuel ?",
          a: "Oui, tout à fait. La majorité des candidats commencent par préparer leurs examens d'agrément provincial en soirée et les fins de semaine tout en poursuivant leur emploi principal. Une fois agréés par leur régulateur provincial, ils co-planifient leurs premiers dossiers avec des professionnels d'expérience pour bâtir leur pratique en toute sécurité.",
        },
        {
          q: "Comment fonctionne la rémunération d'un professionnel indépendant ?",
          a: "Dès l'obtention de son permis d'exercice, le professionnel indépendant bénéficie de contrats directs auprès des institutions financières et assureurs partenaires. La rémunération découle directement de la mise en place et du suivi des dossiers clients, sans aucun quota arbitraire imposé par une succursale locale.",
        },
        {
          q: "Combien coûtent les examens réglementaires officiels ?",
          a: "Les frais d'examen varient légèrement selon la province de résidence et sont réglés directement auprès du régulateur provincial ou de l'organisme agréé (environ 150 $ à 300 $ CA au total pour le PAAP). Notre mentorat vous fournit le cadre d'études, les révisions et les tests d'entraînement sans facturation supplémentaire.",
        },
      ]
    : [
        {
          q: "What does 'Professional Practice Mentorship' mean? Are there hidden fees?",
          a: "No tuition or desk fees are charged by our mentorship program. Our practice curriculum, study guidance, and 1-on-1 field co-planning are provided without franchise startup dues or monthly desk fees. You do not pay us fees for mentorship. The only out-of-pocket costs are the official regulatory licensing exam and registration fees, which candidates pay directly to the provincial regulator (LLQP in Canada) or state insurance department (in the US).",
        },
        {
          q: "Does this mentorship cover both Canada and the United States?",
          a: "Yes. Our independent agency platform and professional mentorship infrastructure operate across Canada (all 10 provinces and 3 territories) and throughout the United States. Whether you are seeking Canadian LLQP licensing or US state Life & Health insurance credentials, we provide regulatory sponsorship, study modules, and carrier contracting.",
        },
        {
          q: "Do I need a prior degree in finance, economics, or math?",
          a: "No prior financial background is necessary. Successful independent agents frequently transition from teaching, healthcare, engineering, logistics, customer relations, or management. What is essential is personal integrity, coachability, a disciplined work ethic, and a genuine care for helping families make intentional financial decisions.",
        },
        {
          q: "Can I begin part-time while keeping my current career?",
          a: "Yes. Many candidates begin by studying for their provincial licensing exams during evenings and weekends while maintaining their existing employment. Once provincially licensed, individuals can co-plan client cases with senior professionals as they develop their practice.",
        },
        {
          q: "How does compensation work for an independent agent?",
          a: "Independent financial solutions professionals operate under a contracted carrier compensation model through World Financial Group Insurance Agency of Canada Inc. (WFGIA), receiving commission-based compensation from Canadian financial and insurance institutions upon product placement and policy servicing. Compensation reflects licensing, professional effort, and client decisions, without hidden fees.",
        },
        {
          q: "How much do the regulatory licensing exams cost?",
          a: "Exam fees vary slightly by province and are paid directly to the provincial regulatory authority or accredited testing provider (such as the provincial insurance councils in Canada, typically $150 to $300 CAD total). Our mentorship provides study guidance and practice sessions to help prepare you for your exams.",
        },
      ];

  return (
    <div className="py-10 lg:py-16">
      <SEO
        title={isFr ? "Expansion du Cabinet & Carrières | Ahmed Bello" : "Practice Expansion & Careers | Ahmed Bello"}
        description={
          isFr
            ? "Programme de mentorat pour le cours du PAAP/LLQP et formation pour professionnels indépendants en solutions financières au Canada."
            : "Mentorship and licensing support for aspiring independent financial solutions professionals in Canada. LLQP preparation and practice development."
        }
        canonicalUrl={isFr ? "/fr/careers" : "/careers"}
        jsonLd={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "EducationalOccupationalProgram",
              "@id": `${siteConfig.siteUrl}${isFr ? "/fr" : ""}/careers#program`,
              inLanguage: isFr ? "fr-CA" : "en-CA",
              name: isFr
                ? "Mentorat de Pratique Indépendante en Solutions Financières"
                : "Independent Financial Solutions Practice Mentorship",
              description: isFr
                ? "Accompagnement complet pour les examens provinciaux du PAAP/LLQP, co-planification pratique et mentorat de carrière avec Ahmed Bello."
                : "Comprehensive study support for Canadian provincial LLQP exams, practical file co-planning, and career mentorship with Ahmed Bello.",
              provider: {
                "@type": "Person",
                name: "Ahmed Bello",
                jobTitle: "Licensed Financial Solutions Professional",
                url: siteConfig.siteUrl,
              },
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "CAD",
                category: "Educational Mentorship",
              },
              occupationalCategory: "Licensed Financial Solutions Professional",
              educationalProgramMode: "Hybrid / Remote",
              timeToComplete: "P3M",
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: isFr ? "Accueil" : "Home",
                  item: isFr ? `${siteConfig.siteUrl}/fr` : `${siteConfig.siteUrl}/`,
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: isFr ? "Carrières & Mentorat" : "Practice Expansion & Careers",
                  item: `${siteConfig.siteUrl}${isFr ? "/fr" : ""}/careers`,
                },
              ],
            },
          ],
        }}
      />

      <div className="wrap">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-[#625d52]">
          <ol className="flex items-center gap-2 list-none p-0">
            <li>
              <Link to={isFr ? "/fr" : "/"} className="hover:text-[#2e4a3b] transition-colors">
                {isFr ? "Accueil" : "Home"}
              </Link>
            </li>
            <li aria-hidden="true">&rsaquo;</li>
            <li className="text-[#1c1b18] font-medium">
              {isFr ? "Carrières & Mentorat (Canada & É.-U.)" : "Careers & Mentorship (Canada & USA)"}
            </li>
          </ol>
        </nav>

        {/* Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pb-16 border-b border-[#d6cebd]">
          <div className="lg:col-span-7 flex flex-col gap-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#2e4a3b]/10 text-[#2e4a3b] border border-[#2e4a3b]/25 rounded-[2px] w-fit text-xs font-semibold uppercase tracking-wider">
              <GraduationCap className="w-3.5 h-3.5 text-[#75581f]" />
              <span>
                {isFr
                  ? "Mentorat de Pratique Indépendante • Canada & É.-U. • Préparation Complète au Titre"
                  : "Independent Practice Mentorship • Canada & USA • Full Licensing Support"}
              </span>
            </div>

            <h1
              className="font-serif text-4xl sm:text-5xl lg:text-[3.5rem] leading-[1.1] text-[#1c1b18] tracking-tight"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {isFr
                ? "Devenez professionnel indépendant en solutions financières au Canada & aux É.-U."
                : "Become an Independent Financial Professional in Canada & the USA."}
            </h1>

            <p className="text-lg sm:text-xl text-[#46423a] leading-relaxed">
              {isFr ? (
                <>
                  Bâtissez un cabinet indépendant, durable et à forte valeur ajoutée. Bénéficiez d'un{" "}
                  <strong className="text-[#1c1b18] font-semibold">
                    mentorat individuel 1-à-1, d'une formation rigoureuse et d'un accompagnement complet aux examens réglementaires
                  </strong>{" "}
                  avec Ahmed Bello. Aucun frais de scolarité ni de bureau exigé par notre programme de mentorat, des partenariats ouverts multicarriers et une maîtrise totale de votre calendrier.
                </>
              ) : (
                <>
                  Build an authentic, high-impact financial practice you own. Receive{" "}
                  <strong className="text-[#1c1b18] font-semibold">
                    1-on-1 mentorship, comprehensive training, and regulatory licensing support
                  </strong>{" "}
                  with Ahmed Bello. No tuition or desk fees charged by our mentorship program, open-carrier solutions, and total autonomy over your calendar.
                </>
              )}
            </p>

            {/* Quick Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] text-center">
                <div className="text-xs text-[#625d52]">{isFr ? "Coût du programme" : "Program Cost"}</div>
                <div className="text-sm font-semibold text-[#2e4a3b] mt-0.5">
                  {isFr ? "Aucun frais exigé" : "No Tuition or Desk Fees"}
                </div>
              </div>
              <div className="p-3 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] text-center">
                <div className="text-xs text-[#625d52]">{isFr ? "Examen réglementaire" : "Licensing Exam"}</div>
                <div className="text-sm font-semibold text-[#1c1b18] mt-0.5">
                  {isFr ? "Payé au régulateur*" : "Exam Paid to Govt*"}
                </div>
              </div>
              <div className="p-3 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] text-center">
                <div className="text-xs text-[#625d52]">{isFr ? "Formule horaire" : "Time Model"}</div>
                <div className="text-sm font-semibold text-[#1c1b18] mt-0.5">
                  {isFr ? "Temps partiel / Plein" : "Part-Time / Full-Time"}
                </div>
              </div>
              <div className="p-3 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] text-center">
                <div className="text-xs text-[#625d52]">{isFr ? "Territoire" : "Footprint"}</div>
                <div className="text-sm font-semibold text-[#1c1b18] mt-0.5">
                  {isFr ? "Canada & É.-U." : "Canada & USA"}
                </div>
              </div>
            </div>

            <p className="text-xs text-[#625d52] italic">
              {isFr
                ? "*Transparence intégrale : Notre programme de mentorat n'exige aucun droit de franchise ni frais de scolarité. Les candidats acquittent directement leurs droits d'examen officiels auprès des régulateurs provinciaux (cours du PAAP/LLQP) ou d'État. Nous fournissons les plans d'études, les examens blancs et l'accompagnement complet."
                : "*Full transparency: No tuition or desk fees are charged by our mentorship program. Candidates pay their official provincial or state exam/registration fees directly to the regulatory body, and we provide study roadmaps, mock tests, and mentorship support."}
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <a
                href="#apply-form"
                className="btn btn-primary text-center px-6 py-3 text-base font-medium shadow-sm"
              >
                {isFr ? "Postuler au mentorat" : "Apply for Mentorship"}
              </a>
              {siteConfig.schedulingUrl && (
                <a
                  href={siteConfig.schedulingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackBookingClick("careers_hero")}
                  className="btn btn-ghost border border-[#d6cebd] hover:border-[#2e4a3b] text-center px-6 py-3 text-base font-medium inline-flex items-center justify-center gap-2 group"
                >
                  <Calendar className="w-4 h-4 text-[#75581f]" />
                  <span>{isFr ? "Réserver un appel d'orientation (30 min)" : "Schedule 30-Min Discovery Call"}</span>
                  <ArrowUpRight className="w-4 h-4 text-[#75581f] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              )}
            </div>
          </div>

          {/* Unique Hero Visual: Architectural Practice Portal & Ecosystem Blueprint */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md bg-[#14211a] text-[#f7f3eb] border border-[#2e4a3b]/60 p-6 rounded-[2px] shadow-xl relative overflow-hidden">

              {/* Blueprint Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#d6c298]/20">
                <div className="flex items-center gap-2.5">
                  <BrandMark size={28} reversed={true} className="w-7 h-7" />
                  <span className="font-serif text-lg tracking-tight text-[#f7f3eb]">
                    {isFr ? "Architecture du Cabinet" : "Independent Practice Blueprint"}
                  </span>
                </div>
                <span className="text-[0.65rem] uppercase font-bold tracking-widest text-[#d6c298] bg-[#2e4a3b]/60 px-2 py-0.5 rounded-[2px]">
                  CAN &bull; USA
                </span>
              </div>

              {/* Interactive Blueprint Navigation Tabs */}
              <div className="grid grid-cols-3 gap-1.5 pt-4 pb-4">
                {[
                  {
                    id: "architecture",
                    label: isFr ? "Architecture Ouverte" : "Open Architecture",
                  },
                  {
                    id: "progression",
                    label: isFr ? "Plan en 3 étapes" : "3-Stage Roadmap",
                  },
                  {
                    id: "compensation",
                    label: isFr ? "Rémunération & Équité" : "Practice Equity",
                  },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveTab(t.id as any)}
                    className={`py-1.5 px-2 text-[0.7rem] font-semibold rounded-[2px] transition-colors ${
                      activeTab === t.id
                        ? "bg-[#d6c298] text-[#14211a]"
                        : "bg-[#2e4a3b]/30 text-[#ece6da]/80 hover:bg-[#2e4a3b]/50"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Tab 1: Open Architecture Comparison */}
              {activeTab === "architecture" && (
                <div className="space-y-3.5 pt-1 text-xs">
                  <div className="p-3 bg-[#1a2c22] border border-[#2e4a3b] rounded-[2px]">
                    <div className="flex items-center justify-between text-[#d6c298] font-semibold mb-1">
                      <span>{isFr ? "Plateforme Ouverte Multicarriers" : "Multi-Carrier Open Platform"}</span>
                      <ShieldCheck className="w-4 h-4 text-[#d6c298]" />
                    </div>
                    <p className="text-[#ece6da]/80 text-[0.75rem] leading-relaxed">
                      {isFr
                        ? "Accédez aux principaux assureurs-vie et institutions financières de référence au Canada et aux É.-U. Comparez les solutions avec rigueur et objectivité pour chaque famille."
                        : "Access major Canadian life insurers and financial institutions. Compare products objectively to match individual client requirements."}
                    </p>
                  </div>

                  <div className="p-3 bg-[#1a2c22] border border-[#2e4a3b] rounded-[2px]">
                    <div className="flex items-center justify-between text-[#f7f3eb] font-semibold mb-1">
                      <span>{isFr ? "Autonomie et Déontologie Client" : "Client-Focused Autonomy"}</span>
                      <Target className="w-4 h-4 text-[#d6c298]" />
                    </div>
                    <p className="text-[#ece6da]/80 text-[0.75rem] leading-relaxed">
                      {isFr
                        ? "Rémunération transparente basée sur les commissions des assureurs partenaires. Bâtissez votre réputation sur l'éducation financière, l'analyse rigoureuse et des solutions adaptées."
                        : "Transparent carrier-based compensation model. Build your practice on client education, comprehensive analysis, and ethical recommendations."}
                    </p>
                  </div>

                  <div className="p-3 bg-[#1a2c22] border border-[#2e4a3b] rounded-[2px]">
                    <div className="flex items-center justify-between text-[#f7f3eb] font-semibold mb-1">
                      <span>{isFr ? "Envergure Nationale & Interprovinciale" : "National Scalability"}</span>
                      <Globe2 className="w-4 h-4 text-[#d6c298]" />
                    </div>
                    <p className="text-[#ece6da]/80 text-[0.75rem] leading-relaxed">
                      {isFr
                        ? "Développez votre clientèle à travers les provinces et territoires canadiens au fur et à mesure de l'obtention de vos permis d'exercice provinciaux."
                        : "Expand your reach across Canadian provinces and territories as you obtain provincial regulatory licenses."}
                    </p>
                  </div>
                </div>
              )}

              {/* Tab 2: 3-Stage Progression */}
              {activeTab === "progression" && (
                <div className="space-y-3 pt-1 text-xs">
                  <div className="flex items-start gap-3 p-2.5 bg-[#1a2c22] border border-[#d6c298]/30 rounded-[2px]">
                    <span className="font-serif text-[#d6c298] font-bold text-sm">01</span>
                    <div>
                      <div className="font-semibold text-[#f7f3eb]">
                        {isFr ? "Préparation à l'Agrément (PAAP / LLQP)" : "Licensing Preparation (LLQP)"}
                      </div>
                      <p className="text-[0.72rem] text-[#ece6da]/75 mt-0.5">
                        {isFr
                          ? "Plan d'études structuré, séances de révision d'examens et parrainage réglementaire officiel pour le Programme d'admissibilité de l'assurance de personnes."
                          : "Structured study guidance, practice exam sessions, and provincial sponsorship for the Life License Qualification Program."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-2.5 bg-[#1a2c22] border border-[#d6c298]/30 rounded-[2px]">
                    <span className="font-serif text-[#d6c298] font-bold text-sm">02</span>
                    <div>
                      <div className="font-semibold text-[#f7f3eb]">
                        {isFr ? "Contrats Institutionnels & Co-Planification" : "Carrier Appointments & Co-Planning"}
                      </div>
                      <p className="text-[0.72rem] text-[#ece6da]/75 mt-0.5">
                        {isFr
                          ? "Obtention des codes d'accès institutionnels auprès des assureurs. Ahmed co-anime vos premières consultations pour garantir rigueur, conformité et exhaustivité."
                          : "Receive institutional appointments. Ahmed co-plans initial client cases so recommendations are compliant, rigorous, and thorough."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-2.5 bg-[#1a2c22] border border-[#d6c298]/30 rounded-[2px]">
                    <span className="font-serif text-[#d6c298] font-bold text-sm">03</span>
                    <div>
                      <div className="font-semibold text-[#f7f3eb]">
                        {isFr ? "Croissance d'un Cabinet Indépendant Pérenne" : "Independent Practice Growth"}
                      </div>
                      <p className="text-[0.72rem] text-[#ece6da]/75 mt-0.5">
                        {isFr
                          ? "Développez une clientèle fidèle sur le long terme et consolidez votre indépendance entrepreneuriale grâce à un perfectionnement continu."
                          : "Cultivate long-term client relationships and expand your practice sustainably with ongoing professional development."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Compensation & Independence */}
              {activeTab === "compensation" && (
                <div className="space-y-3 pt-1 text-xs">
                  <div className="p-3 bg-[#1a2c22] border border-[#2e4a3b] rounded-[2px] text-center">
                    <div className="text-[0.7rem] uppercase tracking-wider text-[#d6c298]">
                      {isFr ? "Structure de Rémunération" : "Compensation Structure"}
                    </div>
                    <div className="font-serif text-xl text-[#f7f3eb] mt-1">
                      {isFr ? "Contrats Directs des Assureurs" : "Direct Institutional Contracts"}
                    </div>
                    <p className="text-[0.72rem] text-[#ece6da]/75 mt-1">
                      {isFr
                        ? "Rémunération directe auprès des compagnies d'assurance dès l'obtention de votre agrément. Vos honoraires et commissions reflètent fidèlement votre accompagnement et le service rendu aux clients selon les barèmes réglementés."
                        : "Independent carrier compensation structure upon active licensing. Earnings reflect completed policy placements and ongoing servicing according to regulatory schedules."}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="p-2.5 bg-[#1a2c22] border border-[#2e4a3b] rounded-[2px]">
                      <div className="text-[0.65rem] text-[#d6c298]">{isFr ? "Modèle d'exercice" : "Practice Model"}</div>
                      <div className="font-bold text-xs text-[#f7f3eb] mt-0.5">
                        {isFr ? "Courtage Indépendant" : "Independent Brokerage"}
                      </div>
                    </div>
                    <div className="p-2.5 bg-[#1a2c22] border border-[#2e4a3b] rounded-[2px]">
                      <div className="text-[0.65rem] text-[#d6c298]">{isFr ? "Flexibilité" : "Schedule Flexibility"}</div>
                      <div className="font-bold text-xs text-[#f7f3eb] mt-0.5">
                        {isFr ? "Horaires Autonomes" : "Self-Directed"}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Blueprint Footer Strip */}
              <div className="mt-4 pt-3 border-t border-[#d6c298]/20 flex items-center justify-between text-[0.7rem] text-[#ece6da]/70">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#d6c298]" />
                  {isFr ? "Aucun frais de scolarité/bureau" : "No Tuition or Desk Fees"}
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#d6c298]" />
                  {isFr ? "Préparation au PAAP / LLQP" : "LLQP Exam Guidance"}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Why Independent Practice Comparison */}
        <section className="py-16 border-b border-[#d6cebd]">
          <div className="max-w-3xl mb-10">
            <span className="eyebrow text-xs uppercase tracking-wider text-[#75581f]">
              {isFr ? "Modèles de l'industrie" : "Industry Models"}
            </span>
            <h2
              className="font-serif text-3xl sm:text-4xl text-[#1c1b18] mt-2 mb-3"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {isFr
                ? "Comprendre le courtage indépendant face à la représentation exclusive d'une institution"
                : "Understanding Independent Brokerage vs. Single-Carrier Representation"}
            </h2>
            <p className="text-[#46423a] text-base leading-relaxed">
              {isFr
                ? "Au Canada, les professionnels agréés en assurance et solutions financières exercent principalement selon l'une de ces deux structures. Voici une comparaison objective de ces environnements."
                : "In Canada, licensed insurance and financial professionals typically operate under one of two structures. Here is an objective overview of the two operational environments."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Single-Carrier Model */}
            <div className="p-6 bg-[#f2ecdf]/50 border border-[#d6cebd] rounded-[2px] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 pb-3 border-b border-[#d6cebd]">
                  <Building className="w-5 h-5 text-[#75581f]" />
                  <h3 className="font-serif text-xl text-[#1c1b18]">
                    {isFr ? "Modèle Captif / Institution Exclusive" : "Single-Carrier / Proprietary Model"}
                  </h3>
                </div>
                <ul className="mt-5 space-y-3.5 text-sm text-[#46423a] list-none p-0">
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#75581f] font-bold text-base leading-none">&bull;</span>
                    <span>
                      {isFr
                        ? "L'offre de produits est restreinte au catalogue propriétaire fabriqué par cette institution spécifique."
                        : "Product availability is limited to the proprietary portfolio manufactured by that specific institution."}
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#75581f] font-bold text-base leading-none">&bull;</span>
                    <span>
                      {isFr
                        ? "Les horaires et la présence au bureau sont encadrés par la direction de succursale locale."
                        : "Operating hours and office attendance are set by local branch management."}
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#75581f] font-bold text-base leading-none">&bull;</span>
                    <span>
                      {isFr
                        ? "Les dossiers clients et les polices restent généralement la propriété exclusive de l'institution en cas de départ."
                        : "Client files and policy servicing generally remain property of the corporate institution upon departure."}
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#75581f] font-bold text-base leading-none">&bull;</span>
                    <span>
                      {isFr
                        ? "Rémunération souvent salariée avec des objectifs chiffrés et des bonus corporatifs prédéterminés."
                        : "Compensation is typically salaried with defined corporate bonus structures and performance benchmarks."}
                    </span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-[#d6cebd] text-xs text-[#625d52]">
                {isFr
                  ? "Profil adapté : Recommandé pour les professionnels recherchant un emploi salarié traditionnel avec encadrement hiérarchique direct."
                  : "Consideration: Ideal for professionals seeking structured corporate employment with defined internal supervision."}
              </div>
            </div>

            {/* Independent Brokerage Model */}
            <div className="p-6 bg-[#fcfaf5] border-2 border-[#2e4a3b] rounded-[2px] shadow-sm flex flex-col justify-between relative">
              <div className="absolute -top-3 right-5 bg-[#2e4a3b] text-[#f7f3eb] text-[0.7rem] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-[2px]">
                {isFr ? "Cabinet Indépendant" : "Independent Practice"}
              </div>
              <div>
                <div className="flex items-center gap-2.5 pb-3 border-b border-[#2e4a3b]/20">
                  <ShieldCheck className="w-5 h-5 text-[#2e4a3b]" />
                  <h3 className="font-serif text-xl text-[#1c1b18]">
                    {isFr ? "Pratique Indépendante Multicarrier" : "Independent Multi-Carrier Practice"}
                  </h3>
                </div>
                <ul className="mt-5 space-y-3.5 text-sm text-[#1c1b18] list-none p-0">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#2e4a3b] shrink-0 mt-0.5" />
                    <span>
                      <strong>{isFr ? "Accès multicarrier : " : "Multi-carrier access: "}</strong>
                      {isFr
                        ? "Évaluez et comparez objectivement les options parmi les assureurs canadiens de premier plan."
                        : "Objectively evaluate and present options across Canadian insurers to best fit client objectives."}
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#2e4a3b] shrink-0 mt-0.5" />
                    <span>
                      <strong>{isFr ? "Maîtrise du temps : " : "Calendar and location flexibility: "}</strong>
                      {isFr
                        ? "Gérez votre agenda et vos consultations de manière autonome, en présentiel ou à distance."
                        : "Manage your consultation schedule and practice either virtually or locally."}
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#2e4a3b] shrink-0 mt-0.5" />
                    <span>
                      <strong>{isFr ? "Relation de confiance directe : " : "Direct client relationships: "}</strong>
                      {isFr
                        ? "Bâtissez des relations professionnelles pérennes avec les familles et chefs d'entreprise au fil des décennies."
                        : "Foster enduring professional relationships with families and business owners over decades."}
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#2e4a3b] shrink-0 mt-0.5" />
                    <span>
                      <strong>{isFr ? "Mentorat & Co-Planification : " : "Mentorship & co-planning: "}</strong>
                      {isFr
                        ? "Ahmed co-anime vos premiers dossiers pour assurer la conformité, la rigueur et les plus hauts standards déontologiques."
                        : "Ahmed co-plans initial files with you to verify file suitability, compliance, and rigorous ethical standards."}
                    </span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-[#ece6da] text-xs font-semibold text-[#2e4a3b]">
                {isFr
                  ? "Profil adapté : Idéal pour les professionnels autonomes aspirant à la liberté entrepreneuriale, à l'objectivité et à une rémunération au mérite."
                  : "Consideration: Ideal for self-directed entrepreneurs seeking autonomy, comprehensive carrier choice, and performance-based compensation."}
              </div>
            </div>
          </div>
        </section>

        {/* The 5 Mentorship Pillars */}
        <section className="py-16 border-b border-[#d6cebd]">
          <div className="max-w-3xl mb-12">
            <span className="eyebrow text-xs uppercase tracking-wider text-[#75581f]">
              {isFr ? "Ce que vous recevez" : "What You Receive"}
            </span>
            <h2
              className="font-serif text-3xl sm:text-4xl text-[#1c1b18] mt-2 mb-3"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {isFr ? "Les 5 Piliers Fondamentaux de notre Mentorat" : "The 5 Pillars of Our Mentorship Program"}
            </h2>
            <p className="text-[#46423a] text-base leading-relaxed">
              {isFr
                ? "Nous offrons des parcours d'études structurés et un mentorat sur mesure aux professionnels motivés souhaitant bâtir leur cabinet indépendant au Canada et aux É.-U."
                : "We provide structured educational blueprints and dedicated mentorship for motivated candidates entering independent financial solutions practice across Canada."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pillar 1 */}
            <div className="p-6 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-[2px] bg-[#2e4a3b]/10 text-[#2e4a3b] flex items-center justify-center mb-4">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-xl text-[#1c1b18] mb-2">
                  {isFr ? "1. Aucun Frais de Scolarité ou de Bureau" : "1. No Tuition or Desk Fees"}
                </h3>
                <p className="text-sm text-[#46423a] leading-relaxed">
                  {isFr
                    ? "Aucun droit d'entrée, frais de franchise ni redevance mensuelle. Vous accédez à notre cursus complet, à nos grilles d'études et à un coaching individuel 1-à-1 sans aucuns frais facturés par notre programme."
                    : "No franchise startup fees, desk fees, or training invoices. You receive our complete practice curriculum, study frameworks, and ongoing 1-on-1 coaching with no tuition or desk fees charged by our mentorship program."}
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-[#ece6da] text-xs text-[#2e4a3b] font-medium">
                {isFr ? "Zéro frais d'adhésion exigé" : "No Tuition or Desk Fees Charged"}
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-[2px] bg-[#75581f]/10 text-[#75581f] flex items-center justify-center mb-4">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-xl text-[#1c1b18] mb-2">
                  {isFr ? "2. Préparation Complète aux Examens d'Agrément" : "2. Full Licensing Exam Support"}
                </h3>
                <p className="text-sm text-[#46423a] leading-relaxed">
                  {isFr
                    ? "Nous parrainons votre admissibilité réglementaire et vous fournissons des plans de travail clairs, des révisions et des examens blancs pour réussir le PAAP/LLQP canadien avec assurance."
                    : "We sponsor your regulatory eligibility and provide comprehensive study blueprints, practice exams, and coaching so you pass your Canadian LLQP exam with confidence."}
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-[#ece6da] text-xs text-[#75581f] font-medium">
                {isFr ? "*Frais d'examen payés au régulateur" : "*Exam fees paid to regulatory bodies"}
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-[2px] bg-[#2e4a3b]/10 text-[#2e4a3b] flex items-center justify-center mb-4">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-xl text-[#1c1b18] mb-2">
                  {isFr ? "3. Véritable Ingénierie Financière Pratique" : "3. Real Financial Architecture"}
                </h3>
                <p className="text-sm text-[#46423a] leading-relaxed">
                  {isFr
                    ? "Maîtrisez la mécanique des abris fiscaux enregistrés (CELI, REER, CELIAPP, REEE), la protection du revenu face à l'invalidité, l'assurance maladies graves et les stratégies successorales intergénérationnelles."
                    : "Master the mechanics of registered tax shelters (TFSA, RRSP, FHSA, RESP), disability & critical illness protection, debt restructuring, and intergenerational estate transitions."}
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-[#ece6da] text-xs text-[#2e4a3b] font-medium">
                {isFr ? "Ingénierie patrimoniale concrète" : "Comprehensive Solutions Architecture"}
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="p-6 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-[2px] bg-[#75581f]/10 text-[#75581f] flex items-center justify-center mb-4">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-xl text-[#1c1b18] mb-2">
                  {isFr ? "4. Co-Planification Pratique sur le Terrain" : "4. Hands-On Field Co-Planning"}
                </h3>
                <p className="text-sm text-[#46423a] leading-relaxed">
                  {isFr
                    ? "Vous n'êtes jamais laissé seul face aux clients. Ahmed participe à vos premières consultations, valide vos analyses financières et vous guide dans la formulation des solutions adaptées."
                    : "You are never thrown into client meetings alone. Ahmed participates in your early consultations, double-checks file recommendations, and coaches you through client solutions."}
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-[#ece6da] text-xs text-[#75581f] font-medium">
                {isFr ? "Accompagnement terrain direct" : "Direct Field Partnership"}
              </div>
            </div>

            {/* Pillar 5 */}
            <div className="p-6 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] flex flex-col justify-between md:col-span-2">
              <div>
                <div className="w-10 h-10 rounded-[2px] bg-[#2e4a3b]/10 text-[#2e4a3b] flex items-center justify-center mb-4">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-xl text-[#1c1b18] mb-2">
                  {isFr ? "5. Transition Flexible : Canada & États-Unis" : "5. Flexible Transition: Canada & USA Footprint"}
                </h3>
                <p className="text-sm text-[#46423a] leading-relaxed">
                  {isFr
                    ? "Nul besoin de quitter votre emploi actuel pour vous lancer. Posez vos fondations, préparez votre agrément provincial ou d'État et accompagnez vos premières familles en soirée et les fins de semaine. Effectuez votre transition à temps plein selon votre propre rythme lorsque votre cabinet vous assure une entière sécurité financière."
                    : "You don’t have to quit your employment to start. Build your foundation, acquire your provincial or state license, and onboard your first families during evenings and weekends across Canada and the US. Transition to full-time practice on your terms when your recurring revenue provides absolute security."}
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-[#ece6da] text-xs text-[#2e4a3b] font-medium">
                {isFr ? "Lancement professionnel sécurisé" : "Low-Risk Professional Launchpad"}
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Fit Evaluator */}
        <section className="py-16 border-b border-[#d6cebd] bg-[#fcfaf5] -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="eyebrow text-xs uppercase tracking-wider text-[#75581f]">
                {isFr ? "Auto-Évaluation" : "Self-Assessment"}
              </span>
              <h2
                className="font-serif text-3xl sm:text-4xl text-[#1c1b18] mt-2 mb-3"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {isFr
                  ? "La pratique financière indépendante correspond-elle à votre projet ?"
                  : "Is Independent Financial Practice Right for You?"}
              </h2>
              <p className="text-sm text-[#46423a]">
                {isFr
                  ? "Sélectionnez votre situation et votre disponibilité pour découvrir votre plan d'action personnalisé vers l'agrément et le lancement de votre cabinet."
                  : "Select your location and situation to see your customized roadmap to licensing and agency launch."}
              </p>
            </div>

            <div className="bg-[#f7f3eb] border border-[#d6cebd] p-6 sm:p-8 rounded-[2px] shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Question 1: Country / Market */}
                <div>
                  <label className="block text-xs font-semibold text-[#1c1b18] uppercase tracking-wider mb-2">
                    {isFr ? "1. Marché & Juridiction" : "1. Country & Market"}
                  </label>
                  <div className="space-y-2">
                    {[
                      { id: "Canada", label: isFr ? "Canada (Agrément PAAP / LLQP)" : "Canada (LLQP Licensing)" },
                      { id: "USA", label: isFr ? "États-Unis (Agrément d'État)" : "United States (State Licensing)" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setQuizCountry(opt.id)}
                        className={`w-full text-left p-3 text-xs rounded-[2px] border transition-colors flex items-center justify-between ${
                          quizCountry === opt.id
                            ? "bg-[#2e4a3b] text-[#f7f3eb] border-[#2e4a3b] font-semibold"
                            : "bg-[#fcfaf5] text-[#1c1b18] border-[#d6cebd] hover:border-[#2e4a3b]"
                        }`}
                      >
                        <span>{opt.label}</span>
                        {quizCountry === opt.id && <Check className="w-3.5 h-3.5 text-[#d6c298]" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Question 2: Licensing Status */}
                <div>
                  <label className="block text-xs font-semibold text-[#1c1b18] uppercase tracking-wider mb-2">
                    {isFr ? "2. Niveau Actuel d'Agrément" : "2. Current Licensing"}
                  </label>
                  <div className="space-y-2">
                    {[
                      { id: "not_licensed", label: isFr ? "Débutant (Besoin de formation)" : "Starting from Scratch" },
                      { id: "studying", label: isFr ? "En cours d'étude (PAAP)" : "Currently Studying" },
                      { id: "already_licensed", label: isFr ? "Déjà titulaire d'un permis" : "Already Licensed" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setQuizStatus(opt.id)}
                        className={`w-full text-left p-3 text-xs rounded-[2px] border transition-colors flex items-center justify-between ${
                          quizStatus === opt.id
                            ? "bg-[#2e4a3b] text-[#f7f3eb] border-[#2e4a3b] font-semibold"
                            : "bg-[#fcfaf5] text-[#1c1b18] border-[#d6cebd] hover:border-[#2e4a3b]"
                        }`}
                      >
                        <span>{opt.label}</span>
                        {quizStatus === opt.id && <Check className="w-3.5 h-3.5 text-[#d6c298]" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Question 3: Time Commitment */}
                <div>
                  <label className="block text-xs font-semibold text-[#1c1b18] uppercase tracking-wider mb-2">
                    {isFr ? "3. Disponibilité Hebdomadaire" : "3. Weekly Availability"}
                  </label>
                  <div className="space-y-2">
                    {[
                      { id: "part_time", label: isFr ? "Temps partiel (8–15 h/sem.)" : "Part-Time (8–15 hrs/wk)" },
                      { id: "full_time", label: isFr ? "Plein temps (30+ h/sem.)" : "Full-Time (30+ hrs/wk)" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setQuizTime(opt.id)}
                        className={`w-full text-left p-3 text-xs rounded-[2px] border transition-colors flex items-center justify-between ${
                          quizTime === opt.id
                            ? "bg-[#2e4a3b] text-[#f7f3eb] border-[#2e4a3b] font-semibold"
                            : "bg-[#fcfaf5] text-[#1c1b18] border-[#d6cebd] hover:border-[#2e4a3b]"
                        }`}
                      >
                        <span>{opt.label}</span>
                        {quizTime === opt.id && <Check className="w-3.5 h-3.5 text-[#d6c298]" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dynamic Assessment Outcome */}
              <div className="mt-8 p-5 bg-[#2e4a3b] text-[#f7f3eb] rounded-[2px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-[#75581f] text-[#f7f3eb] font-bold px-2 py-0.5 rounded-[2px] uppercase tracking-wider">
                      {isFr ? "Votre Voie Recommandée" : "Your Customized Path"}
                    </span>
                    <span className="text-xs text-[#d6c298]">
                      {quizCountry === "Canada"
                        ? isFr
                          ? "Filière Pratique Canadienne"
                          : "Canadian Practice Track"
                        : isFr
                        ? "Filière Pratique Américaine"
                        : "US Practice Track"}
                    </span>
                  </div>
                  <p className="text-sm sm:text-base font-serif text-[#f7f3eb]">
                    {quizStatus === "already_licensed"
                      ? isFr
                        ? "Intégration accélérée : Contrats assureurs directs et sessions de co-planification de dossiers avec Ahmed."
                        : "Fast-track onboarding: Direct carrier appointments and client co-planning sessions with Ahmed."
                      : quizTime === "part_time"
                      ? isFr
                        ? "Parcours du soir en 90 jours : Modules d'études complets, examens blancs réguliers et mentorat hebdomadaire."
                        : "Structured 90-day evening roadmap: Free study modules, mock test reviews, and weekly mentorship."
                      : isFr
                      ? "Accélération plein temps : Parrainage réglementaire immédiat et lancement accompagné rapide sur le terrain."
                      : "Accelerated full-time sprint: Complete licensing sponsorship and early field launch."}
                  </p>
                </div>
                <a
                  href="#apply-form"
                  className="btn bg-[#d6c298] text-[#14211a] hover:bg-white text-xs font-semibold px-4 py-2.5 whitespace-nowrap shrink-0 transition-colors"
                >
                  {isFr ? "Activer ce parcours →" : "Start This Pathway →"}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 4-Step Pathway */}
        <section className="py-16 border-b border-[#d6cebd]">
          <div className="max-w-3xl mb-12">
            <span className="eyebrow text-xs uppercase tracking-wider text-[#75581f]">
              {isFr ? "La Feuille de Route" : "The Roadmap"}
            </span>
            <h2
              className="font-serif text-3xl sm:text-4xl text-[#1c1b18] mt-2 mb-3"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {isFr
                ? "Du premier échange au professionnel indépendant agréé"
                : "From Initial Conversation to Licensed Independent Professional"}
            </h2>
            <p className="text-[#46423a] text-base leading-relaxed">
              {isFr
                ? "Une progression transparente et étape par étape à travers le Canada et les É.-U., conçue pour vous mener de l'évaluation initiale à la gestion autonome d'un cabinet prospère."
                : "A transparent, step-by-step pathway across Canada and the US designed to take you from initial evaluation to managing your own flourishing financial practice."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-5 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] relative">
              <span className="font-serif text-3xl text-[#75581f]/40 font-bold block mb-2">01</span>
              <h3 className="font-serif text-lg text-[#1c1b18] mb-1.5">
                {isFr ? "Entretien d'Orientation" : "Discovery Session"}
              </h3>
              <p className="text-xs text-[#46423a] leading-relaxed">
                {isFr
                  ? "Un échange exploratoire de 30 minutes avec Ahmed pour valider vos objectifs mutuels, vos disponibilités et votre vision professionnelle."
                  : "A 30-minute introductory conversation with Ahmed to explore mutual fit, discuss your schedule, and outline career goals."}
              </p>
            </div>

            <div className="p-5 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] relative">
              <span className="font-serif text-3xl text-[#75581f]/40 font-bold block mb-2">02</span>
              <h3 className="font-serif text-lg text-[#1c1b18] mb-1.5">
                {isFr ? "Préparation à l'Agrément" : "Licensing Prep & Coaching"}
              </h3>
              <p className="text-xs text-[#46423a] leading-relaxed">
                {isFr
                  ? "Fourniture du programme d'études, examens blancs et coaching pour réussir votre PAAP (Canada) ou examen d'État (É.-U.)."
                  : "Free study materials, practice tests, and coaching to pass your provincial LLQP (Canada) or state exam (USA)."}
              </p>
            </div>

            <div className="p-5 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] relative">
              <span className="font-serif text-3xl text-[#75581f]/40 font-bold block mb-2">03</span>
              <h3 className="font-serif text-lg text-[#1c1b18] mb-1.5">
                {isFr ? "Contrats Institutionnels" : "Carrier Contracting"}
              </h3>
              <p className="text-xs text-[#46423a] leading-relaxed">
                {isFr
                  ? "Obtention de vos codes de courtage directs auprès des principaux assureurs et gestionnaires de fonds canadiens et américains."
                  : "Receive direct regulatory appointment and multi-carrier access to top Canadian & US insurance and investment platforms."}
              </p>
            </div>

            <div className="p-5 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] relative">
              <span className="font-serif text-3xl text-[#2e4a3b]/40 font-bold block mb-2">04</span>
              <h3 className="font-serif text-lg text-[#1c1b18] mb-1.5">
                {isFr ? "Lancement Accompagné" : "Mentored Launch"}
              </h3>
              <p className="text-xs text-[#46423a] leading-relaxed">
                {isFr
                  ? "Ahmed co-anime vos premières consultations pour maîtriser la déontologie, sceller des relations de confiance et développer vos revenus en pleine conformité."
                  : "Ahmed co-plans your early client consultations. Master file suitability, build long-term relationships, and earn performance-based commissions in full regulatory compliance."}
              </p>
            </div>
          </div>
        </section>

        {/* Application Form & Direct Booking Zone */}
        <section id="apply-form" className="py-16 border-b border-[#d6cebd] scroll-mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Form Column */}
            <div className="lg:col-span-7">
              <div className="mb-8">
                <span className="eyebrow text-xs uppercase tracking-wider text-[#75581f]">
                  {isFr ? "Commencez Aujourd'hui" : "Get Started Today"}
                </span>
                <h2
                  className="font-serif text-3xl sm:text-4xl text-[#1c1b18] mt-2 mb-3"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {isFr ? "Postuler au Programme de Mentorat" : "Apply for the Educational Mentorship"}
                </h2>
                <p className="text-[#46423a] text-sm leading-relaxed">
                  {isFr
                    ? "Remplissez ce court questionnaire pour entrer en contact direct avec Ahmed. Il n'y a aucuns frais ni engagement : simplement une conversation ouverte sur le processus d'agrément et l'adéquation de la pratique indépendante avec vos projets."
                    : "Complete this brief questionnaire to connect with Ahmed. There are no coaching fees or obligations: just an honest conversation about the licensing process and whether independent financial practice aligns with your career goals."}
                </p>
              </div>

              {/* Regulatory & Compliance Disclosure Banner */}
              <div className="mb-8 p-4 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] text-xs text-[#625d52] leading-relaxed space-y-1.5">
                <p className="font-semibold text-[#1c1b18]">
                  {isFr ? "Avis Réglementaire & Agrément Provincial :" : "Provincial Licensing & Regulatory Notice:"}
                </p>
                <p>
                  {isFr
                    ? "Au Canada, les solutions d'assurance de personnes, de rentes et de fonds distincts ne peuvent être recommandées que par des professionnels ayant complété le Programme d'admissibilité de l'assurance de personnes (PAAP / LLQP) et détenant un agrément provincial actif (ex. : l'ARSF en Ontario, la FCSC au Nouveau-Brunswick, l'AIC en Alberta, ou l'AMF au Québec). Notre mentorat est strictement éducatif et préparatoire ; aucun conseil financier ne peut être prodigué avant l'obtention des permis d'exercice réglementaires. La rémunération repose sur les barèmes des courtiers indépendants agréés. Aucun revenu particulier n'est garanti."
                    : "In Canada, life insurance, living benefits, and segregated funds may only be recommended by individuals who have completed the Life License Qualification Program (LLQP) and hold active provincial registration (e.g., FSRA in Ontario, FCNB in New Brunswick, AIC in Alberta). Mentorship is educational and preparatory; candidates cannot advise or solicit clients until all regulatory approvals are active. Compensation is based on an independent carrier compensation structure upon active licensing. No specific earnings are guaranteed."}
                </p>
              </div>

              {submitSuccess ? (
                <div className="p-8 bg-[#2e4a3b] text-[#f7f3eb] rounded-[2px] shadow-sm space-y-4">
                  <div className="w-12 h-12 rounded-[2px] bg-[#f7f3eb] text-[#2e4a3b] flex items-center justify-center">
                    <Check className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-2xl text-[#f7f3eb]">
                    {isFr
                      ? `Candidature reçue avec succès, ${formData.firstName} !`
                      : `Application Received, ${formData.firstName}!`}
                  </h3>
                  <p className="text-sm text-[#ece6da] leading-relaxed">
                    {isFr
                      ? "Ahmed a bien reçu vos informations et examinera attentivement votre profil. Vous recevrez une réponse personnalisée par courriel d'ici 1 à 2 jours ouvrables."
                      : "Ahmed has received your application and will review your profile. You will receive a personal email follow-up within 1 to 2 business days."}
                  </p>
                  {siteConfig.schedulingUrl && (
                    <div className="pt-4 border-t border-[#f7f3eb]/20">
                      <p className="text-xs text-[#d6c298] mb-3">
                        {isFr
                          ? "Vous souhaitez échanger sans attendre ? Choisissez directement un créneau de 30 minutes dans le calendrier d'Ahmed :"
                          : "Want to discuss right away? Schedule your 30-minute discovery call directly on Ahmed’s calendar:"}
                      </p>
                      <a
                        href={siteConfig.schedulingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackBookingClick("careers_success")}
                        className="btn bg-[#d6c298] text-[#14211a] hover:bg-white text-xs font-semibold px-4 py-2.5 inline-flex items-center gap-2 transition-colors"
                      >
                        <Calendar className="w-4 h-4 text-[#75581f]" />
                        <span>{isFr ? "Prendre Rendez-vous sur Calendly →" : "Book 30-Min Discovery Call →"}</span>
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4 bg-[#fcfaf5] border border-[#d6cebd] p-6 sm:p-8 rounded-[2px] shadow-sm"
                >
                  {/* Honeypot field for spam prevention */}
                  <input
                    type="text"
                    name="honeypot"
                    value={formData.honeypot}
                    onChange={handleInputChange}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  {errorMessage && (
                    <div className="p-3 bg-[#fdf0ed] border border-[#d97768] text-[#8a3324] text-xs rounded-[2px]">
                      {errorMessage}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="mentorship-firstName"
                        className="block text-xs font-semibold text-[#1c1b18] mb-1"
                      >
                        {isFr ? "Prénom *" : "First Name *"}
                      </label>
                      <input
                        id="mentorship-firstName"
                        type="text"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder={isFr ? "ex. Sarah ou Jean" : "e.g., Sarah"}
                        className="w-full text-sm p-2.5 bg-[#f7f3eb] border border-[#d6cebd] rounded-[2px] focus:outline-none focus:border-[#2e4a3b]"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="mentorship-lastName"
                        className="block text-xs font-semibold text-[#1c1b18] mb-1"
                      >
                        {isFr ? "Nom de famille" : "Last Name"}
                      </label>
                      <input
                        id="mentorship-lastName"
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder={isFr ? "ex. Tremblay" : "e.g., Campbell"}
                        className="w-full text-sm p-2.5 bg-[#f7f3eb] border border-[#d6cebd] rounded-[2px] focus:outline-none focus:border-[#2e4a3b]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="mentorship-email"
                        className="block text-xs font-semibold text-[#1c1b18] mb-1"
                      >
                        {isFr ? "Adresse courriel *" : "Email Address *"}
                      </label>
                      <input
                        id="mentorship-email"
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder={isFr ? "nom@exemple.ca" : "sarah@example.com"}
                        className="w-full text-sm p-2.5 bg-[#f7f3eb] border border-[#d6cebd] rounded-[2px] focus:outline-none focus:border-[#2e4a3b]"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="mentorship-phone"
                        className="block text-xs font-semibold text-[#1c1b18] mb-1"
                      >
                        {isFr ? "Numéro de téléphone" : "Phone Number"}
                      </label>
                      <input
                        id="mentorship-phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+1-506-... ou +1-404-..."
                        className="w-full text-sm p-2.5 bg-[#f7f3eb] border border-[#d6cebd] rounded-[2px] focus:outline-none focus:border-[#2e4a3b]"
                      />
                    </div>
                  </div>

                  {/* Country & Jurisdiction */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="mentorship-country"
                        className="block text-xs font-semibold text-[#1c1b18] mb-1"
                      >
                        {isFr ? "Pays *" : "Country *"}
                      </label>
                      <select
                        id="mentorship-country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full text-xs p-2.5 bg-[#f7f3eb] border border-[#d6cebd] rounded-[2px] focus:outline-none focus:border-[#2e4a3b]"
                      >
                        <option value="Canada">{isFr ? "Canada" : "Canada"}</option>
                        <option value="USA">{isFr ? "États-Unis" : "United States"}</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="mentorship-jurisdiction"
                        className="block text-xs font-semibold text-[#1c1b18] mb-1"
                      >
                        {isFr ? "Province ou Région d'État *" : "Province / State Region *"}
                      </label>
                      <select
                        id="mentorship-jurisdiction"
                        name="jurisdiction"
                        value={formData.jurisdiction}
                        onChange={handleInputChange}
                        className="w-full text-xs p-2.5 bg-[#f7f3eb] border border-[#d6cebd] rounded-[2px] focus:outline-none focus:border-[#2e4a3b]"
                      >
                        {formData.country === "Canada"
                          ? CANADIAN_PROVINCES.map((prov) => (
                              <option key={prov} value={prov}>
                                {prov}
                              </option>
                            ))
                          : US_REGIONS.map((state) => (
                              <option key={state} value={state}>
                                {state}
                              </option>
                            ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="mentorship-licensingStatus"
                        className="block text-xs font-semibold text-[#1c1b18] mb-1"
                      >
                        {isFr ? "Niveau d'agrément actuel" : "Current Licensing Status"}
                      </label>
                      <select
                        id="mentorship-licensingStatus"
                        name="licensingStatus"
                        value={formData.licensingStatus}
                        onChange={handleInputChange}
                        className="w-full text-xs p-2.5 bg-[#f7f3eb] border border-[#d6cebd] rounded-[2px] focus:outline-none focus:border-[#2e4a3b]"
                      >
                        <option value="not_licensed">
                          {isFr ? "Non agréé (Besoin de formation)" : "Not Licensed (Need Training)"}
                        </option>
                        <option value="studying">
                          {isFr ? "En cours d'étude (PAAP ou État)" : "Currently Studying (LLQP or State)"}
                        </option>
                        <option value="already_licensed">
                          {isFr ? "Déjà titulaire de permis" : "Already Licensed"}
                        </option>
                        <option value="other_license">
                          {isFr ? "Autre accréditation financière" : "Other Financial Registration"}
                        </option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="mentorship-availability"
                        className="block text-xs font-semibold text-[#1c1b18] mb-1"
                      >
                        {isFr ? "Disponibilité hebdomadaire" : "Weekly Availability"}
                      </label>
                      <select
                        id="mentorship-availability"
                        name="availability"
                        value={formData.availability}
                        onChange={handleInputChange}
                        className="w-full text-xs p-2.5 bg-[#f7f3eb] border border-[#d6cebd] rounded-[2px] focus:outline-none focus:border-[#2e4a3b]"
                      >
                        <option value="part_time">
                          {isFr ? "Temps partiel (8–15 h/sem.)" : "Part-Time (8–15 hrs/wk)"}
                        </option>
                        <option value="flexible">
                          {isFr ? "Transition professionnelle flexible" : "Flexible Career Transition"}
                        </option>
                        <option value="full_time">
                          {isFr ? "Plein temps (30+ h/sem.)" : "Full-Time (30+ hrs/wk)"}
                        </option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="mentorship-background"
                      className="block text-xs font-semibold text-[#1c1b18] mb-1"
                    >
                      {isFr ? "Profession ou parcours actuel" : "Current Career or Background"}
                    </label>
                    <input
                      id="mentorship-background"
                      type="text"
                      name="background"
                      value={formData.background}
                      onChange={handleInputChange}
                      placeholder={isFr ? "ex. Santé, Enseignement, Ingénierie, Ventes, Comptabilité" : "e.g., Healthcare, Education, Engineering, Sales, Accounting"}
                      className="w-full text-sm p-2.5 bg-[#f7f3eb] border border-[#d6cebd] rounded-[2px] focus:outline-none focus:border-[#2e4a3b]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="mentorship-message"
                      className="block text-xs font-semibold text-[#1c1b18] mb-1"
                    >
                      {isFr
                        ? "Pourquoi souhaitez-vous bâtir une pratique indépendante ?"
                        : "Why are you interested in building an independent practice?"}
                    </label>
                    <textarea
                      id="mentorship-message"
                      name="message"
                      rows={3}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder={
                        isFr
                          ? "Partagez vos motivations, vos disponibilités ou vos questions pour Ahmed..."
                          : "Share your goals, schedule expectations, or any questions for Ahmed..."
                      }
                      className="w-full text-sm p-2.5 bg-[#f7f3eb] border border-[#d6cebd] rounded-[2px] focus:outline-none focus:border-[#2e4a3b]"
                    />
                  </div>

                  {/* Privacy Checkbox */}
                  <div className="pt-2 flex items-start gap-2.5">
                    <input
                      id="mentorship-consentPrivacy"
                      type="checkbox"
                      name="consentPrivacy"
                      checked={formData.consentPrivacy}
                      onChange={handleInputChange}
                      className="mt-1 accent-[#2e4a3b]"
                    />
                    <label
                      htmlFor="mentorship-consentPrivacy"
                      className="text-xs text-[#46423a] leading-relaxed"
                    >
                      {isFr ? (
                        <>
                          J'accepte l'
                          <Link to="/fr/privacy" target="_blank" rel="noopener noreferrer" className="underline text-[#2e4a3b] mx-1">
                            avis de confidentialité
                          </Link>
                          . Je comprends que mes renseignements sont strictement confidentiels et serviront uniquement à évaluer l'admissibilité au mentorat.
                        </>
                      ) : (
                        <>
                          I agree to the{" "}
                          <Link to="/privacy" target="_blank" rel="noopener noreferrer" className="underline text-[#2e4a3b]">
                            privacy notice
                          </Link>
                          . I understand my information is confidential and will be used solely by Ahmed Bello to evaluate mentorship fit.
                        </>
                      )}
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-primary w-full py-3 text-sm font-medium flex items-center justify-center gap-2 mt-4"
                  >
                    {submitting ? (
                      <span>{isFr ? "Transmission en cours..." : "Submitting Application..."}</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>{isFr ? "Envoyer ma Candidature au Mentorat" : "Submit Mentorship Application"}</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Direct Booking & Practice Support Details Column */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {/* Calendly Direct Booking Card */}
              {siteConfig.schedulingUrl && (
                <div className="p-6 bg-[#2e4a3b] text-[#f7f3eb] rounded-[2px] shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#75581f] text-[#f7f3eb] text-[0.7rem] font-bold uppercase tracking-wider rounded-[2px] mb-3">
                      <Clock className="w-3 h-3" />
                      <span>{isFr ? "Vous préférez échanger de vive voix ?" : "Prefer to Speak Directly?"}</span>
                    </div>
                    <h3 className="font-serif text-2xl text-[#f7f3eb] mb-2">
                      {isFr ? "Réserver un Appel d'Orientation de 30 min" : "Schedule a 30-Min Discovery Call"}
                    </h3>
                    <p className="text-xs text-[#ece6da] leading-relaxed mb-4">
                      {isFr
                        ? "Prenez rendez-vous directement dans le calendrier d'Ahmed pour discuter du modèle de cabinet, des étapes d'agrément dans votre province ou État et des modalités du coaching."
                        : "Book directly on Ahmed’s calendar to discuss the practice model, regulatory licensing pathways in your province or state, and how our coaching operates."}
                    </p>
                  </div>
                  <a
                    href={siteConfig.schedulingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackBookingClick("careers_card")}
                    className="btn bg-[#d6c298] text-[#14211a] hover:bg-white text-xs font-semibold px-4 py-3 text-center inline-flex items-center justify-center gap-2 transition-colors group"
                  >
                    <Calendar className="w-4 h-4 text-[#75581f]" />
                    <span>{isFr ? "Ouvrir l'agenda Calendly d'Ahmed" : "Open Ahmed’s Calendly Schedule"}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#75581f] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              )}

              {/* Direct Practice Contact Details */}
              <div className="p-6 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] space-y-4">
                <h4 className="font-serif text-lg text-[#1c1b18]">
                  {isFr ? "Bureau de Mentorat Professionnel" : "Practice Mentorship Office"}
                </h4>
                <div className="space-y-3 text-xs text-[#46423a]">
                  {siteConfig.publicPhone && (
                    <div className="flex items-center gap-2.5">
                      <Phone className="w-4 h-4 text-[#75581f]" />
                      <a
                        href={`tel:${siteConfig.publicPhone.replace(/\s+/g, "")}`}
                        className="hover:text-[#2e4a3b] font-medium"
                      >
                        {siteConfig.publicPhone}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-[#75581f]" />
                    <a
                      href={`mailto:${siteConfig.publicEmail}`}
                      className="hover:text-[#2e4a3b] font-medium"
                    >
                      {siteConfig.publicEmail}
                    </a>
                  </div>
                  <div className="flex items-start gap-2.5 pt-1 text-[0.75rem] text-[#625d52]">
                    <Globe2 className="w-4 h-4 text-[#75581f] shrink-0 mt-0.5" />
                    <span>
                      {isFr
                        ? "Siège établi au Nouveau-Brunswick, Canada. Mentorat et parrainage de professionnels indépendants dans toutes les provinces et territoires canadiens ainsi qu'aux États-Unis."
                        : "Headquartered in New Brunswick, Canada. Mentoring independent professionals across all Canadian provinces/territories and throughout the United States."}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="max-w-3xl mb-10">
            <span className="eyebrow text-xs uppercase tracking-wider text-[#75581f]">
              {isFr ? "Foire Aux Questions" : "Frequently Asked Questions"}
            </span>
            <h2
              className="font-serif text-3xl sm:text-4xl text-[#1c1b18] mt-2 mb-3"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {isFr
                ? "Questions Fréquentes sur le Mentorat & l'Agrément"
                : "Common Questions About Mentorship & Licensing"}
            </h2>
            <p className="text-[#46423a] text-sm leading-relaxed">
              {isFr
                ? "Réponses claires et transparentes concernant les frais d'examen, les exigences réglementaires Canada/É.-U. et le modèle de rémunération."
                : "Clear, transparent answers regarding exam costs, Canadian vs. US regulatory requirements, and practice equity."}
            </p>
          </div>

          <div className="space-y-4 max-w-4xl">
            {faqs.map((faq, idx) => (
              <details
                key={idx}
                className="group p-5 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] transition-colors open:bg-[#f7f3eb]"
              >
                <summary className="flex items-center justify-between cursor-pointer font-serif text-lg text-[#1c1b18] list-none select-none">
                  <span>{faq.q}</span>
                  <span className="text-[#75581f] text-sm group-open:rotate-90 transition-transform">
                    →
                  </span>
                </summary>
                <p className="mt-3 text-xs sm:text-sm text-[#46423a] leading-relaxed border-t border-[#ece6da] pt-3">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
