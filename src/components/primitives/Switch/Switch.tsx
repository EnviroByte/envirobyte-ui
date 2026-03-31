import { Switch as HeadlessSwitch } from "@headlessui/react";
import { cn } from "../../../lib/utils";

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: "sm" | "md";
  className?: string;
}

const trackSizes = {
  sm: "h-5 w-9",
  md: "h-6 w-11",
};

const thumbSizes = {
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
};

const thumbTranslate = {
  sm: "data-[checked]:translate-x-4 translate-x-0.5",
  md: "data-[checked]:translate-x-5 translate-x-0.5",
};

export function Switch({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = "md",
  className,
}: SwitchProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <HeadlessSwitch
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={cn(
          "relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out",
          "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "data-[checked]:bg-[var(--color-primary)] bg-[var(--color-gray-200)]",
          trackSizes[size]
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none inline-block rounded-full bg-white shadow-[var(--shadow-sm)] ring-0 transition duration-200 ease-in-out",
            thumbSizes[size],
            thumbTranslate[size]
          )}
        />
      </HeadlessSwitch>
      {(label || description) && (
        <div>
          {label && (
            <span className="text-sm font-medium text-[var(--color-gray-900)]">
              {label}
            </span>
          )}
          {description && (
            <p className="text-sm text-[var(--color-gray-500)]">
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
