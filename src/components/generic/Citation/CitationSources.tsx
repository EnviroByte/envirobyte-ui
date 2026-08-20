"use client";

import { useState } from "react";
import { FileText, ChevronDown } from "lucide-react";
import type { Citation as CitationData } from "./types";

/**
 * The distinct documents an answer drew on, as a collapsible strip.
 *
 * The inline chips answer "where did this sentence come from"; this answers
 * "what did it read", which is the question people ask before they trust an
 * answer at all. Collapsed by default so it never competes with the answer.
 *
 * Styled inline for the same reason as `Citation` — see the note there.
 */

export interface CitationSourcesProps {
  citations: readonly CitationData[];
  /** Open on first render. Default false. */
  defaultOpen?: boolean;
  /** Heading text. Default "Sources". */
  label?: string;
}

interface SourceGroup {
  sourceId: string;
  sourceTitle: string;
  notebookTitle?: string;
  sourceUrl?: string;
  numbers: number[];
}

/** One row per document, carrying every marker number that pointed at it. */
function groupBySource(citations: readonly CitationData[]): SourceGroup[] {
  const groups = new Map<string, SourceGroup>();
  for (const c of citations) {
    const key = c.sourceId || c.sourceTitle;
    const existing = groups.get(key);
    if (existing) {
      if (!existing.numbers.includes(c.n)) existing.numbers.push(c.n);
      continue;
    }
    groups.set(key, {
      sourceId: c.sourceId,
      sourceTitle: c.sourceTitle,
      notebookTitle: c.notebookTitle,
      sourceUrl: c.sourceUrl,
      numbers: [c.n],
    });
  }
  return [...groups.values()]
    .map((g) => ({ ...g, numbers: g.numbers.sort((a, b) => a - b) }))
    .sort((a, b) => a.numbers[0] - b.numbers[0]);
}

export function CitationSources({
  citations,
  defaultOpen = false,
  label = "Sources",
}: CitationSourcesProps) {
  const [open, setOpen] = useState(defaultOpen);
  const groups = groupBySource(citations);

  if (groups.length === 0) return null;

  return (
    <div style={{ marginTop: 10 }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          padding: "3px 8px 3px 6px",
          borderRadius: 999,
          border: "1px solid var(--border, #e5e7eb)",
          background: "var(--surface-hover, #f9fafb)",
          color: "var(--text-muted, #6b7280)",
          fontSize: 11,
          fontWeight: 600,
          cursor: "pointer",
          lineHeight: 1.4,
        }}
      >
        <FileText size={11} strokeWidth={2.2} aria-hidden />
        {label}
        <span
          style={{
            fontVariantNumeric: "tabular-nums",
            color: "var(--brand, #274c7c)",
          }}
        >
          {groups.length}
        </span>
        <ChevronDown
          size={11}
          strokeWidth={2.5}
          aria-hidden
          style={{
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 140ms ease",
          }}
        />
      </button>

      {open && (
        <ul
          style={{
            listStyle: "none",
            margin: "7px 0 0",
            padding: 0,
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {groups.map((g) => (
            <li
              key={g.sourceId || g.sourceTitle}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 7,
                padding: "6px 9px",
                borderRadius: 8,
                border: "1px solid var(--border, #e5e7eb)",
                background: "var(--surface-raised, #ffffff)",
                fontSize: 11.5,
                lineHeight: 1.45,
              }}
            >
              <span
                aria-hidden
                style={{
                  flexShrink: 0,
                  marginTop: 1,
                  padding: "0 5px",
                  borderRadius: 999,
                  background: "var(--brand-subtle, #eef3f9)",
                  color: "var(--brand, #274c7c)",
                  fontSize: 10,
                  fontWeight: 700,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {g.numbers.join(", ")}
              </span>
              <span style={{ minWidth: 0 }}>
                {g.sourceUrl ? (
                  <a
                    href={g.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "var(--text-strong, #111827)",
                      fontWeight: 500,
                      overflowWrap: "anywhere",
                    }}
                  >
                    {g.sourceTitle}
                  </a>
                ) : (
                  <span
                    style={{
                      color: "var(--text-strong, #111827)",
                      fontWeight: 500,
                      overflowWrap: "anywhere",
                    }}
                  >
                    {g.sourceTitle}
                  </span>
                )}
                {g.notebookTitle && (
                  <span
                    style={{
                      display: "block",
                      color: "var(--text-muted, #6b7280)",
                      fontSize: 10.5,
                    }}
                  >
                    {g.notebookTitle}
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
