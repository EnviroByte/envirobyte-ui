"use client";

import {
  type CSSProperties,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { FileText, ExternalLink } from "lucide-react";
import type { Citation as CitationData } from "./types";

/**
 * An inline `[n]` citation chip that reveals the passage it was grounded on.
 *
 * Hover (or focus) opens a card naming the source document and quoting the
 * exact text the answer came from; clicking pins the card open so the passage
 * can be read at length and copied. Touch devices get the pinned behaviour on
 * first tap, since there is no hover to lean on.
 *
 * ── Why the styles are inline ──────────────────────────────────────────────
 * The card renders through a portal into <body>, and this package is consumed
 * two different ways: EmissionX regenerates the library's utility classes from
 * its own theme (`@source`), while AtmosIQ, DataPivot and RIM ship the
 * prebuilt `@envirobyte/ui/styles.css`. A utility class that survives one path
 * can be purged or out-ordered on the other, which historically left tooltips
 * rendering as unstyled text on a transparent ground (see Tooltip.tsx, which
 * hardcodes its panel colour for the same reason).
 *
 * Inline `var(--role, fallback)` sidesteps that: the value still resolves
 * through the consumer's own tokens — including the `.dark` re-point, since
 * custom properties inherit down to the portal — but nothing in a build step
 * can drop it. Roles, never raw ramp steps, so a product that changes --brand
 * gets a correct chip for free.
 */

export interface CitationProps {
  /** The citation this chip stands for. */
  citation: CitationData;
  /** Opens the card immediately rather than after the hover delay. */
  eager?: boolean;
  /** Called when the card is opened — useful for analytics on citation use. */
  onOpen?: (citation: CitationData) => void;
}

/** Delay before hover opens the card, so a cursor crossing the text is ignored. */
const OPEN_DELAY_MS = 140;
/** Grace period after leaving, so the pointer can travel chip -> card. */
const CLOSE_DELAY_MS = 180;

const PANEL_WIDTH = 380;
const VIEWPORT_MARGIN = 12;
const GAP = 8;

interface PanelPosition {
  top: number;
  left: number;
  placement: "top" | "bottom";
  /** Chip centre relative to the panel's left edge, for the arrow. */
  arrowLeft: number;
}

function computePanelPosition(
  trigger: HTMLElement,
  panelHeight: number
): PanelPosition {
  const r = trigger.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const width = Math.min(PANEL_WIDTH, vw - VIEWPORT_MARGIN * 2);

  // Prefer below; flip above when there is not room and above is roomier.
  const spaceBelow = vh - r.bottom - GAP;
  const spaceAbove = r.top - GAP;
  const placement: "top" | "bottom" =
    spaceBelow < panelHeight && spaceAbove > spaceBelow ? "top" : "bottom";

  const top = placement === "bottom" ? r.bottom + GAP : r.top - GAP - panelHeight;

  // Centre on the chip, then clamp inside the viewport.
  const centre = r.left + r.width / 2;
  const left = Math.min(
    Math.max(centre - width / 2, VIEWPORT_MARGIN),
    vw - width - VIEWPORT_MARGIN
  );

  return {
    top,
    left,
    placement,
    arrowLeft: Math.min(Math.max(centre - left, 16), width - 16),
  };
}

export function Citation({ citation, eager = false, onOpen }: CitationProps) {
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [position, setPosition] = useState<PanelPosition | null>(null);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const panelId = useId();

  const clearTimers = useCallback(() => {
    if (openTimer.current) clearTimeout(openTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    openTimer.current = null;
    closeTimer.current = null;
  }, []);

  const show = useCallback(
    (immediate = false) => {
      clearTimers();
      const run = () => {
        setOpen((wasOpen) => {
          if (!wasOpen) onOpen?.(citation);
          return true;
        });
      };
      if (immediate) run();
      else openTimer.current = setTimeout(run, OPEN_DELAY_MS);
    },
    [citation, clearTimers, onOpen]
  );

  const hide = useCallback(
    (immediate = false) => {
      clearTimers();
      const run = () => {
        setOpen(false);
        setPinned(false);
      };
      if (immediate) run();
      else closeTimer.current = setTimeout(run, CLOSE_DELAY_MS);
    },
    [clearTimers]
  );

  /** Hover-out only closes an unpinned card; a pinned one waits for Esc/outside. */
  const hideIfUnpinned = useCallback(() => {
    if (!pinned) hide();
  }, [hide, pinned]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  useEffect(() => {
    if (eager) show(true);
  }, [eager, show]);

  // Measure then place, before paint, so the card never appears mispositioned.
  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;

    const place = () => {
      const trigger = triggerRef.current;
      if (!trigger) return;
      const height = panelRef.current?.offsetHeight ?? 200;
      setPosition(computePanelPosition(trigger, height));
    };

    place();

    // The chip sits inside a scrolling chat log — follow it, and give up if it
    // scrolls out of view entirely rather than pinning a card to nothing.
    const onScrollOrResize = () => {
      const trigger = triggerRef.current;
      if (!trigger) return;
      const r = trigger.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) {
        hide(true);
        return;
      }
      place();
    };

    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [open, pinned, hide]);

  // Esc closes; an outside click dismisses a pinned card.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        hide(true);
        triggerRef.current?.focus();
      }
    };
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (panelRef.current?.contains(target)) return;
      if (triggerRef.current?.contains(target)) return;
      hide(true);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open, hide]);

  const togglePin = useCallback(() => {
    if (pinned) {
      hide(true);
      return;
    }
    clearTimers();
    setPinned(true);
    setOpen((wasOpen) => {
      if (!wasOpen) onOpen?.(citation);
      return true;
    });
  }, [pinned, hide, clearTimers, citation, onOpen]);

  const chipStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "1.25em",
    height: "1.25em",
    padding: "0 0.3em",
    margin: "0 0.12em",
    verticalAlign: "baseline",
    // Lifts the chip toward the cap line so it reads as a superscript without
    // `vertical-align: super`, which would drag the line-height around.
    position: "relative",
    top: "-0.15em",
    fontSize: "0.72em",
    lineHeight: 1,
    fontWeight: 600,
    fontVariantNumeric: "tabular-nums",
    borderRadius: "0.375em",
    border: "1px solid transparent",
    cursor: "pointer",
    userSelect: "none",
    transition: "background-color 120ms ease, color 120ms ease, transform 120ms ease",
    background: open
      ? "var(--brand, #274c7c)"
      : "var(--brand-subtle, #eef3f9)",
    color: open ? "var(--brand-fg, #ffffff)" : "var(--brand, #274c7c)",
    borderColor: open ? "var(--brand, #274c7c)" : "var(--brand-muted, #d6e2ef)",
    transform: open ? "translateY(-1px)" : "none",
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-describedby={open ? panelId : undefined}
        aria-label={`Citation ${citation.n}: ${citation.sourceTitle}`}
        style={chipStyle}
        onMouseEnter={() => show()}
        onMouseLeave={hideIfUnpinned}
        onFocus={() => show(true)}
        onBlur={hideIfUnpinned}
        onClick={togglePin}
      >
        {citation.n}
      </button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <CitationCard
            ref={panelRef}
            id={panelId}
            citation={citation}
            position={position}
            pinned={pinned}
            onMouseEnter={clearTimers}
            onMouseLeave={hideIfUnpinned}
          />,
          document.body
        )}
    </>
  );
}

// ── The card ───────────────────────────────────────────────────────────────

interface CitationCardProps {
  id: string;
  citation: CitationData;
  position: PanelPosition | null;
  pinned: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  ref: React.Ref<HTMLDivElement>;
}

function CitationCard({
  id,
  citation,
  position,
  pinned,
  onMouseEnter,
  onMouseLeave,
  ref,
}: CitationCardProps) {
  const hasPassage = Boolean(citation.citedText?.trim());

  const panelStyle: CSSProperties = {
    position: "fixed",
    top: position?.top ?? -9999,
    left: position?.left ?? -9999,
    width: `min(${PANEL_WIDTH}px, calc(100vw - ${VIEWPORT_MARGIN * 2}px))`,
    zIndex: 2147483000,
    // Hidden until measured, so the first frame never flashes at 0,0.
    visibility: position ? "visible" : "hidden",
    background: "var(--surface-raised, #ffffff)",
    color: "var(--text-primary, #374151)",
    border: "1px solid var(--border, #e5e7eb)",
    borderRadius: 12,
    boxShadow:
      "0 12px 32px -8px rgb(0 0 0 / 0.28), 0 4px 10px -4px rgb(0 0 0 / 0.18)",
    fontSize: 13,
    lineHeight: 1.55,
    overflow: "hidden",
    animation: "none",
    // Only a pinned card should intercept text selection drags.
    pointerEvents: "auto",
  };

  return (
    <div
      ref={ref}
      id={id}
      role="tooltip"
      style={panelStyle}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {position && <CardArrow position={position} />}

      {/* Header — which document this came from */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 8,
          padding: "10px 12px",
          borderBottom: hasPassage
            ? "1px solid var(--border, #e5e7eb)"
            : "none",
          background: "var(--surface-hover, #f9fafb)",
        }}
      >
        <span
          aria-hidden
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 22,
            height: 22,
            flexShrink: 0,
            borderRadius: 6,
            background: "var(--brand-subtle, #eef3f9)",
            color: "var(--brand, #274c7c)",
          }}
        >
          <FileText size={13} strokeWidth={2.2} />
        </span>

        <span style={{ minWidth: 0, flex: 1 }}>
          <span
            title={citation.sourceTitle}
            style={{
              display: "block",
              fontWeight: 600,
              fontSize: 12.5,
              color: "var(--text-strong, #111827)",
              // Long regulator filenames wrap rather than truncate — the whole
              // point of the card is knowing exactly which document it was.
              overflowWrap: "anywhere",
            }}
          >
            {citation.sourceTitle}
          </span>
          {citation.notebookTitle && (
            <span
              style={{
                display: "block",
                marginTop: 1,
                fontSize: 11,
                color: "var(--text-muted, #6b7280)",
              }}
            >
              {citation.notebookTitle}
            </span>
          )}
        </span>

        <span
          aria-hidden
          style={{
            flexShrink: 0,
            padding: "1px 6px",
            borderRadius: 999,
            fontSize: 10.5,
            fontWeight: 700,
            fontVariantNumeric: "tabular-nums",
            background: "var(--brand, #274c7c)",
            color: "var(--brand-fg, #ffffff)",
          }}
        >
          {citation.n}
        </span>
      </div>

      {/* Body — the passage the answer was grounded on */}
      {hasPassage && (
        <div style={{ padding: "11px 12px" }}>
          <blockquote
            style={{
              margin: 0,
              paddingLeft: 10,
              borderLeft: "2px solid var(--brand-muted, #d6e2ef)",
              color: "var(--text-primary, #374151)",
              fontSize: 12.5,
              lineHeight: 1.6,
              // Unpinned: a readable preview. Pinned: the full passage, scrollable.
              ...(pinned
                ? { maxHeight: 260, overflowY: "auto" as const }
                : {
                    display: "-webkit-box",
                    WebkitLineClamp: 7,
                    WebkitBoxOrient: "vertical" as const,
                    overflow: "hidden",
                  }),
            }}
          >
            {citation.citedText}
          </blockquote>
        </div>
      )}

      {/* Footer — how to interact, and where to go next */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          padding: "7px 12px",
          borderTop: "1px solid var(--border, #e5e7eb)",
          background: "var(--surface-hover, #f9fafb)",
          fontSize: 10.5,
          color: "var(--text-muted, #6b7280)",
        }}
      >
        <span>
          {pinned
            ? "Esc or click away to close"
            : hasPassage
              ? "Click to keep open"
              : "Quoted text unavailable for this reference"}
        </span>
        {citation.sourceUrl && (
          <a
            href={citation.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 3,
              flexShrink: 0,
              fontWeight: 600,
              color: "var(--brand, #274c7c)",
              textDecoration: "none",
            }}
          >
            Open source
            <ExternalLink size={10} strokeWidth={2.5} />
          </a>
        )}
      </div>
    </div>
  );
}

/** The little pointer tying the card back to its chip. */
function CardArrow({ position }: { position: PanelPosition }) {
  const pointingUp = position.placement === "bottom";
  return (
    <span
      aria-hidden
      style={{
        position: "absolute",
        left: position.arrowLeft - 6,
        ...(pointingUp ? { top: -6 } : { bottom: -6 }),
        width: 11,
        height: 11,
        transform: "rotate(45deg)",
        background: pointingUp
          ? "var(--surface-hover, #f9fafb)"
          : "var(--surface-hover, #f9fafb)",
        borderTop: pointingUp ? "1px solid var(--border, #e5e7eb)" : "none",
        borderLeft: pointingUp ? "1px solid var(--border, #e5e7eb)" : "none",
        borderBottom: pointingUp ? "none" : "1px solid var(--border, #e5e7eb)",
        borderRight: pointingUp ? "none" : "1px solid var(--border, #e5e7eb)",
      }}
    />
  );
}
