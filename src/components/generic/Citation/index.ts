export { Citation } from "./Citation";
export type { CitationProps } from "./Citation";

export { CitationText, citationComponents } from "./CitationText";
export type { CitationTextProps } from "./CitationText";

export { CitationSources } from "./CitationSources";
export type { CitationSourcesProps } from "./CitationSources";

export { rehypeCitations } from "./rehype-citations";

export {
  CITATION_MARKER_RE,
  expandMarker,
  splitCitations,
  hasCitationMarkers,
} from "./citation-markers";
export type { CitationSegment } from "./citation-markers";

export type { Citation as CitationData } from "./types";
