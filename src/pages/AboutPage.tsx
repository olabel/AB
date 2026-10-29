import React from "react";
import { Link } from "react-router-dom";
import { aboutData } from "../content/data.ts";
import { siteConfig } from "../config/site.ts";
import { BrandMark } from "../components/BrandMark.tsx";
import { SEO } from "../components/SEO.tsx";
import { useLanguage } from "../context/LanguageContext.tsx";

export const AboutPage: React.FC = () => {
  const { isFr } = useLanguage();

  return (
    <div className="py-12 md:py-16">
      <SEO
        title={isFr ? "À Propos d'Ahmed Bello | Professionnel Agréé au Canada" : "About Ahmed Bello | Licensed Financial Solutions Professional"}
        description={
          isFr
            ? "Éducateur financier indépendant aidant les familles et particuliers au Canada à comprendre les régimes enregistrés (CELI, REER) et la prévoyance."
            : "Independent Canadian financial educator helping individuals and families understand registered accounts (TFSA, RRSP, FHSA), insurance, and money decisions."
        }
      />
      {/* 1. Header & Portrait Frame */}
      <section className="section pb-12 pt-4 border-b border-[#d6cebd]">
        <div className="wrap max-w-4xl space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Portrait Frame with bespoke matte */}
            <div className="md:col-span-5 flex flex-col items-center justify-center p-4 sm:p-5 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] text-center shadow-sm">
              <div className="w-full max-w-xs border border-[#75581f]/25 bg-[#f7f3eb] p-1.5 rounded-[1px] shadow-2xs mb-3 overflow-hidden">
                <img
                  src={siteConfig.headshotUrl}
                  alt="Ahmed Bello, Licensed Financial Solutions Professional"
                  className="w-full aspect-[4/5] object-cover object-top rounded-[1px]"
                  width={360}
                  height={450}
                  loading="eager"
                />
              </div>
              <div className="flex items-center gap-2 mt-1">
                <BrandMark size={24} className="w-6 h-6 text-[#2e4a3b]" />
                <p className="font-serif text-lg text-[#1c1b18] leading-tight">Ahmed Bello</p>
              </div>
              <p className="text-[0.7rem] uppercase tracking-wider text-[#75581f] font-semibold mt-1">
                {siteConfig.designation}
              </p>
            </div>

            {/* Title & Headline */}
            <div className="md:col-span-7 space-y-4">
              <span className="eyebrow text-xs">About Ahmed</span>
              <h1 className="h1 text-[#1c1b18] leading-tight">
                I would rather you understand than agree.
              </h1>
              <p className="lede text-lg md:text-xl text-[#46423a] leading-relaxed">
                I’m Ahmed Bello. I help Canadians see how their income, savings, protection and goals connect,
                so the decisions they make are their own and make sense to them.
              </p>
              <div className="text-xs text-[#46423a] pt-1">
                <span className="font-semibold text-[#1c1b18]">{siteConfig.designation}.</span>{" "}
                <span>Independent Financial Practice in Canada.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Professional Details Band */}
      <section className="py-10 bg-[#fcfaf5] border-b border-[#d6cebd]">
        <div className="wrap max-w-4xl">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#75581f] mb-6">
            Professional details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-xs">
            <div className="p-4 bg-[#f7f3eb] border border-[#d6cebd] rounded-[2px]">
              <span className="text-[#625d52] block mb-1">Professional title</span>
              <p className="font-semibold text-[#1c1b18] leading-snug">
                {siteConfig.designation}
              </p>
            </div>

            <div className="p-4 bg-[#f7f3eb] border border-[#d6cebd] rounded-[2px]">
              <span className="text-[#625d52] block mb-1">Affiliation</span>
              <p className="text-[#1c1b18] leading-snug">
                Independent Financial Practice.
              </p>
            </div>

            <div className="p-4 bg-[#f7f3eb] border border-[#d6cebd] rounded-[2px]">
              <span className="text-[#625d52] block mb-1">Licensed in</span>
              <p className="text-[#1c1b18] leading-snug">
                Licensed across Canadian provinces.
              </p>
            </div>

            <div className="p-4 bg-[#f7f3eb] border border-[#d6cebd] rounded-[2px]">
              <span className="text-[#625d52] block mb-1">Content standards</span>
              <Link to="/standards" className="text-[#2e4a3b] underline font-medium block">
                How content is sourced and reviewed &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. My Approach to Financial Education */}
      <section className="section py-16 border-b border-[#d6cebd]">
        <div className="wrap max-w-3xl space-y-6">
          <span className="eyebrow text-xs">How I work</span>
          <h2 className="h2 text-[#1c1b18]">
            My approach to financial education
          </h2>

          <div className="space-y-4 prose-editorial text-base md:text-lg text-[#46423a] leading-relaxed">
            {aboutData.approachDraft.map((para, idx) => (
              <p key={`app-${idx}`}>{para}</p>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Questions I Enjoy */}
      <section className="section py-16 bg-[#fcfaf5] border-b border-[#d6cebd]">
        <div className="wrap max-w-3xl space-y-6">
          <span className="eyebrow text-xs">Questions I enjoy</span>
          <h2 className="h2 text-[#1c1b18]">
            The kinds of questions I like to help people understand
          </h2>

          <div className="space-y-3 pt-2">
            {aboutData.questionsEnjoyed.map((q, idx) => (
              <div
                key={`q-${idx}`}
                className="p-5 bg-[#f7f3eb] border border-[#d6cebd] rounded-[2px] flex items-start gap-4"
              >
                <span className="font-mono text-xs font-semibold text-[#75581f] pt-0.5">
                  0{idx + 1}
                </span>
                <p className="font-serif text-lg md:text-xl text-[#1c1b18] leading-snug">
                  {q}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Background and Credentials (Placeholders) */}
      <section className="section py-16 border-b border-[#d6cebd]">
        <div className="wrap max-w-3xl space-y-8">
          <span className="eyebrow text-xs">Background</span>
          <h2 className="h2 text-[#1c1b18]">Background and credentials</h2>

          <div className="space-y-6">
            <div className="p-6 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] space-y-2">
              <h3 className="h3 text-[#1c1b18] text-xl">Professional background</h3>
              <p className="text-xs text-[#46423a] leading-relaxed">
                Dedicated to evidence-based financial education and transparent client guidance. Specializing in Canadian registered accounts, household risk management, and retirement income strategies.
              </p>
            </div>

            <div className="p-6 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] space-y-2">
              <h3 className="h3 text-[#1c1b18] text-xl">Designations and licences</h3>
              <p className="text-xs text-[#46423a] leading-relaxed">
                Licensed Financial Solutions Professional, regulated under Canadian provincial insurance and financial services authorities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Transparency */}
      <section className="section py-16 bg-[#fcfaf5] border-b border-[#d6cebd]">
        <div className="wrap max-w-3xl space-y-6">
          <span className="eyebrow text-xs">Transparency</span>
          <h2 className="h2 text-[#1c1b18]">
            Who I work with, and what I can and can’t do
          </h2>

          <p className="text-base text-[#46423a] leading-relaxed">
            I am an independent financial professional.
            Being independent means I work with you to understand your goals, while clearly recognizing the boundaries of my scope:
            I do not hold myself out as a fee-only fiduciary planner, discretionary portfolio manager, chartered accountant, or tax lawyer.
          </p>

          <p className="text-base text-[#46423a] leading-relaxed">
            When a question belongs with another professional, I’ll say so. Read more in the{" "}
            <Link to="/disclosures" className="underline text-[#2e4a3b]">
              disclosures
            </Link>
            .
          </p>

          <div className="pt-2">
            <Link to="/how-i-help" className="arrow-link text-sm">
              See how I help &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Closing CTA */}
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
