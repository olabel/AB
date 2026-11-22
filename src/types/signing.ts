export type CarrierPreset =
  | "Equitable Life of Canada"
  | "iA Financial Group"
  | "Canada Life"
  | "Manulife"
  | "Sun Life"
  | "Empire Life"
  | "Beneva"
  | "Assumption Life"
  | "Other";

export type SigningMode = "in-person" | "client-link";

export type PointerInputType = "pen" | "touch" | "mouse" | "unknown";

export type WorkflowStep = "setup" | "sign" | "attestation" | "output";

export interface StrokePoint {
  x: number;
  y: number;
  pressure: number;
  t: number;
}

export interface StrokePath {
  points: StrokePoint[];
  pointerType: PointerInputType;
}

export interface SignatureSlotConfig {
  id: string;
  label: string;
  pageNumber: number; // 1-indexed
  /** Normalized coordinates (0.0 to 1.0 relative to top-left of target page) */
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CapturedSignature {
  slotId: string;
  slotLabel: string;
  pageNumber: number;
  pngBytes: Uint8Array;
  previewDataUrl: string;
  pointerType: PointerInputType;
  strokeHash: string;
  capturedAtIso: string;
  strokeCount: number;
  pointCount: number;
  pathLengthPx: number;
}

export interface DocumentSetupState {
  carrierPreset: CarrierPreset;
  customCarrierName: string;
  formCode: string;
  contractNumber: string;
  clientNames: string;
  signingMode: SigningMode;
  includeAdvisorAttestation: boolean;
  pdfSource: "none" | "uploaded" | "sample";
  pdfFileName: string;
  pageCount: number;
}

export interface AdvisorAttestationState {
  advisorName: string;
  idVerifiedInPerson: boolean;
  attestationDate: string;
  verificationMethod: string;
  signature: CapturedSignature | null;
}

export interface AssemblyResult {
  pdfBytes: Uint8Array;
  blobUrl: string;
  fileName: string;
  sha256Hex: string;
  totalPages: number;
  assembledAtIso: string;
}

export interface StrokeComplexityReport {
  isValid: boolean;
  strokeCount: number;
  pointCount: number;
  pathLengthPx: number;
  boundingWidthPx: number;
  boundingHeightPx: number;
  reason?: string;
}
