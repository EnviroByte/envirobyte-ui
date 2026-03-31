"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../../lib/utils";

export interface PillButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  children: ReactNode;
}

export function PillButton({
  active = false,
  children,
  className,
  ...props
}: PillButtonProps) {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        "rounded-full px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap",
        active
          ? "bg-primary text-white shadow-sm"
          : "bg-transparent text-gray-800 hover:text-primary",
        className
      )}
    >
      {children}
    </button>
  );
}
