"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { MoreVertical } from "lucide-react";
import { cn } from "../../../lib/utils";

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
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(
    null,
  );
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  const reposition = useCallback(() => {
    const btn = triggerRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const menuW = 224;
    let left = rect.right - menuW;
    if (left < 8) left = 8;
    setCoords({ top: rect.bottom + 4, left });
  }, []);

  useEffect(() => {
    if (!open) return;
    reposition();

    function onClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        panelRef.current &&
        !panelRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        close();
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    function onScroll() {
      close();
    }

    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", close);

    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", close);
    };
  }, [open, close, reposition]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex items-center justify-center rounded-md p-1.5",
          "text-gray-400 hover:text-gray-700 hover:bg-gray-100",
          "transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40",
          className,
        )}
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {open &&
        coords &&
        createPortal(
          <div
            ref={panelRef}
            role="menu"
            style={{
              position: "fixed",
              top: coords.top,
              left: coords.left,
              zIndex: 9999,
            }}
            className="w-56 rounded-lg bg-white py-1 shadow-lg ring-1 ring-black/5"
          >
            {items.map((item) => (
              <button
                key={item.value}
                role="menuitem"
                type="button"
                disabled={item.disabled}
                onClick={() => {
                  if (!item.disabled) {
                    onSelect(item.value);
                    close();
                  }
                }}
                className={cn(
                  "flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                  "hover:bg-gray-50 focus:bg-gray-50 focus:outline-none",
                  item.danger
                    ? "text-red-600 hover:text-red-700"
                    : "text-gray-700 hover:text-gray-900",
                  item.disabled && "opacity-50 cursor-not-allowed",
                )}
              >
                {item.icon && (
                  <span className="h-4 w-4 shrink-0">{item.icon}</span>
                )}
                {item.label}
              </button>
            ))}
          </div>,
          document.body,
        )}
    </>
  );
}
