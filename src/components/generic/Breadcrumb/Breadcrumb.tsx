"use client";

import { ChevronRight } from "lucide-react";
import { Fragment, type ReactNode } from "react";
import { cn } from "../../../lib/utils";

export interface BreadcrumbItem {
  label: ReactNode;
  /** If provided and `onClick` is not, renders as an anchor. */
  href?: string;
  /** If provided, renders as a button. Takes precedence over `href`. */
  onClick?: () => void;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  /** Custom separator. Defaults to a chevron. */
  separator?: ReactNode;
  className?: string;
}

/**
 * Simple breadcrumb trail. The last item is always rendered as plain text
 * (the current page) regardless of `href`/`onClick`.
 */
export function Breadcrumb({
  items,
  separator,
  className,
}: BreadcrumbProps) {
  if (!items.length) return null;

  const sep = separator ?? (
    <ChevronRight className="h-4 w-4 text-gray-400 shrink-0" />
  );

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "flex items-center gap-1.5 text-sm text-gray-500",
        className
      )}
    >
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        const content = isLast ? (
          <span className="font-semibold text-gray-900">{item.label}</span>
        ) : item.onClick ? (
          <button
            type="button"
            onClick={item.onClick}
            className="hover:text-gray-900 transition-colors"
          >
            {item.label}
          </button>
        ) : item.href ? (
          <a
            href={item.href}
            className="hover:text-gray-900 transition-colors"
          >
            {item.label}
          </a>
        ) : (
          <span>{item.label}</span>
        );

        return (
          <Fragment key={i}>
            {content}
            {!isLast && sep}
          </Fragment>
        );
      })}
    </nav>
  );
}
