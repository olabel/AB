import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Globe, Trash2, Lock, ArrowLeft, CheckCircle2 } from "lucide-react";
import { SEO } from "../components/SEO.tsx";
import { useLanguage } from "../context/LanguageContext.tsx";
import { Step1DocumentSetup } from "../components/signing/Step1DocumentSetup.tsx";
import { Step2ClientSigning } from "../components/signing/Step2ClientSigning.tsx";
import { Step3AdvisorAttestation } from "../components/signing/Step3AdvisorAttestation.tsx";
import { Step4FinalOutput } from "../components/signing/Step4FinalOutput.tsx";
import {
  assembleSignedPdf,
  generateSampleCarrierPdf,
  inspectPdfPageCount,
} from "../lib/pdfSigningEngine.ts";
import type {
  AdvisorAttestationState,
  AssemblyResult,
  CapturedSignature,
  DocumentSetupState,
  SignatureSlotConfig,
  WorkflowStep,
} from "../types/signing.ts";

function getTodayIsoDate(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function createInitialSetup(signingMode: DocumentSetupState["signingMode"] = "in-person"): DocumentSetupState {
  return {
    carrierPreset: "Equitable Life of Canada",
    customCarrierName: "",
    formCode: "",
    contractNumber: "",
    clientNames: "",
    signingMode,
    includeAdvisorAttestation: false,
    pdfSource: "none",
    pdfFileName: "",
    pageCount: 0,
  };
}

function createDefaultSlots(): SignatureSlotConfig[] {
  return [
    {
      id: "slot-primary-signature",
      label: "Client Primary Signature",
      pageNumber: 1,
      optional: false,
      x: 0.08,
      y: 0.72,
      width: 0.44,
      height: 0.1,
    },
    {
      id: "slot-acknowledgement-initials",
      label: "Client Initials / Acknowledgement",
      pageNumber: 2,
      optional: true,
      x: 0.6,
      y: 0.72,
      width: 0.3,
      height: 0.09,
    },
  ];
}

function createInitialAttestation(): AdvisorAttestationState {
  return {
    advisorName: "Ahmed Bello",
    idVerifiedInPerson: false,
    attestationDate: getTodayIsoDate(),
    verificationMethod: "",
    signature: null,
  };
}

export const DocumentSigningPage: React.FC = () => {
  const { language } = useLanguage();
  const isFr = language === "fr";
  const prefix = isFr ? "/fr" : "";
  const location = useLocation();
  const navigate = useNavigate();

  const isClientLinkMode = new URLSearchParams(location.search).get("mode") === "client";
  const [step, setStep] = useState<WorkflowStep>("setup");
  const [setup, setSetup] = useState<DocumentSetupState>(() =>
    createInitialSetup(isClientLinkMode ? "client-link" : "in-person")
  );
  const [slots, setSlots] = useState<SignatureSlotConfig[]>(createDefaultSlots);
  const [basePdfBytes, setBasePdfBytes] = useState<Uint8Array | null>(null);
  const [capturedBySlot, setCapturedBySlot] = useState<Record<string, CapturedSignature>>({});
  const [attestation, setAttestation] = useState<AdvisorAttestationState>(createInitialAttestation);
  const [assemblyResult, setAssemblyResult] = useState<AssemblyResult | null>(null);
  const [isAssembling, setIsAssembling] = useState(false);
  const [assemblyError, setAssemblyError] = useState<string | null>(null);
  const [wipedBanner, setWipedBanner] = useState(false);

  const activeBlobUrlRef = useRef<string | null>(null);
  const cleanupSnapshotRef = useRef<{
    basePdfBytes: Uint8Array | null;
    assembledBytes: Uint8Array | null;
    slots: Record<string, CapturedSignature>;
    advisorSig: CapturedSignature | null;
  }>({
    basePdfBytes: null,
    assembledBytes: null,
    slots: {},
    advisorSig: null,
  });

  cleanupSnapshotRef.current = {
    basePdfBytes,
    assembledBytes: assemblyResult?.pdfBytes || null,
    slots: capturedBySlot,
    advisorSig: attestation.signature,
  };

  useEffect(() => {
    return () => {
      const snap = cleanupSnapshotRef.current;
      snap.basePdfBytes?.fill(0);
      snap.assembledBytes?.fill(0);
      Object.values(snap.slots).forEach((cap) => cap.pngBytes.fill(0));
      snap.advisorSig?.pngBytes.fill(0);
      if (activeBlobUrlRef.current) {
        URL.revokeObjectURL(activeBlobUrlRef.current);
        activeBlobUrlRef.current = null;
      }
    };
  }, []);

  const revokeCurrentBlob = () => {
    if (activeBlobUrlRef.current) {
      URL.revokeObjectURL(activeBlobUrlRef.current);
      activeBlobUrlRef.current = null;
    }
  };

  const handleLanguageSwitch = () => {
    const suffix = `${location.search}${location.hash}`;
    if (location.pathname.startsWith("/fr")) {
      navigate(`${location.pathname.replace(/^\/fr/, "") || "/"}${suffix}`);
    } else {
      navigate(`/fr${location.pathname}${suffix}`);
    }
  };

  const handleUpdateSetup = (patch: Partial<DocumentSetupState>) => {
    setWipedBanner(false);
    setSetup((prev) => ({ ...prev, ...patch }));
  };

  const handleUploadPdf = async (file: File) => {
    setWipedBanner(false);
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    const pageCount = await inspectPdfPageCount(bytes);

    const safeFileName = (file.name || "Document.pdf").replace(/[\u0000-\u001F\u007F<>]/g, "").slice(0, 120);
    setBasePdfBytes((prev) => {
      prev?.fill(0);
      return bytes;
    });
    setCapturedBySlot({});
    revokeCurrentBlob();
    setAssemblyResult(null);

    setSetup((prev) => ({
      ...prev,
      pdfSource: "uploaded",
      pdfFileName: safeFileName || "Uploaded-Document.pdf",
      pageCount,
    }));

    // Clamp slot page numbers within uploaded PDF page bounds
    setSlots((prev) =>
      prev.map((slot) => ({
        ...slot,
        pageNumber: Math.max(1, Math.min(slot.pageNumber, pageCount)),
      }))
    );
  };

  const handleLoadSamplePdf = async () => {
    setWipedBanner(false);
    const nextSetup: DocumentSetupState = {
      ...setup,
      formCode: setup.formCode.trim() || "EQL-AUTH-2026",
      clientNames: setup.clientNames.trim() || "Alexandria Martin",
      pdfSource: "sample",
      pdfFileName: "Sample-Carrier-Authorization.pdf",
      pageCount: 2,
    };
    const bytes = await generateSampleCarrierPdf(nextSetup);
    setSetup(nextSetup);
    setBasePdfBytes(bytes);
    setSlots(createDefaultSlots());
    setCapturedBySlot({});
    revokeCurrentBlob();
    setAssemblyResult(null);
  };

  const handleUpdateSlot = (id: string, patch: Partial<SignatureSlotConfig>) => {
    setSlots((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };

  const handleAddSlot = () => {
    const nextNum = slots.length + 1;
    const defaultPage = Math.min(1, Math.max(1, setup.pageCount || 1));
    setSlots((prev) => [
      ...prev,
      {
        id: `slot-custom-${Date.now()}`,
        label: isFr ? `Initiales / Signature ${nextNum}` : `Additional Signature ${nextNum}`,
        pageNumber: defaultPage,
        optional: false,
        x: 0.1,
        y: Math.min(0.8, 0.25 + ((nextNum - 1) % 4) * 0.15),
        width: 0.36,
        height: 0.08,
      },
    ]);
  };

  const handleRemoveSlot = (id: string) => {
    setSlots((prev) => prev.filter((s) => s.id !== id));
    setCapturedBySlot((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const handleProceedFromSetup = async () => {
    setAssemblyError(null);
    // If testing with built-in sample PDF, refresh rendered metadata into sample pages cleanly
    if (setup.pdfSource === "sample") {
      const refreshedBytes = await generateSampleCarrierPdf(setup);
      setBasePdfBytes(refreshedBytes);
    }
    setStep("sign");
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const handleConfirmSlotSignature = (slotId: string, captured: CapturedSignature) => {
    setCapturedBySlot((prev) => ({ ...prev, [slotId]: captured }));
  };

  const handleClearSlotSignature = (slotId: string) => {
    setCapturedBySlot((prev) => {
      const next = { ...prev };
      if (next[slotId]) {
        next[slotId].pngBytes.fill(0);
      }
      delete next[slotId];
      return next;
    });
  };

  const handleAssemblePdf = async () => {
    if (!basePdfBytes) return;
    setAssemblyError(null);
    setIsAssembling(true);
    try {
      const assembled = await assembleSignedPdf({
        basePdfBytes,
        setup,
        slots,
        capturedBySlot,
        attestation,
      });

      revokeCurrentBlob();
      const blob = new Blob([new Uint8Array(assembled.pdfBytes)], {
        type: "application/pdf",
      });
      const blobUrl = URL.createObjectURL(blob);
      activeBlobUrlRef.current = blobUrl;

      setAssemblyResult({
        pdfBytes: assembled.pdfBytes,
        blobUrl,
        fileName: assembled.fileName,
        sha256Hex: assembled.sha256Hex,
        totalPages: assembled.totalPages,
        assembledAtIso: new Date().toISOString(),
      });
      setStep("output");
      window.scrollTo({ top: 0, behavior: "auto" });
    } catch {
      setAssemblyError(
        isFr
          ? "Une erreur s'est produite lors de l'assemblage du PDF. Vérifiez le document de base et réessayez."
          : "PDF assembly failed. Confirm the base PDF is unencrypted and retry."
      );
    } finally {
      setIsAssembling(false);
    }
  };

  const handleFinishClientSigning = async () => {
    if (setup.includeAdvisorAttestation) {
      setStep("attestation");
      window.scrollTo({ top: 0, behavior: "auto" });
    } else {
      await handleAssemblePdf();
    }
  };

  const handleWipeSession = () => {
    // Zero out in-memory binary arrays and revoke Blob URL
    if (basePdfBytes) {
      basePdfBytes.fill(0);
    }
    if (assemblyResult?.pdfBytes) {
      assemblyResult.pdfBytes.fill(0);
    }
    Object.values(capturedBySlot).forEach((cap) => {
      cap.pngBytes.fill(0);
    });
    if (attestation.signature) {
      attestation.signature.pngBytes.fill(0);
    }
    revokeCurrentBlob();

    setBasePdfBytes(null);
    setAssemblyResult(null);
    setCapturedBySlot({});
    setSetup(createInitialSetup());
    setSlots(createDefaultSlots());
    setAttestation(createInitialAttestation());
    setAssemblyError(null);
    setStep("setup");
    setWipedBanner(true);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const clientHashes = new Set<string>(
    Object.values(capturedBySlot).map((c) => c.strokeHash)
  );

  const visibleSteps: { id: WorkflowStep; num: string; label: string }[] = [
    { id: "setup", num: "01", label: isFr ? "Configuration" : "Setup" },
    { id: "sign", num: "02", label: isFr ? "Signature client" : "Sign" },
    ...(setup.includeAdvisorAttestation
      ? [{ id: "attestation" as WorkflowStep, num: "03", label: isFr ? "Attestation" : "Attestation" }]
      : []),
    {
      id: "output",
      num: setup.includeAdvisorAttestation ? "04" : "03",
      label: isFr ? "PDF final" : "Output",
    },
  ];

  const isStepReachable = (target: WorkflowStep): boolean => {
    if (target === "setup") return true;
    if (target === "sign") return Boolean(basePdfBytes && setup.formCode.trim() && setup.clientNames.trim());
    if (target === "attestation") {
      const allRequiredSigned = slots.every((s) => Boolean(s.optional) || Boolean(capturedBySlot[s.id]));
      const anySigned = slots.some((s) => Boolean(capturedBySlot[s.id]));
      return setup.includeAdvisorAttestation && Boolean(basePdfBytes) && allRequiredSigned && anySigned;
    }
    if (target === "output") return Boolean(assemblyResult);
    return false;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
      <SEO
        title={
          isFr
            ? "Outil de signature manuscrite client | Ahmed Bello"
            : "Client Hand-Signature & PDF Assembly Tool | Ahmed Bello"
        }
        description={
          isFr
            ? "Outil client sans papier pour signature tactile ou au stylet sur PDF avec empreinte SHA-256 et attestation facultative."
            : "Paperless client hand-signature workspace for touch and stylus PDF execution, optional advisor attestation, and client-side SHA-256 verification."
        }
        canonicalUrl={isFr ? "/fr/sign" : "/sign"}
        noIndex={true}
      />

      {/* Minimalist 3-Zone Top Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 sm:gap-8">
          {/* Zone 1: Single-line workspace title + quiet return */}
          <div className="flex items-center gap-3 min-w-0">
            <Link
              to={prefix || "/"}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
              aria-label={isFr ? "Retour à l'accueil" : "Return to practice homepage"}
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">{isFr ? "Accueil" : "Practice"}</span>
            </Link>
            <span className="text-slate-300 hidden sm:inline" aria-hidden="true">
              /
            </span>
            <h1 className="text-sm sm:text-base font-semibold text-slate-900 truncate">
              {isFr
                ? "Signature manuscrite client"
                : "Client Hand-Signature & Document Assembly Tool"}
            </h1>
          </div>

          {/* Zone 2: Clean Step Progress */}
          <nav
            aria-label={isFr ? "Étapes de signature" : "Workflow steps"}
            className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-md border border-slate-200"
          >
            {visibleSteps.map((s) => {
              const active = step === s.id;
              const clickable = isStepReachable(s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  disabled={!clickable}
                  onClick={() => clickable && setStep(s.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? "bg-[#0f2942] text-white"
                      : clickable
                        ? "text-slate-700 hover:text-slate-900 hover:bg-white cursor-pointer"
                        : "text-slate-400 cursor-not-allowed"
                  }`}
                >
                  <span className="font-mono tabular-nums mr-1.5 opacity-80">{s.num}</span>
                  <span>{s.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Workspace Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleLanguageSwitch}
              aria-label={isFr ? "Switch to English" : "Passer au français"}
              className="min-h-[38px] inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
              <span>{isFr ? "EN" : "FR"}</span>
            </button>

            <button
              type="button"
              onClick={handleWipeSession}
              className="min-h-[38px] inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded border border-slate-300 bg-white text-slate-800 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">
                {isFr ? "Vider la mémoire" : "Clear Session"}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Step Bar */}
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-2 flex items-center gap-1 overflow-x-auto">
          {visibleSteps.map((s) => {
            const active = step === s.id;
            const clickable = isStepReachable(s.id);
            return (
              <button
                key={s.id}
                type="button"
                disabled={!clickable}
                onClick={() => clickable && setStep(s.id)}
                className={`px-2.5 py-1.5 text-xs font-medium rounded whitespace-nowrap shrink-0 ${
                  active
                    ? "bg-[#0f2942] text-white"
                    : clickable
                      ? "bg-slate-100 text-slate-700"
                      : "text-slate-400"
                }`}
              >
                {s.num}. {s.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Workspace Body */}
      <main id="main-content" className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6">
        {wipedBanner && (
          <div
            role="status"
            className="flex items-center justify-between gap-3 p-3.5 bg-emerald-50 border border-emerald-200 rounded-md text-xs sm:text-sm text-emerald-900"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" aria-hidden="true" />
              <span>
                {isFr
                  ? "Session effacée. Toutes les données PDF, signatures et coordonnées ont été supprimées de la mémoire vive."
                  : "Session wiped. Base PDF bytes, live signature strokes, and client fields have been purged from memory."}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setWipedBanner(false)}
              className="text-xs font-medium underline hover:no-underline shrink-0 cursor-pointer"
            >
              {isFr ? "Fermer" : "Dismiss"}
            </button>
          </div>
        )}

        {assemblyError && (
          <div
            role="alert"
            className="p-3.5 bg-rose-50 border border-rose-200 rounded-md text-sm text-rose-800"
          >
            {assemblyError}
          </div>
        )}

        {step === "setup" && (
          <Step1DocumentSetup
            setup={setup}
            slots={slots}
            basePdfBytes={basePdfBytes}
            onUpdateSetup={handleUpdateSetup}
            onUploadPdf={handleUploadPdf}
            onLoadSamplePdf={handleLoadSamplePdf}
            onUpdateSlot={handleUpdateSlot}
            onAddSlot={handleAddSlot}
            onRemoveSlot={handleRemoveSlot}
            onContinue={handleProceedFromSetup}
            isFr={isFr}
          />
        )}

        {step === "sign" && basePdfBytes && (
          <Step2ClientSigning
            setup={setup}
            slots={slots}
            basePdfBytes={basePdfBytes}
            capturedBySlot={capturedBySlot}
            onConfirmSlotSignature={handleConfirmSlotSignature}
            onClearSlotSignature={handleClearSlotSignature}
            onBack={() => setStep("setup")}
            onFinishSigning={handleFinishClientSigning}
            isFr={isFr}
          />
        )}

        {step === "attestation" && setup.includeAdvisorAttestation && (
          <Step3AdvisorAttestation
            setup={setup}
            attestation={attestation}
            clientStrokeHashes={clientHashes}
            onUpdateAttestation={(patch) => setAttestation((prev) => ({ ...prev, ...patch }))}
            onBack={() => setStep("sign")}
            onAssemblePdf={handleAssemblePdf}
            isAssembling={isAssembling}
            isFr={isFr}
          />
        )}

        {step === "output" && assemblyResult && (
          <Step4FinalOutput
            setup={setup}
            result={assemblyResult}
            onBack={() => setStep(setup.includeAdvisorAttestation ? "attestation" : "sign")}
            onWipeSession={handleWipeSession}
            isFr={isFr}
          />
        )}
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-slate-200 bg-white mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-[#0f2942] shrink-0" aria-hidden="true" />
            <span>
              {isFr
                ? "Traitement local en mémoire uniquement · Aucun téléversement de données client ni suivi analytique"
                : "Browser-memory only · Zero server storage · No third-party tracking on signing routes"}
            </span>
          </div>
          <Link to={`${prefix}/calculators`} className="underline hover:text-slate-900 whitespace-nowrap shrink-0">
            {isFr ? "Voir les simulateurs financiers" : "View Financial Calculators"}
          </Link>
        </div>
      </footer>
    </div>
  );
};
