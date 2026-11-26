import React, { useRef, useState } from "react";
import {
  FileUp,
  FileText,
  Plus,
  Trash2,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Link2,
  Check,
  AlertCircle,
} from "lucide-react";
import type {
  CarrierPreset,
  DocumentSetupState,
  SignatureSlotConfig,
} from "../../types/signing.ts";
import { CARRIER_OPTIONS } from "../../lib/pdfSigningEngine.ts";
import { PdfPagePreview } from "./PdfPagePreview.tsx";

export interface Step1DocumentSetupProps {
  setup: DocumentSetupState;
  slots: SignatureSlotConfig[];
  basePdfBytes: Uint8Array | null;
  onUpdateSetup: (patch: Partial<DocumentSetupState>) => void;
  onUploadPdf: (file: File) => Promise<void>;
  onLoadSamplePdf: () => Promise<void>;
  onUpdateSlot: (id: string, patch: Partial<SignatureSlotConfig>) => void;
  onAddSlot: () => void;
  onRemoveSlot: (id: string) => void;
  onContinue: () => void;
  isFr?: boolean;
}

export const Step1DocumentSetup: React.FC<Step1DocumentSetupProps> = ({
  setup,
  slots,
  basePdfBytes,
  onUpdateSetup,
  onUploadPdf,
  onLoadSamplePdf,
  onUpdateSlot,
  onAddSlot,
  onRemoveSlot,
  onContinue,
  isFr = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [activeSlotId, setActiveSlotId] = useState<string>(slots[0]?.id || "");
  const [previewPage, setPreviewPage] = useState<number>(1);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  const prevSlotCountRef = useRef<number>(slots.length);
  React.useEffect(() => {
    if (slots.length > prevSlotCountRef.current) {
      const newest = slots[slots.length - 1];
      if (newest) {
        setActiveSlotId(newest.id);
        setPreviewPage(Math.min(newest.pageNumber, Math.max(1, setup.pageCount || 1)));
      }
    } else if (!slots.some((s) => s.id === activeSlotId) && slots[0]) {
      setActiveSlotId(slots[0].id);
    }
    prevSlotCountRef.current = slots.length;
  }, [slots, activeSlotId, setup.pageCount]);

  const selectedSlot = slots.find((s) => s.id === activeSlotId) || slots[0];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const inputEl = e.currentTarget;
    const file = inputEl.files?.[0];
    inputEl.value = "";
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setErrorMsg(
        isFr
          ? "Veuillez téléverser un document PDF valide (.pdf)."
          : "Please upload a valid PDF file (.pdf)."
      );
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setErrorMsg(
        isFr
          ? "Le fichier PDF dépasse la limite sécurisée de 25 Mo pour le traitement en mémoire."
          : "PDF file exceeds the 25 MB browser-memory processing limit."
      );
      return;
    }
    try {
      await onUploadPdf(file);
      setPreviewPage(1);
    } catch {
      setErrorMsg(
        isFr
          ? "Impossible de lire ce PDF (vérifiez qu'il s'agit d'un fichier PDF valide non chiffré)."
          : "Could not read this PDF file. Please verify it is a valid, unencrypted PDF."
      );
    }
  };

  const handleSampleClick = async () => {
    setErrorMsg(null);
    try {
      await onLoadSamplePdf();
      setPreviewPage(1);
    } catch {
      setErrorMsg(
        isFr
          ? "Erreur lors de la création du formulaire exemple."
          : "Unable to generate built-in sample PDF."
      );
    }
  };

  const handleTapPlace = (normCenterX: number, normCenterY: number) => {
    if (!selectedSlot) return;
    const clampedX = Math.max(
      0.02,
      Math.min(1 - selectedSlot.width - 0.02, normCenterX - selectedSlot.width / 2)
    );
    const clampedY = Math.max(
      0.02,
      Math.min(1 - selectedSlot.height - 0.02, normCenterY - selectedSlot.height / 2)
    );
    onUpdateSlot(selectedSlot.id, {
      pageNumber: previewPage,
      x: Number(clampedX.toFixed(2)),
      y: Number(clampedY.toFixed(2)),
    });
  };

  const handleContinueClick = () => {
    setErrorMsg(null);
    if (!setup.formCode.trim()) {
      setErrorMsg(
        isFr
          ? "Veuillez saisir le code ou le nom du formulaire avant de continuer."
          : "Please enter a Form Code or Document Name before continuing."
      );
      return;
    }
    if (!setup.clientNames.trim()) {
      setErrorMsg(
        isFr
          ? "Veuillez saisir le(s) nom(s) complet(s) du client."
          : "Please enter the Client Full Name(s)."
      );
      return;
    }
    if (!basePdfBytes) {
      setErrorMsg(
        isFr
          ? "Téléversez un PDF de base ou cliquez sur « Charger le PDF exemple » pour continuer."
          : "Upload a base PDF or click Load Sample Carrier PDF before proceeding."
      );
      return;
    }
    if (slots.length === 0) {
      setErrorMsg(
        isFr
          ? "Ajoutez au moins un champ de signature ou d'initiales."
          : "Add at least one signature or initial placement slot."
      );
      return;
    }
    onContinue();
  };

  const handleCopyClientLink = async () => {
    const cleanUrl = `${window.location.origin}${window.location.pathname}?mode=client`;
    const markCopied = () => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2500);
    };
    const fallbackCopy = () => {
      try {
        const ta = document.createElement("textarea");
        ta.value = cleanUrl;
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
      navigator.clipboard.writeText(cleanUrl).then(markCopied).catch(fallbackCopy);
    } else {
      fallbackCopy();
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-1.5">
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
          {isFr ? "1. Configuration du document et du client" : "1. Document Setup & Client Details"}
        </h2>
        <p className="text-sm text-slate-600 max-w-2xl">
          {isFr
            ? "Saisissez les références du dossier, chargez un PDF ou le formulaire exemple, puis définissez les zones de signature."
            : "Enter carrier form details, load a base PDF or built-in sample, and confirm signature box coordinates."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Details & Placement Config */}
        <div className="lg:col-span-7 space-y-6">
          <section className="bg-white border border-slate-200 rounded-md p-5 sm:p-6 space-y-5">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
              {isFr ? "Renseignements du contrat" : "Form & Client Metadata"}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="carrier-select" className="block text-sm font-medium text-slate-800">
                  {isFr ? "Assureur / Institution" : "Carrier Name"}
                </label>
                <select
                  id="carrier-select"
                  value={setup.carrierPreset}
                  onChange={(e) =>
                    onUpdateSetup({ carrierPreset: e.target.value as CarrierPreset })
                  }
                  className="w-full min-h-[44px] px-3 py-2 text-sm bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:border-[#0f2942]"
                >
                  {CARRIER_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {setup.carrierPreset === "Other" ? (
                <div className="space-y-1.5">
                  <label htmlFor="custom-carrier" className="block text-sm font-medium text-slate-800">
                    {isFr ? "Nom de l'institution" : "Custom Carrier Name"}
                  </label>
                  <input
                    id="custom-carrier"
                    type="text"
                    value={setup.customCarrierName}
                    onChange={(e) => onUpdateSetup({ customCarrierName: e.target.value })}
                    placeholder="e.g. RBC Insurance"
                    className="w-full min-h-[44px] px-3 py-2 text-sm bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:border-[#0f2942]"
                  />
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label htmlFor="form-code" className="block text-sm font-medium text-slate-800">
                    {isFr ? "Code / Nom du formulaire" : "Form Code / Document Name"}
                  </label>
                  <input
                    id="form-code"
                    type="text"
                    value={setup.formCode}
                    onChange={(e) => onUpdateSetup({ formCode: e.target.value })}
                    placeholder="e.g. EQL-APP-2026 / Delivery Receipt"
                    className="w-full min-h-[44px] px-3 py-2 text-sm bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:border-[#0f2942]"
                  />
                </div>
              )}

              {setup.carrierPreset === "Other" && (
                <div className="space-y-1.5 sm:col-span-2">
                  <label htmlFor="form-code-other" className="block text-sm font-medium text-slate-800">
                    {isFr ? "Code / Nom du formulaire" : "Form Code / Document Name"}
                  </label>
                  <input
                    id="form-code-other"
                    type="text"
                    value={setup.formCode}
                    onChange={(e) => onUpdateSetup({ formCode: e.target.value })}
                    placeholder="e.g. FORM-104 / Authorization"
                    className="w-full min-h-[44px] px-3 py-2 text-sm bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:border-[#0f2942]"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label htmlFor="contract-no" className="block text-sm font-medium text-slate-800">
                  {isFr ? "N° de police / contrat (optionnel)" : "Contract / Policy Number (Optional)"}
                </label>
                <input
                  id="contract-no"
                  type="text"
                  value={setup.contractNumber}
                  onChange={(e) => onUpdateSetup({ contractNumber: e.target.value })}
                  placeholder="e.g. POL-884120"
                  className="w-full min-h-[44px] px-3 py-2 text-sm bg-white border border-slate-300 rounded-md text-slate-900 font-mono tabular-nums focus:outline-none focus:border-[#0f2942]"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="client-names" className="block text-sm font-medium text-slate-800">
                  {isFr ? "Nom(s) complet(s) du client" : "Client Full Name(s)"}
                </label>
                <input
                  id="client-names"
                  type="text"
                  value={setup.clientNames}
                  onChange={(e) => onUpdateSetup({ clientNames: e.target.value })}
                  placeholder="e.g. Alexandria Martin"
                  className="w-full min-h-[44px] px-3 py-2 text-sm bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:border-[#0f2942]"
                />
              </div>
            </div>

            {/* Signing Mode Segmented Switch */}
            <div className="space-y-2 pt-1">
              <span className="block text-sm font-medium text-slate-800">
                {isFr ? "Mode de signature" : "Signing Mode"}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-1 bg-slate-100 rounded-md border border-slate-200">
                <button
                  type="button"
                  onClick={() => onUpdateSetup({ signingMode: "in-person" })}
                  className={`min-h-[44px] px-3 py-2 text-sm font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                    setup.signingMode === "in-person"
                      ? "bg-white text-[#0f2942] border border-slate-200 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {isFr ? "Tablette / stylet en personne" : "In-Person Tablet / Stylus"}
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateSetup({ signingMode: "client-link" })}
                  className={`min-h-[44px] px-3 py-2 text-sm font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                    setup.signingMode === "client-link"
                      ? "bg-white text-[#0f2942] border border-slate-200 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {isFr ? "Lien appareil client" : "Client Device Link"}
                </button>
              </div>

              {setup.signingMode === "client-link" && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-700">
                  <span>
                    {isFr
                      ? "Pour protéger les renseignements personnels, aucune donnée client n'est incluse dans l'URL. Partagez ce lien propre et le PDF de base séparément."
                      : "To keep client PII out of server logs and URLs, copy this clean session URL and supply the PDF locally on the client device."}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyClientLink}
                    className="min-h-[38px] inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded text-xs font-medium text-slate-800 hover:bg-slate-100 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {linkCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
                        <span>{isFr ? "Lien copié" : "Link Copied"}</span>
                      </>
                    ) : (
                      <>
                        <Link2 className="w-3.5 h-3.5 text-slate-600" aria-hidden="true" />
                        <span>{isFr ? "Copier le lien" : "Copy Device Link"}</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Toggle Switch: Include Advisor Attestation (Optional) */}
            <div className="flex items-center justify-between gap-4 pt-3 border-t border-slate-200">
              <div className="space-y-0.5">
                <label
                  htmlFor="attestation-toggle"
                  className="text-sm font-medium text-slate-900 block cursor-pointer"
                >
                  {isFr
                    ? "Inclure l'attestation du conseiller (optionnel)"
                    : "Include Advisor Attestation (Optional)"}
                </label>
                <p className="text-xs text-slate-500">
                  {isFr
                    ? "Ajoute une étape pour la vérification d'identité en personne et annexe une page d'attestation signée au PDF final."
                    : "Adds Step 3 for ID verification confirmation and appends a signed attestation summary page to the final PDF."}
                </p>
              </div>
              <button
                id="attestation-toggle"
                type="button"
                role="switch"
                aria-checked={setup.includeAdvisorAttestation}
                onClick={() =>
                  onUpdateSetup({
                    includeAdvisorAttestation: !setup.includeAdvisorAttestation,
                  })
                }
                className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border transition-colors cursor-pointer ${
                  setup.includeAdvisorAttestation
                    ? "bg-[#0f2942] border-[#0f2942]"
                    : "bg-slate-200 border-slate-300"
                }`}
              >
                <span className="sr-only">
                  {isFr ? "Inclure l'attestation du conseiller" : "Include Advisor Attestation"}
                </span>
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-xs transition-transform ${
                    setup.includeAdvisorAttestation ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </section>

          {/* Base PDF Upload or Built-In Sample */}
          <section className="bg-white border border-slate-200 rounded-md p-5 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
                  {isFr ? "Document PDF de base" : "Base PDF Document"}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {basePdfBytes
                    ? `${setup.pdfFileName} · ${setup.pageCount} ${setup.pageCount === 1 ? "page" : "pages"}`
                    : isFr
                      ? "Aucun PDF chargé pour l'instant."
                      : "No PDF loaded in memory yet."}
                </p>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf,.pdf"
              onChange={handleFileChange}
              className="sr-only"
              id="base-pdf-upload"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="min-h-[48px] flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-md border border-slate-300 bg-white text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <FileUp className="w-4 h-4 text-[#0f2942]" aria-hidden="true" />
                <span>{isFr ? "Téléverser un PDF" : "Upload Base PDF"}</span>
              </button>

              <button
                type="button"
                onClick={handleSampleClick}
                className="min-h-[48px] flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-md border border-[#0f2942] bg-slate-50 text-[#0f2942] hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <FileText className="w-4 h-4 text-[#0f2942]" aria-hidden="true" />
                <span>{isFr ? "Utiliser le PDF exemple" : "Use Built-In Sample PDF"}</span>
              </button>
            </div>
          </section>

          {/* Signature / Initial Placements */}
          <section className="bg-white border border-slate-200 rounded-md p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
                  {isFr ? "Emplacements de signature" : "Signature & Initial Placements"}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isFr
                    ? "Sélectionnez un champ, faites-le glisser ou tirez le coin sur l'aperçu PDF pour ajuster sa taille et sa position."
                    : "Select any slot, drag the box or its bottom-right corner on the PDF preview, or adjust dimensions below."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onAddSlot();
                }}
                className="min-h-[40px] inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{isFr ? "Ajouter un champ" : "Add Slot"}</span>
              </button>
            </div>

            <div className="divide-y divide-slate-200 border border-slate-200 rounded-md">
              {slots.map((slot, idx) => {
                const isSelected = slot.id === selectedSlot?.id;
                const applyPresetBox = (w: number, h: number) => {
                  const clampedX = Number(Math.min(slot.x, Math.max(0.01, 0.99 - w)).toFixed(2));
                  const clampedY = Number(Math.min(slot.y, Math.max(0.01, 0.99 - h)).toFixed(2));
                  onUpdateSlot(slot.id, {
                    x: clampedX,
                    y: clampedY,
                    width: w,
                    height: h,
                  });
                };

                return (
                  <div
                    key={slot.id}
                    onClick={() => {
                      setActiveSlotId(slot.id);
                      setPreviewPage(Math.min(slot.pageNumber, Math.max(1, setup.pageCount || 1)));
                    }}
                    className={`p-3.5 space-y-3 transition-colors ${
                      isSelected ? "bg-slate-50" : "bg-white hover:bg-slate-50/50"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="text-xs font-mono font-semibold text-slate-500 tabular-nums">
                          {String(idx + 1).padStart(2, "0")}.
                        </span>
                        <input
                          type="text"
                          aria-label={`Slot ${idx + 1} label`}
                          value={slot.label}
                          onChange={(e) => onUpdateSlot(slot.id, { label: e.target.value })}
                          className="min-h-[38px] flex-1 min-w-[140px] px-2.5 py-1 text-sm font-medium bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:border-[#0f2942]"
                        />
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {/* Required vs Optional Switch */}
                        <div
                          className="inline-flex rounded border border-slate-300 bg-white p-0.5 text-xs"
                          role="group"
                          aria-label={isFr ? "Exigence du champ" : "Slot requirement"}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => onUpdateSlot(slot.id, { optional: false })}
                            className={`min-h-[32px] px-2.5 py-1 rounded-xs font-medium transition-colors cursor-pointer ${
                              !slot.optional
                                ? "bg-[#0f2942] text-white"
                                : "text-slate-600 hover:text-slate-900"
                            }`}
                          >
                            {isFr ? "Requise" : "Required"}
                          </button>
                          <button
                            type="button"
                            onClick={() => onUpdateSlot(slot.id, { optional: true })}
                            className={`min-h-[32px] px-2.5 py-1 rounded-xs font-medium transition-colors cursor-pointer ${
                              slot.optional
                                ? "bg-slate-700 text-white"
                                : "text-slate-600 hover:text-slate-900"
                            }`}
                          >
                            {isFr ? "Facultative" : "Optional"}
                          </button>
                        </div>

                        <label className="text-xs text-slate-600 flex items-center gap-1.5">
                          <span>{isFr ? "Page" : "Page"}</span>
                          <input
                            type="number"
                            min={1}
                            max={setup.pageCount > 0 ? setup.pageCount : 99}
                            value={slot.pageNumber}
                            onChange={(e) => {
                              const maxPage = setup.pageCount > 0 ? setup.pageCount : 99;
                              const p = Math.min(maxPage, Math.max(1, Number(e.target.value) || 1));
                              onUpdateSlot(slot.id, { pageNumber: p });
                              setPreviewPage(p);
                            }}
                            className="w-16 min-h-[38px] px-2 py-1 text-xs font-mono tabular-nums bg-white border border-slate-300 rounded text-slate-900"
                          />
                        </label>
                        {slots.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemoveSlot(slot.id);
                            }}
                            aria-label={`Remove ${slot.label}`}
                            className="min-h-[38px] min-w-[38px] flex items-center justify-center rounded border border-slate-200 text-slate-500 hover:text-rose-700 hover:border-rose-200 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" aria-hidden="true" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <label className="space-y-1">
                        <span className="text-slate-500 block">X</span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          max={Number(Math.max(0.01, 0.99 - slot.width).toFixed(2))}
                          value={slot.x}
                          onChange={(e) => {
                            const maxX = Math.max(0.01, 0.99 - slot.width);
                            onUpdateSlot(slot.id, {
                              x: Number(Math.max(0, Math.min(maxX, Number(e.target.value) || 0)).toFixed(2)),
                            });
                          }}
                          className="w-full min-h-[36px] px-2 py-1 font-mono tabular-nums bg-white border border-slate-300 rounded text-slate-900"
                        />
                      </label>
                      <label className="space-y-1">
                        <span className="text-slate-500 block">Y</span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          max={Number(Math.max(0.01, 0.99 - slot.height).toFixed(2))}
                          value={slot.y}
                          onChange={(e) => {
                            const maxY = Math.max(0.01, 0.99 - slot.height);
                            onUpdateSlot(slot.id, {
                              y: Number(Math.max(0, Math.min(maxY, Number(e.target.value) || 0)).toFixed(2)),
                            });
                          }}
                          className="w-full min-h-[36px] px-2 py-1 font-mono tabular-nums bg-white border border-slate-300 rounded text-slate-900"
                        />
                      </label>
                      <label className="space-y-1">
                        <span className="text-slate-500 block">{isFr ? "Larg." : "Width"}</span>
                        <input
                          type="number"
                          step="0.01"
                          min="0.08"
                          max="0.95"
                          value={slot.width}
                          onChange={(e) => {
                            const nextW = Number(Math.max(0.08, Math.min(0.95, Number(e.target.value) || 0.2)).toFixed(2));
                            const nextX = Number(Math.min(slot.x, Math.max(0.01, 0.99 - nextW)).toFixed(2));
                            onUpdateSlot(slot.id, { width: nextW, x: nextX });
                          }}
                          className="w-full min-h-[36px] px-2 py-1 font-mono tabular-nums bg-white border border-slate-300 rounded text-slate-900"
                        />
                      </label>
                      <label className="space-y-1">
                        <span className="text-slate-500 block">{isFr ? "Haut." : "Height"}</span>
                        <input
                          type="number"
                          step="0.01"
                          min="0.04"
                          max="0.55"
                          value={slot.height}
                          onChange={(e) => {
                            const nextH = Number(Math.max(0.04, Math.min(0.55, Number(e.target.value) || 0.08)).toFixed(2));
                            const nextY = Number(Math.min(slot.y, Math.max(0.01, 0.99 - nextH)).toFixed(2));
                            onUpdateSlot(slot.id, { height: nextH, y: nextY });
                          }}
                          className="w-full min-h-[36px] px-2 py-1 font-mono tabular-nums bg-white border border-slate-300 rounded text-slate-900"
                        />
                      </label>
                    </div>

                    {/* Visual Box Adjustment Controls for Active Slot */}
                    {isSelected && (
                      <div className="pt-2 border-t border-slate-200/80 space-y-2.5">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                          <span className="font-medium text-slate-700">
                            {isFr ? "Format du cadre" : "Box Size Presets"}
                          </span>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => applyPresetBox(0.24, 0.07)}
                              className="min-h-[30px] px-2.5 py-1 rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 font-medium cursor-pointer"
                            >
                              {isFr ? "Compact (Initiales)" : "Compact (Initials)"}
                            </button>
                            <button
                              type="button"
                              onClick={() => applyPresetBox(0.44, 0.1)}
                              className="min-h-[30px] px-2.5 py-1 rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 font-medium cursor-pointer"
                            >
                              {isFr ? "Standard" : "Standard"}
                            </button>
                            <button
                              type="button"
                              onClick={() => applyPresetBox(0.62, 0.12)}
                              className="min-h-[30px] px-2.5 py-1 rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 font-medium cursor-pointer"
                            >
                              {isFr ? "Large" : "Wide"}
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <label className="space-y-1">
                            <div className="flex justify-between text-slate-600 font-mono tabular-nums">
                              <span>{isFr ? "Largeur du cadre" : "Box Width"}</span>
                              <span>{Math.round(slot.width * 100)}%</span>
                            </div>
                            <input
                              type="range"
                              aria-label={isFr ? "Largeur du cadre" : "Box Width"}
                              min={0.08}
                              max={0.95}
                              step={0.01}
                              value={slot.width}
                              onChange={(e) => {
                                const nextW = Number(Number(e.target.value).toFixed(2));
                                const nextX = Number(Math.min(slot.x, Math.max(0.01, 0.99 - nextW)).toFixed(2));
                                onUpdateSlot(slot.id, { width: nextW, x: nextX });
                              }}
                              className="w-full accent-[#0f2942] cursor-pointer"
                            />
                          </label>

                          <label className="space-y-1">
                            <div className="flex justify-between text-slate-600 font-mono tabular-nums">
                              <span>{isFr ? "Hauteur du cadre" : "Box Height"}</span>
                              <span>{Math.round(slot.height * 100)}%</span>
                            </div>
                            <input
                              type="range"
                              aria-label={isFr ? "Hauteur du cadre" : "Box Height"}
                              min={0.04}
                              max={0.4}
                              step={0.01}
                              value={slot.height}
                              onChange={(e) => {
                                const nextH = Number(Number(e.target.value).toFixed(2));
                                const nextY = Number(Math.min(slot.y, Math.max(0.01, 0.99 - nextH)).toFixed(2));
                                onUpdateSlot(slot.id, { height: nextH, y: nextY });
                              }}
                              className="w-full accent-[#0f2942] cursor-pointer"
                            />
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {errorMsg && (
            <div
              role="alert"
              className="flex items-start gap-2.5 p-3.5 bg-rose-50 border border-rose-200 rounded-md text-sm text-rose-800"
            >
              <AlertCircle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" aria-hidden="true" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleContinueClick}
              className="min-h-[48px] w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-md bg-[#0f2942] hover:bg-[#163859] text-white transition-colors whitespace-nowrap cursor-pointer"
            >
              <span>
                {isFr ? "Passer à la signature en direct" : "Proceed to Hand-Signature Capture"}
              </span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Right Column: Live Placement Preview */}
        <div className="lg:col-span-5 space-y-3 lg:sticky lg:top-24">
          <div className="flex items-center justify-between gap-2 text-xs text-slate-600">
            <span className="font-semibold text-slate-900 uppercase tracking-wider">
              {isFr ? "Aperçu interactif des zones" : "Interactive Box Placement Preview"}
            </span>
            {setup.pageCount > 0 && (
              <div className="flex items-center gap-1.5 font-mono tabular-nums">
                <button
                  type="button"
                  disabled={previewPage <= 1}
                  onClick={() => setPreviewPage((p) => Math.max(1, p - 1))}
                  aria-label="Previous page"
                  className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                </button>
                <span className="px-2">
                  {previewPage} / {setup.pageCount}
                </span>
                <button
                  type="button"
                  disabled={previewPage >= setup.pageCount}
                  onClick={() => setPreviewPage((p) => Math.min(setup.pageCount, p + 1))}
                  aria-label="Next page"
                  className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>

          {basePdfBytes && (
            <p className="text-xs text-slate-500">
              {isFr
                ? "Glissez le cadre actif pour déplacer, tirez le coin inférieur droit pour redimensionner ou touchez la page."
                : "Drag the highlighted box to reposition, drag its bottom-right corner handle to resize, or tap the page."}
            </p>
          )}

          <PdfPagePreview
            pdfBytes={basePdfBytes}
            pageNumber={previewPage}
            slotsOnPage={slots.filter((s) => s.pageNumber === previewPage)}
            activeSlotId={selectedSlot?.id || null}
            onTapPlaceSlot={handleTapPlace}
            onSelectSlot={(id) => setActiveSlotId(id)}
            onAdjustSlot={(id, patch) => onUpdateSlot(id, patch)}
            isFr={isFr}
            emptyMessage={
              isFr
                ? "Téléversez un PDF ou cliquez sur « Utiliser le PDF exemple » pour visualiser et ajuster vos zones de signature."
                : "Upload a base PDF or click Use Built-In Sample PDF to inspect pages and drag or resize signature boxes."
            }
          />
        </div>
      </div>
    </div>
  );
};
