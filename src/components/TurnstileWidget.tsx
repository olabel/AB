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

  // Use configured environment key or Cloudflare's official non-interactive passing test sitekey
  const siteKey =
    import.meta.env.VITE_TURNSTILE_SITE_KEY || "1x00000000000000000000AA";

  useEffect(() => {
    let isMounted = true;

    function renderWidget() {
      if (window.turnstile && containerRef.current && !widgetIdRef.current) {
        try {
          widgetIdRef.current = window.turnstile.render(containerRef.current, {
            sitekey: siteKey,
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
  }, [siteKey, onVerify]);

  return (
    <div className={`turnstile-container py-1 ${className}`}>
      <div ref={containerRef} className="cf-turnstile" />
    </div>
  );
};
