import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../../lib/utils";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingStyles = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({
  children,
  padding = "md",
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-lg)] border border-[var(--color-gray-200)] bg-white shadow-[var(--shadow-sm)]",
        paddingStyles[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function CardHeader({
  title,
  description,
  action,
  className,
  ...props
}: CardHeaderProps) {
  return (
    <div
      className={cn("flex items-center justify-between", className)}
      {...props}
    >
      <div>
        <h3 className="text-base font-semibold text-[var(--color-gray-900)]">
          {title}
        </h3>
        {description && (
          <p className="mt-1 text-sm text-[var(--color-gray-500)]">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
