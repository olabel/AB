import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Header } from "./components/Header.tsx";
import { Footer } from "./components/Footer.tsx";
import { DraftBanner } from "./components/Tbc.tsx";

import { HomePage } from "./pages/HomePage.tsx";
import { HowIHelpPage } from "./pages/HowIHelpPage.tsx";
import { EducationLibraryPage } from "./pages/EducationLibraryPage.tsx";
import { ArticlePage } from "./pages/ArticlePage.tsx";
import { InsightsPage } from "./pages/InsightsPage.tsx";
import { AboutPage } from "./pages/AboutPage.tsx";
import { ContactPage } from "./pages/ContactPage.tsx";
import { LegalPage } from "./pages/LegalPage.tsx";
import { NotFoundPage } from "./pages/NotFoundPage.tsx";

import { disclosuresData, privacyData, standardsData, termsData } from "./content/legal.ts";

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-[#f7f3eb] text-[#1c1b18] antialiased selection:bg-[#2e4a3b] selection:text-[#f7f3eb]">
        <Header />
        <DraftBanner />
        <main id="main-content" className="flex-1 focus:outline-none" tabIndex={-1}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/how-i-help" element={<HowIHelpPage />} />
            <Route path="/education" element={<EducationLibraryPage />} />
            <Route path="/education/:slug" element={<ArticlePage />} />
            <Route path="/insights/:slug" element={<ArticlePage />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Legal and standards routes */}
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
              path="/terms"
              element={
                <LegalPage
                  pageType="terms"
                  data={termsData}
                  eyebrow="Website Terms"
                />
              }
            />

            {/* Catch-all 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
