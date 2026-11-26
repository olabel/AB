import React, { useState } from "react";
import {
  Download,
  Copy,
  Check,
  Trash2,
  ShieldAlert,
  Lock,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import type { AssemblyResult, DocumentSetupState } from "../../types/signing.ts";
import { getResolvedCarrierName } from "../../lib/pdfSigningEngine.ts";
import { PdfPagePreview } from "./PdfPagePreview.tsx";

export interface Step4FinalOutputProps {
  setup: DocumentSetupState;
  result: AssemblyResult;
  onBack: () => void;
  onWipeSession: () => void;
  isFr?: boolean;
}

export const Step4FinalOutput: React.FC<Step4FinalOutputProps> = ({
  setup,
  result,
  onBack,
  onWipeSession,
  isFr = false,
}) => {
  const [copiedHash, setCopiedHash] = useState(false);
  const [previewPage, setPreviewPage] = useState(1);

  const handleCopyChecksum = async () => {
    const markCopied = () => {
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2500);
    };
    const fallbackCopy = () => {
      try {
        const ta = document.createElement("textarea");
        ta.value = result.sha256Hex;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        markCopied();
      } catch {
        // Clipboard unavailable in current context
      }
    };
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(result.sha256Hex).then(markCopied).catch(fallbackCopy);
    } else {
      fallbackCopy();
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="space-y-1">
          <p className="text-xs font-medium text-emerald-700">
            {isFr ? "Assemblage client terminé" : "Client-side PDF assembly complete"} ·{" "}
            {result.totalPages} {result.totalPages === 1 ? "page" : "pages"}
          </p>
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
            {isFr ? "4. Document final et contrôles de confidentialité" : "4. Final Document & Security Controls"}
          </h2>
        </div>

        <button
          type="button"
          onClick={onWipeSession}
          className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md border border-rose-300 bg-white text-rose-800 hover:bg-rose-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Trash2 className="w-4 h-4" aria-hidden="true" />
          <span>
            {isFr ? "Effacer la session et vider la mémoire" : "Clear Session & Wipe Memory"}
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Download, SHA-256 Checksum & Compliance */}
        <div className="lg:col-span-6 space-y-6">
          <section className="bg-white border border-slate-200 rounded-md p-5 sm:p-6 space-y-5">
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
                {isFr ? "Téléchargement du PDF assemblé" : "Signed Output Summary"}
              </h3>
              <p className="text-sm text-slate-600">
                {getResolvedCarrierName(setup)} · {setup.formCode} ·{" "}
                {setup.includeAdvisorAttestation
                  ? isFr
                    ? "Avec page d'attestation du conseiller"
                    : "Includes Advisor Attestation page"
                  : isFr
                    ? "Sans page d'attestation"
                    : "Standard client-signed document"}
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-md space-y-3">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-semibold text-slate-700 uppercase tracking-wider">
                  {isFr ? "Empreinte SHA-256 côté client" : "Client-Side SHA-256 Checksum"}
                </span>
                <button
                  type="button"
                  onClick={handleCopyChecksum}
                  className="min-h-[34px] inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 text-xs font-medium cursor-pointer"
                >
                  {copiedHash ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
                      <span>{isFr ? "Copié" : "Copied"}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{isFr ? "Copier" : "Copy"}</span>
                    </>
                  )}
                </button>
              </div>
              <p className="font-mono text-[11px] text-slate-900 break-all tabular-nums leading-relaxed select-all">
                {result.sha256Hex}
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-500 font-mono tabular-nums pt-1 border-t border-slate-200">
                <span>
                  {isFr ? "Fichier :" : "File:"} {result.fileName}
                </span>
                <span>
                  {isFr ? "Taille :" : "Size:"} {(result.pdfBytes.byteLength / 1024).toFixed(1)} KB
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={result.blobUrl}
                download={result.fileName}
                className="min-h-[48px] flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-md bg-[#0f2942] hover:bg-[#163859] text-white transition-colors whitespace-nowrap no-underline"
              >
                <Download className="w-4 h-4" aria-hidden="true" />
                <span>{isFr ? "Télécharger le PDF signé" : "Download Signed PDF"}</span>
              </a>

              <button
                type="button"
                onClick={onBack}
                className="min-h-[48px] inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                <span>{isFr ? "Modifier" : "Go Back"}</span>
              </button>
            </div>
          </section>

          {/* Privacy Guarantee */}
          <section className="bg-white border border-slate-200 rounded-md p-5 space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Lock className="w-4 h-4 text-[#0f2942] shrink-0" aria-hidden="true" />
              <span>
                {isFr
                  ? "Traitement exclusivement en mémoire locale"
                  : "Privacy-First Browser Memory Processing"}
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isFr
                ? "Le PDF de base, les renseignements du client, les tracés de signature et le document assemblé sont traités uniquement dans la mémoire vive (RAM) de ce navigateur. Aucune donnée ni image de signature n'est transmise à une base de données ou à un outil d'analyse tiers. Cliquez sur « Effacer la session et vider la mémoire » dès que vous avez enregistré le PDF."
                : "The base PDF, client metadata, raw pointer strokes, and final PDF remain exclusively in browser memory (RAM) on this device. No client PII or signature images are written to external databases, cloud buckets, or analytics scripts. Click Clear Session & Wipe Memory immediately after saving your file."}
            </p>
          </section>

          {/* Compliance Disclaimer */}
          <section className="bg-slate-100 border border-slate-300 rounded-md p-5 space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" aria-hidden="true" />
              <span>
                {isFr
                  ? "Avis de conformité et d'acceptation par les assureurs"
                  : "Carrier Acceptance & Compliance Disclaimer"}
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              {isFr
                ? "Chaque assureur et institution financière impose ses propres règles concernant les signatures au stylet sur tablette, les originaux à l'encre (« wet ink ») ou les plateformes de signature électronique approuvées (telles que DocuSign ou OneSpan). La vérification des exigences propres à l'assureur et la soumission conforme des formulaires demeurent l'entière responsabilité du conseiller agréé."
                : "Carriers and financial institutions maintain strict, carrier-specific rules governing hand-drawn stylus signatures versus wet-ink originals versus approved carrier e-signature platforms (such as DocuSign or OneSpan). Confirming carrier acceptance rules prior to use and submitting final documentation remains the sole responsibility of the servicing advisor."}
            </p>
          </section>
        </div>

        {/* Right: Assembled PDF Inspector */}
        <div className="lg:col-span-6 space-y-2">
          <div className="flex items-center justify-between gap-2 text-xs text-slate-600">
            <span className="font-semibold text-slate-900 uppercase tracking-wider">
              {isFr ? "Inspection du PDF assemblé" : "Assembled PDF Verification Preview"}
            </span>
            <div className="flex items-center gap-1.5 font-mono tabular-nums">
              <button
                type="button"
                disabled={previewPage <= 1}
                onClick={() => setPreviewPage((p) => Math.max(1, p - 1))}
                aria-label="Previous assembled page"
                className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              </button>
              <span className="px-2">
                {previewPage} / {result.totalPages}
              </span>
              <button
                type="button"
                disabled={previewPage >= result.totalPages}
                onClick={() => setPreviewPage((p) => Math.min(result.totalPages, p + 1))}
                aria-label="Next assembled page"
                className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <PdfPagePreview pdfBytes={result.pdfBytes} pageNumber={previewPage} targetWidth={800} isFr={isFr} />
        </div>
      </div>
    </div>
  );
};
