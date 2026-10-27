import React from "react";
import { Link } from "react-router-dom";
import { DecisionMap } from "../components/DecisionMap.tsx";
import { MoneyStructureStudio } from "../components/MoneyStructureStudio.tsx";
import { BrandMark } from "../components/BrandMark.tsx";
import { Tbc } from "../components/Tbc.tsx";
import { articles } from "../content/data.ts";
import { siteConfig } from "../config/site.ts";
import { ArrowRight, HelpCircle } from "lucide-react";

export const HomePage: React.FC = () => {
  // 4 preview guides specified for home page
  const previewSlugs = [
    "tfsa-vs-rrsp",
    "fhsa-explained",
    "consumer-proposals-explained",
    "investment-risk-vs-goal-risk",
  ];
  const previewGuides = previewSlugs
    .map((s) => articles.find((a) => a.slug === s))
    .filter(Boolean);

  const initialQuestions = [
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

  const helpAreas = [
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
      {/* 1. Hero Section */}
      <section className="section pb-16 pt-10 md:pt-16 border-b border-[#d6cebd]">
        <div className="wrap">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Core Message & Action */}
            <div className="lg:col-span-7 space-y-6">
              <span className="eyebrow text-xs">Financial clarity for real life</span>
              <h1 className="display text-[#1c1b18] leading-[1.08] tracking-[-0.018em]">
                Your money questions are connected.{" "}
                <em className="italic font-serif font-normal text-[#2e4a3b]">
                  The answers should be, too.
                </em>
              </h1>
              <p className="lede text-lg md:text-xl text-[#46423a] max-w-2xl leading-relaxed">
                From protecting your family’s income to registered accounts, investing and retirement,
                better decisions begin with seeing how the pieces fit together.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link to="/how-i-help" className="btn btn-primary text-base px-6 py-3">
                  Explore How I Help &rarr;
                </Link>
                <Link to="/education" className="btn btn-ghost text-base px-6 py-3">
                  Learn Before You Decide
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 border-t border-[#d6cebd]/70 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#625d52]">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2e4a3b]" />
                  <span>Independent Practice</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#75581f]" />
                  <span>Licensed Across Canada</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2e4a3b]" />
                  <span>Zero Sales Pressure</span>
                </div>
              </div>
            </div>

            {/* Right Column: Ahmed Bello Portrait Presentation */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="w-full max-w-sm bg-[#fcfaf5] border border-[#d6cebd] p-3 sm:p-4 rounded-[2px] shadow-sm relative group">
                {/* Portrait Matte Frame */}
                <div className="border border-[#75581f]/25 bg-[#ece6da]/40 p-1 rounded-[1px] relative overflow-hidden">
                  <img
                    src={siteConfig.headshotUrl}
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

      {/* 2. Questions Worth Asking First */}
      <section className="section py-16 border-b border-[#d6cebd] bg-[#fcfaf5]">
        <div className="wrap">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <span className="eyebrow text-xs">Starting points</span>
              <h2 className="h2 text-[#1c1b18] mt-1">Questions worth asking first</h2>
            </div>
            <p className="text-sm text-[#625d52] max-w-md">
              Most people start with a product. A better decision starts with the question behind it.
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
                  <span>Explore topic</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 p-4 bg-[#ece6da]/50 border-l-2 border-[#8d8677] text-xs text-[#46423a] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p>
              <strong>Education first.</strong> This site explains financial concepts; it is not personalized advice.
            </p>
            <Link to="/disclosures" className="underline font-medium text-[#2e4a3b] shrink-0">
              How this site works &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Interactive Decision Map Section */}
      <section className="section py-20 border-b border-[#d6cebd]">
        <div className="wrap space-y-10">
          <div className="max-w-3xl">
            <span className="eyebrow text-xs">How the pieces fit</span>
            <h2 className="h2 text-[#1c1b18] mt-1">
              Most financial decisions don’t happen in isolation.
            </h2>
            <p className="lede text-base md:text-lg text-[#46423a] mt-3">
              Paying down a debt, choosing an account and protecting your income all pull on the same dollars
              and the same years. Seeing the connections is often the first useful step.
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
            <span className="eyebrow text-xs">How I help</span>
            <h2 className="h2 text-[#1c1b18]">
              Five areas, each built around a real question.
            </h2>
            <p className="text-sm md:text-base text-[#46423a] leading-relaxed">
              Everything below starts as education. What I can do beyond that depends on provincial licensing
              and regulatory approvals, and some questions belong with other qualified professionals.
            </p>
            <div className="pt-2">
              <Link to="/how-i-help#scope" className="arrow-link text-sm">
                What’s education, what’s a conversation, what’s a referral &rarr;
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
            <span className="eyebrow text-xs text-[#d6c298]">The approach</span>
            <h2 className="h2 text-white">
              Clarity before complexity. Understanding before decisions.
            </h2>
            <p className="text-sm md:text-base text-[#ece6da]/80">
              A structured four-step path designed to give you clarity and complete ownership over your financial choices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 bg-[#2e4a3b]/30 border border-[#d6c298]/20 rounded-[2px] space-y-3">
              <span className="font-mono text-xs text-[#d6c298] font-semibold block">01</span>
              <h3 className="h3 text-white">Understand</h3>
              <p className="text-sm text-[#ece6da]/80 leading-relaxed">
                We clarify your situation, your questions and what matters most to you, before anything is explained or suggested.
              </p>
            </div>

            <div className="p-6 bg-[#2e4a3b]/30 border border-[#d6c298]/20 rounded-[2px] space-y-3">
              <span className="font-mono text-xs text-[#d6c298] font-semibold block">02</span>
              <h3 className="h3 text-white">Educate</h3>
              <p className="text-sm text-[#ece6da]/80 leading-relaxed">
                I explain the relevant concepts, the alternatives and the trade-offs in plain language, so you can judge them yourself.
              </p>
            </div>

            <div className="p-6 bg-[#2e4a3b]/30 border border-[#d6c298]/20 rounded-[2px] space-y-3">
              <span className="font-mono text-xs text-[#d6c298] font-semibold block">03</span>
              <h3 className="h3 text-white">Explore</h3>
              <p className="text-sm text-[#ece6da]/80 leading-relaxed">
                Where it is appropriate, and within the scope of the services I am authorized to offer, we discuss options that could fit.
              </p>
            </div>

            <div className="p-6 bg-[#2e4a3b]/30 border border-[#d6c298]/20 rounded-[2px] space-y-3">
              <span className="font-mono text-xs text-[#d6c298] font-semibold block">04</span>
              <h3 className="h3 text-white">Review</h3>
              <p className="text-sm text-[#ece6da]/80 leading-relaxed">
                We identify next steps and revisit your priorities when your circumstances change.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-[#d6c298]/20 text-xs text-[#ece6da]/65 leading-relaxed max-w-3xl">
            Not every conversation includes every stage, and a conversation is not a promise of a comprehensive
            plan, portfolio management, tax advice or ongoing service. What is available depends on what I am
            licensed and authorized to provide.
          </div>
        </div>
      </section>

      {/* 6. Education Preview (4 Guides) */}
      <section className="section py-20 border-b border-[#d6cebd]">
        <div className="wrap space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="eyebrow text-xs">Financial education</span>
              <h2 className="h2 text-[#1c1b18] mt-1">Learn before you decide.</h2>
              <p className="text-sm text-[#46423a] mt-2 max-w-xl">
                Plain-language explainers on how Canadian accounts, debt, risk and protection really work &mdash;
                with the trade-offs, sources and hypothetical examples included.
              </p>
            </div>
            <Link to="/education" className="btn btn-ghost text-sm shrink-0">
              Browse the library &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {previewGuides.map((guide) => {
              if (!guide) return null;
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
                      <span>{guide.readingMinutes} min read</span>
                    </div>

                    <h3 className="h3 text-[#1c1b18] group-hover:text-[#2e4a3b] transition-colors leading-snug">
                      <Link to={guide.url}>{guide.title}</Link>
                    </h3>

                    <div className="p-3 bg-[#f7f3eb] border-l border-[#8d8677] text-xs text-[#46423a]">
                      <strong>The question:</strong> {guide.question}
                    </div>
                  </div>

                  <div className="pt-6">
                    <Link
                      to={guide.url}
                      className="text-xs font-semibold text-[#2e4a3b] flex items-center gap-1.5 group-hover:underline"
                    >
                      <span>Read the article</span>
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
            {/* Portrait Frame */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-xs sm:max-w-sm bg-[#f7f3eb] border border-[#d6cebd] p-3 sm:p-4 rounded-[2px] shadow-sm">
                <div className="border border-[#75581f]/25 bg-[#fcfaf5] p-1 rounded-[1px] overflow-hidden">
                  <img
                    src={siteConfig.headshotUrl}
                    alt="Ahmed Bello, Licensed Financial Solutions Professional"
                    className="w-full aspect-[4/5] object-cover object-top rounded-[1px]"
                    width={360}
                    height={450}
                    loading="lazy"
                  />
                </div>
                <div className="mt-3.5 pt-3 border-t border-[#d6cebd] text-center">
                  <p className="font-serif text-lg text-[#1c1b18] leading-tight">Ahmed Bello</p>
                  <p className="text-[0.72rem] uppercase tracking-wider text-[#75581f] font-semibold mt-0.5">
                    {siteConfig.designation}
                  </p>
                  <p className="text-[0.75rem] text-[#625d52] mt-1">
                    Independent Financial Practice &bull; Canada
                  </p>
                </div>
              </div>
            </div>

            {/* Copy */}
            <div className="lg:col-span-7 space-y-5">
              <span className="eyebrow text-xs">About Ahmed</span>
              <h2 className="h2 text-[#1c1b18]">A financial educator first.</h2>
              <p className="text-base md:text-lg text-[#46423a] leading-relaxed">
                I’m Ahmed Bello. What interests me most is helping people ask better financial questions &mdash;
                and then understand the answers well enough to make their own decisions.
              </p>
              <p className="text-sm md:text-base text-[#46423a] leading-relaxed">
                I believe a good explanation is worth more than a good pitch. If I can show you how the pieces fit together,
                what each choice costs and what it cannot do, you are in a better position whatever you decide.
              </p>
              <div className="pt-2 text-xs text-[#46423a] space-y-1">
                <p className="font-semibold text-[#1c1b18]">{siteConfig.designation}.</p>
                <p>
                  Independent financial professional providing education and solutions across Canada.
                </p>
              </div>
              <div className="pt-4">
                <Link to="/about" className="arrow-link text-sm">
                  More about Ahmed and how I work &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Closing CTA */}
      <section className="section py-20 text-center bg-[#f7f3eb]">
        <div className="wrap max-w-3xl space-y-6">
          <h2 className="display text-[#1c1b18]">
            A better financial decision often starts with a better question.
          </h2>
          <p className="lede text-base md:text-lg text-[#46423a] max-w-xl mx-auto">
            If there is a financial decision you are trying to understand, let’s start with the question that matters most to you.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/contact" className="btn btn-primary text-base px-8 py-3">
              Start a Conversation &rarr;
            </Link>
          </div>
          <p className="text-xs text-[#625d52] tracking-wide">
            No obligation. No sales pressure.
          </p>
        </div>
      </section>
    </div>
  );
};
