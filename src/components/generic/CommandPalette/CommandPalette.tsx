"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Search } from "lucide-react";
import { cn } from "../../../lib/utils";

export interface CommandPaletteItem {
  label: string;
  href: string;
  keywords?: string[];
}

export interface CommandPaletteRecentPage {
  label: string;
  href: string;
}

export interface CommandPaletteProps {
  /** Whether the palette is open */
  isOpen: boolean;
  /** Called when open state should change */
  onOpenChange: (open: boolean) => void;
  /** Searchable page/route items */
  items: CommandPaletteItem[];
  /** Recent search strings, managed externally (max ~5 recommended) */
  recentSearches?: string[];
  /** Recently visited pages, managed externally (max ~2 recommended) */
  recentPages?: CommandPaletteRecentPage[];
  /**
   * Called when user selects an item or recent page.
   * Receives the href to navigate to and the current query string.
   */
  onNavigate: (href: string, query: string) => void;
  /**
   * Called when user clicks a recent search term.
   * Receives the search string so the parent can log or persist it.
   */
  onRecentSearchClick?: (query: string) => void;
  /** Input placeholder text */
  placeholder?: string;
  /** Text shown when query has results but list is empty */
  emptyText?: string;
  /** Extra classes on the dialog panel */
  className?: string;
}

export function CommandPalette({
  isOpen,
  onOpenChange,
  items,
  recentSearches = [],
  recentPages = [],
  onNavigate,
  onRecentSearchClick,
  placeholder = "Search pages…",
  emptyText = "No results found",
  className,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.href.toLowerCase().includes(q) ||
        (item.keywords ?? []).some((k) => k.toLowerCase().includes(q))
    );
  }, [query, items]);

  // ⌘K / Ctrl+K to toggle, Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(!isOpen);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onOpenChange]);

  const handleNavigate = (href: string) => {
    onNavigate(href, query);
    onOpenChange(false);
    setQuery("");
  };

  const handleRecentSearchClick = (q: string) => {
    setQuery(q);
    onRecentSearchClick?.(q);
  };

  return (
    <Transition appear show={isOpen}>
      <Dialog as="div" className="relative z-50" onClose={() => onOpenChange(false)}>
        {/* Backdrop */}
        <TransitionChild
          as="div"
          className="fixed inset-0 bg-gray-900/30 transition-opacity"
          enter="transition ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition ease-out duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          aria-hidden="true"
        />

        {/* Panel wrapper */}
        <TransitionChild
          as="div"
          className="fixed inset-0 overflow-y-auto flex items-start justify-center px-4 pt-16 sm:px-6"
          enter="transition ease-in-out duration-200"
          enterFrom="opacity-0 translate-y-4"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in-out duration-200"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-4"
        >
          <DialogPanel
            className={cn(
              "w-full max-w-2xl max-h-[80vh] overflow-auto rounded-lg bg-white shadow-lg",
              "border border-transparent",
              "dark:bg-gray-800 dark:border-gray-700/60",
              className
            )}
          >
            {/* Search input row */}
            <div className="border-b border-gray-200 dark:border-gray-700/60">
              <div className="relative flex items-center">
                <label htmlFor="command-palette-input" className="sr-only">
                  Search
                </label>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500 pointer-events-none" />
                <input
                  id="command-palette-input"
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus
                  type="search"
                  className="w-full border-0 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0 dark:bg-gray-800 dark:text-gray-300 dark:placeholder-gray-500"
                  placeholder={placeholder}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Content */}
            <div className="space-y-4 px-2 py-3">
              {query.trim() ? (
                /* Search results */
                <div>
                  <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                    Results
                  </p>
                  <ul className="max-h-72 overflow-auto text-sm">
                    {filtered.length > 0 ? (
                      filtered.map((item) => (
                        <li key={item.href}>
                          <button
                            type="button"
                            className="flex w-full items-center rounded-lg p-2 text-left text-gray-800 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700/20"
                            onClick={() => handleNavigate(item.href)}
                          >
                            <span className="mr-2 font-medium">{item.label}</span>
                            <span className="truncate text-xs text-gray-500 dark:text-gray-400">
                              {item.href}
                            </span>
                          </button>
                        </li>
                      ))
                    ) : (
                      <li className="px-2 py-3 text-sm text-gray-500 dark:text-gray-400">
                        {emptyText}
                      </li>
                    )}
                  </ul>
                </div>
              ) : (
                /* Recents */
                <>
                  <div>
                    <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                      Recent Searches
                    </p>
                    <ul className="text-sm">
                      {recentSearches.length > 0 ? (
                        recentSearches.map((s, i) => (
                          <li key={`${s}-${i}`}>
                            <button
                              type="button"
                              className="flex w-full items-center rounded-lg p-2 text-left text-gray-800 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700/20"
                              onClick={() => handleRecentSearchClick(s)}
                            >
                              {s}
                            </button>
                          </li>
                        ))
                      ) : (
                        <li className="px-2 py-3 text-gray-500 dark:text-gray-400">None</li>
                      )}
                    </ul>
                  </div>

                  <div>
                    <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                      Recent Pages
                    </p>
                    <ul className="text-sm">
                      {recentPages.length > 0 ? (
                        recentPages.map((page) => (
                          <li key={page.href}>
                            <button
                              type="button"
                              className="flex w-full items-center rounded-lg p-2 text-left text-gray-800 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700/20"
                              onClick={() => handleNavigate(page.href)}
                            >
                              <span className="mr-2 font-medium">{page.label}</span>
                              <span className="truncate text-xs text-gray-500 dark:text-gray-400">
                                {page.href}
                              </span>
                            </button>
                          </li>
                        ))
                      ) : (
                        <li className="px-2 py-3 text-gray-500 dark:text-gray-400">None</li>
                      )}
                    </ul>
                  </div>
                </>
              )}
            </div>
          </DialogPanel>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
}
