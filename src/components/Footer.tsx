import React from "react";
import { Link } from "react-router-dom";
import { BrandMark } from "./BrandMark.tsx";
import { Tbc } from "./Tbc.tsx";
import { siteConfig } from "../config/site.ts";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#14211a] text-[#f7f3eb] on-dark pt-16 pb-12 mt-auto border-t border-[#2e4a3b]/40">
      <div className="wrap">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-14 border-b border-[#d6c298]/20">
          {/* Brand Column */}
          <div className="md:col-span-5 flex flex-col gap-5">
            <Link to="/" className="flex items-center gap-3.5 group text-decoration-none">
              <BrandMark size={36} reversed={true} className="w-9 h-9 shrink-0" />
              <span
                className="font-serif text-[1.65rem] text-[#f7f3eb] group-hover:text-[#d6c298] transition-colors"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                Ahmed Bello
              </span>
            </Link>
            <p className="text-sm text-[#d6c298] italic font-serif text-lg leading-snug">
              {siteConfig.footerBrandLine}
            </p>
            <div className="text-xs text-[#ece6da]/80 space-y-1.5 leading-relaxed pt-2">
              <p className="font-semibold text-[#f7f3eb]">
                {siteConfig.designation}
              </p>
              <p>
                Independent financial professional providing education and financial solutions across Canada.
              </p>
            </div>
          </div>

          {/* Site Navigation */}
          <div className="md:col-span-3 sm:col-span-6 flex flex-col gap-3">
            <h3 className="eyebrow text-xs uppercase tracking-wider text-[#d6c298]">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-sm list-none p-0 text-[#ece6da]/90">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/how-i-help" className="hover:text-white transition-colors">
                  How I Help
                </Link>
              </li>
              <li>
                <Link to="/education" className="hover:text-white transition-colors">
                  Financial Education Library
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Ahmed
                </Link>
              </li>
              <li>
                <Link to="/insights" className="hover:text-white transition-colors">
                  Insights & Essays
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Start a Conversation
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal and Standards */}
          <div className="md:col-span-4 sm:col-span-6 flex flex-col gap-3">
            <h3 className="eyebrow text-xs uppercase tracking-wider text-[#d6c298]">
              Standards & Legal
            </h3>
            <ul className="space-y-2.5 text-sm list-none p-0 text-[#ece6da]/90">
              <li>
                <Link to="/disclosures" className="hover:text-white transition-colors">
                  Disclosures & How This Site Works
                </Link>
              </li>
              <li>
                <Link to="/standards" className="hover:text-white transition-colors">
                  Editorial Standards & Sources
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy Notice
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Website Terms of Use
                </Link>
              </li>
            </ul>
            <div className="pt-2 text-xs text-[#ece6da]/70">
              <p>
                Privacy enquiries:{" "}
                <a
                  href={`mailto:${siteConfig.privacyEmail}`}
                  className="underline hover:text-white transition-colors"
                >
                  {siteConfig.privacyEmail}
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-xs text-[#ece6da]/65 leading-relaxed">
          <p className="max-w-3xl">
            <strong>Important notice:</strong> This website is an educational resource intended to
            explain general Canadian financial concepts and rules. It does not provide personalized
            financial, investment, tax, or legal advice, and does not constitute an offer or solicitation.
            Services and products are offered only where licensed and authorized.
          </p>
          <p className="whitespace-nowrap shrink-0">
            &copy; {currentYear} Ahmed Bello. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
