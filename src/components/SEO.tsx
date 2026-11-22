import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { siteConfig } from "../config/site.ts";
import { useLanguage } from "../context/LanguageContext.tsx";
import {
  formatStrictTitle,
  getCanonicalUrl,
  getCoreRouteSeo,
  getLanguageUrls,
  getOgImageForPath,
} from "../config/seoMetadata.ts";
import { buildRouteJsonLd } from "../config/schema.ts";

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

/**
 * Formats page titles to strictly stay within the 60-character budget
 * without mid-word ellipses truncation.
 */
export function formatTitle(rawTitle: string, brand = "Ahmed Bello", maxLen = 60): string {
  return formatStrictTitle(rawTitle, brand, maxLen);
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonical,
  canonicalUrl,
  ogType,
  image,
  jsonLd,
  articlePublishedTime,
  articleModifiedTime,
  noIndex,
}) => {
  const location = useLocation();
  const { language } = useLanguage();
  const isFr = language === "fr";

  const path = location.pathname;
  const routeSeo = getCoreRouteSeo(path);
  const resolvedImage = image || getOgImageForPath(path, siteConfig.siteUrl);
  const { enUrl, frUrl, canonicalUrl: computedCanonical } = getLanguageUrls(path);
  const rawCanonical = canonical || canonicalUrl;
  const currentCanonical = rawCanonical
    ? rawCanonical.startsWith("http")
      ? rawCanonical
      : getCanonicalUrl(rawCanonical)
    : computedCanonical || getCanonicalUrl(path);

  const defaultTitle = isFr
    ? "Éducation financière au Canada | Ahmed Bello"
    : "Financial Education for Canadians | Ahmed Bello";

  const defaultDescription = isFr
    ? "Éducation financière claire sur les régimes enregistrés (CELI, REER, CELIAPP), l'assurance vie et les décisions familiales au Canada."
    : "Plain-language Canadian financial education on registered accounts (TFSA, RRSP, FHSA), insurance, and family money decisions.";

  const finalTitle = formatStrictTitle(title || routeSeo?.title || defaultTitle);
  const finalDescription = description || routeSeo?.description || defaultDescription;
  const finalOgType = ogType || routeSeo?.ogType || "website";
  const finalNoIndex = typeof noIndex === "boolean" ? noIndex : Boolean(routeSeo?.noIndex);

  useEffect(() => {
    document.title = finalTitle;
    document.documentElement.lang = isFr ? "fr-CA" : "en-CA";

    const setMetaTag = (attr: "name" | "property", key: string, content: string) => {
      const tags = document.querySelectorAll(`meta[${attr}="${key}"]`);
      let tag = tags[0] as HTMLMetaElement | undefined;
      for (let i = 1; i < tags.length; i++) {
        tags[i].remove();
      }
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attr, key);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    const removeMetaTag = (attr: "name" | "property", key: string) => {
      document.querySelectorAll(`meta[${attr}="${key}"]`).forEach((el) => el.remove());
    };

    removeMetaTag("name", "keywords");

    const setLinkTag = (rel: string, href: string, extraAttrs: Record<string, string> = {}) => {
      let selector = `link[rel="${rel}"]`;
      if (extraAttrs.hreflang) {
        selector += `[hreflang="${extraAttrs.hreflang}"]`;
      }
      const links = document.querySelectorAll(selector);
      let link = links[0] as HTMLLinkElement | undefined;
      for (let i = 1; i < links.length; i++) {
        links[i].remove();
      }
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", rel);
        Object.entries(extraAttrs).forEach(([k, v]) => link!.setAttribute(k, v));
        document.head.appendChild(link);
      }
      link.setAttribute("href", href);
    };

    const isIntakeHost =
      typeof window !== "undefined" &&
      window.location.hostname.toLowerCase() === "intake.ahmedbello.com";

    setMetaTag("name", "description", finalDescription);
    setMetaTag(
      "name",
      "robots",
      finalNoIndex || isIntakeHost
        ? "noindex, nofollow, noarchive"
        : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
    );

    setLinkTag("canonical", currentCanonical);
    setLinkTag("alternate", enUrl, { hreflang: "en-CA" });
    setLinkTag("alternate", frUrl, { hreflang: "fr-CA" });
    setLinkTag("alternate", enUrl, { hreflang: "x-default" });

    setMetaTag("property", "og:title", finalTitle);
    setMetaTag("property", "og:description", finalDescription);
    setMetaTag("property", "og:url", currentCanonical);
    setMetaTag("property", "og:type", finalOgType);
    setMetaTag("property", "og:site_name", "Ahmed Bello");
    setMetaTag("property", "og:locale", isFr ? "fr_CA" : "en_CA");
    setMetaTag("property", "og:locale:alternate", isFr ? "en_CA" : "fr_CA");
    setMetaTag("property", "og:image", resolvedImage);
    setMetaTag("property", "og:image:secure_url", resolvedImage);

    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:title", finalTitle);
    setMetaTag("name", "twitter:description", finalDescription);
    setMetaTag("name", "twitter:image", resolvedImage);

    if (articlePublishedTime) {
      setMetaTag("property", "article:published_time", articlePublishedTime);
    } else {
      removeMetaTag("property", "article:published_time");
    }

    if (articleModifiedTime) {
      setMetaTag("property", "article:modified_time", articleModifiedTime);
    } else {
      removeMetaTag("property", "article:modified_time");
    }

    // Always clear SSR/static prerendered JSON-LD blocks so SPA navigation never leaves stale or duplicate @id graphs
    document.querySelectorAll('script[data-prerender-jsonld="true"]').forEach((el) => el.remove());

    let scriptTag = document.getElementById("route-jsonld") as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement("script");
      scriptTag.id = "route-jsonld";
      scriptTag.type = "application/ld+json";
      document.head.appendChild(scriptTag);
    }

    const resolvedJsonLd = jsonLd
      ? Array.isArray(jsonLd)
        ? { "@context": "https://schema.org", "@graph": jsonLd }
        : jsonLd
      : buildRouteJsonLd({
          pathname: path,
          title: finalTitle,
          description: finalDescription,
          heading: routeSeo?.heading,
          isFr,
          noIndex: finalNoIndex,
        });

    scriptTag.text = JSON.stringify(resolvedJsonLd);

    return () => {
      const tag = document.getElementById("route-jsonld");
      if (tag) tag.remove();
    };
  }, [
    path,
    routeSeo?.heading,
    finalTitle,
    finalDescription,
    currentCanonical,
    enUrl,
    frUrl,
    finalOgType,
    resolvedImage,
    jsonLd,
    isFr,
    finalNoIndex,
    articlePublishedTime,
    articleModifiedTime,
  ]);

  return null;
};
