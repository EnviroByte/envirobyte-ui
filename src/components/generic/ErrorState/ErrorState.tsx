"use client";

import { AlertCircle } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "../../../lib/utils";

export interface ErrorStateProps {
  icon?: ReactNode;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function ErrorState({
  icon,
  title = "Something went wrong",
  description = "Please try again or contact support.",
  actionLabel,
  onAction,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col gap-3",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="text-red-500">
          {icon || <AlertCircle className="h-6 w-6" />}
        </div>
        <div className="text-lg font-bold text-gray-900">{title}</div>
      </div>
      <div className="text-sm text-gray-500 font-medium">{description}</div>
      {actionLabel && onAction && (
        <button
          type="button"
          className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-md text-sm font-medium w-fit transition-colors"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
