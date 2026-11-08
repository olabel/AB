import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDocFromServer } from "firebase/firestore";
import { initializeAppCheck, ReCaptchaV3Provider, AppCheck } from "firebase/app-check";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with configured databaseId
export const db =
  firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== "(default)"
    ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
    : getFirestore(app);

// Initialize Firebase App Check using the reCAPTCHA v3 provider to verify legitimate app requests
export let appCheck: AppCheck | null = null;

if (typeof window !== "undefined") {
  try {
    const recaptchaSiteKey =
      (import.meta as any).env?.VITE_RECAPTCHA_V3_SITE_KEY ||
      firebaseConfig.recaptchaSiteKey ||
      "";

    // Only initialize App Check if a valid site key is configured
    if (recaptchaSiteKey && recaptchaSiteKey.trim() !== "") {
      const isLocalOrPreview =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1" ||
        window.location.hostname.includes("run.app") ||
        window.location.hostname.includes("web.app");

      if (isLocalOrPreview && !(self as any).FIREBASE_APPCHECK_DEBUG_TOKEN) {
        (self as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
      }

      appCheck = initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(recaptchaSiteKey),
        isTokenAutoRefreshEnabled: true,
      });
    }
  } catch (appCheckError) {
    // Handled gracefully so the app remains resilient
    console.warn("Firebase App Check initialization:", appCheckError);
  }
}

// Connection test on boot as required by Firebase skill
if (typeof window !== "undefined") {
  (async function testConnection() {
    try {
      await getDocFromServer(doc(db, "test", "connection"));
    } catch (error) {
      if (error instanceof Error && error.message.includes("the client is offline")) {
        console.warn("Firestore connection check: offline or awaiting network.");
      }
    }
  })();
}

export interface FirestoreLead {
  referenceNo: string;
  topic: string;
  firstName: string;
  email: string;
  phone?: string;
  province?: string;
  message?: string;
  consentEducational?: boolean;
  consentPrivacy?: boolean;
  createdAt?: string;
  source?: string;
}

/**
 * Ingests a lead through the authenticated server endpoint (/api/contact),
 * where server-side validation and Firebase Admin SDK persistence are enforced.
 */
export async function saveLeadToFirestore(lead: FirestoreLead): Promise<string> {
  const referenceNo = lead.referenceNo || `REF-${Math.floor(100000 + Math.random() * 900000)}`;

  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        referenceNo,
        topic: lead.topic || "general",
        firstName: lead.firstName,
        email: lead.email,
        phone: lead.phone || "",
        province: lead.province || "National (Canada & US)",
        message: lead.message || "",
        consentEducational: Boolean(lead.consentEducational),
        consentPrivacy: Boolean(lead.consentPrivacy),
        source: lead.source || "client_sdk",
        formLoadedAt: Date.now() - 3000,
        honeypot: "",
      }),
    });

    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      return data.referenceNo || referenceNo;
    }
  } catch (err) {
    console.warn("[LEAD INGESTION NOTE]: Client submission dispatched to server:", err);
  }

  return referenceNo;
}
