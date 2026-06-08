"use client";

import { cn } from "../../../lib/utils";

export interface SearchTriggerButtonProps {
  /** Called when the button is clicked */
  onClick: () => void;
  /** Placeholder text shown in the button */
  placeholder?: string;
  /** Keyboard shortcut label displayed on the right side */
  shortcut?: string;
  /** Additional classes on the button element */
  className?: string;
}

export function SearchTriggerButton({
  onClick,
  placeholder = "Search...",
  shortcut = "⌘K",
  className,
}: SearchTriggerButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-9 items-center gap-2 rounded-md border border-gray-200 bg-gray-100 px-3 text-sm text-gray-500 transition-colors duration-150",
        "hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600",
        className
      )}
    >
      <svg
        className="shrink-0 fill-current text-gray-400 dark:text-gray-500"
        width={12}
        height={12}
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7ZM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5Z" />
        <path d="m13.314 11.9 2.393 2.393a.999.999 0 1 1-1.414 1.414L11.9 13.314a8.019 8.019 0 0 0 1.414-1.414Z" />
      </svg>
      <span className="flex-1 text-left">{placeholder}</span>
      {shortcut && (
        <kbd className="rounded border border-gray-300 bg-gray-200 px-1.5 py-0.5 font-sans text-[10px] text-gray-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white">
          {shortcut}
        </kbd>
      )}
    </button>
  );
}
