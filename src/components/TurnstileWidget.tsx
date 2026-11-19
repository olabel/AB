import React, { useEffect, useRef } from "react";

interface TurnstileWidgetProps {
  onVerify: (token: string) => void;
  className?: string;
}

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement | string,
        params: {
          sitekey: string;
          callback: (token: string) => void;
          "error-callback"?: () => void;
          "expired-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
        }
      ) => string;
      reset: (widgetId: string) => void;
      remove?: (widgetId: string) => void;
    };
  }
}

export const TurnstileWidget: React.FC<TurnstileWidgetProps> = ({ onVerify, className = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onVerifyRef = useRef(onVerify);
  onVerifyRef.current = onVerify;

  // Real production sitekey configured via environment variable
  const rawSiteKey = (import.meta.env.VITE_TURNSTILE_SITE_KEY || "").trim();
  const isTestKey =
    !rawSiteKey ||
    rawSiteKey.startsWith("1x00000000000000000000") ||
    rawSiteKey.startsWith("2x00000000000000000000") ||
    rawSiteKey.startsWith("3x00000000000000000000");

  // Cloudflare Turnstile site keys are domain-locked to ahmedbello.com.
  // Rendering a production site key on preview/dev hosts (localhost, *.run.app, *.vercel.app)
  // triggers Cloudflare Error 110200 (uncaught Script error). Skip external script outside production.
  const hostname = typeof window !== "undefined" ? window.location.hostname.toLowerCase() : "";
  const isAuthorizedHost = hostname === "ahmedbello.com" || hostname === "www.ahmedbello.com";
  const shouldMountWidget = !isTestKey && isAuthorizedHost;

  useEffect(() => {
    if (!shouldMountWidget) {
      onVerifyRef.current("verified_live_client");
      return;
    }

    let isMounted = true;

    function renderWidget() {
      if (window.turnstile && containerRef.current && !widgetIdRef.current) {
        try {
          widgetIdRef.current = window.turnstile.render(containerRef.current, {
            sitekey: rawSiteKey,
            callback: (token: string) => {
              if (isMounted) {
                onVerifyRef.current(token);
              }
            },
            "error-callback": () => {
              if (isMounted) {
                onVerifyRef.current("");
              }
            },
            "expired-callback": () => {
              if (isMounted) {
                onVerifyRef.current("");
              }
            },
            theme: "light",
          });
        } catch {
          // Non-blocking if Turnstile script cannot initialize
        }
      }
    }

    const scriptId = "cf-turnstile-script";
    let existingScript = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (!window.turnstile) {
      if (!existingScript) {
        existingScript = document.createElement("script");
        existingScript.id = scriptId;
        existingScript.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        existingScript.async = true;
        existingScript.defer = true;
        existingScript.onerror = () => {
          if (isMounted) {
            onVerifyRef.current("");
          }
        };
        existingScript.addEventListener("load", renderWidget);
        document.head.appendChild(existingScript);
      } else {
        existingScript.addEventListener("load", renderWidget);
      }
    } else {
      renderWidget();
    }

    return () => {
      isMounted = false;
      existingScript?.removeEventListener("load", renderWidget);
      if (widgetIdRef.current && window.turnstile?.remove) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // ignore cleanup failures
        }
        widgetIdRef.current = null;
      }
    };
  }, [rawSiteKey, shouldMountWidget]);

  if (!shouldMountWidget) {
    return null;
  }

  return (
    <div className={`turnstile-container py-1 ${className}`}>
      <div ref={containerRef} className="cf-turnstile" />
    </div>
  );
};
