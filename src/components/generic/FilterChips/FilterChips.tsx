"use client";

import { X } from "lucide-react";

export interface FilterChip {
  id: string;
  label: string;
  category: string;
}

interface FilterChipsProps {
  chips: FilterChip[];
  onRemove: (chip: FilterChip) => void;
  onClearAll: () => void;
}

export function FilterChips({
  chips,
  onRemove,
  onClearAll,
}: FilterChipsProps) {
  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
      <div className="flex flex-wrap items-center gap-3">
        {chips.map((chip) => (
          <div
            key={chip.id}
            className="flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary rounded-full text-sm font-medium"
          >
            <span>{chip.label}</span>
            <button
              onClick={() => onRemove(chip)}
              className="hover:bg-primary-200 rounded-full p-0.5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={onClearAll}
        className="px-4 py-2 border border-primary text-primary hover:bg-primary-50 text-sm font-medium rounded-md transition-colors flex items-center gap-2"
      >
        Clear All Filters
      </button>
    </div>
  );
}
