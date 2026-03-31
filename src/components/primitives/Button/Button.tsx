import { Button as HeadlessButton } from "@headlessui/react";
import { Loader2 } from "lucide-react";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../../lib/utils";

const variantStyles = {
  primary:
    "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] focus:ring-[var(--color-primary)]",
  secondary:
    "bg-[var(--color-gray-100)] text-[var(--color-gray-900)] hover:bg-[var(--color-gray-200)] focus:ring-[var(--color-gray-400)]",
  danger:
    "bg-[var(--color-error)] text-white hover:bg-[var(--color-red-700)] focus:ring-[var(--color-error)]",
  ghost:
    "text-[var(--color-gray-700)] hover:bg-[var(--color-gray-100)] focus:ring-[var(--color-gray-400)]",
  outline:
    "border border-[var(--color-gray-300)] text-[var(--color-gray-700)] hover:bg-[var(--color-gray-50)] focus:ring-[var(--color-primary)]",
};

const sizeStyles = {
  sm: "px-3 py-1.5 text-sm gap-1.5",
  md: "px-4 py-2 text-sm gap-2",
  lg: "px-5 py-2.5 text-base gap-2.5",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variantStyles;
  size?: keyof typeof sizeStyles;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      leftIcon,
      rightIcon,
      className,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <HeadlessButton
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center font-medium rounded-[var(--radius-md)] transition-colors duration-[var(--transition-fast)]",
          "focus:outline-none focus:ring-2 focus:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          leftIcon
        )}
        {children}
        {!loading && rightIcon}
      </HeadlessButton>
    );
  }
);

Button.displayName = "Button";
