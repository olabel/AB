import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { siteConfig } from "../config/site.ts";
import { useLanguage } from "../context/LanguageContext.tsx";

export interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  canonicalUrl?: string;
  ogType?: "website" | "article";
  image?: string;
  jsonLd?: Record<string, any> | Record<string, any>[];
  articlePublishedTime?: string;
  articleModifiedTime?: string;
  noIndex?: boolean;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonical,
  canonicalUrl,
  ogType = "website",
  image = `${siteConfig.siteUrl}/brand/og-share.png`,
  jsonLd,
  articlePublishedTime,
  articleModifiedTime,
  noIndex = false,
}) => {
  const location = useLocation();
  const { language } = useLanguage();
  const isFr = language === "fr";

  // Compute canonical URL
  const path = location.pathname;
  const isFrenchRoute = path.startsWith("/fr");
  const baseCanonicalPath = isFrenchRoute ? path.replace(/^\/fr(\/|$)/, "$1") || "/" : path;

  const currentCanonical =
    canonical ||
    canonicalUrl ||
    `${siteConfig.siteUrl}${path.startsWith("/") ? path : `/${path}`}`;

  const englishUrl = `${siteConfig.siteUrl}${baseCanonicalPath === "/" ? "" : baseCanonicalPath}`;
  const frenchUrl = `${siteConfig.siteUrl}/fr${baseCanonicalPath === "/" ? "" : baseCanonicalPath}`;

  // Default title & description
  const defaultTitle = isFr
    ? "Ahmed Bello | Éducation Financière pour Canadiens"
    : "Ahmed Bello | Financial Education for Canadians";

  const defaultDescription = isFr
    ? "Éducation financière en langage clair sur les régimes enregistrés (CELI, REER, CELIAPP), l'assurance vie et les décisions budgétaires avec Ahmed Bello."
    : "Plain-language Canadian financial education on registered accounts (TFSA, RRSP, FHSA), insurance, and family money decisions with Ahmed Bello.";

  const finalTitle = title ? `${title} | Ahmed Bello` : defaultTitle;
  const finalDescription = description || defaultDescription;

  useEffect(() => {
    // 1. Update Document Title
    document.title = finalTitle;
    document.documentElement.lang = isFr ? "fr-CA" : "en-CA";

    // 2. Helper to set/update meta tag
    const setMetaTag = (attr: "name" | "property", key: string, content: string) => {
      let tag = document.querySelector(`meta[${attr}="${key}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attr, key);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    // 3. Helper to set/update link tag
    const setLinkTag = (rel: string, href: string, extraAttrs: Record<string, string> = {}) => {
      let selector = `link[rel="${rel}"]`;
      if (extraAttrs.hreflang) {
        selector += `[hreflang="${extraAttrs.hreflang}"]`;
      }
      let link = document.querySelector(selector);
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", rel);
        Object.entries(extraAttrs).forEach(([k, v]) => link!.setAttribute(k, v));
        document.head.appendChild(link);
      }
      link.setAttribute("href", href);
    };

    // Standard Meta
    setMetaTag("name", "description", finalDescription);
    setMetaTag(
      "name",
      "robots",
      noIndex
        ? "noindex, nofollow"
        : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
    );

    // Canonical & Language Alternates
    setLinkTag("canonical", currentCanonical);
    setLinkTag("alternate", englishUrl, { hreflang: "en-CA" });
    setLinkTag("alternate", frenchUrl, { hreflang: "fr-CA" });
    setLinkTag("alternate", englishUrl, { hreflang: "x-default" });

    // OpenGraph
    setMetaTag("property", "og:title", finalTitle);
    setMetaTag("property", "og:description", finalDescription);
    setMetaTag("property", "og:url", currentCanonical);
    setMetaTag("property", "og:type", ogType);
    setMetaTag("property", "og:site_name", "Ahmed Bello");
    setMetaTag("property", "og:locale", isFr ? "fr_CA" : "en_CA");
    setMetaTag("property", "og:locale:alternate", isFr ? "en_CA" : "fr_CA");
    setMetaTag("property", "og:image", image);

    // Twitter Card
    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:title", finalTitle);
    setMetaTag("name", "twitter:description", finalDescription);
    setMetaTag("name", "twitter:image", image);

    if (articlePublishedTime) {
      setMetaTag("property", "article:published_time", articlePublishedTime);
    }
    if (articleModifiedTime) {
      setMetaTag("property", "article:modified_time", articleModifiedTime);
    }

    // 4. Injected Structured Data (JSON-LD)
    let scriptTag = document.getElementById("route-jsonld") as HTMLScriptElement | null;
    if (jsonLd) {
      if (!scriptTag) {
        scriptTag = document.createElement("script");
        scriptTag.id = "route-jsonld";
        scriptTag.type = "application/ld+json";
        document.head.appendChild(scriptTag);
      }
      const data = Array.isArray(jsonLd) ? { "@context": "https://schema.org", "@graph": jsonLd } : jsonLd;
      scriptTag.text = JSON.stringify(data);
    } else if (scriptTag) {
      scriptTag.remove();
    }

    return () => {
      // Cleanup custom JSON-LD when unmounting
      const tag = document.getElementById("route-jsonld");
      if (tag) tag.remove();
    };
  }, [finalTitle, finalDescription, currentCanonical, englishUrl, frenchUrl, ogType, image, jsonLd, isFr, noIndex]);

  return null;
};
