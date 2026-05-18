"use client";

import { useMemo } from "react";
import Select, { type StylesConfig } from "react-select";
import { FilterChips, type FilterChip } from "../FilterChips/FilterChips";
import { cn } from "../../../lib/utils";

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  key: string;
  label: string;
  type?: "select" | "text";
  options?: FilterOption[];
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export type FilterValues = Record<string, FilterOption[] | string>;

export interface FilterBarProps {
  filters: FilterConfig[];
  values: FilterValues;
  onChange: (next: FilterValues) => void;
  onClearAll?: () => void;
  columns?: { base?: number; md?: number; lg?: number };
  showChips?: boolean;
  className?: string;
}

const defaultSelectStyles: StylesConfig<FilterOption, true> = {
  control: (base, state) => ({
    ...base,
    backgroundColor: state.isDisabled ? "#f3f4f6" : "white",
    borderColor: "#e5e7eb",
    minHeight: "42px",
    boxShadow: "none",
    outline: "none",
    "&:hover": {
      borderColor: "#02364B",
    },
  }),
  input: (base) => ({
    ...base,
    outline: "none",
    boxShadow: "none",
  }),
  placeholder: (base) => ({
    ...base,
    color: "#9ca3af",
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: "#e8eef0",
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: "#02364B",
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: "#02364B",
    "&:hover": {
      backgroundColor: "#c5d4d9",
      color: "#022a3a",
    },
  }),
  menu: (base) => ({
    ...base,
    zIndex: 20,
  }),
};

function gridColsClass(cols: { base?: number; md?: number; lg?: number }) {
  const base = cols.base ?? 1;
  const md = cols.md ?? 3;
  const lg = cols.lg ?? 4;
  const baseMap: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
  };
  const mdMap: Record<number, string> = {
    1: "md:grid-cols-1",
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
    5: "md:grid-cols-5",
    6: "md:grid-cols-6",
  };
  const lgMap: Record<number, string> = {
    1: "lg:grid-cols-1",
    2: "lg:grid-cols-2",
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-4",
    5: "lg:grid-cols-5",
    6: "lg:grid-cols-6",
  };
  return cn(baseMap[base], mdMap[md], lgMap[lg]);
}

export function FilterBar({
  filters,
  values,
  onChange,
  onClearAll,
  columns,
  showChips = true,
  className,
}: FilterBarProps) {
  const configByKey = useMemo(() => {
    const map: Record<string, FilterConfig> = {};
    filters.forEach((f) => {
      map[f.key] = f;
    });
    return map;
  }, [filters]);

  const chips: FilterChip[] = useMemo(() => {
    const result: FilterChip[] = [];
    Object.entries(values).forEach(([key, selected]) => {
      if (!selected) return;
      const cfg = configByKey[key];
      if (cfg?.type === "text" || typeof selected === "string") return;
      const opts = selected as FilterOption[];
      if (opts.length === 0) return;
      opts.forEach((opt, index) => {
        result.push({
          id: `${key}__${index}`,
          label: `${cfg?.label ?? key}: ${opt.label}`,
          category: key,
        });
      });
    });
    return result;
  }, [values, configByKey]);

  const handleSelectChange = (key: string, next: readonly FilterOption[] | null) => {
    onChange({ ...values, [key]: next ? [...next] : [] });
  };

  const handleTextChange = (key: string, next: string) => {
    onChange({ ...values, [key]: next });
  };

  const handleRemoveChip = (chip: FilterChip) => {
    const [key, indexStr] = chip.id.split("__");
    const index = parseInt(indexStr, 10);
    const current = values[key];
    if (!Array.isArray(current)) return;
    const nextForKey = current.filter((_, i) => i !== index);
    onChange({ ...values, [key]: nextForKey });
  };

  const handleClearAll = () => {
    if (onClearAll) {
      onClearAll();
      return;
    }
    const cleared: FilterValues = {};
    filters.forEach((f) => {
      cleared[f.key] = f.type === "text" ? "" : [];
    });
    onChange(cleared);
  };

  return (
    <div className={cn("w-full", className)}>
      <div className={cn("grid gap-4", gridColsClass(columns ?? {}))}>
        {filters.map((filter) => (
          <div key={filter.key}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {filter.label}
            </label>
            {filter.type === "text" ? (
              <input
                type="text"
                value={(values[filter.key] as string) ?? ""}
                onChange={(e) => handleTextChange(filter.key, e.target.value)}
                placeholder={filter.placeholder ?? `Search ${filter.label.toLowerCase()}`}
                disabled={filter.disabled}
                className="w-full h-[42px] rounded-md border border-gray-200 px-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none hover:border-[#02364B] focus:border-[#02364B] transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            ) : (
              <Select<FilterOption, true>
                options={filter.options ?? []}
                value={(values[filter.key] as FilterOption[]) || []}
                onChange={(next) => handleSelectChange(filter.key, next)}
                placeholder={filter.placeholder ?? "Select"}
                isClearable
                isMulti
                isSearchable
                controlShouldRenderValue={true}
                styles={defaultSelectStyles}
                isLoading={filter.isLoading}
                isDisabled={filter.disabled}
                instanceId={`filterbar-${filter.key}`}
              />
            )}
          </div>
        ))}
      </div>

      {showChips && (
        <FilterChips
          chips={chips}
          onRemove={handleRemoveChip}
          onClearAll={handleClearAll}
        />
      )}
    </div>
  );
}
