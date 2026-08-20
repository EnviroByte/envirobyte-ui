"use client";

import { Fragment, type ReactNode } from "react";
import { Citation } from "./Citation";
import type { Citation as CitationData } from "./types";
import { splitCitations } from "./citation-markers";

/**
 * The `components` entries react-markdown needs to render citation chips.
 *
 * Pair with `rehypeCitations(citations)`, which is what creates the elements
 * this claims. Spread into an existing map so a product keeps its own
 * overrides:
 *
 *   components={{ ...myOverrides, ...citationComponents(citations) }}
 */
export function citationComponents(citations: readonly CitationData[]) {
  const byNumber = new Map(citations.map((c) => [c.n, c]));

  return {
    "citation-ref": ({ node }: any) => {
      const n = Number(node?.properties?.dataCitationN);
      const citation = byNumber.get(n);
      // The plugin already dropped unknown markers; this is the belt-and-braces
      // case where the two were handed different citation sets.
      if (!citation) return null;
      return <Citation citation={citation} />;
    },
  };
}

export interface CitationTextProps {
  /** Text that may contain `[1]`, `[1-3]`, `[2, 4]` markers. */
  children: string;
  /** Citations the markers resolve against. Unknown markers are removed. */
  citations: readonly CitationData[];
}

/**
 * Renders a plain (non-markdown) string with its citation markers as chips.
 *
 * For markdown answers use `rehypeCitations` + `citationComponents` instead —
 * this is for the places a product shows a bare string, like a collapsed
 * summary line or a history row.
 */
export function CitationText({ children, citations }: CitationTextProps) {
  const byNumber = new Map(citations.map((c) => [c.n, c]));
  const segments = splitCitations(children, new Set(byNumber.keys()));

  return (
    <>
      {segments.map((segment, i) =>
        segment.type === "text" ? (
          <Fragment key={i}>{segment.text}</Fragment>
        ) : (
          <Fragment key={i}>
            {segment.numbers.map((n) => {
              const citation = byNumber.get(n);
              return citation ? <Citation key={n} citation={citation} /> : null;
            })}
          </Fragment>
        )
      ) as ReactNode[]}
    </>
  );
}
