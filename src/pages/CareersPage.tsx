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
  Sparkles,
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
      setErrorMessage("Please provide your first name.");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setErrorMessage("Please provide a valid email address.");
      return;
    }
    if (!formData.consentPrivacy) {
      setErrorMessage("Please accept the privacy notice to proceed.");
      return;
    }

    setSubmitting(true);

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
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit application.");
      }

      setSubmitSuccess(true);
    } catch (err: any) {
      setErrorMessage(
        err.message || "An unexpected error occurred. Please try again or book directly via Calendly."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const faqs = [
    {
      q: "What does 'Free Mentorship & Training' mean? Are there hidden fees?",
      a: "Our mentorship, coaching curriculum, weekly training webinars, practical case study reviews, and 1-on-1 field co-planning are 100% free with zero tuition, no franchise startup costs, and no monthly desk fees. You do not pay us a dime for training. The only out-of-pocket costs are the official regulatory licensing exam and registration fees, which you pay directly to the provincial regulator (LLQP in Canada) or state insurance department (in the US). We provide full study guidance and sponsorship to prepare you to pass on your first attempt.",
    },
    {
      q: "Does this mentorship cover both Canada and the United States?",
      a: "Yes! Our independent agency platform and professional mentorship infrastructure operate across Canada (all 10 provinces and 3 territories) and throughout the United States. Whether you are seeking Canadian LLQP licensing or US state Life & Health insurance credentials, we provide regulatory sponsorship, study modules, and carrier contracting.",
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
      a: "Independent financial professionals earn performance-based commissions directly from Canadian financial and insurance institutions upon product placement and policy servicing. There are no sales quotas or territory restrictions, but compensation is entirely performance-based and varies according to licensing, effort, and client decisions.",
    },
    {
      q: "How much do the regulatory licensing exams cost?",
      a: "Exam fees vary slightly by province and are paid directly to the provincial regulatory authority or accredited testing provider (such as the provincial insurance councils in Canada, typically $150 to $300 CAD total). Our mentorship provides study guidance and practice sessions to help prepare you for your exams.",
    },
  ];

  return (
    <div className="py-10 lg:py-16">
      <SEO
        title={isFr ? "Devenir professionnel agréé au Canada | Ahmed Bello" : "Join Our Independent Practice & Mentorship | Ahmed Bello"}
        description={
          isFr
            ? "Programme de mentorat pour le cours du PAAP/LLQP et formation pour professionnels indépendants en solutions financières au Canada."
            : "Mentorship and licensing support for aspiring independent financial solutions professionals in Canada. LLQP preparation and practice development."
        }
        canonicalUrl="/careers"
      />
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "EducationalOccupationalProgram",
                "@id": `${siteConfig.siteUrl}/careers#program`,
                name: "Independent Financial Solutions Practice Mentorship",
                description:
                  "Comprehensive study support for Canadian provincial LLQP exams, practical file co-planning, and career mentorship with Ahmed Bello.",
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
                "@type": "FAQPage",
                "@id": `${siteConfig.siteUrl}/careers#faq`,
                mainEntity: faqs.map((f) => ({
                  "@type": "Question",
                  name: f.q,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: f.a,
                  },
                })),
              },
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  {
                    "@type": "ListItem",
                    position: 1,
                    name: "Home",
                    item: siteConfig.siteUrl,
                  },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: "Become an Independent Agent",
                    item: `${siteConfig.siteUrl}/careers`,
                  },
                ],
              },
            ],
          }),
        }}
      />

      <div className="wrap">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-[#625d52]">
          <ol className="flex items-center gap-2 list-none p-0">
            <li>
              <Link to="/" className="hover:text-[#2e4a3b] transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true">&rsaquo;</li>
            <li className="text-[#1c1b18] font-medium">Careers & Mentorship (Canada & USA)</li>
          </ol>
        </nav>

        {/* Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pb-16 border-b border-[#d6cebd]">
          <div className="lg:col-span-7 flex flex-col gap-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#2e4a3b]/10 text-[#2e4a3b] border border-[#2e4a3b]/25 rounded-[2px] w-fit text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#75581f]" />
              <span>Free Mentorship &bull; Canada & USA &bull; Full Licensing Support</span>
            </div>

            <h1
              className="font-serif text-4xl sm:text-5xl lg:text-[3.5rem] leading-[1.1] text-[#1c1b18] tracking-tight"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Become an Independent Financial Professional in Canada & the USA.
            </h1>

            <p className="text-lg sm:text-xl text-[#46423a] leading-relaxed">
              Build an authentic, high-impact financial practice you own. Receive{" "}
              <strong className="text-[#1c1b18] font-semibold">
                free 1-on-1 mentorship, comprehensive training, and regulatory licensing support
              </strong>{" "}
              with Ahmed Bello. Zero tuition, zero franchise fees, open-carrier solutions, and total autonomy over your calendar.
            </p>

            {/* Quick Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] text-center">
                <div className="text-xs text-[#625d52]">Mentorship Fee</div>
                <div className="text-sm font-semibold text-[#2e4a3b] mt-0.5">$0 (Free Coaching)</div>
              </div>
              <div className="p-3 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] text-center">
                <div className="text-xs text-[#625d52]">Licensing Exam</div>
                <div className="text-sm font-semibold text-[#1c1b18] mt-0.5">Exam Paid to Govt*</div>
              </div>
              <div className="p-3 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] text-center">
                <div className="text-xs text-[#625d52]">Time Model</div>
                <div className="text-sm font-semibold text-[#1c1b18] mt-0.5">Part-Time / Full-Time</div>
              </div>
              <div className="p-3 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] text-center">
                <div className="text-xs text-[#625d52]">Footprint</div>
                <div className="text-sm font-semibold text-[#1c1b18] mt-0.5">Canada & USA</div>
              </div>
            </div>

            <p className="text-xs text-[#625d52] italic">
              *Full transparency: Our coaching and agency onboarding are 100% free. Candidates pay their official provincial or state exam/registration fees directly to the regulatory body, and we provide study roadmaps, mock tests, and mentorship support.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <a
                href="#apply-form"
                className="btn btn-primary text-center px-6 py-3 text-base font-medium shadow-sm"
              >
                Apply for Mentorship
              </a>
              {siteConfig.schedulingUrl && (
                <a
                  href={siteConfig.schedulingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary text-center px-6 py-3 text-base font-medium inline-flex items-center justify-center gap-2 group"
                >
                  <Calendar className="w-4 h-4 text-[#75581f]" />
                  <span>Schedule 30-Min Discovery Call</span>
                  <ArrowUpRight className="w-4 h-4 text-[#75581f] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              )}
            </div>
          </div>

          {/* Unique Hero Visual: Architectural Practice Portal & Ecosystem Blueprint */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md bg-[#14211a] text-[#f7f3eb] border border-[#2e4a3b]/60 p-6 rounded-[2px] shadow-xl relative overflow-hidden">
              {/* Subtle background architectural glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#2e4a3b]/20 rounded-full blur-3xl pointer-events-none" />

              {/* Blueprint Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#d6c298]/20">
                <div className="flex items-center gap-2.5">
                  <BrandMark size={28} reversed={true} className="w-7 h-7" />
                  <span className="font-serif text-lg tracking-tight text-[#f7f3eb]">
                    Independent Practice Blueprint
                  </span>
                </div>
                <span className="text-[0.65rem] uppercase font-bold tracking-widest text-[#d6c298] bg-[#2e4a3b]/60 px-2 py-0.5 rounded-[2px]">
                  CAN &bull; USA
                </span>
              </div>

              {/* Interactive Blueprint Navigation Tabs */}
              <div className="grid grid-cols-3 gap-1.5 pt-4 pb-4">
                {[
                  { id: "architecture", label: "Open Architecture" },
                  { id: "progression", label: "3-Stage Roadmap" },
                  { id: "compensation", label: "Practice Equity" },
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
                      <span>Multi-Carrier Open Platform</span>
                      <ShieldCheck className="w-4 h-4 text-[#d6c298]" />
                    </div>
                    <p className="text-[#ece6da]/80 text-[0.75rem] leading-relaxed">
                      Access major Canadian life insurers and financial institutions. Compare products objectively to match individual client requirements.
                    </p>
                  </div>

                  <div className="p-3 bg-[#1a2c22] border border-[#2e4a3b] rounded-[2px]">
                    <div className="flex items-center justify-between text-[#f7f3eb] font-semibold mb-1">
                      <span>Client-Focused Autonomy</span>
                      <Target className="w-4 h-4 text-[#d6c298]" />
                    </div>
                    <p className="text-[#ece6da]/80 text-[0.75rem] leading-relaxed">
                      No arbitrary branch-mandated sales quotas. Build your practice on client education, comprehensive analysis, and ethical recommendations.
                    </p>
                  </div>

                  <div className="p-3 bg-[#1a2c22] border border-[#2e4a3b] rounded-[2px]">
                    <div className="flex items-center justify-between text-[#f7f3eb] font-semibold mb-1">
                      <span>National Scalability</span>
                      <Globe2 className="w-4 h-4 text-[#d6c298]" />
                    </div>
                    <p className="text-[#ece6da]/80 text-[0.75rem] leading-relaxed">
                      Expand your reach across Canadian provinces and territories as you obtain provincial regulatory licenses.
                    </p>
                  </div>
                </div>
              )}

              {/* Tab 2: 3-Stage Progression */}
              {activeTab === "progression" && (
                <div className="space-y-3 pt-1 text-xs">
                  <div className="flex items-start gap-3 p-2.5 bg-[#1a2c22] border-l-2 border-[#d6c298] rounded-[1px]">
                    <span className="font-serif text-[#d6c298] font-bold text-sm">01</span>
                    <div>
                      <div className="font-semibold text-[#f7f3eb]">Licensing Preparation (LLQP)</div>
                      <p className="text-[0.72rem] text-[#ece6da]/75 mt-0.5">
                        Structured study guidance, practice exam sessions, and provincial sponsorship for the Life License Qualification Program.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-2.5 bg-[#1a2c22] border-l-2 border-[#d6c298] rounded-[1px]">
                    <span className="font-serif text-[#d6c298] font-bold text-sm">02</span>
                    <div>
                      <div className="font-semibold text-[#f7f3eb]">Carrier Appointments & Co-Planning</div>
                      <p className="text-[0.72rem] text-[#ece6da]/75 mt-0.5">
                        Receive institutional appointments. Ahmed co-plans initial client cases so recommendations are compliant, rigorous, and thorough.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-2.5 bg-[#1a2c22] border-l-2 border-[#d6c298] rounded-[1px]">
                    <span className="font-serif text-[#d6c298] font-bold text-sm">03</span>
                    <div>
                      <div className="font-semibold text-[#f7f3eb]">Independent Practice Growth</div>
                      <p className="text-[0.72rem] text-[#ece6da]/75 mt-0.5">
                        Cultivate long-term client relationships and expand your practice sustainably with ongoing professional development.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Compensation & Independence */}
              {activeTab === "compensation" && (
                <div className="space-y-3 pt-1 text-xs">
                  <div className="p-3 bg-[#1a2c22] border border-[#2e4a3b] rounded-[2px] text-center">
                    <div className="text-[0.7rem] uppercase tracking-wider text-[#d6c298]">Compensation Structure</div>
                    <div className="font-serif text-xl text-[#f7f3eb] mt-1">Direct Institutional Contracts</div>
                    <p className="text-[0.72rem] text-[#ece6da]/75 mt-1">
                      Performance-based commission model without salary caps. Earnings reflect completed policy placements and ongoing servicing.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="p-2.5 bg-[#1a2c22] border border-[#2e4a3b] rounded-[2px]">
                      <div className="text-[0.65rem] text-[#d6c298]">Practice Model</div>
                      <div className="font-bold text-xs text-[#f7f3eb] mt-0.5">Independent Brokerage</div>
                    </div>
                    <div className="p-2.5 bg-[#1a2c22] border border-[#2e4a3b] rounded-[2px]">
                      <div className="text-[0.65rem] text-[#d6c298]">Schedule Flexibility</div>
                      <div className="font-bold text-xs text-[#f7f3eb] mt-0.5">Self-Directed</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Blueprint Footer Strip */}
              <div className="mt-4 pt-3 border-t border-[#d6c298]/20 flex items-center justify-between text-[0.7rem] text-[#ece6da]/70">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#d6c298]" />
                  No Mentorship Fees
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#d6c298]" />
                  LLQP Exam Guidance
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Why Independent Practice Comparison */}
        <section className="py-16 border-b border-[#d6cebd]">
          <div className="max-w-3xl mb-10">
            <span className="eyebrow text-xs uppercase tracking-wider text-[#75581f]">
              Industry Models
            </span>
            <h2
              className="font-serif text-3xl sm:text-4xl text-[#1c1b18] mt-2 mb-3"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Understanding Independent Brokerage vs. Single-Carrier Representation
            </h2>
            <p className="text-[#46423a] text-base leading-relaxed">
              In Canada, licensed insurance and financial professionals typically operate under one of two structures. Here is an objective overview of the two operational environments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Single-Carrier Model */}
            <div className="p-6 bg-[#f2ecdf]/50 border border-[#d6cebd] rounded-[2px] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 pb-3 border-b border-[#d6cebd]">
                  <Building className="w-5 h-5 text-[#75581f]" />
                  <h3 className="font-serif text-xl text-[#1c1b18]">
                    Single-Carrier / Proprietary Model
                  </h3>
                </div>
                <ul className="mt-5 space-y-3.5 text-sm text-[#46423a] list-none p-0">
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#75581f] font-bold text-base leading-none">&bull;</span>
                    <span>Product availability is limited to the proprietary portfolio manufactured by that specific institution.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#75581f] font-bold text-base leading-none">&bull;</span>
                    <span>Operating hours and office attendance are set by local branch management.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#75581f] font-bold text-base leading-none">&bull;</span>
                    <span>Client files and policy servicing generally remain property of the corporate institution upon departure.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#75581f] font-bold text-base leading-none">&bull;</span>
                    <span>Compensation is typically salaried with defined corporate bonus structures and performance benchmarks.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-[#d6cebd] text-xs text-[#625d52]">
                Consideration: Ideal for professionals seeking structured corporate employment with defined internal supervision.
              </div>
            </div>

            {/* Independent Brokerage Model */}
            <div className="p-6 bg-[#fcfaf5] border-2 border-[#2e4a3b] rounded-[2px] shadow-sm flex flex-col justify-between relative">
              <div className="absolute -top-3 right-5 bg-[#2e4a3b] text-[#f7f3eb] text-[0.7rem] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-[2px]">
                Independent Practice
              </div>
              <div>
                <div className="flex items-center gap-2.5 pb-3 border-b border-[#2e4a3b]/20">
                  <ShieldCheck className="w-5 h-5 text-[#2e4a3b]" />
                  <h3 className="font-serif text-xl text-[#1c1b18]">
                    Independent Multi-Carrier Practice
                  </h3>
                </div>
                <ul className="mt-5 space-y-3.5 text-sm text-[#1c1b18] list-none p-0">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#2e4a3b] shrink-0 mt-0.5" />
                    <span><strong>Multi-carrier access:</strong> Objectively evaluate and present options across Canadian insurers to best fit client objectives.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#2e4a3b] shrink-0 mt-0.5" />
                    <span><strong>Calendar and location flexibility:</strong> Manage your consultation schedule and practice either virtually or locally.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#2e4a3b] shrink-0 mt-0.5" />
                    <span><strong>Direct client relationships:</strong> Foster enduring professional relationships with families and business owners over decades.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#2e4a3b] shrink-0 mt-0.5" />
                    <span><strong>Mentorship & co-planning:</strong> Ahmed co-plans initial files with you to verify file suitability, compliance, and rigorous ethical standards.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-[#ece6da] text-xs font-semibold text-[#2e4a3b]">
                Consideration: Ideal for self-directed entrepreneurs seeking autonomy, comprehensive carrier choice, and performance-based compensation.
              </div>
            </div>
          </div>
        </section>

        {/* The 5 Mentorship Pillars */}
        <section className="py-16 border-b border-[#d6cebd]">
          <div className="max-w-3xl mb-12">
            <span className="eyebrow text-xs uppercase tracking-wider text-[#75581f]">
              What You Receive
            </span>
            <h2
              className="font-serif text-3xl sm:text-4xl text-[#1c1b18] mt-2 mb-3"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              The 5 Pillars of Our Mentorship Program
            </h2>
            <p className="text-[#46423a] text-base leading-relaxed">
              We provide structured educational blueprints and dedicated mentorship for motivated candidates entering independent financial solutions practice across Canada.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pillar 1 */}
            <div className="p-6 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full bg-[#2e4a3b]/10 text-[#2e4a3b] flex items-center justify-center mb-4">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-xl text-[#1c1b18] mb-2">
                  1. Zero Tuition or Coaching Dues
                </h3>
                <p className="text-sm text-[#46423a] leading-relaxed">
                  No franchise startup fees, desk fees, or training invoices. You receive our complete practice curriculum, study frameworks, and ongoing 1-on-1 coaching at zero cost.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-[#ece6da] text-xs text-[#2e4a3b] font-medium">
                100% Free Mentorship
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full bg-[#75581f]/10 text-[#75581f] flex items-center justify-center mb-4">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-xl text-[#1c1b18] mb-2">
                  2. Full Licensing Exam Support
                </h3>
                <p className="text-sm text-[#46423a] leading-relaxed">
                  We sponsor your regulatory eligibility and provide comprehensive study blueprints, practice exams, and coaching so you pass your Canadian LLQP exam with confidence.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-[#ece6da] text-xs text-[#75581f] font-medium">
                *Exam fees paid to regulatory bodies
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full bg-[#2e4a3b]/10 text-[#2e4a3b] flex items-center justify-center mb-4">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-xl text-[#1c1b18] mb-2">
                  3. Real Financial Architecture
                </h3>
                <p className="text-sm text-[#46423a] leading-relaxed">
                  Master the mechanics of registered tax shelters (TFSA, RRSP, FHSA, RESP), disability & critical illness protection, debt restructuring, and intergenerational estate transitions.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-[#ece6da] text-xs text-[#2e4a3b] font-medium">
                Comprehensive Solutions Architecture
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="p-6 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full bg-[#75581f]/10 text-[#75581f] flex items-center justify-center mb-4">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-xl text-[#1c1b18] mb-2">
                  4. Hands-On Field Co-Planning
                </h3>
                <p className="text-sm text-[#46423a] leading-relaxed">
                  You are never thrown into client meetings alone. Ahmed participates in your early consultations, double-checks file recommendations, and coaches you through client solutions.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-[#ece6da] text-xs text-[#75581f] font-medium">
                Direct Field Partnership
              </div>
            </div>

            {/* Pillar 5 */}
            <div className="p-6 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] flex flex-col justify-between md:col-span-2">
              <div>
                <div className="w-10 h-10 rounded-full bg-[#2e4a3b]/10 text-[#2e4a3b] flex items-center justify-center mb-4">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-xl text-[#1c1b18] mb-2">
                  5. Flexible Transition: Canada & USA Footprint
                </h3>
                <p className="text-sm text-[#46423a] leading-relaxed">
                  You don’t have to quit your employment to start. Build your foundation, acquire your provincial or state license, and onboard your first families during evenings and weekends across Canada and the US. Transition to full-time practice on your terms when your recurring revenue provides absolute security.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-[#ece6da] text-xs text-[#2e4a3b] font-medium">
                Low-Risk Professional Launchpad
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Fit Evaluator */}
        <section className="py-16 border-b border-[#d6cebd] bg-[#fcfaf5] -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="eyebrow text-xs uppercase tracking-wider text-[#75581f]">
                Self-Assessment
              </span>
              <h2
                className="font-serif text-3xl sm:text-4xl text-[#1c1b18] mt-2 mb-3"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Is Independent Financial Practice Right for You?
              </h2>
              <p className="text-sm text-[#46423a]">
                Select your location and situation to see your customized roadmap to licensing and agency launch.
              </p>
            </div>

            <div className="bg-[#f7f3eb] border border-[#d6cebd] p-6 sm:p-8 rounded-[2px] shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Question 1: Country / Market */}
                <div>
                  <label className="block text-xs font-semibold text-[#1c1b18] uppercase tracking-wider mb-2">
                    1. Country & Market
                  </label>
                  <div className="space-y-2">
                    {[
                      { id: "Canada", label: "Canada (LLQP Licensing)" },
                      { id: "USA", label: "United States (State Licensing)" },
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
                    2. Current Licensing
                  </label>
                  <div className="space-y-2">
                    {[
                      { id: "not_licensed", label: "Starting from Scratch" },
                      { id: "studying", label: "Currently Studying" },
                      { id: "already_licensed", label: "Already Licensed" },
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
                    3. Weekly Availability
                  </label>
                  <div className="space-y-2">
                    {[
                      { id: "part_time", label: "Part-Time (8–15 hrs/wk)" },
                      { id: "full_time", label: "Full-Time (30+ hrs/wk)" },
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
                      Your Customized Path
                    </span>
                    <span className="text-xs text-[#d6c298]">
                      {quizCountry === "Canada" ? "Canadian Practice Track" : "US Practice Track"}
                    </span>
                  </div>
                  <p className="text-sm sm:text-base font-serif text-[#f7f3eb]">
                    {quizStatus === "already_licensed"
                      ? "Fast-track onboarding: Direct carrier appointments and client co-planning sessions with Ahmed."
                      : quizTime === "part_time"
                      ? "Structured 90-day evening roadmap: Free study modules, mock test reviews, and weekly mentorship."
                      : "Accelerated full-time sprint: Complete licensing sponsorship and early field launch."}
                  </p>
                </div>
                <a
                  href="#apply-form"
                  className="btn bg-[#d6c298] text-[#14211a] hover:bg-white text-xs font-semibold px-4 py-2.5 whitespace-nowrap shrink-0 transition-colors"
                >
                  Start This Pathway &rarr;
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 4-Step Pathway */}
        <section className="py-16 border-b border-[#d6cebd]">
          <div className="max-w-3xl mb-12">
            <span className="eyebrow text-xs uppercase tracking-wider text-[#75581f]">
              The Roadmap
            </span>
            <h2
              className="font-serif text-3xl sm:text-4xl text-[#1c1b18] mt-2 mb-3"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              From Initial Conversation to Licensed Independent Professional
            </h2>
            <p className="text-[#46423a] text-base leading-relaxed">
              A transparent, step-by-step pathway across Canada and the US designed to take you from initial evaluation to managing your own flourishing financial practice.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-5 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] relative">
              <span className="font-serif text-3xl text-[#75581f]/40 font-bold block mb-2">01</span>
              <h3 className="font-serif text-lg text-[#1c1b18] mb-1.5">
                Discovery Session
              </h3>
              <p className="text-xs text-[#46423a] leading-relaxed">
                A 30-minute introductory conversation with Ahmed to explore mutual fit, discuss your schedule, and outline career goals.
              </p>
            </div>

            <div className="p-5 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] relative">
              <span className="font-serif text-3xl text-[#75581f]/40 font-bold block mb-2">02</span>
              <h3 className="font-serif text-lg text-[#1c1b18] mb-1.5">
                Licensing Prep & Coaching
              </h3>
              <p className="text-xs text-[#46423a] leading-relaxed">
                Free study materials, practice tests, and coaching to pass your provincial LLQP (Canada) or state exam (USA).
              </p>
            </div>

            <div className="p-5 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] relative">
              <span className="font-serif text-3xl text-[#75581f]/40 font-bold block mb-2">03</span>
              <h3 className="font-serif text-lg text-[#1c1b18] mb-1.5">
                Carrier Contracting
              </h3>
              <p className="text-xs text-[#46423a] leading-relaxed">
                Receive direct regulatory appointment and multi-carrier access to top Canadian & US insurance and investment platforms.
              </p>
            </div>

            <div className="p-5 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] relative">
              <span className="font-serif text-3xl text-[#2e4a3b]/40 font-bold block mb-2">04</span>
              <h3 className="font-serif text-lg text-[#1c1b18] mb-1.5">
                Mentored Launch
              </h3>
              <p className="text-xs text-[#46423a] leading-relaxed">
                Ahmed co-plans your early client consultations. Master file suitability, build long-term relationships, and earn performance-based commissions in full regulatory compliance.
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
                  Get Started Today
                </span>
                <h2
                  className="font-serif text-3xl sm:text-4xl text-[#1c1b18] mt-2 mb-3"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  Apply for the Educational Mentorship
                </h2>
                <p className="text-[#46423a] text-sm leading-relaxed">
                  Complete this brief questionnaire to connect with Ahmed. There are no coaching fees or obligations—just an honest conversation about the licensing process and whether independent financial practice aligns with your career goals.
                </p>
              </div>

              {/* Regulatory & Compliance Disclosure Banner */}
              <div className="mb-8 p-4 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] text-xs text-[#625d52] leading-relaxed space-y-1.5">
                <p className="font-semibold text-[#1c1b18]">
                  Provincial Licensing & Regulatory Notice:
                </p>
                <p>
                  In Canada, life insurance, living benefits, and segregated funds may only be recommended by individuals who have completed the Life License Qualification Program (LLQP) and hold active provincial registration (e.g., FSRA in Ontario, FCNB in New Brunswick, AIC in Alberta). Mentorship is educational and preparatory; candidates cannot advise or solicit clients until all regulatory approvals are active. Compensation is 100% performance-based on commissions from approved client business. No specific earnings are guaranteed.
                </p>
              </div>

              {submitSuccess ? (
                <div className="p-8 bg-[#2e4a3b] text-[#f7f3eb] rounded-[2px] shadow-sm space-y-4">
                  <div className="w-12 h-12 rounded-full bg-[#f7f3eb] text-[#2e4a3b] flex items-center justify-center">
                    <Check className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-2xl text-[#f7f3eb]">
                    Application Received, {formData.firstName}!
                  </h3>
                  <p className="text-sm text-[#ece6da] leading-relaxed">
                    Ahmed has received your application and will review your profile. You will receive a personal email follow-up within 1 to 2 business days.
                  </p>
                  {siteConfig.schedulingUrl && (
                    <div className="pt-4 border-t border-[#f7f3eb]/20">
                      <p className="text-xs text-[#d6c298] mb-3">
                        Want to discuss right away? Schedule your 30-minute discovery call directly on Ahmed’s calendar:
                      </p>
                      <a
                        href={siteConfig.schedulingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn bg-[#d6c298] text-[#14211a] hover:bg-white text-xs font-semibold px-4 py-2.5 inline-flex items-center gap-2 transition-colors"
                      >
                        <Calendar className="w-4 h-4 text-[#75581f]" />
                        <span>Book 30-Min Discovery Call &rarr;</span>
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
                        First Name <span className="text-[#8a3324]">*</span>
                      </label>
                      <input
                        id="mentorship-firstName"
                        type="text"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="e.g., Sarah"
                        className="w-full text-sm p-2.5 bg-[#f7f3eb] border border-[#d6cebd] rounded-[2px] focus:outline-none focus:border-[#2e4a3b]"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="mentorship-lastName"
                        className="block text-xs font-semibold text-[#1c1b18] mb-1"
                      >
                        Last Name
                      </label>
                      <input
                        id="mentorship-lastName"
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="e.g., Campbell"
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
                        Email Address <span className="text-[#8a3324]">*</span>
                      </label>
                      <input
                        id="mentorship-email"
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="sarah@example.com"
                        className="w-full text-sm p-2.5 bg-[#f7f3eb] border border-[#d6cebd] rounded-[2px] focus:outline-none focus:border-[#2e4a3b]"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="mentorship-phone"
                        className="block text-xs font-semibold text-[#1c1b18] mb-1"
                      >
                        Phone Number
                      </label>
                      <input
                        id="mentorship-phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+1-506-... or +1-404-..."
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
                        Country <span className="text-[#8a3324]">*</span>
                      </label>
                      <select
                        id="mentorship-country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full text-xs p-2.5 bg-[#f7f3eb] border border-[#d6cebd] rounded-[2px] focus:outline-none focus:border-[#2e4a3b]"
                      >
                        <option value="Canada">Canada</option>
                        <option value="USA">United States</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="mentorship-jurisdiction"
                        className="block text-xs font-semibold text-[#1c1b18] mb-1"
                      >
                        Province / State Region <span className="text-[#8a3324]">*</span>
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
                        Current Licensing Status
                      </label>
                      <select
                        id="mentorship-licensingStatus"
                        name="licensingStatus"
                        value={formData.licensingStatus}
                        onChange={handleInputChange}
                        className="w-full text-xs p-2.5 bg-[#f7f3eb] border border-[#d6cebd] rounded-[2px] focus:outline-none focus:border-[#2e4a3b]"
                      >
                        <option value="not_licensed">Not Licensed (Need Training)</option>
                        <option value="studying">Currently Studying (LLQP or State)</option>
                        <option value="already_licensed">Already Licensed</option>
                        <option value="other_license">Other Financial Registration</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="mentorship-availability"
                        className="block text-xs font-semibold text-[#1c1b18] mb-1"
                      >
                        Weekly Availability
                      </label>
                      <select
                        id="mentorship-availability"
                        name="availability"
                        value={formData.availability}
                        onChange={handleInputChange}
                        className="w-full text-xs p-2.5 bg-[#f7f3eb] border border-[#d6cebd] rounded-[2px] focus:outline-none focus:border-[#2e4a3b]"
                      >
                        <option value="part_time">Part-Time (8–15 hrs/wk)</option>
                        <option value="flexible">Flexible Career Transition</option>
                        <option value="full_time">Full-Time (30+ hrs/wk)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="mentorship-background"
                      className="block text-xs font-semibold text-[#1c1b18] mb-1"
                    >
                      Current Career or Background
                    </label>
                    <input
                      id="mentorship-background"
                      type="text"
                      name="background"
                      value={formData.background}
                      onChange={handleInputChange}
                      placeholder="e.g., Healthcare, Education, Engineering, Sales, Accounting"
                      className="w-full text-sm p-2.5 bg-[#f7f3eb] border border-[#d6cebd] rounded-[2px] focus:outline-none focus:border-[#2e4a3b]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="mentorship-message"
                      className="block text-xs font-semibold text-[#1c1b18] mb-1"
                    >
                      Why are you interested in building an independent practice?
                    </label>
                    <textarea
                      id="mentorship-message"
                      name="message"
                      rows={3}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Share your goals, schedule expectations, or any questions for Ahmed..."
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
                      I agree to the{" "}
                      <Link to="/privacy" target="_blank" rel="noopener noreferrer" className="underline text-[#2e4a3b]">
                        privacy notice
                      </Link>
                      . I understand my information is confidential and will be used solely by Ahmed Bello to evaluate mentorship fit.
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-primary w-full py-3 text-sm font-medium flex items-center justify-center gap-2 mt-4"
                  >
                    {submitting ? (
                      <span>Submitting Application...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Mentorship Application</span>
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
                      <span>Prefer to Speak Directly?</span>
                    </div>
                    <h3 className="font-serif text-2xl text-[#f7f3eb] mb-2">
                      Schedule a 30-Min Discovery Call
                    </h3>
                    <p className="text-xs text-[#ece6da] leading-relaxed mb-4">
                      Book directly on Ahmed’s calendar to discuss the practice model, regulatory licensing pathways in your province or state, and how our coaching operates.
                    </p>
                  </div>
                  <a
                    href={siteConfig.schedulingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn bg-[#d6c298] text-[#14211a] hover:bg-white text-xs font-semibold px-4 py-3 text-center inline-flex items-center justify-center gap-2 transition-colors group"
                  >
                    <Calendar className="w-4 h-4 text-[#75581f]" />
                    <span>Open Ahmed’s Calendly Schedule</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#75581f] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              )}

              {/* Direct Practice Contact Details */}
              <div className="p-6 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] space-y-4">
                <h4 className="font-serif text-lg text-[#1c1b18]">
                  Practice Mentorship Office
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
                      Headquartered in New Brunswick, Canada. Mentoring independent professionals across all Canadian provinces/territories and throughout the United States.
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
              Frequently Asked Questions
            </span>
            <h2
              className="font-serif text-3xl sm:text-4xl text-[#1c1b18] mt-2 mb-3"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Common Questions About Mentorship & Licensing
            </h2>
            <p className="text-[#46423a] text-sm leading-relaxed">
              Clear, transparent answers regarding exam costs, Canadian vs. US regulatory requirements, and practice equity.
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
                    &rarr;
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
