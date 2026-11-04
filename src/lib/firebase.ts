import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDocFromServer } from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with configured databaseId
export const db =
  firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== "(default)"
    ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
    : getFirestore(app);

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
 * Saves a lead directly into Firebase Firestore `leads` collection.
 * This guarantees persistence even before/regardless of email notification transport.
 */
export async function saveLeadToFirestore(lead: FirestoreLead): Promise<string> {
  const docId = `lead_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const docRef = doc(db, "leads", docId);
  const data = {
    referenceNo: lead.referenceNo,
    topic: lead.topic || "general",
    firstName: lead.firstName,
    email: lead.email,
    phone: lead.phone || "",
    province: lead.province || "National (Canada & US)",
    message: lead.message || "",
    consentEducational: Boolean(lead.consentEducational),
    consentPrivacy: Boolean(lead.consentPrivacy),
    createdAt: lead.createdAt || new Date().toISOString(),
    source: lead.source || "web_form",
  };
  await setDoc(docRef, data);
  return docId;
}
