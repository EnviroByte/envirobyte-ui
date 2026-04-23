"use client";

import type { ReactNode } from "react";
import { cn } from "../../../lib/utils";

export interface SidePanelProps {
  /** Content rendered inside the panel. */
  children: ReactNode;
  /** Whether the panel is expanded. When `false` the panel collapses to `collapsedWidth`. */
  open?: boolean;
  /** Width when expanded. Tailwind width class (e.g. `"w-64"`). Defaults to `"w-64"`. */
  width?: string;
  /** Width when collapsed. Tailwind width class. Defaults to `"w-12"`. */
  collapsedWidth?: string;
  /** Which side of the parent this panel sits on — affects border placement. */
  side?: "left" | "right";
  className?: string;
}

/**
 * A collapsible side panel container. Visual chrome only — the opener/closer
 * button belongs to the content (so pages can place it in their panel
 * header without the library making that decision).
 */
export function SidePanel({
  children,
  open = true,
  width = "w-64",
  collapsedWidth = "w-12",
  side = "right",
  className,
}: SidePanelProps) {
  return (
    <aside
      className={cn(
        "h-full flex flex-col bg-white transition-all duration-200 overflow-hidden shrink-0 z-10",
        side === "right"
          ? "border-l border-gray-200"
          : "border-r border-gray-200",
        open ? width : collapsedWidth,
        className
      )}
    >
      {children}
    </aside>
  );
}
