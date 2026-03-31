import type { ReactNode } from "react";
import { cn } from "../../../lib/utils";

const variantStyles = {
  default: "bg-gray-100 text-gray-700",
  primary: "bg-primary-50 text-primary",
  success: "bg-green-50 text-green-700",
  warning: "bg-yellow-50 text-yellow-700",
  error: "bg-red-50 text-red-700",
  info: "bg-sky-50 text-sky-700",
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
