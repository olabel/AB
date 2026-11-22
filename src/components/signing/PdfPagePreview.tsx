import React, { useEffect, useRef, useState } from "react";
import type { CapturedSignature, SignatureSlotConfig } from "../../types/signing.ts";
import { renderPdfPageToCanvas } from "../../lib/pdfSigningEngine.ts";

export interface PdfPagePreviewProps {
  pdfBytes: Uint8Array | null;
  pageNumber: number;
  slotsOnPage?: SignatureSlotConfig[];
  activeSlotId?: string | null;
  capturedBySlot?: Record<string, CapturedSignature>;
  /** Optional tap/click handler on the PDF page to reposition active placement center */
  onTapPlaceSlot?: (normCenterX: number, normCenterY: number) => void;
  targetWidth?: number;
  emptyMessage?: string;
}

export const PdfPagePreview: React.FC<PdfPagePreviewProps> = ({
  pdfBytes,
  pageNumber,
  slotsOnPage = [],
  activeSlotId = null,
  capturedBySlot = {},
  onTapPlaceSlot,
  targetWidth = 760,
  emptyMessage = "Upload a base PDF or load the built-in sample carrier form to preview pages.",
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState(false);

  useEffect(() => {
    if (!pdfBytes || !canvasRef.current) return;

    const controller = new AbortController();
    setRenderError(null);
    setIsRendering(true);

    renderPdfPageToCanvas({
      pdfBytes,
      pageNumber,
      canvas: canvasRef.current,
      targetWidth,
      signal: controller.signal,
    })
      .catch((err) => {
        if (
          controller.signal.aborted ||
          (err as Error)?.name === "AbortError" ||
          (err as Error)?.name === "RenderingCancelledException"
        ) {
          return;
        }
        setRenderError("Could not render this PDF page. Verify the file is a valid unencrypted PDF.");
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsRendering(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [pdfBytes, pageNumber, targetWidth]);

  if (!pdfBytes) {
    return (
      <div className="bg-white border border-slate-200 rounded-md p-8 text-center text-sm text-slate-500 min-h-[260px] flex items-center justify-center">
        <p className="max-w-sm">{emptyMessage}</p>
      </div>
    );
  }

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onTapPlaceSlot) return;
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const normX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const normY = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    onTapPlaceSlot(normX, normY);
  };

  return (
    <div className="space-y-2">
      <div
        onClick={handleContainerClick}
        className={`relative w-full bg-white border border-slate-300 rounded-md overflow-hidden shadow-xs ${
          onTapPlaceSlot ? "cursor-crosshair" : ""
        }`}
      >
        <canvas ref={canvasRef} className="w-full h-auto block bg-white" />

        {/* Normalized Signature Box Overlays */}
        {slotsOnPage.map((slot) => {
          const isActive = slot.id === activeSlotId;
          const captured = capturedBySlot[slot.id];

          return (
            <div
              key={slot.id}
              style={{
                left: `${slot.x * 100}%`,
                top: `${slot.y * 100}%`,
                width: `${slot.width * 100}%`,
                height: `${slot.height * 100}%`,
              }}
              className={`absolute pointer-events-none flex flex-col justify-center items-center transition-colors ${
                isActive
                  ? "border-2 border-[#0f2942] bg-[#0f2942]/10"
                  : captured
                    ? "border border-emerald-700 bg-emerald-50/75"
                    : "border border-slate-400 bg-slate-100/70"
              }`}
            >
              {captured ? (
                <img
                  src={captured.previewDataUrl}
                  alt={slot.label}
                  className="max-w-[92%] max-h-[86%] object-contain"
                />
              ) : (
                <span
                  className={`px-1.5 py-0.5 text-[10px] sm:text-xs font-semibold truncate max-w-full ${
                    isActive ? "text-[#0f2942]" : "text-slate-700"
                  }`}
                >
                  {slot.label}
                </span>
              )}
            </div>
          );
        })}

        {isRendering && (
          <div className="absolute inset-0 bg-white/75 flex items-center justify-center text-xs font-medium text-slate-600">
            Rendering page {pageNumber}...
          </div>
        )}
      </div>

      {renderError && (
        <p className="text-xs text-rose-700" role="alert">
          {renderError}
        </p>
      )}
    </div>
  );
};
