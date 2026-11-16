import React from "react";
import { Link } from "react-router-dom";
import { aboutData } from "../content/data.ts";
import {
  siteConfig,
  getCtaLabel,
  getSecondaryCtaLabel,
  hasSiteCredentials,
} from "../config/site.ts";
import { BrandMark } from "../components/BrandMark.tsx";
import { Portrait } from "../components/Portrait.tsx";
import { SEO } from "../components/SEO.tsx";
import { useLanguage } from "../context/LanguageContext.tsx";
import { trackBookingClick } from "../lib/track.ts";

export const AboutPage: React.FC = () => {
  const { isFr } = useLanguage();
  const prefix = isFr ? "/fr" : "";
  const ctaLabel = getCtaLabel(isFr);
  const secondaryCtaLabel = getSecondaryCtaLabel(isFr);
  const { credentials } = siteConfig;
  const showCredentials = hasSiteCredentials(credentials);

  const approachParas = isFr
    ? [
        "L'éducation financière doit précéder le choix d'un produit. Trop de personnes souscrivent un régime d'épargne ou une police d'assurance sans comprendre exactement comment leurs dollars sont déployés, ni quels compromis elles acceptent en retour.",
        "Mon rôle consiste à traduire le jargon financier et les règles statutaires canadiennes (règles de l'ARC, régimes CELI, REER, CELIAPP, structures de prévoyance) en choix concrets et quantifiables. Lorsque vous comprenez la mécanique sous-jacente, vous décidez avec assurance.",
        "Je ne commence jamais par un argumentaire commercial ou une solution préfabriquée. Nous partons de vos objectifs, de votre bilan familial et de vos contraintes de trésorerie pour poser les vraies questions d'abord.",
      ]
    : aboutData.approachDraft;

  const questionsList = isFr
    ? [
        "Devrais-je prioriser le remboursement de mon hypothèque ou maximiser mon CELI / REER ?",
        "Comment les retraits de mes différents comptes influenceront-ils la récupération de ma pension de la Sécurité de la vieillesse (SV) ?",
        "Quelle est la différence concrète entre une assurance temporaire et une assurance permanente pour ma famille ?",
        "Comment puis-je transférer mon REER ou CELI d'une institution à l'autre sans impact fiscal ?",
      ]
    : aboutData.questionsEnjoyed;

  return (
    <div>
      <SEO
        title={isFr ? "À Propos d'Ahmed Bello | Professionnel Agréé" : "About Ahmed Bello | Licensed Financial Solutions"}
        description={
          isFr
            ? "Éducateur financier indépendant aidant les familles et particuliers au Canada à comprendre les régimes enregistrés (CELI, REER) et la prévoyance."
            : "Independent Canadian financial educator helping individuals and families understand registered accounts (TFSA, RRSP, FHSA), insurance, and money decisions."
        }
        canonicalUrl={isFr ? "/fr/about" : "/about"}
      />

      {/* 1. Header & Canonical Portrait */}
      <section className="section border-b border-[#d6cebd]">
        <div className="wrap max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="md:col-span-5">
              <div className="max-w-xs mx-auto space-y-3">
                <Portrait
                  alt={
                    isFr
                      ? "Ahmed Bello, professionnel agréé en solutions financières"
                      : "Ahmed Bello, Licensed Financial Solutions Professional"
                  }
                  variant="hero"
                  loading="eager"
                />
                <div className="flex items-center gap-2 pt-1">
                  <BrandMark size={24} className="w-6 h-6 text-[#2e4a3b]" />
                  <div>
                    <p className="font-serif text-lg text-[#1c1b18] leading-tight">Ahmed Bello</p>
                    <p className="text-xs text-[#75581f] font-medium">{siteConfig.designation}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-7 space-y-4">
              <span className="eyebrow block">{isFr ? "À propos d'Ahmed" : "About Ahmed"}</span>
              <h1 className="h1 text-[#1c1b18]">
                {isFr
                  ? "Je préfère que vous compreniez plutôt que vous approuviez d'emblée."
                  : "I would rather you understand than agree."}
              </h1>
              <p className="lede measure">
                {isFr
                  ? "Je suis Ahmed Bello. J'aide les résidents et familles au Canada à comprendre comment s'articulent leurs revenus, leur épargne, leur protection et leurs objectifs, pour qu'ils prennent des décisions qui leur appartiennent et qui font du sens."
                  : "I’m Ahmed Bello. I help Canadians see how their income, savings, protection and goals connect, so the decisions they make are their own and make sense to them."}
              </p>
              <div className="small text-[#46423a] pt-1">
                <span className="font-semibold text-[#1c1b18]">{siteConfig.designation}.</span>{" "}
                <span>
                  {isFr
                    ? "Basé à Dieppe, N.-B. • Pratique financière indépendante au Canada."
                    : "Based in Dieppe, NB • Independent Financial Practice in Canada."}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Professional Details Band */}
      <section className="section bg-[#fcfaf5] border-b border-[#d6cebd]">
        <div className="wrap max-w-4xl space-y-6">
          <h2 className="eyebrow block">{isFr ? "Repères professionnels" : "Practice overview"}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="border-t border-[#d6cebd] pt-3">
              <span className="small text-[#625d52] block mb-1">
                {isFr ? "Titre professionnel" : "Role"}
              </span>
              <p className="font-semibold text-[#1c1b18] text-sm leading-snug">
                {siteConfig.designation}
              </p>
            </div>

            <div className="border-t border-[#d6cebd] pt-3">
              <span className="small text-[#625d52] block mb-1">
                {isFr ? "Affiliation" : "Practice"}
              </span>
              <p className="text-[#1c1b18] text-sm leading-snug">
                {isFr
                  ? "Membre indépendant affilié à WFGIA."
                  : "Independent practice associated with WFGIA."}
              </p>
            </div>

            <div className="border-t border-[#d6cebd] pt-3">
              <span className="small text-[#625d52] block mb-1">
                {isFr ? "Normes éditoriales" : "Content standards"}
              </span>
              <Link to={`${prefix}/standards`} className="link text-sm block">
                {isFr ? "Sources et méthodologie →" : "How content is checked →"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Optional Credentials Section — Rendered ONLY when siteConfig.credentials has non-empty values */}
      {showCredentials && (
        <section id="licensing-disclosures" className="section border-b border-[#d6cebd]">
          <div className="wrap max-w-3xl space-y-6">
            <span className="eyebrow block">
              {isFr ? "Permis et divulgations" : "Licensing and disclosures"}
            </span>
            <h2 className="h2 text-[#1c1b18]">
              {isFr ? "Permis et registres réglementaires" : "Regulatory licensing details"}
            </h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-[#d6cebd] pt-5">
              {credentials.licenceType.trim() && (
                <div>
                  <dt className="small text-[#625d52]">{isFr ? "Type de permis" : "Licence type"}</dt>
                  <dd className="font-medium text-[#1c1b18] mt-1">{credentials.licenceType}</dd>
                </div>
              )}
              {credentials.provinces.trim() && (
                <div>
                  <dt className="small text-[#625d52]">{isFr ? "Provinces autorisées" : "Provinces"}</dt>
                  <dd className="font-medium text-[#1c1b18] mt-1">{credentials.provinces}</dd>
                </div>
              )}
              {credentials.licenceNumbers.trim() && (
                <div>
                  <dt className="small text-[#625d52]">{isFr ? "Numéro(s) de permis" : "Licence number(s)"}</dt>
                  <dd className="font-medium text-[#1c1b18] mt-1">{credentials.licenceNumbers}</dd>
                </div>
              )}
              {credentials.regulatorLookupUrls.filter((u) => u.label.trim() && u.url.trim()).length > 0 && (
                <div>
                  <dt className="small text-[#625d52]">
                    {isFr ? "Vérification officielle" : "Regulator lookup"}
                  </dt>
                  <dd className="mt-1 space-y-1">
                    {credentials.regulatorLookupUrls
                      .filter((u) => u.label.trim() && u.url.trim())
                      .map((item) => (
                        <a
                          key={item.url}
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link text-sm block"
                        >
                          {item.label}
                        </a>
                      ))}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </section>
      )}

      {/* 3. My Approach to Financial Education */}
      <section className="section border-b border-[#d6cebd]">
        <div className="wrap max-w-3xl space-y-6">
          <span className="eyebrow block">{isFr ? "Ma démarche" : "How I work"}</span>
          <h2 className="h2 text-[#1c1b18]">
            {isFr ? "Mon approche de l'éducation financière" : "My approach to financial education"}
          </h2>

          <div className="prose-editorial space-y-4">
            {approachParas.map((para, idx) => (
              <p key={`app-${idx}`}>{para}</p>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Questions I Enjoy */}
      <section className="section bg-[#fcfaf5] border-b border-[#d6cebd]">
        <div className="wrap max-w-3xl space-y-6">
          <span className="eyebrow block">{isFr ? "Questions privilégiées" : "Questions I enjoy"}</span>
          <h2 className="h2 text-[#1c1b18]">
            {isFr
              ? "Les types de questions que j'aime aider à éclaircir"
              : "The kinds of questions I like to help people understand"}
          </h2>

          <div className="space-y-4 pt-2">
            {questionsList.map((q, idx) => (
              <div key={`q-${idx}`} className="card-editorial p-5 flex items-start gap-4">
                <span className="text-xs font-semibold text-[#75581f] pt-1">0{idx + 1}</span>
                <p className="font-serif text-lg md:text-xl text-[#1c1b18] leading-snug">{q}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Background and Transparency */}
      <section className="section border-b border-[#d6cebd]">
        <div className="wrap max-w-3xl space-y-6">
          <span className="eyebrow block">{isFr ? "Transparence et portée" : "Scope and transparency"}</span>
          <h2 className="h2 text-[#1c1b18]">
            {isFr
              ? "Avec qui je travaille, et les limites de mon champ d'action"
              : "Who I work with, and what I can and can’t do"}
          </h2>

          <div className="prose-editorial space-y-4">
            <p>
              {isFr
                ? "Je suis un professionnel financier indépendant. Être indépendant signifie que je travaille avec vous pour comprendre vos objectifs, tout en reconnaissant clairement les limites de mon champ d'action : je ne prétends pas être un planificateur fiduciaire à honoraires stricts, un gestionnaire discrétionnaire de portefeuille, un comptable professionnel agréé (CPA) ou un fiscaliste."
                : "I am an independent financial professional. Being independent means I work with you to understand your goals, while clearly recognizing the boundaries of my scope: I do not hold myself out as a fee-only fiduciary planner, discretionary portfolio manager, chartered accountant, or tax lawyer."}
            </p>

            <p>
              {isFr
                ? "Lorsqu'une question relève des compétences d'un autre spécialiste, je vous le signale expressément. Pour en savoir plus, consultez nos "
                : "When a question belongs with another professional, I’ll say so. Read more in the "}
              <Link to={`${prefix}/disclosures`} className="link">
                {isFr ? "divulgations complètes" : "disclosures"}
              </Link>
              .
            </p>
          </div>

          <div className="pt-2">
            <Link to={`${prefix}/how-i-help`} className="arrow-link text-sm">
              {isFr ? "Découvrir comment j'aide →" : "See how I help →"}
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Closing CTA */}
      <section className="section text-center">
        <div className="wrap max-w-3xl space-y-6">
          <h2 className="display text-[#1c1b18]">
            {isFr
              ? "Une meilleure décision financière commence toujours par une meilleure question."
              : "A better financial decision often starts with a better question."}
          </h2>
          <p className="lede measure mx-auto">
            {isFr
              ? "Si vous essayez de comprendre un enjeu financier, commençons par la question qui compte le plus pour vous."
              : "If there is a financial decision you are trying to understand, let’s start with the question that matters most to you."}
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-5">
            {siteConfig.schedulingUrl && (
              <a
                href={siteConfig.schedulingUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackBookingClick("about_bottom")}
                className="btn btn-primary"
              >
                {ctaLabel}
              </a>
            )}
            <Link to={`${prefix}/contact`} className="arrow-link text-sm sm:text-base">
              {secondaryCtaLabel} →
            </Link>
          </div>
          <p className="small text-[#625d52]">
            {isFr ? "Aucune obligation. Zéro pression commerciale." : "No obligation. No sales pressure."}
          </p>
        </div>
      </section>
    </div>
  );
};
