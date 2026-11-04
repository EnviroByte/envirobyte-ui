"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { Check, ChevronDown, ChevronUp, Search, X } from "lucide-react";
import { cn } from "../../../lib/utils";

/**
 * A filter that lives in its chip: the label and what it is set to, in a pill.
 *
 * The chip shows the label and the current value; clicking it opens a menu
 * right under it. Single choice closes on pick; multi-select stays open and
 * has Clear / Select all. A list longer than eight gets a search box. With
 * only one option there is nothing to choose, so the chip is drawn as a
 * dashed, non-interactive label.
 *
 * Put the chips in an InlineFilterRow: it adds "Clear all" while any chip is
 * narrowed, and a tray under the row listing every pick. Same look as the
 * filters on EmissionX (Credit Management, Analytics).
 */

/* ------------------------------------------------------------ clear all */

/**
 * Every chip that is narrowed (a multi-select with a selection, a dialog
 * filter with a pick) registers how to clear itself here, and the chip row
 * shows "Clear all" while any are registered.
 *
 * A module-level store rather than React context, because many chips reach
 * the row through a portal: context follows the component tree, not
 * the DOM the chip lands in. Only one chip row is on screen at a time.
 */
const clearers = new Map<string, () => void>();
const listeners = new Set<() => void>();
let version = 0;
const emit = () => {
  version += 1;
  listeners.forEach((l) => l());
};
const subscribeClearers = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

function useRegisterClear(active: boolean, clear: () => void) {
  const id = useId();
  const clearRef = useRef(clear);
  useEffect(() => {
    clearRef.current = clear;
  });
  useEffect(() => {
    if (!active) return;
    clearers.set(id, () => clearRef.current());
    emit();
    return () => {
      clearers.delete(id);
      emit();
    };
  }, [active, id]);
}

function ClearAllButton() {
  useSyncExternalStore(
    subscribeClearers,
    () => version,
    () => 0,
  );
  if (clearers.size === 0) return null;
  return (
    <button
      type="button"
      onClick={() => [...clearers.values()].forEach((clear) => clear())}
      className="inline-flex h-8 items-center rounded-full px-2.5 text-[13px] font-medium text-primary transition-colors hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      Clear all
    </button>
  );
}

/* ---------------------------------------------------------- picks tray */

/**
 * Every narrowed multi-select chip also lists what it picked here, and the
 * chip row draws them as a "Filtering by" tray under the chips, so twenty picks are readable
 * without opening a menu. Module-level for the same reason as Clear all: the
 * chips reach the row through portals.
 */
type PickGroup = {
  label: string;
  total: number;
  items: { value: string; label: string }[];
  remove: (value: string) => void;
};
/* Keyed by when the chip mounted, so the tray lists groups in the order the
   chips sit in, whichever got its options first. */
const pickGroups = new Map<number, PickGroup>();
let mounted = 0;

function useRegisterPicks(group: PickGroup | null) {
  const [id] = useState(() => (mounted += 1));
  const groupRef = useRef(group);
  useEffect(() => {
    groupRef.current = group;
  });
  const key = group
    ? `${group.label}|${group.total}|${group.items.map((i) => i.value).join(",")}`
    : "";
  useEffect(() => {
    const g = groupRef.current;
    if (!g) return;
    pickGroups.set(id, {
      ...g,
      remove: (v) => groupRef.current?.remove(v),
    });
    emit();
    return () => {
      pickGroups.delete(id);
      emit();
    };
  }, [id, key]);
}

/** Past this many picks the tray folds to two lines behind "Show all". */
const TRAY_FOLD_AT = 10;

function PicksTray() {
  useSyncExternalStore(
    subscribeClearers,
    () => version,
    () => 0,
  );
  const [expanded, setExpanded] = useState(false);
  const groups = [...pickGroups.entries()]
    .sort(([a], [b]) => a - b)
    .map(([, g]) => g);
  if (!groups.length) return null;
  const count = groups.reduce((n, g) => n + g.items.length, 0);
  const folds = count > TRAY_FOLD_AT;

  return (
    <div
      role="group"
      aria-label="Filtering by"
      className="mt-2 flex flex-col gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2.5"
    >
      <div
        className={cn(
          "flex flex-col gap-1.5",
          folds && !expanded && "max-h-[3.75rem] overflow-hidden",
        )}
      >
        {groups.map((g, gi) => (
          <div
            key={`${g.label}-${gi}`}
            className={cn(
              "flex items-start gap-2.5",
              gi > 0 && "border-t border-gray-200 pt-1.5",
            )}
          >
            <span className="w-28 shrink-0 truncate text-xs leading-[26px] text-gray-500">
              {g.label}
              {g.items.length > 1 && ` · ${g.items.length}`}
            </span>
            <ul className="flex min-w-0 flex-wrap gap-1.5">
              {g.items.map((item) => (
                <li
                  key={item.value}
                  className="inline-flex h-[26px] items-center gap-0.5 rounded-md bg-gray-100 pl-2.5 pr-0.5 text-xs text-gray-900"
                >
                  {item.label}
                  <button
                    type="button"
                    aria-label={`Remove ${item.label} from ${g.label}`}
                    onClick={() => g.remove(item.value)}
                    className="flex size-5 cursor-pointer items-center justify-center rounded text-gray-500 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <X className="h-3 w-3" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {folds && (
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          aria-expanded={expanded}
          className="ml-[7.625rem] inline-flex cursor-pointer items-center gap-1 self-start text-xs font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {expanded ? "Show less" : `Show all ${count} picks`}
          {expanded ? (
            <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
          )}
        </button>
      )}
    </div>
  );
}

export type InlineFilterOption = {
  value: string;
  label: string;
  /** Secondary line, e.g. a Petrinex ID. Searchable. */
  hint?: string;
  /** Right-aligned count, e.g. rows behind the option. */
  count?: number | string;
};

type BaseProps = {
  label: string;
  options: InlineFilterOption[];
  /** Caption at the top of the menu, e.g. "Years with data". */
  menuCaption?: string;
  /** A link-style action under the options, e.g. "Manage scenarios". */
  menuFooter?: { label: string; onClick: () => void };
  isLoading?: boolean;
  /** A search box at the top of the menu. Defaults to on past eight options. */
  searchable?: boolean;
  searchPlaceholder?: string;
  className?: string;
  /** Long option names (scenarios): a wider chip and menu; what still does
   *  not fit is cut with "…" and the full name shows on hover. */
  wide?: boolean;
};

type SingleProps = BaseProps & {
  multiple?: false;
  value: string | null;
  onChange: (value: string) => void;
};

type MultiProps = BaseProps & {
  multiple: true;
  value: string[];
  onChange: (value: string[]) => void;
  /** Shown when nothing is selected, meaning "no filter". */
  allLabel?: string;
};

export function InlineFilter(props: SingleProps | MultiProps) {
  const {
    label,
    options,
    menuCaption,
    menuFooter,
    isLoading,
    searchable,
    searchPlaceholder = "Search",
    className,
    wide = false,
  } = props;
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  /* The menu is `position: fixed`, placed from the chip's box: an absolute
     menu was clipped by any card with overflow-hidden and ran off the right
     edge for chips near it. It flips above the chip when there's no room
     below, stays 12px inside the window, and follows the chip on scroll. */
  const [menuPos, setMenuPos] = useState<{
    top: number;
    left: number;
    maxHeight: number;
    /** wide: the chip's own width, so the menu lines up with it */
    width?: number;
  } | null>(null);
  useLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      const chip = rootRef.current?.getBoundingClientRect();
      const menu = menuRef.current;
      if (!chip || !menu) return;
      const gap = 8;
      const edge = 12;
      const width = wide
        ? Math.min(Math.max(chip.width, 220), window.innerWidth - 2 * edge)
        : menu.offsetWidth;
      const height = Math.min(menu.scrollHeight, 360);
      const below = window.innerHeight - chip.bottom - gap - edge;
      const above = chip.top - gap - edge;
      const flip = below < Math.min(height, 240) && above > below;
      const left = Math.max(
        edge,
        Math.min(chip.left, window.innerWidth - width - edge),
      );
      setMenuPos({
        left,
        width: wide ? width : undefined,
        top: flip ? Math.max(edge, chip.top - gap - height) : chip.bottom + gap,
        maxHeight: Math.min(360, flip ? above : below),
      });
    };
    place();
    window.addEventListener("resize", place);
    document.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      document.removeEventListener("scroll", place, true);
    };
  }, [open, wide]);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const selected = props.multiple
    ? props.value
    : props.value
      ? [props.value]
      : [];
  const isSelected = (v: string) => selected.includes(v);

  const valueText = props.multiple
    ? selected.length === 0
      ? (props.allLabel ?? "All")
      : selected.length <= 2
        ? options
            .filter((o) => selected.includes(o.value))
            .map((o) => o.label)
            .join(", ")
        : `${selected.length} of ${options.length}`
    : (options.find((o) => o.value === props.value)?.label ?? "—");

  const toggle = () => {
    setQuery("");
    setOpen((o) => !o);
  };

  const narrowed = !!props.multiple && selected.length > 0;
  useRegisterClear(narrowed, () => {
    if (props.multiple) props.onChange([]);
  });
  useRegisterPicks(
    narrowed && props.multiple
      ? {
          label,
          total: options.length,
          items: options
            .filter((o) => selected.includes(o.value))
            .map((o) => ({ value: o.value, label: o.label })),
          remove: (v) => props.onChange(selected.filter((x) => x !== v)),
        }
      : null,
  );

  if (isLoading) {
    return (
      <span
        aria-label={`Loading ${label}`}
        className={cn(
          "block h-8 w-28 animate-pulse rounded-full bg-gray-200",
          className,
        )}
      />
    );
  }

  // One option: nothing to choose, so no menu.
  if (!props.multiple && options.length <= 1) {
    return (
      <span
        className={cn(
          "inline-flex h-8 items-center gap-1.5 rounded-full border border-dashed border-gray-300 bg-white px-2.5 text-[13px] text-gray-900",
          className,
        )}
      >
        <span className="text-gray-500">{label}</span>
        <span className="font-semibold">{valueText}</span>
      </span>
    );
  }

  const needle = query.trim().toLowerCase();
  const shown = needle
    ? options.filter(
        (o) =>
          o.label.toLowerCase().includes(needle) ||
          (o.hint ?? "").toLowerCase().includes(needle),
      )
    : options;

  const pick = (v: string) => {
    if (props.multiple) {
      props.onChange(
        isSelected(v) ? selected.filter((x) => x !== v) : [...selected, v],
      );
    } else {
      props.onChange(v);
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <div
        className={cn(
          "inline-flex h-8 items-center rounded-full border text-[13px] transition-colors",
          open
            ? "border-[1.5px] border-primary bg-primary-50"
            : narrowed
              ? "border-primary-200 bg-primary-50"
              : "border-gray-300 bg-white hover:bg-gray-50",
        )}
      >
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? menuId : undefined}
          onClick={toggle}
          title={typeof valueText === "string" ? valueText : undefined}
          className={cn(
            "inline-flex h-full items-center gap-1.5 rounded-full pl-2.5 pr-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
            wide ? "max-w-[36rem]" : "max-w-[22rem]",
          )}
        >
          <span className={narrowed ? "text-primary/80" : "text-gray-500"}>
            {label}
          </span>
          <span
            className={cn(
              "truncate font-semibold",
              narrowed ? "text-primary" : "text-gray-900",
            )}
          >
            {valueText}
          </span>
          {!narrowed &&
            (open ? (
              <ChevronUp
                className="h-3.5 w-3.5 shrink-0 text-primary"
                aria-hidden="true"
              />
            ) : (
              <ChevronDown
                className="h-3.5 w-3.5 shrink-0 text-gray-500"
                aria-hidden="true"
              />
            ))}
        </button>
        {narrowed && (
          <button
            type="button"
            aria-label={`Clear ${label}`}
            onClick={() => (props as MultiProps).onChange([])}
            className="mr-1 flex size-6 items-center justify-center rounded-full text-primary hover:bg-primary-200/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {open && (
        <div
          id={menuId}
          ref={menuRef}
          role="listbox"
          aria-label={label}
          aria-multiselectable={props.multiple || undefined}
          style={
            menuPos
              ? {
                  top: menuPos.top,
                  left: menuPos.left,
                  maxHeight: menuPos.maxHeight,
                  width: menuPos.width,
                }
              : { visibility: "hidden", top: 0, left: 0 }
          }
          className={cn(
            "fixed z-[60] flex max-h-[360px] flex-col rounded-[10px] border border-gray-200 bg-white p-1.5 shadow-[0_12px_32px_rgba(17,24,39,0.14)]",
            // wide: as wide as the chip (set in place()); else sized to its options
            wide ? "" : "w-max min-w-[220px] max-w-[320px]",
          )}
        >
          {menuCaption && (
            <div className="px-2 pb-2 pt-1.5 text-xs text-gray-500">
              {menuCaption}
            </div>
          )}
          {(searchable ?? options.length > 8) && (
            <label className="mx-0.5 mb-1.5 flex h-[34px] shrink-0 items-center gap-2 rounded-lg border border-gray-300 px-2.5 text-gray-500 focus-within:ring-2 focus-within:ring-primary">
              <Search className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className="sr-only">Search {label}</span>
              <input
                autoFocus
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full border-0 bg-transparent p-0 text-[13px] text-gray-900 outline-none placeholder:text-gray-400 focus:ring-0"
              />
            </label>
          )}
          <div className="min-h-0 overflow-y-auto">
            {shown.map((o) => {
              const on = isSelected(o.value);
              return (
                <button
                  key={o.value}
                  type="button"
                  role="option"
                  aria-selected={on}
                  onClick={() => pick(o.value)}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-left text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    !props.multiple && on
                      ? "bg-primary-50 font-semibold text-primary"
                      : "text-gray-900 hover:bg-gray-50",
                  )}
                >
                  {props.multiple && (
                    <span
                      aria-hidden="true"
                      className={cn(
                        "flex size-4 shrink-0 items-center justify-center rounded border",
                        on
                          ? "border-primary bg-primary text-white"
                          : "border-gray-300 bg-white",
                      )}
                    >
                      {on && <Check className="h-3 w-3" strokeWidth={3} />}
                    </span>
                  )}
                  <span className="flex min-w-0 flex-1 flex-col gap-px">
                    <span className="truncate" title={o.label}>
                      {o.label}
                    </span>
                    {o.hint && (
                      <span className="font-mono text-[11px] font-normal text-gray-500">
                        {o.hint}
                      </span>
                    )}
                  </span>
                  {o.count !== undefined && (
                    <span className="text-[11px] tabular-nums text-gray-400">
                      {o.count}
                    </span>
                  )}
                  {!props.multiple && (
                    <Check
                      className={cn(
                        "h-3.5 w-3.5 shrink-0",
                        on ? "text-primary" : "invisible",
                      )}
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
            {shown.length === 0 && (
              <p className="px-2 py-2 text-xs text-gray-500">
                Nothing matches “{query}”
              </p>
            )}
          </div>
          {props.multiple && (
            <div className="mt-1 flex shrink-0 justify-between border-t border-gray-100 px-2 pb-1 pt-2">
              <button
                type="button"
                onClick={() => props.onChange([])}
                className="text-xs font-medium text-gray-500 hover:text-gray-900"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => props.onChange(options.map((o) => o.value))}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Select all
              </button>
            </div>
          )}
          {menuFooter && (
            <div className="mt-1 shrink-0 border-t border-gray-100 px-2 pb-1 pt-2">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  menuFooter.onClick();
                }}
                className="cursor-pointer text-xs font-semibold text-primary hover:underline"
              >
                {menuFooter.label}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * The chip look, for a filter whose picker is a dialog rather than a menu
 * (equipment, facility scope). Same size and states as InlineFilter.
 */
export function InlineFilterButton({
  label,
  value,
  narrowed = false,
  onOpen,
  onClear,
  disabled,
  title,
  picks,
}: {
  label: string;
  value: ReactNode;
  /** A non-default value is applied: tinted, with × to clear. */
  narrowed?: boolean;
  onOpen: () => void;
  onClear?: () => void;
  disabled?: boolean;
  title?: string;
  /** What the dialog picked, for the row's "Filtering by" tray. */
  picks?: {
    items: { value: string; label: string }[];
    total: number;
    remove: (value: string) => void;
  };
}) {
  useRegisterClear(narrowed && !!onClear, () => onClear?.());
  useRegisterPicks(
    narrowed && picks && picks.items.length ? { label, ...picks } : null,
  );
  return (
    <span
      title={title}
      className={cn(
        "inline-flex h-8 items-center rounded-full border text-[13px] transition-colors",
        narrowed
          ? "border-primary-200 bg-primary-50"
          : "border-gray-300 bg-white hover:bg-gray-50",
      )}
    >
      <button
        type="button"
        onClick={onOpen}
        disabled={disabled}
        aria-haspopup="dialog"
        className="inline-flex h-full max-w-[22rem] items-center gap-1.5 rounded-full px-2.5 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <span className={narrowed ? "text-primary/80" : "text-gray-500"}>
          {label}
        </span>
        <span
          className={cn(
            "truncate font-semibold",
            narrowed ? "text-primary" : "text-gray-900",
          )}
        >
          {value}
        </span>
        {!narrowed && (
          <ChevronDown
            className="h-3.5 w-3.5 shrink-0 text-gray-500"
            aria-hidden="true"
          />
        )}
      </button>
      {narrowed && onClear && (
        <button
          type="button"
          aria-label={`Clear ${label}`}
          onClick={onClear}
          className="mr-1 flex size-6 items-center justify-center rounded-full text-primary hover:bg-primary-200/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </span>
  );
}

/** The row the chips sit in, under the page header. */
export function InlineFilterRow({
  children,
  trailing,
  className,
}: {
  children: ReactNode;
  trailing?: ReactNode;
  className?: string;
}) {
  return (
    <>
      <div
        role="group"
        aria-label="Filters"
        className={cn(
          "flex flex-wrap items-center gap-2 [&>.ml-auto]:order-last",
          className,
        )}
      >
        {children}
        {/* After the chips and left of the page's right-aligned action group
          (the row sends any `ml-auto` child to the end). */}
        <ClearAllButton />
        {trailing && (
          <span className="ml-1 text-xs text-gray-400">{trailing}</span>
        )}
      </div>
      {/* Every pick of every narrowed multi-select, readable without a click. */}
      <PicksTray />
    </>
  );
}
