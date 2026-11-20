import { siteConfig } from "./site.ts";
import {
  ARTICLE_FR_SEO,
  SITE_URL,
  getBasePath,
  getCoreRouteSeo,
  getLanguageUrls,
  getOgImageForPath,
  normalizeRoutePath,
} from "./seoMetadata.ts";

export interface SchemaArticleInput {
  slug: string;
  title: string;
  description: string;
  kind: "guide" | "insight";
  category: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  sources?: { label: string; url: string }[];
  faqs?: { question: string; answer: string }[];
}

export interface SchemaCollectionItem {
  name: string;
  url: string;
  description?: string;
}

export interface BuildRouteJsonLdOptions {
  pathname: string;
  title?: string;
  description?: string;
  heading?: string;
  isFr?: boolean;
  noIndex?: boolean;
  article?: SchemaArticleInput;
  faqs?: { question: string; answer: string }[];
  collectionItems?: SchemaCollectionItem[];
}

function getCoreBreadcrumbItems(
  basePath: string,
  canonicalUrl: string,
  heading: string,
  isFr: boolean
): Record<string, any>[] {
  const homeUrl = isFr ? `${SITE_URL}/fr` : `${SITE_URL}/`;
  const items: Record<string, any>[] = [
    {
      "@type": "ListItem",
      position: 1,
      name: isFr ? "Accueil" : "Home",
      item: homeUrl,
    },
  ];

  if (basePath === "/") {
    return items;
  }

  if (basePath.startsWith("/for/")) {
    items.push({
      "@type": "ListItem",
      position: 2,
      name: isFr ? "Éducation financière" : "Education Library",
      item: `${SITE_URL}${isFr ? "/fr" : ""}/education`,
    });
    items.push({
      "@type": "ListItem",
      position: 3,
      name: heading,
      item: canonicalUrl,
    });
    return items;
  }

  if (basePath === "/calculators/amt") {
    items.push({
      "@type": "ListItem",
      position: 2,
      name: isFr ? "Simulateurs" : "Calculators",
      item: `${SITE_URL}${isFr ? "/fr" : ""}/calculators`,
    });
    items.push({
      "@type": "ListItem",
      position: 3,
      name: heading,
      item: canonicalUrl,
    });
    return items;
  }

  items.push({
    "@type": "ListItem",
    position: 2,
    name: heading,
    item: canonicalUrl,
  });
  return items;
}

export function buildRouteJsonLd({
  pathname,
  title,
  description,
  heading,
  isFr: isFrProp,
  noIndex,
  article,
  faqs,
  collectionItems,
}: BuildRouteJsonLdOptions): Record<string, any> {
  const cleanPath = normalizeRoutePath(pathname.split("?")[0].split("#")[0] || "/");
  const isFr = typeof isFrProp === "boolean" ? isFrProp : cleanPath === "/fr" || cleanPath.startsWith("/fr/");
  const basePath = getBasePath(cleanPath);
  const { canonicalUrl } = getLanguageUrls(cleanPath);
  const routeSeo = getCoreRouteSeo(cleanPath);
  const ogImage = getOgImageForPath(cleanPath, SITE_URL);
  const langTag = isFr ? "fr-CA" : "en-CA";

  const socialProfiles = Array.isArray(siteConfig.socialProfiles)
    ? siteConfig.socialProfiles.map((u) => u.trim()).filter(Boolean)
    : [];

  const webSiteNode: Record<string, any> = {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: siteConfig.name,
    url: `${SITE_URL}/`,
    inLanguage: ["en-CA", "fr-CA"],
    description:
      "Plain-language Canadian financial education on registered accounts, insurance, and family money decisions.",
    publisher: {
      "@id": `${SITE_URL}/#person`,
    },
  };

  const organizationNode: Record<string, any> = {
    "@type": "FinancialService",
    "@id": `${SITE_URL}/#organization`,
    name: "Ahmed Bello Financial Solutions",
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/brand/icon-512.png`,
    image: `${SITE_URL}${siteConfig.portrait}`,
    telephone: siteConfig.publicPhone,
    email: siteConfig.publicEmail,
    description:
      "Tax-efficient wealth accumulation, family capital preservation, and financial strategy for Canadian families, CCPC business owners, and newcomers.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dieppe",
      addressRegion: "NB",
      addressCountry: "CA",
    },
    areaServed: [
      { "@type": "City", name: "Dieppe" },
      { "@type": "City", name: "Moncton" },
      { "@type": "AdministrativeArea", name: "New Brunswick" },
      { "@type": "AdministrativeArea", name: "Nova Scotia" },
      { "@type": "AdministrativeArea", name: "Prince Edward Island" },
      { "@type": "AdministrativeArea", name: "Newfoundland and Labrador" },
      { "@type": "Country", name: "Canada" },
    ],
    knowsAbout: [
      "Tax-Free Savings Account (TFSA)",
      "Registered Retirement Savings Plan (RRSP)",
      "First Home Savings Account (FHSA)",
      "Registered Disability Savings Plan (RDSP)",
      "CCPC Small Business Deduction Tax Efficiency",
      "Halal & Islamic Investing Canada",
      "Newcomer & Atlantic Immigration Program (AIP) Financial Planning",
    ],
  };

  const personNode: Record<string, any> = {
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: siteConfig.name,
    jobTitle: siteConfig.designation,
    telephone: siteConfig.publicPhone,
    email: siteConfig.publicEmail,
    image: `${SITE_URL}${siteConfig.portrait}`,
    worksFor: {
      "@id": `${SITE_URL}/#organization`,
    },
    url: `${SITE_URL}/`,
    ...(socialProfiles.length > 0 ? { sameAs: socialProfiles } : {}),
  };

  const graph: Record<string, any>[] = [webSiteNode, organizationNode, personNode];

  if (noIndex) {
    return {
      "@context": "https://schema.org",
      "@graph": [webSiteNode],
    };
  }

  // 1. Article / Insight Page
  if (article) {
    const frSeo = ARTICLE_FR_SEO[article.slug];
    const resolvedHeadline = heading || (isFr ? frSeo?.title || article.title : article.title);
    const resolvedDesc = description || (isFr ? frSeo?.description || article.description : article.description);
    const prefix = isFr ? "/fr" : "";
    const articleCanonical = `${SITE_URL}${prefix}${article.url}`;
    const parentSectionName =
      article.kind === "guide"
        ? isFr
          ? "Éducation financière"
          : "Education Library"
        : isFr
        ? "Analyses stratégiques"
        : "Strategic Insights";
    const parentSectionUrl = `${SITE_URL}${prefix}/${article.kind === "guide" ? "education" : "insights"}`;

    graph.push({
      "@type": "Article",
      "@id": `${articleCanonical}#article`,
      inLanguage: langTag,
      headline: resolvedHeadline,
      description: resolvedDesc,
      image: ogImage,
      datePublished: article.datePublished || "2025-01-15T08:00:00-05:00",
      dateModified: article.dateModified || "2026-11-05T09:00:00-05:00",
      isAccessibleForFree: true,
      author: {
        "@id": `${SITE_URL}/#person`,
      },
      publisher: {
        "@id": `${SITE_URL}/#organization`,
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": articleCanonical,
      },
      about: {
        "@type": "Thing",
        name: article.category,
      },
      ...(Array.isArray(article.sources) && article.sources.length > 0
        ? {
            citation: article.sources.map((s) => ({
              "@type": "CreativeWork",
              name: s.label,
              url: s.url,
            })),
          }
        : {}),
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["h1", ".lede", "#overview"],
      },
    });

    graph.push({
      "@type": "BreadcrumbList",
      "@id": `${articleCanonical}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: isFr ? "Accueil" : "Home",
          item: isFr ? `${SITE_URL}/fr` : `${SITE_URL}/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: parentSectionName,
          item: parentSectionUrl,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: resolvedHeadline,
          item: articleCanonical,
        },
      ],
    });

    const effectiveFaqs = faqs && faqs.length > 0 ? faqs : article.faqs;
    if (Array.isArray(effectiveFaqs) && effectiveFaqs.length > 0) {
      graph.push({
        "@type": "FAQPage",
        "@id": `${articleCanonical}#faq`,
        mainEntity: effectiveFaqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      });
    }

    return {
      "@context": "https://schema.org",
      "@graph": graph,
    };
  }

  const resolvedHeading = heading || routeSeo?.heading || title || siteConfig.name;
  const resolvedDesc = description || routeSeo?.description || "";

  // 2. Collection Pages (/education, /insights)
  if (basePath === "/education" || basePath === "/insights") {
    graph.push({
      "@type": "CollectionPage",
      "@id": `${canonicalUrl}#collection`,
      inLanguage: langTag,
      name: title || resolvedHeading,
      description: resolvedDesc,
      url: canonicalUrl,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#organization` },
      ...(collectionItems && collectionItems.length > 0
        ? {
            hasPart: collectionItems.map((item) => ({
              "@type": "Article",
              name: item.name,
              url: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
            })),
          }
        : {}),
    });
  } else if (basePath === "/costly-blindspots") {
    // 3. Blindspots ItemList + WebPage
    graph.push({
      "@type": "WebPage",
      "@id": canonicalUrl,
      url: canonicalUrl,
      name: title || resolvedHeading,
      description: resolvedDesc,
      inLanguage: langTag,
      isPartOf: { "@id": `${SITE_URL}/#website` },
    });
    if (collectionItems && collectionItems.length > 0) {
      graph.push({
        "@type": "ItemList",
        "@id": `${canonicalUrl}#itemlist`,
        name: resolvedHeading,
        description: resolvedDesc,
        numberOfItems: collectionItems.length,
        itemListElement: collectionItems.map((item, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          name: item.name,
          ...(item.description ? { description: item.description } : {}),
          url: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
        })),
      });
    }
  } else if (basePath === "/calculators" || basePath === "/calculators/amt") {
    // 4. Interactive Calculator WebApplication
    graph.push({
      "@type": "WebApplication",
      "@id": `${canonicalUrl}#webapp`,
      name: resolvedHeading,
      description: resolvedDesc,
      url: canonicalUrl,
      inLanguage: langTag,
      applicationCategory: "FinanceApplication",
      operatingSystem: "All",
      isAccessibleForFree: true,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "CAD",
      },
      provider: { "@id": `${SITE_URL}/#organization` },
      isPartOf: { "@id": `${SITE_URL}/#website` },
    });
  } else if (basePath === "/contact") {
    // 5. Contact Page
    graph.push({
      "@type": "ContactPage",
      "@id": canonicalUrl,
      name: resolvedHeading,
      description: resolvedDesc,
      url: canonicalUrl,
      inLanguage: langTag,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      mainEntity: {
        "@type": "ContactPoint",
        email: siteConfig.publicEmail,
        telephone: siteConfig.publicPhone,
        contactType: "customer service",
        areaServed: "CA",
        availableLanguage: ["English", "French"],
      },
    });
  } else {
    // 6. Standard WebPage (Home, Hubs, What Changed, How I Help, About, Careers, Legal)
    graph.push({
      "@type": "WebPage",
      "@id": canonicalUrl,
      url: canonicalUrl,
      name: title || resolvedHeading,
      description: resolvedDesc,
      inLanguage: langTag,
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: ogImage,
      },
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#person` },
    });
  }

  // BreadcrumbList on all non-home routes
  if (basePath !== "/") {
    graph.push({
      "@type": "BreadcrumbList",
      "@id": `${canonicalUrl}#breadcrumb`,
      itemListElement: getCoreBreadcrumbItems(basePath, canonicalUrl, resolvedHeading, isFr),
    });
  }

  // Optional FAQs on non-article pages (e.g., AMT calculator)
  if (Array.isArray(faqs) && faqs.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${canonicalUrl}#faq`,
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}
