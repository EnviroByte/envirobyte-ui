"use client";

import {
  formatChangeValue,
  formatFieldLabel,
  visibleChanges,
  type HistoryChange,
} from "./historyUtils";

export interface HistoryChangesProps {
  changes: Record<string, HistoryChange>;
  compact?: boolean;
}

export function HistoryChanges({ changes, compact = false }: HistoryChangesProps) {
  const entries = visibleChanges(changes);
  if (entries.length === 0) return null;

  return (
    <div className="w-full">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
        Field Changes
      </p>
      <div className="w-full rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
        {/* Column headers */}
        <div className="grid grid-cols-[1fr_auto_1fr] gap-0 border-b border-gray-100 px-4 py-2.5 bg-gray-50/60">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Before</span>
          <span className="w-8" />
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">After</span>
        </div>

        {/* Rows */}
        <div className="divide-y divide-gray-50">
          {entries.map(([field, change]) => {
            const oldVal = formatChangeValue(change.old);
            const newVal = formatChangeValue(change.new);

            return (
              <div key={field} className="px-4 py-3">
                <p className="text-xs font-medium text-gray-500 mb-2">
                  {formatFieldLabel(field)}
                </p>
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                  {/* Before */}
                  <div className="min-w-0">
                    <span className="inline-block w-full bg-gray-50 border border-gray-200 text-gray-500 text-sm rounded-lg px-3 py-2 break-words leading-snug line-through decoration-gray-400">
                      {oldVal}
                    </span>
                  </div>

                  {/* Arrow */}
                  <span className="text-gray-300 text-base font-light shrink-0">→</span>

                  {/* After */}
                  <div className="min-w-0">
                    <span className="inline-block w-full bg-primary/5 border border-primary/20 text-primary text-sm font-medium rounded-lg px-3 py-2 break-words leading-snug">
                      {newVal}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
