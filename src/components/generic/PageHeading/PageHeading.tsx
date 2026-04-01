import type { ReactNode } from "react";
import { cn } from "../../../lib/utils";

export interface PageHeadingProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

export function PageHeading({
  title,
  subtitle,
  action,
  className,
}: PageHeadingProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-bold text-primary">{title}</h2>
        {subtitle && (
          <p className="text-sm text-gray-500 font-medium">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}
