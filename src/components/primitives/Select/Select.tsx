import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "../../../lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export function Select({
  value,
  onChange,
  options,
  label,
  placeholder = "Select an option",
  error,
  disabled = false,
  className,
}: SelectProps) {
  const selected = options.find((o) => o.value === value);

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label className="block text-sm font-medium text-[var(--color-gray-700)] mb-1">
          {label}
        </label>
      )}
      <Listbox value={value} onChange={onChange} disabled={disabled}>
        <div className="relative">
          <ListboxButton
            className={cn(
              "relative w-full cursor-pointer rounded-[var(--radius-md)] border bg-white py-2 pl-3 pr-10 text-left shadow-[var(--shadow-sm)] text-sm",
              "focus:outline-none focus:ring-2 focus:ring-offset-0",
              "disabled:bg-[var(--color-gray-50)] disabled:cursor-not-allowed",
              error
                ? "border-[var(--color-error)] focus:ring-[var(--color-error)]"
                : "border-[var(--color-gray-300)] focus:ring-[var(--color-primary)]"
            )}
          >
            <span
              className={cn(
                "block truncate",
                selected
                  ? "text-[var(--color-gray-900)]"
                  : "text-[var(--color-gray-400)]"
              )}
            >
              {selected?.label || placeholder}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDown className="h-4 w-4 text-[var(--color-gray-400)]" />
            </span>
          </ListboxButton>

          <ListboxOptions
            transition
            className={cn(
              "absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-[var(--radius-md)] bg-white py-1 text-sm shadow-[var(--shadow-lg)] ring-1 ring-black/5",
              "focus:outline-none",
              "transition-all duration-100 data-[closed]:opacity-0 data-[closed]:scale-95"
            )}
          >
            {options.map((option) => (
              <ListboxOption
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className={cn(
                  "relative cursor-pointer select-none py-2 pl-10 pr-4",
                  "data-[focus]:bg-[var(--color-primary)] data-[focus]:text-white",
                  "data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
                )}
              >
                {({ selected: isSelected }) => (
                  <>
                    <span
                      className={cn(
                        "block truncate",
                        isSelected ? "font-medium" : "font-normal"
                      )}
                    >
                      {option.label}
                    </span>
                    {isSelected && (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <Check className="h-4 w-4" />
                      </span>
                    )}
                  </>
                )}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </Listbox>
      {error && (
        <p className="mt-1 text-sm text-[var(--color-error)]">{error}</p>
      )}
    </div>
  );
}
