import React, { useRef, useState, useEffect, useCallback } from "react";
import { RotateCcw, Check, PenTool, AlertCircle } from "lucide-react";
import type { CapturedSignature, PointerInputType, StrokePath } from "../../types/signing.ts";
import { analyzeSignatureComplexity, computeStrokeHash } from "../../lib/pdfSigningEngine.ts";

export interface SignatureCanvasPadProps {
  slotId: string;
  slotLabel: string;
  pageNumber?: number;
  existingCaptured?: CapturedSignature | null;
  disallowedStrokeHashes?: Set<string>;
  onConfirm: (captured: CapturedSignature) => void;
  onClear?: () => void;
  isFr?: boolean;
  confirmLabel?: string;
}

export const SignatureCanvasPad: React.FC<SignatureCanvasPadProps> = ({
  slotId,
  slotLabel,
  pageNumber = 1,
  existingCaptured,
  disallowedStrokeHashes,
  onConfirm,
  onClear,
  isFr = false,
  confirmLabel,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const strokesRef = useRef<StrokePath[]>([]);
  const activeStrokeRef = useRef<StrokePath | null>(null);
  const isDrawingRef = useRef(false);

  const [detectedInput, setDetectedInput] = useState<PointerInputType>(
    existingCaptured?.pointerType || "unknown"
  );
  const [hasUnsavedStrokes, setHasUnsavedStrokes] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const isShowingConfirmed = Boolean(existingCaptured && !hasUnsavedStrokes);

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const targetW = Math.round(rect.width * dpr);
    const targetH = Math.round(rect.height * dpr);
    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.scale(dpr, dpr);

    // Subtle baseline signing guide (not exported in PNG)
    const baselineY = Math.round(rect.height * 0.74);
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(20, baselineY);
    ctx.lineTo(rect.width - 20, baselineY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Left X mark on guide
    ctx.fillStyle = "#64748b";
    ctx.font = "600 13px ui-sans-serif, system-ui, sans-serif";
    ctx.fillText("X", 20, baselineY - 8);

    // Draw all strokes smoothly using quadratic midpoint interpolation
    ctx.strokeStyle = "#0f172a";
    ctx.fillStyle = "#0f172a";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const allStrokes = activeStrokeRef.current
      ? [...strokesRef.current, activeStrokeRef.current]
      : strokesRef.current;

    for (const stroke of allStrokes) {
      const pts = stroke.points;
      if (pts.length === 0) continue;

      if (pts.length === 1) {
        ctx.beginPath();
        ctx.arc(pts[0].x, pts[0].y, 1.4, 0, Math.PI * 2);
        ctx.fill();
        continue;
      }

      for (let i = 1; i < pts.length; i++) {
        const prev = pts[i - 1];
        const curr = pts[i];
        const pressure = curr.pressure > 0 ? curr.pressure : 0.5;
        ctx.lineWidth = stroke.pointerType === "pen" ? 1.8 + pressure * 1.9 : 2.5;

        const midX = (prev.x + curr.x) / 2;
        const midY = (prev.y + curr.y) / 2;

        ctx.beginPath();
        if (i === 1) {
          ctx.moveTo(prev.x, prev.y);
          ctx.lineTo(midX, midY);
        } else {
          const prevMidX = (pts[i - 2].x + prev.x) / 2;
          const prevMidY = (pts[i - 2].y + prev.y) / 2;
          ctx.moveTo(prevMidX, prevMidY);
          ctx.quadraticCurveTo(prev.x, prev.y, midX, midY);
        }
        ctx.stroke();
      }
    }

    ctx.restore();
  }, []);

  // Reset internal live buffer whenever switching slotId or receiving confirmed capture
  useEffect(() => {
    strokesRef.current = [];
    activeStrokeRef.current = null;
    isDrawingRef.current = false;
    setValidationError(null);
    setHasUnsavedStrokes(false);
    setDetectedInput(existingCaptured?.pointerType || "unknown");
    redrawCanvas();
  }, [slotId, existingCaptured, redrawCanvas]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    redrawCanvas();
    const observer = new ResizeObserver(() => redrawCanvas());
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [redrawCanvas]);

  const toPointerType = (raw: string): PointerInputType => {
    if (raw === "pen" || raw === "touch" || raw === "mouse") return raw;
    return "unknown";
  };

  const getLocalPoint = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(rect.width, e.clientX - rect.left)),
      y: Math.max(0, Math.min(rect.height, e.clientY - rect.top)),
      pressure: e.pressure && e.pressure > 0 ? e.pressure : 0.5,
      t: performance.now(),
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);

    const pType = toPointerType(e.pointerType);
    setDetectedInput(pType);
    setValidationError(null);
    isDrawingRef.current = true;

    const pt = getLocalPoint(e);
    activeStrokeRef.current = {
      pointerType: pType,
      points: [pt],
    };
    setHasUnsavedStrokes(true);
    redrawCanvas();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !activeStrokeRef.current) return;
    e.preventDefault();
    const pt = getLocalPoint(e);
    const pts = activeStrokeRef.current.points;
    const last = pts[pts.length - 1];
    if (!last || Math.hypot(pt.x - last.x, pt.y - last.y) >= 1.2) {
      pts.push(pt);
      redrawCanvas();
    }
  };

  const finishStroke = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !activeStrokeRef.current) return;
    e.preventDefault();
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    strokesRef.current = [...strokesRef.current, activeStrokeRef.current];
    activeStrokeRef.current = null;
    isDrawingRef.current = false;
    redrawCanvas();
  };

  const handleClear = () => {
    strokesRef.current = [];
    activeStrokeRef.current = null;
    isDrawingRef.current = false;
    setHasUnsavedStrokes(false);
    setDetectedInput("unknown");
    setValidationError(null);
    redrawCanvas();
    onClear?.();
  };

  const exportHighResTransparentPng = async (
    strokes: StrokePath[]
  ): Promise<{ pngBytes: Uint8Array; previewDataUrl: string }> => {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (const stroke of strokes) {
      for (const p of stroke.points) {
        if (p.x < minX) minX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.x > maxX) maxX = p.x;
        if (p.y > maxY) maxY = p.y;
      }
    }

    const pad = 16;
    const logicalW = Math.max(180, maxX - minX + pad * 2);
    const logicalH = Math.max(70, maxY - minY + pad * 2);
    const exportScale = 3; // High-resolution 3x crisp rasterization for pdf-lib embedding

    const offscreen = document.createElement("canvas");
    offscreen.width = Math.round(logicalW * exportScale);
    offscreen.height = Math.round(logicalH * exportScale);
    const ctx = offscreen.getContext("2d");
    if (!ctx) {
      throw new Error("Could not initialize high-resolution PNG export context.");
    }

    ctx.scale(exportScale, exportScale);
    ctx.strokeStyle = "#0f172a";
    ctx.fillStyle = "#0f172a";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const offsetX = minX - pad;
    const offsetY = minY - pad;

    for (const stroke of strokes) {
      const pts = stroke.points;
      if (pts.length === 0) continue;

      if (pts.length === 1) {
        ctx.beginPath();
        ctx.arc(pts[0].x - offsetX, pts[0].y - offsetY, 1.4, 0, Math.PI * 2);
        ctx.fill();
        continue;
      }

      for (let i = 1; i < pts.length; i++) {
        const prev = pts[i - 1];
        const curr = pts[i];
        const pressure = curr.pressure > 0 ? curr.pressure : 0.5;
        ctx.lineWidth = stroke.pointerType === "pen" ? 1.8 + pressure * 1.9 : 2.5;

        const px = prev.x - offsetX;
        const py = prev.y - offsetY;
        const cx = curr.x - offsetX;
        const cy = curr.y - offsetY;
        const mx = (px + cx) / 2;
        const my = (py + cy) / 2;

        ctx.beginPath();
        if (i === 1) {
          ctx.moveTo(px, py);
          ctx.lineTo(mx, my);
        } else {
          const prev2 = pts[i - 2];
          const p2x = (prev2.x - offsetX + px) / 2;
          const p2y = (prev2.y - offsetY + py) / 2;
          ctx.moveTo(p2x, p2y);
          ctx.quadraticCurveTo(px, py, mx, my);
        }
        ctx.stroke();
      }
    }

    const previewDataUrl = offscreen.toDataURL("image/png");
    const blob = await new Promise<Blob>((resolve, reject) => {
      offscreen.toBlob((b) => {
        if (b) resolve(b);
        else reject(new Error("PNG blob encoding failed."));
      }, "image/png");
    });
    const pngBytes = new Uint8Array(await blob.arrayBuffer());
    return { pngBytes, previewDataUrl };
  };

  const handleConfirm = async () => {
    setValidationError(null);
    const strokes = strokesRef.current;

    if (strokes.length === 0 && existingCaptured) {
      // Already confirmed and unchanged
      onConfirm(existingCaptured);
      return;
    }

    const report = analyzeSignatureComplexity(strokes, {
      empty: isFr
        ? "Veuillez tracer votre signature à la main sur la ligne avant de confirmer."
        : "Please draw your signature by hand across the signing line before confirming.",
      tooShort: isFr
        ? "Tracé trop court ou assimilable à un appui accidentel. Signez lisiblement à la main."
        : "Stroke is too brief or resembles an accidental tap. Draw a complete hand-drawn signature or initials.",
      tooCompact: isFr
        ? "Signature trop réduite. Signez naturellement sur la ligne."
        : "Signature span is too compact. Draw naturally across the signing line.",
    });

    if (!report.isValid) {
      setValidationError(report.reason || "Invalid signature complexity.");
      return;
    }

    setIsConfirming(true);
    try {
      const strokeHash = await computeStrokeHash(strokes);

      if (disallowedStrokeHashes?.has(strokeHash)) {
        setValidationError(
          isFr
            ? "Cette empreinte de signature a déjà été utilisée pour un autre champ. Veuillez apposer une nouvelle signature."
            : "This signature stroke pattern matches an earlier slot. Please sign freshly for each signature box."
        );
        return;
      }

      const { pngBytes, previewDataUrl } = await exportHighResTransparentPng(strokes);
      const primaryPointer =
        strokes[strokes.length - 1]?.pointerType || detectedInput || "unknown";

      setHasUnsavedStrokes(false);
      onConfirm({
        slotId,
        slotLabel,
        pageNumber,
        pngBytes,
        previewDataUrl,
        pointerType: primaryPointer,
        strokeHash,
        capturedAtIso: new Date().toISOString(),
        strokeCount: report.strokeCount,
        pointCount: report.pointCount,
        pathLengthPx: Math.round(report.pathLengthPx),
      });
    } finally {
      setIsConfirming(false);
    }
  };

  const pointerLabel =
    detectedInput === "pen"
      ? isFr
        ? "Stylet détecté"
        : "Stylus / Pen detected"
      : detectedInput === "touch"
        ? isFr
          ? "Tactile détecté"
          : "Touch input detected"
        : detectedInput === "mouse"
          ? isFr
            ? "Souris / pavé tactile"
            : "Mouse / Trackpad input"
          : isFr
            ? "En attente du tracé"
            : "Awaiting live stroke";

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <PenTool className="w-3.5 h-3.5 text-[#0f2942]" aria-hidden="true" />
          <span className="font-medium text-slate-900">{slotLabel}</span>
          <span aria-hidden="true">·</span>
          <span>{pointerLabel}</span>
        </div>
        <span className="text-slate-500">
          {isFr
            ? "Tracé manuel uniquement (aucun texte ni collage d'image)"
            : "Hand-drawn strokes only (no typing or pasted images)"}
        </span>
      </div>

      {/* Live Touch / Stylus Drawing Canvas */}
      <div
        className="relative bg-white border border-slate-300 rounded-md overflow-hidden focus-within:border-[#0f2942]"
        onPaste={(e) => e.preventDefault()}
        onDrop={(e) => e.preventDefault()}
        onDragOver={(e) => e.preventDefault()}
      >
        {isShowingConfirmed && existingCaptured ? (
          <div className="h-48 sm:h-56 flex flex-col items-center justify-center p-4 bg-slate-50/60">
            <img
              src={existingCaptured.previewDataUrl}
              alt={slotLabel}
              className="max-h-32 max-w-full object-contain"
            />
            <p className="text-xs text-slate-500 mt-2">
              {isFr
                ? "Signature confirmée en mémoire. Appuyez sur Effacer pour re-signer."
                : "Live signature confirmed in memory. Tap Clear to re-sign."}
            </p>
          </div>
        ) : (
          <canvas
            ref={canvasRef}
            aria-label={slotLabel}
            style={{ touchAction: "none" }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={finishStroke}
            onPointerCancel={finishStroke}
            onContextMenu={(e) => e.preventDefault()}
            className="w-full h-48 sm:h-56 block cursor-crosshair touch-none select-none bg-white"
          />
        )}
      </div>

      {validationError && (
        <div
          role="alert"
          className="flex items-start gap-2.5 p-3 bg-rose-50 border border-rose-200 rounded-md text-xs text-rose-800"
        >
          <AlertCircle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" aria-hidden="true" />
          <span>{validationError}</span>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <button
          type="button"
          onClick={handleClear}
          disabled={!hasUnsavedStrokes && !existingCaptured}
          className="min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-45 disabled:pointer-events-none transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" aria-hidden="true" />
          <span>{isFr ? "Effacer" : "Clear"}</span>
        </button>

        <button
          type="button"
          onClick={handleConfirm}
          disabled={isConfirming || (!hasUnsavedStrokes && !existingCaptured)}
          className="min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-2 text-sm font-semibold rounded-md bg-[#0f2942] hover:bg-[#163859] text-white disabled:opacity-45 disabled:pointer-events-none transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Check className="w-4 h-4" aria-hidden="true" />
          <span>
            {confirmLabel ||
              (isShowingConfirmed
                ? isFr
                  ? "Signature confirmée"
                  : "Signature Confirmed"
                : isFr
                  ? "Confirmer la signature en direct"
                  : "Confirm Live Signature")}
          </span>
        </button>
      </div>
    </div>
  );
};
