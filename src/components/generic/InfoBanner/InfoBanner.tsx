"use client";

import { Info } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "../../../lib/utils";

export interface InfoBannerProps {
  children: ReactNode;
  variant?: "info" | "warning" | "success" | "error";
  icon?: ReactNode;
  className?: string;
}

const variantStyles = {
  info: "bg-primary-50 border-primary-100 text-primary",
  warning: "bg-yellow-50 border-yellow-200 text-yellow-700",
  success: "bg-green-50 border-green-200 text-green-700",
  error: "bg-red-50 border-red-200 text-red-700",
};

export function InfoBanner({
  children,
  variant = "info",
  icon,
  className,
}: InfoBannerProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 text-sm rounded-md border px-4 py-3",
        variantStyles[variant],
        className
      )}
    >
      {icon !== undefined ? icon : <Info className="h-4 w-4 mt-0.5 shrink-0" />}
      <div>{children}</div>
    </div>
  );
}
