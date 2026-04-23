"use client";

import { Loader2 } from "lucide-react";
import { cn } from "../../../lib/utils";

export interface ConfirmInlineActionProps {
  /** Short prompt shown before the action buttons. Defaults to "Delete?". */
  message?: string;
  /** Confirm label. Defaults to "Yes". */
  confirmLabel?: string;
  /** Cancel label. Defaults to "No". */
  cancelLabel?: string;
  /** Called when the user confirms. */
  onConfirm: () => void;
  /** Called when the user cancels. */
  onCancel: () => void;
  /** When true, the confirm button shows a spinner and is disabled. */
  busy?: boolean;
  /** Visual tone of the confirm button. Defaults to `danger`. */
  tone?: "danger" | "primary";
  className?: string;
}

const toneStyles = {
  danger: "text-error hover:text-red-700",
  primary: "text-primary hover:text-primary-hover",
};

/**
 * A compact inline confirm-then-act control for table rows.
 *
 * Renders: "Delete?  Yes  No" in a small, row-friendly layout. The parent is
 * responsible for toggling visibility (i.e. storing `confirmId` in state).
 */
export function ConfirmInlineAction({
  message = "Delete?",
  confirmLabel = "Yes",
  cancelLabel = "No",
  onConfirm,
  onCancel,
  busy = false,
  tone = "danger",
  className,
}: ConfirmInlineActionProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-2 text-xs",
        className
      )}
    >
      <span className="text-gray-500">{message}</span>
      <button
        type="button"
        onClick={onConfirm}
        disabled={busy}
        className={cn(
          "font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
          toneStyles[tone]
        )}
      >
        {busy ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          confirmLabel
        )}
      </button>
      <button
        type="button"
        onClick={onCancel}
        disabled={busy}
        className="font-semibold text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {cancelLabel}
      </button>
    </div>
  );
}
