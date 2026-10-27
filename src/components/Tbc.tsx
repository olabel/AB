import React from "react";
import { DRAFT_MODE } from "../config/site.ts";

interface TbcProps {
  children?: React.ReactNode;
  text?: string;
  fallback?: React.ReactNode;
}

export const Tbc: React.FC<TbcProps> = ({ children, text, fallback = null }) => {
  if (!DRAFT_MODE) {
    return <>{fallback}</>;
  }

  const content = text || children;
  return <span className="tbc">{content}</span>;
};

export const DraftBanner: React.FC = () => {
  if (!DRAFT_MODE) return null;

  return (
    <aside
      aria-label="Pre-launch draft notice"
      className="bg-[#fbe7a1] text-[#4a3a00] border-b border-[#e5cf85] px-4 py-2 text-xs md:text-sm font-medium"
    >
      <div className="wrap flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-semibold tracking-wide uppercase text-[0.7rem] bg-[#4a3a00] text-[#fbe7a1] px-1.5 py-0.5 rounded-[2px]">
            Pre-Launch Draft
          </span>
          <span>
            Content is verified and published under Canadian editorial standards.
          </span>
        </div>
        <a
          href="/standards"
          className="underline text-xs shrink-0 hover:text-black transition-colors"
        >
          Editorial standards &rarr;
        </a>
      </div>
    </aside>
  );
};
