/**
 * A rehype plugin that turns inline `[n]` markers into citation elements.
 *
 * Runs over the rendered markdown tree rather than the raw string, which is
 * what keeps it safe: markdown links (`[label](url)`), code spans, fenced
 * blocks and KaTeX output are all skipped, because by the time the tree exists
 * those are elements rather than the plain text nodes this visits.
 *
 * It emits a custom `<citation-ref>` element instead of a `<span>` so the
 * consumer's `components` map can claim it without also having to hand-render
 * every other span in the answer — KaTeX emits dozens of those.
 *
 * Verified against react-markdown 10.1.0, the version all four chat surfaces
 * are on. The integration test lives in the app that has react-markdown:
 * `emissionx-frontend/scripts/test-citations.mjs` (`npm run test:citations`).
 *
 * Usage:
 *   <ReactMarkdown
 *     rehypePlugins={[rehypeKatex, rehypeCitations(citations)]}
 *     components={{ ...citationComponents(citations) }}
 *   >
 *
 * Typed loosely because this package does not depend on `hast`/`unist`; the
 * shapes touched here (`type`, `value`, `tagName`, `children`, `properties`)
 * are the stable core of hast.
 */
import type { Citation } from "./types";
import { CITATION_MARKER_RE, expandMarker } from "./citation-markers";

/** Elements whose text must never be turned into chips. */
const OPAQUE_TAGS = new Set(["code", "pre", "a", "script", "style"]);

function isKatex(node: any): boolean {
  const cls = node?.properties?.className;
  const list = Array.isArray(cls) ? cls : cls ? [cls] : [];
  return list.some((c: unknown) => String(c).startsWith("katex"));
}

/**
 * Build the plugin for a given citation set.
 *
 * Markers whose numbers are all unknown are removed rather than rendered, so
 * the answer never shows a bracket that opens onto nothing. Passing an empty
 * array is therefore a complete "strip every marker" pass.
 */
export function rehypeCitations(citations: readonly Citation[] = []) {
  const known = new Set(citations.map((c) => c.n));

  // unified calls the value in `rehypePlugins` as an ATTACHER and uses what it
  // returns as the transformer. Returning the transformer directly here makes
  // unified invoke it with no tree and register nothing — a silent no-op that
  // renders the answer untouched rather than erroring. Hence the extra layer.
  return function attacher() {
    return transformer;
  };

  function transformer(tree: any) {
    visit(tree);

    function visit(node: any) {
      if (!node || !Array.isArray(node.children)) return;
      if (node.type === "element" && OPAQUE_TAGS.has(node.tagName)) return;
      if (node.type === "element" && isKatex(node)) return;

      const next: any[] = [];

      for (const child of node.children) {
        if (child?.type !== "text" || !CITATION_MARKER_RE.test(child.value)) {
          visit(child);
          next.push(child);
          continue;
        }

        // `test` on a /g regex advances lastIndex — reset before matching.
        CITATION_MARKER_RE.lastIndex = 0;
        const value: string = child.value;
        let cursor = 0;

        for (const match of value.matchAll(CITATION_MARKER_RE)) {
          const at = match.index ?? 0;
          const numbers = expandMarker(match[1]).filter((n) => known.has(n));

          let before = value.slice(cursor, at);
          cursor = at + match[0].length;

          if (numbers.length === 0) {
            // Dropping a marker must not leave "tonnes ." behind.
            if (/^[.,;:)]/.test(value.slice(cursor))) {
              before = before.replace(/[ \t]+$/, "");
            }
            if (before) next.push({ type: "text", value: before });
            continue;
          }

          if (before) next.push({ type: "text", value: before });
          for (const n of numbers) {
            next.push({
              type: "element",
              tagName: "citation-ref",
              properties: { dataCitationN: String(n) },
              children: [],
            });
          }
        }

        const tail = value.slice(cursor);
        if (tail) next.push({ type: "text", value: tail });
      }

      node.children = next;
    }
  };
}
