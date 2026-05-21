/**
 * Pure display utilities for rendering entity history change entries.
 * Framework-agnostic — safe to use in both client and server components.
 */

export interface HistoryChange {
  old: string | null;
  new: string | null;
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Returns true if the value looks like a bare UUID (internal FK reference). */
export function isUuidValue(value: string | null | undefined): boolean {
  if (!value) return false;
  return UUID_RE.test(value.trim());
}

/** Filter change entries that should not be shown to end users. */
export function visibleChanges(
  changes: Record<string, HistoryChange>,
): [string, HistoryChange][] {
  return Object.entries(changes).filter(([, change]) => {
    if (isUuidValue(change.old) || isUuidValue(change.new)) return false;
    const oldVal = formatChangeValue(change.old);
    const newVal = formatChangeValue(change.new);
    // Hide no-op rows where nothing meaningful changed
    if (oldVal === "—" && newVal === "—") return false;
    if (oldVal === newVal) return false;
    return true;
  });
}

/** Converts a snake_case field name to a readable label. */
export function formatFieldLabel(field: string): string {
  return field
    .replace(/_/g, " ")
    .replace(/\bm3\b/gi, "m³")
    .replace(/\bkpag\b/gi, "kPag")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Converts a raw change value to a clean display string. */
export function formatChangeValue(value: string | null | undefined): string {
  if (value == null) return "—";
  const trimmed = String(value).trim();
  if (!trimmed || trimmed.toLowerCase() === "none" || trimmed.toLowerCase() === "null") {
    return "—";
  }
  if (isUuidValue(trimmed)) return "—";

  const numeric = Number(trimmed);
  if (!Number.isNaN(numeric) && /^-?\d*\.?\d+([eE][+-]?\d+)?$/.test(trimmed)) {
    if (Number.isInteger(numeric)) return String(numeric);
    return String(parseFloat(numeric.toFixed(4)));
  }

  return trimmed;
}

export function isLongChangeValue(value: string): boolean {
  return value.length > 72;
}
