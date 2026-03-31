import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../../lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "block w-full rounded-md border shadow-sm transition-colors",
              "text-sm text-gray-900 placeholder:text-gray-400",
              "focus:outline-none focus:ring-2 focus:ring-offset-0",
              "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
              error
                ? "border-error focus:ring-error"
                : "border-gray-300 focus:ring-primary focus:border-primary",
              leftIcon ? "pl-10" : "pl-3",
              rightIcon ? "pr-10" : "pr-3",
              "py-2",
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p id={`${inputId}-error`} className="mt-1 text-sm text-error">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${inputId}-hint`} className="mt-1 text-sm text-gray-500">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
