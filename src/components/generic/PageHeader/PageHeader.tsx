import type { ReactNode } from "react";
import { cn } from "../../../lib/utils";

export interface PageHeaderProps {
  /** Optional icon shown left of the title (typically a Lucide icon). */
  icon?: ReactNode;
  /** Main page title. */
  title: ReactNode;
  /** Short pill/badge next to the title (e.g. "Destinations"). */
  badge?: ReactNode;
  /** Optional paragraph below the title. */
  description?: ReactNode;
  /** Action slot on the right (buttons, toolbars). */
  actions?: ReactNode;
  /** Optional breadcrumb/slot rendered above the title. */
  leading?: ReactNode;
  /** Remove the default bottom border. */
  bordered?: boolean;
  className?: string;
}

/**
 * The standard product page header: icon + title + badge + description +
 * trailing actions, with an optional leading slot (breadcrumb).
 *
 * Richer than {@link PageHeading} which is a simple title + subtitle row.
 */
export function PageHeader({
  icon,
  title,
  badge,
  description,
  actions,
  leading,
  bordered = true,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        bordered && "border-b border-gray-200 pb-5",
        className
      )}
    >
      {leading}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="flex items-center gap-3 text-3xl font-extrabold tracking-tight text-gray-900">
              {icon}
              <span>{title}</span>
            </h1>
            {badge && (
              <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-800 ring-1 ring-inset ring-gray-500/20">
                {badge}
              </span>
            )}
          </div>
          {description && (
            <p className="text-sm text-gray-600 max-w-3xl">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-3 shrink-0">{actions}</div>
        )}
      </div>
    </div>
  );
}
