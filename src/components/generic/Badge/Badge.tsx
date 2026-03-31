import type { ReactNode } from "react";
import { cn } from "../../../lib/utils";

const variantStyles = {
  default:
    "bg-[var(--color-gray-100)] text-[var(--color-gray-700)]",
  primary:
    "bg-[var(--color-primary)]/10 text-[var(--color-primary)]",
  success:
    "bg-[var(--color-green-50)] text-[var(--color-green-700)]",
  warning:
    "bg-[var(--color-yellow-50)] text-[var(--color-yellow-700)]",
  error:
    "bg-[var(--color-red-50)] text-[var(--color-red-700)]",
  info:
    "bg-[var(--color-sky-50)] text-[var(--color-sky-700)]",
};

const sizeStyles = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-0.5 text-sm",
};

export interface BadgeProps {
  variant?: keyof typeof variantStyles;
  size?: keyof typeof sizeStyles;
  children: ReactNode;
  className?: string;
}

export function Badge({
  variant = "default",
  size = "md",
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
}
