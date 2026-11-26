import React, { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { LanguageProvider, useLanguage } from "./context/LanguageContext.tsx";
import { Header } from "./components/Header.tsx";
import { Footer } from "./components/Footer.tsx";
import { DraftBanner } from "./components/Tbc.tsx";
import { FloatingNewsWidget } from "./components/FloatingNewsWidget.tsx";
import { MobileBookingBar } from "./components/MobileBookingBar.tsx";
import {
  disclosuresData,
  privacyData,
  standardsData,
  termsData,
  disclosuresDataFr,
  privacyDataFr,
  standardsDataFr,
  termsDataFr,
} from "./content/legal.ts";

// Keep HomePage and NotFoundPage eager for instant first paint; lazy-split all secondary & tool routes
import { HomePage } from "./pages/HomePage.tsx";
import { NotFoundPage } from "./pages/NotFoundPage.tsx";

const HowIHelpPage = lazy(() => import("./pages/HowIHelpPage.tsx").then((m) => ({ default: m.HowIHelpPage })));
const EducationLibraryPage = lazy(() =>
  import("./pages/EducationLibraryPage.tsx").then((m) => ({ default: m.EducationLibraryPage }))
);
const ArticlePage = lazy(() => import("./pages/ArticlePage.tsx").then((m) => ({ default: m.ArticlePage })));
const InsightsPage = lazy(() => import("./pages/InsightsPage.tsx").then((m) => ({ default: m.InsightsPage })));
const WhatChangedPage = lazy(() => import("./pages/WhatChangedPage.tsx").then((m) => ({ default: m.WhatChangedPage })));
const AboutPage = lazy(() => import("./pages/AboutPage.tsx").then((m) => ({ default: m.AboutPage })));
const CareersPage = lazy(() => import("./pages/CareersPage.tsx").then((m) => ({ default: m.CareersPage })));
const AudienceHubPage = lazy(() => import("./pages/AudienceHubPage.tsx").then((m) => ({ default: m.AudienceHubPage })));
const IslamicInvestingPage = lazy(() =>
  import("./pages/IslamicInvestingPage.tsx").then((m) => ({ default: m.IslamicInvestingPage }))
);
const AtlanticCanadaPage = lazy(() =>
  import("./pages/AtlanticCanadaPage.tsx").then((m) => ({ default: m.AtlanticCanadaPage }))
);
const ContactPage = lazy(() => import("./pages/ContactPage.tsx").then((m) => ({ default: m.ContactPage })));
const ConfirmSubscriptionPage = lazy(() =>
  import("./pages/ConfirmSubscriptionPage.tsx").then((m) => ({ default: m.ConfirmSubscriptionPage }))
);
const LegalPage = lazy(() => import("./pages/LegalPage.tsx").then((m) => ({ default: m.LegalPage })));
const CalculatorsPage = lazy(() => import("./pages/CalculatorsPage.tsx").then((m) => ({ default: m.CalculatorsPage })));
const AmtCalculatorPage = lazy(() =>
  import("./pages/AmtCalculatorPage.tsx").then((m) => ({ default: m.AmtCalculatorPage }))
);
const CostlyBlindspotsPage = lazy(() =>
  import("./pages/CostlyBlindspotsPage.tsx").then((m) => ({ default: m.CostlyBlindspotsPage }))
);
const DocumentSigningPage = lazy(() =>
  import("./pages/DocumentSigningPage.tsx").then((m) => ({ default: m.DocumentSigningPage }))
);

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

class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.warn("[UI Recovery]:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#f7f3eb] text-[#1c1b18] p-6 text-center">
          <div className="max-w-md space-y-4 bg-[#fcfaf5] border border-[#d6cebd] p-8 rounded-[2px]">
            <h1 className="font-serif text-2xl text-[#1c1b18]">Something interrupted this view</h1>
            <p className="text-sm text-[#46423a]">
              Please reload the page to continue, or return to the homepage.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="btn btn-primary text-xs px-4 py-2"
              >
                Reload page
              </button>
              <a href="/" className="btn btn-ghost text-xs px-4 py-2">
                Home
              </a>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function AppShell() {
  const location = useLocation();
  const isSigningWorkspace =
    location.pathname === "/sign" ||
    location.pathname === "/fr/sign" ||
    location.pathname === "/client-signature" ||
    location.pathname === "/fr/client-signature";

  const routesTree = (
    <Routes>
      {/* Client Hand-Signature & Document Assembly Workspace (EN & FR) */}
      <Route path="/sign" element={<DocumentSigningPage />} />
      <Route path="/fr/sign" element={<DocumentSigningPage />} />
      <Route path="/client-signature" element={<DocumentSigningPage />} />
      <Route path="/fr/client-signature" element={<DocumentSigningPage />} />

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
      <Route path="/atlantic-canada" element={<AtlanticCanadaPage />} />
      <Route path="/calculators" element={<CalculatorsPage />} />
      <Route path="/calculators/amt" element={<AmtCalculatorPage />} />
      <Route path="/costly-blindspots" element={<CostlyBlindspotsPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/confirm-subscription" element={<ConfirmSubscriptionPage />} />

      {/* French Canonical Routes */}
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
      <Route path="/fr/atlantic-canada" element={<AtlanticCanadaPage />} />
      <Route path="/fr/calculators" element={<CalculatorsPage />} />
      <Route path="/fr/calculators/amt" element={<AmtCalculatorPage />} />
      <Route path="/fr/costly-blindspots" element={<CostlyBlindspotsPage />} />
      <Route path="/fr/contact" element={<ContactPage />} />
      <Route path="/fr/confirm-subscription" element={<ConfirmSubscriptionPage />} />

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
            data={disclosuresDataFr}
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
            data={privacyDataFr}
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
            data={standardsDataFr}
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
            data={termsDataFr}
            eyebrow="Conditions d'Utilisation"
          />
        }
      />

      {/* Catch-all 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );

  const routeFallback = (
    <div
      className="min-h-[60vh] bg-[#f7f3eb] flex items-center justify-center px-6"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="w-6 h-6 border-2 border-[#d6cebd] border-t-[#2e4a3b] rounded-full animate-spin" />
    </div>
  );

  if (isSigningWorkspace) {
    return <Suspense fallback={routeFallback}>{routesTree}</Suspense>;
  }

  return (
    <>
      <div className="min-h-screen flex flex-col bg-[#f7f3eb] text-[#1c1b18] antialiased selection:bg-[#2e4a3b] selection:text-[#f7f3eb]">
        <Header />
        <DraftBanner />
        <FloatingNewsWidget />
        <main id="main-content" className="flex-1 focus:outline-none pb-16 sm:pb-0" tabIndex={-1}>
          <Suspense fallback={routeFallback}>{routesTree}</Suspense>
        </main>
        <Footer />
        <MobileBookingBar />
      </div>
    </>
  );
}

export default function App() {
  return (
    <AppErrorBoundary>
      <LanguageProvider>
        <BrowserRouter>
          <ScrollToTop />
          <LanguageRouteSync />
          <AppShell />
        </BrowserRouter>
      </LanguageProvider>
    </AppErrorBoundary>
  );
}
