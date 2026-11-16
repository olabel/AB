import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BrandMark } from "./BrandMark.tsx";
import { Menu, X, ChevronDown, ArrowRight, Phone, Mail, Globe } from "lucide-react";
import { siteConfig, getCtaLabel, getSecondaryCtaLabel } from "../config/site.ts";
import { useLanguage } from "../context/LanguageContext.tsx";
import { trackBookingClick } from "../lib/track.ts";

export const Header: React.FC = () => {
  const { language } = useLanguage();
  const isFr = language === "fr";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMenuMounted, setIsMenuMounted] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

  const prefix = isFr ? "/fr" : "";
  const ctaLabel = getCtaLabel(isFr);
  const secondaryCtaLabel = getSecondaryCtaLabel(isFr);

  const learnLinks = [
    {
      label: isFr ? "Bibliothèque d'éducation" : "Education Library",
      href: `${prefix}/education`,
    },
    {
      label: isFr ? "Règles financières 2026" : "2026 Money Rules",
      href: `${prefix}/what-changed`,
    },
    {
      label: isFr ? "Pièges financiers coûteux" : "Costly Blindspots",
      href: `${prefix}/costly-blindspots`,
    },
    {
      label: isFr ? "Analyses stratégiques" : "Insights & Essays",
      href: `${prefix}/insights`,
    },
    {
      label: isFr ? "Investissement islamique" : "Islamic Equity Investing",
      href: `${prefix}/investing/islamic-equity`,
    },
  ];

  const toolsLinks = [
    {
      label: isFr ? "Tous les simulateurs" : "All Planning Calculators",
      href: `${prefix}/calculators`,
    },
    {
      label: isFr ? "Calculateur d'IMR fédéral" : "Federal AMT Calculator",
      href: `${prefix}/calculators/amt`,
    },
  ];

  const isLearnActive =
    location.pathname.startsWith(`${prefix}/education`) ||
    location.pathname.startsWith(`${prefix}/what-changed`) ||
    location.pathname.startsWith(`${prefix}/costly-blindspots`) ||
    location.pathname.startsWith(`${prefix}/insights`) ||
    location.pathname.startsWith(`${prefix}/investing`);

  const isToolsActive = location.pathname.startsWith(`${prefix}/calculators`);

  const handleLanguageToggle = () => {
    const isCurrentlyFrench = location.pathname.startsWith("/fr");
    const suffix = `${location.search}${location.hash}`;
    if (isCurrentlyFrench) {
      const target = location.pathname.replace(/^\/fr(\/|$)/, "$1") || "/";
      navigate(`${target}${suffix}`);
    } else {
      const target = location.pathname === "/" ? "/fr" : `/fr${location.pathname}`;
      navigate(`${target}${suffix}`);
    }
  };

  const openMobileMenu = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsMenuMounted(true);
    setMobileMenuOpen(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsMenuVisible(true);
      });
    });
  };

  const closeMobileMenu = () => {
    setIsMenuVisible(false);
    setMobileMenuOpen(false);
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => {
      setIsMenuMounted(false);
    }, 240);
  };

  useEffect(() => {
    closeMobileMenu();
    setOpenDropdown(null);
  }, [location.pathname]);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!mobileMenuOpen) return;

      if (e.key === "Escape") {
        closeMobileMenu();
        triggerRef.current?.focus();
        return;
      }

      if (e.key === "Tab" && menuRef.current) {
        const focusables = menuRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            last.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === last) {
            first.focus();
            e.preventDefault();
          }
        }
      }
    };

    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKeyDown);
      setTimeout(() => {
        firstFocusableRef.current?.focus();
      }, 40);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  return (
    <>
      {/* Skip to Main Content Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#2e4a3b] focus:text-[#f7f3eb] focus:outline-none focus:ring-2 focus:ring-[#75581f] text-xs font-semibold uppercase tracking-wider rounded-[2px]"
      >
        {isFr ? "Aller au contenu principal" : "Skip to main content"}
      </a>

      {/* Thin Announcement Bar Above Header */}
      <div className="bg-[#14211a] text-[#f7f3eb] text-xs border-b border-[#2e4a3b]/70">
        <div className="wrap py-2 flex items-center justify-between gap-3">
          <p className="text-[#ece6da] truncate">
            <span className="text-[#d6c298] font-semibold mr-2">
              {isFr ? "Nov. 2026 — Règles financières :" : "Nov 2026 Money Rules:"}
            </span>
            <span>
              {isFr
                ? "Budget fédéral 2026, taux directeur à 2,50 % et plafonds REER 2027."
                : "Federal Budget 2026, BoC 2.50% rate, and 2027 RRSP limits."}
            </span>
          </p>
          <Link
            to={`${prefix}/what-changed`}
            className="text-[#d6c298] hover:text-white font-medium underline underline-offset-2 whitespace-nowrap shrink-0 transition-colors"
          >
            {isFr ? "Lire la synthèse →" : "Read summary →"}
          </Link>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-40 bg-[#f7f3eb]/95 backdrop-blur-md border-b border-[#d6cebd] transition-colors">
        <div className="wrap">
          <div className="flex items-center justify-between h-20">
            {/* Brand Logo & Name */}
            <Link
              to={prefix || "/"}
              className="flex items-center gap-3 group text-decoration-none"
              aria-label="Ahmed Bello - Home"
            >
              <BrandMark size={34} className="w-[34px] h-[34px] shrink-0" />
              <span
                className="font-serif text-[1.5rem] tracking-[-0.01em] text-[#1c1b18] group-hover:text-[#2e4a3b] transition-colors whitespace-nowrap"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Ahmed Bello
              </span>
            </Link>

            {/* Grouped Desktop Navigation: How I Help | Learn | Tools | About */}
            <nav
              aria-label={isFr ? "Navigation principale" : "Primary navigation"}
              className="hidden xl:flex items-center gap-7 text-[0.9375rem] font-medium text-[#46423a]"
            >
              <Link
                to={`${prefix}/how-i-help`}
                className={`whitespace-nowrap transition-colors py-1 ${
                  location.pathname.startsWith(`${prefix}/how-i-help`)
                    ? "text-[#1c1b18] font-semibold border-b-2 border-[#2e4a3b]"
                    : "text-[#46423a] hover:text-[#1c1b18]"
                }`}
              >
                {isFr ? "Comment j'aide" : "How I Help"}
              </Link>

              {/* Learn Dropdown Group */}
              <div
                className="relative"
                onMouseEnter={() => setOpenDropdown("learn")}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <div className="flex items-center gap-1">
                  <Link
                    to={`${prefix}/education`}
                    className={`whitespace-nowrap transition-colors py-1 ${
                      isLearnActive
                        ? "text-[#1c1b18] font-semibold border-b-2 border-[#2e4a3b]"
                        : "text-[#46423a] hover:text-[#1c1b18]"
                    }`}
                  >
                    {isFr ? "Apprendre" : "Learn"}
                  </Link>
                  <button
                    type="button"
                    aria-label={isFr ? "Afficher les liens Apprendre" : "Toggle Learn submenu"}
                    aria-expanded={openDropdown === "learn"}
                    onClick={() => setOpenDropdown(openDropdown === "learn" ? null : "learn")}
                    className="p-0.5 text-[#625d52] hover:text-[#1c1b18] transition-colors cursor-pointer"
                  >
                    <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>

                {openDropdown === "learn" && (
                  <div className="absolute left-0 top-full pt-2 w-60 z-50">
                    <div className="bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] shadow-xs py-1.5">
                      {learnLinks.map((sub) => (
                        <Link
                          key={sub.href}
                          to={sub.href}
                          className="block px-4 py-2 text-sm text-[#1c1b18] hover:bg-[#f7f3eb] hover:text-[#2e4a3b] transition-colors"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Tools Dropdown Group */}
              <div
                className="relative"
                onMouseEnter={() => setOpenDropdown("tools")}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <div className="flex items-center gap-1">
                  <Link
                    to={`${prefix}/calculators`}
                    className={`whitespace-nowrap transition-colors py-1 ${
                      isToolsActive
                        ? "text-[#1c1b18] font-semibold border-b-2 border-[#2e4a3b]"
                        : "text-[#46423a] hover:text-[#1c1b18]"
                    }`}
                  >
                    {isFr ? "Outils" : "Tools"}
                  </Link>
                  <button
                    type="button"
                    aria-label={isFr ? "Afficher les outils" : "Toggle Tools submenu"}
                    aria-expanded={openDropdown === "tools"}
                    onClick={() => setOpenDropdown(openDropdown === "tools" ? null : "tools")}
                    className="p-0.5 text-[#625d52] hover:text-[#1c1b18] transition-colors cursor-pointer"
                  >
                    <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>

                {openDropdown === "tools" && (
                  <div className="absolute left-0 top-full pt-2 w-60 z-50">
                    <div className="bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] shadow-xs py-1.5">
                      {toolsLinks.map((sub) => (
                        <Link
                          key={sub.href}
                          to={sub.href}
                          className="block px-4 py-2 text-sm text-[#1c1b18] hover:bg-[#f7f3eb] hover:text-[#2e4a3b] transition-colors"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Link
                to={`${prefix}/about`}
                className={`whitespace-nowrap transition-colors py-1 ${
                  location.pathname.startsWith(`${prefix}/about`)
                    ? "text-[#1c1b18] font-semibold border-b-2 border-[#2e4a3b]"
                    : "text-[#46423a] hover:text-[#1c1b18]"
                }`}
              >
                {isFr ? "À propos" : "About"}
              </Link>
            </nav>

            {/* Language Switcher + Standardized Primary CTA + Mobile Menu Button */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button
                type="button"
                onClick={handleLanguageToggle}
                aria-label={language === "en" ? "Passer au français" : "Switch to English"}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[2px] border border-[#d6cebd] hover:border-[#2e4a3b] bg-[#fcfaf5] text-xs font-semibold text-[#1c1b18] hover:text-[#2e4a3b] transition-colors shadow-2xs cursor-pointer"
                title={language === "en" ? "Afficher le site en français" : "View site in English"}
              >
                <Globe className="w-3.5 h-3.5 text-[#75581f]" aria-hidden="true" />
                <span className="uppercase tracking-wider">{language === "en" ? "FR" : "EN"}</span>
              </button>

              <a
                href={siteConfig.schedulingUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackBookingClick("header")}
                className="hidden sm:inline-flex btn btn-primary text-sm whitespace-nowrap px-4 py-2"
              >
                {ctaLabel}
              </a>

              {/* Mobile Menu Trigger (< 1280px) */}
              <button
                ref={triggerRef}
                type="button"
                onClick={openMobileMenu}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-navigation-menu"
                aria-label={isFr ? "Ouvrir le menu" : "Open main navigation menu"}
                className="xl:hidden p-2.5 text-[#1c1b18] hover:text-[#2e4a3b] rounded-[2px] transition-colors cursor-pointer"
              >
                <Menu className="w-6 h-6" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Full-screen Mobile Menu Drawer (< 1280px) */}
      {isMenuMounted && (
        <div
          ref={menuRef}
          id="mobile-navigation-menu"
          role="dialog"
          aria-modal="true"
          aria-label={isFr ? "Menu mobile" : "Mobile Navigation"}
          className={`xl:hidden fixed inset-0 z-50 bg-[#f7f3eb] overflow-y-auto transition-opacity duration-200 ease-out motion-reduce:transition-none ${
            isMenuVisible ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div
            className={`min-h-full flex flex-col justify-between transition-transform duration-200 ease-out motion-reduce:transition-none ${
              isMenuVisible ? "translate-y-0" : "-translate-y-2"
            }`}
          >
            <div>
              {/* Mobile Header Bar */}
              <div className="wrap">
                <div className="flex items-center justify-between h-20 border-b border-[#d6cebd]">
                  <Link
                    to={prefix || "/"}
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 text-decoration-none"
                  >
                    <BrandMark size={34} className="w-[34px] h-[34px]" />
                    <span
                      className="font-serif text-[1.5rem] tracking-[-0.01em] text-[#1c1b18]"
                      style={{ fontFamily: "var(--font-serif)" }}
                    >
                      Ahmed Bello
                    </span>
                  </Link>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        handleLanguageToggle();
                        closeMobileMenu();
                      }}
                      aria-label={language === "en" ? "Passer au français" : "Switch to English"}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[2px] border border-[#d6cebd] bg-[#fcfaf5] text-xs font-semibold text-[#1c1b18] cursor-pointer"
                    >
                      <Globe className="w-3.5 h-3.5 text-[#75581f]" aria-hidden="true" />
                      <span>{language === "en" ? "Français" : "English"}</span>
                    </button>

                    <button
                      ref={firstFocusableRef}
                      type="button"
                      onClick={() => {
                        closeMobileMenu();
                        triggerRef.current?.focus();
                      }}
                      aria-label={isFr ? "Fermer le menu" : "Close navigation menu"}
                      className="p-2.5 text-[#1c1b18] hover:text-[#2e4a3b] rounded-[2px] transition-colors cursor-pointer"
                    >
                      <X className="w-7 h-7" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobile Primary Navigation Groups */}
              <div className="wrap py-6 space-y-6">
                <nav aria-label={isFr ? "Navigation mobile" : "Mobile menu navigation"} className="space-y-5">
                  <Link
                    to={`${prefix}/how-i-help`}
                    onClick={closeMobileMenu}
                    className="py-2.5 font-serif text-2xl text-[#1c1b18] hover:text-[#2e4a3b] border-b border-[#ece6da] flex items-center justify-between transition-colors"
                  >
                    <span>{isFr ? "Comment j'aide" : "How I Help"}</span>
                    <ArrowRight className="w-4 h-4 text-[#75581f]" aria-hidden="true" />
                  </Link>

                  <div className="border-b border-[#ece6da] pb-4 space-y-2.5">
                    <span className="eyebrow block">{isFr ? "Apprendre" : "Learn"}</span>
                    <div className="grid grid-cols-1 gap-2 pl-2">
                      {learnLinks.map((sub) => (
                        <Link
                          key={sub.href}
                          to={sub.href}
                          onClick={closeMobileMenu}
                          className="py-1.5 text-base text-[#1c1b18] hover:text-[#2e4a3b] flex items-center justify-between transition-colors"
                        >
                          <span>{sub.label}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#75581f]" aria-hidden="true" />
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="border-b border-[#ece6da] pb-4 space-y-2.5">
                    <span className="eyebrow block">{isFr ? "Outils" : "Tools"}</span>
                    <div className="grid grid-cols-1 gap-2 pl-2">
                      {toolsLinks.map((sub) => (
                        <Link
                          key={sub.href}
                          to={sub.href}
                          onClick={closeMobileMenu}
                          className="py-1.5 text-base text-[#1c1b18] hover:text-[#2e4a3b] flex items-center justify-between transition-colors"
                        >
                          <span>{sub.label}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#75581f]" aria-hidden="true" />
                        </Link>
                      ))}
                    </div>
                  </div>

                  <Link
                    to={`${prefix}/about`}
                    onClick={closeMobileMenu}
                    className="py-2.5 font-serif text-2xl text-[#1c1b18] hover:text-[#2e4a3b] border-b border-[#ece6da] flex items-center justify-between transition-colors"
                  >
                    <span>{isFr ? "À propos" : "About"}</span>
                    <ArrowRight className="w-4 h-4 text-[#75581f]" aria-hidden="true" />
                  </Link>
                </nav>

                {/* Folded Briefing Strip (replaces FloatingNewsWidget on mobile) */}
                <div className="p-4 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] space-y-1.5">
                  <span className="eyebrow block text-[#75581f]">
                    {isFr ? "Règles financières — Nov. 2026" : "2026 Money Rules — Nov Update"}
                  </span>
                  <p className="text-sm font-serif text-[#1c1b18]">
                    {isFr
                      ? "Budget 2026, plafond REER 2027 à 35 390 $ et taux directeur à 2,50 %."
                      : "Budget 2026 proposals, 2027 RRSP $35,390 limit & BoC 2.50% policy rate."}
                  </p>
                  <Link
                    to={`${prefix}/what-changed`}
                    onClick={closeMobileMenu}
                    className="arrow-link text-sm pt-1"
                  >
                    <span>{isFr ? "Lire la synthèse complète" : "Read full briefing"} →</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Mobile Bottom Quick Actions */}
            <div className="wrap py-6 border-t border-[#d6cebd] bg-[#fcfaf5] space-y-4">
              <div className="flex flex-col gap-3">
                <a
                  href={siteConfig.schedulingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    trackBookingClick("header_mobile");
                    closeMobileMenu();
                  }}
                  className="btn btn-primary w-full text-center"
                >
                  {ctaLabel}
                </a>

                <Link
                  to={`${prefix}/contact`}
                  onClick={closeMobileMenu}
                  className="btn btn-ghost w-full text-center"
                >
                  {secondaryCtaLabel}
                </Link>
              </div>

              <div className="pt-2 flex flex-col gap-2 text-xs text-[#625d52]">
                {siteConfig.publicPhone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-[#75581f]" aria-hidden="true" />
                    <a href={`tel:${siteConfig.publicPhone.replace(/\s+/g, "")}`}>
                      {siteConfig.publicPhone}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#75581f]" aria-hidden="true" />
                  <a href={`mailto:${siteConfig.publicEmail}`}>{siteConfig.publicEmail}</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
