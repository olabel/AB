import React from "react";
import { Link } from "react-router-dom";
import { aboutData } from "../content/data.ts";
import { siteConfig } from "../config/site.ts";
import { BrandMark } from "../components/BrandMark.tsx";
import { SEO } from "../components/SEO.tsx";
import { useLanguage } from "../context/LanguageContext.tsx";
import { trackBookingClick } from "../lib/track.ts";

export const AboutPage: React.FC = () => {
  const { isFr } = useLanguage();
  const prefix = isFr ? "/fr" : "";

  const approachParas = isFr
    ? [
        "L'éducation financière doit précéder le choix d'un produit. Trop de personnes souscrivent un régime d'épargne ou une police d'assurance sans comprendre exactement comment leurs dollars sont déployés, ni quels compromis elles acceptent en retour.",
        "Mon rôle consiste à traduire le jargon financier et les règles statutaires canadiennes (règles de l'ARC, régimes CELI, REER, CELIAPP, structures de prévoyance) en choix concrets et quantifiables. Lorsque vous comprenez la mécanique sous-jacente, vous décidez avec assurance.",
        "Je ne commence jamais par un argumentaire commercial ou une solution préfabriquée. Nous partons de vos objectifs, de votre bilan familial et de vos contraintes de trésorerie pour poser les vraies questions d'abord."
      ]
    : aboutData.approachDraft;

  const questionsList = isFr
    ? [
        "Devrais-je prioriser le remboursement de mon hypothèque ou maximiser mon CELI / REER ?",
        "Comment les retraits de mes différents comptes influenceront-ils la récupération de ma pension de la Sécurité de la vieillesse (SV) ?",
        "Quelle est la différence concrète entre une assurance temporaire et une assurance permanente pour ma famille ?",
        "Comment puis-je transférer mon REER ou CELI d'une institution à l'autre sans impact fiscal ?"
      ]
    : aboutData.questionsEnjoyed;

  return (
    <div className="py-12 md:py-16">
      <SEO
        title={isFr ? "À Propos d'Ahmed Bello | Professionnel Agréé" : "About Ahmed Bello | Licensed Financial Solutions"}
        description={
          isFr
            ? "Éducateur financier indépendant aidant les familles et particuliers au Canada à comprendre les régimes enregistrés (CELI, REER) et la prévoyance."
            : "Independent Canadian financial educator helping individuals and families understand registered accounts (TFSA, RRSP, FHSA), insurance, and money decisions."
        }
        canonicalUrl={isFr ? "/fr/about" : "/about"}
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
              <span className="eyebrow text-xs">{isFr ? "À propos d'Ahmed" : "About Ahmed"}</span>
              <h1 className="h1 text-[#1c1b18] leading-tight">
                {isFr ? "Je préfère que vous compreniez plutôt que vous approuviez d'emblée." : "I would rather you understand than agree."}
              </h1>
              <p className="lede text-lg md:text-xl text-[#46423a] leading-relaxed">
                {isFr
                  ? "Je suis Ahmed Bello. J'aide les résidents et familles au Canada à comprendre comment s'articulent leurs revenus, leur épargne, leur protection et leurs objectifs, pour qu'ils prennent des décisions qui leur appartiennent et qui font du sens."
                  : "I’m Ahmed Bello. I help Canadians see how their income, savings, protection and goals connect, so the decisions they make are their own and make sense to them."}
              </p>
              <div className="text-xs text-[#46423a] pt-1">
                <span className="font-semibold text-[#1c1b18]">{siteConfig.designation}.</span>{" "}
                <span>{isFr ? "Pratique financière indépendante au Canada." : "Independent Financial Practice in Canada."}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Professional Details Band */}
      <section className="py-10 bg-[#fcfaf5] border-b border-[#d6cebd]">
        <div className="wrap max-w-4xl">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#75581f] mb-6">
            {isFr ? "Détails professionnels" : "Professional details"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-xs">
            <div className="p-4 bg-[#f7f3eb] border border-[#d6cebd] rounded-[2px]">
              <span className="text-[#625d52] block mb-1">{isFr ? "Titre professionnel" : "Professional title"}</span>
              <p className="font-semibold text-[#1c1b18] leading-snug">
                {siteConfig.designation}
              </p>
            </div>

            <div className="p-4 bg-[#f7f3eb] border border-[#d6cebd] rounded-[2px]">
              <span className="text-[#625d52] block mb-1">{isFr ? "Affiliation" : "Affiliation"}</span>
              <p className="text-[#1c1b18] leading-snug">
                {isFr ? "Pratique financière indépendante." : "Independent Financial Practice."}
              </p>
            </div>

            <div className="p-4 bg-[#f7f3eb] border border-[#d6cebd] rounded-[2px]">
              <span className="text-[#625d52] block mb-1">{isFr ? "Permis provinciaux" : "Licensed in"}</span>
              <p className="text-[#1c1b18] leading-snug">
                {isFr ? "Agréé dans les provinces canadiennes." : "Licensed across Canadian provinces."}
              </p>
            </div>

            <div className="p-4 bg-[#f7f3eb] border border-[#d6cebd] rounded-[2px]">
              <span className="text-[#625d52] block mb-1">{isFr ? "Normes éditoriales" : "Content standards"}</span>
              <Link to={`${prefix}/standards`} className="text-[#2e4a3b] underline font-medium block">
                {isFr ? "Sources et méthodologie →" : "How content is sourced and reviewed →"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. My Approach to Financial Education */}
      <section className="section py-16 border-b border-[#d6cebd]">
        <div className="wrap max-w-3xl space-y-6">
          <span className="eyebrow text-xs">{isFr ? "Ma démarche" : "How I work"}</span>
          <h2 className="h2 text-[#1c1b18]">
            {isFr ? "Mon approche de l'éducation financière" : "My approach to financial education"}
          </h2>

          <div className="space-y-4 prose-editorial text-base md:text-lg text-[#46423a] leading-relaxed">
            {approachParas.map((para, idx) => (
              <p key={`app-${idx}`}>{para}</p>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Questions I Enjoy */}
      <section className="section py-16 bg-[#fcfaf5] border-b border-[#d6cebd]">
        <div className="wrap max-w-3xl space-y-6">
          <span className="eyebrow text-xs">{isFr ? "Questions privilégiées" : "Questions I enjoy"}</span>
          <h2 className="h2 text-[#1c1b18]">
            {isFr ? "Les types de questions que j'aime aider à éclaircir" : "The kinds of questions I like to help people understand"}
          </h2>

          <div className="space-y-3 pt-2">
            {questionsList.map((q, idx) => (
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

      {/* 5. Background and Credentials */}
      <section className="section py-16 border-b border-[#d6cebd]">
        <div className="wrap max-w-3xl space-y-8">
          <span className="eyebrow text-xs">{isFr ? "Parcours" : "Background"}</span>
          <h2 className="h2 text-[#1c1b18]">{isFr ? "Parcours et compétences" : "Background and credentials"}</h2>

          <div className="space-y-6">
            <div className="p-6 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] space-y-2">
              <h3 className="h3 text-[#1c1b18] text-xl">{isFr ? "Parcours professionnel" : "Professional background"}</h3>
              <p className="text-xs text-[#46423a] leading-relaxed">
                {isFr
                  ? "Dédié à l'éducation financière fondée sur les faits et à l'orientation transparente des ménages. Spécialisé dans les régimes enregistrés canadiens, la gestion des risques du bilan familial et les stratégies de revenu de retraite."
                  : "Dedicated to evidence-based financial education and transparent client guidance. Specializing in Canadian registered accounts, household risk management, and retirement income strategies."}
              </p>
            </div>

            <div className="p-6 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] space-y-2">
              <h3 className="h3 text-[#1c1b18] text-xl">{isFr ? "Titres et agréments" : "Designations and licences"}</h3>
              <p className="text-xs text-[#46423a] leading-relaxed">
                {isFr
                  ? "Professionnel agréé en solutions financières, réglementé auprès des autorités provinciales canadiennes d'assurance et de services financiers."
                  : "Licensed Financial Solutions Professional, regulated under Canadian provincial insurance and financial services authorities."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Transparency */}
      <section className="section py-16 bg-[#fcfaf5] border-b border-[#d6cebd]">
        <div className="wrap max-w-3xl space-y-6">
          <span className="eyebrow text-xs">{isFr ? "Transparence" : "Transparency"}</span>
          <h2 className="h2 text-[#1c1b18]">
            {isFr ? "Avec qui je travaille, et les limites de mon champ d'action" : "Who I work with, and what I can and can’t do"}
          </h2>

          <p className="text-base text-[#46423a] leading-relaxed">
            {isFr
              ? "Je suis un professionnel financier indépendant. Être indépendant signifie que je travaille avec vous pour comprendre vos objectifs, tout en reconnaissant clairement les limites de mon champ d'action : je ne prétends pas être un planificateur fiduciaire à honoraires stricts, un gestionnaire discrétionnaire de portefeuille, un comptable professionnel agréé (CPA) ou un fiscaliste."
              : "I am an independent financial professional. Being independent means I work with you to understand your goals, while clearly recognizing the boundaries of my scope: I do not hold myself out as a fee-only fiduciary planner, discretionary portfolio manager, chartered accountant, or tax lawyer."}
          </p>

          <p className="text-base text-[#46423a] leading-relaxed">
            {isFr
              ? "Lorsqu'une question relève des compétences d'un autre spécialiste, je vous le signale expressément. Pour en savoir plus, consultez nos "
              : "When a question belongs with another professional, I’ll say so. Read more in the "}
            <Link to={`${prefix}/disclosures`} className="underline text-[#2e4a3b]">
              {isFr ? "divulgations complètes" : "disclosures"}
            </Link>
            .
          </p>

          <div className="pt-2">
            <Link to={`${prefix}/how-i-help`} className="arrow-link text-sm">
              {isFr ? "Découvrir comment j'aide →" : "See how I help →"}
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Closing CTA */}
      <section className="section py-20 text-center">
        <div className="wrap max-w-3xl space-y-6">
          <h2 className="display text-[#1c1b18]">
            {isFr
              ? "Une meilleure décision financière commence toujours par une meilleure question."
              : "A better financial decision often starts with a better question."}
          </h2>
          <p className="lede text-base md:text-lg text-[#46423a] max-w-xl mx-auto">
            {isFr
              ? "Si vous essayez de comprendre un enjeu financier, commençons par la question qui compte le plus pour vous."
              : "If there is a financial decision you are trying to understand, let’s start with the question that matters most to you."}
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to={`${prefix}/contact`} className="btn btn-primary text-base px-8 py-3">
              {isFr ? "Démarrer une conversation →" : "Start a Conversation →"}
            </Link>
            {siteConfig.schedulingUrl && (
              <a
                href={siteConfig.schedulingUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackBookingClick("about_bottom")}
                className="btn btn-ghost border border-[#d6cebd] hover:border-[#2e4a3b] text-base px-6 py-3 inline-flex items-center gap-2"
              >
                <span>{isFr ? "Réserver 30 min sur Calendly" : "Book 30 Min on Calendly"}</span>
                <span aria-hidden="true">→</span>
              </a>
            )}
          </div>
          <p className="text-xs text-[#625d52]">
            {isFr ? "Aucune obligation. Zéro pression commerciale." : "No obligation. No sales pressure."}
          </p>
        </div>
      </section>
    </div>
  );
};
