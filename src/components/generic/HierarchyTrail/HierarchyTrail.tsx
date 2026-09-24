"use client";

import { ChevronRight } from "lucide-react";
import { Fragment, type ComponentType, type ReactNode } from "react";
import { cn } from "../../../lib/utils";

export interface HierarchyTrailItem {
  id: string;
  /** What this node is called — "Alberta", "Edson". */
  name: string;
  /**
   * What the company calls the tier this node sits at — "Province", "Field".
   * Every company names its own tiers, so this is never a fixed vocabulary.
   * Shown on hover and to assistive technology, not inline: the trail is read
   * at a glance, and the tier names double its length for no gain.
   */
  tierLabel?: string;
  /** Rendered before the name. Any lucide icon, or none. */
  icon?: ComponentType<{ className?: string }>;
  /** Tailwind text colour for the icon, e.g. "text-amber-500". */
  iconClassName?: string;
  /** Makes the segment a button. Omit to leave the trail read-only. */
  onClick?: () => void;
}

export interface HierarchyTrailProps {
  items: HierarchyTrailItem[];
  /** Custom separator. Defaults to a chevron. */
  separator?: ReactNode;
  /** Longest a single segment may run before it truncates. */
  maxSegmentWidth?: string;
  className?: string;
}

/**
 * Where something sits in a hierarchy whose tiers the customer defines.
 *
 * Distinct from `Breadcrumb`, which is for navigation and so emphasises its
 * last item as the current page. A trail describes a *position*: every segment
 * carries equal weight, each names the tier it belongs to, and the thing being
 * located is not in the trail at all — it sits beside it.
 *
 * Read-only unless an item is given an `onClick`. That default is deliberate:
 * a segment that looks interactive and filters nothing is worse than a plain
 * label, so interactivity is opt-in per item.
 */
export function HierarchyTrail({
  items,
  separator,
  maxSegmentWidth = "10rem",
  className,
}: HierarchyTrailProps) {
  if (!items.length) return null;

  const sep = separator ?? (
    <ChevronRight className="h-3.5 w-3.5 shrink-0 text-gray-400" />
  );

  return (
    <nav
      aria-label="Hierarchy"
      className={cn("flex min-w-0 items-center gap-1.5 text-sm", className)}
    >
      {items.map((item, i) => {
        const Icon = item.icon;
        const title = item.tierLabel
          ? `${item.tierLabel}: ${item.name}`
          : item.name;

        const body = (
          <>
            {Icon && (
              <Icon
                className={cn("h-3.5 w-3.5 shrink-0", item.iconClassName)}
              />
            )}
            <span className="truncate" style={{ maxWidth: maxSegmentWidth }}>
              {item.name}
            </span>
          </>
        );

        return (
          <Fragment key={item.id}>
            {i > 0 && sep}
            {item.onClick ? (
              <button
                type="button"
                onClick={item.onClick}
                title={title}
                className="flex min-w-0 items-center gap-1 rounded text-gray-500 transition-colors hover:text-gray-900"
              >
                {body}
              </button>
            ) : (
              <span
                title={title}
                className="flex min-w-0 items-center gap-1 text-gray-500"
              >
                {body}
              </span>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
