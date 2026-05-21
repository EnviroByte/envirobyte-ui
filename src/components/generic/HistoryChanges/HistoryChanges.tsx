"use client";

import {
  formatChangeValue,
  formatFieldLabel,
  isLongChangeValue,
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
    <div className={`rounded-lg border border-gray-200 bg-white ${compact ? "" : "shadow-sm"}`}>
      <div className="divide-y divide-gray-100">
        {entries.map(([field, change]) => {
          const oldVal = formatChangeValue(change.old);
          const newVal = formatChangeValue(change.new);
          const longForm = isLongChangeValue(oldVal) || isLongChangeValue(newVal);

          return (
            <div key={field} className="px-3 py-2.5">
              <p className="text-xs font-medium text-gray-600 mb-1.5">{formatFieldLabel(field)}</p>
              {longForm ? (
                <div className="space-y-1.5 text-xs leading-relaxed">
                  {oldVal !== "—" && (
                    <p className="text-gray-400 line-through break-words">{oldVal}</p>
                  )}
                  <p className="text-gray-800 font-medium break-words">{newVal}</p>
                </div>
              ) : (
                <p className="text-xs text-gray-700">
                  <span className="text-gray-400 line-through">{oldVal}</span>
                  <span className="mx-2 text-gray-300" aria-hidden="true">→</span>
                  <span className="font-medium text-gray-900">{newVal}</span>
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
