import React from "react";
import { Link } from "react-router-dom";
import { BrandMark } from "./BrandMark.tsx";
import { siteConfig } from "../config/site.ts";
import { useLanguage } from "../context/LanguageContext.tsx";
import { MapPin, Mail, Phone, Calendar, ArrowRight, ShieldCheck, ExternalLink } from "lucide-react";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { isFr } = useLanguage();

  const prefix = isFr ? "/fr" : "";

  return (
    <footer className="bg-[#14211a] text-[#f7f3eb] on-dark pt-16 pb-12 mt-auto border-t border-[#2e4a3b]/40">
      <div className="wrap max-w-7xl">
        {/* Main 5-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-14 border-b border-[#d6c298]/20">
          {/* Col 1: Brand & Practice Profile (Cols 1-4) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <Link to={isFr ? "/fr" : "/"} className="flex items-center gap-3 group text-decoration-none">
              <BrandMark size={34} reversed={true} className="w-8.5 h-8.5 shrink-0" />
              <span
                className="font-serif text-2xl text-[#f7f3eb] group-hover:text-[#d6c298] transition-colors"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Ahmed Bello
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-[#d6c298] italic font-serif leading-relaxed">
              {isFr
                ? "Éducation financière rigoureuse, clarté fiscale et solutions adaptées aux familles et professionnels au Canada."
                : siteConfig.footerBrandLine}
            </p>

            <div className="text-xs text-[#ece6da]/80 space-y-2 pt-2 border-t border-[#2e4a3b]/60">
              <div className="flex items-center gap-2 text-[#ece6da]">
                <MapPin className="w-3.5 h-3.5 text-[#d6c298] shrink-0" />
                <span>Moncton, New Brunswick, Canada</span>
              </div>
              <div className="flex items-center gap-2 text-[#ece6da]">
                <Mail className="w-3.5 h-3.5 text-[#d6c298] shrink-0" />
                <a href={`mailto:${siteConfig.publicEmail}`} className="hover:text-[#d6c298] transition-colors">
                  {siteConfig.publicEmail}
                </a>
              </div>
              <div className="flex items-center gap-2 text-[#ece6da]">
                <Phone className="w-3.5 h-3.5 text-[#d6c298] shrink-0" />
                <a href={`tel:${siteConfig.publicPhone.replace(/[^0-9+]/g, "")}`} className="hover:text-[#d6c298] transition-colors">
                  {siteConfig.publicPhone}
                </a>
              </div>
            </div>

            {siteConfig.schedulingUrl && (
              <div className="pt-2">
                <a
                  href={siteConfig.schedulingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#2e4a3b] hover:bg-[#3a5d4a] text-[#f7f3eb] border border-[#d6c298]/40 rounded-xs text-xs font-medium transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#d6c298]" />
                  <span>{isFr ? "Réserver une session de 30 min" : "Schedule 30-Min Strategy Call"}</span>
                  <ArrowRight className="w-3 h-3 text-[#d6c298]" />
                </a>
              </div>
            )}
          </div>

          {/* Col 2: Educational Library & Calculators (Cols 5-6) */}
          <div className="lg:col-span-2 sm:col-span-1 flex flex-col gap-3">
            <h3 className="eyebrow text-xs uppercase tracking-wider text-[#d6c298]">
              {isFr ? "Éducation & Outils" : "Education & Tools"}
            </h3>
            <ul className="space-y-2 text-xs list-none p-0 text-[#ece6da]/80">
              <li>
                <Link to={`${prefix}/education`} className="hover:text-white transition-colors">
                  {isFr ? "Bibliothèque complète" : "Education Library"}
                </Link>
              </li>
              <li>
                <Link to={`${prefix}/education/tfsa-vs-rrsp`} className="hover:text-white transition-colors">
                  {isFr ? "CELI vs REER" : "TFSA vs RRSP Guide"}
                </Link>
              </li>
              <li>
                <Link to={`${prefix}/education/fhsa-with-the-home-buyers-plan`} className="hover:text-white transition-colors">
                  {isFr ? "CELIAPP & Régime RAP" : "FHSA & Home Buyers' Plan"}
                </Link>
              </li>
              <li>
                <Link to={`${prefix}/education/building-credit-as-a-newcomer-in-canada`} className="hover:text-white transition-colors">
                  {isFr ? "Bâtir son crédit au Canada" : "Building Canadian Credit"}
                </Link>
              </li>
              <li>
                <Link to={`${prefix}/education/term-vs-permanent-life-insurance`} className="hover:text-white transition-colors">
                  {isFr ? "Assurance temporaire vs permanente" : "Term vs Permanent Insurance"}
                </Link>
              </li>
              <li>
                <Link to={`${prefix}/education/newcomers-first-year-financial-checklist`} className="hover:text-white transition-colors">
                  {isFr ? "Planificateur pour nouveaux arrivants" : "Newcomer Planning Calculator"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Specialized Audience Hubs (Cols 7-8) */}
          <div className="lg:col-span-2 sm:col-span-1 flex flex-col gap-3">
            <h3 className="eyebrow text-xs uppercase tracking-wider text-[#d6c298]">
              {isFr ? "Pôles Stratégiques" : "Audience Hubs"}
            </h3>
            <ul className="space-y-2 text-xs list-none p-0 text-[#ece6da]/80">
              <li>
                <Link
                  to={`${prefix}/investing/islamic-equity`}
                  className="text-[#d6c298] hover:text-white transition-colors font-medium flex items-center gap-1"
                >
                  <span>{isFr ? "Investissement Islamique (Halal)" : "Halal & Islamic Investing"}</span>
                </Link>
              </li>
              <li>
                <Link to={`${prefix}/for/health-workers`} className="hover:text-white transition-colors">
                  {isFr ? "Médecins & Infirmières" : "Healthcare & Doctors"}
                </Link>
              </li>
              <li>
                <Link to={`${prefix}/for/business-owners`} className="hover:text-white transition-colors">
                  {isFr ? "Propriétaires d'entreprise" : "Business Owners & CCPCs"}
                </Link>
              </li>
              <li>
                <Link to={`${prefix}/for/families`} className="hover:text-white transition-colors">
                  {isFr ? "Familles & Étapes de vie" : "Families & Milestones"}
                </Link>
              </li>
              <li>
                <Link to={`${prefix}/for/newcomers`} className="hover:text-white transition-colors">
                  {isFr ? "Nouveaux arrivants au Canada" : "Newcomers to Canada"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Practice & Navigation (Cols 9-10) */}
          <div className="lg:col-span-2 sm:col-span-1 flex flex-col gap-3">
            <h3 className="eyebrow text-xs uppercase tracking-wider text-[#d6c298]">
              {isFr ? "Pratique & Veille" : "Practice & Insights"}
            </h3>
            <ul className="space-y-2 text-xs list-none p-0 text-[#ece6da]/80">
              <li>
                <Link to={`${prefix}/how-i-help`} className="hover:text-white transition-colors">
                  {isFr ? "Comment je vous aide" : "How I Help"}
                </Link>
              </li>
              <li>
                <Link to={`${prefix}/about`} className="hover:text-white transition-colors">
                  {isFr ? "À propos d'Ahmed Bello" : "About Ahmed Bello"}
                </Link>
              </li>
              <li>
                <Link to={`${prefix}/insights`} className="hover:text-white transition-colors">
                  {isFr ? "Perspectives & Analyses" : "Strategic Insights"}
                </Link>
              </li>
              <li>
                <Link to={`${prefix}/news`} className="hover:text-white transition-colors">
                  {isFr ? "Actualités & Taux" : "Financial News Desk"}
                </Link>
              </li>
              <li>
                <Link to={`${prefix}/careers`} className="text-[#d6c298] hover:text-white transition-colors font-medium">
                  {isFr ? "Devenir conseiller (Mentorat)" : "Practice Mentorship & Careers"}
                </Link>
              </li>
              <li>
                <Link to={`${prefix}/contact`} className="hover:text-white transition-colors">
                  {isFr ? "Contact & Prise de rendez-vous" : "Contact & Consultations"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Governance & Standards (Cols 11-12) */}
          <div className="lg:col-span-2 sm:col-span-1 flex flex-col gap-3">
            <h3 className="eyebrow text-xs uppercase tracking-wider text-[#d6c298]">
              {isFr ? "Gouvernance & Légal" : "Governance & Legal"}
            </h3>
            <ul className="space-y-2 text-xs list-none p-0 text-[#ece6da]/80">
              <li>
                <Link to={`${prefix}/disclosures`} className="hover:text-white transition-colors flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#d6c298]" />
                  <span>{isFr ? "Divulgations réglementaires" : "Regulatory Disclosures"}</span>
                </Link>
              </li>
              <li>
                <Link to={`${prefix}/standards`} className="hover:text-white transition-colors">
                  {isFr ? "Normes éditoriales" : "Editorial Standards"}
                </Link>
              </li>
              <li>
                <Link to={`${prefix}/privacy`} className="hover:text-white transition-colors">
                  {isFr ? "Politique de confidentialité" : "Privacy Notice"}
                </Link>
              </li>
              <li>
                <Link to={`${prefix}/terms`} className="hover:text-white transition-colors">
                  {isFr ? "Conditions d'utilisation" : "Terms of Use"}
                </Link>
              </li>
            </ul>
            <div className="pt-2 text-[0.7rem] text-[#ece6da]/60">
              <p>
                {isFr ? "Questions relatives à la vie privée :" : "Privacy enquiries:"}{" "}
                <a href={`mailto:${siteConfig.privacyEmail}`} className="underline hover:text-white transition-colors">
                  {siteConfig.privacyEmail}
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Regulatory Disclosure & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-xs text-[#ece6da]/70 leading-relaxed">
          <p className="max-w-4xl text-[0.72rem]">
            <strong>{isFr ? "Avis réglementaire important :" : "Important regulatory notice:"}</strong>{" "}
            {isFr
              ? "Ce site web est une plateforme d'éducation financière fournissant des concepts généraux, des repères fiscaux et du mentorat professionnel au Canada. Le contenu publié ici ne constitue en aucun cas un conseil financier, fiscal ou juridique personnalisé, ni une offre de souscription. Les solutions d'assurance de personnes, régimes enregistrés et fonds distincts sont établis exclusivement par l'entremise de professionnels dûment autorisés et certifiés auprès des autorités provinciales compétentes."
              : "This website is a financial education platform providing objective concepts, tax benchmarks, and professional mentorship across Canada. Content published here does not constitute personalized financial, tax, or legal advice, nor a solicitation or offer to purchase specific securities. Individual insurance solutions, registered accounts, and segregated funds are arranged exclusively through duly licensed and provincially authorized professionals."}{" "}
            <Link to={`${prefix}/disclosures`} className="underline hover:text-white transition-colors">
              {isFr ? "Consulter nos divulgations" : "Review disclosures"}
            </Link>{" "}
            &amp;{" "}
            <Link to={`${prefix}/standards`} className="underline hover:text-white transition-colors">
              {isFr ? "normes éditoriales" : "editorial standards"}
            </Link>
            .
          </p>
          <p className="whitespace-nowrap shrink-0 text-[0.72rem] text-[#ece6da]/60">
            &copy; {currentYear} Ahmed Bello. {isFr ? "Tous droits réservés." : "All rights reserved."}
          </p>
        </div>
      </div>
    </footer>
  );
};
