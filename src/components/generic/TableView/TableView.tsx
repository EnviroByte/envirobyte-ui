"use client";

import { useState, useMemo, type ReactNode } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "../../../lib/utils";
import { EmptyState } from "../EmptyState";
import { ErrorState } from "../ErrorState";
import { Spinner } from "../Spinner";
import { Pagination } from "../Pagination";
import { ActionsDropdown, type ActionItem } from "../ActionsDropdown";

// ── Constants ─────────────────────────────────────────────────────────────────

const TH_BASE =
  "py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-t border-b border-gray-100";

/** Fixed widths for the built-in Actions column (must match stickyRightOffset fallbacks). */
const ACTIONS_STICKY_W = "w-[128px] min-w-[128px]";
const ACTIONS_STICKY_W_ACCESSORY = "w-[160px] min-w-[160px]";
const ACTIONS_STICKY_OFFSET = "128px";
const ACTIONS_STICKY_OFFSET_ACCESSORY = "160px";

// ── Types ─────────────────────────────────────────────────────────────────────

export type SortDirection = "asc" | "desc";
export type SortState = { key: string; direction: SortDirection } | null;

export interface TableViewColumn<T> {
  key: string;
  header: string;
  headerClassName?: string;
  cellClassName?: string;
  render: (row: T) => ReactNode;
  /** Pin this column sticky to the right, immediately before the Actions column. */
  stickyRight?: boolean;
  /**
   * When stickyRight is true, override the right offset (e.g. "196px").
   * Defaults to "0px". Use this when stacking multiple sticky-right columns
   * so each sits immediately to the left of the ones after it.
   */
  stickyRightOffset?: string;
  /** Enable sorting on this column. Default false. */
  sortable?: boolean;
  /** Custom compare function for client-side sort. Receives two row values. */
  sortFn?: (a: T, b: T) => number;
}

export interface TableViewProps<T> {
  columns: TableViewColumn<T>[];
  data: T[];
  loading?: boolean;
  error?: string | null;
  errorTitle?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  rowKey: (row: T) => string | number;
  /** Return menu items for a given row. Presence enables the sticky Actions column. */
  actionItems?: (row: T) => ActionItem[];
  /** Called when an action menu item is selected. */
  onAction?: (value: string, row: T) => void;
  /** Optional content rendered inside the Actions cell, before the dropdown (e.g. status icons). */
  rowAccessory?: (row: T) => ReactNode;
  totalPages?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  /**
   * Controlled sort state. If provided, the component is "controlled" — sorting
   * is driven externally (e.g. server-side). Omit for client-side sort.
   */
  sort?: SortState;
  /** Called when the user clicks a sortable column header. */
  onSort?: (sort: SortState) => void;
  /** Called when a row is clicked. Enables cursor-pointer on rows. */
  onRowClick?: (row: T) => void;
  className?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function defaultSort<T>(a: T, b: T, key: string): number {
  const aVal = (a as Record<string, unknown>)[key];
  const bVal = (b as Record<string, unknown>)[key];
  if (aVal == null && bVal == null) return 0;
  if (aVal == null) return 1;
  if (bVal == null) return -1;
  if (typeof aVal === "number" && typeof bVal === "number") return aVal - bVal;
  return String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
}

// ── Component ─────────────────────────────────────────────────────────────────

export function TableView<T,>({
  columns,
  data,
  loading,
  error,
  errorTitle = "Failed to load data",
  emptyTitle = "No data found",
  emptyDescription,
  rowKey,
  actionItems,
  onAction,
  rowAccessory,
  totalPages,
  currentPage,
  onPageChange,
  sort: controlledSort,
  onSort,
  onRowClick,
  className,
}: TableViewProps<T>) {
  const isControlled = controlledSort !== undefined;
  const [internalSort, setInternalSort] = useState<SortState>(null);
  const activeSort = isControlled ? controlledSort : internalSort;

  const hasActions = !!actionItems;
  const hasAccessory = !!rowAccessory;
  const actionsW = hasAccessory ? ACTIONS_STICKY_W_ACCESSORY : ACTIONS_STICKY_W;
  const actionsStickyOffset = hasAccessory
    ? ACTIONS_STICKY_OFFSET_ACCESSORY
    : ACTIONS_STICKY_OFFSET;
  const stickyRightColumns = useMemo(
    () => columns.filter((c) => c.stickyRight),
    [columns],
  );

  function stickyRightOffset(col: TableViewColumn<T>) {
    if (!col.stickyRight) return undefined;
    if (col.stickyRightOffset != null) return col.stickyRightOffset;
    const idx = stickyRightColumns.indexOf(col);
    const isRightmostSticky = idx === stickyRightColumns.length - 1;
    if (hasActions && isRightmostSticky) return actionsStickyOffset;
    return "0px";
  }

  function stickyRightStack(col: TableViewColumn<T>) {
    const idx = stickyRightColumns.indexOf(col);
    if (idx < 0) return null;
    return {
      isLeftmost: idx === 0,
      isRightmost: idx === stickyRightColumns.length - 1,
      // All sticky-right columns use the same z-index so they sit side-by-side
      // at the same visual level. Each column's `right` offset positions it
      // correctly; no stacking order is needed between them.
      bodyZ: "z-[2]" as const,
      headerZ: "z-[4]" as const,
    };
  }

  function setSort(key: string, direction: SortDirection) {
    // Clicking the already-active direction clears the sort
    const next: SortState =
      activeSort?.key === key && activeSort.direction === direction
        ? null
        : { key, direction };

    if (isControlled) {
      onSort?.(next);
    } else {
      setInternalSort(next);
      onSort?.(next);
    }
  }

  const sortedData = useMemo(() => {
    if (isControlled || !activeSort) return data;
    const col = columns.find((c) => c.key === activeSort.key);
    const compareFn = col?.sortFn ?? ((a: T, b: T) => defaultSort(a, b, activeSort.key));
    const sorted = [...data].sort(compareFn);
    return activeSort.direction === "desc" ? sorted.reverse() : sorted;
  }, [data, activeSort, isControlled, columns]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <ErrorState title={errorTitle} description="Please try again later." />;
  }

  if (sortedData.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <>
      <div className={cn("w-full overflow-x-auto", className)}>
        <table className="w-full min-w-max text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-gray-50/50">
              {columns.map((col, i) => {
                const isFirst = i === 0;
                const isLast = i === columns.length - 1;
                const isSorted = activeSort?.key === col.key;
                const stickyStack = stickyRightStack(col);

                return (
                  <th
                    key={col.key}
                    style={col.stickyRight ? { right: stickyRightOffset(col) } : undefined}
                    className={cn(
                      TH_BASE,
                      isFirst && "rounded-tl-lg",
                      isLast && !hasActions && !col.stickyRight && "rounded-tr-lg",
                      stickyStack && [
                        "sticky bg-gray-50",
                        stickyStack.headerZ,
                        stickyStack.isLeftmost && "border-l border-gray-100",
                        stickyStack.isRightmost && !hasActions && "rounded-tr-lg",
                      ],
                      col.headerClassName,
                    )}
                  >
                    {col.sortable ? (
                      <span className="inline-flex items-center gap-2">
                        <span>{col.header}</span>
                        <span className="inline-flex items-center gap-0.5">
                          <button
                            type="button"
                            title="Sort ascending"
                            onClick={() => setSort(col.key, "asc")}
                            className={cn(
                              "rounded p-0.5 transition-colors",
                              isSorted && activeSort?.direction === "asc"
                                ? "text-primary bg-primary/10"
                                : "text-gray-300 hover:text-gray-600 hover:bg-gray-100",
                            )}
                          >
                            <ArrowUp className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            title="Sort descending"
                            onClick={() => setSort(col.key, "desc")}
                            className={cn(
                              "rounded p-0.5 transition-colors",
                              isSorted && activeSort?.direction === "desc"
                                ? "text-primary bg-primary/10"
                                : "text-gray-300 hover:text-gray-600 hover:bg-gray-100",
                            )}
                          >
                            <ArrowDown className="h-4 w-4" />
                          </button>
                        </span>
                      </span>
                    ) : (
                      col.header
                    )}
                  </th>
                );
              })}

              {hasActions && (
                <th
                  className={cn(
                    TH_BASE,
                    "rounded-tr-lg sticky right-0 z-[5] bg-gray-50 border-l border-gray-100",
                    actionsW,
                  )}
                >
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {sortedData.map((row) => (
                <tr
                  key={rowKey(row)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(
                    "border-b border-gray-100 hover:bg-gray-50/50 transition-colors group",
                    onRowClick && "cursor-pointer",
                  )}
                >
                  {columns.map((col) => {
                    const stickyStack = stickyRightStack(col);

                    return (
                    <td
                      key={col.key}
                      style={col.stickyRight ? { right: stickyRightOffset(col) } : undefined}
                      className={cn(
                        "py-3 px-4",
                        stickyStack && [
                          "sticky bg-white group-hover:bg-gray-50",
                          stickyStack.bodyZ,
                          stickyStack.isLeftmost && "border-l border-gray-100",
                        ],
                        col.cellClassName,
                      )}
                    >
                      {col.render(row)}
                    </td>
                    );
                  })}

                  {hasActions && actionItems && (
                    <td
                      onClick={(e) => e.stopPropagation()}
                      className={cn(
                        "py-3 px-4 sticky right-0 z-[3] !bg-white border-l border-gray-100 group-hover:!bg-gray-50",
                        actionsW,
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <ActionsDropdown
                          items={actionItems(row)}
                          onSelect={(value) => onAction?.(value, row)}
                        />
                        {hasAccessory && rowAccessory && rowAccessory(row)}
                      </div>
                    </td>
                  )}
                </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages && totalPages > 1 && onPageChange && currentPage ? (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={onPageChange}
        />
      ) : null}
    </>
  );
}
