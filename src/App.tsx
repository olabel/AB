import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { LanguageProvider, useLanguage } from "./context/LanguageContext.tsx";
import { Header } from "./components/Header.tsx";
import { Footer } from "./components/Footer.tsx";
import { DraftBanner } from "./components/Tbc.tsx";
import { FloatingNewsWidget } from "./components/FloatingNewsWidget.tsx";
import { HomePage } from "./pages/HomePage.tsx";
import { HowIHelpPage } from "./pages/HowIHelpPage.tsx";
import { EducationLibraryPage } from "./pages/EducationLibraryPage.tsx";
import { ArticlePage } from "./pages/ArticlePage.tsx";
import { InsightsPage } from "./pages/InsightsPage.tsx";
import { NewsPage } from "./pages/NewsPage.tsx";
import { AboutPage } from "./pages/AboutPage.tsx";
import { ContactPage } from "./pages/ContactPage.tsx";
import { CareersPage } from "./pages/CareersPage.tsx";
import { AudienceHubPage } from "./pages/AudienceHubPage.tsx";
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
          <main id="main-content" className="flex-1 focus:outline-none" tabIndex={-1}>
            <Routes>
              {/* English Canonical Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/how-i-help" element={<HowIHelpPage />} />
              <Route path="/education" element={<EducationLibraryPage />} />
              <Route path="/education/:slug" element={<ArticlePage />} />
              <Route path="/insights/:slug" element={<ArticlePage />} />
              <Route path="/insights" element={<InsightsPage />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/financial-news" element={<NewsPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/careers" element={<CareersPage />} />
              <Route path="/become-an-agent" element={<CareersPage />} />
              <Route path="/for/:audience" element={<AudienceHubPage />} />
              <Route path="/contact" element={<ContactPage />} />

              {/* French Indexable Routes */}
              <Route path="/fr" element={<HomePage />} />
              <Route path="/fr/how-i-help" element={<HowIHelpPage />} />
              <Route path="/fr/education" element={<EducationLibraryPage />} />
              <Route path="/fr/education/:slug" element={<ArticlePage />} />
              <Route path="/fr/insights/:slug" element={<ArticlePage />} />
              <Route path="/fr/insights" element={<InsightsPage />} />
              <Route path="/fr/news" element={<NewsPage />} />
              <Route path="/fr/financial-news" element={<NewsPage />} />
              <Route path="/fr/about" element={<AboutPage />} />
              <Route path="/fr/careers" element={<CareersPage />} />
              <Route path="/fr/become-an-agent" element={<CareersPage />} />
              <Route path="/fr/for/:audience" element={<AudienceHubPage />} />
              <Route path="/fr/contact" element={<ContactPage />} />

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
                    eyebrow="Website Terms"
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
          <SpeedInsights />
        </div>
      </BrowserRouter>
    </LanguageProvider>
  );
}
