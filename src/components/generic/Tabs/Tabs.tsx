"use client";

import { cn } from "../../../lib/utils";

export interface TabsProps {
  tabs: string[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function Tabs({ tabs, value, onChange, className }: TabsProps) {
  const activeIndex = tabs.indexOf(value);

  return (
    <div
      className={cn("flex gap-4", className)}
      role="tablist"
      aria-orientation="horizontal"
    >
      {tabs.map((tab, idx) => {
        const active = value === tab;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(tab)}
            role="tab"
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            id={`tab-${idx}`}
            onKeyDown={(e) => {
              if (
                e.key !== "ArrowLeft" &&
                e.key !== "ArrowRight" &&
                e.key !== "Home" &&
                e.key !== "End"
              )
                return;
              e.preventDefault();

              const current = activeIndex >= 0 ? activeIndex : idx;
              if (e.key === "Home") return onChange(tabs[0]);
              if (e.key === "End") return onChange(tabs[tabs.length - 1]);
              if (e.key === "ArrowRight")
                return onChange(tabs[Math.min(tabs.length - 1, current + 1)]);
              return onChange(tabs[Math.max(0, current - 1)]);
            }}
            className={cn(
              "rounded-md px-4 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-white shadow-sm"
                : "bg-transparent text-gray-800 hover:text-primary"
            )}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}
