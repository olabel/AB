import { PDFDocument, StandardFonts, rgb, PageSizes } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import type {
  AdvisorAttestationState,
  CapturedSignature,
  DocumentSetupState,
  SignatureSlotConfig,
  StrokeComplexityReport,
  StrokePath,
} from "../types/signing.ts";

// Configure local bundled Web Worker for pdfjs-dist (no external CDN dependency)
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

export const MAX_PDF_BYTES = 25 * 1024 * 1024; // 25 MB client memory guard
export const MAX_PDF_PAGES = 150;

/**
 * Normalizes and strips characters outside WinAnsi so pdf-lib standard fonts never throw
 * when users input smart quotes, dashes, ligatures, or Unicode symbols from mobile keyboards.
 */
export function toWinAnsiSafeText(input: unknown, maxLen = 180): string {
  if (typeof input !== "string") return "";
  const normalized = input
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
    .replace(/[\u2013\u2014\u2015]/g, "-")
    .replace(/\u2026/g, "...")
    .replace(/\u00A0/g, " ")
    .replace(/\u0152/g, "OE")
    .replace(/\u0153/g, "oe")
    .replace(/\u0178/g, "Y");

  // Keep printable ASCII (0x20-0x7E) and Latin-1 printable range (0xA0-0xFF) supported by WinAnsi
  let safe = "";
  for (let i = 0; i < normalized.length && safe.length < maxLen; i++) {
    const code = normalized.charCodeAt(i);
    if ((code >= 0x20 && code <= 0x7e) || (code >= 0xa0 && code <= 0xff)) {
      safe += normalized[i];
    } else {
      const decomposed = normalized[i].normalize("NFKD").replace(/[^\x20-\x7E\xA0-\xFF]/g, "");
      safe += decomposed;
    }
  }
  return safe.trim().slice(0, maxLen);
}

/**
 * Validates raw bytes represent a plausible, bounded PDF payload (%PDF- magic header within first 1024 bytes).
 */
export function assertValidPdfBytes(pdfBytes: Uint8Array): void {
  if (!(pdfBytes instanceof Uint8Array) || pdfBytes.byteLength < 8) {
    throw new Error("Invalid PDF payload: empty or corrupt file.");
  }
  if (pdfBytes.byteLength > MAX_PDF_BYTES) {
    throw new Error("PDF exceeds the 25 MB in-browser safety limit.");
  }
  const probeLimit = Math.min(pdfBytes.byteLength, 1024);
  const headerProbe = new TextDecoder("latin1").decode(pdfBytes.subarray(0, probeLimit));
  if (!headerProbe.includes("%PDF-")) {
    throw new Error("File header is not a valid %PDF- document.");
  }
}

function assertValidPngBytes(pngBytes: Uint8Array): void {
  if (
    !(pngBytes instanceof Uint8Array) ||
    pngBytes.byteLength < 16 ||
    pngBytes[0] !== 0x89 ||
    pngBytes[1] !== 0x50 ||
    pngBytes[2] !== 0x4e ||
    pngBytes[3] !== 0x47
  ) {
    throw new Error("Invalid signature image buffer.");
  }
}

export const CARRIER_OPTIONS = [
  "Equitable Life of Canada",
  "iA Financial Group",
  "Canada Life",
  "Manulife",
  "Sun Life",
  "Empire Life",
  "Beneva",
  "Assumption Life",
  "Other",
] as const;

export function getResolvedCarrierName(setup: DocumentSetupState): string {
  if (setup.carrierPreset === "Other") {
    return setup.customCarrierName.trim() || "Unspecified Carrier";
  }
  return setup.carrierPreset;
}

/**
 * Computes client-side SHA-256 hex digest using Web Crypto API.
 */
export async function computeBytesSha256(bytes: Uint8Array): Promise<string> {
  if (typeof window !== "undefined" && window.crypto?.subtle) {
    const bufferCopy = new Uint8Array(bytes).buffer;
    const digest = await window.crypto.subtle.digest("SHA-256", bufferCopy);
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }
  // Fallback deterministic FNV-1a 256-bit style hex if subtle crypto is unavailable in a test sandbox
  let h1 = 0x811c9dc5;
  let h2 = 0x9e3779b9;
  for (let i = 0; i < bytes.length; i++) {
    h1 ^= bytes[i];
    h1 = Math.imul(h1, 0x01000193);
    h2 ^= bytes[bytes.length - 1 - i];
    h2 = Math.imul(h2, 0x85ebca6b);
  }
  return `${(h1 >>> 0).toString(16).padStart(8, "0")}${(h2 >>> 0).toString(16).padStart(8, "0")}`;
}

/**
 * Validates stroke geometry to reject accidental taps, single dots, or trivial clicks.
 */
export function analyzeSignatureComplexity(
  strokes: StrokePath[],
  reasonCopy?: {
    empty: string;
    tooShort: string;
    tooCompact: string;
  }
): StrokeComplexityReport {
  const strokeCount = strokes.length;
  let pointCount = 0;
  let pathLengthPx = 0;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const stroke of strokes) {
    const pts = stroke.points;
    pointCount += pts.length;
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      if (p.x < minX) minX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.x > maxX) maxX = p.x;
      if (p.y > maxY) maxY = p.y;
      if (i > 0) {
        const prev = pts[i - 1];
        pathLengthPx += Math.hypot(p.x - prev.x, p.y - prev.y);
      }
    }
  }

  const boundingWidthPx = Number.isFinite(maxX - minX) ? maxX - minX : 0;
  const boundingHeightPx = Number.isFinite(maxY - minY) ? maxY - minY : 0;

  if (strokeCount === 0 || pointCount < 2) {
    return {
      isValid: false,
      strokeCount,
      pointCount,
      pathLengthPx,
      boundingWidthPx,
      boundingHeightPx,
      reason:
        reasonCopy?.empty ||
        "Please draw your signature by hand across the signing line before confirming.",
    };
  }

  if (pointCount < 14 || pathLengthPx < 55) {
    return {
      isValid: false,
      strokeCount,
      pointCount,
      pathLengthPx,
      boundingWidthPx,
      boundingHeightPx,
      reason:
        reasonCopy?.tooShort ||
        "Stroke is too brief or resembles an accidental tap. Draw a complete hand-drawn signature or initials.",
    };
  }

  if (boundingWidthPx < 24 && boundingHeightPx < 18) {
    return {
      isValid: false,
      strokeCount,
      pointCount,
      pathLengthPx,
      boundingWidthPx,
      boundingHeightPx,
      reason:
        reasonCopy?.tooCompact ||
        "Signature span is too compact. Sign naturally across the line.",
    };
  }

  return {
    isValid: true,
    strokeCount,
    pointCount,
    pathLengthPx,
    boundingWidthPx,
    boundingHeightPx,
  };
}

/**
 * Generates a canonical SHA-256 fingerprint of normalized stroke paths
 * to block reusing identical signature strokes across distinct slots.
 */
export async function computeStrokeHash(strokes: StrokePath[]): Promise<string> {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const s of strokes) {
    for (const p of s.points) {
      if (p.x < minX) minX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.x > maxX) maxX = p.x;
      if (p.y > maxY) maxY = p.y;
    }
  }

  const spanX = Math.max(1, maxX - minX);
  const spanY = Math.max(1, maxY - minY);

  const canonical = strokes.map((s) =>
    s.points.map((p) => [
      Math.round(((p.x - minX) / spanX) * 100),
      Math.round(((p.y - minY) / spanY) * 100),
    ])
  );

  const encoded = new TextEncoder().encode(JSON.stringify(canonical));
  return computeBytesSha256(encoded);
}

/**
 * Inspects PDF bytes and returns page count safely.
 */
export async function inspectPdfPageCount(pdfBytes: Uint8Array): Promise<number> {
  assertValidPdfBytes(pdfBytes);
  const doc = await PDFDocument.load(pdfBytes, { ignoreEncryption: false });
  const count = doc.getPageCount();
  if (count < 1 || count > MAX_PDF_PAGES) {
    throw new Error(`PDF page count (${count}) must be between 1 and ${MAX_PDF_PAGES}.`);
  }
  return count;
}

/**
 * Renders a 1-indexed PDF page to an HTML Canvas element using pdfjs-dist.
 * Supports cancellation when switching pages rapidly and avoids eval() for strict CSP compliance.
 */
export async function renderPdfPageToCanvas(params: {
  pdfBytes: Uint8Array;
  pageNumber: number;
  canvas: HTMLCanvasElement;
  targetWidth?: number;
  signal?: AbortSignal;
}): Promise<{ width: number; height: number; pageCount: number }> {
  const { pdfBytes, pageNumber, canvas, targetWidth = 760, signal } = params;
  assertValidPdfBytes(pdfBytes);

  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(pdfBytes),
    useSystemFonts: true,
  });

  if (signal) {
    signal.addEventListener("abort", () => {
      loadingTask.destroy().catch(() => {});
    });
  }

  const pdfDoc = await loadingTask.promise;
  if (signal?.aborted) {
    await pdfDoc.cleanup();
    loadingTask.destroy().catch(() => {});
    throw new DOMException("Aborted", "AbortError");
  }

  const pageCount = pdfDoc.numPages;
  const clampedPage = Math.max(1, Math.min(pageNumber, pageCount));
  const page = await pdfDoc.getPage(clampedPage);

  const unscaledViewport = page.getViewport({ scale: 1 });
  const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
  const cssScale = targetWidth / unscaledViewport.width;
  const viewport = page.getViewport({ scale: cssScale * dpr });

  canvas.width = Math.floor(viewport.width);
  canvas.height = Math.floor(viewport.height);
  canvas.style.width = "100%";
  canvas.style.height = "auto";

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    await pdfDoc.cleanup();
    loadingTask.destroy().catch(() => {});
    throw new Error("Unable to acquire 2D canvas context for PDF rendering.");
  }

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const renderTask = page.render({
    canvasContext: ctx,
    viewport,
    canvas,
  });

  if (signal) {
    signal.addEventListener("abort", () => {
      try {
        renderTask.cancel();
      } catch {
        // Ignore abort race
      }
    });
  }

  await renderTask.promise;
  await pdfDoc.cleanup();
  loadingTask.destroy().catch(() => {});

  return {
    width: unscaledViewport.width,
    height: unscaledViewport.height,
    pageCount,
  };
}

/**
 * Generates a realistic 2-page built-in sample carrier acknowledgment & authorization PDF
 * aligned to default signature placement coordinates so advisors can test end-to-end immediately.
 */
export async function generateSampleCarrierPdf(setup: DocumentSetupState): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const navy = rgb(0.059, 0.161, 0.259); // #0f2942
  const slate900 = rgb(0.059, 0.09, 0.165); // #0f172a
  const slate600 = rgb(0.278, 0.333, 0.412); // #475569
  const slate300 = rgb(0.796, 0.835, 0.882); // #cbd5e1
  const slate100 = rgb(0.945, 0.961, 0.976); // #f1f5f9

  const carrier = toWinAnsiSafeText(getResolvedCarrierName(setup), 64) || "Carrier";
  const formCode = toWinAnsiSafeText(setup.formCode, 64) || "SAMPLE-AUTH-2026";
  const contractNo = toWinAnsiSafeText(setup.contractNumber, 48) || "Pending Issuance / New Business";
  const clients = toWinAnsiSafeText(setup.clientNames, 72) || "Alexandria Martin";

  // Page 1: Client Authorization & Delivery Confirmation
  const page1 = pdfDoc.addPage(PageSizes.Letter); // 612 x 792
  const { width: w1, height: h1 } = page1.getSize();

  page1.drawRectangle({
    x: 42,
    y: h1 - 102,
    width: w1 - 84,
    height: 62,
    color: slate100,
    borderColor: slate300,
    borderWidth: 1,
  });

  page1.drawText(carrier.toUpperCase(), {
    x: 56,
    y: h1 - 64,
    size: 11,
    font: helveticaBold,
    color: navy,
  });
  page1.drawText("CLIENT ACKNOWLEDGEMENT & AUTHORIZATION SAMPLE FORM", {
    x: 56,
    y: h1 - 84,
    size: 13,
    font: helveticaBold,
    color: slate900,
  });
  page1.drawText("Page 1 of 2", {
    x: w1 - 110,
    y: h1 - 64,
    size: 9,
    font: helvetica,
    color: slate600,
  });

  // Metadata Box
  const rows1 = [
    ["Form Code / Document:", formCode],
    ["Contract / Policy Number:", contractNo],
    ["Client Full Name(s):", clients],
    ["Session Mode:", setup.signingMode === "in-person" ? "In-Person Tablet / Stylus" : "Client Device Link"],
  ];

  let cursorY = h1 - 134;
  for (const [k, v] of rows1) {
    page1.drawText(k, { x: 46, y: cursorY, size: 10, font: helveticaBold, color: slate600 });
    page1.drawText(v, { x: 200, y: cursorY, size: 10, font: helvetica, color: slate900 });
    cursorY -= 20;
  }

  page1.drawLine({
    start: { x: 42, y: cursorY - 4 },
    end: { x: w1 - 42, y: cursorY - 4 },
    thickness: 1,
    color: slate300,
  });

  const bodyLines1 = [
    "1. Purpose of Sample Form: This test document demonstrates client hand-drawn signature placement",
    "   and vector-resolution PDF assembly inside the Client Hand-Signature & Document Assembly Tool.",
    "2. Declaration of Accuracy: The undersigned confirms that personal identification details,",
    "   beneficiary designations, and suitability disclosures reviewed with the servicing advisor",
    "   are true and complete to the best of their knowledge as of the date of signing.",
    "3. Electronic Delivery & Carrier Acceptance: Execution via direct stylus or touch capture does",
    "   not substitute for carrier-mandated DocuSign/OneSpan workflows where required by specific",
    "   insurance carriers. Final submission remains the responsibility of the licensed advisor.",
  ];

  let textY = cursorY - 30;
  for (const line of bodyLines1) {
    page1.drawText(line, { x: 46, y: textY, size: 10, font: helvetica, color: slate900 });
    textY -= 18;
  }

  // Signature Box 1 matching normalized default: x=0.08, y=0.72, w=0.44, h=0.10
  // Note: PDF coordinates start bottom-left.
  const box1X = w1 * 0.08;
  const box1W = w1 * 0.44;
  const box1H = h1 * 0.1;
  const box1Y = h1 * (1 - 0.72 - 0.1);

  page1.drawRectangle({
    x: box1X,
    y: box1Y,
    width: box1W,
    height: box1H,
    borderColor: navy,
    borderWidth: 1,
    color: rgb(0.985, 0.99, 0.996),
  });
  page1.drawText("SIGN HERE - CLIENT PRIMARY SIGNATURE", {
    x: box1X + 8,
    y: box1Y - 14,
    size: 8.5,
    font: helveticaBold,
    color: slate600,
  });

  // Page 2: Disclosure Review & Initials Confirmation
  const page2 = pdfDoc.addPage(PageSizes.Letter);
  const { width: w2, height: h2 } = page2.getSize();

  page2.drawText(carrier.toUpperCase(), {
    x: 46,
    y: h2 - 58,
    size: 10,
    font: helveticaBold,
    color: navy,
  });
  page2.drawText("ILLUSTRATION & FEE DISCLOSURE ACKNOWLEDGEMENT", {
    x: 46,
    y: h2 - 78,
    size: 13,
    font: helveticaBold,
    color: slate900,
  });
  page2.drawText("Page 2 of 2", {
    x: w2 - 110,
    y: h2 - 58,
    size: 9,
    font: helvetica,
    color: slate600,
  });

  page2.drawLine({
    start: { x: 42, y: h2 - 92 },
    end: { x: w2 - 42, y: h2 - 92 },
    thickness: 1,
    color: slate300,
  });

  const bodyLines2 = [
    "Section A - Non-Guaranteed Values & Illustration Assumptions",
    "The applicant acknowledges having reviewed policy illustration scenarios showing both",
    "guaranteed values and current non-guaranteed assumptions. Future dividend scales or",
    "segregated fund market returns may vary based on carrier experience.",
    "",
    "Section B - Compensation & Conflict Disclosure",
    "The applicant acknowledges receipt of plain-language advisor compensation disclosure",
    "confirming commission structure, trailer options, or deferred sales charge schedules",
    "prior to contract placement.",
    "",
    "Section C - Privacy & Confidentiality Consent",
    "No copies of raw stylus stroke payloads or personally identifiable information are stored",
    "on external third-party servers by this client-side document assembly utility.",
  ];

  let y2 = h2 - 124;
  for (const line of bodyLines2) {
    const isHeading = line.startsWith("Section ");
    page2.drawText(line, {
      x: 46,
      y: y2,
      size: isHeading ? 10.5 : 10,
      font: isHeading ? helveticaBold : helvetica,
      color: isHeading ? navy : slate900,
    });
    y2 -= 19;
  }

  // Initials Box matching normalized default: x=0.60, y=0.72, w=0.30, h=0.09
  const box2X = w2 * 0.6;
  const box2W = w2 * 0.3;
  const box2H = h2 * 0.09;
  const box2Y = h2 * (1 - 0.72 - 0.09);

  page2.drawRectangle({
    x: box2X,
    y: box2Y,
    width: box2W,
    height: box2H,
    borderColor: navy,
    borderWidth: 1,
    color: rgb(0.985, 0.99, 0.996),
  });
  page2.drawText("INITIAL / CONFIRM HERE", {
    x: box2X + 8,
    y: box2Y - 14,
    size: 8.5,
    font: helveticaBold,
    color: slate600,
  });

  return pdfDoc.save();
}

/**
 * Stamps all confirmed client signatures onto target PDF pages and optionally appends
 * a generated Advisor Attestation & Signing Record page using pdf-lib.
 */
export async function assembleSignedPdf(params: {
  basePdfBytes: Uint8Array;
  setup: DocumentSetupState;
  slots: SignatureSlotConfig[];
  capturedBySlot: Record<string, CapturedSignature>;
  attestation: AdvisorAttestationState;
}): Promise<{
  pdfBytes: Uint8Array;
  sha256Hex: string;
  totalPages: number;
  fileName: string;
}> {
  const { basePdfBytes, setup, slots, capturedBySlot, attestation } = params;

  assertValidPdfBytes(basePdfBytes);
  const pdfDoc = await PDFDocument.load(basePdfBytes, { ignoreEncryption: false });
  const pages = pdfDoc.getPages();
  if (pages.length < 1 || pages.length > MAX_PDF_PAGES) {
    throw new Error("Base PDF page count is outside safe processing bounds.");
  }

  for (const slot of slots) {
    const captured = capturedBySlot[slot.id];
    if (!captured) continue;
    assertValidPngBytes(captured.pngBytes);

    const safePageNum = Number.isFinite(slot.pageNumber) ? Math.round(slot.pageNumber) : 1;
    const targetIndex = Math.max(0, Math.min(safePageNum - 1, pages.length - 1));
    const page = pages[targetIndex];
    const { width: pageW, height: pageH } = page.getSize();

    const embeddedPng = await pdfDoc.embedPng(captured.pngBytes);

    const safeW = Number.isFinite(slot.width) ? Math.max(0.04, Math.min(0.95, slot.width)) : 0.35;
    const safeH = Number.isFinite(slot.height) ? Math.max(0.03, Math.min(0.6, slot.height)) : 0.08;
    const safeX = Number.isFinite(slot.x) ? Math.max(0, Math.min(1 - safeW, slot.x)) : 0.08;
    const safeY = Number.isFinite(slot.y) ? Math.max(0, Math.min(1 - safeH, slot.y)) : 0.72;

    const boxX = safeX * pageW;
    const boxW = safeW * pageW;
    const boxH = safeH * pageH;
    // PDF origin is bottom-left; slot.y is measured from top edge
    const boxY = pageH - (safeY + safeH) * pageH;

    // Fit PNG proportionally inside the target signature box
    const imgDims = embeddedPng.scale(1);
    const scale = Math.min(boxW / imgDims.width, boxH / imgDims.height);
    const drawW = imgDims.width * scale;
    const drawH = imgDims.height * scale;
    const drawX = boxX + (boxW - drawW) / 2;
    const drawY = boxY + (boxH - drawH) / 2;

    page.drawImage(embeddedPng, {
      x: drawX,
      y: drawY,
      width: drawW,
      height: drawH,
    });
  }

  // Optional Advisor Attestation Page
  if (setup.includeAdvisorAttestation && attestation.signature) {
    const attPage = pdfDoc.addPage(PageSizes.Letter);
    const { width: aw, height: ah } = attPage.getSize();
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const navy = rgb(0.059, 0.161, 0.259);
    const slate900 = rgb(0.059, 0.09, 0.165);
    const slate600 = rgb(0.278, 0.333, 0.412);
    const slate200 = rgb(0.886, 0.91, 0.941);
    const slate50 = rgb(0.973, 0.98, 0.988);

    attPage.drawRectangle({
      x: 44,
      y: ah - 96,
      width: aw - 88,
      height: 54,
      color: navy,
    });

    attPage.drawText("ADVISOR ATTESTATION & WITNESS RECORD", {
      x: 58,
      y: ah - 67,
      size: 13,
      font: fontBold,
      color: rgb(1, 1, 1),
    });
    attPage.drawText("Hand-Drawn Electronic Signature Verification Supplement", {
      x: 58,
      y: ah - 84,
      size: 9,
      font: fontRegular,
      color: rgb(0.84, 0.89, 0.95),
    });

    // Document Summary Table
    let y = ah - 126;
    attPage.drawText("1. Document & Client Summary", {
      x: 44,
      y,
      size: 11,
      font: fontBold,
      color: navy,
    });
    y -= 18;

    const summaryPairs: [string, string][] = [
      ["Carrier / Institution:", toWinAnsiSafeText(getResolvedCarrierName(setup), 72)],
      ["Form Code / Document Name:", toWinAnsiSafeText(setup.formCode, 72) || "Untitled Form"],
      ["Contract / Policy Number:", toWinAnsiSafeText(setup.contractNumber, 48) || "Not Provided"],
      ["Client Full Name(s):", toWinAnsiSafeText(setup.clientNames, 72) || "Not Provided"],
      [
        "Signing Workflow Mode:",
        setup.signingMode === "in-person" ? "In-Person Tablet / Stylus" : "Client Device Link",
      ],
      ["Base Document Source:", toWinAnsiSafeText(setup.pdfFileName, 72) || "Client Uploaded PDF"],
    ];

    for (const [label, value] of summaryPairs) {
      attPage.drawText(label, { x: 48, y, size: 9.5, font: fontBold, color: slate600 });
      attPage.drawText(value.slice(0, 72), { x: 215, y, size: 9.5, font: fontRegular, color: slate900 });
      y -= 17;
    }

    y -= 10;
    attPage.drawLine({ start: { x: 44, y }, end: { x: aw - 44, y }, thickness: 1, color: slate200 });
    y -= 24;

    // Captured Slot Audit Log
    attPage.drawText("2. Captured Client Signature Slots", {
      x: 44,
      y,
      size: 11,
      font: fontBold,
      color: navy,
    });
    y -= 18;

    attPage.drawRectangle({
      x: 44,
      y: y - 4,
      width: aw - 88,
      height: 18,
      color: slate50,
      borderColor: slate200,
      borderWidth: 0.75,
    });
    attPage.drawText("Slot Label", { x: 50, y, size: 8.5, font: fontBold, color: slate600 });
    attPage.drawText("Page", { x: 242, y, size: 8.5, font: fontBold, color: slate600 });
    attPage.drawText("Input", { x: 280, y, size: 8.5, font: fontBold, color: slate600 });
    attPage.drawText("Timestamp (UTC)", { x: 326, y, size: 8.5, font: fontBold, color: slate600 });
    attPage.drawText("Stroke Hash (Prefix)", { x: 448, y, size: 8.5, font: fontBold, color: slate600 });
    y -= 20;

    for (const slot of slots) {
      if (y < 230) break;
      const cap = capturedBySlot[slot.id];
      if (!cap) continue;
      attPage.drawText(toWinAnsiSafeText(slot.label, 36) || "Signature Slot", { x: 50, y, size: 8.5, font: fontRegular, color: slate900 });
      attPage.drawText(`p. ${slot.pageNumber}`, { x: 242, y, size: 8.5, font: fontRegular, color: slate900 });
      attPage.drawText(toWinAnsiSafeText(cap.pointerType.toUpperCase(), 12), { x: 280, y, size: 8.5, font: fontRegular, color: slate900 });
      attPage.drawText(toWinAnsiSafeText(cap.capturedAtIso.replace("T", " ").slice(0, 19), 24), {
        x: 326,
        y,
        size: 8.5,
        font: fontRegular,
        color: slate600,
      });
      attPage.drawText(toWinAnsiSafeText(cap.strokeHash.slice(0, 14), 16), {
        x: 448,
        y,
        size: 8.5,
        font: fontRegular,
        color: slate600,
      });
      y -= 16;
    }

    y -= 12;
    attPage.drawLine({ start: { x: 44, y }, end: { x: aw - 44, y }, thickness: 1, color: slate200 });
    y -= 24;

    // Advisor Verification Statement
    attPage.drawText("3. Advisor Attestation & Identity Verification", {
      x: 44,
      y,
      size: 11,
      font: fontBold,
      color: navy,
    });
    y -= 20;

    const idBadge = attestation.idVerifiedInPerson
      ? "[VERIFIED] Government-issued photo identification was examined in person."
      : "[NOT CHECKED] In-person photo ID checkbox not selected.";

    attPage.drawText(idBadge, {
      x: 48,
      y,
      size: 9.5,
      font: fontBold,
      color: slate900,
    });
    y -= 18;

    const safeNote = toWinAnsiSafeText(attestation.verificationMethod, 82);
    const stmtLines = [
      "I attest that the client hand-drawn signatures affixed to the preceding pages were executed",
      "live using touch or stylus input without typed font substitution or pasted signature images.",
      safeNote ? `Verification Notes: ${safeNote}` : "",
    ].filter(Boolean);

    for (const line of stmtLines) {
      attPage.drawText(line, { x: 48, y, size: 9.5, font: fontRegular, color: slate600 });
      y -= 16;
    }

    y -= 8;
    attPage.drawText(`Advisor Name: ${toWinAnsiSafeText(attestation.advisorName, 64) || "Not Provided"}`, {
      x: 48,
      y,
      size: 10,
      font: fontBold,
      color: slate900,
    });
    attPage.drawText(`Attestation Date: ${toWinAnsiSafeText(attestation.attestationDate, 24) || "Not Provided"}`, {
      x: 340,
      y,
      size: 10,
      font: fontBold,
      color: slate900,
    });
    y -= 14;

    // Advisor Signature Box
    const sigBoxH = 74;
    const sigBoxW = 280;
    const sigBoxY = Math.max(84, y - sigBoxH - 6);

    attPage.drawRectangle({
      x: 48,
      y: sigBoxY,
      width: sigBoxW,
      height: sigBoxH,
      color: slate50,
      borderColor: navy,
      borderWidth: 1,
    });

    assertValidPngBytes(attestation.signature.pngBytes);
    const advPng = await pdfDoc.embedPng(attestation.signature.pngBytes);
    const advDims = advPng.scale(1);
    const advScale = Math.min((sigBoxW - 16) / advDims.width, (sigBoxH - 12) / advDims.height);
    attPage.drawImage(advPng, {
      x: 48 + (sigBoxW - advDims.width * advScale) / 2,
      y: sigBoxY + (sigBoxH - advDims.height * advScale) / 2,
      width: advDims.width * advScale,
      height: advDims.height * advScale,
    });

    attPage.drawText("Live Advisor Signature (Hand-Drawn)", {
      x: 48,
      y: sigBoxY - 14,
      size: 8.5,
      font: fontRegular,
      color: slate600,
    });

    attPage.drawText(
      `Stroke Input: ${attestation.signature.pointerType.toUpperCase()}  |  Hash: ${attestation.signature.strokeHash.slice(0, 16)}`,
      {
        x: 344,
        y: sigBoxY + 26,
        size: 8.5,
        font: fontRegular,
        color: slate600,
      }
    );

    // Compliance Footer
    attPage.drawText(
      "Compliance Notice: Carrier rules differ for stylus-signed forms vs. wet-ink vs. DocuSign/OneSpan. Advisor retains submission responsibility.",
      {
        x: 44,
        y: 36,
        size: 8,
        font: fontRegular,
        color: slate600,
      }
    );
  }

  const outBytes = await pdfDoc.save();
  const sha256Hex = await computeBytesSha256(outBytes);
  const totalPages = pdfDoc.getPageCount();

  const safeCarrier =
    toWinAnsiSafeText(getResolvedCarrierName(setup), 48)
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "Carrier";
  const safeForm =
    toWinAnsiSafeText(setup.formCode, 48)
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "Document";
  const fileName = `${safeCarrier}-${safeForm}-Signed.pdf`;

  return {
    pdfBytes: outBytes,
    sha256Hex,
    totalPages,
    fileName,
  };
}
