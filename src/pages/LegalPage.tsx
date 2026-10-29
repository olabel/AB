import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { LegalPageData } from "../content/legal.ts";
import { Tbc } from "../components/Tbc.tsx";
import { SEO } from "../components/SEO.tsx";

interface LegalPageProps {
  pageType: "disclosures" | "privacy" | "standards" | "terms";
  data: LegalPageData;
  eyebrow: string;
}

export const LegalPage: React.FC<LegalPageProps> = ({ pageType, data, eyebrow }) => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.slice(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.hash, location.pathname]);

  const renderText = (text: string) => {
    return text;
  };

  return (
    <div className="py-12 md:py-16">
      <SEO
        title={`${data.title} | Ahmed Bello`}
        description={data.lede}
        canonicalUrl={`/legal/${pageType}`}
      />
      {/* Header */}
      <section className="section pb-12 pt-4 border-b border-[#d6cebd]">
        <div className="wrap max-w-4xl space-y-5">
          <span className="eyebrow text-xs">{eyebrow}</span>
          <h1 className="h1 text-[#1c1b18] leading-tight">{data.title}</h1>
          <p className="lede text-lg md:text-xl text-[#46423a] leading-relaxed">
            {data.lede}
          </p>

          {data.bannerNotice && (
            <div className="p-4 bg-[#fcfaf5] border-l-2 border-[#8d8677] text-xs text-[#625d52]">
              <Tbc>{data.bannerNotice}</Tbc>
            </div>
          )}
        </div>
      </section>

      {/* Main Content with Sticky 'On this page' index */}
      <div className="wrap max-w-5xl py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Sticky 'On this page' index (Left) */}
          <aside className="lg:col-span-4 order-2 lg:order-1">
            <div className="lg:sticky lg:top-28 p-6 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[#75581f]">
                On this page
              </h2>
              <nav aria-label="Legal document section index">
                <ol className="space-y-2.5 text-xs text-[#46423a] list-none p-0">
                  {data.sections.map((sec) => (
                    <li key={sec.id}>
                      <a
                        href={`#${sec.id}`}
                        className="hover:text-[#2e4a3b] hover:underline flex items-baseline gap-2 transition-colors py-0.5"
                      >
                        <span className="font-mono text-[#75581f] font-semibold shrink-0">
                          {sec.number}
                        </span>
                        <span className="leading-snug">{sec.title}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>

              <div className="border-t border-[#ece6da] pt-4 text-xs text-[#625d52]">
                <p>
                  Questions about these terms?{" "}
                  <Link to="/contact" className="underline text-[#2e4a3b]">
                    Contact Ahmed
                  </Link>
                </p>
              </div>
            </div>
          </aside>

          {/* Legal Sections (Right) */}
          <div className="lg:col-span-8 order-1 lg:order-2 space-y-14">
            {data.sections.map((sec) => (
              <section
                key={sec.id}
                id={sec.id}
                className="scroll-mt-28 border-b border-[#ece6da] pb-10 space-y-4"
              >
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-sm font-semibold text-[#75581f]">
                    {sec.number}
                  </span>
                  <h2 className="h3 text-[#1c1b18] text-2xl">
                    {sec.title}
                  </h2>
                </div>

                <div className="prose-editorial text-sm md:text-base text-[#46423a] leading-relaxed space-y-3.5">
                  {sec.content.map((p, pIdx) => (
                    <p key={`p-${pIdx}`}>{renderText(p)}</p>
                  ))}
                </div>
              </section>
            ))}

            {pageType === "disclosures" && (
              <div className="p-6 bg-[#f7f3eb] border border-[#d6cebd] rounded-[2px] space-y-3">
                <h3 className="h3 text-[#1c1b18] text-xl">Need more information?</h3>
                <p className="text-xs text-[#46423a]">
                  If you have questions about licensing, provincial authorization, or product suitability,
                  you are always welcome to ask.
                </p>
                <Link to="/contact" className="btn btn-primary text-xs py-2 px-4">
                  Start a Conversation &rarr;
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
