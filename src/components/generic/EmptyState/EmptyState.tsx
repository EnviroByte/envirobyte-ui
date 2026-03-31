import { Inbox } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "../../../lib/utils";

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 text-center",
        className
      )}
    >
      <div className="mb-4 text-[var(--color-gray-400)]">
        {icon || <Inbox className="h-12 w-12" />}
      </div>
      <h3 className="text-base font-semibold text-[var(--color-gray-900)]">
        {title}
      </h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-[var(--color-gray-500)]">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
