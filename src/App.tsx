import React, { useEffect, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { LanguageProvider, useLanguage } from "./context/LanguageContext.tsx";
import { Header } from "./components/Header.tsx";
import { Footer } from "./components/Footer.tsx";
import { DraftBanner } from "./components/Tbc.tsx";
import { FloatingNewsWidget } from "./components/FloatingNewsWidget.tsx";
import { MobileBookingBar } from "./components/MobileBookingBar.tsx";
import { disclosuresData, privacyData, standardsData, termsData } from "./content/legal.ts";

// Route-level code splitting to keep initial bundle size tiny
const HomePage = React.lazy(() => import("./pages/HomePage.tsx").then((m) => ({ default: m.HomePage })));
const HowIHelpPage = React.lazy(() => import("./pages/HowIHelpPage.tsx").then((m) => ({ default: m.HowIHelpPage })));
const EducationLibraryPage = React.lazy(() => import("./pages/EducationLibraryPage.tsx").then((m) => ({ default: m.EducationLibraryPage })));
const ArticlePage = React.lazy(() => import("./pages/ArticlePage.tsx").then((m) => ({ default: m.ArticlePage })));
const InsightsPage = React.lazy(() => import("./pages/InsightsPage.tsx").then((m) => ({ default: m.InsightsPage })));
const NewsPage = React.lazy(() => import("./pages/NewsPage.tsx").then((m) => ({ default: m.NewsPage })));
const AboutPage = React.lazy(() => import("./pages/AboutPage.tsx").then((m) => ({ default: m.AboutPage })));
const CareersPage = React.lazy(() => import("./pages/CareersPage.tsx").then((m) => ({ default: m.CareersPage })));
const AudienceHubPage = React.lazy(() => import("./pages/AudienceHubPage.tsx").then((m) => ({ default: m.AudienceHubPage })));
const IslamicInvestingPage = React.lazy(() => import("./pages/IslamicInvestingPage.tsx").then((m) => ({ default: m.IslamicInvestingPage })));
const ContactPage = React.lazy(() => import("./pages/ContactPage.tsx").then((m) => ({ default: m.ContactPage })));
const LegalPage = React.lazy(() => import("./pages/LegalPage.tsx").then((m) => ({ default: m.LegalPage })));
const NotFoundPage = React.lazy(() => import("./pages/NotFoundPage.tsx").then((m) => ({ default: m.NotFoundPage })));

function PageFallback() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center py-24" aria-busy="true" aria-label="Loading page">
      <div className="w-8 h-8 border-2 border-[#2e4a3b] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

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
            <Suspense fallback={<PageFallback />}>
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
              <Route path="/investing/islamic-equity" element={<IslamicInvestingPage />} />
              <Route path="/for/muslim-investors" element={<IslamicInvestingPage />} />
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
              <Route path="/fr/investing/islamic-equity" element={<IslamicInvestingPage />} />
              <Route path="/fr/for/muslim-investors" element={<IslamicInvestingPage />} />
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
          </Suspense>
        </main>
        <Footer />
        <MobileBookingBar />
      </div>
    </BrowserRouter>
  </LanguageProvider>
);
}
