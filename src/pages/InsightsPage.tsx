import React from "react";
import { Link } from "react-router-dom";
import { articles, categories } from "../content/data.ts";
import { Tbc } from "../components/Tbc.tsx";
import { siteConfig } from "../config/site.ts";
import { ArrowRight, TrendingUp, Sparkles, BookOpen } from "lucide-react";

export const InsightsPage: React.FC = () => {
  const featuredEssay = articles.find(
    (a) => a.slug === "canadian-mortgage-renewal-shock-liquidity-trap"
  );
  const otherEssays = articles.filter(
    (a) =>
      a.kind === "insight" &&
      a.slug !== "canadian-mortgage-renewal-shock-liquidity-trap"
  );

  const libraryPreviews = [
    articles.find((a) => a.slug === "tfsa-vs-rrsp"),
    articles.find((a) => a.slug === "investment-risk-vs-goal-risk"),
    articles.find((a) => a.slug === "fhsa-explained"),
  ].filter(Boolean);

  return (
    <div className="py-12 md:py-16">
      {/* Header */}
      <section className="section pb-12 pt-4 border-b border-[#d6cebd]">
        <div className="wrap max-w-4xl space-y-5">
          <span className="eyebrow text-xs">Insights & Strategic Essays</span>
          <h1 className="h1 text-[#1c1b18] leading-tight">
            How to think about high-stakes money decisions.
          </h1>
          <p className="lede text-lg md:text-xl text-[#46423a] leading-relaxed">
            The education library explains statutory rules and limits. These essays provide institutional-grade analysis on the economics behind them: balance-sheet liquidity, cost of capital, and distinguishing genuine fiduciary advice from a sales pitch.
          </p>
        </div>
      </section>

      {/* Featured Flagship Essay */}
      {featuredEssay && (
        <section className="section py-16 border-b border-[#d6cebd] bg-[#fcfaf5]">
          <div className="wrap max-w-4xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#75581f] text-[#f7f3eb] text-[0.7rem] font-bold uppercase tracking-wider rounded-[2px]">
                <TrendingUp className="w-3 h-3" />
                <span>Trending Strategic Analysis</span>
              </span>
              <span className="text-xs text-[#625d52] font-medium">
                Canadian Personal Finance
              </span>
            </div>

            <div className="p-8 md:p-10 bg-[#f7f3eb] border-2 border-[#2e4a3b] rounded-[2px] space-y-5 shadow-sm hover:border-[#1c1b18] transition-all">
              <div className="flex items-center gap-2 text-xs text-[#625d52]">
                <span className="font-semibold text-[#2e4a3b] uppercase tracking-wider text-[0.7rem]">
                  Balance-Sheet & Debt Strategy
                </span>
                <span>&bull;</span>
                <span>{featuredEssay.readingMinutes} min read</span>
                <span>&bull;</span>
                <span className="text-[#75581f] font-semibold">Institutional Grade</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#1c1b18] leading-tight">
                <Link
                  to={featuredEssay.url}
                  className="hover:text-[#2e4a3b] transition-colors"
                >
                  {featuredEssay.title}
                </Link>
              </h2>

              <p className="text-base text-[#46423a] leading-relaxed">
                {featuredEssay.description}
              </p>

              <div className="p-4 bg-[#fcfaf5] border-l-2 border-[#75581f] text-xs sm:text-sm text-[#46423a]">
                <strong className="text-[#1c1b18]">The Core Dilemma:</strong> &ldquo;{featuredEssay.question}&rdquo;
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <Link
                  to={featuredEssay.url}
                  className="btn btn-primary text-xs py-3 px-5 inline-flex items-center gap-2 shadow-sm"
                >
                  <span>Read Full Strategic Analysis</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <span className="text-xs text-[#625d52]">
                  Includes 15-Year Numerical Case Study & Model
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* More Essays & Strategic Perspectives */}
      {otherEssays.length > 0 && (
        <section className="section py-16 border-b border-[#d6cebd]">
          <div className="wrap max-w-4xl space-y-8">
            <div>
              <span className="eyebrow text-xs">Further Reading</span>
              <h2 className="h2 text-[#1c1b18] mt-1">Foundational Frameworks</h2>
              <p className="text-sm text-[#625d52] mt-1">
                Timeless mental models for evaluating debt, investments, and professional advisory incentives.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {otherEssays.map((essay) => (
                <div
                  key={essay.slug}
                  className="p-6 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] flex flex-col justify-between space-y-4 hover:border-[#2e4a3b] transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs text-[#625d52]">
                      <span className="font-semibold text-[#2e4a3b] uppercase tracking-wider text-[0.7rem]">
                        Financial decision-making
                      </span>
                      <span>&bull;</span>
                      <span>{essay.readingMinutes} min read</span>
                    </div>

                    <h3 className="font-serif text-xl text-[#1c1b18] leading-snug">
                      <Link
                        to={essay.url}
                        className="hover:text-[#2e4a3b] transition-colors"
                      >
                        {essay.title}
                      </Link>
                    </h3>

                    <p className="text-xs text-[#46423a] leading-relaxed line-clamp-3">
                      {essay.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#ece6da]">
                    <Link to={essay.url} className="arrow-link text-xs">
                      Read the essay &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Browse by Topic */}
      <section className="section py-16 bg-[#fcfaf5] border-b border-[#d6cebd]">
        <div className="wrap max-w-4xl space-y-8">
          <div>
            <span className="eyebrow text-xs">Library navigation</span>
            <h2 className="h2 text-[#1c1b18] mt-1">Browse by topic</h2>
            <p className="text-sm text-[#625d52] mt-1">
              Explore the educational guides behind the strategic frameworks.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/education?category=${cat.id}`}
                className="p-5 bg-[#f7f3eb] border border-[#d6cebd] rounded-[2px] hover:border-[#2e4a3b] transition-all group flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-serif text-lg font-medium text-[#1c1b18] group-hover:text-[#2e4a3b] transition-colors leading-snug mb-1">
                    {cat.label}
                  </h3>
                  <p className="text-xs text-[#625d52]">{cat.blurb}</p>
                </div>
                <span className="text-xs font-semibold text-[#2e4a3b] pt-3 flex items-center gap-1">
                  View topic &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* From the Library Previews */}
      <section className="section py-16 border-b border-[#d6cebd]">
        <div className="wrap max-w-4xl space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="h2 text-[#1c1b18]">From the education library</h2>
            <Link to="/education" className="arrow-link text-xs">
              All guides &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {libraryPreviews.map((guide) => {
              if (!guide) return null;
              const cat = categories.find((c) => c.id === guide.category);
              return (
                <div
                  key={guide.slug}
                  className="p-6 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] flex flex-col justify-between space-y-3"
                >
                  <div>
                    <span className="text-[0.7rem] uppercase tracking-wider font-semibold text-[#2e4a3b] block mb-1">
                      {cat?.label || guide.category} / {guide.readingMinutes} min read
                    </span>
                    <h3 className="font-serif text-lg font-medium text-[#1c1b18] leading-snug mb-2">
                      <Link to={guide.url} className="hover:underline">
                        {guide.title}
                      </Link>
                    </h3>
                    <p className="text-xs text-[#625d52] line-clamp-3">
                      {guide.description}
                    </p>
                  </div>
                  <Link to={guide.url} className="arrow-link text-xs">
                    Read the article &rarr;
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="section py-20 text-center">
        <div className="wrap max-w-3xl space-y-6">
          <h2 className="display text-[#1c1b18]">
            A better financial decision starts with a better question.
          </h2>
          <p className="lede text-base md:text-lg text-[#46423a] max-w-xl mx-auto">
            Whether navigating an upcoming mortgage renewal, optimizing registered tax shelters, or structuring family income protection, let’s start with an honest conversation.
          </p>
          <div className="pt-2 flex justify-center">
            <Link to="/contact" className="btn btn-primary text-base px-8 py-3">
              Start a Conversation &rarr;
            </Link>
          </div>
          <p className="text-xs text-[#625d52]">
            No obligation. No sales pressure. Independent guidance across Canada and the US.
          </p>
        </div>
      </section>
    </div>
  );
};
