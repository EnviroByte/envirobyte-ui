"use client";

import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { ChevronsLeft, ChevronsRight, Filter } from "lucide-react";
import { cn } from "../../../lib/utils";

export const sidePanelSectionLabelClass =
  "text-[10px] font-medium uppercase tracking-[0.14em] text-gray-400";

export interface SidePanelProps {
  title?: string;
  children?: ReactNode;
  footer?: ReactNode;
  storageKeyPrefix?: string;
  className?: string;
  contentClassName?: string;
  /**
   * CSS variable name used for sticky top offset + panel height.
   * Example: `--rim-app-header-h`.
   */
  topOffsetCssVar?: `--${string}`;
  /**
   * Called whenever panel width changes on desktop; useful for content dock insets.
   */
  onWidthChange?: (widthPx: number) => void;
}

/**
 * Generic right filter rail shell.
 * - White panel chrome + collapse/expand behavior with localStorage persistence
 * - App supplies all filter content via `children`
 * - Visual accents are driven by `--color-primary` theme token
 */
export function SidePanel({
  title = "Filters",
  children,
  footer,
  storageKeyPrefix = "envirobyte-filters-sidebar",
  className,
  contentClassName,
  topOffsetCssVar = "--app-header-h",
  onWidthChange,
}: SidePanelProps) {
  const collapsedKey = `${storageKeyPrefix}-collapsed`;
  const [collapsed, setCollapsed] = useState(false);
  const [isLg, setIsLg] = useState(false);
  const panelRootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const apply = () => setIsLg(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    try {
      if (localStorage.getItem(collapsedKey) === "1") {
        setCollapsed(true);
      }
    } catch {
      // ignore localStorage errors
    }
  }, [collapsedKey]);

  useEffect(() => {
    try {
      localStorage.setItem(collapsedKey, collapsed ? "1" : "0");
    } catch {
      // ignore localStorage errors
    }
  }, [collapsed, collapsedKey]);

  const railMode = collapsed && isLg;

  useLayoutEffect(() => {
    if (!onWidthChange) return;
    if (!isLg) {
      onWidthChange(0);
      return;
    }
    const el = panelRootRef.current;
    if (!el) return;

    const update = () => {
      const width = Math.ceil(el.getBoundingClientRect().width);
      onWidthChange(width);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);

    return () => {
      ro.disconnect();
      onWidthChange(0);
    };
  }, [isLg, railMode, collapsed, onWidthChange]);

  const dockStyle = {
    ["--eb-filter-top-offset" as string]: `var(${topOffsetCssVar})`,
  } satisfies CSSProperties;

  return (
    <aside
      ref={panelRootRef}
      style={dockStyle}
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-[width] duration-300 ease-out",
        "w-full shrink-0 self-start justify-self-start",
        railMode ? "lg:w-14" : "lg:w-72",
        "lg:fixed lg:right-0 lg:top-[var(--eb-filter-top-offset)] lg:h-[calc(100dvh-var(--eb-filter-top-offset))] lg:z-30 lg:rounded-none",
        "lg:border-l lg:border-l-[color-mix(in_srgb,var(--color-primary)_22%,transparent)]",
        "lg:shadow-[-8px_0_20px_-6px_rgba(17,22,37,0.08)]",
        className
      )}
      aria-label={title}
    >
      {railMode ? (
        <div className="flex min-h-0 flex-1 flex-col items-center gap-1 border-b border-gray-100 bg-white py-2">
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            className="flex h-9 w-full items-center justify-center rounded-md text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
            aria-label="Expand filters"
            title="Expand filters"
          >
            <ChevronsLeft className="h-5 w-5" />
          </button>
          <Filter className="h-5 w-5 shrink-0 text-gray-400" aria-hidden />
          <div className="min-h-0 flex-1" />
        </div>
      ) : (
        <>
          <div className="flex h-11 shrink-0 items-center justify-between gap-2 border-b border-gray-100 bg-white px-4">
            <h2 className="min-w-0 flex-1 truncate text-sm font-bold tracking-tight text-gray-900">
              {title}
            </h2>
            <button
              type="button"
              onClick={() => setCollapsed(true)}
              className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 lg:inline-flex"
              aria-label="Collapse filters"
              title="Collapse filters"
            >
              <ChevronsRight className="h-5 w-5" />
            </button>
          </div>
          <div
            className={cn(
              "flex min-h-0 flex-1 flex-col gap-3 overflow-x-hidden overflow-y-auto px-4 py-4 pb-6",
              contentClassName
            )}
          >
            {children}
          </div>
          {footer ? (
            <div className="shrink-0 border-t border-gray-100 bg-white px-4 py-3">
              {footer}
            </div>
          ) : null}
        </>
      )}
    </aside>
  );
}
