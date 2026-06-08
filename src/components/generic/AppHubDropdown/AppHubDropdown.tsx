"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "../../../lib/utils";

export interface AppHubApp {
  /** App display name */
  label: string;
  /** URL to navigate to when clicked */
  href: string;
  /** Icon element (any ReactNode — lucide icon, SVG, img, etc.) */
  icon?: ReactNode;
  /** Highlight this app as the one currently active */
  active?: boolean;
}

export interface AppHubDropdownProps {
  /** List of apps to show in the grid */
  apps: AppHubApp[];
  /** Heading text inside the panel */
  title?: string;
  /**
   * Number of columns in the app grid.
   * Use 2 for ≤4 apps, 3 for 5-6 apps.
   * @default 2
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
  title = "EnviroByte App Hub",
  columns = 2,
  align = "right",
  className,
}: AppHubDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
              columns === 3 ? "grid-cols-3" : "grid-cols-2"
            )}
          >
            {apps.map((app) => (
              <a
                key={app.label}
                href={app.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "group flex flex-col items-center gap-2 rounded-lg p-3 transition-colors",
                  "hover:bg-slate-50 dark:hover:bg-slate-800",
                  app.active && "bg-slate-50 ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700"
                )}
              >
                {app.icon && (
                  <span className="flex h-7 w-7 items-center justify-center">
                    {app.icon}
                  </span>
                )}
                <span
                  className={cn(
                    "text-xs font-semibold",
                    app.active
                      ? "text-slate-900 dark:text-slate-100"
                      : "text-slate-600 dark:text-slate-400"
                  )}
                >
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
