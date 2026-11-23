import React, { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Circle, SkipForward } from "lucide-react";
import type {
  CapturedSignature,
  DocumentSetupState,
  SignatureSlotConfig,
} from "../../types/signing.ts";
import { getResolvedCarrierName } from "../../lib/pdfSigningEngine.ts";
import { PdfPagePreview } from "./PdfPagePreview.tsx";
import { SignatureCanvasPad } from "./SignatureCanvasPad.tsx";

export interface Step2ClientSigningProps {
  setup: DocumentSetupState;
  slots: SignatureSlotConfig[];
  basePdfBytes: Uint8Array;
  capturedBySlot: Record<string, CapturedSignature>;
  onConfirmSlotSignature: (slotId: string, captured: CapturedSignature) => void;
  onClearSlotSignature: (slotId: string) => void;
  onBack: () => void;
  onFinishSigning: () => void;
  isFr?: boolean;
}

export const Step2ClientSigning: React.FC<Step2ClientSigningProps> = ({
  setup,
  slots,
  basePdfBytes,
  capturedBySlot,
  onConfirmSlotSignature,
  onClearSlotSignature,
  onBack,
  onFinishSigning,
  isFr = false,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const safeIndex = Math.min(activeIndex, Math.max(0, slots.length - 1));
  const currentSlot = slots[safeIndex];

  const requiredSlots = slots.filter((s) => !s.optional);
  const optionalSlots = slots.filter((s) => Boolean(s.optional));
  const confirmedRequiredCount = requiredSlots.filter((s) => Boolean(capturedBySlot[s.id])).length;
  const confirmedOptionalCount = optionalSlots.filter((s) => Boolean(capturedBySlot[s.id])).length;

  const allRequiredConfirmed = requiredSlots.every((s) => Boolean(capturedBySlot[s.id]));
  const hasAtLeastOneSignature = slots.some((s) => Boolean(capturedBySlot[s.id]));
  const canProceed = allRequiredConfirmed && hasAtLeastOneSignature;

  // Prevent reusing any stroke hash already confirmed on a DIFFERENT slot
  const otherSlotHashes = new Set<string>(
    slots
      .filter((s) => s.id !== currentSlot?.id)
      .map((s) => capturedBySlot[s.id]?.strokeHash)
      .filter((h): h is string => Boolean(h))
  );

  const advanceToNextUnsigned = (excludeId: string) => {
    const nextUnsignedAfter = slots.findIndex(
      (s, idx) => idx > safeIndex && s.id !== excludeId && !capturedBySlot[s.id]
    );
    if (nextUnsignedAfter !== -1) {
      setActiveIndex(nextUnsignedAfter);
      return true;
    }
    const anyUnsignedRequired = slots.findIndex(
      (s) => s.id !== excludeId && !s.optional && !capturedBySlot[s.id]
    );
    if (anyUnsignedRequired !== -1) {
      setActiveIndex(anyUnsignedRequired);
      return true;
    }
    const anyUnsignedOther = slots.findIndex(
      (s) => s.id !== excludeId && !capturedBySlot[s.id]
    );
    if (anyUnsignedOther !== -1) {
      setActiveIndex(anyUnsignedOther);
      return true;
    }
    return false;
  };

  const handleConfirm = (captured: CapturedSignature) => {
    onConfirmSlotSignature(currentSlot.id, captured);
    advanceToNextUnsigned(currentSlot.id);
  };

  const handleSkipOptional = () => {
    if (!currentSlot?.optional) return;
    const nextRequired = slots.findIndex(
      (s) => s.id !== currentSlot.id && !s.optional && !capturedBySlot[s.id]
    );
    if (nextRequired !== -1) {
      setActiveIndex(nextRequired);
      return;
    }
    const nextOtherOptional = slots.findIndex(
      (s, idx) => idx > safeIndex && s.id !== currentSlot.id && !capturedBySlot[s.id]
    );
    if (nextOtherOptional !== -1) {
      setActiveIndex(nextOtherOptional);
      return;
    }
    if (canProceed) {
      onFinishSigning();
    }
  };

  if (!currentSlot) return null;

  const targetPage = Math.max(1, Math.min(currentSlot.pageNumber, setup.pageCount || 1));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="space-y-1">
          <p className="text-xs font-medium text-slate-500">
            {getResolvedCarrierName(setup)} · {setup.formCode} · {setup.clientNames}
          </p>
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
            {isFr ? "2. Signature manuscrite du client" : "2. Hand-Drawn Client Signature Capture"}
          </h2>
        </div>

        <div className="text-xs font-mono tabular-nums text-slate-600">
          {requiredSlots.length > 0 ? (
            <>
              {confirmedRequiredCount} / {requiredSlots.length}{" "}
              {isFr ? "requises confirmées" : "required confirmed"}
              {optionalSlots.length > 0 && (
                <>
                  {" · "}
                  {confirmedOptionalCount} / {optionalSlots.length}{" "}
                  {isFr ? "facultatives" : "optional"}
                </>
              )}
            </>
          ) : (
            <>
              {Object.keys(capturedBySlot).length} / {slots.length}{" "}
              {isFr ? "confirmées" : "slots confirmed"}
            </>
          )}
        </div>
      </div>

      {/* Slot Selector Strip */}
      <div className="flex flex-wrap gap-2">
        {slots.map((slot, idx) => {
          const done = Boolean(capturedBySlot[slot.id]);
          const isCurrent = idx === safeIndex;
          return (
            <button
              key={slot.id}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`min-h-[44px] inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                isCurrent
                  ? "bg-[#0f2942] text-white border-[#0f2942]"
                  : done
                    ? "bg-white text-emerald-800 border-emerald-300 hover:bg-emerald-50"
                    : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
              }`}
            >
              {done ? (
                <CheckCircle2
                  className={`w-4 h-4 shrink-0 ${isCurrent ? "text-emerald-300" : "text-emerald-700"}`}
                  aria-hidden="true"
                />
              ) : (
                <Circle
                  className={`w-4 h-4 shrink-0 ${isCurrent ? "text-slate-300" : "text-slate-400"}`}
                  aria-hidden="true"
                />
              )}
              <span>
                {idx + 1}. {slot.label}
                {slot.optional ? (isFr ? " (Facultatif)" : " (Optional)") : ""}
              </span>
              <span className="opacity-70 font-mono tabular-nums text-xs">
                p.{slot.pageNumber}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Target PDF Page Context */}
        <div className="lg:col-span-6 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span className="font-semibold text-slate-900 uppercase tracking-wider">
              {isFr ? `Page ${targetPage} du document` : `Document Context (Page ${targetPage})`}
            </span>
            <span>
              {isFr
                ? "Zone encadrée en bleu marine = signature active"
                : "Highlighted navy box marks active slot placement"}
            </span>
          </div>
          <PdfPagePreview
            pdfBytes={basePdfBytes}
            pageNumber={targetPage}
            slotsOnPage={slots.filter((s) => s.pageNumber === targetPage)}
            activeSlotId={currentSlot.id}
            capturedBySlot={capturedBySlot}
            isFr={isFr}
          />
        </div>

        {/* Live Signature Capture Canvas */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-md p-5 sm:p-6 space-y-5 lg:sticky lg:top-24">
          <div className="space-y-1">
            <p className="text-xs font-mono text-slate-500 tabular-nums">
              {isFr
                ? `Champ ${safeIndex + 1} sur ${slots.length} · Page ${targetPage}`
                : `Slot ${safeIndex + 1} of ${slots.length} · Page ${targetPage}`}
              {currentSlot.optional && (
                <span className="ml-2 font-sans font-semibold text-slate-600">
                  {isFr ? "· Facultatif (peut être ignoré)" : "· Optional (skip if not applicable)"}
                </span>
              )}
            </p>
            <h3 className="text-lg font-semibold text-slate-900">{currentSlot.label}</h3>
            <p className="text-xs text-slate-600">
              {currentSlot.optional
                ? isFr
                  ? "Apposez les initiales à la main ci-dessous si nécessaires, ou passez directement à l'étape finale."
                  : "Draw hand initials below if needed for this form, or skip directly to final PDF assembly."
                : isFr
                  ? "Signez directement avec votre doigt ou stylet dans le cadre ci-dessous."
                  : "Draw your signature directly inside the signing box below using stylus or touch."}
            </p>
          </div>

          <SignatureCanvasPad
            key={currentSlot.id}
            slotId={currentSlot.id}
            slotLabel={currentSlot.label}
            pageNumber={targetPage}
            existingCaptured={capturedBySlot[currentSlot.id] || null}
            disallowedStrokeHashes={otherSlotHashes}
            onConfirm={handleConfirm}
            onClear={() => onClearSlotSignature(currentSlot.id)}
            isFr={isFr}
          />

          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onBack}
              className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>{isFr ? "Retour à la configuration" : "Back to Setup"}</span>
            </button>

            <div className="flex flex-wrap items-center gap-2">
              {currentSlot.optional && !capturedBySlot[currentSlot.id] && (
                <button
                  type="button"
                  onClick={handleSkipOptional}
                  className="min-h-[44px] inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 transition-colors whitespace-nowrap cursor-pointer"
                >
                  <SkipForward className="w-4 h-4" aria-hidden="true" />
                  <span>{isFr ? "Passer (facultatif)" : "Skip Optional Slot"}</span>
                </button>
              )}

              <button
                type="button"
                onClick={onFinishSigning}
                disabled={!canProceed}
                className="min-h-[48px] inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-md bg-[#0f2942] hover:bg-[#163859] text-white disabled:opacity-45 disabled:pointer-events-none transition-colors whitespace-nowrap cursor-pointer"
              >
                <span>
                  {setup.includeAdvisorAttestation
                    ? isFr
                      ? "Continuer vers l'attestation du conseiller"
                      : "Continue to Advisor Attestation"
                    : isFr
                      ? "Assembler le PDF final"
                      : "Assemble Final Signed PDF"}
                </span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
