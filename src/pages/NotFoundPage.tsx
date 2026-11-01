import React from "react";
import { Link } from "react-router-dom";
import { SEO } from "../components/SEO.tsx";
import { useLanguage } from "../context/LanguageContext.tsx";

export const NotFoundPage: React.FC = () => {
  const { isFr } = useLanguage();

  return (
    <div className="section py-24 text-center">
      <SEO
        title={isFr ? "Page non trouvée (404) | Ahmed Bello" : "Page Not Found (404) | Ahmed Bello"}
        description={isFr ? "La page demandée est introuvable." : "The page or article you were looking for doesn’t exist or has moved."}
        noIndex={true}
      />
      <div className="wrap max-w-xl space-y-6">
        <span className="eyebrow text-xs">404: {isFr ? "Page non trouvée" : "Page Not Found"}</span>
        <h1 className="display text-[#1c1b18]">{isFr ? "Page non trouvée" : "Page not found"}</h1>
        <p className="lede text-base md:text-lg text-[#46423a]">
          {isFr
            ? "La page ou l'article que vous recherchez n'existe pas ou a été déplacé."
            : "The page or article you were looking for doesn’t exist or has moved."}
        </p>
        <div className="pt-4 flex flex-wrap justify-center gap-4">
          <Link to={isFr ? "/fr" : "/"} className="btn btn-primary text-sm px-6 py-2.5">
            {isFr ? "Retour à l'accueil" : "Return to Home"}
          </Link>
          <Link to={isFr ? "/fr/education" : "/education"} className="btn btn-ghost text-sm px-6 py-2.5">
            {isFr ? "Parcourir la bibliothèque" : "Browse Financial Library"}
          </Link>
        </div>
      </div>
    </div>
  );
};

