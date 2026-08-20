/**
 * Parsing for the inline citation markers an AI answer carries.
 *
 * Markers come through as `[1]`, `[1-3]`, `[2, 4]` or `[1-3, 7]`. This module
 * turns a run of prose into segments so the renderer can swap each marker for
 * chips without disturbing the surrounding text.
 *
 * No JSX here on purpose — the same parsing is useful outside React (tests,
 * plain-text export, server-side stripping).
 */

/**
 * Matches a citation marker.
 *
 * Deliberately strict: the inner text must be digits, separators and spaces
 * only, so markdown links `[label](url)`, checkbox syntax and bracketed prose
 * are all left alone.
 */
export const CITATION_MARKER_RE = /\[(\d+(?:\s*[-,]\s*\d+)*)\]/g;

/** Upper bound on a single `[a-b]` range, so a typo cannot allocate wildly. */
const MAX_RANGE_SPAN = 100;

/** Expand one marker's inner text into the citation numbers it refers to. */
export function expandMarker(inner: string): number[] {
  const out: number[] = [];
  for (const part of inner.split(",")) {
    const trimmed = part.trim();
    const range = trimmed.match(/^(\d+)\s*-\s*(\d+)$/);
    if (range) {
      const from = Number(range[1]);
      const to = Number(range[2]);
      if (to >= from && to - from <= MAX_RANGE_SPAN) {
        for (let n = from; n <= to; n++) out.push(n);
      }
      continue;
    }
    if (/^\d+$/.test(trimmed)) out.push(Number(trimmed));
  }
  return out;
}

/** A run of plain text, or a marker resolved to the citations behind it. */
export type CitationSegment =
  | { type: "text"; text: string }
  | { type: "citations"; numbers: number[] };

/**
 * Split text into plain runs and citation markers.
 *
 * A marker whose numbers are all unknown to `known` is dropped entirely rather
 * than rendered — a chip that opens to nothing is the bug this replaces. When
 * `known` is omitted every marker is kept, which is what tests and previews
 * want.
 */
export function splitCitations(
  text: string,
  known?: ReadonlySet<number>
): CitationSegment[] {
  const segments: CitationSegment[] = [];
  let cursor = 0;

  // matchAll needs a fresh lastIndex — the regex is module-level and /g.
  CITATION_MARKER_RE.lastIndex = 0;
  for (const match of text.matchAll(CITATION_MARKER_RE)) {
    const at = match.index ?? 0;
    const numbers = expandMarker(match[1]).filter(
      (n) => !known || known.has(n)
    );

    let before = text.slice(cursor, at);
    cursor = at + match[0].length;

    if (numbers.length === 0) {
      // Nothing behind this marker: drop it, and the space that preceded it,
      // so removal does not leave "tonnes ." behind.
      const after = text.slice(cursor);
      if (/^[.,;:)]/.test(after)) before = before.replace(/[ \t]+$/, "");
      if (before) segments.push({ type: "text", text: before });
      continue;
    }

    if (before) segments.push({ type: "text", text: before });
    segments.push({ type: "citations", numbers });
  }

  const tail = text.slice(cursor);
  if (tail) segments.push({ type: "text", text: tail });

  return segments;
}

/** Whether any renderable marker exists in the text. */
export function hasCitationMarkers(
  text: string,
  known?: ReadonlySet<number>
): boolean {
  return splitCitations(text, known).some((s) => s.type === "citations");
}
