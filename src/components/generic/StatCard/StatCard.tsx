import type { ReactNode } from "react";
import { cn } from "../../../lib/utils";

export type StatCardAccent =
  | "primary"
  | "sky"
  | "emerald"
  | "amber"
  | "rose"
  | "slate"
  | "orange"
  | "cyan";

const accentClasses: Record<StatCardAccent, string> = {
  primary: "border-l-primary",
  sky: "border-l-sky-500",
  emerald: "border-l-emerald-500",
  amber: "border-l-amber-500",
  rose: "border-l-rose-500",
  slate: "border-l-slate-300",
  orange: "border-l-orange-500",
  cyan: "border-l-cyan-500",
};

export interface StatCardProps {
  label: ReactNode;
  value: ReactNode;
  /** Optional suffix rendered after the value (e.g. "L", "tonnes", "h"). */
  unit?: ReactNode;
  /** Optional icon shown to the right of the label row. */
  icon?: ReactNode;
  /** Left-border accent color. Defaults to `primary`. */
  accent?: StatCardAccent;
  className?: string;
}

/**
 * Compact stat display used in dashboards and table summary bars.
 *
 * Layout: label on top (small, muted), large value below, optional unit
 * suffix, optional left-border accent to categorize.
 */
export function StatCard({
  label,
  value,
  unit,
  icon,
  accent = "primary",
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl shadow-sm ring-1 ring-gray-200 p-4 border-l-4",
        accentClasses[accent],
        className
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        {icon && <span className="text-gray-400 shrink-0">{icon}</span>}
      </div>
      <p className="text-2xl font-bold text-gray-900 mt-1">
        {value}
        {unit && (
          <span className="text-sm font-normal text-gray-500 ml-1">
            {unit}
          </span>
        )}
      </p>
    </div>
  );
}
