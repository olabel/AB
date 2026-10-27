import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { BrandMark } from "./BrandMark.tsx";
import { Menu, X, Calendar, ArrowUpRight, Phone, Mail } from "lucide-react";
import { siteConfig } from "../config/site.ts";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "How I Help", href: "/how-i-help" },
  { label: "Financial Education", href: "/education" },
  { label: "Insights", href: "/insights" },
  { label: "Become an Agent", href: "/careers" },
];

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMenuMounted, setIsMenuMounted] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const location = useLocation();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

  // Smooth open animation: mount DOM first, then trigger slide-in on next frame
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

  // Smooth close animation: reverse slide-out and backdrop fade, then unmount
  const closeMobileMenu = () => {
    setIsMenuVisible(false);
    setMobileMenuOpen(false);
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => {
      setIsMenuMounted(false);
    }, 320);
  };

  // Close mobile menu on route change
  useEffect(() => {
    if (mobileMenuOpen || isMenuMounted) {
      closeMobileMenu();
    }
  }, [location.pathname, location.search]);

  // Close mobile menu if screen resizes to >= 1280px (xl breakpoint)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280 && (mobileMenuOpen || isMenuMounted)) {
        closeMobileMenu();
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileMenuOpen, isMenuMounted]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  // Focus trap, Escape key listener, and body scroll lock for mobile menu
  useEffect(() => {
    if (!isMenuMounted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMobileMenu();
        triggerRef.current?.focus();
        return;
      }

      if (e.key === "Tab" && menuRef.current) {
        const focusableElements = menuRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    // Lock body scroll when mobile menu is active
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    // Initial focus on close button once visible
    if (isMenuVisible) {
      firstFocusableRef.current?.focus();
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuMounted, isMenuVisible]);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only-focusable fixed top-3 left-3 z-[100] bg-[#2e4a3b] text-[#f7f3eb] px-4 py-2 rounded font-medium text-sm shadow-md"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-40 bg-[#f7f3eb]/95 backdrop-blur-md border-b border-[#d6cebd] transition-colors">
        <div className="wrap">
          <div className="flex items-center justify-between h-20 gap-4">
            {/* Brand Zone */}
            <Link
              to="/"
              className="flex items-center gap-3.5 group text-decoration-none shrink-0"
              aria-label="Ahmed Bello - Home"
            >
              <BrandMark size={34} className="w-[34px] h-[34px] shrink-0" />
              <span
                className="font-serif text-[1.55rem] tracking-[-0.015em] text-[#1c1b18] group-hover:text-[#2e4a3b] transition-colors whitespace-nowrap"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                Ahmed Bello
              </span>
            </Link>

            {/* Desktop Navigation (screens >= 1280px) */}
            <nav
              aria-label="Primary navigation"
              className="hidden xl:flex items-center gap-7 text-[0.9375rem] font-medium text-[#46423a]"
            >
              {NAV_ITEMS.map((item) => {
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

            {/* CTA + Mobile Menu Button */}
            <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
              <Link
                to="/contact"
                className="hidden sm:inline-flex btn btn-primary text-sm whitespace-nowrap px-4 py-2"
              >
                Start a Conversation
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
          id="mobile-navigation-menu"
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          className="fixed inset-0 z-50 xl:hidden overflow-hidden"
        >
          {/* Backdrop with fade transition */}
          <div
            onClick={() => {
              closeMobileMenu();
              triggerRef.current?.focus();
            }}
            className={`fixed inset-0 bg-[#1c1b18]/45 backdrop-blur-[2px] transition-opacity duration-300 ease-out ${
              isMenuVisible ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden="true"
          />

          {/* Full-Screen Drawer Panel with Slide-in from Right */}
          <div
            className={`relative w-full h-full bg-[#f7f3eb] flex flex-col justify-between overflow-y-auto transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
              isMenuVisible ? "translate-x-0" : "translate-x-full"
            } motion-reduce:transition-none motion-reduce:transform-none shadow-2xl`}
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
                      style={{ fontFamily: 'var(--font-serif)' }}
                    >
                      Ahmed Bello
                    </span>
                  </Link>
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

              {/* Navigation Links */}
              <div className="wrap py-6">
                <nav className="flex flex-col gap-2 font-serif" aria-label="Mobile menu navigation">
                  {NAV_ITEMS.map((item) => {
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
                        {isActive && (
                          <span className="w-2 h-2 rounded-full bg-[#2e4a3b]" aria-hidden="true" />
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Bottom Actions & Calendly Integration */}
            <div className="wrap py-6 bg-[#f2ecdf]/60 border-t border-[#d6cebd] flex flex-col gap-4">
              {/* Calendly Booking Card */}
              {siteConfig.schedulingUrl && (
                <a
                  href={siteConfig.schedulingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 bg-[#fcfaf5] border border-[#2e4a3b]/30 hover:border-[#2e4a3b] rounded-[2px] flex items-center justify-between gap-3 text-left transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#2e4a3b] text-[#f7f3eb] flex items-center justify-center shrink-0">
                      <Calendar className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#1c1b18] flex items-center gap-1.5">
                        <span>Book 30-Min Consultation</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-[#75581f] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" aria-hidden="true" />
                      </div>
                      <div className="text-xs text-[#625d52]">
                        Direct reservation on Calendly
                      </div>
                    </div>
                  </div>
                </a>
              )}

              {/* Start a Conversation CTA */}
              <Link
                to="/contact"
                onClick={closeMobileMenu}
                className="btn btn-primary w-full text-center py-3 text-base shadow-sm"
              >
                Start a Conversation
              </Link>

              {/* Direct Phone & Email info */}
              <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-[#46423a]">
                {siteConfig.publicPhone && (
                  <a
                    href={`tel:${siteConfig.publicPhone.replace(/\s+/g, "")}`}
                    className="inline-flex items-center gap-1.5 text-[#2e4a3b] hover:underline"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#75581f]" aria-hidden="true" />
                    <span>{siteConfig.publicPhone}</span>
                  </a>
                )}
                <a
                  href={`mailto:${siteConfig.publicEmail}`}
                  className="inline-flex items-center gap-1.5 text-[#2e4a3b] hover:underline"
                >
                  <Mail className="w-3.5 h-3.5 text-[#75581f]" aria-hidden="true" />
                  <span>{siteConfig.publicEmail}</span>
                </a>
              </div>

              <p className="text-[0.75rem] text-[#625d52] leading-relaxed pt-1">
                Licensed Financial Solutions Professional. Independent financial education and clarity for Canadians across 13 provinces and territories.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

