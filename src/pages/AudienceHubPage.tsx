import React from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { articles, categories } from "../content/data.ts";
import { siteConfig } from "../config/site.ts";
import { useLanguage } from "../context/LanguageContext.tsx";
import { NewcomerPlanningCalculator } from "../components/NewcomerPlanningCalculator.tsx";
import { SEO } from "../components/SEO.tsx";
import {
  Stethoscope,
  Briefcase,
  Users,
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Sparkles,
  BookOpen,
} from "lucide-react";

interface AudienceConfig {
  id: string;
  slug: string;
  aliases?: string[];
  titleEn: string;
  titleFr: string;
  eyebrowEn: string;
  eyebrowFr: string;
  descriptionEn: string;
  descriptionFr: string;
  icon: React.ComponentType<{ className?: string }>;
  curatedSlugs: string[];
  showCalculator?: boolean;
  calculatorProfession?: "general" | "healthcare" | "tech";
  keyTakeawaysEn: string[];
  keyTakeawaysFr: string[];
}

const AUDIENCES: Record<string, AudienceConfig> = {
  healthcare: {
    id: "healthcare",
    slug: "healthcare",
    aliases: ["health-workers", "doctors-nurses"],
    titleEn: "Financial Guidance for Healthcare Workers & Internationally Trained Doctors and Nurses",
    titleFr: "Orientation financière pour professionnels de la santé, médecins et infirmiers formés à l'étranger",
    eyebrowEn: "Audience Hub: Healthcare & Medical Professionals",
    eyebrowFr: "Carrefour thématique : Professionnels de la santé",
    descriptionEn:
      "Licensing delays, credential recognition fees, and income gaps make your first years in Canada unique. Learn how to structure your cashflow runway, protect your income, and understand tax residency rules.",
    descriptionFr:
      "Les délais d'équivalence, les frais d'examens et le décalage de revenus rendent vos premières années au Canada uniques. Structurez vos réserves de subsistance et vos comptes enregistrés.",
    icon: Stethoscope,
    curatedSlugs: [
      "internationally-trained-doctors-nurses-first-year",
      "new-to-canada-money-basics",
      "income-depends-on-you",
      "term-vs-permanent-life-insurance",
      "canadian-capital-gains-deemed-disposition-estate-trap",
    ],
    showCalculator: true,
    calculatorProfession: "healthcare",
    keyTakeawaysEn: [
      "Plan around the licensing gap, not the expected future salary.",
      "CRA tax residency starts on arrival; T1135 foreign property reporting applies after year one.",
      "TFSA room starts when you become a resident; RRSP room is based on prior-year Canadian earned income.",
      "Explore federal Foreign Credential Recognition loans (up to $30,000) before draining all liquid reserves.",
    ],
    keyTakeawaysFr: [
      "Planifiez selon la durée d'équivalence réelle, et non sur le salaire anticipé.",
      "La résidence fiscale de l'ARC débute dès l'arrivée; la déclaration T1135 s'applique après l'année d'arrivée.",
      "Les droits de cotisation au CELI débutent à l'arrivée; les droits de REER exigent des revenus canadiens antérieurs.",
      "Explorez les prêts fédéraux de reconnaissance des titres (jusqu'à 30 000 $) pour protéger votre trésorerie.",
    ],
  },

  "business-owners": {
    id: "business-owners",
    slug: "business-owners",
    aliases: ["entrepreneurs", "incorporated"],
    titleEn: "Financial Architecture for Canadian Business Owners & Incorporated Professionals",
    titleFr: "Architecture financière pour propriétaires d'entreprises et professionnels incorporés au Canada",
    eyebrowEn: "Audience Hub: Business Owners & CCPCs",
    eyebrowFr: "Carrefour thématique : Propriétaires d'entreprises",
    descriptionEn:
      "From the 66.7% capital gains inclusion hike on private corporations to extracting tax-free capital via the Capital Dividend Account (CDA), understand how corporate wealth intersects with personal balance sheets.",
    descriptionFr:
      "Du taux d'inclusion des gains en capital de 66,7 % pour les sociétés privées à l'extraction de capital non imposable via le Compte de dividendes en capital (CDC).",
    icon: Briefcase,
    curatedSlugs: [
      "canadian-capital-gains-deemed-disposition-estate-trap",
      "term-vs-permanent-life-insurance",
      "savings-or-debt-first",
      "questions-before-any-financial-product",
      "canadian-mortgage-renewal-shock-liquidity-trap",
    ],
    showCalculator: false,
    keyTakeawaysEn: [
      "Canadian-Controlled Private Corporations (CCPCs) face 66.7% capital gains inclusion from dollar zero.",
      "Permanent corporate-owned insurance provides tax-sheltered growth and credit to the Capital Dividend Account (CDA).",
      "Section 85/86 estate freezes prevent exponential tax liabilities upon deemed disposition at death.",
      "Distinguish corporate retained earnings liquidity from personal household emergency buffers.",
    ],
    keyTakeawaysFr: [
      "Les SPCC font face à un taux d'inclusion de 66,7 % sur les gains en capital dès le premier dollar.",
      "L'assurance permanente détenue par la société alimente le Compte de dividendes en capital (CDC) en franchise d'impôt.",
      "Les gels successoraux (art. 85/86) plafonnent l'impôt terminal lors de la disposition présumée au décès.",
      "Distinguez la trésorerie de votre entreprise de vos coussins de sécurité personnels.",
    ],
  },

  families: {
    id: "families",
    slug: "families",
    aliases: ["parents", "homeowners"],
    titleEn: "Connected Financial Guidance for Canadian Families & Homeowners",
    titleFr: "Orientation financière globale pour les familles et propriétaires canadiens",
    eyebrowEn: "Audience Hub: Canadian Families",
    eyebrowFr: "Carrefour thématique : Familles canadiennes",
    descriptionEn:
      "Balancing mortgage renewal payments with registered savings (TFSA, RRSP, FHSA), education savings (RESP), and income protection for primary breadwinners.",
    descriptionFr:
      "Équilibrer les paiements hypothécaires avec l'épargne enregistrée (CELI, REER, CELIAPP), les études des enfants (REEE) et la protection du revenu familial.",
    icon: Users,
    curatedSlugs: [
      "canadian-mortgage-renewal-shock-liquidity-trap",
      "fhsa-explained",
      "tfsa-vs-rrsp",
      "resp-basics",
      "income-depends-on-you",
      "term-vs-permanent-life-insurance",
    ],
    showCalculator: false,
    keyTakeawaysEn: [
      "Avoid liquidating registered tax shelters (TFSA/RRSP) to pay down mortgage principal without modeling 15-year compounding.",
      "Eligible first-time buyers can combine $40k FHSA + $60k RRSP HBP for up to $100k per person ($200k per couple) tax-free.",
      "The Canada Education Savings Grant (CESG) provides a 20% match on the first $2,500 contributed annually to an RESP.",
      "Individual level term insurance keeps coverage steady and pays tax-free to family beneficiaries, unlike bank mortgage insurance.",
    ],
    keyTakeawaysFr: [
      "Évitez de liquider vos régimes enregistrés (CELI/REER) pour rembourser votre hypothèque sans comparer le rendement à long terme.",
      "Combinez 40 000 $ en CELIAPP et 60 000 $ en RAP pour jusqu'à 100 000 $ non imposables par acheteur (200 000 $ par couple).",
      "La Subvention canadienne pour l'épargne-études (SCEE) offre une bonification de 20 % sur les premiers 2 500 $ cotisés au REEE.",
      "L'assurance temporaire individuelle verse un capital fixe non imposable à votre famille, contrairement à l'assurance prêt bancaire.",
    ],
  },

  newcomers: {
    id: "newcomers",
    slug: "newcomers",
    aliases: ["immigrants", "new-to-canada"],
    titleEn: "First-Year Financial Essentials for Newcomers to Canada",
    titleFr: "Essentiels financiers pour la première année des nouveaux arrivants au Canada",
    eyebrowEn: "Audience Hub: Newcomers to Canada",
    eyebrowFr: "Carrefour thématique : Nouveaux arrivants",
    descriptionEn:
      "Everything you need to know about starting your Canadian credit record, opening bank accounts, tax residency rules, and avoiding high-cost remittance fees.",
    descriptionFr:
      "Tout ce que vous devez savoir pour bâtir votre crédit canadien, ouvrir des comptes bancaires, respecter les règles de résidence fiscale de l'ARC.",
    icon: Compass,
    curatedSlugs: [
      "new-to-canada-money-basics",
      "internationally-trained-doctors-nurses-first-year",
      "tfsa-vs-rrsp",
      "fhsa-explained",
    ],
    showCalculator: true,
    calculatorProfession: "general",
    keyTakeawaysEn: [
      "Canadian credit scores start from scratch; open a secured or newcomer credit card and pay the full balance monthly.",
      "TFSA contribution room accumulates only for years you are a Canadian resident aged 18 or older.",
      "Form T1135 is required for foreign property costing over CAD $100,000, starting in the year after you become a resident.",
      "Always compare the total exchange-rate spread plus transfer fees when remitting money abroad.",
    ],
    keyTakeawaysFr: [
      "Le dossier de crédit canadien repart de zéro; utilisez une carte de crédit pour nouveaux arrivants et payez le solde complet chaque mois.",
      "Les droits de cotisation au CELI ne s'accumulent que pour les années où vous êtes résident canadien âgé de 18 ans et plus.",
      "Le formulaire T1135 est obligatoire pour les biens étrangers de plus de 100 000 $ CAD à compter de l'année suivant votre arrivée.",
      "Comparez toujours l'écart de taux de change en plus des frais de transfert lorsque vous envoyez des fonds à l'étranger.",
    ],
  },
};

export const AudienceHubPage: React.FC = () => {
  const { audience } = useParams<{ audience: string }>();
  const { language } = useLanguage();
  const isFr = language === "fr";

  // Normalize audience lookup by slug or alias
  const audienceKey = Object.keys(AUDIENCES).find(
    (k) =>
      AUDIENCES[k].slug === audience ||
      (AUDIENCES[k].aliases && AUDIENCES[k].aliases?.includes(audience || ""))
  );

  const currentAudience = audienceKey ? AUDIENCES[audienceKey] : null;

  if (!currentAudience) {
    return <Navigate to="/education" replace />;
  }

  const IconComponent = currentAudience.icon;
  const curatedArticles = currentAudience.curatedSlugs
    .map((slug) => articles.find((a) => a.slug === slug))
    .filter(Boolean);

  return (
    <div className="py-12 md:py-16">
      <SEO
        title={isFr ? `${currentAudience.titleFr} | Ahmed Bello` : `${currentAudience.titleEn} | Ahmed Bello`}
        description={isFr ? currentAudience.descriptionFr : currentAudience.descriptionEn}
        canonicalUrl={`/for/${currentAudience.slug}`}
      />
      <div className="wrap max-w-5xl">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-[#625d52]">
          <ol className="flex items-center gap-2 list-none p-0">
            <li>
              <Link to="/" className="hover:text-[#2e4a3b] transition-colors">
                {isFr ? "Accueil" : "Home"}
              </Link>
            </li>
            <li aria-hidden="true">&rsaquo;</li>
            <li>
              <Link to="/education" className="hover:text-[#2e4a3b] transition-colors">
                {isFr ? "Éducation financière" : "Education Library"}
              </Link>
            </li>
            <li aria-hidden="true">&rsaquo;</li>
            <li className="text-[#1c1b18] font-medium">
              {isFr ? currentAudience.titleFr : currentAudience.titleEn}
            </li>
          </ol>
        </nav>

        {/* Hub Header */}
        <header className="pb-12 border-b border-[#d6cebd] space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#2e4a3b]/10 text-[#2e4a3b] border border-[#2e4a3b]/25 rounded-[2px] text-xs font-semibold uppercase tracking-wider">
            <IconComponent className="w-4 h-4 text-[#75581f]" />
            <span>{isFr ? currentAudience.eyebrowFr : currentAudience.eyebrowEn}</span>
          </div>

          <h1
            className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1c1b18] leading-[1.12] tracking-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {isFr ? currentAudience.titleFr : currentAudience.titleEn}
          </h1>

          <p className="text-base sm:text-lg text-[#46423a] leading-relaxed max-w-3xl">
            {isFr ? currentAudience.descriptionFr : currentAudience.descriptionEn}
          </p>

          {/* Quick Audience Switcher */}
          <div className="pt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-[#75581f] font-semibold mr-1">
              {isFr ? "Autres carrefours :" : "Other Audience Hubs:"}
            </span>
            {Object.values(AUDIENCES).map((aud) => (
              <Link
                key={aud.id}
                to={`/for/${aud.slug}`}
                className={`text-xs px-3 py-1.5 rounded-[2px] border transition-colors ${
                  aud.id === currentAudience.id
                    ? "bg-[#2e4a3b] text-[#f7f3eb] border-[#2e4a3b] font-semibold"
                    : "bg-[#fcfaf5] text-[#1c1b18] border-[#d6cebd] hover:border-[#2e4a3b]"
                }`}
              >
                {aud.id === "healthcare"
                  ? isFr
                    ? "Santé & Médecins"
                    : "Healthcare"
                  : aud.id === "business-owners"
                  ? isFr
                    ? "Entreprises & SPCC"
                    : "Business Owners"
                  : aud.id === "families"
                  ? isFr
                    ? "Familles"
                    : "Families"
                  : isFr
                  ? "Nouveaux arrivants"
                  : "Newcomers"}
              </Link>
            ))}
          </div>
        </header>

        {/* Key Takeaways Grid */}
        <section className="py-12 border-b border-[#d6cebd]">
          <h2 className="font-serif text-2xl text-[#1c1b18] mb-6">
            {isFr ? "Règles clés à retenir pour votre situation" : "Key Strategic Ground Rules"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(isFr ? currentAudience.keyTakeawaysFr : currentAudience.keyTakeawaysEn).map(
              (point, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] flex items-start gap-3"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#2e4a3b] shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-[#46423a] leading-relaxed">{point}</p>
                </div>
              )
            )}
          </div>
        </section>

        {/* Interactive Calculator Section (if enabled for this audience) */}
        {currentAudience.showCalculator && (
          <section className="py-12 border-b border-[#d6cebd]">
            <NewcomerPlanningCalculator
              defaultProfession={currentAudience.calculatorProfession || "general"}
            />
          </section>
        )}

        {/* Curated Guides Cluster */}
        <section className="py-12 border-b border-[#d6cebd] space-y-8">
          <div>
            <span className="eyebrow text-xs uppercase tracking-wider text-[#75581f]">
              {isFr ? "Guides et analyses recommandés" : "Topic Cluster"}
            </span>
            <h2 className="font-serif text-3xl text-[#1c1b18] mt-1">
              {isFr
                ? "Guides essentiels pour votre parcours"
                : "Essential Guides for Your Situation"}
            </h2>
            <p className="text-sm text-[#625d52] mt-1">
              {isFr
                ? "Rédigés en langage clair, avec chiffres officiels et sans jargon de vente."
                : "Plain-language breakdowns with official CRA and FCAC sources linked."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {curatedArticles.map((art) => {
              if (!art) return null;
              const cat = categories.find((c) => c.id === art.category);
              return (
                <article
                  key={art.slug}
                  className="p-6 sm:p-7 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] flex flex-col justify-between hover:border-[#2e4a3b] transition-all group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs text-[#625d52]">
                      <span className="font-semibold text-[#2e4a3b] uppercase tracking-wider text-[0.7rem]">
                        {cat?.label || art.category}
                      </span>
                      <span>&bull;</span>
                      <span>{art.readingMinutes} min read</span>
                    </div>

                    <h3 className="font-serif text-xl text-[#1c1b18] group-hover:text-[#2e4a3b] transition-colors leading-snug">
                      <Link to={art.url}>{art.title}</Link>
                    </h3>

                    <p className="text-xs sm:text-sm text-[#46423a] leading-relaxed line-clamp-3">
                      {art.description}
                    </p>

                    <div className="p-3 bg-[#f7f3eb] border-l-2 border-[#75581f] text-xs text-[#46423a] italic">
                      <strong>The Question:</strong> {art.question}
                    </div>
                  </div>

                  <div className="pt-5 border-t border-[#ece6da] mt-5 flex items-center justify-between">
                    <Link
                      to={art.url}
                      className="text-xs font-semibold text-[#2e4a3b] flex items-center gap-1.5 group-hover:underline"
                    >
                      <span>{isFr ? "Lire le guide" : "Read the guide"}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                    <span className="text-xs text-[#625d52]">
                      {art.sources.length} {isFr ? "sources officielles" : "sources"}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Direct Consultation Zone */}
        <section className="py-12 text-center bg-[#fcfaf5] border border-[#d6cebd] p-8 rounded-[2px] mt-12 space-y-4">
          <h3 className="font-serif text-2xl sm:text-3xl text-[#1c1b18]">
            {isFr
              ? "Vous avez une question précise sur votre situation ?"
              : "Have a Specific Question About Your Circumstances?"}
          </h3>
          <p className="text-sm text-[#46423a] max-w-xl mx-auto leading-relaxed">
            {isFr
              ? "Discutez directement avec Ahmed Bello pour examiner vos options fiscales, de protection ou d'épargne enregistrée au Canada sans aucune pression commerciale."
              : "Start an honest conversation with Ahmed Bello to review your Canadian tax, protection, and registered accounts strategy with zero sales pressure."}
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/contact" className="btn btn-primary px-6 py-3 text-sm">
              {isFr ? "Démarrer une conversation →" : "Start a Conversation &rarr;"}
            </Link>
            {siteConfig.schedulingUrl && (
              <a
                href={siteConfig.schedulingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary px-6 py-3 text-sm inline-flex items-center gap-2"
              >
                <Calendar className="w-4 h-4 text-[#75581f]" />
                <span>{isFr ? "Réserver un appel de 30 min" : "Schedule 30-Min Call"}</span>
              </a>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
