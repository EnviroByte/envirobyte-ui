"use client";

import { Search } from "lucide-react";
import { cn } from "../../../lib/utils";

export interface SearchInputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function SearchInput({
  label,
  placeholder = "Search...",
  value,
  onChange,
  className,
}: SearchInputProps) {
  return (
    <div className={cn("flex flex-col gap-1.5 min-w-[200px]", className)}>
      {label && (
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full border border-gray-200 rounded-md py-2 pl-9 pr-3 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary bg-white"
        />
      </div>
    </div>
  );
}
