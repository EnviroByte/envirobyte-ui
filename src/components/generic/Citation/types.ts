/**
 * One resolved citation behind an inline `[n]` marker in an AI answer.
 *
 * Mirrors the `citations` array the AI service puts on its `answer` event.
 * Kept free of any product-specific field so every chat surface — EmissionX,
 * AtmosIQ, DataPivot, RIM — reads the same shape off the same endpoint.
 */
export interface Citation {
  /** Marker number as it appears in the answer text. */
  n: number;
  /** Stable id of the source document. */
  sourceId: string;
  /** Source document name, e.g. "TIER Regulation.pdf". */
  sourceTitle: string;
  /** The exact passage the answer was grounded on. May be empty. */
  citedText: string;
  /** Knowledge base the source belongs to, when answers span several. */
  notebookTitle?: string;
  /** Optional deep link to the source, if the product can serve one. */
  sourceUrl?: string;
}
