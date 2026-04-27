"use client";

import { Menu, MenuButton, MenuItems, MenuItem, Portal } from "@headlessui/react";
import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "../../../lib/utils";

export interface DropdownMenuItem {
  label: string;
  value: string;
  icon?: ReactNode;
  disabled?: boolean;
  danger?: boolean;
}

export interface DropdownMenuProps {
  trigger?: ReactNode;
  label?: string;
  items: DropdownMenuItem[];
  onSelect: (value: string) => void;
  align?: "left" | "right";
  className?: string;
}

export function DropdownMenu({
  trigger,
  label = "Options",
  items,
  onSelect,
  align = "left",
  className,
}: DropdownMenuProps) {
  return (
    <Menu as="div" className={cn("relative inline-block text-left", className)}>
      <MenuButton
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700",
          "hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1",
          "transition-colors"
        )}
      >
        {trigger || (
          <>
            {label}
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </>
        )}
      </MenuButton>

      <Portal>
        <MenuItems
          transition
          anchor={{ to: align === "right" ? "bottom end" : "bottom start", gap: 4 }}
          className={cn(
            "z-[200] w-56 rounded-lg bg-white shadow-lg ring-1 ring-black/5",
            "focus:outline-none",
            "transition-all duration-150 data-[closed]:scale-95 data-[closed]:opacity-0"
          )}
        >
          <div className="py-1">
            {items.map((item) => (
              <MenuItem key={item.value} disabled={item.disabled}>
                <button
                  type="button"
                  onClick={() => onSelect(item.value)}
                  className={cn(
                    "group flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                    "data-[focus]:bg-gray-50",
                    item.danger
                      ? "text-red-600 data-[focus]:text-red-700"
                      : "text-gray-700 data-[focus]:text-gray-900",
                    item.disabled && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {item.icon && (
                    <span className="h-4 w-4 shrink-0">{item.icon}</span>
                  )}
                  {item.label}
                </button>
              </MenuItem>
            ))}
          </div>
        </MenuItems>
      </Portal>
    </Menu>
  );
}
