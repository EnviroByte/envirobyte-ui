"use client";

import { useMemo } from "react";
import Select, { type StylesConfig } from "react-select";
import AsyncSelect from "react-select/async";
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
  /** When provided, the filter uses async server-side search instead of a static options list. */
  loadOptions?: (input: string) => Promise<FilterOption[]>;
  /**
   * Pre-loaded options shown before the user types (react-select defaultOptions).
   * Pass `true` to call loadOptions("") on mount, or pass an explicit array.
   */
  defaultOptions?: FilterOption[] | boolean;
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
    borderColor: state.isFocused ? "var(--color-primary)" : "#e5e7eb",
    minHeight: "42px",
    boxShadow: "none",
    outline: "none",
    "&:hover": {
      borderColor: "var(--color-primary)",
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
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "var(--color-primary-50)"
      : state.isFocused
        ? "var(--color-gray-50)"
        : "white",
    color: state.isSelected ? "var(--color-primary)" : "#374151",
    cursor: "pointer",
    fontWeight: state.isSelected ? 500 : 400,
    ":active": {
      backgroundColor: state.isSelected
        ? "var(--color-primary-50)"
        : "var(--color-gray-50)",
    },
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: "var(--color-primary-50)",
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: "var(--color-primary)",
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: "var(--color-primary)",
    "&:hover": {
      backgroundColor: "var(--color-primary-100)",
      color: "var(--color-primary-hover)",
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
                className="w-full h-[42px] rounded-md border border-gray-200 px-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none hover:border-primary focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-1 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            ) : filter.loadOptions ? (
              <AsyncSelect<FilterOption, true>
                loadOptions={filter.loadOptions}
                defaultOptions={filter.defaultOptions ?? true}
                value={(values[filter.key] as FilterOption[]) || []}
                onChange={(next) => handleSelectChange(filter.key, next)}
                placeholder={filter.placeholder ?? "Type to search…"}
                isClearable
                isMulti
                isSearchable
                controlShouldRenderValue={true}
                styles={defaultSelectStyles}
                isLoading={filter.isLoading}
                isDisabled={filter.disabled}
                instanceId={`filterbar-async-${filter.key}`}
                noOptionsMessage={({ inputValue }) =>
                  inputValue ? "No results found" : "Type to search…"
                }
                loadingMessage={() => "Searching…"}
                // Server-side search: the API decides what matches, so never
                // re-filter results client-side. Also do NOT cache per-input —
                // caching would pin a stale/empty result (e.g. a transient error)
                // for that exact query until remount.
                filterOption={null}
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
