import React from "react";
import { siteConfig } from "../config/site.ts";

export interface PortraitProps {
  alt: string;
  variant?: "hero" | "card" | "avatar";
  className?: string;
  caption?: string;
  loading?: "eager" | "lazy";
  fetchPriority?: "high" | "low" | "auto";
}

/**
 * Canonical portrait component sourcing strictly from siteConfig.portrait.
 * Uses a single editorial frame (1px hairline border, 2px radius) without nested double borders.
 */
export const Portrait: React.FC<PortraitProps> = ({
  alt,
  variant = "card",
  className = "",
  caption,
  loading = "lazy",
  fetchPriority = "auto",
}) => {
  if (variant === "avatar") {
    return (
      <img
        src={siteConfig.portrait}
        alt={alt}
        width={64}
        height={64}
        loading={loading}
        decoding="async"
        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-[2px] border border-[#d6cebd] bg-[#fcfaf5] object-cover object-top shrink-0 ${className}`}
      />
    );
  }

  return (
    <figure className={`space-y-2.5 ${className}`}>
      <div className="bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] shadow-xs overflow-hidden">
        <img
          src={siteConfig.portrait}
          alt={alt}
          width={600}
          height={750}
          loading={loading}
          fetchPriority={fetchPriority}
          decoding={loading === "eager" ? "sync" : "async"}
          className="w-full aspect-[4/5] object-cover object-top block"
        />
      </div>
      {caption && (
        <figcaption className="text-xs sm:text-sm text-[#625d52] leading-snug">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};
