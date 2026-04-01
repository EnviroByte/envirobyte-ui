"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, X, Check, Search } from "lucide-react";
import { cn } from "../../../lib/utils";

export interface SearchableSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SearchableSelectProps {
  options: SearchableSelectOption[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  multiple?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export function SearchableSelect({
  options,
  value,
  onChange,
  label,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  multiple = false,
  disabled = false,
  error,
  className,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedValues = useMemo(() => {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }, [value]);

  const filtered = useMemo(
    () =>
      options.filter((o) =>
        o.label.toLowerCase().includes(search.toLowerCase())
      ),
    [options, search]
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  const toggleOption = (optValue: string) => {
    if (multiple) {
      const next = selectedValues.includes(optValue)
        ? selectedValues.filter((v) => v !== optValue)
        : [...selectedValues, optValue];
      onChange?.(next);
    } else {
      onChange?.(optValue);
      setOpen(false);
      setSearch("");
    }
  };

  const removeValue = (optValue: string) => {
    if (multiple) {
      onChange?.(selectedValues.filter((v) => v !== optValue));
    } else {
      onChange?.("");
    }
  };

  const displayText = () => {
    if (selectedValues.length === 0) return placeholder;
    if (!multiple) {
      return options.find((o) => o.value === selectedValues[0])?.label || placeholder;
    }
    return null;
  };

  return (
    <div className={cn("relative w-full", className)} ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen(!open)}
        className={cn(
          "relative w-full min-h-[38px] rounded-md border bg-white px-3 py-2 text-left text-sm transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-offset-0",
          "disabled:bg-gray-50 disabled:cursor-not-allowed",
          error
            ? "border-red-500 focus:ring-red-500"
            : "border-gray-200 focus:ring-primary",
          open && "ring-2 ring-primary"
        )}
      >
        <div className="flex items-center gap-2 flex-wrap pr-8">
          {multiple && selectedValues.length > 0
            ? selectedValues.map((sv) => {
                const opt = options.find((o) => o.value === sv);
                return (
                  <span
                    key={sv}
                    className="inline-flex items-center gap-1 bg-primary-50 text-primary rounded-md px-2 py-0.5 text-xs font-medium"
                  >
                    {opt?.label}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-primary-hover"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeValue(sv);
                      }}
                    />
                  </span>
                );
              })
            : (
              <span className={cn(selectedValues.length > 0 ? "text-gray-900" : "text-gray-400")}>
                {displayText()}
              </span>
            )}
        </div>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronDown
            className={cn(
              "h-4 w-4 text-gray-400 transition-transform",
              open && "rotate-180"
            )}
          />
        </span>
      </button>

      {open && (
        <div className="absolute left-0 right-0 z-50 mt-1 max-h-72 rounded-lg bg-white shadow-lg ring-1 ring-black/5 overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="max-h-52 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500">No results found</div>
            ) : (
              filtered.map((opt) => {
                const isSelected = selectedValues.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    disabled={opt.disabled}
                    onClick={() => toggleOption(opt.value)}
                    className={cn(
                      "flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                      "hover:bg-gray-50",
                      isSelected && "bg-primary-50 text-primary font-medium",
                      !isSelected && "text-gray-700",
                      opt.disabled && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {multiple && (
                      <span
                        className={cn(
                          "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
                          isSelected
                            ? "bg-primary border-primary text-white"
                            : "border-gray-300"
                        )}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                      </span>
                    )}
                    <span className="truncate">{opt.label}</span>
                    {!multiple && isSelected && (
                      <Check className="ml-auto h-4 w-4 text-primary" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
