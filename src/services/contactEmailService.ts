// Centralized Contact & Confirmation Email Service
// Handles input validation, durable anti-abuse rate limiting per IP and per recipient email,
// disposable domain blocking, bot detection, and compliant email dispatch via Resend.

import fs from "fs";
import path from "path";
import crypto from "crypto";
import { saveLeadToDatabase, recordEmailDeliveryStatus, recordSubscriberToDatabase } from "./dbService.ts";
import { saveSubscriberViaAdmin, saveLeadViaAdmin } from "../server/firebaseAdmin.ts";
import { siteConfig, getCtaLabel } from "../config/site.ts";

export const DEFAULT_NOTIFICATION_RECIPIENTS = (process.env.CONTACT_TO_EMAIL || "").trim();

export const VALID_PROVINCES = [
  "Alberta",
  "British Columbia",
  "Manitoba",
  "New Brunswick",
  "Newfoundland and Labrador",
  "Northwest Territories",
  "Nova Scotia",
  "Nunavut",
  "Ontario",
  "Prince Edward Island",
  "Quebec",
  "Saskatchewan",
  "Yukon",
  "National (Canada & US)",
  "United States - Northeast",
  "United States - Southeast",
  "United States - Midwest",
  "United States - Southwest",
  "United States - West Coast",
  "United States - Other State",
];

export const VALID_TOPICS = [
  "general",
  "accounts",
  "investing",
  "protection",
  "family",
  "retirement",
  "debt",
  "newcomer",
  "mentorship",
  "newsletter",
  "calculator",
  "amt",
  "pension-checklist",
  "other",
];

export const TMP_LEADS_FILE = path.join("/tmp", "ahmed_leads.json");

export interface StoredLead {
  topic: string;
  name: string;
  email: string;
  phone?: string;
  province?: string;
  message?: string;
  consentEducational?: boolean;
  ip?: string;
  recordedAt: string;
}

export function recordLeadSubmission(lead: Omit<StoredLead, "recordedAt">): boolean {
  try {
    let existing: StoredLead[] = [];
    if (fs.existsSync(TMP_LEADS_FILE)) {
      try {
        existing = JSON.parse(fs.readFileSync(TMP_LEADS_FILE, "utf-8"));
      } catch {
        existing = [];
      }
    }
    const record: StoredLead = {
      ...lead,
      recordedAt: new Date().toISOString(),
    };
    existing.push(record);
    fs.writeFileSync(TMP_LEADS_FILE, JSON.stringify(existing, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.warn("Could not save lead to backup leads file:", err);
    return false;
  }
}
export async function saveLeadToFirestoreServer(lead: {
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
  return await saveLeadViaAdmin(lead);
}

export function getRecordedLeads(): StoredLead[] {
  try {
    if (fs.existsSync(TMP_LEADS_FILE)) {
      return JSON.parse(fs.readFileSync(TMP_LEADS_FILE, "utf-8"));
    }
  } catch {
    // fallback
  }
  return [];
}

export function sanitizeText(input: unknown): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/\0/g, "")
    .replace(/[\r\n]/g, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/[<>]/g, "")
    .trim();
}

export function sanitizeMultiline(input: unknown): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/\0/g, "")
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<[^>]*>/g, "")
    .replace(/[<>]/g, "")
    .trim();
}

// --------------------------------------------------------------------------
// Multi-Tier Durable Rate Limiting (survives container cold starts via /tmp)
// --------------------------------------------------------------------------
const TMP_LIMITS_FILE = path.join("/tmp", "ahmed_rate_limits.json");
const TMP_SUBSCRIBERS_FILE = path.join("/tmp", "ahmed_confirmed_subscribers.json");

interface PersistedRateLimits {
  ips: Record<string, { count: number; resetTime: number }>;
  emails: Record<string, { count: number; resetTime: number }>;
}

function loadPersistedLimits(): PersistedRateLimits {
  try {
    if (fs.existsSync(TMP_LIMITS_FILE)) {
      const raw = fs.readFileSync(TMP_LIMITS_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch {
    // Non-blocking in ephemeral sandboxes
  }
  return { ips: {}, emails: {} };
}

function savePersistedLimits(data: PersistedRateLimits) {
  try {
    const now = Date.now();
    const cleanIps: Record<string, { count: number; resetTime: number }> = {};
    for (const [k, v] of Object.entries(data.ips || {})) {
      if (v && v.resetTime > now) cleanIps[k] = v;
    }
    const cleanEmails: Record<string, { count: number; resetTime: number }> = {};
    for (const [k, v] of Object.entries(data.emails || {})) {
      if (v && v.resetTime > now) cleanEmails[k] = v;
    }
    fs.writeFileSync(
      TMP_LIMITS_FILE,
      JSON.stringify({ ips: cleanIps, emails: cleanEmails }),
      "utf-8"
    );
  } catch {
    // Non-blocking
  }
}

// Memory cache for immediate hot lookups
const ipSubmissions = new Map<string, { count: number; resetTime: number }>();
const IP_RATE_LIMIT_MAX = 8;
const IP_RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

export function checkIpRateLimit(ip: string): boolean {
  const now = Date.now();
  const state = loadPersistedLimits();
  const entry = state.ips[ip] || ipSubmissions.get(ip);

  if (!entry || now > entry.resetTime) {
    const updated = { count: 1, resetTime: now + IP_RATE_LIMIT_WINDOW_MS };
    ipSubmissions.set(ip, updated);
    state.ips[ip] = updated;
    savePersistedLimits(state);
    return true;
  }

  if (entry.count >= IP_RATE_LIMIT_MAX) {
    return false;
  }

  entry.count += 1;
  ipSubmissions.set(ip, entry);
  state.ips[ip] = entry;
  savePersistedLimits(state);
  return true;
}

// Disposable email provider blocklist to block automated bombing
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com",
  "10minutemail.com",
  "guerrillamail.com",
  "tempmail.com",
  "throwawaymail.com",
  "trashmail.com",
  "yopmail.com",
  "sharklasers.com",
  "dispostable.com",
  "temp-mail.org",
  "fakeinbox.com",
]);

const emailReceiptTracker = new Map<string, { count: number; resetTime: number }>();
const EMAIL_RECEIPT_MAX = 2;
const EMAIL_RECEIPT_WINDOW_MS = 2 * 60 * 60 * 1000;

export function shouldSendReceiptToEmail(email: string): boolean {
  const normalized = email.toLowerCase().trim();
  const domain = normalized.split("@")[1];
  if (domain && DISPOSABLE_DOMAINS.has(domain)) {
    return false;
  }

  const now = Date.now();
  const state = loadPersistedLimits();
  const entry = state.emails[normalized] || emailReceiptTracker.get(normalized);

  if (!entry || now > entry.resetTime) {
    const updated = { count: 1, resetTime: now + EMAIL_RECEIPT_WINDOW_MS };
    emailReceiptTracker.set(normalized, updated);
    state.emails[normalized] = updated;
    savePersistedLimits(state);
    return true;
  }

  if (entry.count >= EMAIL_RECEIPT_MAX) {
    return false;
  }

  entry.count += 1;
  emailReceiptTracker.set(normalized, entry);
  state.emails[normalized] = entry;
  savePersistedLimits(state);
  return true;
}

export const CASL_CONSENT_WORDING =
  "I consent to receive occasional plain-language educational briefings regarding Canadian tax changes, registered account limits (TFSA, RRSP, FHSA), and financial policy updates from Ahmed Bello under CASL.";

/**
 * Generate a cryptographically signed, expiring token (48h TTL) for CASL double opt-in.
 * Fails closed if SESSION_SECRET / TOKEN_SECRET is not configured.
 */
export function generateSubscriptionToken(email: string): string {
  const normalized = email.toLowerCase().trim();
  const expiresAt = Date.now() + 48 * 60 * 60 * 1000; // 48 hours validity
  const payload = `${normalized}:${expiresAt}`;
  const secret = (process.env.SESSION_SECRET || process.env.TOKEN_SECRET || "").trim();
  if (!secret) {
    throw new Error("SESSION_SECRET is not configured in environment. Double opt-in signing fails closed.");
  }
  const signature = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return `${Buffer.from(payload, "utf-8").toString("base64url")}.${signature}`;
}

/**
 * Verify HMAC signature and expiration on a subscription token.
 * Fails closed if SESSION_SECRET / TOKEN_SECRET is not configured.
 */
export function verifySubscriptionToken(token: string): { valid: boolean; email?: string; error?: string } {
  if (!token || typeof token !== "string" || !token.includes(".")) {
    return { valid: false, error: "invalid_format" };
  }
  const [b64Payload, signature] = token.split(".");
  if (!b64Payload || !signature) {
    return { valid: false, error: "invalid_format" };
  }
  const secret = (process.env.SESSION_SECRET || process.env.TOKEN_SECRET || "").trim();
  if (!secret) {
    console.error("[CASL SECURITY]: SESSION_SECRET is not configured. Failing closed.");
    return { valid: false, error: "signing_secret_not_configured" };
  }
  try {
    const payload = Buffer.from(b64Payload, "base64url").toString("utf-8");
    const [email, expiresStr] = payload.split(":");
    const expiresAt = Number(expiresStr);
    if (!email || isNaN(expiresAt)) {
      return { valid: false, error: "malformed_token" };
    }
    const expectedSignature = crypto.createHmac("sha256", secret).update(payload).digest("hex");

    const sigBuffer = Buffer.from(signature, "hex");
    const expBuffer = Buffer.from(expectedSignature, "hex");
    if (sigBuffer.length !== expBuffer.length || !crypto.timingSafeEqual(sigBuffer, expBuffer)) {
      return { valid: false, error: "invalid_signature" };
    }
    if (Date.now() > expiresAt) {
      return { valid: false, error: "token_expired" };
    }
    return { valid: true, email };
  } catch {
    return { valid: false, error: "verification_exception" };
  }
}

/**
 * Server-Authoritative Subscriber Persistence via Firebase Admin SDK.
 * Bypasses client rules to securely write CASL proof without allowing public client writes.
 */
export async function saveSubscriberToFirestoreServer(subscriber: {
  email: string;
  confirmedAt: string;
  consentWording: string;
  ip: string;
  userAgent?: string;
  source?: string;
}): Promise<boolean> {
  return await saveSubscriberViaAdmin(subscriber);
}

/**
 * Multi-layer persistence for verified subscribers (SQLite, Firestore, local backup).
 */
export async function recordConfirmedSubscriber(params: {
  email: string;
  ip: string;
  userAgent?: string;
  consentWording?: string;
  source?: string;
}): Promise<boolean> {
  const normalized = params.email.toLowerCase().trim();
  const confirmedAt = new Date().toISOString();
  const consentText = params.consentWording || CASL_CONSENT_WORDING;

  // 1. SQLite database persistence
  recordSubscriberToDatabase({
    email: normalized,
    confirmedAt,
    consentWording: consentText,
    ip: params.ip,
    userAgent: params.userAgent,
    source: params.source || "double_opt_in",
  });

  // 2. Dual persistence to Firebase Firestore
  const firestoreSuccess = await saveSubscriberToFirestoreServer({
    email: normalized,
    confirmedAt,
    consentWording: consentText,
    ip: params.ip,
    userAgent: params.userAgent,
    source: params.source || "double_opt_in",
  });

  // 3. Local JSON backup
  try {
    let subscribers: Record<string, { confirmedAt: string; ip: string; consentWording: string }> = {};
    if (fs.existsSync(TMP_SUBSCRIBERS_FILE)) {
      subscribers = JSON.parse(fs.readFileSync(TMP_SUBSCRIBERS_FILE, "utf-8"));
    }
    subscribers[normalized] = {
      confirmedAt,
      ip: params.ip,
      consentWording: consentText,
    };
    fs.writeFileSync(TMP_SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2), "utf-8");
  } catch {
    // Non-blocking
  }

  // Must return false when Firestore write fails
  if (!firestoreSuccess) {
    console.error(`[FIRESTORE WRITE FAILED] Could not record confirmed subscriber ${normalized}`);
    return false;
  }

  return true;
}

export interface ContactSubmissionPayload {
  firstName?: unknown;
  name?: unknown;
  fullName?: unknown;
  email?: unknown;
  phone?: unknown;
  province?: unknown;
  topic?: unknown;
  message?: unknown;
  consentPrivacy?: unknown;
  consentEducational?: unknown;
  honeypot?: unknown;
  website_hp?: unknown;
  hp_check?: unknown;
  formLoadedAt?: unknown;
}

export interface ContactServiceResult {
  status: number;
  body: {
    success?: boolean;
    error?: string;
    message?: string;
    notice?: string;
    code?: string;
    errors?: Record<string, string>;
    referenceNo?: string;
    phone?: string;
    calendly?: string;
    recorded?: boolean;
    queued?: boolean;
  };
}

interface WelcomeActionAsset {
  subjectPrefix: string;
  title: string;
  steps: string[];
  replyQuestion: string;
}

export function buildWelcomeActionAsset(
  rawSource: string,
  topic: string,
  lang: "en" | "fr"
): WelcomeActionAsset {
  const s = (rawSource || "").toLowerCase();
  const isFr = lang === "fr";

  if (s.includes("fhsa")) {
    return isFr
      ? {
          subjectPrefix: "Votre Plan d'Action & Aide-Mémoire CELIAPP",
          title: "Votre Plan d'Action Rapide (CELIAPP + RAP)",
          steps: [
            "Ouvrez votre CELIAPP dès que possible : vos droits annuels de 8 000 $ (et jusqu'à 8 000 $ reportés) ne commencent à s'accumuler qu'après l'ouverture officielle du compte.",
            "Confirmez votre admissibilité à titre d'acheteur d'une première habitation auprès de l'ARC (règle des 4 années civiles précédentes).",
            "Planifiez le décaissement coordonné CELIAPP + RAP (jusqu'à 60 000 $) avant la clôture pour financer la mise de fonds sans impôt.",
          ],
          replyQuestion:
            "Prévoyez-vous acheter au cours des 12 prochains mois, ou votre horizon est-il plutôt de 2 à 5 ans ?",
        }
      : {
          subjectPrefix: "Your FHSA Action Checklist & Calculation",
          title: "Your Quick Welcome Action Checklist (FHSA + HBP)",
          steps: [
            "Open the FHSA before year-end even with a small starter deposit: the $8,000 annual room (and $8,000 carry-forward cap) only begins accruing once the account is opened.",
            "Verify your CRA first-time home buyer status (you and your spouse/partner did not live in a home either of you owned in the current year or prior 4 calendar years).",
            "Sequence your closing timeline carefully so qualifying FHSA + Home Buyers' Plan (up to $60,000) withdrawals arrive before completion without triggering HBP repayment surprises.",
          ],
          replyQuestion:
            "Are you planning to buy within the next 12 months, or is your timeline 2–5 years out?",
        };
  }

  if (s.includes("blindspot")) {
    return isFr
      ? {
          subjectPrefix: "Votre Liste d'Actions Prioritaires (Pièges Financiers)",
          title: "3 vérifications rapides pour récupérer vos dollars oubliés",
          steps: [
            "Vérifiez vos échéances : les remboursements d'assurance prêt hypothécaire écoénergétique (SCHL / Sagen / Canada Guaranty) exigent souvent une demande dans les 24 mois suivant la clôture.",
            "Validez l'espace inutilisé de la SCEE et du BEC pour tout enfant de 17 ans ou moins (et demandez à l'institution le relevé des subventions disponibles).",
            "Utilisez l'outil « Modifier ma déclaration » de Mon dossier ARC pour réclamer d'éventuels crédits manqués sur jusqu'à 10 années d'imposition antérieures.",
          ],
          replyQuestion:
            "Lequel des points de votre liste vous semble le plus urgent pour votre foyer en ce moment ?",
        }
      : {
          subjectPrefix: "Your Money Blindspots Action Checklist",
          title: "3 Fast Statutory Deadline Checks to Start Today",
          steps: [
            "Check closing-folder deadlines first: CMHC / Sagen / Canada Guaranty energy-efficiency premium refunds typically must be claimed within 24 months of home closing.",
            "Confirm unused RESP CESG carry-forward room and Canada Learning Bond ($0 deposit needed for eligible lower-income families) before age 17.",
            "Check CRA My Account 'Change my return' if you may have missed medical, tuition, disability, or employment-expense claims within the 10-year T1-ADJ window.",
          ],
          replyQuestion:
            "Which item on your checklist feels most urgent for your household right now?",
        };
  }

  if (s.includes("tfsa_vs_rrsp") || topic === "accounts") {
    return isFr
      ? {
          subjectPrefix: "Votre Synthèse & Liste d'Actions CELI vs REER",
          title: "3 vérifications avant de cotiser à votre CELI ou REER",
          steps: [
            "Confirmez vos droits réels dans Mon dossier ARC (les totaux bancaires ne reflètent pas toujours vos retraits de l'année précédente ou les facteurs d'équivalence).",
            "Rappelez-vous qu'un retrait CELI ne redonne des droits de cotisation que le 1er janvier suivant (pénalité de 1 %/mois en cas de dépassement).",
            "Si vous utilisez le REER dans une tranche fiscale élevée, réinvestissez le remboursement d'impôt dans votre CELI ou votre hypothèque plutôt que de le dépenser.",
          ],
          replyQuestion:
            "Cherchez-vous surtout à préparer l'achat d'une maison, réduire votre impôt cette année ou bâtir un revenu de retraite flexible ?",
        }
      : {
          subjectPrefix: "Your TFSA vs. RRSP Tax Action Summary",
          title: "3 Checks Before Funding Your Next Contribution",
          steps: [
            "Confirm exact room inside CRA My Account (and remember any 2026 TFSA withdrawals do not restore room until January 1, avoiding the 1%/month over-contribution penalty).",
            "Compare your marginal bracket today vs. expected retirement income, especially if Old Age Security recovery tax or child-benefit income testing applies.",
            "If picking RRSP for the upfront deduction ($33,810 max in 2026 at 18% of prior-year income), set aside or reinvest the refund immediately rather than absorbing it into lifestyle spending.",
          ],
          replyQuestion:
            "Are you optimizing right now for a home purchase, retirement income flexibility, or reducing this year's tax bill?",
        };
  }

  if (s.includes("resp") || topic === "family") {
    return isFr
      ? {
          subjectPrefix: "Votre Plan d'Action & Subventions REEE",
          title: "3 étapes pour maximiser vos subventions REEE (SCEE & BEC)",
          steps: [
            "Demandez à votre fournisseur de vérifier le solde exact de droits de SCEE inutilisés auprès d'EDSC (jusqu'à 1 000 $/an de subvention de base sur 5 000 $ en rattrapage).",
            "Assurez-vous que le numéro d'assurance sociale (NAS) de votre enfant est au dossier afin de recevoir la SCEE (20 % jusqu'à 7 200 $ à vie) et le Bon d'études canadien le cas échéant.",
            "Si votre enfant approche 15 ans, vérifiez la règle des 16-17 ans (minimum cumulatif de 2 000 $ ou 100 $/an sur 4 ans avant la fin des 15 ans).",
          ],
          replyQuestion:
            "Quel âge a votre enfant actuellement, et avez-vous déjà un compte REEE ouvert à son nom ?",
        }
      : {
          subjectPrefix: "Your RESP Grant & Provider Action Checklist",
          title: "3 Quick Steps to Protect Your Child's RESP Grants",
          steps: [
            "Ask your RESP provider to confirm your child's remaining ESDC unused CESG room (allowing up to $1,000 basic grant per year on a $5,000 catch-up contribution toward the $7,200 lifetime cap).",
            "Verify your child's SIN is linked and ask specifically for both Basic/Additional CESG and the Canada Learning Bond ($500 yr 1 + $100/yr to $2,000 for eligible modest-income families).",
            "If your child is 14–15, double-check the age 16–17 rule ($2,000 total contributed before Dec 31 of the year they turn 15, or $100/yr in any 4 prior years).",
          ],
          replyQuestion:
            "How old is your child right now, and do you already have an RESP opened?",
        };
  }

  if (s.includes("newcomer") || topic === "newcomer") {
    return isFr
      ? {
          subjectPrefix: "Votre Plan d'Autonomie Financière (1re Année au Canada)",
          title: "Liste d'actions prioritaires des 90 premiers jours au Canada",
          steps: [
            "Confirmez votre date officielle de résidence fiscale avant d'ouvrir un CELI ou un CELIAPP (cotiser avant de devenir résident fiscal entraîne une pénalité de 1 % par mois).",
            "Obtenez votre NAS, demandez les crédits TPS/TVH et l'ACE, et établissez un historique de crédit canadien simple avec un faible ratio d'utilisation.",
            "Vérifiez auprès d'un comptable l'obligation de déclaration T1135 (biens étrangers > 100 000 $ CA) applicable à partir de votre deuxième année de résidence fiscale.",
          ],
          replyQuestion:
            "Dans quelle province vous installez-vous, et quel est votre horizon pour commencer à exercer ou stabiliser vos revenus ?",
        }
      : {
          subjectPrefix: "Your First-Year Canada Financial Runway Plan",
          title: "90-Day Canadian Settlement Financial Checklist",
          steps: [
            "Confirm your exact CRA tax-residency start date before funding a TFSA or FHSA (contributing before becoming a Canadian resident for tax purposes triggers a 1%/month penalty).",
            "Apply early for your SIN, GST/HST credit, and Canada Child Benefit, and build Canadian credit history safely with low card utilization.",
            "Flag the CRA Form T1135 foreign property rule ($100,000+ CAD cost outside Canada) early with a tax preparer so your second-year filing has no late-filing surprises.",
          ],
          replyQuestion:
            "Which province are you settling in, and are you budgeting mainly around licensing timelines or your first home purchase?",
        };
  }

  if (s.includes("amt") || topic === "amt") {
    return isFr
      ? {
          subjectPrefix: "Votre Estimation IMR & Liste de Vérification Fiscale",
          title: "3 points clés à préparer avec votre CPA (IMR fédéral)",
          steps: [
            "Distinguez les dons en espèces des dons de titres cotés en bourse (inclus à 30 % dans le calcul de l'IMR et crédit de don permis à 80 %).",
            "Vérifiez si le crédit d'IMR généré cette année peut être récupéré sur l'impôt régulier des 7 années d'imposition suivantes.",
            "Échelonnez si possible la réalisation de gains en capital sur plusieurs années civiles autour de l'exemption d'IMR.",
          ],
          replyQuestion:
            "Votre transaction est-elle prévue cette année civile, ou évaluez-vous un étalement sur plusieurs années avec votre comptable ?",
        }
      : {
          subjectPrefix: "Your Federal AMT Estimate & CPA Preparation Notes",
          title: "3 Key Points to Bring to Your CPA / Tax Review",
          steps: [
            "Separate cash charitable donations from publicly listed securities (which carry a 30% AMT inclusion alongside the 80% charitable donation tax credit allowance).",
            "Check your 7-year regular-tax capacity so any excess AMT paid this year has a realistic path to carry-forward recovery.",
            "Test multi-year timing of capital gains around the annual AMT exemption rather than triggering a single-year spike without running both T1 and T691 estimates.",
          ],
          replyQuestion:
            "Is this liquidity event happening this calendar year, or are you exploring multi-year timing?",
        };
  }

  if (s.includes("pension") || topic === "pension-checklist") {
    return isFr
      ? {
          subjectPrefix: "Votre Grille d'Aide à la Décision : Rente Commuée",
          title: "3 vérifications avant l'échéance de votre relevé de cessation",
          steps: [
            "Notez la date limite stricte indiquée sur votre trousse d'option de retraite (souvent 60 à 90 jours après la cessation d'emploi).",
            "Comparez la valeur de transfert maximale (ITR 8517) vers votre CRI à la portion excédentaire imposable au comptant dans l'année du transfert.",
            "Évaluez la valeur de l'indexation garantie et de la réversion au conjoint survivant avant de renoncer à une rente à prestations déterminées.",
          ],
          replyQuestion:
            "Quelle est la date limite indiquée sur votre relevé d'option de retraite en ce moment ?",
        }
      : {
          subjectPrefix: "Your Pension Commuted Value Decision Checklist",
          title: "3 Critical Checks Before Your Pension Election Deadline",
          steps: [
            "Highlight the strict election deadline printed on your termination package (once missed or executed, commuted-value transfers are typically irreversible).",
            "Compare your ITR 8517 Maximum Transfer Value (tax-sheltered into a LIRA) against any excess lump sum paid in cash and taxed at your marginal rate in the transfer year.",
            "Benchmark inflation protection, bridge benefits, and spousal survivor coverage before trading away defined-benefit lifetime income.",
          ],
          replyQuestion:
            "What decision deadline is printed on your pension option statement right now?",
        };
  }

  return isFr
    ? {
        subjectPrefix: "Votre Synthèse Personnalisée & Liste d'Actions",
        title: "3 prochaines vérifications rapides",
        steps: [
          "Confirmez vos droits de cotisation exacts dans Mon dossier ARC (CELI 7 000 $/an, REER jusqu'à 33 810 $/an selon 2026) avant de virer des fonds.",
          "Vérifiez si votre employeur offre une cotisation de contrepartie avant d'allouer des liquidités ailleurs.",
          "Gardez votre coussin d'urgence séparé des placements à long terme pour ne jamais devoir liquider au mauvais moment.",
        ],
        replyQuestion:
          "Travaillez-vous sur une décision prévue d'ici 12 mois, ou plutôt sur une stratégie à 2–5 ans ?",
      }
    : {
        subjectPrefix: "Your Customized Plan Calculation Breakdown",
        title: "3 Quick Verification Steps for Your Next Move",
        steps: [
          "Verify your exact remaining room in CRA My Account (2026 TFSA annual limit $7,000; 2026 RRSP 18% up to $33,810) before transferring cash.",
          "Capture any employer matching contributions first before funding lower-priority accounts.",
          "Keep short-term cash needs (next 1–3 years) out of volatile growth assets so timing never forces a bad sale.",
        ],
        replyQuestion:
          "Are you planning around a decision in the next 12 months, or looking 2–5 years ahead?",
      };
}

export async function processContactSubmission(
  rawBody: any,
  clientIp: string,
  resendApiKey: string | undefined,
  contactToEmail: string = DEFAULT_NOTIFICATION_RECIPIENTS,
  contactFromEmail: string = siteConfig.defaultFromEmail
): Promise<ContactServiceResult> {
  // 1. IP Rate Limiting
  if (!checkIpRateLimit(clientIp)) {
    return {
      status: 429,
      body: {
        error: "rate_limit_exceeded",
        message: "Too many submissions from this connection. Please try again in an hour.",
      },
    };
  }

  // 2. Extract and sanitize inputs
  const body = rawBody || {};
  let firstName = sanitizeText(body.firstName || body.name || body.fullName);
  const email = sanitizeText(body.email);
  const phone = sanitizeText(body.phone);
  let province = sanitizeText(body.province);
  const topic = sanitizeText(body.topic) || "general";
  const message = sanitizeMultiline(body.message);
  const consentPrivacy = Boolean(body.consentPrivacy);
  const consentEducational = Boolean(body.consentEducational);
  const honeypot = sanitizeText(body.honeypot || body.website_hp || body.hp_check || body.work_phone_hp);
  const formLoadedAt = Number(body.formLoadedAt);

  // 3. Honeypot check: silently drop automated spam
  if (honeypot && honeypot.length > 0) {
    return {
      status: 200,
      body: { success: true, notice: "processed" },
    };
  }

  // 4. Minimum fill time check (allow fast browser autofill, drop sub-800ms scripts)
  if (formLoadedAt && !isNaN(formLoadedAt)) {
    const elapsed = Date.now() - formLoadedAt;
    if (elapsed < 800) {
      return {
        status: 400,
        body: {
          error: "automated_submission",
          message: "Submission was too fast. Please take a moment to review before submitting.",
        },
      };
    }
  }

  const rawSource = sanitizeText(body.source);
  const lang: "en" | "fr" = sanitizeText(body.language) === "fr" ? "fr" : "en";
  const isNewsletter = topic === "newsletter";
  const isCalculator =
    topic === "calculator" ||
    topic === "amt" ||
    topic === "pension-checklist" ||
    rawSource.startsWith("calculator_");
  const isMentorship = topic === "mentorship";

  if (isNewsletter && !firstName) {
    firstName = "Newsletter Subscriber";
  }
  if (isNewsletter && !province) {
    province = "National (Canada & US)";
  }

  if (isCalculator && !firstName) {
    firstName = "Reader";
  }
  if (isCalculator && !province) {
    province = "National (Canada & US)";
  }

  const PROVINCE_MAP: Record<string, string> = {
    AB: "Alberta",
    BC: "British Columbia",
    MB: "Manitoba",
    NB: "New Brunswick",
    NL: "Newfoundland and Labrador",
    NT: "Northwest Territories",
    NS: "Nova Scotia",
    NU: "Nunavut",
    ON: "Ontario",
    PE: "Prince Edward Island",
    PEI: "Prince Edward Island",
    QC: "Quebec",
    SK: "Saskatchewan",
    YT: "Yukon",
    "UNITED STATES - NORTHEAST": "United States - Northeast",
    "UNITED STATES - SOUTHEAST": "United States - Southeast",
    "UNITED STATES - MIDWEST": "United States - Midwest",
    "UNITED STATES - SOUTHWEST": "United States - Southwest",
    "UNITED STATES - WEST COAST": "United States - West Coast",
    "UNITED STATES - OTHER STATE": "United States - Other State",
  };
  if (province) {
    const normalizedProvinceKey = province.replace(/\u2014/g, "-").toUpperCase();
    if (PROVINCE_MAP[normalizedProvinceKey]) {
      province = PROVINCE_MAP[normalizedProvinceKey];
    } else if (province.includes("\u2014")) {
      const normalizedProvince = province.replace(/\u2014/g, "-");
      if (VALID_PROVINCES.includes(normalizedProvince)) {
        province = normalizedProvince;
      }
    }
  }

  // 5. Validation
  const errors: Record<string, string> = {};

  // Unicode name regex supporting international names (e.g. Nguyễn, Łukasz, محمد, 王伟, Олена, O’Brien, Dr. Okafor)
  const unicodeNameRegex = /^[\p{L}\p{M}\s'’‘.-]{1,80}$/u;
  if (!firstName || firstName.length === 0) {
    errors.firstName = "First name is required.";
  } else if (firstName.length > 80) {
    errors.firstName = "First name must be 80 characters or fewer.";
  } else if (!unicodeNameRegex.test(firstName)) {
    errors.firstName = "First name contains invalid characters.";
  }

  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!email || email.length > 100 || !emailRegex.test(email)) {
    errors.email = "A valid email address is required (under 100 characters).";
  }

  if (!isNewsletter) {
    if (!province || !VALID_PROVINCES.includes(province)) {
      errors.province = "Please select a valid Canadian province or region from the dropdown.";
    }

    if (phone) {
      const cleanPhone = phone.replace(/[\s().+-]/g, "");
      if (cleanPhone.length < 10 || cleanPhone.length > 15 || !/^\d+$/.test(cleanPhone)) {
        errors.phone = "Phone number format is invalid (10 to 15 digits expected).";
      }
    }

    if (!consentPrivacy && !isCalculator) {
      errors.consentPrivacy = "You must accept the privacy notice before submitting.";
    }
  }

  if (Object.keys(errors).length > 0) {
    return {
      status: 400,
      body: {
        error: "validation_failed",
        errors,
      },
    };
  }

  // 5.5 Save each lead to a real database FIRST before attempting email dispatch
  let dbRecord: { id: string; referenceNo: string } | null = null;
  try {
    dbRecord = saveLeadToDatabase({
      topic,
      firstName,
      email,
      phone,
      province,
      message,
      consentPrivacy,
      consentEducational,
      ip: clientIp,
    });
    // Compliant logging: Log ONLY reference number (no PII: no names, no email addresses)
    console.log(`[LEAD SAVED TO DB] Ref: #${dbRecord.referenceNo} | Topic: ${topic} | Stored in SQLite.`);
  } catch (dbErr: any) {
    console.error(`[DB ERROR] Database write failed:`, dbErr?.message || dbErr);
  }

  // Dual Persistence: Also persist directly to Firebase Firestore
  const referenceNo = dbRecord?.referenceNo || Math.random().toString(36).substring(2, 8).toUpperCase();
  const firestoreSaved = await saveLeadToFirestoreServer({
    referenceNo,
    topic,
    firstName,
    email,
    phone,
    province,
    message,
    consentPrivacy,
    consentEducational,
    source: rawSource || (isNewsletter ? "newsletter_form" : isCalculator ? "calculator_form" : "contact_form"),
  });

  // Backup file persistence
  const backupSaved = recordLeadSubmission({
    topic,
    name: firstName,
    email,
    phone,
    province,
    message,
    consentEducational,
    ip: clientIp,
  });

  const anyPersisted = Boolean(dbRecord || firestoreSaved || backupSaved);

  // 6. If no Resend API key is present in environment, record alert in DB and handle outcome
  if (!resendApiKey) {
    if (anyPersisted) {
      if (dbRecord) {
        recordEmailDeliveryStatus({
          leadId: dbRecord.id,
          referenceNo: dbRecord.referenceNo,
          status: "offline_saved",
          errorMessage: "RESEND_API_KEY unconfigured; lead safely preserved in SQLite database",
          recipients: contactToEmail || "configured_recipient",
        });
      }
      console.warn(
        `[EMAIL ALERT] Ref: #${referenceNo} | Email unconfigured. Lead preserved (${
          dbRecord ? "SQLite" : firestoreSaved ? "Firestore" : "backup"
        }).`
      );
      return {
        status: 200,
        body: {
          success: true,
          referenceNo,
          message: isNewsletter
            ? "Subscription request received. Please check your inbox for confirmation."
            : isCalculator
            ? "Your customized plan has been recorded and queued for delivery. Ahmed Bello will review your calculation details."
            : "Enquiry sent successfully. I will follow up shortly.",
          recorded: true,
        },
      };
    }

    // Both database and email failed!
    return {
      status: 500,
      body: {
        error: "submission_failed",
        message:
          `Your message could not be saved right now. Please reach out directly to Ahmed Bello by phone at ${siteConfig.publicPhone} or schedule a conversation via Calendly.`,
        phone: siteConfig.publicPhone,
        calendly: siteConfig.schedulingUrl,
      },
    };
  }

  // 7. Dispatch to advisor
  let emailSubject = `Financial Enquiry: ${firstName} (${province}) - ${topic}`;
  if (isNewsletter) {
    emailSubject = `Canadian Money Rules Briefing Subscriber: ${email}`;
  } else if (isMentorship) {
    emailSubject = `New Agent Mentorship Application: ${firstName} (${province})`;
  } else if (isCalculator) {
    emailSubject = `Customized Plan Calculation Lead: ${firstName} (${province})`;
  }

  const advisorEmailBody = `
${
  isNewsletter
    ? "=== NEW CANADIAN MONEY RULES BRIEFING SUBSCRIBER ==="
    : isMentorship
    ? "=== NEW INDEPENDENT AGENT MENTORSHIP APPLICATION ==="
    : isCalculator
    ? "=== NEW CUSTOMIZED PLAN CALCULATION ENQUIRY ==="
    : "=== NEW FINANCIAL EDUCATION ENQUIRY ==="
}

Name: ${firstName}
Email: ${email}
Phone: ${phone || "Not provided"}
Location: ${province}
Topic: ${topic}
CASL Educational Consent: ${consentEducational ? "Granted (Opted in)" : "Not granted (Did not opt in)"}

${message ? `Notes / Calculation Breakdown:\n${message}\n` : ""}
---------------------------------------------------------
Submitted: ${new Date().toISOString()}
Origin: https://www.ahmedbello.com
  `.trim();

  const rawRecipients = Array.from(
    new Set(
      contactToEmail
        .split(/[,;\s]+/)
        .map((e) => e.trim())
        .filter((e) => e.includes("@"))
    )
  );

  if (rawRecipients.length === 0) {
    console.error("[CONTACT ERROR]: No valid recipient email found in CONTACT_TO_EMAIL.");
    return {
      status: 500,
      body: {
        error: "service_unavailable",
        message: `Contact delivery service is temporarily unavailable. Please schedule a meeting directly or call ${siteConfig.publicPhone}.`,
      },
    };
  }

  const allRecipientsString = rawRecipients.join(", ");
  const primaryRecipient = rawRecipients[0];

  try {
    let resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: contactFromEmail,
        to: rawRecipients,
        reply_to: email,
        subject: emailSubject,
        text: advisorEmailBody,
      }),
    });

    if (!resendResponse.ok && rawRecipients.length > 1) {
      resendResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: contactFromEmail,
          to: [primaryRecipient],
          reply_to: email,
          subject: `${emailSubject} [For Ahmed]`,
          text: `${advisorEmailBody}\n\nNote: Dispatched to primary address while domain verification completes.`,
        }),
      });
    }

    // Direct Notification Fallback: If custom domain is unverified, fallback to Resend's verified onboarding sender to primary recipient
    if (!resendResponse.ok) {
      try {
        const fallbackResend = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Ahmed Bello Notifications <onboarding@resend.dev>",
            to: [primaryRecipient],
            reply_to: email,
            subject: `${emailSubject} [Notification]`,
            text: advisorEmailBody,
          }),
        });
        if (fallbackResend.ok) {
          resendResponse = fallbackResend;
          console.log(`[RESEND DELIVERED] Dispatched notification to ${primaryRecipient} via onboarding@resend.dev`);
        }
      } catch (fbErr) {
        // preserve original response
      }
    }

    if (resendResponse.ok) {
      if (dbRecord) {
        recordEmailDeliveryStatus({
          leadId: dbRecord.id,
          referenceNo: dbRecord.referenceNo,
          status: "delivered",
          recipients: allRecipientsString,
        });
      }
    } else {
      if (dbRecord) {
        recordEmailDeliveryStatus({
          leadId: dbRecord.id,
          referenceNo: dbRecord.referenceNo,
          status: "failed",
          errorMessage: `Resend API returned HTTP ${resendResponse.status}`,
          recipients: allRecipientsString,
        });
        console.warn(
          `[EMAIL ALERT] Ref: #${dbRecord.referenceNo} | Resend dispatch failed (HTTP ${resendResponse.status}) to [${allRecipientsString}]. Alert logged to database.`
        );
      }
    }

    // 8. Automatic Visitor Receipt / Confirmation with Anti-Abuse Rate Limiting
    const canSendReceipt = shouldSendReceiptToEmail(email);
    if (canSendReceipt && resendApiKey) {
      try {
        let confirmationSubject: string;
        let confirmationBody: string;

        if (isNewsletter) {
          const subToken = generateSubscriptionToken(email);
          if (lang === "fr") {
            confirmationSubject = "Confirmez votre inscription : Éducation financière canadienne | Ahmed Bello";
            confirmationBody = `Bonjour ${firstName},

Merci de votre demande d'inscription au bulletin d'éducation financière sur ahmedbello.com.

Pour confirmer votre adresse courriel et recevoir nos résumés pratiques lorsque les règles fiscales canadiennes ou les plafonds des comptes enregistrés (CELI / REER / CELIAPP) changent, veuillez valider votre inscription :
https://www.ahmedbello.com/fr/confirm-subscription?token=${encodeURIComponent(subToken)}

Question rapide (répondez simplement à ce courriel) : quel objectif financier compte le plus pour votre foyer cette année (achat d'une propriété, réduction d'impôt ou préparation de la retraite) ?

Cordialement,
Ahmed Bello
Professionnel agréé en solutions financières
Dieppe (Nouveau-Brunswick), Canada
https://www.ahmedbello.com/fr`;
          } else {
            confirmationSubject = "Confirm your subscription: Canadian Financial Education | Ahmed Bello";
            confirmationBody = `Hello ${firstName},

Thank you for requesting to join the Canadian Money Rules Briefing through ahmedbello.com.

To confirm your email address and activate your subscription to receive occasional plain-language briefings when key Canadian tax rules, annual registered account limits (TFSA/RRSP/FHSA), or public pension policies are updated, please verify your interest:
https://www.ahmedbello.com/confirm-subscription?token=${encodeURIComponent(subToken)}

Quick question (just hit reply): which goal matters most for your household over the next 12 months (buying a home, lowering tax, family protection, or retirement readiness)?

Warm regards,
Ahmed Bello
Licensed Financial Solutions Professional
Dieppe, New Brunswick, Canada
https://www.ahmedbello.com`;
          }
        } else if (isCalculator) {
          const asset = buildWelcomeActionAsset(rawSource, topic, lang);
          confirmationSubject =
            lang === "fr"
              ? `${asset.subjectPrefix} (#${referenceNo}) | Ahmed Bello`
              : `${asset.subjectPrefix} (#${referenceNo}) | Ahmed Bello`;

          if (lang === "fr") {
            confirmationBody = `Bonjour ${firstName},

Merci d'avoir utilisé les outils de planification sur ahmedbello.com.

Numéro de référence : #${referenceNo}

Votre synthèse calculée :
---------------------------------------------------------
${message}
---------------------------------------------------------

${asset.title} :
${asset.steps.map((s, idx) => `${idx + 1}. ${s}`).join("\n")}

Une simple question pour vous aider (répondez directement à ce courriel) :
${asset.replyQuestion}

Vous préférez poser une question rapide de vive voix ?
${getCtaLabel(true)} : ${siteConfig.schedulingUrl}
Téléphone direct : ${siteConfig.publicPhone} | Courriel : ${siteConfig.publicEmail}

Cordialement,
Ahmed Bello
Professionnel agréé en solutions financières
Dieppe (Nouveau-Brunswick), Canada
https://www.ahmedbello.com/fr`;
          } else {
            confirmationBody = `Hello ${firstName},

Thank you for running your numbers on ahmedbello.com.

Reference Number: #${referenceNo}

Here is the calculation & breakdown you requested:
---------------------------------------------------------
${message}
---------------------------------------------------------

${asset.title}:
${asset.steps.map((s, idx) => `${idx + 1}. ${s}`).join("\n")}

Quick question (just hit reply to this email):
${asset.replyQuestion}

Prefer to talk through one quick detail instead?
${getCtaLabel(false)}: ${siteConfig.schedulingUrl}
Direct Phone: ${siteConfig.publicPhone} | Direct Email: ${siteConfig.publicEmail}

Warm regards,
Ahmed Bello
Licensed Financial Solutions Professional
Dieppe, New Brunswick, Canada
https://www.ahmedbello.com`;
          }
        } else {
          if (lang === "fr") {
            confirmationSubject = `Confirmation : j'ai bien reçu votre message (#${referenceNo}) | Ahmed Bello`;
            confirmationBody = `Bonjour ${firstName},

Merci d'avoir écrit via ahmedbello.com. Ce message confirme la bonne réception de votre question concernant « ${topic} ».

Numéro de référence : #${referenceNo}

En attendant ma réponse personnelle :
1. Ayez sous la main vos plafonds de cotisation (Mon dossier ARC) si votre question porte sur CELI, REER ou CELIAPP.
2. Si vous le souhaitez, répondez simplement à ce courriel pour préciser votre échéancier principal (moins d'un an ou 2 à 5 ans).

Si vous préférez un échange rapide :
${getCtaLabel(true)} : ${siteConfig.schedulingUrl}
Téléphone direct : ${siteConfig.publicPhone} | Courriel : ${siteConfig.publicEmail}

Cordialement,
Ahmed Bello
Professionnel agréé en solutions financières
Dieppe (Nouveau-Brunswick), Canada
https://www.ahmedbello.com/fr`;
          } else {
            confirmationSubject = `Confirmation: I received your enquiry (#${referenceNo}) | Ahmed Bello`;
            confirmationBody = `Hello ${firstName},

Thank you for reaching out through ahmedbello.com. This confirms I have safely received your enquiry regarding ${topic}.

Reference Number: #${referenceNo}

While I review your note:
1. I personally review every message in order and reply in plain language with clear facts.
2. If you want to add one detail so my reply fits your numbers, just hit reply: are you looking at a decision in the next 12 months, or planning 2–5 years ahead?

Prefer a quick conversation instead?
${getCtaLabel(false)}: ${siteConfig.schedulingUrl}
Direct Telephone: ${siteConfig.publicPhone} | Direct Email: ${siteConfig.publicEmail}

Warm regards,
Ahmed Bello
Licensed Financial Solutions Professional
Dieppe, New Brunswick, Canada
https://www.ahmedbello.com`;
          }
        }

        const visitorRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: contactFromEmail,
            reply_to: siteConfig.publicEmail,
            to: [email],
            subject: confirmationSubject,
            text: confirmationBody,
          }),
        });
        if (!visitorRes.ok) {
          const errDetail = await visitorRes.text().catch(() => "");
          console.warn(`[VISITOR RECEIPT WARNING]: Resend returned HTTP ${visitorRes.status} ${errDetail}`);
        }
      } catch (visitorErr) {
        // Non-blocking: Primary enquiry was already handled
        console.warn(`[VISITOR RECEIPT WARNING]:`, visitorErr);
      }
    }

    if (!resendResponse.ok && !anyPersisted) {
      return {
        status: 500,
        body: {
          error: "delivery_failed",
          message:
            `Your message could not be sent right now. Please reach out directly to Ahmed Bello by phone at ${siteConfig.publicPhone} or schedule a conversation via Calendly.`,
          phone: siteConfig.publicPhone,
          calendly: siteConfig.schedulingUrl,
        },
      };
    }

    const successMessage = isNewsletter
      ? "Subscription request received. Please check your inbox for confirmation."
      : isCalculator
      ? "Your customized plan has been recorded and queued for delivery. Ahmed Bello will review your calculation details."
      : "Enquiry sent successfully. I will follow up shortly.";

    return {
      status: 200,
      body: {
        success: true,
        referenceNo,
        recorded: anyPersisted,
        queued: !resendResponse.ok && anyPersisted,
        message: successMessage,
      },
    };
  } catch (err: any) {
    if (anyPersisted) {
      if (dbRecord) {
        recordEmailDeliveryStatus({
          leadId: dbRecord.id,
          referenceNo: dbRecord.referenceNo,
          status: "failed",
          errorMessage: err?.message || "Network exception during email dispatch",
          recipients: contactToEmail,
        });
      }
      console.warn(
        `[EMAIL ALERT] Ref: #${referenceNo} | Dispatch exception. Lead safely preserved.`
      );
      return {
        status: 200,
        body: {
          success: true,
          referenceNo,
          message: isNewsletter
            ? "Subscription request received. Please check your inbox for confirmation."
            : isCalculator
            ? "Your customized plan has been recorded and queued for delivery. Ahmed Bello will review your calculation details."
            : "Enquiry sent successfully. I will follow up shortly.",
          recorded: true,
        },
      };
    }

    // Both database and email failed!
    return {
      status: 500,
      body: {
        error: "submission_failed",
        message:
          `Your message could not be sent right now. Please reach out directly to Ahmed Bello by phone at ${siteConfig.publicPhone} or schedule a conversation via Calendly.`,
        phone: siteConfig.publicPhone,
        calendly: siteConfig.schedulingUrl,
      },
    };
  }
}
