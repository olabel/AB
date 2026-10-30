import React from "react";
import { Link } from "react-router-dom";
import { DecisionMap } from "../components/DecisionMap.tsx";
import { MoneyStructureStudio } from "../components/MoneyStructureStudio.tsx";
import { BrandMark } from "../components/BrandMark.tsx";
import { Tbc } from "../components/Tbc.tsx";
import { articles } from "../content/data.ts";
import { siteConfig } from "../config/site.ts";
import { ArrowRight, HelpCircle, Stethoscope, Briefcase, Users, Compass } from "lucide-react";
import { NewsletterSignup } from "../components/NewsletterSignup.tsx";
import { useLanguage } from "../context/LanguageContext.tsx";
import { SEO } from "../components/SEO.tsx";

export const HomePage: React.FC = () => {
  const { language, t } = useLanguage();

  // Targeted low-competition Canadian financial guides
  const previewSlugs = [
    "new-to-canada-money-basics",
    "fhsa-explained",
    "term-vs-permanent-life-insurance",
    "tfsa-vs-rrsp",
  ];
  const previewGuides = previewSlugs
    .map((s) => articles.find((a) => a.slug === s))
    .filter(Boolean);

  const initialQuestions = language === "fr"
    ? [
        {
          num: "01",
          question: "Comment devrais-je prioriser mes objectifs financiers ?",
          href: "/fr/how-i-help#priorities",
        },
        {
          num: "02",
          question: "Que dois-je comprendre avant de choisir un compte enregistré ?",
          href: "/fr/how-i-help#accounts",
        },
        {
          num: "03",
          question: "Quelle part du revenu de mon foyer dépend de ma capacité à travailler ?",
          href: "/fr/how-i-help#income",
        },
        {
          num: "04",
          question: "Que savoir avant de prendre une décision d'investissement ?",
          href: "/fr/how-i-help#investing",
        },
        {
          num: "05",
          question: "Comment anticiper le financement des études de mes enfants ?",
          href: "/fr/how-i-help#education",
        },
        {
          num: "06",
          question: "Que devrais-je considérer à l'approche de la retraite ?",
          href: "/fr/how-i-help#retirement",
        },
      ]
    : [
        {
          num: "01",
          question: "How should I prioritize my financial goals?",
          href: "/how-i-help#priorities",
        },
        {
          num: "02",
          question: "What should I understand before choosing a registered account?",
          href: "/how-i-help#accounts",
        },
        {
          num: "03",
          question: "How much of my household income depends on my ability to work?",
          href: "/how-i-help#income",
        },
        {
          num: "04",
          question: "What should I know before making an investment decision?",
          href: "/how-i-help#investing",
        },
        {
          num: "05",
          question: "How can I prepare for my children’s education?",
          href: "/how-i-help#education",
        },
        {
          num: "06",
          question: "What should I consider as retirement approaches?",
          href: "/how-i-help#retirement",
        },
      ];

  const helpAreas = language === "fr"
    ? [
        {
          num: "01",
          title: "Fondations financières",
          question: "Où va mon argent et que me coûterait un imprévu ?",
          desc: "Concepts budgétaires, épargne d'urgence, gestion des dettes et flux de trésorerie.",
          href: "/fr/how-i-help#priorities",
        },
        {
          num: "02",
          title: "Éducation à l'épargne et l'investissement",
          question: "Dans quel compte allouer mon prochain dollar, et avec quel niveau de risque ?",
          desc: "Règles du CELI, REER, CELIAPP et REEE, diversification et horizon temporel.",
          href: "/fr/how-i-help#accounts",
        },
        {
          num: "03",
          title: "Protection financière",
          question: "Quelle part de notre revenu dépend de ma capacité de travail ?",
          desc: "Remplacement du revenu, assurance vie, maladies graves et concepts de prévoyance.",
          href: "/fr/how-i-help#income",
        },
        {
          num: "04",
          title: "Planification familiale et long terme",
          question: "Comment concilier études, retraite et quotidien au fil des ans ?",
          desc: "Épargne-études, préparation de la retraite et coordination des priorités familiales.",
          href: "/fr/how-i-help#education",
        },
        {
          num: "05",
          title: "Littératie financière pour nouveaux arrivants",
          question: "Qu'est-ce qui fonctionne différemment au Canada et démarre de zéro ?",
          desc: "Terminologie canadienne, comptes enregistrés, dossier de crédit et premières démarches.",
          href: "/fr/how-i-help#newcomers",
        },
      ]
    : [
        {
          num: "01",
          title: "Financial foundations",
          question: "Where is my money going, and what would a surprise cost me?",
          desc: "Budgeting concepts, emergency savings, debt awareness and cash-flow decisions.",
          href: "/how-i-help#priorities",
        },
        {
          num: "02",
          title: "Savings and investment education",
          question: "Which account does my next dollar belong in, and how much risk is it taking?",
          desc: "TFSA, RRSP, FHSA and RESP rules, risk, diversification and time horizon.",
          href: "/how-i-help#accounts",
        },
        {
          num: "03",
          title: "Financial protection",
          question: "How much of my household income depends on my ability to work?",
          desc: "Income replacement, life and critical illness insurance, and other protection concepts.",
          href: "/how-i-help#income",
        },
        {
          num: "04",
          title: "Family and long-term planning",
          question: "How do education, retirement and everyday life fit together over time?",
          desc: "Education savings, retirement preparation and coordinating priorities as life changes.",
          href: "/how-i-help#education",
        },
        {
          num: "05",
          title: "Financial literacy for newcomers",
          question: "What works differently in Canada, and what starts from zero?",
          desc: "Canadian terminology, registered accounts, credit and the decisions newcomers meet first.",
          href: "/how-i-help#newcomers",
        },
      ];

  return (
    <div>
      <SEO
        title={language === "fr" ? "Ahmed Bello | Éducation Financière pour Canadiens" : "Ahmed Bello | Financial Education for Canadians"}
        description={
          language === "fr"
            ? "Éducation financière en langage clair sur les régimes enregistrés (CELI, REER, CELIAPP), l'assurance vie et les décisions budgétaires avec Ahmed Bello."
            : "Plain-language Canadian financial education on registered accounts (TFSA, RRSP, FHSA), insurance, and family money decisions with Ahmed Bello."
        }
      />
      {/* 1. Hero Section */}
      <section className="section pb-16 pt-10 md:pt-16 border-b border-[#d6cebd]">
        <div className="wrap">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Core Message & Action */}
            <div className="lg:col-span-7 space-y-6">
              <span className="eyebrow text-xs">
                {language === "fr" ? "Clarté financière au quotidien" : "Financial clarity for real life"}
              </span>
              <h1 className="display text-[#1c1b18] leading-[1.08] tracking-[-0.018em]">
                {language === "fr" ? (
                  <>
                    Vos décisions financières sont liées.{" "}
                    <em className="italic font-serif font-normal text-[#2e4a3b]">
                      Les réponses devraient l'être aussi.
                    </em>
                  </>
                ) : (
                  <>
                    Your money questions are connected.{" "}
                    <em className="italic font-serif font-normal text-[#2e4a3b]">
                      The answers should be, too.
                    </em>
                  </>
                )}
              </h1>
              <p className="lede text-lg md:text-xl text-[#46423a] max-w-2xl leading-relaxed">
                {language === "fr"
                  ? "De la protection du revenu familial aux régimes enregistrés (CELI, REER, CELIAPP) et à la gestion des dettes, de meilleures décisions commencent par une vue d'ensemble."
                  : "From protecting your family’s income to registered accounts, debt choices and family priorities, better decisions begin with seeing how the pieces fit together."}
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link to="/how-i-help" className="btn btn-primary text-base px-6 py-3">
                  {language === "fr" ? "Explorer comment j'aide →" : "Explore How I Help →"}
                </Link>
                <Link to="/education" className="btn btn-ghost text-base px-6 py-3">
                  {language === "fr" ? "Apprendre avant de décider" : "Learn Before You Decide"}
                </Link>
              </div>
              {/* Trust Indicators */}
              <div className="pt-4 border-t border-[#d6cebd]/70 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#625d52]">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2e4a3b]" />
                  <span>{language === "fr" ? "Pratique indépendante" : "Independent Practice"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#75581f]" />
                  <span>{language === "fr" ? "Agréé partout au Canada" : "Licensed Across Canada"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2e4a3b]" />
                  <span>{language === "fr" ? "Zéro pression commerciale" : "Zero Sales Pressure"}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Ahmed Bello Portrait Presentation */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="w-full max-w-sm bg-[#fcfaf5] border border-[#d6cebd] p-3 sm:p-4 rounded-[2px] shadow-sm relative group">
                {/* Portrait Matte Frame */}
                <div className="border border-[#75581f]/25 bg-[#ece6da]/40 p-1 rounded-[1px] relative overflow-hidden">
                  <img
                    src="/assets/aistudio/unnamed_dd5949a8.webp"
                    alt="Ahmed Bello, Licensed Financial Solutions Professional"
                    className="w-full aspect-[4/5] object-cover object-top rounded-[1px] filter contrast-[1.02]"
                    width={400}
                    height={500}
                    loading="eager"
                  />
                  {/* Subtle corner architectural accents */}
                  <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-[#d6c298]" />
                  <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-[#d6c298]" />
                </div>

                {/* Portrait Plaque / Caption */}
                <div className="mt-3.5 pt-3 border-t border-[#d6cebd] flex items-center justify-between gap-3 text-left">
                  <div className="flex items-center gap-2.5">
                    <BrandMark size={28} className="w-7 h-7 shrink-0 text-[#2e4a3b]" />
                    <div>
                      <p className="font-serif text-lg text-[#1c1b18] leading-tight">Ahmed Bello</p>
                      <p className="text-[0.68rem] uppercase tracking-wider text-[#75581f] font-semibold">
                        Licensed Financial Professional
                      </p>
                    </div>
                  </div>
                  <Link
                    to="/about"
                    className="text-xs text-[#2e4a3b] font-medium hover:underline shrink-0"
                    title="Read more about Ahmed"
                  >
                    About &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Targeted High-Intent Questions Strip (Low-Competition Search Targets) */}
      <section className="bg-[#fcfaf5] border-b border-[#d6cebd] py-6">
        <div className="wrap">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#75581f] shrink-0">
              {language === "fr" ? "Questions financières ciblées :" : "Targeted Canadian Questions:"}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 flex-1">
              <Link
                to="/education/new-to-canada-money-basics"
                className="p-2.5 bg-[#f7f3eb] hover:bg-white border border-[#d6cebd] hover:border-[#2e4a3b] rounded-[2px] text-xs text-[#1c1b18] font-medium transition-colors flex items-center justify-between group"
              >
                <span>{language === "fr" ? "Nouveaux arrivants : 1re année" : "Newcomers' First-Year Steps"}</span>
                <span className="text-[#2e4a3b] font-mono group-hover:translate-x-0.5 transition-transform">&rarr;</span>
              </Link>
              <Link
                to="/education/fhsa-explained"
                className="p-2.5 bg-[#f7f3eb] hover:bg-white border border-[#d6cebd] hover:border-[#2e4a3b] rounded-[2px] text-xs text-[#1c1b18] font-medium transition-colors flex items-center justify-between group"
              >
                <span>{language === "fr" ? "CELIAPP + RAP (100k$ non taxé)" : "FHSA + Home Buyers' Plan"}</span>
                <span className="text-[#2e4a3b] font-mono group-hover:translate-x-0.5 transition-transform">&rarr;</span>
              </Link>
              <Link
                to="/education/new-to-canada-money-basics"
                className="p-2.5 bg-[#f7f3eb] hover:bg-white border border-[#d6cebd] hover:border-[#2e4a3b] rounded-[2px] text-xs text-[#1c1b18] font-medium transition-colors flex items-center justify-between group"
              >
                <span>{language === "fr" ? "Bâtir son crédit au Canada" : "Building Canadian Credit"}</span>
                <span className="text-[#2e4a3b] font-mono group-hover:translate-x-0.5 transition-transform">&rarr;</span>
              </Link>
              <Link
                to="/education/term-vs-permanent-life-insurance"
                className="p-2.5 bg-[#f7f3eb] hover:bg-white border border-[#d6cebd] hover:border-[#2e4a3b] rounded-[2px] text-xs text-[#1c1b18] font-medium transition-colors flex items-center justify-between group"
              >
                <span>{language === "fr" ? "Assurance temporaire vs perm." : "Term vs Permanent Insurance"}</span>
                <span className="text-[#2e4a3b] font-mono group-hover:translate-x-0.5 transition-transform">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Questions Worth Asking First */}
      <section className="section py-16 border-b border-[#d6cebd] bg-[#fcfaf5]">
        <div className="wrap">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <span className="eyebrow text-xs">
                {language === "fr" ? "Points de départ" : "Starting points"}
              </span>
              <h2 className="h2 text-[#1c1b18] mt-1">
                {language === "fr" ? "Questions prioritaires à se poser" : "Questions worth asking first"}
              </h2>
            </div>
            <p className="text-sm text-[#625d52] max-w-md">
              {language === "fr"
                ? "La plupart des gens commencent par un produit. Une meilleure décision commence par la question sous-jacente."
                : "Most people start with a product. A better decision starts with the question behind it."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {initialQuestions.map((q) => (
              <Link
                key={q.num}
                to={q.href}
                className="p-6 bg-[#f7f3eb] border border-[#d6cebd] rounded-[2px] hover:border-[#2e4a3b] transition-all group flex flex-col justify-between"
              >
                <div>
                  <span className="font-mono text-xs text-[#75581f] font-semibold block mb-2">
                    {q.num}
                  </span>
                  <p className="font-serif text-xl text-[#1c1b18] group-hover:text-[#2e4a3b] transition-colors leading-snug">
                    {q.question}
                  </p>
                </div>
                <div className="pt-6 flex items-center gap-1.5 text-xs font-semibold text-[#2e4a3b]">
                  <span>{language === "fr" ? "Explorer le sujet" : "Explore topic"}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 p-4 bg-[#ece6da]/50 border-l-2 border-[#8d8677] text-xs text-[#46423a] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p>
              <strong>{language === "fr" ? "L'éducation d'abord." : "Education first."}</strong>{" "}
              {language === "fr"
                ? "Ce site explique des concepts financiers généraux ; il ne s'agit pas de conseils personnalisés."
                : "This site explains financial concepts; it is not personalized advice."}
            </p>
            <Link to={language === "fr" ? "/fr/disclosures" : "/disclosures"} className="underline font-medium text-[#2e4a3b] shrink-0">
              {language === "fr" ? "Fonctionnement du site →" : "How this site works →"}
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Interactive Decision Map Section */}
      <section className="section py-20 border-b border-[#d6cebd]">
        <div className="wrap space-y-10">
          <div className="max-w-3xl">
            <span className="eyebrow text-xs">
              {language === "fr" ? "L'articulation des choix" : "How the pieces fit"}
            </span>
            <h2 className="h2 text-[#1c1b18] mt-1">
              {language === "fr"
                ? "La plupart des décisions financières ne se prennent pas isolément."
                : "Most financial decisions don’t happen in isolation."}
            </h2>
            <p className="lede text-base md:text-lg text-[#46423a] mt-3">
              {language === "fr"
                ? "Rembourser une dette, choisir un compte enregistré et protéger votre revenu sollicitent les mêmes dollars et les mêmes années. Comprendre leurs liens est souvent la première étape utile."
                : "Paying down a debt, choosing an account and protecting your income all pull on the same dollars and the same years. Seeing the connections is often the first useful step."}
            </p>
          </div>

          <DecisionMap />
        </div>
      </section>

      {/* 3b. Interactive Money Structure Architecture & Stress-Test Studio */}
      <section className="section py-20 border-b border-[#d6cebd]">
        <div className="wrap max-w-5xl">
          <MoneyStructureStudio />
        </div>
      </section>

      {/* 4. How I Help (5 Areas) */}
      <section className="section py-20 border-b border-[#d6cebd] bg-[#fcfaf5]">
        <div className="wrap space-y-12">
          <div className="max-w-3xl space-y-3">
            <span className="eyebrow text-xs">
              {language === "fr" ? "Comment j'accompagne" : "How I help"}
            </span>
            <h2 className="h2 text-[#1c1b18]">
              {language === "fr"
                ? "Cinq domaines, chacun articulé autour d'une vraie question."
                : "Five areas, each built around a real question."}
            </h2>
            <p className="text-sm md:text-base text-[#46423a] leading-relaxed">
              {language === "fr"
                ? "Tout ce qui suit commence par de l'éducation. Les démarches complémentaires dépendent des autorisations provinciales et réglementaires, et certaines questions relèvent d'autres professionnels qualifiés."
                : "Everything below starts as education. What I can do beyond that depends on provincial licensing and regulatory approvals, and some questions belong with other qualified professionals."}
            </p>
            <div className="pt-2">
              <Link to={language === "fr" ? "/fr/how-i-help#scope" : "/how-i-help#scope"} className="arrow-link text-sm">
                {language === "fr"
                  ? "Ce qui relève de l'éducation, d'un échange ou d'une recommandation externe →"
                  : "What’s education, what’s a conversation, what’s a referral →"}
              </Link>
            </div>
          </div>

          <div className="divide-y divide-[#d6cebd] border-y border-[#d6cebd]">
            {helpAreas.map((area) => (
              <Link
                key={area.num}
                to={area.href}
                className="py-8 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start group hover:bg-[#f7f3eb]/70 transition-colors px-3 rounded-[2px]"
              >
                <div className="md:col-span-1 font-mono text-xs text-[#75581f] font-semibold pt-1">
                  {area.num}
                </div>
                <div className="md:col-span-4">
                  <h3 className="h3 text-[#1c1b18] group-hover:text-[#2e4a3b] transition-colors leading-tight">
                    {area.title}
                  </h3>
                </div>
                <div className="md:col-span-6 space-y-1.5">
                  <p className="font-serif italic text-[#1c1b18] text-lg leading-snug">
                    {area.question}
                  </p>
                  <p className="text-sm text-[#625d52]">{area.desc}</p>
                </div>
                <div className="md:col-span-1 flex justify-end pt-2 text-[#2e4a3b]">
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Four-Stage Approach (Dark Forest Section) */}
      <section className="section py-20 bg-[#14211a] text-[#f7f3eb] on-dark border-b border-[#2e4a3b]">
        <div className="wrap space-y-14">
          <div className="max-w-2xl space-y-3">
            <span className="eyebrow text-xs text-[#d6c298]">
              {language === "fr" ? "La démarche" : "The approach"}
            </span>
            <h2 className="h2 text-white">
              {language === "fr"
                ? "La clarté avant la complexité. Comprendre avant de décider."
                : "Clarity before complexity. Understanding before decisions."}
            </h2>
            <p className="text-sm md:text-base text-[#ece6da]/80">
              {language === "fr"
                ? "Un parcours structuré en quatre étapes conçu pour vous offrir une parfaite maîtrise de vos décisions financières."
                : "A structured four-step path designed to give you clarity and complete ownership over your financial choices."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 bg-[#2e4a3b]/30 border border-[#d6c298]/20 rounded-[2px] space-y-3">
              <span className="font-mono text-xs text-[#d6c298] font-semibold block">01</span>
              <h3 className="h3 text-white">
                {language === "fr" ? "Comprendre" : "Understand"}
              </h3>
              <p className="text-sm text-[#ece6da]/80 leading-relaxed">
                {language === "fr"
                  ? "Nous clarifions votre situation, vos questions et ce qui compte le plus pour vous avant toute explication ou orientation."
                  : "We clarify your situation, your questions and what matters most to you, before anything is explained or suggested."}
              </p>
            </div>

            <div className="p-6 bg-[#2e4a3b]/30 border border-[#d6c298]/20 rounded-[2px] space-y-3">
              <span className="font-mono text-xs text-[#d6c298] font-semibold block">02</span>
              <h3 className="h3 text-white">
                {language === "fr" ? "Éduquer" : "Educate"}
              </h3>
              <p className="text-sm text-[#ece6da]/80 leading-relaxed">
                {language === "fr"
                  ? "J'explique les concepts pertinents, les alternatives et les compromis en langage clair, pour que vous puissiez en juger vous-même."
                  : "I explain the relevant concepts, the alternatives and the trade-offs in plain language, so you can judge them yourself."}
              </p>
            </div>

            <div className="p-6 bg-[#2e4a3b]/30 border border-[#d6c298]/20 rounded-[2px] space-y-3">
              <span className="font-mono text-xs text-[#d6c298] font-semibold block">03</span>
              <h3 className="h3 text-white">
                {language === "fr" ? "Explorer" : "Explore"}
              </h3>
              <p className="text-sm text-[#ece6da]/80 leading-relaxed">
                {language === "fr"
                  ? "Lorsque c'est pertinent, et dans le cadre des services autorisés par mes permis, nous analysons les solutions adaptées."
                  : "Where it is appropriate, and within the scope of the services I am authorized to offer, we discuss options that could fit."}
              </p>
            </div>

            <div className="p-6 bg-[#2e4a3b]/30 border border-[#d6c298]/20 rounded-[2px] space-y-3">
              <span className="font-mono text-xs text-[#d6c298] font-semibold block">04</span>
              <h3 className="h3 text-white">
                {language === "fr" ? "Réviser" : "Review"}
              </h3>
              <p className="text-sm text-[#ece6da]/80 leading-relaxed">
                {language === "fr"
                  ? "Nous identifions les prochaines étapes et réexaminons vos priorités dès que votre situation personnelle ou familiale évolue."
                  : "We identify next steps and revisit your priorities when your circumstances change."}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-[#d6c298]/20 text-xs text-[#ece6da]/65 leading-relaxed max-w-3xl">
            {language === "fr"
              ? "Tous les échanges n'impliquent pas chacune de ces étapes. Une conversation ne constitue pas une promesse de plan complet, de gestion de portefeuille ou d'avis fiscal. Les services offerts dépendent des autorisations et permis réglementaires actifs."
              : "Not every conversation includes every stage, and a conversation is not a promise of a comprehensive plan, portfolio management, tax advice or ongoing service. What is available depends on what I am licensed and authorized to provide."}
          </div>
        </div>
      </section>

      {/* 5.5. Audience Hubs: Browse by Situation & Profession */}
      <section className="section py-16 border-b border-[#d6cebd] bg-[#fcfaf5]">
        <div className="wrap space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="eyebrow text-xs uppercase tracking-wider text-[#75581f]">
                {language === "fr" ? "Parcours personnalisés" : "Targeted Topic Clusters"}
              </span>
              <h2 className="h2 text-[#1c1b18] mt-1">
                {language === "fr" ? "Trouvez des réponses adaptées à votre profil" : "Find Answers for Your Specific Situation"}
              </h2>
              <p className="text-sm text-[#46423a] mt-2 max-w-xl">
                {language === "fr"
                  ? "Explorez nos carrefours thématiques regroupant des règles statutaires, des guides et des simulateurs pour votre situation."
                  : "Explore curated guides, statutory rules, and interactive tools specifically grouped for your stage of life or profession."}
              </p>
            </div>
            <Link to={language === "fr" ? "/fr/education" : "/education"} className="arrow-link text-xs font-semibold shrink-0">
              {language === "fr" ? "Toute la bibliothèque →" : "View all library topics &rarr;"}
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Islamic Investing Campaign Feature */}
            <Link
              to={language === "fr" ? "/fr/investing/islamic-equity" : "/investing/islamic-equity"}
              className="p-5 bg-[#14211a] text-[#f7f3eb] border border-[#d6c298] hover:border-[#52b788] rounded-[2px] transition-all group flex flex-col justify-between hover:shadow-md"
            >
              <div>
                <div className="p-2 w-fit bg-[#d6c298]/20 rounded-[2px] text-[#d6c298] mb-3">
                  <span className="font-serif font-bold text-sm tracking-wider">HALAL</span>
                </div>
                <h3 className="font-serif text-lg font-medium text-white group-hover:text-[#d6c298] transition-colors leading-snug">
                  {language === "fr" ? "Investissement Islamique" : "Islamic Investing"}
                </h3>
                <p className="text-xs text-[#ece6da]/80 mt-2 leading-relaxed">
                  {language === "fr"
                    ? "Indice mondial MSCI ACWI Islamic (BlackRock & iA). 100% conforme Shari'ah dans CELI, REER et CELIAPP."
                    : "MSCI ACWI Islamic Index (BlackRock & iA). 100% Shari'ah-compliant inside TFSA, RRSP & FHSA."}
                </p>
              </div>
              <span className="text-xs font-semibold text-[#d6c298] pt-4 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                {language === "fr" ? "Campagne Halal →" : "Explore Campaign →"}
              </span>
            </Link>

            <Link
              to={language === "fr" ? "/fr/for/healthcare" : "/for/healthcare"}
              className="p-5 bg-[#f7f3eb] border border-[#d6cebd] hover:border-[#2e4a3b] rounded-[2px] transition-all group flex flex-col justify-between hover:shadow-xs"
            >
              <div>
                <div className="p-2 w-fit bg-[#2e4a3b]/10 rounded-[2px] text-[#2e4a3b] mb-3">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-medium text-[#1c1b18] group-hover:text-[#2e4a3b] transition-colors leading-snug">
                  {language === "fr" ? "Santé & Médecins" : "Healthcare & Doctors"}
                </h3>
                <p className="text-xs text-[#625d52] mt-2 leading-relaxed">
                  {language === "fr"
                    ? "Délai d'équivalence, trésorerie de transition et protection du revenu médical."
                    : "Licensing gap planning, credential fees, and income protection."}
                </p>
              </div>
              <span className="text-xs font-semibold text-[#2e4a3b] pt-4 flex items-center gap-1">
                {language === "fr" ? "Explorer →" : "Explore hub &rarr;"}
              </span>
            </Link>

            <Link
              to={language === "fr" ? "/fr/for/business-owners" : "/for/business-owners"}
              className="p-5 bg-[#f7f3eb] border border-[#d6cebd] hover:border-[#2e4a3b] rounded-[2px] transition-all group flex flex-col justify-between hover:shadow-xs"
            >
              <div>
                <div className="p-2 w-fit bg-[#2e4a3b]/10 rounded-[2px] text-[#2e4a3b] mb-3">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-medium text-[#1c1b18] group-hover:text-[#2e4a3b] transition-colors leading-snug">
                  {language === "fr" ? "Entreprises & SPCC" : "Business Owners"}
                </h3>
                <p className="text-xs text-[#625d52] mt-2 leading-relaxed">
                  {language === "fr"
                    ? "Règles d'imposition du capital, dividendes en capital (CDC) et gel de société."
                    : "Corporate capital gains rules, CDA extraction, and estate freezes."}
                </p>
              </div>
              <span className="text-xs font-semibold text-[#2e4a3b] pt-4 flex items-center gap-1">
                {language === "fr" ? "Explorer →" : "Explore hub &rarr;"}
              </span>
            </Link>

            <Link
              to={language === "fr" ? "/fr/for/families" : "/for/families"}
              className="p-5 bg-[#f7f3eb] border border-[#d6cebd] hover:border-[#2e4a3b] rounded-[2px] transition-all group flex flex-col justify-between hover:shadow-xs"
            >
              <div>
                <div className="p-2 w-fit bg-[#2e4a3b]/10 rounded-[2px] text-[#2e4a3b] mb-3">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-medium text-[#1c1b18] group-hover:text-[#2e4a3b] transition-colors leading-snug">
                  {language === "fr" ? "Familles canadiennes" : "Canadian Families"}
                </h3>
                <p className="text-xs text-[#625d52] mt-2 leading-relaxed">
                  {language === "fr"
                    ? "Choc hypothécaire, CELIAPP + RAP (100k$ non taxé) et épargne REEE."
                    : "Mortgage renewal shock, FHSA + HBP pairing, and RESP grants."}
                </p>
              </div>
              <span className="text-xs font-semibold text-[#2e4a3b] pt-4 flex items-center gap-1">
                {language === "fr" ? "Explorer →" : "Explore hub &rarr;"}
              </span>
            </Link>

            <Link
              to={language === "fr" ? "/fr/for/newcomers" : "/for/newcomers"}
              className="p-5 bg-[#f7f3eb] border border-[#d6cebd] hover:border-[#2e4a3b] rounded-[2px] transition-all group flex flex-col justify-between hover:shadow-xs"
            >
              <div>
                <div className="p-2 w-fit bg-[#2e4a3b]/10 rounded-[2px] text-[#2e4a3b] mb-3">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-medium text-[#1c1b18] group-hover:text-[#2e4a3b] transition-colors leading-snug">
                  {language === "fr" ? "Nouveaux arrivants" : "New to Canada"}
                </h3>
                <p className="text-xs text-[#625d52] mt-2 leading-relaxed">
                  {language === "fr"
                    ? "Bâtir son crédit de zéro, résidence fiscale et simulateur de survie."
                    : "Credit building from scratch, tax residency, and runway calculator."}
                </p>
              </div>
              <span className="text-xs font-semibold text-[#2e4a3b] pt-4 flex items-center gap-1">
                {language === "fr" ? "Explorer →" : "Explore hub &rarr;"}
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Education Preview (4 Guides) */}
      <section className="section py-20 border-b border-[#d6cebd]">
        <div className="wrap space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="eyebrow text-xs">
                {language === "fr" ? "Éducation financière" : "Financial education"}
              </span>
              <h2 className="h2 text-[#1c1b18] mt-1">
                {language === "fr" ? "Apprenez avant de décider." : "Learn before you decide."}
              </h2>
              <p className="text-sm text-[#46423a] mt-2 max-w-xl">
                {language === "fr"
                  ? "Des explications en langage clair sur le fonctionnement réel des régimes enregistrés canadiens, de l'endettement, du risque et de la protection — avec compromis, sources et exemples concrets."
                  : "Plain-language explainers on how Canadian accounts, debt, risk and protection really work — with the trade-offs, sources and hypothetical examples included."}
              </p>
            </div>
            <Link to={language === "fr" ? "/fr/education" : "/education"} className="btn btn-ghost text-sm shrink-0">
              {language === "fr" ? "Consulter la bibliothèque →" : "Browse the library →"}
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {previewGuides.map((guide) => {
              if (!guide) return null;
              const guideUrl = language === "fr" ? `/fr${guide.url}` : guide.url;
              return (
                <article
                  key={guide.slug}
                  className="p-7 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] flex flex-col justify-between hover:border-[#2e4a3b] transition-all group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs text-[#625d52]">
                      <span className="font-semibold text-[#2e4a3b] uppercase tracking-wider text-[0.7rem]">
                        {guide.category.replace("-", " ")}
                      </span>
                      <span>/</span>
                      <span>
                        {guide.readingMinutes} {language === "fr" ? "min de lecture" : "min read"}
                      </span>
                    </div>

                    <h3 className="h3 text-[#1c1b18] group-hover:text-[#2e4a3b] transition-colors leading-snug">
                      <Link to={guideUrl}>{guide.title}</Link>
                    </h3>

                    <div className="p-3 bg-[#f7f3eb] border-l border-[#8d8677] text-xs text-[#46423a]">
                      <strong>{language === "fr" ? "La question :" : "The question:"}</strong> {guide.question}
                    </div>
                  </div>

                  <div className="pt-6">
                    <Link
                      to={guideUrl}
                      className="text-xs font-semibold text-[#2e4a3b] flex items-center gap-1.5 group-hover:underline"
                    >
                      <span>{language === "fr" ? "Lire l'article" : "Read the article"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. About Ahmed Preview */}
      <section className="section py-20 border-b border-[#d6cebd] bg-[#fcfaf5]">
        <div className="wrap">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Smaller, Round Portrait Presentation */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <div className="relative p-2 rounded-full bg-gradient-to-tr from-[#2e4a3b] via-[#d6c298] to-[#2e4a3b] shadow-md">
                <div className="p-1 rounded-full bg-[#f7f3eb]">
                  <img
                    src={siteConfig.headshotUrl}
                    alt="Ahmed Bello, Licensed Financial Solutions Professional"
                    className="w-44 h-44 sm:w-52 sm:h-52 object-cover object-top rounded-full filter contrast-[1.02]"
                    width={208}
                    height={208}
                    loading="lazy"
                  />
                </div>
                {/* Subtle Keystone Badge */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-[#2e4a3b] text-[#f7f3eb] border border-[#d6c298] rounded-full text-[0.68rem] uppercase tracking-wider font-semibold shadow-xs whitespace-nowrap">
                  Ahmed Bello
                </div>
              </div>

              <div className="mt-5 text-center space-y-0.5">
                <p className="text-xs uppercase tracking-wider text-[#75581f] font-semibold">
                  {siteConfig.designation}
                </p>
                <p className="text-[0.72rem] text-[#625d52]">
                  Independent Financial Practice &bull; Licensed Across Canada
                </p>
              </div>
            </div>

            {/* Copy */}
            <div className="lg:col-span-7 space-y-5">
              <span className="eyebrow text-xs">
                {language === "fr" ? "À propos d'Ahmed" : "About Ahmed"}
              </span>
              <h2 className="h2 text-[#1c1b18]">
                {language === "fr" ? "D'abord un éducateur financier." : "A financial educator first."}
              </h2>
              <p className="text-base md:text-lg text-[#46423a] leading-relaxed">
                {language === "fr"
                  ? "Je suis Ahmed Bello. Ce qui me passionne le plus, c'est d'aider les gens à poser de meilleures questions financières — et à en comprendre les réponses pour décider par eux-mêmes."
                  : "I’m Ahmed Bello. What interests me most is helping people ask better financial questions — and then understand the answers well enough to make their own decisions."}
              </p>
              <p className="text-sm md:text-base text-[#46423a] leading-relaxed">
                {language === "fr"
                  ? "Je crois qu'une bonne explication a plus de valeur qu'un argumentaire commercial. Si je peux vous montrer comment s'articulent vos options, ce que chacune coûte et ce qu'elle ne peut pas faire, vous serez dans une bien meilleure posture, quelle que soit votre décision finale."
                  : "I believe a good explanation is worth more than a good pitch. If I can show you how the pieces fit together, what each choice costs and what it cannot do, you are in a better position whatever you decide."}
              </p>
              <div className="pt-2 text-xs text-[#46423a] space-y-1">
                <p className="font-semibold text-[#1c1b18]">{siteConfig.designation}.</p>
                <p>
                  {language === "fr"
                    ? "Professionnel financier indépendant offrant éducation et solutions partout au Canada."
                    : "Independent financial professional providing education and solutions across Canada."}
                </p>
              </div>
              <div className="pt-4">
                <Link to="/about" className="arrow-link text-sm">
                  {language === "fr" ? "En savoir plus sur Ahmed et ma méthode →" : "More about Ahmed and how I work →"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7.5. Monthly Educational Briefing */}
      <section className="section py-16 border-b border-[#d6cebd] bg-[#f7f3eb]">
        <div className="wrap max-w-4xl">
          <NewsletterSignup
            source="homepage"
            title={language === "fr" ? "Le Point d'Information Financière" : "The Intentional Wealth Briefing"}
            description={
              language === "fr"
                ? "Analyses claires des règles fiscales canadiennes, des régimes enregistrés (CELI, REER, CELIAPP) et de la liquidité du foyer. Sans argumentaire de vente."
                : "Clear, plain-language breakdowns of Canadian tax rules, registered shelters (TFSA, RRSP, FHSA), and household liquidity delivered monthly. Zero sales pitches."
            }
          />
        </div>
      </section>

      {/* 8. Closing CTA */}
      <section className="section py-20 text-center bg-[#f7f3eb]">
        <div className="wrap max-w-3xl space-y-6">
          <h2 className="display text-[#1c1b18]">
            {language === "fr"
              ? "Une meilleure décision financière commence toujours par une meilleure question."
              : "A better financial decision often starts with a better question."}
          </h2>
          <p className="lede text-base md:text-lg text-[#46423a] max-w-xl mx-auto">
            {language === "fr"
              ? "Si vous essayez de comprendre un enjeu financier, commençons par la question qui compte le plus pour vous."
              : "If there is a financial decision you are trying to understand, let’s start with the question that matters most to you."}
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/contact" className="btn btn-primary text-base px-8 py-3">
              {language === "fr" ? "Engager une conversation →" : "Start a Conversation →"}
            </Link>
            {siteConfig.schedulingUrl && (
              <a
                href={siteConfig.schedulingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary text-base px-6 py-3 inline-flex items-center gap-2"
              >
                <span>{language === "fr" ? "Réserver 30 min sur Calendly" : "Book 30 Min on Calendly"}</span>
                <span aria-hidden="true">&rarr;</span>
              </a>
            )}
          </div>
          <p className="text-xs text-[#625d52] tracking-wide">
            {language === "fr" ? "Aucune obligation. Aucune pression commerciale." : "No obligation. No sales pressure."}
          </p>
        </div>
      </section>
    </div>
  );
};
