"use client";

import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "../../../lib/utils";
import {
  getAppHubColumns,
  resolveAppHubApps,
  type GetAppHubAppsOptions,
} from "./appHubApps";
import type { AppHubAppId } from "./appHubIcons";

export interface AppHubApp {
  /** Stable app identifier — used to hide the current app from the hub. */
  id?: AppHubAppId;
  /** App display name */
  label: string;
  /** URL to navigate to when clicked */
  href: string;
  /** Icon element (any ReactNode — lucide icon, SVG, img, etc.) */
  icon?: ReactNode;
  /** @deprecated Current app is hidden via `currentApp` instead of highlighted. */
  active?: boolean;
}

export interface AppHubDropdownProps extends GetAppHubAppsOptions {
  /** Custom app list. When omitted, the standard EnviroByte apps are used. */
  apps?: AppHubApp[];
  /** Heading text inside the panel */
  title?: string;
  /**
   * Number of columns in the app grid.
   * Defaults based on visible app count when omitted.
   */
  columns?: 2 | 3;
  /** Panel alignment relative to the trigger button */
  align?: "left" | "right";
  /** Extra classes on the trigger button */
  className?: string;
}

function GridIcon() {
  return (
    <svg
      className="w-5 h-5"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  );
}

export function AppHubDropdown({
  apps,
  currentApp,
  hrefOverrides,
  title = "EnviroByte App Hub",
  columns,
  align = "right",
  className,
}: AppHubDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null!);

  const visibleApps = useMemo(
    () => resolveAppHubApps(apps, currentApp, hrefOverrides) ?? [],
    [apps, currentApp, hrefOverrides]
  );

  const gridColumns = columns ?? getAppHubColumns(visibleApps.length);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (visibleApps.length === 0) {
    return null;
  }

  return (
    <div className="relative" ref={ref}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Open app hub"
        aria-expanded={open}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800",
          open && "bg-slate-100 dark:bg-slate-800",
          className
        )}
      >
        <GridIcon />
      </button>

      {/* Panel */}
      {open && (
        <div
          className={cn(
            "absolute z-50 mt-2 w-72 origin-top rounded-xl bg-white py-2 shadow-lg ring-1 ring-slate-900/5",
            "dark:bg-gray-900 dark:ring-slate-700",
            align === "right" ? "right-0" : "left-0"
          )}
        >
          {/* Header */}
          <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-800">
            <p className="text-center text-sm font-semibold text-slate-900 dark:text-slate-100">
              {title}
            </p>
          </div>

          {/* App grid */}
          <div
            className={cn(
              "grid gap-1 p-3",
              gridColumns === 3 ? "grid-cols-3" : "grid-cols-2"
            )}
          >
            {visibleApps.map((app) => (
              <a
                key={app.id ?? app.label}
                href={app.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "group flex flex-col items-center gap-2 rounded-lg p-3 transition-colors",
                  "hover:bg-slate-50 dark:hover:bg-slate-800"
                )}
              >
                {app.icon && (
                  <span className="flex h-9 w-9 items-center justify-center">
                    {app.icon}
                  </span>
                )}
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {app.label}
                </span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
