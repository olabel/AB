import { initializeApp, getApps, cert, applicationDefault } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import fs from "fs";
import path from "path";

let adminDb: Firestore | null = null;

/**
 * Initializes and retrieves the singleton Firebase Admin Firestore instance.
 * Supports:
 * 1. FIREBASE_SERVICE_ACCOUNT_KEY (JSON string or file path)
 * 2. GOOGLE_APPLICATION_CREDENTIALS / Application Default Credentials (GCP / Cloud Run / Vertex)
 * 3. Graceful fallback with warning in local development if no server credentials exist.
 */
export function getAdminFirestore(): Firestore | null {
  if (adminDb) return adminDb;

  try {
    let app;
    if (getApps().length > 0) {
      app = getApps()[0];
    } else {
      let credential;
      const serviceAccountRaw =
        process.env.FIREBASE_SERVICE_ACCOUNT_KEY ||
        process.env.FIREBASE_ADMIN_CREDENTIALS ||
        process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;

      if (serviceAccountRaw) {
        try {
          const parsed = JSON.parse(serviceAccountRaw);
          credential = cert(parsed);
        } catch {
          if (fs.existsSync(serviceAccountRaw)) {
            credential = cert(serviceAccountRaw);
          } else {
            credential = applicationDefault();
          }
        }
      } else {
        credential = applicationDefault();
      }

      // Read project configuration
      const configPath = path.resolve(process.cwd(), "firebase-applet-config.json");
      let projectId = "gen-lang-client-0965908297";
      if (fs.existsSync(configPath)) {
        try {
          const cfg = JSON.parse(fs.readFileSync(configPath, "utf-8"));
          if (cfg.projectId) projectId = cfg.projectId;
        } catch {
          // Ignore parse errors
        }
      }

      app = initializeApp({
        credential,
        projectId,
      });
    }

    // Connect to custom database ID if configured
    const configPath = path.resolve(process.cwd(), "firebase-applet-config.json");
    let databaseId: string | undefined = undefined;
    if (fs.existsSync(configPath)) {
      try {
        const cfg = JSON.parse(fs.readFileSync(configPath, "utf-8"));
        if (cfg.firestoreDatabaseId && cfg.firestoreDatabaseId !== "(default)") {
          databaseId = cfg.firestoreDatabaseId;
        }
      } catch {
        // Ignore parse errors
      }
    }

    adminDb = databaseId ? getFirestore(app, databaseId) : getFirestore(app);
    return adminDb;
  } catch (err: any) {
    console.warn("[FIREBASE ADMIN INIT NOTE]: Server credentials not active or metadata unreachable:", err?.message || err);
    return null;
  }
}

/**
 * Server-Authoritative Subscriber Persistence:
 * Denies all client SDK writes and records confirmed double opt-in CASL proof
 * exclusively through Firebase Admin SDK.
 */
export async function saveSubscriberViaAdmin(subscriber: {
  email: string;
  confirmedAt: string;
  consentWording: string;
  ip: string;
  userAgent?: string;
  source?: string;
}): Promise<boolean> {
  try {
    const db = getAdminFirestore();
    if (!db) return false;

    const docId = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    await db.collection("subscribers").doc(docId).set({
      email: subscriber.email.trim().toLowerCase(),
      confirmedAt: subscriber.confirmedAt,
      consentWording: subscriber.consentWording,
      ip: subscriber.ip,
      userAgent: (subscriber.userAgent || "").slice(0, 300),
      source: subscriber.source || "double_opt_in_signed_token",
      recordedVia: "firebase_admin_sdk",
      serverTimestamp: new Date().toISOString(),
    });

    console.log(`[ADMIN FIRESTORE] Verified subscriber ${subscriber.email} permanently recorded.`);
    return true;
  } catch (err: any) {
    console.warn("[ADMIN FIRESTORE SUBSCRIBER ERROR]:", err?.message || err);
    return false;
  }
}

/**
 * Server-Authoritative Lead Ingestion:
 * Records leads directly into Firestore via Admin SDK after server-side validation.
 */
export async function saveLeadViaAdmin(lead: {
  referenceNo: string;
  topic: string;
  firstName: string;
  email: string;
  phone?: string;
  province?: string;
  message?: string;
  consentEducational?: boolean;
  consentPrivacy?: boolean;
  source?: string;
}): Promise<boolean> {
  try {
    const db = getAdminFirestore();
    if (!db) return false;

    const docId = `lead_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    await db.collection("leads").doc(docId).set({
      referenceNo: String(lead.referenceNo || ""),
      topic: String(lead.topic || "general"),
      firstName: String(lead.firstName || ""),
      email: String(lead.email || ""),
      phone: String(lead.phone || ""),
      province: String(lead.province || "National (Canada & US)"),
      message: String(lead.message || ""),
      consentEducational: Boolean(lead.consentEducational),
      consentPrivacy: Boolean(lead.consentPrivacy),
      createdAt: new Date().toISOString(),
      source: lead.source || "server_contact_api",
      recordedVia: "firebase_admin_sdk",
    });

    console.log(`[ADMIN FIRESTORE] Lead #${lead.referenceNo} recorded securely.`);
    return true;
  } catch (err: any) {
    console.warn("[ADMIN FIRESTORE LEAD ERROR]:", err?.message || err);
    return false;
  }
}
