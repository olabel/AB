import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { BrandMark } from "./BrandMark.tsx";
import { Menu, X, Calendar, ArrowUpRight, Phone, Mail, Globe } from "lucide-react";
import { siteConfig } from "../config/site.ts";
import { useLanguage } from "../context/LanguageContext.tsx";

export const Header: React.FC = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMenuMounted, setIsMenuMounted] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const location = useLocation();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

  const navItems = [
    { label: t("nav_home"), href: "/" },
    { label: t("nav_how_i_help"), href: "/how-i-help" },
    { label: t("nav_education"), href: "/education" },
    { label: t("nav_insights"), href: "/insights" },
    { label: t("nav_careers"), href: "/careers" },
  ];

  // Helper to cleanly open mobile menu with entrance animation
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

  // Helper to smoothly close mobile menu with exit transition
  const closeMobileMenu = () => {
    setIsMenuVisible(false);
    setMobileMenuOpen(false);
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => {
      setIsMenuMounted(false);
    }, 280);
  };

  // Close menu on route change
  useEffect(() => {
    closeMobileMenu();
  }, [location.pathname]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  // Lock body scroll and handle focus trapping when mobile menu is open
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
      }, 50);
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
      {/* Skip to Main Content Link for Keyboard Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#2e4a3b] focus:text-[#f7f3eb] focus:outline-none focus:ring-2 focus:ring-[#75581f] text-xs font-semibold uppercase tracking-wider rounded-[2px]"
      >
        Skip to main content
      </a>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-[#f7f3eb]/95 backdrop-blur-md border-b border-[#d6cebd] transition-colors">
        <div className="wrap">
          <div className="flex items-center justify-between h-20">
            {/* Brand Logo & Name */}
            <Link
              to="/"
              className="flex items-center gap-3.5 group text-decoration-none"
              aria-label="Ahmed Bello - Home"
            >
              <BrandMark size={34} className="w-[34px] h-[34px] shrink-0" />
              <span
                className="font-serif text-[1.55rem] tracking-[-0.015em] text-[#1c1b18] group-hover:text-[#2e4a3b] transition-colors whitespace-nowrap"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Ahmed Bello
              </span>
            </Link>

            {/* Desktop Navigation (screens >= 1280px) */}
            <nav
              aria-label="Primary navigation"
              className="hidden xl:flex items-center gap-7 text-[0.9375rem] font-medium text-[#46423a]"
            >
              {navItems.map((item) => {
                const isActive =
                  item.href === "/"
                    ? location.pathname === "/"
                    : location.pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`whitespace-nowrap transition-colors py-1 relative ${
                      isActive
                        ? "text-[#1c1b18] font-semibold border-b-2 border-[#2e4a3b]"
                        : "text-[#46423a] hover:text-[#1c1b18]"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* French/English Toggle + CTA + Mobile Menu Button */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Language Switcher Button */}
              <button
                type="button"
                onClick={toggleLanguage}
                aria-label={language === "en" ? "Passer au français" : "Switch to English"}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[2px] border border-[#d6cebd] hover:border-[#2e4a3b] bg-[#fcfaf5] text-xs font-semibold text-[#1c1b18] hover:text-[#2e4a3b] transition-colors shadow-2xs cursor-pointer"
                title={language === "en" ? "Afficher le site en français" : "View site in English"}
              >
                <Globe className="w-3.5 h-3.5 text-[#75581f]" />
                <span className="uppercase tracking-wider">{language === "en" ? "FR" : "EN"}</span>
              </button>

              <Link
                to="/contact"
                className="hidden sm:inline-flex btn btn-primary text-sm whitespace-nowrap px-4 py-2"
              >
                {t("btn_start_conversation")}
              </Link>

              {/* Mobile Menu Trigger (< 1280px) */}
              <button
                ref={triggerRef}
                type="button"
                onClick={openMobileMenu}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-navigation-menu"
                aria-label="Open main navigation menu"
                className="xl:hidden p-2.5 text-[#1c1b18] hover:text-[#2e4a3b] focus-visible:outline-2 focus-visible:outline-[#2e4a3b] rounded transition-colors"
              >
                <Menu className="w-6 h-6" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Full-screen Mobile Menu with Smooth Slide-in Transition (< 1280px) */}
      {isMenuMounted && (
        <div
          ref={menuRef}
          id="mobile-navigation-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          className={`xl:hidden fixed inset-0 z-50 bg-[#f7f3eb] overflow-y-auto transition-opacity duration-280 ease-out ${
            isMenuVisible ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div
            className={`min-h-full flex flex-col justify-between transition-transform duration-280 ease-out ${
              isMenuVisible ? "translate-y-0" : "-translate-y-3"
            }`}
          >
            <div>
              {/* Mobile Header Bar */}
              <div className="wrap">
                <div className="flex items-center justify-between h-20 border-b border-[#d6cebd]">
                  <Link
                    to="/"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3.5 text-decoration-none"
                  >
                    <BrandMark size={34} className="w-[34px] h-[34px]" />
                    <span
                      className="font-serif text-[1.55rem] text-[#1c1b18]"
                      style={{ fontFamily: "var(--font-serif)" }}
                    >
                      Ahmed Bello
                    </span>
                  </Link>

                  <div className="flex items-center gap-2">
                    {/* Language Switcher in Mobile Header */}
                    <button
                      type="button"
                      onClick={toggleLanguage}
                      aria-label={language === "en" ? "Passer au français" : "Switch to English"}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[2px] border border-[#d6cebd] bg-[#fcfaf5] text-xs font-semibold text-[#1c1b18]"
                    >
                      <Globe className="w-3.5 h-3.5 text-[#75581f]" />
                      <span>{language === "en" ? "Français" : "English"}</span>
                    </button>

                    <button
                      ref={firstFocusableRef}
                      type="button"
                      onClick={() => {
                        closeMobileMenu();
                        triggerRef.current?.focus();
                      }}
                      aria-label="Close navigation menu"
                      className="p-2.5 text-[#1c1b18] hover:text-[#2e4a3b] focus-visible:outline-2 focus-visible:outline-[#2e4a3b] rounded transition-colors"
                    >
                      <X className="w-7 h-7" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="wrap py-6">
                <nav className="flex flex-col gap-2 font-serif" aria-label="Mobile menu navigation">
                  {navItems.map((item) => {
                    const isActive =
                      item.href === "/"
                        ? location.pathname === "/"
                        : location.pathname.startsWith(item.href);

                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={closeMobileMenu}
                        className={`py-3 text-2xl tracking-tight transition-colors border-b border-[#ece6da] flex items-center justify-between ${
                          isActive
                            ? "text-[#2e4a3b] font-semibold"
                            : "text-[#1c1b18] hover:text-[#2e4a3b]"
                        }`}
                      >
                        <span>{item.label}</span>
                        <span className="text-xs font-mono text-[#75581f]">&rarr;</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Mobile Bottom Quick Actions */}
            <div className="wrap py-8 border-t border-[#d6cebd] bg-[#fcfaf5] space-y-4">
              <div className="flex flex-col gap-3">
                <Link
                  to="/contact"
                  onClick={closeMobileMenu}
                  className="btn btn-primary w-full text-center py-3 text-base font-medium shadow-sm"
                >
                  {t("btn_start_conversation")}
                </Link>

                {siteConfig.schedulingUrl && (
                  <a
                    href={siteConfig.schedulingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={closeMobileMenu}
                    className="btn btn-secondary w-full text-center py-3 text-sm font-medium inline-flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4 text-[#75581f]" />
                    <span>{t("btn_book_call")}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#75581f]" />
                  </a>
                )}
              </div>

              {/* Direct Practice Contacts */}
              <div className="pt-2 flex flex-col gap-2 text-xs text-[#625d52]">
                {siteConfig.publicPhone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-[#75581f]" />
                    <a href={`tel:${siteConfig.publicPhone.replace(/\s+/g, "")}`}>
                      {siteConfig.publicPhone}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#75581f]" />
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
