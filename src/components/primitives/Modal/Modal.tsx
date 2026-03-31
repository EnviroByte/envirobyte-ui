import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "../../../lib/utils";

const sizeStyles = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-[90vw]",
};

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: keyof typeof sizeStyles;
  children: ReactNode;
  className?: string;
  showCloseButton?: boolean;
}

export function Modal({
  open,
  onClose,
  title,
  description,
  size = "md",
  children,
  className,
  showCloseButton = true,
}: ModalProps) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/30 transition-opacity duration-300 data-[closed]:opacity-0"
      />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          transition
          className={cn(
            "w-full rounded-[var(--radius-xl)] bg-white shadow-[var(--shadow-lg)]",
            "transition-all duration-300 data-[closed]:scale-95 data-[closed]:opacity-0",
            sizeStyles[size],
            className
          )}
        >
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between border-b border-[var(--color-gray-200)] px-6 py-4">
              <div>
                {title && (
                  <DialogTitle className="text-lg font-semibold text-[var(--color-gray-900)]">
                    {title}
                  </DialogTitle>
                )}
                {description && (
                  <p className="mt-1 text-sm text-[var(--color-gray-500)]">
                    {description}
                  </p>
                )}
              </div>
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="rounded-[var(--radius-md)] p-1 text-[var(--color-gray-400)] hover:text-[var(--color-gray-600)] hover:bg-[var(--color-gray-100)] transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          )}

          <div className="px-6 py-4">{children}</div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
