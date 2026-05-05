"use client";

import {
  type CSSProperties,
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: "top" | "bottom";
  align?: "center" | "end";
}

function computeBubblePosition(
  trigger: HTMLElement,
  position: "top" | "bottom",
  align: "center" | "end",
): Pick<CSSProperties, "top" | "left" | "transform"> {
  const r = trigger.getBoundingClientRect();
  const gap = 6;

  let left: number;
  let top: number;
  let transform: string;

  if (position === "bottom") {
    top = r.bottom + gap;
    if (align === "end") {
      left = r.right;
      transform = "translateX(-100%)";
    } else {
      left = r.left + r.width / 2;
      transform = "translateX(-50%)";
    }
  } else {
    top = r.top - gap;
    if (align === "end") {
      left = r.right;
      transform = "translate(-100%, -100%)";
    } else {
      left = r.left + r.width / 2;
      transform = "translate(-50%, -100%)";
    }
  }

  return { top, left, transform };
}

/** Matches former `bg-gray-800` panel — inline so hosts cannot strip tooltip text/background via Tailwind purge/order. */
const PANEL_BG = "#1f2937";

function arrowStyle(
  position: "top" | "bottom",
  align: "center" | "end",
): CSSProperties {
  const base: CSSProperties = {
    position: "absolute",
    width: 0,
    height: 0,
    margin: 0,
    padding: 0,
    pointerEvents: "none",
  };
  if (position === "bottom") {
    return {
      ...base,
      bottom: "100%",
      left: align === "end" ? undefined : "50%",
      right: align === "end" ? "1rem" : undefined,
      transform: align === "center" ? "translateX(-50%)" : undefined,
      borderLeft: "4px solid transparent",
      borderRight: "4px solid transparent",
      borderBottom: `4px solid ${PANEL_BG}`,
      borderTop: "none",
    };
  }
  return {
    ...base,
    top: "100%",
    left: align === "end" ? undefined : "50%",
    right: align === "end" ? "1rem" : undefined,
    transform: align === "center" ? "translateX(-50%)" : undefined,
    borderLeft: "4px solid transparent",
    borderRight: "4px solid transparent",
    borderTop: `4px solid ${PANEL_BG}`,
    borderBottom: "none",
  };
}

export function Tooltip({
  content,
  children,
  position = "bottom",
  align = "center",
}: TooltipProps) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [bubblePos, setBubblePos] = useState<
    Pick<CSSProperties, "top" | "left" | "transform">
  >({ top: 0, left: 0, transform: "translateX(-50%)" });

  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearHideTimer = useCallback(() => {
    if (hideTimeoutRef.current != null) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  }, []);

  const syncPosition = useCallback(() => {
    const el = triggerRef.current;
    if (!el || typeof window === "undefined") return;
    setBubblePos(computeBubblePosition(el, position, align));
  }, [position, align]);

  useLayoutEffect(() => {
    if (!visible) return;
    syncPosition();
    window.addEventListener("scroll", syncPosition, true);
    window.addEventListener("resize", syncPosition);
    return () => {
      window.removeEventListener("scroll", syncPosition, true);
      window.removeEventListener("resize", syncPosition);
    };
  }, [visible, syncPosition]);

  useEffect(
    () => () => {
      clearHideTimer();
    },
    [clearHideTimer],
  );

  const scheduleHide = () => {
    clearHideTimer();
    hideTimeoutRef.current = setTimeout(() => setVisible(false), 120);
  };

  const show = () => {
    clearHideTimer();
    syncPosition();
    setVisible(true);
  };

  const tooltipNode =
    visible && typeof document !== "undefined"
      ? createPortal(
          <div
            style={{
              position: "fixed",
              ...bubblePos,
              zIndex: 9999,
              pointerEvents: "none",
              width: "max-content",
              maxWidth: "min(18rem, calc(100vw - 1.5rem))",
              opacity: 1,
              transition: "opacity 150ms ease",
            }}
            role="tooltip"
          >
            <div
              style={{
                position: "relative",
                whiteSpace: "normal",
                boxShadow:
                  "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
                borderRadius: "0.375rem",
                backgroundColor: PANEL_BG,
                color: "#ffffff",
                padding: "0.5rem 0.75rem",
                fontSize: "0.75rem",
                lineHeight: 1.625,
                fontWeight: 500,
                WebkitFontSmoothing: "antialiased",
              }}
            >
              {content}
              <div style={arrowStyle(position, align)} aria-hidden />
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <div
        ref={triggerRef}
        style={{ display: "inline-block" }}
        onMouseEnter={show}
        onMouseLeave={scheduleHide}
      >
        {children}
      </div>
      {tooltipNode}
    </>
  );
}
