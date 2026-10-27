import React from "react";
import { Link } from "react-router-dom";

export const NotFoundPage: React.FC = () => {
  return (
    <div className="section py-24 text-center">
      <div className="wrap max-w-xl space-y-6">
        <span className="eyebrow text-xs">404 — Page Not Found</span>
        <h1 className="display text-[#1c1b18]">Page not found</h1>
        <p className="lede text-base md:text-lg text-[#46423a]">
          The page or article you were looking for doesn’t exist or has moved.
        </p>
        <div className="pt-4 flex flex-wrap justify-center gap-4">
          <Link to="/" className="btn btn-primary text-sm px-6 py-2.5">
            Return to Home
          </Link>
          <Link to="/education" className="btn btn-ghost text-sm px-6 py-2.5">
            Browse Financial Library
          </Link>
        </div>
      </div>
    </div>
  );
};
