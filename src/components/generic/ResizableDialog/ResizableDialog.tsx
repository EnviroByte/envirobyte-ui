"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Dialog, DialogBackdrop, DialogTitle } from "@headlessui/react";
import { X, GripHorizontal } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "../../../lib/utils";

export interface ResizableDialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  /** Initial width in px. Default: 640 */
  defaultWidth?: number;
  /** Initial height in px. Default: content-driven */
  defaultHeight?: number;
  /** Minimum width in px. Default: 360 */
  minWidth?: number;
  /** Minimum height in px. Default: 300 */
  minHeight?: number;
  /** Maximum width in px. Default: 92vw */
  maxWidth?: number;
  /** Maximum height in px. Default: 92vh */
  maxHeight?: number;
  className?: string;
  footer?: ReactNode;
}

type ResizeEdge = "e" | "s" | "se" | "sw" | "w" | "n" | "ne" | "nw";

interface Size { w: number; h: number }
interface Pos  { x: number; y: number }

const edgeCursors: Record<ResizeEdge, string> = {
  e:  "cursor-ew-resize",
  w:  "cursor-ew-resize",
  s:  "cursor-ns-resize",
  n:  "cursor-ns-resize",
  se: "cursor-se-resize",
  sw: "cursor-sw-resize",
  ne: "cursor-ne-resize",
  nw: "cursor-nw-resize",
};

export function ResizableDialog({
  open,
  onClose,
  title,
  description,
  children,
  defaultWidth  = 640,
  defaultHeight,
  minWidth      = 360,
  minHeight     = 300,
  maxWidth,
  maxHeight,
  className,
  footer,
}: ResizableDialogProps) {
  const resolvedMaxW = maxWidth  ?? (typeof window !== "undefined" ? window.innerWidth  * 0.92 : 1200);
  const resolvedMaxH = maxHeight ?? (typeof window !== "undefined" ? window.innerHeight * 0.92 : 900);

  const [size, setSize] = useState<Size>({ w: defaultWidth, h: defaultHeight ?? 0 });
  const [pos,  setPos]  = useState<Pos>({ x: 0, y: 0 });
  const [active, setActive] = useState(false);

  const panelRef  = useRef<HTMLDivElement>(null);
  // Stored as a ref so the mousemove handler always reads the latest value without re-registering
  const resizeRef = useRef<{
    edge: ResizeEdge;
    startX: number; startY: number;
    startW: number; startH: number;
  } | null>(null);
  const dragRef = useRef<{
    startX: number; startY: number;
    startPosX: number; startPosY: number;
  } | null>(null);

  // Reset to defaults whenever the dialog opens
  useEffect(() => {
    if (open) {
      setSize({ w: defaultWidth, h: defaultHeight ?? 0 });
      setPos({ x: 0, y: 0 });
    }
  }, [open, defaultWidth, defaultHeight]);

  // ── Start resize ────────────────────────────────────────────────────────────
  const startResize = useCallback((e: React.MouseEvent, edge: ResizeEdge) => {
    e.preventDefault();
    e.stopPropagation();
    const panel = panelRef.current;
    if (!panel) return;
    const rect = panel.getBoundingClientRect();
    resizeRef.current = {
      edge,
      startX: e.clientX,
      startY: e.clientY,
      startW: rect.width,
      startH: rect.height,
    };
    setActive(true);
  }, []);

  // ── Start drag ───────────────────────────────────────────────────────────────
  const startDrag = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startPosX: pos.x,
      startPosY: pos.y,
    };
    setActive(true);
  }, [pos.x, pos.y]);

  // ── Global mouse events ──────────────────────────────────────────────────────
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      // ── Resize: symmetric from center — dialog never moves, only grows/shrinks ──
      if (resizeRef.current) {
        const { edge, startX, startY, startW, startH } = resizeRef.current;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        setSize(() => {
          let w = startW;
          let h = startH;

          // Horizontal: each side contributes dx, so total delta = 2×dx
          if (edge.includes("e")) w = Math.min(resolvedMaxW, Math.max(minWidth,  startW + dx * 2));
          if (edge.includes("w")) w = Math.min(resolvedMaxW, Math.max(minWidth,  startW - dx * 2));

          // Vertical: each side contributes dy, so total delta = 2×dy
          if (edge.includes("s")) h = Math.min(resolvedMaxH, Math.max(minHeight, startH + dy * 2));
          if (edge.includes("n")) h = Math.min(resolvedMaxH, Math.max(minHeight, startH - dy * 2));

          return { w, h };
        });
        return;
      }

      // ── Drag: move freely ────────────────────────────────────────────────────
      if (dragRef.current) {
        const dx = e.clientX - dragRef.current.startX;
        const dy = e.clientY - dragRef.current.startY;
        setPos({ x: dragRef.current.startPosX + dx, y: dragRef.current.startPosY + dy });
      }
    };

    const onUp = () => {
      resizeRef.current = null;
      dragRef.current   = null;
      setActive(false);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",   onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup",   onUp);
    };
  }, [minWidth, minHeight, resolvedMaxW, resolvedMaxH]);

  const hasFixedHeight = size.h > 0;

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/30 transition-opacity duration-200 data-[closed]:opacity-0"
      />

      {/* Centered container — pointer-events-none so clicks pass through to backdrop */}
      <div className="fixed inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
        <div
          ref={panelRef}
          className={cn(
            "pointer-events-auto relative bg-white rounded-xl shadow-2xl ring-1 ring-slate-200 flex flex-col",
            "animate-in fade-in zoom-in-95 duration-200",
            active && "select-none",
            className,
          )}
          style={{
            width:    size.w,
            height:   hasFixedHeight ? size.h : undefined,
            minWidth,
            minHeight,
            maxWidth:  resolvedMaxW,
            maxHeight: resolvedMaxH,
            // translate for drag offset; no translate during resize so center stays fixed
            transform: `translate(${pos.x}px, ${pos.y}px)`,
          }}
        >
          {/* ── Title bar — drag handle ── */}
          <div
            onMouseDown={startDrag}
            className="flex items-center justify-between px-5 py-4 border-b border-slate-200 rounded-t-xl cursor-grab active:cursor-grabbing select-none bg-slate-50 shrink-0"
          >
            <div className="flex items-center gap-2 min-w-0">
              <GripHorizontal className="h-4 w-4 text-slate-400 shrink-0" />
              <div className="min-w-0">
                {title && (
                  <DialogTitle className="text-base font-bold text-slate-900 truncate">
                    {title}
                  </DialogTitle>
                )}
                {description && (
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{description}</p>
                )}
              </div>
            </div>
            <button
              onMouseDown={(e) => e.stopPropagation()}
              onClick={onClose}
              className="ml-3 shrink-0 rounded-md p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* ── Scrollable content ── */}
          <div className="flex-1 overflow-y-auto px-5 py-4 min-h-0">
            {children}
          </div>

          {/* ── Optional footer ── */}
          {footer && (
            <div className="shrink-0 px-5 py-4 border-t border-slate-100 bg-white rounded-b-xl">
              {footer}
            </div>
          )}

          {/* ── Resize handles (all 8 edges/corners) ── */}
          {(["e", "s", "se", "sw", "w", "n", "ne", "nw"] as ResizeEdge[]).map((edge) => (
            <ResizeHandle key={edge} edge={edge} onMouseDown={startResize} />
          ))}
        </div>
      </div>
    </Dialog>
  );
}

// ── Resize handle ─────────────────────────────────────────────────────────────
function ResizeHandle({
  edge,
  onMouseDown,
}: {
  edge: ResizeEdge;
  onMouseDown: (e: React.MouseEvent, edge: ResizeEdge) => void;
}) {
  const isCorner = edge.length === 2;
  const sz = isCorner ? 14 : 8;
  const style: React.CSSProperties = { position: "absolute", zIndex: 10 };

  if (edge === "e")  { style.right = 0;  style.top = "10%"; style.bottom = "10%"; style.width  = sz; }
  if (edge === "w")  { style.left  = 0;  style.top = "10%"; style.bottom = "10%"; style.width  = sz; }
  if (edge === "s")  { style.bottom = 0; style.left = "10%"; style.right = "10%"; style.height = sz; }
  if (edge === "n")  { style.top   = 0;  style.left = "10%"; style.right = "10%"; style.height = sz; }
  if (edge === "se") { style.right  = 0; style.bottom = 0; style.width = sz; style.height = sz; }
  if (edge === "sw") { style.left   = 0; style.bottom = 0; style.width = sz; style.height = sz; }
  if (edge === "ne") { style.right  = 0; style.top    = 0; style.width = sz; style.height = sz; }
  if (edge === "nw") { style.left   = 0; style.top    = 0; style.width = sz; style.height = sz; }

  return (
    <div
      style={style}
      className={cn(edgeCursors[edge], "hover:bg-cyan-400/20 rounded-sm transition-colors")}
      onMouseDown={(e) => onMouseDown(e, edge)}
    />
  );
}
