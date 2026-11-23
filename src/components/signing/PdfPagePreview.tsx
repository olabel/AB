import React, { useEffect, useRef, useState } from "react";
import { Move } from "lucide-react";
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
  /** Optional handler to switch active slot when tapping an inactive overlay */
  onSelectSlot?: (slotId: string) => void;
  /** Optional handler enabling drag-to-move and corner resize directly on overlays */
  onAdjustSlot?: (
    slotId: string,
    patch: Pick<SignatureSlotConfig, "x" | "y" | "width" | "height">
  ) => void;
  targetWidth?: number;
  emptyMessage?: string;
  isFr?: boolean;
}

interface DragSession {
  slotId: string;
  mode: "move" | "resize-se";
  startClientX: number;
  startClientY: number;
  rectWidth: number;
  rectHeight: number;
  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
  didMove: boolean;
}

function clampRound(val: number, min: number, max: number): number {
  const clamped = Math.max(min, Math.min(max, val));
  return Number(clamped.toFixed(2));
}

export const PdfPagePreview: React.FC<PdfPagePreviewProps> = ({
  pdfBytes,
  pageNumber,
  slotsOnPage = [],
  activeSlotId = null,
  capturedBySlot = {},
  onTapPlaceSlot,
  onSelectSlot,
  onAdjustSlot,
  targetWidth = 760,
  emptyMessage = "Upload a base PDF or load the built-in sample carrier form to preview pages.",
  isFr = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dragSessionRef = useRef<DragSession | null>(null);
  const suppressContainerClickUntilRef = useRef<number>(0);

  const [renderError, setRenderError] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [hasRenderedFrame, setHasRenderedFrame] = useState(false);

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
      .then(() => {
        if (!controller.signal.aborted) {
          setHasRenderedFrame(true);
        }
      })
      .catch((err) => {
        if (
          controller.signal.aborted ||
          (err as Error)?.name === "AbortError" ||
          (err as Error)?.name === "RenderingCancelledException"
        ) {
          return;
        }
        setRenderError(
          isFr
            ? "Impossible d'afficher cette page PDF. Vérifiez que le fichier est un PDF valide non chiffré."
            : "Could not render this PDF page. Verify the file is a valid unencrypted PDF."
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsRendering(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [pdfBytes, pageNumber, targetWidth, isFr]);

  if (!pdfBytes) {
    return (
      <div className="bg-white border border-slate-200 rounded-md p-8 text-center text-sm text-slate-500 min-h-[260px] flex items-center justify-center">
        <p className="max-w-sm">{emptyMessage}</p>
      </div>
    );
  }

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onTapPlaceSlot) return;
    if (performance.now() < suppressContainerClickUntilRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const normX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const normY = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    onTapPlaceSlot(normX, normY);
  };

  const startSlotInteraction = (
    e: React.PointerEvent<HTMLElement>,
    slot: SignatureSlotConfig,
    mode: "move" | "resize-se"
  ) => {
    if (!onAdjustSlot) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.stopPropagation();
    e.preventDefault();

    onSelectSlot?.(slot.id);

    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect || containerRect.width <= 0 || containerRect.height <= 0) return;

    e.currentTarget.setPointerCapture(e.pointerId);
    dragSessionRef.current = {
      slotId: slot.id,
      mode,
      startClientX: e.clientX,
      startClientY: e.clientY,
      rectWidth: containerRect.width,
      rectHeight: containerRect.height,
      startX: slot.x,
      startY: slot.y,
      startWidth: slot.width,
      startHeight: slot.height,
      didMove: false,
    };
  };

  const moveSlotInteraction = (e: React.PointerEvent<HTMLElement>) => {
    const session = dragSessionRef.current;
    if (!session || !onAdjustSlot) return;
    e.stopPropagation();
    e.preventDefault();

    const dxPx = e.clientX - session.startClientX;
    const dyPx = e.clientY - session.startClientY;
    if (Math.hypot(dxPx, dyPx) > 2) {
      session.didMove = true;
    }

    const dxNorm = dxPx / session.rectWidth;
    const dyNorm = dyPx / session.rectHeight;

    if (session.mode === "move") {
      const nextX = clampRound(session.startX + dxNorm, 0.01, Math.max(0.01, 0.99 - session.startWidth));
      const nextY = clampRound(session.startY + dyNorm, 0.01, Math.max(0.01, 0.99 - session.startHeight));
      onAdjustSlot(session.slotId, {
        x: nextX,
        y: nextY,
        width: session.startWidth,
        height: session.startHeight,
      });
    } else {
      const maxWidth = Math.max(0.08, 0.99 - session.startX);
      const maxHeight = Math.max(0.04, Math.min(0.55, 0.99 - session.startY));
      const nextWidth = clampRound(session.startWidth + dxNorm, 0.08, maxWidth);
      const nextHeight = clampRound(session.startHeight + dyNorm, 0.04, maxHeight);
      onAdjustSlot(session.slotId, {
        x: session.startX,
        y: session.startY,
        width: nextWidth,
        height: nextHeight,
      });
    }
  };

  const endSlotInteraction = (e: React.PointerEvent<HTMLElement>) => {
    const session = dragSessionRef.current;
    if (!session) return;
    e.stopPropagation();
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    if (session.didMove) {
      suppressContainerClickUntilRef.current = performance.now() + 200;
    }
    dragSessionRef.current = null;
  };

  const isInteractive = Boolean(onAdjustSlot);

  return (
    <div className="space-y-2">
      <div
        ref={containerRef}
        data-rendering={isRendering ? "true" : "false"}
        onClick={handleContainerClick}
        className={`relative w-full bg-white border border-slate-300 rounded-md overflow-hidden shadow-xs select-none ${
          !hasRenderedFrame ? "aspect-[8.5/11]" : ""
        } ${onTapPlaceSlot ? "cursor-crosshair" : ""}`}
      >
        <canvas ref={canvasRef} className="w-full h-auto block bg-white" />

        {/* Normalized Signature Box Overlays */}
        {slotsOnPage.map((slot) => {
          const isActive = slot.id === activeSlotId;
          const captured = capturedBySlot[slot.id];

          return (
            <div
              key={slot.id}
              role={isInteractive ? "button" : undefined}
              tabIndex={isInteractive ? 0 : undefined}
              aria-label={slot.label}
              data-slot-id={slot.id}
              onClick={(e) => {
                if (!isInteractive) return;
                e.stopPropagation();
                onSelectSlot?.(slot.id);
              }}
              onPointerDown={(e) => startSlotInteraction(e, slot, "move")}
              onPointerMove={moveSlotInteraction}
              onPointerUp={endSlotInteraction}
              onPointerCancel={endSlotInteraction}
              style={{
                left: `${slot.x * 100}%`,
                top: `${slot.y * 100}%`,
                width: `${slot.width * 100}%`,
                height: `${slot.height * 100}%`,
                touchAction: isInteractive ? "none" : undefined,
              }}
              className={`absolute flex flex-col justify-center items-center transition-colors ${
                isInteractive
                  ? isActive
                    ? "pointer-events-auto cursor-move z-20"
                    : "pointer-events-auto cursor-pointer z-10"
                  : "pointer-events-none"
              } ${
                isActive
                  ? "border-2 border-[#0f2942] bg-[#0f2942]/12"
                  : captured
                    ? "border border-emerald-700 bg-emerald-50/75"
                    : "border border-slate-400 bg-slate-100/75 hover:border-slate-600"
              }`}
            >
              {captured ? (
                <img
                  src={captured.previewDataUrl}
                  alt={slot.label}
                  className="max-w-[92%] max-h-[86%] object-contain pointer-events-none"
                />
              ) : (
                <div className="flex flex-col items-center justify-center max-w-full px-1.5 pointer-events-none">
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] sm:text-xs font-semibold truncate max-w-full ${
                      isActive ? "text-[#0f2942]" : "text-slate-700"
                    }`}
                  >
                    {isInteractive && isActive && (
                      <Move className="w-3 h-3 shrink-0 text-[#0f2942]" aria-hidden="true" />
                    )}
                    <span className="truncate">
                      {slot.label}
                      {slot.optional ? (isFr ? " (Facult.)" : " (Opt.)") : ""}
                    </span>
                  </span>
                  {isInteractive && isActive && (
                    <span className="text-[9px] font-mono tabular-nums text-[#0f2942]/80">
                      {Math.round(slot.width * 100)}% x {Math.round(slot.height * 100)}%
                    </span>
                  )}
                </div>
              )}

              {/* Touch-friendly Bottom-Right Resize Corner Handle on Active Box */}
              {isInteractive && isActive && (
                <div
                  role="slider"
                  aria-label={isFr ? `Redimensionner ${slot.label}` : `Resize ${slot.label}`}
                  aria-valuemin={8}
                  aria-valuemax={95}
                  aria-valuenow={Math.round(slot.width * 100)}
                  data-resize-handle={slot.id}
                  onPointerDown={(e) => startSlotInteraction(e, slot, "resize-se")}
                  onPointerMove={moveSlotInteraction}
                  onPointerUp={endSlotInteraction}
                  onPointerCancel={endSlotInteraction}
                  onClick={(e) => e.stopPropagation()}
                  style={{ touchAction: "none" }}
                  className="absolute -right-3 -bottom-3 w-8 h-8 flex items-center justify-center cursor-nwse-resize z-30"
                >
                  <span className="w-3.5 h-3.5 bg-[#0f2942] border-2 border-white rounded-xs shadow-xs block" />
                </div>
              )}
            </div>
          );
        })}

        {isRendering && (
          <div className="absolute inset-0 bg-white/75 flex items-center justify-center text-xs font-medium text-slate-600">
            {isFr ? `Affichage de la page ${pageNumber}...` : `Rendering page ${pageNumber}...`}
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
