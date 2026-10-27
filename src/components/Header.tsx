import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { BrandMark } from "./BrandMark.tsx";
import { Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "How I Help", href: "/how-i-help" },
  { label: "Financial Education", href: "/education" },
  { label: "About Ahmed", href: "/about" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
];

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, location.search]);

  // Focus trap and Escape key listener for mobile menu
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
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

    // Lock body scroll when mobile menu is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    // Initial focus on close button
    firstFocusableRef.current?.focus();

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

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
            <div className="flex items-center gap-3 shrink-0">
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
                onClick={() => setMobileMenuOpen(true)}
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

      {/* Full-screen Mobile Menu with focus trap */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-menu"
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          className="fixed inset-0 z-50 bg-[#f7f3eb] flex flex-col xl:hidden overflow-y-auto"
        >
          {/* Mobile Header Bar */}
          <div className="wrap">
            <div className="flex items-center justify-between h-20 border-b border-[#d6cebd]">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
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
                  setMobileMenuOpen(false);
                  triggerRef.current?.focus();
                }}
                aria-label="Close navigation menu"
                className="p-2.5 text-[#1c1b18] hover:text-[#2e4a3b] focus-visible:outline-2 focus-visible:outline-[#2e4a3b] rounded"
              >
                <X className="w-7 h-7" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="wrap py-8 flex-1 flex flex-col justify-between">
            <nav className="flex flex-col gap-5 text-xl font-serif">
              {NAV_ITEMS.map((item) => {
                const isActive =
                  item.href === "/"
                    ? location.pathname === "/"
                    : location.pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`py-2 text-2xl transition-colors border-b border-[#ece6da] ${
                      isActive
                        ? "text-[#2e4a3b] font-medium"
                        : "text-[#1c1b18] hover:text-[#2e4a3b]"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="pt-8 mt-6 border-t border-[#d6cebd] flex flex-col gap-4">
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-primary w-full text-center py-3 text-base"
              >
                Start a Conversation
              </Link>
              <p className="text-xs text-[#625d52] leading-relaxed">
                Licensed Financial Solutions Professional. Financial education and
                clarity for Canadians.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
