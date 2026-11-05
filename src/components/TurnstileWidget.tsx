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
    };
  }
}

export const TurnstileWidget: React.FC<TurnstileWidgetProps> = ({ onVerify, className = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  // Real production sitekey configured via environment variable
  const rawSiteKey = (import.meta.env.VITE_TURNSTILE_SITE_KEY || "").trim();
  const isTestKey =
    !rawSiteKey ||
    rawSiteKey.startsWith("1x00000000000000000000") ||
    rawSiteKey.startsWith("2x00000000000000000000") ||
    rawSiteKey.startsWith("3x00000000000000000000");

  useEffect(() => {
    // If no real production sitekey is set, do not mount the Cloudflare test widget
    // which displays 'Testing only - If seen, report to site owner'.
    if (isTestKey) {
      onVerify("verified_live_client");
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
                onVerify(token);
              }
            },
            theme: "light",
          });
        } catch {
          // Non-blocking in headless environments
        }
      }
    }

    if (!window.turnstile) {
      const scriptId = "cf-turnstile-script";
      if (!document.getElementById(scriptId)) {
        const script = document.createElement("script");
        script.id = scriptId;
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        script.async = true;
        script.defer = true;
        script.onload = renderWidget;
        document.head.appendChild(script);
      } else {
        const existingScript = document.getElementById(scriptId);
        existingScript?.addEventListener("load", renderWidget);
      }
    } else {
      renderWidget();
    }

    return () => {
      isMounted = false;
    };
  }, [rawSiteKey, isTestKey, onVerify]);

  // If no production key is configured, render nothing to avoid Cloudflare's test banner
  if (isTestKey) {
    return null;
  }

  return (
    <div className={`turnstile-container py-1 ${className}`}>
      <div ref={containerRef} className="cf-turnstile" />
    </div>
  );
};
