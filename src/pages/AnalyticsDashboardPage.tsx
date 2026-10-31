import React, { useState, useEffect } from "react";
import { analytics, AnalyticsSummary } from "../services/analytics.ts";
import { SEO } from "../components/SEO.tsx";
import { useLanguage } from "../context/LanguageContext.tsx";
import {
  BarChart3,
  Users,
  Eye,
  Calendar,
  MessageCircle,
  Mail,
  Calculator,
  ShieldCheck,
  RefreshCw,
  Download,
  Smartphone,
  Globe,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

export const AnalyticsDashboardPage: React.FC = () => {
  const { isFr } = useLanguage();
  const [summary, setSummary] = useState<AnalyticsSummary>(analytics.getLocalSummary());
  const [serverSummary, setServerSummary] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const refreshData = async () => {
    setLoading(true);
    setSummary(analytics.getLocalSummary());
    try {
      const res = await fetch("/api/analytics/summary");
      if (res.ok) {
        const data = await res.json();
        setServerSummary(data);
      }
    } catch {
      // Local summary remains active
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const totalActions =
    summary.conversions.contactSubmissions +
    summary.conversions.calendlyClicks +
    summary.conversions.whatsappClicks +
    summary.conversions.calculatorUses;

  const conversionRate =
    summary.uniqueSessions > 0
      ? (((summary.conversions.contactSubmissions + summary.conversions.calendlyClicks + summary.conversions.whatsappClicks) / summary.uniqueSessions) * 100).toFixed(1)
      : "0.0";

  const exportData = () => {
    const jsonStr = JSON.stringify({ local: summary, server: serverSummary, exportedAt: new Date().toISOString() }, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ahmedbello-analytics-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="py-10 md:py-16 bg-[#f7f3eb]">
      <SEO
        title={isFr ? "Tableau de Bord Analytique | Ahmed Bello" : "Advisor Analytics & Insights Dashboard | Ahmed Bello"}
        description="Privacy-compliant website analytics, audience insights, engagement tracking, and conversation conversion metrics."
        canonicalUrl="/analytics"
      />

      <div className="wrap max-w-5xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#d6cebd]">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#75581f] mb-1">
              <BarChart3 className="w-3.5 h-3.5 text-[#2e4a3b]" />
              <span>{isFr ? "Rapports & Statistiques Internes" : "Advisor Performance Analytics"}</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl text-[#1c1b18]">
              {isFr ? "Analytique du Site & Engagement des Visiteurs" : "Website Engagement & Conversion Insights"}
            </h1>
            <p className="text-xs sm:text-sm text-[#46423a] mt-1">
              {isFr
                ? "Mesure d'audience respectueuse de la vie privée (sans témoins publicitaires ni données nominatives)."
                : "Privacy-first metrics measuring educational guide readership, calculator usage, and consultation demand."}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={refreshData}
              disabled={loading}
              className="btn btn-secondary text-xs py-2 px-3 inline-flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#2e4a3b] ${loading ? "animate-spin" : ""}`} />
              <span>{isFr ? "Actualiser" : "Refresh"}</span>
            </button>
            <button
              onClick={exportData}
              className="btn btn-primary text-xs py-2 px-3 inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isFr ? "Exporter JSON" : "Export Data"}</span>
            </button>
          </div>
        </div>

        {/* 1. Key Performance KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-[#fcfaf5] border border-[#d6cebd] rounded-xs space-y-1">
            <div className="flex items-center justify-between text-xs text-[#625d52]">
              <span>{isFr ? "Pages Vues" : "Page Views"}</span>
              <Eye className="w-4 h-4 text-[#2e4a3b]" />
            </div>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-[#1c1b18]">
              {serverSummary?.totalViews ? Math.max(serverSummary.totalViews, summary.totalPageviews) : summary.totalPageviews}
            </div>
            <p className="text-[0.7rem] text-[#75581f]">{isFr ? "Lectures d'articles & guides" : "Guides & articles accessed"}</p>
          </div>

          <div className="p-4 bg-[#fcfaf5] border border-[#d6cebd] rounded-xs space-y-1">
            <div className="flex items-center justify-between text-xs text-[#625d52]">
              <span>{isFr ? "Sessions Visiteurs" : "Visitor Sessions"}</span>
              <Users className="w-4 h-4 text-[#75581f]" />
            </div>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-[#1c1b18]">
              {serverSummary?.uniqueSessions ? Math.max(serverSummary.uniqueSessions, summary.uniqueSessions) : summary.uniqueSessions}
            </div>
            <p className="text-[0.7rem] text-[#625d52]">{isFr ? "Identifiants anonymisés" : "Privacy-anonymized sessions"}</p>
          </div>

          <div className="p-4 bg-[#fcfaf5] border border-[#d6cebd] rounded-xs space-y-1">
            <div className="flex items-center justify-between text-xs text-[#625d52]">
              <span>{isFr ? "Interactions Clés" : "High-Intent Actions"}</span>
              <MessageCircle className="w-4 h-4 text-[#2e4a3b]" />
            </div>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-[#2e4a3b]">
              {totalActions}
            </div>
            <p className="text-[0.7rem] text-[#625d52]">{isFr ? "Formulaires, Calendly, WhatsApp" : "Form, booking & WhatsApp intent"}</p>
          </div>

          <div className="p-4 bg-[#fcfaf5] border border-[#d6cebd] rounded-xs space-y-1">
            <div className="flex items-center justify-between text-xs text-[#625d52]">
              <span>{isFr ? "Taux de Conversion" : "Consultation Rate"}</span>
              <Clock className="w-4 h-4 text-[#75581f]" />
            </div>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-[#75581f]">
              {conversionRate}%
            </div>
            <p className="text-[0.7rem] text-[#625d52]">{isFr ? "Sessions déclenchant un contact" : "Sessions starting conversations"}</p>
          </div>
        </div>

        {/* 2. Conversion Funnel Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="p-5 sm:p-6 bg-[#fcfaf5] border border-[#d6cebd] rounded-xs space-y-4">
            <h2 className="font-serif text-lg font-bold text-[#1c1b18] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#2e4a3b]" />
              <span>{isFr ? "Canaux de Conversion Directe" : "Client Engagement Channels"}</span>
            </h2>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex items-center justify-between p-3 bg-white border border-[#d6cebd] rounded-xs">
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#2e4a3b]" />
                  <span className="font-medium text-[#1c1b18]">{isFr ? "Questions envoyées via le formulaire" : "Educational Form Enquiries"}</span>
                </div>
                <span className="font-mono font-bold text-[#2e4a3b]">{summary.conversions.contactSubmissions}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-white border border-[#d6cebd] rounded-xs">
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-[#75581f]" />
                  <span className="font-medium text-[#1c1b18]">{isFr ? "Clics de réservation Calendly (20 min)" : "Calendly 20-Min Bookings"}</span>
                </div>
                <span className="font-mono font-bold text-[#75581f]">{summary.conversions.calendlyClicks}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-white border border-[#d6cebd] rounded-xs">
                <div className="flex items-center gap-2.5">
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span className="font-medium text-[#1c1b18]">{isFr ? "Conversations WhatsApp initiées" : "WhatsApp Chat Initiations"}</span>
                </div>
                <span className="font-mono font-bold text-[#25D366]">{summary.conversions.whatsappClicks}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-white border border-[#d6cebd] rounded-xs">
                <div className="flex items-center gap-2.5">
                  <Calculator className="w-4 h-4 text-[#46423a]" />
                  <span className="font-medium text-[#1c1b18]">{isFr ? "Simulations de calculatrices financières" : "Interactive Calculator Simulations"}</span>
                </div>
                <span className="font-mono font-bold text-[#46423a]">{summary.conversions.calculatorUses}</span>
              </div>
            </div>
          </div>

          {/* 3. Top Read Content Pages */}
          <div className="p-5 sm:p-6 bg-[#fcfaf5] border border-[#d6cebd] rounded-xs space-y-4">
            <h2 className="font-serif text-lg font-bold text-[#1c1b18] flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#75581f]" />
              <span>{isFr ? "Pages & Guides les Plus Consultés" : "Top Read Educational Content"}</span>
            </h2>

            <div className="space-y-2 text-xs">
              {summary.topPages.length > 0 ? (
                summary.topPages.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 bg-white border border-[#d6cebd] rounded-xs">
                    <span className="font-mono text-[#46423a] truncate max-w-[260px]">{item.path}</span>
                    <span className="font-semibold text-[#1c1b18]">{item.count} views</span>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-[#625d52]">
                  {isFr ? "En attente des premières sessions de navigation." : "Awaiting initial visitor navigation events."}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 4. Audience Demographics & Privacy Notice */}
        <div className="p-5 bg-white border border-[#d6cebd] rounded-xs space-y-3 text-xs">
          <div className="flex items-center gap-2 text-[#2e4a3b] font-semibold">
            <ShieldCheck className="w-4 h-4 text-[#2e4a3b]" />
            <span>Canadian Privacy & PIPEDA Standards Compliance</span>
          </div>
          <p className="text-[#46423a] leading-relaxed">
            This analytics framework complies with Canada's Personal Information Protection and Electronic Documents Act (PIPEDA) and CASL. No cookies are shared with third-party ad networks, no IP addresses are retained on our servers, and all session markers expire automatically.
          </p>
          <div className="pt-2 flex flex-wrap gap-4 text-[#625d52]">
            <span className="inline-flex items-center gap-1">
              <Smartphone className="w-3.5 h-3.5" /> Mobile vs Desktop: {summary.deviceBreakdown.mobile} / {summary.deviceBreakdown.desktop}
            </span>
            <span className="inline-flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" /> English vs French: {summary.languageBreakdown.en} / {summary.languageBreakdown.fr}
            </span>
          </div>
        </div>

        {/* Navigation Return */}
        <div className="mt-8 pt-4 border-t border-[#d6cebd] flex justify-between items-center text-xs">
          <Link to="/" className="text-[#2e4a3b] font-semibold hover:underline">
            &larr; {isFr ? "Retour à l'accueil" : "Return to Homepage"}
          </Link>
          <Link to="/education" className="text-[#46423a] hover:text-[#1c1b18] inline-flex items-center gap-1">
            <span>{isFr ? "Bibliothèque financière" : "Education Library"}</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};
