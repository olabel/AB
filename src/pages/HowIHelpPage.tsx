import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { howIHelpTopics } from "../content/data.ts";
import { Tbc } from "../components/Tbc.tsx";
import { MoneyStructureStudio } from "../components/MoneyStructureStudio.tsx";
import { StructuralCaseStudies } from "../components/StructuralCaseStudies.tsx";
import { StructureDiagnostic } from "../components/StructureDiagnostic.tsx";
import { ArrowRight, HelpCircle } from "lucide-react";
import { siteConfig } from "../config/site.ts";
import { SEO } from "../components/SEO.tsx";
import { useLanguage } from "../context/LanguageContext.tsx";

export const HowIHelpPage: React.FC = () => {
  const { isFr } = useLanguage();
  const location = useLocation();

  // Scroll to hash on load or hash change
  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.slice(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.hash]);

  return (
    <div className="py-12 md:py-16">
      <SEO
        title={isFr ? "Comment je vous aide | Démarche d'éducation financière" : "How I Help | Question-Led Financial Education"}
        description={
          isFr
            ? "Découvrez notre approche fondée sur la clarté : où allouer votre prochain dollar, protection du revenu et préparation de vos objectifs familiaux."
            : "Explore our education-first process: where the next dollar goes, income protection trade-offs, and family milestones without product sales push."
        }
        canonicalUrl="/how-i-help"
      />
      {/* 1. Header */}
      <section className="section pb-12 pt-4 border-b border-[#d6cebd]">
        <div className="wrap max-w-4xl space-y-5">
          <span className="eyebrow text-xs">How I help</span>
          <h1 className="h1 text-[#1c1b18] leading-tight">
            Start with the question, not the product.
          </h1>
          <p className="lede text-lg md:text-xl text-[#46423a] leading-relaxed">
            Most people do not come with a product in mind. They come with a question: where should the next dollar go,
            what happens to my family if I cannot work, am I saving for the right thing? Each question below follows
            the same path: why it matters, what to understand, what to weigh, and a sensible next step.
          </p>

          {/* Jump to a question */}
          <div className="pt-6 border-t border-[#d6cebd]">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#75581f] mb-3">
              Jump to a question
            </h2>
            <div className="flex flex-wrap gap-2">
              {howIHelpTopics.map((topic, i) => (
                <a
                  key={topic.id}
                  href={`#${topic.id}`}
                  className="px-3 py-1.5 bg-[#fcfaf5] border border-[#d6cebd] hover:border-[#2e4a3b] text-xs font-medium text-[#1c1b18] rounded-[2px] transition-colors"
                >
                  <span className="font-mono text-[#75581f] mr-1.5">0{i + 1}</span>
                  {topic.short}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. What to Expect (Scope) */}
      <section id="scope" className="section py-16 border-b border-[#d6cebd] bg-[#fcfaf5]">
        <div className="wrap max-w-4xl space-y-10">
          <div>
            <span className="eyebrow text-xs">What to expect</span>
            <h2 className="h2 text-[#1c1b18] mt-1">
              Education, a conversation, or a referral.
            </h2>
            <p className="text-sm md:text-base text-[#46423a] mt-2">
              It matters which of the three you are getting, so I try to be clear about it every time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-[#f7f3eb] border border-[#d6cebd] rounded-[2px] space-y-3">
              <span className="eyebrow text-xs text-[#2e4a3b]">1. Education</span>
              <h3 className="h3 text-[#1c1b18] text-xl">Explaining how things work</h3>
              <p className="text-xs text-[#46423a] leading-relaxed">
                This website, and any conversation that stays general. I explain concepts, rules and trade-offs so you can judge them yourself. It is not tailored to your situation and it is not a recommendation.
              </p>
            </div>

            <div className="p-6 bg-[#f7f3eb] border border-[#d6cebd] rounded-[2px] space-y-3">
              <span className="eyebrow text-xs text-[#2e4a3b]">2. A conversation</span>
              <h3 className="h3 text-[#1c1b18] text-xl">Looking at your situation</h3>
              <p className="text-xs text-[#46423a] leading-relaxed">
                Within the services I am authorized and licensed to offer, we can talk about your own circumstances and discuss options that might fit. Whether a particular topic is available depends on provincial regulations and licensing.
              </p>
            </div>

            <div className="p-6 bg-[#f7f3eb] border border-[#d6cebd] rounded-[2px] space-y-3">
              <span className="eyebrow text-xs text-[#2e4a3b]">3. A referral</span>
              <h3 className="h3 text-[#1c1b18] text-xl">Knowing where my role ends</h3>
              <p className="text-xs text-[#46423a] leading-relaxed">
                Some questions belong with someone else: tax returns and tax planning with an accountant, wills and legal matters with a lawyer, and debt-relief options such as consumer proposals with a Licensed Insolvency Trustee. I will say so rather than guess.
              </p>
            </div>
          </div>

          <div className="p-4 bg-[#ece6da]/60 border-l-2 border-[#8d8677] text-xs text-[#46423a] space-y-1">
            <p>
              <strong>Professional licensing:</strong> Canadian provincial regulations apply to all regulated financial solutions. Educational discussions are available to all Canadian residents.
            </p>
          </div>
        </div>
      </section>

      {/* 2b. Structural Engineering Studio & Stress Tester */}
      <section className="section py-16 border-b border-[#d6cebd]">
        <div className="wrap max-w-4xl space-y-16">
          <MoneyStructureStudio />
          <StructuralCaseStudies />
          <StructureDiagnostic />
        </div>
      </section>

      {/* 3. The 7 Topics */}
      <section className="section py-16">
        <div className="wrap max-w-4xl space-y-20">
          {howIHelpTopics.map((topic, index) => (
            <article
              key={topic.id}
              id={topic.id}
              className="scroll-mt-28 border-b border-[#d6cebd] pb-16 space-y-8"
            >
              <div className="space-y-3">
                <span className="font-mono text-xs font-semibold text-[#75581f] block">
                  0{index + 1}
                </span>
                <h2 className="h2 text-[#1c1b18] leading-tight">
                  {topic.question}
                </h2>
              </div>

              {/* Why it matters */}
              <div className="space-y-2">
                <h3 className="eyebrow text-xs text-[#2e4a3b]">Why it matters</h3>
                <p className="text-base text-[#1c1b18] leading-relaxed font-serif text-lg">
                  {topic.why}
                </p>
              </div>

              {/* Key concepts */}
              <div className="space-y-3">
                <h3 className="eyebrow text-xs text-[#2e4a3b]">Key concepts to understand</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {topic.concepts.map((concept, cIdx) => (
                    <div
                      key={`conc-${cIdx}`}
                      className="p-4 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] space-y-1"
                    >
                      <h4 className="font-semibold text-sm text-[#1c1b18]">
                        {concept.term}
                      </h4>
                      <p className="text-xs text-[#625d52] leading-relaxed">
                        {concept.plain}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trade-offs */}
              <div className="space-y-3">
                <h3 className="eyebrow text-xs text-[#2e4a3b]">Trade-offs to explore</h3>
                <ul className="space-y-2 list-none p-0 text-sm text-[#46423a]">
                  {topic.tradeoffs.map((t, tIdx) => (
                    <li key={`tr-${tIdx}`} className="flex items-start gap-2">
                      <span className="text-[#2e4a3b] font-bold">&bull;</span>
                      <span className="leading-relaxed">{t}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* A suitable next step */}
              <div className="p-6 bg-[#f7f3eb] border border-[#d6cebd] rounded-[2px] space-y-4">
                <h3 className="eyebrow text-xs text-[#75581f]">A suitable next step</h3>
                <div className="flex flex-wrap items-center gap-3">
                  {topic.next.map((n, nIdx) => (
                    <Link
                      key={`next-${nIdx}`}
                      to={n.href}
                      className="btn btn-ghost text-xs py-2 px-3.5 bg-white flex items-center gap-1.5"
                    >
                      <span>{n.label}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ))}
                  <Link
                    to={`/contact?topic=${topic.contactTopic}`}
                    className="btn btn-primary text-xs py-2 px-4"
                  >
                    Ask me about this &rarr;
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 4. Educational Disclaimer */}
      <section className="wrap max-w-4xl mb-16">
        <div className="p-5 bg-[#ece6da]/60 border-l-2 border-[#8d8677] text-xs text-[#46423a] leading-relaxed">
          <strong>Educational content, not advice.</strong> This page offers general financial education.
          It is not personalized financial, tax, legal or investment advice, and it is not an offer or
          solicitation to buy or sell any product. Your circumstances are different, rules and limits change,
          and examples use hypothetical figures. Confirm current details with the sources listed and with a
          qualified professional before acting.{" "}
          <Link to="/disclosures" className="underline text-[#2e4a3b]">
            Read the full disclosures
          </Link>
          .
        </div>
      </section>

      {/* 5. How a Conversation Runs */}
      <section className="section py-16 bg-[#fcfaf5] border-y border-[#d6cebd]">
        <div className="wrap max-w-4xl space-y-8">
          <div>
            <span className="eyebrow text-xs">How a conversation runs</span>
            <h2 className="h2 text-[#1c1b18] mt-1">
              Understand, educate, explore, review.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-3 bg-[#f7f3eb] border-b-2 border-[#2e4a3b]">1. Understand &rarr;</div>
            <div className="p-3 bg-[#f7f3eb] border-b-2 border-[#2e4a3b]">2. Educate &rarr;</div>
            <div className="p-3 bg-[#f7f3eb] border-b-2 border-[#2e4a3b]">3. Explore &rarr;</div>
            <div className="p-3 bg-[#f7f3eb] border-b-2 border-[#2e4a3b]">4. Review</div>
          </div>

          <p className="text-sm md:text-base text-[#46423a] leading-relaxed">
            We begin with your questions and priorities. I explain the concepts and the trade-offs. Where it is
            appropriate, and within what I am authorized to offer, we discuss options. Then we write down next steps
            and agree when to look again, because circumstances change. Not every conversation needs every stage,
            and a conversation is not a promise of a comprehensive plan, portfolio management, tax advice or
            ongoing service.
          </p>

          <p className="text-sm text-[#2e4a3b]">
            Prefer to read first?{" "}
            <Link to="/education" className="underline font-medium">
              Browse the education library &rarr;
            </Link>
          </p>
        </div>
      </section>

      {/* 6. Closing CTA */}
      <section className="section py-20 text-center">
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
            {siteConfig.schedulingUrl && (
              <a
                href={siteConfig.schedulingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary text-base px-6 py-3 inline-flex items-center gap-2"
              >
                <span>Book 30 Min on Calendly</span>
                <span aria-hidden="true">&rarr;</span>
              </a>
            )}
          </div>
          <p className="text-xs text-[#625d52]">
            No obligation. No sales pressure.
          </p>
        </div>
      </section>
    </div>
  );
};
