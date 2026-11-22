import React, { useState } from "react";
import { ArrowLeft, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";
import type {
  AdvisorAttestationState,
  CapturedSignature,
  DocumentSetupState,
} from "../../types/signing.ts";
import { getResolvedCarrierName } from "../../lib/pdfSigningEngine.ts";
import { SignatureCanvasPad } from "./SignatureCanvasPad.tsx";

export interface Step3AdvisorAttestationProps {
  setup: DocumentSetupState;
  attestation: AdvisorAttestationState;
  clientStrokeHashes: Set<string>;
  onUpdateAttestation: (patch: Partial<AdvisorAttestationState>) => void;
  onBack: () => void;
  onAssemblePdf: () => Promise<void>;
  isAssembling: boolean;
  isFr?: boolean;
}

export const Step3AdvisorAttestation: React.FC<Step3AdvisorAttestationProps> = ({
  setup,
  attestation,
  clientStrokeHashes,
  onUpdateAttestation,
  onBack,
  onAssemblePdf,
  isAssembling,
  isFr = false,
}) => {
  const [formError, setFormError] = useState<string | null>(null);

  const handleConfirmSignature = (sig: CapturedSignature) => {
    setFormError(null);
    onUpdateAttestation({ signature: sig });
  };

  const handleAssembleClick = async () => {
    setFormError(null);
    if (!attestation.advisorName.trim()) {
      setFormError(
        isFr
          ? "Veuillez saisir le nom complet du conseiller."
          : "Please enter the Advisor Full Name."
      );
      return;
    }
    if (!attestation.idVerifiedInPerson) {
      setFormError(
        isFr
          ? "Veuillez cocher la case confirmant la vérification en personne d'une pièce d'identité avec photo."
          : "Please confirm the In-Person Government Photo ID Verification checkbox."
      );
      return;
    }
    if (!attestation.attestationDate) {
      setFormError(
        isFr
          ? "Veuillez sélectionner la date d'attestation."
          : "Please provide the attestation date."
      );
      return;
    }
    if (!attestation.signature) {
      setFormError(
        isFr
          ? "Veuillez tracer puis confirmer la signature manuscrite du conseiller avant d'assembler le PDF."
          : "Please draw and confirm the Advisor live hand-drawn signature before assembling."
      );
      return;
    }
    await onAssemblePdf();
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="space-y-1.5 border-b border-slate-200 pb-4">
        <p className="text-xs font-medium text-slate-500">
          {getResolvedCarrierName(setup)} · {setup.formCode} · {setup.clientNames}
        </p>
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
          {isFr ? "3. Attestation facultative du conseiller" : "3. Optional Advisor Attestation"}
        </h2>
        <p className="text-sm text-slate-600">
          {isFr
            ? "Ces renseignements seront compilés sur une page d'attestation dédiée ajoutée à la fin du PDF signé."
            : "This confirmation appends a dedicated Advisor Attestation & Witness Record page to the final assembled PDF."}
        </p>
      </div>

      <section className="bg-white border border-slate-200 rounded-md p-5 sm:p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="advisor-name" className="block text-sm font-medium text-slate-800">
              {isFr ? "Nom complet du conseiller" : "Advisor Full Name"}
            </label>
            <input
              id="advisor-name"
              type="text"
              value={attestation.advisorName}
              onChange={(e) => onUpdateAttestation({ advisorName: e.target.value })}
              placeholder="e.g. Ahmed Bello"
              className="w-full min-h-[44px] px-3 py-2 text-sm bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:border-[#0f2942]"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="attestation-date" className="block text-sm font-medium text-slate-800">
              {isFr ? "Date de l'attestation" : "Attestation Date"}
            </label>
            <input
              id="attestation-date"
              type="date"
              value={attestation.attestationDate}
              onChange={(e) => onUpdateAttestation({ attestationDate: e.target.value })}
              className="w-full min-h-[44px] px-3 py-2 text-sm bg-white border border-slate-300 rounded-md text-slate-900 font-mono tabular-nums focus:outline-none focus:border-[#0f2942]"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label htmlFor="verification-method" className="block text-sm font-medium text-slate-800">
              {isFr
                ? "Note ou type de pièce vérifiée (optionnel)"
                : "Verification Method / Non-Sensitive Note (Optional)"}
            </label>
            <input
              id="verification-method"
              type="text"
              value={attestation.verificationMethod}
              onChange={(e) => onUpdateAttestation({ verificationMethod: e.target.value })}
              placeholder={
                isFr
                  ? "ex. Permis de conduire ou passeport examiné en personne"
                  : "e.g. Provincial photo ID or passport inspected in person (do not enter ID numbers)"
              }
              className="w-full min-h-[44px] px-3 py-2 text-sm bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:border-[#0f2942]"
            />
          </div>
        </div>

        <label className="min-h-[48px] flex items-start gap-3 p-4 bg-slate-50 border border-slate-200 rounded-md cursor-pointer select-none">
          <input
            type="checkbox"
            checked={attestation.idVerifiedInPerson}
            onChange={(e) => onUpdateAttestation({ idVerifiedInPerson: e.target.checked })}
            className="mt-0.5 h-5 w-5 rounded border-slate-400 text-[#0f2942] focus:ring-[#0f2942] shrink-0 cursor-pointer"
          />
          <span className="text-sm text-slate-800 leading-relaxed">
            <strong className="font-semibold text-slate-900 block">
              {isFr
                ? "Vérification en personne de la pièce d'identité avec photo"
                : "In-Person Photo Identification Verified"}
            </strong>
            <span className="text-xs text-slate-600">
              {isFr
                ? "Je confirme avoir examiné en personne une pièce d'identité gouvernementale valide avec photo du ou des signataires, et que les signatures précédentes ont été tracées en direct."
                : "I confirm that I inspected valid government-issued photo identification for the signing client(s) and witnessed the preceding live hand-drawn signatures."}
            </span>
          </span>
        </label>

        <div className="pt-2 border-t border-slate-200 space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#0f2942]" aria-hidden="true" />
            <h3 className="text-sm font-semibold text-slate-900">
              {isFr ? "Signature manuscrite du conseiller" : "Advisor Live Hand-Drawn Signature"}
            </h3>
          </div>

          <SignatureCanvasPad
            slotId="advisor-attestation-signature"
            slotLabel={isFr ? "Signature du conseiller" : "Advisor Attestation Signature"}
            pageNumber={setup.pageCount + 1}
            existingCaptured={attestation.signature}
            disallowedStrokeHashes={clientStrokeHashes}
            onConfirm={handleConfirmSignature}
            onClear={() => onUpdateAttestation({ signature: null })}
            isFr={isFr}
            confirmLabel={
              attestation.signature
                ? isFr
                  ? "Signature conseiller confirmée"
                  : "Advisor Signature Confirmed"
                : isFr
                  ? "Confirmer la signature du conseiller"
                  : "Confirm Advisor Signature"
            }
          />
        </div>
      </section>

      {formError && (
        <div
          role="alert"
          className="flex items-start gap-2.5 p-3.5 bg-rose-50 border border-rose-200 rounded-md text-sm text-rose-800"
        >
          <AlertCircle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" aria-hidden="true" />
          <span>{formError}</span>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>{isFr ? "Retour aux signatures" : "Back to Client Signatures"}</span>
        </button>

        <button
          type="button"
          onClick={handleAssembleClick}
          disabled={isAssembling}
          className="min-h-[48px] inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-md bg-[#0f2942] hover:bg-[#163859] text-white disabled:opacity-50 transition-colors whitespace-nowrap cursor-pointer"
        >
          <span>
            {isAssembling
              ? isFr
                ? "Assemblage du PDF..."
                : "Assembling Signed PDF..."
              : isFr
                ? "Générer le PDF final et l'attestation"
                : "Assemble Signed PDF & Attestation"}
          </span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};
