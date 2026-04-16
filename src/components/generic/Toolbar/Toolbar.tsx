import type { ReactNode } from "react";
import { cn } from "../../../lib/utils";

export interface ToolbarProps {
  /** Left-aligned slot, typically a search input. */
  leading?: ReactNode;
  /** Middle slot, typically filters / selects. */
  middle?: ReactNode;
  /** Right-aligned slot, typically action buttons. */
  trailing?: ReactNode;
  /** Extra classes. */
  className?: string;
}

/**
 * Table / list toolbar with three slots. Wraps responsively.
 *
 * Typical usage:
 * ```tsx
 * <Toolbar
 *   leading={<SearchInput ... />}
 *   middle={<><FilterSelect /> <FilterSelect /></>}
 *   trailing={<Button>Export</Button>}
 * />
 * ```
 */
export function Toolbar({
  leading,
  middle,
  trailing,
  className,
}: ToolbarProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        "p-4 border-b border-gray-200 bg-white",
        className
      )}
    >
      {leading && <div className="flex items-center gap-2">{leading}</div>}
      {middle && (
        <div className="flex flex-wrap items-center gap-2">{middle}</div>
      )}
      {trailing && (
        <div className="flex items-center gap-2 sm:ml-auto">{trailing}</div>
      )}
    </div>
  );
}
