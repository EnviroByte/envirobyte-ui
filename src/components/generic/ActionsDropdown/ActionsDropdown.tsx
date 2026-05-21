"use client";

import { type ReactNode } from "react";
import { cn } from "../../../lib/utils";
import { Tooltip } from "../Tooltip";

export interface ActionItem {
  label: string;
  value: string;
  icon?: ReactNode;
  danger?: boolean;
  disabled?: boolean;
}

export interface ActionsDropdownProps {
  items: ActionItem[];
  onSelect: (value: string) => void;
  className?: string;
}

export function ActionsDropdown({ items, onSelect, className }: ActionsDropdownProps) {
  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      {items.map((item) => (
        <Tooltip key={item.value} content={item.label} position="top">
          <button
            type="button"
            aria-label={item.label}
            disabled={item.disabled}
            onClick={() => {
              if (!item.disabled) onSelect(item.value);
            }}
            className={cn(
              "inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors",
              "hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/40",
              actionColor(item),
              item.disabled && "cursor-not-allowed opacity-40",
            )}
          >
            {item.icon ? (
              <span className="h-4 w-4 shrink-0">{item.icon}</span>
            ) : (
              <span className="text-xs font-semibold">
                {item.label.slice(0, 1).toUpperCase()}
              </span>
            )}
          </button>
        </Tooltip>
      ))}
    </div>
  );
}

function actionColor(item: ActionItem) {
  if (item.danger || item.value === "delete") return "text-red-500 hover:text-red-600";
  switch (item.value) {
    case "history":
      return "text-cyan-500 hover:text-cyan-600";
    case "view":
      return "text-blue-500 hover:text-blue-600";
    case "edit":
      return "text-amber-500 hover:text-amber-600";
    default:
      return "text-gray-500 hover:text-gray-700";
  }
}
