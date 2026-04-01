"use client";

import { cn } from "../../../lib/utils";

export interface StatusBadgeProps {
  status: string;
  variant?: "success" | "error" | "warning" | "info" | "neutral";
  showDot?: boolean;
  className?: string;
}

const variantStyles = {
  success: {
    badge: "bg-green-50 text-green-700 border-green-200",
    dot: "bg-green-500",
  },
  error: {
    badge: "bg-red-50 text-red-600 border-red-200",
    dot: "bg-red-500",
  },
  warning: {
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  info: {
    badge: "bg-primary-50 text-primary border-primary-100",
    dot: "bg-primary",
  },
  neutral: {
    badge: "bg-gray-50 text-gray-600 border-gray-200",
    dot: "bg-gray-400",
  },
};

export function StatusBadge({
  status,
  variant = "neutral",
  showDot = true,
  className,
}: StatusBadgeProps) {
  const styles = variantStyles[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 w-fit px-2.5 py-0.5 rounded-full text-xs font-semibold border",
        styles.badge,
        className
      )}
    >
      {showDot && (
        <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", styles.dot)} />
      )}
      {status}
    </span>
  );
}
