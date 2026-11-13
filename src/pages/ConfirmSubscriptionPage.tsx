import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { SEO } from "../components/SEO.tsx";
import { useLanguage } from "../context/LanguageContext.tsx";
import { CheckCircle2, ShieldCheck, Mail, ArrowRight, BookOpen, Layers } from "lucide-react";
import { trackSubscriptionConfirmed } from "../lib/track.ts";

export const ConfirmSubscriptionPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const tokenParam = searchParams.get("token") || "";
  const emailParam = searchParams.get("email") || "";
  const { isFr } = useLanguage();
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verifiedEmail, setVerifiedEmail] = useState<string>("");

  useEffect(() => {
    let isMounted = true;

    async function confirmSubscription() {
      // Prefer cryptographically signed token
      if (tokenParam) {
        try {
          const res = await fetch(`/api/confirm-subscription?token=${encodeURIComponent(tokenParam)}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: tokenParam }),
          });
          const data = await res.json().catch(() => ({}));
          if (res.ok && data.success) {
            if (isMounted) {
              setVerifiedEmail(data.email || "");
              setConfirmed(true);
              setLoading(false);
              trackSubscriptionConfirmed();
              localStorage.setItem("ahmed_bello_subscriber_confirmed", data.email || "confirmed");
              localStorage.setItem("ahmed_bello_subscriber_date", new Date().toISOString());
            }
            return;
          } else {
            if (isMounted) {
              setError(data.message || (isFr ? "Le lien de confirmation est invalide ou a expiré." : "This confirmation link is invalid or has expired."));
              setLoading(false);
            }
            return;
          }
        } catch {
          if (isMounted) {
            setError(isFr ? "Erreur réseau lors de la validation." : "Network connection error while confirming.");
            setLoading(false);
          }
          return;
        }
      }

      // Fallback for legacy requests or manual testing
      if (emailParam) {
        setVerifiedEmail(emailParam);
        setConfirmed(true);
        setLoading(false);
        return;
      }

      if (isMounted) {
        setError(isFr ? "Aucun jeton de confirmation fourni." : "No confirmation token provided.");
        setLoading(false);
      }
    }

    confirmSubscription();

    return () => {
      isMounted = false;
    };
  }, [tokenParam, emailParam, isFr]);

  return (
    <div className="py-16 md:py-24">
      <SEO
        title={isFr ? "Abonnement Confirmé | Ahmed Bello" : "Subscription Confirmed | Ahmed Bello"}
        description={
          isFr
            ? "Votre confirmation d'abonnement aux résumés éducatifs canadiens est enregistrée."
            : "Your subscription confirmation to Canadian financial education briefings has been verified."
        }
        noIndex={true}
      />

      <div className="wrap max-w-2xl text-center space-y-6">
        {loading ? (
          <div className="py-12 space-y-3">
            <div className="w-10 h-10 border-2 border-[#2e4a3b] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-[#46423a]">{isFr ? "Vérification cryptographique de votre abonnement..." : "Cryptographically verifying your subscription..."}</p>
          </div>
        ) : error ? (
          <div className="p-8 bg-[#fcfaf5] border-2 border-[#8a3324] rounded-[2px] space-y-4">
            <h2 className="font-serif text-2xl text-[#8a3324]">
              {isFr ? "Lien invalide ou expiré" : "Invalid or Expired Link"}
            </h2>
            <p className="text-sm text-[#46423a] leading-relaxed">{error}</p>
            <div className="pt-2">
              <Link to={isFr ? "/fr" : "/"} className="btn btn-primary text-xs py-2.5 px-6">
                {isFr ? "Retourner à l'accueil pour s'inscrire" : "Return to Home & Re-subscribe"}
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="w-16 h-16 rounded-[2px] bg-[#2e4a3b] text-[#f7f3eb] flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8 text-[#d6c298]" />
            </div>

            <div className="space-y-2">
              <span className="eyebrow text-xs uppercase tracking-wider text-[#75581f]">
                {isFr ? "Consentement CASL Confirmé" : "CASL Double Opt-in Confirmed"}
              </span>
              <h1
                className="font-serif text-3xl sm:text-4xl text-[#1c1b18] tracking-tight"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {isFr ? "Votre abonnement est confirmé" : "Your subscription is confirmed"}
              </h1>
              {verifiedEmail && (
                <p className="text-sm font-mono text-[#2e4a3b] bg-[#2e4a3b]/10 py-1 px-3 rounded-[2px] inline-block">
                  {verifiedEmail}
                </p>
              )}
            </div>
          </>
        )}

        <div className="p-6 sm:p-8 bg-[#fcfaf5] border border-[#d6cebd] rounded-[2px] text-left space-y-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#2e4a3b] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-serif text-base text-[#1c1b18] font-semibold">
                {isFr ? "Ce que vous recevrez" : "What to expect"}
              </h3>
              <p className="text-xs sm:text-sm text-[#46423a] leading-relaxed">
                {isFr
                  ? "Vous recevrez des analyses éducatives ponctuelles exclusivement lors de modifications importantes des règles fiscales canadiennes de l'ARC, des plafonds des régimes enregistrés (CELI, REER, CELIAPP) ou des politiques de retraite publique."
                  : "You will receive occasional plain-language briefings strictly when significant Canadian statutory tax changes, CRA registered limit announcements (such as annual TFSA / RRSP / FHSA thresholds), or public pension updates occur."}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 pt-3 border-t border-[#ece6da]">
            <Mail className="w-5 h-5 text-[#75581f] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-serif text-base text-[#1c1b18] font-semibold">
                {isFr ? "Notre engagement déontologique" : "No commercial spam"}
              </h3>
              <p className="text-xs sm:text-sm text-[#46423a] leading-relaxed">
                {isFr
                  ? "Aucune séquence automatisée de vente, aucun produit propriétaire imposé, et vous pouvez vous désabonner à tout moment d'un simple clic."
                  : "Zero automated daily sales funnels, zero third-party commercial marketing, and you can unsubscribe at any time with a single click."}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4 flex flex-wrap justify-center gap-4">
          <Link to={isFr ? "/fr/education" : "/education"} className="btn btn-primary text-xs sm:text-sm py-2.5 px-6 inline-flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" />
            <span>{isFr ? "Explorer la bibliothèque éducative" : "Explore Education Library"}</span>
          </Link>
          <Link to={isFr ? "/fr/insights" : "/insights"} className="btn btn-ghost text-xs sm:text-sm py-2.5 px-6 inline-flex items-center gap-1.5">
            <Layers className="w-4 h-4" />
            <span>{isFr ? "Lire les analyses stratégiques" : "Read Strategic Insights"}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
