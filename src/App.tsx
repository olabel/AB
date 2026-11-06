import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { LanguageProvider, useLanguage } from "./context/LanguageContext.tsx";
import { Header } from "./components/Header.tsx";
import { Footer } from "./components/Footer.tsx";
import { DraftBanner } from "./components/Tbc.tsx";
import { FloatingNewsWidget } from "./components/FloatingNewsWidget.tsx";
import { MobileBookingBar } from "./components/MobileBookingBar.tsx";
import { Analytics } from "@vercel/analytics/react";
import { disclosuresData, privacyData, standardsData, termsData } from "./content/legal.ts";

// Direct imports ensure the matching page's code is executed before first paint,
// eliminating layout jump (CLS < 0.1) and preventing pre-rendered content from flashing a spinner.
import { HomePage } from "./pages/HomePage.tsx";
import { HowIHelpPage } from "./pages/HowIHelpPage.tsx";
import { EducationLibraryPage } from "./pages/EducationLibraryPage.tsx";
import { ArticlePage } from "./pages/ArticlePage.tsx";
import { InsightsPage } from "./pages/InsightsPage.tsx";
import { WhatChangedPage } from "./pages/WhatChangedPage.tsx";
import { Navigate } from "react-router-dom";
import { AboutPage } from "./pages/AboutPage.tsx";
import { CareersPage } from "./pages/CareersPage.tsx";
import { AudienceHubPage } from "./pages/AudienceHubPage.tsx";
import { IslamicInvestingPage } from "./pages/IslamicInvestingPage.tsx";
import { ContactPage } from "./pages/ContactPage.tsx";
import { ConfirmSubscriptionPage } from "./pages/ConfirmSubscriptionPage.tsx";
import { LegalPage } from "./pages/LegalPage.tsx";
import { CalculatorsPage } from "./pages/CalculatorsPage.tsx";
import { NotFoundPage } from "./pages/NotFoundPage.tsx";

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

function LanguageRouteSync() {
  const { pathname } = useLocation();
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    if (pathname.startsWith("/fr")) {
      if (language !== "fr") setLanguage("fr");
    } else {
      if (language !== "en") setLanguage("en");
    }
  }, [pathname, language, setLanguage]);

  return null;
}

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <ScrollToTop />
        <LanguageRouteSync />
        <div className="min-h-screen flex flex-col bg-[#f7f3eb] text-[#1c1b18] antialiased selection:bg-[#2e4a3b] selection:text-[#f7f3eb]">
          <Header />
          <DraftBanner />
          <FloatingNewsWidget />
          <main id="main-content" className="flex-1 focus:outline-none pb-16 sm:pb-0" tabIndex={-1}>
            <Routes>
                {/* English Canonical Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/how-i-help" element={<HowIHelpPage />} />
                <Route path="/education" element={<EducationLibraryPage />} />
                <Route path="/education/:slug" element={<ArticlePage />} />
                <Route path="/insights/:slug" element={<ArticlePage />} />
                <Route path="/insights" element={<InsightsPage />} />
                <Route path="/what-changed" element={<WhatChangedPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/careers" element={<CareersPage />} />
                <Route path="/for/:audience" element={<AudienceHubPage />} />
                <Route path="/investing/islamic-equity" element={<IslamicInvestingPage />} />
                <Route path="/calculators" element={<CalculatorsPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/confirm-subscription" element={<ConfirmSubscriptionPage />} />

                {/* English Aliases -> Canonical 301/Replace Redirects */}
                <Route path="/news" element={<Navigate to="/what-changed" replace />} />
                <Route path="/financial-news" element={<Navigate to="/what-changed" replace />} />
                <Route path="/financial-calculators" element={<Navigate to="/calculators" replace />} />
                <Route path="/health-workers" element={<Navigate to="/for/healthcare" replace />} />
                <Route path="/doctors-nurses" element={<Navigate to="/for/healthcare" replace />} />
                <Route path="/for/health-workers" element={<Navigate to="/for/healthcare" replace />} />
                <Route path="/for/doctors-nurses" element={<Navigate to="/for/healthcare" replace />} />
                <Route path="/for/entrepreneurs" element={<Navigate to="/for/business-owners" replace />} />
                <Route path="/for/incorporated" element={<Navigate to="/for/business-owners" replace />} />
                <Route path="/for/immigrants" element={<Navigate to="/for/newcomers" replace />} />
                <Route path="/for/new-to-canada" element={<Navigate to="/for/newcomers" replace />} />
                <Route path="/for/parents" element={<Navigate to="/for/families" replace />} />
                <Route path="/for/muslim-investors" element={<Navigate to="/investing/islamic-equity" replace />} />
                <Route path="/become-an-agent" element={<Navigate to="/careers" replace />} />

                {/* French Indexable Routes */}
                <Route path="/fr" element={<HomePage />} />
                <Route path="/fr/how-i-help" element={<HowIHelpPage />} />
                <Route path="/fr/education" element={<EducationLibraryPage />} />
                <Route path="/fr/education/:slug" element={<ArticlePage />} />
                <Route path="/fr/insights/:slug" element={<ArticlePage />} />
                <Route path="/fr/insights" element={<InsightsPage />} />
                <Route path="/fr/what-changed" element={<WhatChangedPage />} />
                <Route path="/fr/about" element={<AboutPage />} />
                <Route path="/fr/careers" element={<CareersPage />} />
                <Route path="/fr/for/:audience" element={<AudienceHubPage />} />
                <Route path="/fr/investing/islamic-equity" element={<IslamicInvestingPage />} />
                <Route path="/fr/calculators" element={<CalculatorsPage />} />
                <Route path="/fr/contact" element={<ContactPage />} />
                <Route path="/fr/confirm-subscription" element={<ConfirmSubscriptionPage />} />

                {/* French Aliases -> Canonical 301/Replace Redirects */}
                <Route path="/fr/news" element={<Navigate to="/fr/what-changed" replace />} />
                <Route path="/fr/financial-news" element={<Navigate to="/fr/what-changed" replace />} />
                <Route path="/fr/simulateurs" element={<Navigate to="/fr/calculators" replace />} />
                <Route path="/fr/financial-calculators" element={<Navigate to="/fr/calculators" replace />} />
                <Route path="/fr/health-workers" element={<Navigate to="/fr/for/healthcare" replace />} />
                <Route path="/fr/doctors-nurses" element={<Navigate to="/fr/for/healthcare" replace />} />
                <Route path="/fr/for/health-workers" element={<Navigate to="/fr/for/healthcare" replace />} />
                <Route path="/fr/for/doctors-nurses" element={<Navigate to="/fr/for/healthcare" replace />} />
                <Route path="/fr/for/entrepreneurs" element={<Navigate to="/fr/for/business-owners" replace />} />
                <Route path="/fr/for/incorporated" element={<Navigate to="/fr/for/business-owners" replace />} />
                <Route path="/fr/for/immigrants" element={<Navigate to="/fr/for/newcomers" replace />} />
                <Route path="/fr/for/new-to-canada" element={<Navigate to="/fr/for/newcomers" replace />} />
                <Route path="/fr/for/parents" element={<Navigate to="/fr/for/families" replace />} />
                <Route path="/fr/for/muslim-investors" element={<Navigate to="/fr/investing/islamic-equity" replace />} />
                <Route path="/fr/become-an-agent" element={<Navigate to="/fr/careers" replace />} />

                {/* Legal and standards routes (EN & FR) */}
                <Route
                  path="/disclosures"
                  element={
                    <LegalPage
                      pageType="disclosures"
                      data={disclosuresData}
                      eyebrow="Disclosures & Regulatory Transparency"
                    />
                  }
                />
                <Route
                  path="/fr/disclosures"
                  element={
                    <LegalPage
                      pageType="disclosures"
                      data={disclosuresData}
                      eyebrow="Divulgations & Transparence Réglementaire"
                    />
                  }
                />
                <Route
                  path="/privacy"
                  element={
                    <LegalPage
                      pageType="privacy"
                      data={privacyData}
                      eyebrow="Privacy Notice"
                    />
                  }
                />
                <Route
                  path="/fr/privacy"
                  element={
                    <LegalPage
                      pageType="privacy"
                      data={privacyData}
                      eyebrow="Avis de Confidentialité"
                    />
                  }
                />
                <Route
                  path="/standards"
                  element={
                    <LegalPage
                      pageType="standards"
                      data={standardsData}
                      eyebrow="Editorial Standards"
                    />
                  }
                />
                <Route
                  path="/fr/standards"
                  element={
                    <LegalPage
                      pageType="standards"
                      data={standardsData}
                      eyebrow="Normes Éditoriales"
                    />
                  }
                />
                <Route
                  path="/terms"
                  element={
                    <LegalPage
                      pageType="terms"
                      data={termsData}
                      eyebrow="Terms of Use"
                    />
                  }
                />
                <Route
                  path="/fr/terms"
                  element={
                    <LegalPage
                      pageType="terms"
                      data={termsData}
                      eyebrow="Conditions d'Utilisation"
                    />
                  }
                />

                {/* Catch-all 404 */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
          </main>
          <Footer />
          <MobileBookingBar />
        </div>
        <Analytics />
      </BrowserRouter>
    </LanguageProvider>
  );
}
