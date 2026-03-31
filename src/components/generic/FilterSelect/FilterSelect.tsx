"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "../../../lib/utils";

export interface FilterSelectOption {
  value: string;
  label: string;
}

export interface FilterSelectProps {
  label?: string;
  options?: (string | FilterSelectOption)[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function FilterSelect({
  label,
  options = [],
  value,
  onChange,
  placeholder = "Select",
  className,
}: FilterSelectProps) {
  const isControlled = typeof value !== "undefined";

  return (
    <div className={cn("flex flex-col gap-1.5 w-48", className)}>
      {label && (
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {label}
        </label>
      )}

      <div className="relative">
        <select
          className="w-full appearance-none border border-gray-200 rounded-md py-2 px-3 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer bg-white"
          {...(isControlled
            ? { value, onChange: (e) => onChange?.(e.target.value) }
            : { defaultValue: "" })}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((opt) => {
            const v = typeof opt === "string" ? opt : opt.value;
            const t = typeof opt === "string" ? opt : opt.label;
            return (
              <option key={v} value={v}>
                {t}
              </option>
            );
          })}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}
