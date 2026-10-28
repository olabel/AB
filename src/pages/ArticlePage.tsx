import React, { useState, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { articles, categories } from "../content/data.ts";
import { Tbc } from "../components/Tbc.tsx";
import { DRAFT_MODE, siteConfig } from "../config/site.ts";
import { Check, Copy, ExternalLink, ArrowRight, Share2, Sparkles, CheckCircle2, Calculator, MessageSquare, Linkedin, Send } from "lucide-react";
import { NewcomerPlanningCalculator } from "../components/NewcomerPlanningCalculator.tsx";
import { useLanguage } from "../context/LanguageContext.tsx";

export const ArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { isFr, t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const article = articles.find((a) => a.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
    setScrollProgress(0);

    const handleScroll = () => {
      const el = document.documentElement;
      const totalHeight = el.scrollHeight - el.clientHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setScrollProgress(progress);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [slug]);

  if (!article) {
    return <Navigate to="/education" replace />;
  }

  const category = categories.find((c) => c.id === article.category);
  const kindLabel = article.kind === "guide" ? "Guide" : "Insight";
  const relatedArticles = article.related
    .map((relSlug) => articles.find((a) => a.slug === relSlug))
    .filter(Boolean);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const pageUrl = typeof window !== "undefined" ? window.location.href : `${siteConfig.siteUrl}${article.url}`;
  const shareTitle = `${article.title} | Ahmed Bello`;
  const shareLinkedIn = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`;
  const shareTwitter = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(pageUrl)}`;
  const shareWhatsApp = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + " " + pageUrl)}`;

  const sections = [
    { id: "overview", label: isFr ? "Vue d'ensemble" : "Overview" },
    ...(article.example ? [{ id: "example", label: isFr ? "Exemple hypothétique" : "Hypothetical example" }] : []),
    { id: "misunderstandings", label: isFr ? "Idées reçues fréquentes" : "Common misunderstandings" },
    { id: "tradeoffs", label: isFr ? "Compromis et limites" : "Trade-offs and limitations" },
    { id: "questions", label: isFr ? "Questions à considérer" : "Questions to consider" },
    { id: "sources", label: isFr ? `Sources officielles (${article.sources.length})` : `Sources (${article.sources.length})` },
  ];

  return (
    <article className="py-12 lg:py-16 relative">
      {/* Scroll-Linked Reading Progress Bar (Fixed at top of viewport) */}
      <div
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Reading progress"
        className="fixed top-0 left-0 right-0 z-50 h-[3.5px] bg-[#d6cebd]/40 pointer-events-none"
      >
        <div
          className="h-full bg-gradient-to-r from-[#75581f] via-[#2e4a3b] to-[#2e4a3b] transition-[width] duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
      {/* Article Schema JSON-LD (no dates per compliance rules) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": article.seoTitle || article.title,
            "description": article.description,
            "author": {
              "@type": "Person",
              "name": "Ahmed Bello",
              "jobTitle": "Licensed Financial Solutions Professional",
              "url": siteConfig.siteUrl
            },
            "publisher": {
              "@type": "Person",
              "name": "Ahmed Bello"
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `${siteConfig.siteUrl}${article.url}`
            },
            "citation": article.sources.map((s) => ({
              "@type": "CreativeWork",
              "name": s.label,
              "url": s.url
            }))
          })
        }}
      />

      <div className="wrap">
        {/* Header Breadcrumbs / Eyebrow */}
        <header className="max-w-4xl mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#2e4a3b] mb-4">
            <Link
              to={`/education?category=${article.category}`}
              className="hover:underline text-[#2e4a3b]"
            >
              {category?.label || article.category}
            </Link>
            <span aria-hidden="true">&middot;</span>
            <span className="text-[#625d52]">{kindLabel}</span>
          </div>

          <h1 className="h1 text-[#1c1b18] mb-6 font-normal leading-[1.12]">
            {article.title}
          </h1>

          <div className="p-4 bg-[#fcfaf5] border-l-2 border-[#2e4a3b] text-[#1c1b18] rounded-r-[2px]">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#2e4a3b] block mb-1">
              {t("meta_the_question")}
            </span>
            <p className="text-lg font-serif italic text-[#1c1b18] leading-snug">
              {article.question}
            </p>
          </div>
        </header>

        {/* 2-Column Editorial Grid: Meta + Sticky Index (Left) & Longform Content (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left Column: Metadata + Sticky "On this page" */}
          <aside className="lg:col-span-4 order-2 lg:order-1 no-print">
            <div className="lg:sticky lg:top-28 space-y-8">
              {/* Meta Box */}
              <div className="p-5 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] text-xs space-y-3.5">
                <div>
                  <span className="text-[#625d52] block mb-0.5 font-medium">{t("meta_reading_time")}</span>
                  <span className="text-[#1c1b18] font-semibold">{article.readingMinutes} {t("meta_min_read")}</span>
                </div>
                <div className="border-t border-[#ece6da] pt-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[#625d52] font-medium">{t("meta_reading_progress")}</span>
                    <span className="text-[#2e4a3b] font-bold">{Math.round(scrollProgress)}%</span>
                  </div>
                  <div className="w-full bg-[#ece6da] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#2e4a3b] h-full transition-[width] duration-150 ease-out rounded-full"
                      style={{ width: `${scrollProgress}%` }}
                    />
                  </div>
                </div>

                {article.figuresAsOf && (
                  <div className="border-t border-[#ece6da] pt-3">
                    <span className="text-[#625d52] block mb-0.5 font-medium">Figures as of</span>
                    <span className="text-[#1c1b18]">{article.figuresAsOf}</span>
                  </div>
                )}

                <div className="border-t border-[#ece6da] pt-3 flex items-center justify-between">
                  <span className="text-[#625d52] font-medium">{t("meta_sources")}</span>
                  <a
                    href="#sources"
                    className="text-[#2e4a3b] font-semibold hover:underline"
                  >
                    {article.sources.length} cited
                  </a>
                </div>

                <div className="border-t border-[#ece6da] pt-3">
                  <span className="text-[#625d52] block mb-1 font-medium">Editorial Review</span>
                  <Link
                    to="/standards"
                    className="text-[#2e4a3b] underline hover:text-[#1c1b18]"
                  >
                    How content is checked &rarr;
                  </Link>
                </div>

                <div className="border-t border-[#ece6da] pt-3">
                  <span className="text-[#625d52] block mb-0.5 font-medium">Publication Status</span>
                  <span className="text-[#2e4a3b] font-semibold">Verified Educational Guide</span>
                </div>
              </div>

              {/* Sticky "On this page" index */}
              <nav aria-label="Table of contents" className="hidden lg:block border-t border-[#d6cebd] pt-6">
                <h2 className="text-xs font-semibold tracking-wider uppercase text-[#46423a] mb-3">
                  On this page
                </h2>
                <ul className="space-y-2 text-sm list-none p-0">
                  {sections.map((sec) => (
                    <li key={sec.id}>
                      <a
                        href={`#${sec.id}`}
                        className="text-[#625d52] hover:text-[#2e4a3b] hover:underline transition-colors block py-1"
                      >
                        {sec.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Copy Link Button */}
              <div>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="btn btn-ghost w-full py-2.5 text-xs flex items-center justify-center gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-[#2e4a3b]" aria-hidden="true" />
                      <span>Link copied to clipboard</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" aria-hidden="true" />
                      <span>Copy article link</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </aside>

          {/* Right Column: Editorial Longform Reading Body */}
          <div className="lg:col-span-8 order-1 lg:order-2 space-y-12 max-w-prose measure">
            {/* 0. Executive 60-Second Briefing Box */}
            <div className="p-6 bg-[#fcfaf5] border-2 border-[#2e4a3b] rounded-[2px] shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#d6cebd]">
                <div className="flex items-center gap-2">
                  <span className="p-1 bg-[#2e4a3b] text-[#f7f3eb] rounded-[2px]">
                    <Sparkles className="w-3.5 h-3.5 text-[#d6c298]" />
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#1c1b18]">
                    {isFr ? "Synthèse exécutive en 60 secondes" : "60-Second Executive Summary"}
                  </span>
                </div>
                <span className="text-[0.68rem] font-mono text-[#75581f] uppercase tracking-wider font-semibold">
                  {article.kind === "insight" ? (isFr ? "Note stratégique" : "Strategic Briefing") : (isFr ? "Guide pratique" : "Core Guide")}
                </span>
              </div>

              <div className="space-y-2 text-xs sm:text-sm text-[#46423a] leading-relaxed">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2e4a3b] shrink-0 mt-0.5" />
                  <p><strong>The Core Friction:</strong> {article.problem}</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#75581f] shrink-0 mt-0.5" />
                  <p><strong>Key Strategic Rule:</strong> {article.tradeoffs[0] || article.overview[0]}</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2e4a3b] shrink-0 mt-0.5" />
                  <p><strong>Fiduciary Takeaway:</strong> {article.misunderstandings[0]?.reality || "Evaluate total balance-sheet impact before committing non-registered or registered capital."}</p>
                </div>
              </div>

              {/* Social Share Strip */}
              <div className="pt-3 border-t border-[#ece6da] flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="text-[#625d52] font-medium">
                  {isFr ? "Partager cette analyse :" : "Share this briefing:"}
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href={shareLinkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on LinkedIn"
                    className="p-1.5 bg-[#f7f3eb] hover:bg-[#2e4a3b] hover:text-white border border-[#d6cebd] rounded-[2px] text-[#46423a] transition-colors"
                    title="Share on LinkedIn"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={shareTwitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on X"
                    className="p-1.5 bg-[#f7f3eb] hover:bg-[#2e4a3b] hover:text-white border border-[#d6cebd] rounded-[2px] text-[#46423a] transition-colors"
                    title="Share on X / Twitter"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={shareWhatsApp}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on WhatsApp"
                    className="p-1.5 bg-[#f7f3eb] hover:bg-[#2e4a3b] hover:text-white border border-[#d6cebd] rounded-[2px] text-[#46423a] transition-colors"
                    title="Share via WhatsApp"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    aria-label="Copy link"
                    className="p-1.5 bg-[#f7f3eb] hover:bg-[#2e4a3b] hover:text-white border border-[#d6cebd] rounded-[2px] text-[#46423a] transition-colors inline-flex items-center gap-1 text-[0.7rem] font-semibold"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copied ? (isFr ? "Copié !" : "Copied!") : (isFr ? "Copier" : "Copy")}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 1. Problem / Lead Paragraph */}
            <section className="text-lg md:text-xl font-serif text-[#1c1b18] leading-relaxed border-b border-[#d6cebd] pb-8">
              <p>{article.problem}</p>
            </section>

            {/* 2. Plain-language Overview */}
            <section id="overview" className="space-y-5 prose-editorial">
              <h2 className="h3 text-[#1c1b18] border-b border-[#ece6da] pb-2">
                Overview
              </h2>
              {article.overview.map((para, idx) => (
                <p key={`ov-${idx}`} className="leading-relaxed">
                  {para}
                </p>
              ))}
            </section>

            {/* 3. Hypothetical Example */}
            {article.example && (
              <section
                id="example"
                className="bg-[#fcfaf5] border border-[#d6cebd] p-6 lg:p-8 rounded-[2px] space-y-5"
              >
                <div className="flex items-center justify-between gap-4 border-b border-[#d6cebd] pb-3">
                  <h2 className="h3 text-[#1c1b18]">
                    {article.example.title}
                  </h2>
                  <span className="text-[0.7rem] uppercase tracking-wider font-semibold bg-[#ece6da] text-[#46423a] px-2 py-0.5 rounded-[2px] shrink-0">
                    Hypothetical figures
                  </span>
                </div>

                <p className="text-sm text-[#46423a] leading-relaxed italic">
                  {article.example.intro}
                </p>

                {article.example.table && (
                  <div className="overflow-x-auto my-4">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="border-b-2 border-[#2e4a3b]">
                          {article.example.table.head.map((th, i) => (
                            <th
                              key={`th-${i}`}
                              className="py-2.5 px-3 font-semibold text-[#1c1b18] text-xs uppercase tracking-wider"
                            >
                              {th}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#ece6da]">
                        {article.example.table.rows.map((row, rIdx) => (
                          <tr key={`row-${rIdx}`} className="hover:bg-[#f7f3eb]/60">
                            {row.map((cell, cIdx) => (
                              <td
                                key={`cell-${cIdx}`}
                                className={`py-3 px-3 ${
                                  cIdx > 0 ? "font-mono tabular-nums text-[#2e4a3b] font-medium" : "text-[#1c1b18]"
                                }`}
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {article.example.notes && (
                  <div className="space-y-2 pt-2 border-t border-[#ece6da] text-xs text-[#625d52]">
                    {article.example.notes.map((note, nIdx) => (
                      <p key={`note-${nIdx}`}>&bull; {note}</p>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* Contextual Interactive Calculator Module */}
            {(article.slug === "internationally-trained-doctors-nurses-first-year" ||
              article.slug === "new-to-canada-money-basics") && (
              <section className="pt-2">
                <NewcomerPlanningCalculator
                  defaultProfession={
                    article.slug === "internationally-trained-doctors-nurses-first-year"
                      ? "healthcare"
                      : "general"
                  }
                />
              </section>
            )}

            {/* 4. Common Misunderstandings (Myth / Reality) */}
            <section id="misunderstandings" className="space-y-6">
              <h2 className="h3 text-[#1c1b18] border-b border-[#ece6da] pb-2">
                Common misunderstandings
              </h2>
              <div className="space-y-4">
                {article.misunderstandings.map((m, mIdx) => (
                  <div
                    key={`m-${mIdx}`}
                    className="p-5 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] space-y-2.5"
                  >
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#8f2a1d] shrink-0">
                        Myth:
                      </span>
                      <p className="font-serif text-[#1c1b18] font-medium text-lg leading-snug">
                        “{m.myth}”
                      </p>
                    </div>
                    <div className="flex items-baseline gap-2 border-t border-[#ece6da] pt-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#2e4a3b] shrink-0">
                        Reality:
                      </span>
                      <p className="text-sm text-[#46423a] leading-relaxed">
                        {m.reality}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 5. Trade-offs and Limitations */}
            <section id="tradeoffs" className="space-y-5 prose-editorial">
              <h2 className="h3 text-[#1c1b18] border-b border-[#ece6da] pb-2">
                Trade-offs and limitations
              </h2>
              <ul className="space-y-3">
                {article.tradeoffs.map((to, toIdx) => (
                  <li key={`to-${toIdx}`} className="text-sm md:text-base leading-relaxed">
                    {to}
                  </li>
                ))}
              </ul>
            </section>

            {/* 6. Questions to Consider */}
            <section id="questions" className="space-y-5 prose-editorial">
              <h2 className="h3 text-[#1c1b18] border-b border-[#ece6da] pb-2">
                Questions to consider
              </h2>
              <ul className="space-y-3">
                {article.questions.map((q, qIdx) => (
                  <li key={`q-${qIdx}`} className="text-sm md:text-base leading-relaxed font-serif text-lg">
                    {q}
                  </li>
                ))}
              </ul>
            </section>

            {/* 7. Official Sources */}
            <section
              id="sources"
              className="p-6 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] space-y-4"
            >
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[#2e4a3b]">
                Official Sources &amp; Verification
              </h2>
              <p className="text-xs text-[#625d52]">
                Every figure and rule cited in this article is drawn directly from official Canadian authorities.
                Read our full{" "}
                <Link to="/standards" className="underline text-[#2e4a3b]">
                  editorial standards
                </Link>
                .
              </p>
              <ul className="space-y-3.5 list-none p-0 text-sm">
                {article.sources.map((s, sIdx) => (
                  <li key={`source-${sIdx}`} className="border-t border-[#ece6da] pt-3">
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-medium text-[#2e4a3b] hover:underline"
                    >
                      <span>{s.label}</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-70" aria-hidden="true" />
                    </a>
                    {s.note && (
                      <p className="text-xs text-[#625d52] mt-1 leading-relaxed">
                        {s.note}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </section>

            {/* 8. Educational Disclaimer */}
            <div className="p-4 bg-[#ece6da]/50 border-l-2 border-[#8d8677] text-xs text-[#46423a] leading-relaxed">
              <strong>Educational content, not advice.</strong> This guide offers general financial education.
              It is not personalized financial, tax, legal, or investment advice, and is not an offer or
              solicitation to buy or sell any product. Rules and limits change; confirm current details with official
              sources and a qualified professional before acting.{" "}
              <Link to="/disclosures" className="underline text-[#2e4a3b]">
                Read full disclosures
              </Link>
              .
            </div>

            {/* 9. Gentle "Ask a related question" Invitation */}
            <div className="p-8 bg-[#2e4a3b] text-[#f7f3eb] rounded-[2px] space-y-4 on-dark no-print">
              <span className="eyebrow text-xs text-[#d6c298]">Have a question on this topic?</span>
              <h3 className="h3 text-white">
                Have a financial question about {article.invitationAbout}?
              </h3>
              <p className="text-sm text-[#ece6da]/90 leading-relaxed">
                If you are trying to understand how this applies to your situation or how it connects with your other
                priorities, let&rsquo;s start with your question.
              </p>
              <div className="pt-2">
                <Link
                  to={`/contact?topic=${article.contactTopic}`}
                  className="btn btn-primary bg-[#f7f3eb] text-[#2e4a3b] hover:bg-[#d6c298]"
                >
                  Ask a question about {article.invitationAbout} &rarr;
                </Link>
              </div>
            </div>

            {/* 10. Related Articles */}
            {relatedArticles.length > 0 && (
              <section className="pt-8 border-t border-[#d6cebd] space-y-6 no-print">
                <h3 className="h3 text-[#1c1b18]">Related reading</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedArticles.map((rel) => {
                    if (!rel) return null;
                    const relCat = categories.find((c) => c.id === rel.category);
                    return (
                      <Link
                        key={rel.slug}
                        to={rel.url}
                        className="p-5 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] hover:border-[#2e4a3b] transition-all flex flex-col justify-between group"
                      >
                        <div>
                          <span className="text-[0.7rem] uppercase tracking-wider font-semibold text-[#2e4a3b] block mb-2">
                            {relCat?.label || rel.category}
                          </span>
                          <h4 className="font-serif text-lg font-medium text-[#1c1b18] group-hover:text-[#2e4a3b] transition-colors leading-snug mb-2">
                            {rel.title}
                          </h4>
                          <p className="text-xs text-[#625d52] line-clamp-3 mb-4">
                            {rel.question}
                          </p>
                        </div>
                        <span className="text-xs font-semibold text-[#2e4a3b] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          Read guide <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
