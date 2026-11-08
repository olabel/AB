import fs from "fs";
import path from "path";
import crypto from "crypto";
// Use node:sqlite DatabaseSync (Node 22 built-in SQLite engine)
import { DatabaseSync } from "node:sqlite";

export interface LeadRecord {
  id: string;
  referenceNo: string;
  topic: string;
  firstName: string;
  email: string;
  phone?: string;
  province?: string;
  message?: string;
  consentPrivacy: boolean;
  consentEducational: boolean;
  ip?: string;
  turnstileToken?: string;
  emailStatus: "pending" | "delivered" | "failed" | "offline_saved";
  emailError?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmailAlert {
  id: string;
  leadId: string;
  referenceNo: string;
  recipient: string;
  errorMessage: string;
  createdAt: string;
}

let dbInstance: DatabaseSync | null = null;
let activeDbPath = "";

function initDatabase(): DatabaseSync {
  if (dbInstance) return dbInstance;

  // Use ephemeral /tmp path or in-memory database to prevent writing to Git repository or read-only serverless filesystems
  const dbPath = path.join("/tmp", "leads_ephemeral.db");

  try {
    const db = new DatabaseSync(dbPath);
    db.exec(`
      CREATE TABLE IF NOT EXISTS leads (
        id TEXT PRIMARY KEY,
        reference_no TEXT UNIQUE NOT NULL,
        topic TEXT NOT NULL,
        first_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        province TEXT,
        message TEXT,
        consent_privacy INTEGER NOT NULL DEFAULT 1,
        consent_educational INTEGER NOT NULL DEFAULT 0,
        ip TEXT,
        email_status TEXT NOT NULL DEFAULT 'pending',
        email_error TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS email_alerts (
        id TEXT PRIMARY KEY,
        lead_id TEXT NOT NULL,
        reference_no TEXT NOT NULL,
        recipient TEXT NOT NULL,
        error_message TEXT NOT NULL,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS subscribers (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        confirmed_at TEXT NOT NULL,
        consent_wording TEXT NOT NULL,
        ip TEXT NOT NULL,
        user_agent TEXT,
        source TEXT NOT NULL,
        created_at TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_leads_ref ON leads(reference_no);
      CREATE INDEX IF NOT EXISTS idx_alerts_ref ON email_alerts(reference_no);
      CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);
    `);

    dbInstance = db;
    activeDbPath = dbPath;
    return db;
  } catch (err) {
    // Fallback to /tmp if primary path failed
    const fallbackPath = path.join("/tmp", "leads.db");
    const fallbackDb = new DatabaseSync(fallbackPath);
    fallbackDb.exec(`
      CREATE TABLE IF NOT EXISTS leads (
        id TEXT PRIMARY KEY,
        reference_no TEXT UNIQUE NOT NULL,
        topic TEXT NOT NULL,
        first_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        province TEXT,
        message TEXT,
        consent_privacy INTEGER NOT NULL DEFAULT 1,
        consent_educational INTEGER NOT NULL DEFAULT 0,
        ip TEXT,
        email_status TEXT NOT NULL DEFAULT 'pending',
        email_error TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS email_alerts (
        id TEXT PRIMARY KEY,
        lead_id TEXT NOT NULL,
        reference_no TEXT NOT NULL,
        recipient TEXT NOT NULL,
        error_message TEXT NOT NULL,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS subscribers (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        confirmed_at TEXT NOT NULL,
        consent_wording TEXT NOT NULL,
        ip TEXT NOT NULL,
        user_agent TEXT,
        source TEXT NOT NULL,
        created_at TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_subscribers_fallback ON subscribers(email);
    `);

    dbInstance = fallbackDb;
    activeDbPath = fallbackPath;
    return fallbackDb;
  }
}

/**
 * Record a double opt-in confirmed subscriber with CASL compliance audit proof
 */
export function recordSubscriberToDatabase(params: {
  email: string;
  confirmedAt: string;
  consentWording: string;
  ip: string;
  userAgent?: string;
  source?: string;
}): boolean {
  try {
    const db = initDatabase();
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const upsertStmt = db.prepare(`
      INSERT INTO subscribers (
        id,
        email,
        confirmed_at,
        consent_wording,
        ip,
        user_agent,
        source,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(email) DO UPDATE SET
        confirmed_at = excluded.confirmed_at,
        consent_wording = excluded.consent_wording,
        ip = excluded.ip,
        user_agent = excluded.user_agent,
        source = excluded.source;
    `);

    upsertStmt.run(
      id,
      params.email.toLowerCase().trim(),
      params.confirmedAt,
      params.consentWording,
      params.ip,
      params.userAgent || null,
      params.source || "double_opt_in",
      now
    );
    return true;
  } catch (err) {
    console.warn("[DB ERROR] Failed to record subscriber in SQLite:", err);
    return false;
  }
}

/**
 * Generate a clean human-readable reference number (e.g. REF-7E2A9)
 */
export function generateReferenceNo(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  const randomBytes = crypto.randomBytes(5);
  for (let i = 0; i < 5; i++) {
    code += chars[randomBytes[i] % chars.length];
  }
  return `REF-${code}`;
}

/**
 * Save lead synchronously to SQLite database first before any external network dispatch.
 * Throws an Error if database write fails.
 */
export function saveLeadToDatabase(data: {
  topic: string;
  firstName: string;
  email: string;
  phone?: string;
  province?: string;
  message?: string;
  consentPrivacy: boolean;
  consentEducational: boolean;
  ip?: string;
}): { id: string; referenceNo: string } {
  const db = initDatabase();
  const id = crypto.randomUUID();
  const referenceNo = generateReferenceNo();
  const now = new Date().toISOString();

  const insertStmt = db.prepare(`
    INSERT INTO leads (
      id,
      reference_no,
      topic,
      first_name,
      email,
      phone,
      province,
      message,
      consent_privacy,
      consent_educational,
      ip,
      email_status,
      created_at,
      updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)
  `);

  insertStmt.run(
    id,
    referenceNo,
    data.topic,
    data.firstName,
    data.email,
    data.phone || null,
    data.province || null,
    data.message || null,
    data.consentPrivacy ? 1 : 0,
    data.consentEducational ? 1 : 0,
    data.ip || null,
    now,
    now
  );

  return { id, referenceNo };
}

/**
 * Record email delivery outcome. If delivery failed, also inserts an email alert record.
 */
export function recordEmailDeliveryStatus(params: {
  leadId: string;
  referenceNo: string;
  status: "delivered" | "failed" | "offline_saved";
  errorMessage?: string;
  recipients?: string;
}): void {
  try {
    const db = initDatabase();
    const now = new Date().toISOString();

    const updateStmt = db.prepare(`
      UPDATE leads
      SET email_status = ?, email_error = ?, updated_at = ?
      WHERE id = ?
    `);

    updateStmt.run(
      params.status,
      params.errorMessage || null,
      now,
      params.leadId
    );

    if (params.status === "failed") {
      const alertId = crypto.randomUUID();
      const alertStmt = db.prepare(`
        INSERT INTO email_alerts (
          id,
          lead_id,
          reference_no,
          recipient,
          error_message,
          created_at
        ) VALUES (?, ?, ?, ?, ?, ?)
      `);

      alertStmt.run(
        alertId,
        params.leadId,
        params.referenceNo,
        params.recipients || "default",
        params.errorMessage || "Unknown email delivery failure",
        now
      );
    }
  } catch (err) {
    // Non-blocking in ephemeral runners
  }
}

/**
 * Return all recorded email alerts for administrative visibility.
 */
export function getEmailAlerts(): EmailAlert[] {
  try {
    const db = initDatabase();
    const stmt = db.prepare("SELECT * FROM email_alerts ORDER BY created_at DESC LIMIT 50");
    const rows = stmt.all() as any[];
    return rows.map((r) => ({
      id: r.id,
      leadId: r.lead_id,
      referenceNo: r.reference_no,
      recipient: r.recipient,
      errorMessage: r.error_message,
      createdAt: r.created_at,
    }));
  } catch {
    return [];
  }
}

export function getActiveDbPath(): string {
  if (!activeDbPath) initDatabase();
  return activeDbPath;
}
