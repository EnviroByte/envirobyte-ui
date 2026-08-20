import type { Meta, StoryObj } from "@storybook/react";
import { Citation } from "./Citation";
import { CitationText } from "./CitationText";
import { CitationSources } from "./CitationSources";
import type { Citation as CitationData } from "./types";

const meta: Meta<typeof Citation> = {
  title: "Generic/Citation",
  component: Citation,
};

export default meta;
type Story = StoryObj<typeof Citation>;

/** Real references from the AB TIER notebook, so the stories show true lengths. */
const CITATIONS: CitationData[] = [
  {
    n: 1,
    sourceId: "c6f6a629",
    sourceTitle: "TIER Regulation.pdf",
    notebookTitle: "AB TIER",
    citedText:
      "15 (ii) the facility is in an emissions-intensive-trade-exposed sector and that the facility (A) had direct emissions of 2000 CO2e tonnes or more in 2017 or a subsequent year, or (B) is likely to have direct emissions of 2000 CO2e tonnes or more in its 3rd year of commercial operation. (5) The director shall notify the person responsible for a facility in writing of the director's decision as to whether to designate the facility as an opted-in facility.",
  },
  {
    n: 2,
    sourceId: "ceb65718",
    sourceTitle:
      "epa-tier-standard-completing-greenhouse-gas-compliance-forecasting-reports-version-3-3.pdf",
    notebookTitle: "AB TIER",
    citedText:
      "Conditions of Entry: Meets the criteria as a large emitter and to be a facility. Meets emissions intensive and trade exposed (EITE) criteria, DE are greater than or equal to 2,000 tonnes CO2e; or competes directly with a regulated facility.",
  },
  {
    n: 3,
    sourceId: "c37fdeb2",
    sourceTitle: "epa-tier-standard-developing-benchmarks-version-2-5.pdf",
    notebookTitle: "AB TIER",
    citedText:
      "4. Aggregate Facilities 4.1. Eligibility — There is no minimum emission threshold for a conventional oil and gas facility to be included in an aggregate facility.",
  },
  {
    n: 4,
    sourceId: "7a0294db",
    sourceTitle:
      "epa-alberta-greenhouse-gas-quantification-methodologies-version-2-3-2023-09.pdf",
    notebookTitle: "AB TIER",
    citedText:
      "An aggregate facility consists of two or more Conventional Oil and Gas (COG) facilities. Further, multiple sites may be integrated in operation and be identified as a single COG within an aggregate facility provided each site emits less than 100,000 tonnes CO2e per year.",
  },
];

const ANSWER =
  "For standard facilities seeking to opt in to TIER under the EITE sector pathway, the threshold is direct emissions of 2,000 tonnes of CO₂e or more in 2017 or any subsequent year [1-3]. Alternatively, a facility may apply to opt in regardless of emissions if it competed directly with a regulated facility [2]. For conventional oil and gas facilities grouped under an aggregate designation there is no minimum threshold [3], though each site must emit less than 100,000 tonnes CO₂e per year [4].";

/** Hover the chip; click it to pin the card open and read the full passage. */
export const Default: Story = {
  render: () => (
    <div style={{ padding: 80, maxWidth: 620, fontSize: 14, lineHeight: 1.7 }}>
      The opt-in threshold is 2,000 tonnes CO₂e
      <Citation citation={CITATIONS[0]} /> for EITE facilities.
    </div>
  ),
};

/** A full answer — grouped markers render as one chip per source. */
export const InProse: Story = {
  render: () => (
    <div style={{ padding: 80, maxWidth: 620, fontSize: 14, lineHeight: 1.75 }}>
      <CitationText citations={CITATIONS}>{ANSWER}</CitationText>
    </div>
  ),
};

/** Markers with no citation behind them are removed, not left dangling. */
export const UnresolvableMarkersRemoved: Story = {
  render: () => (
    <div style={{ padding: 80, maxWidth: 620, fontSize: 14, lineHeight: 1.75 }}>
      <CitationText citations={[CITATIONS[0]]}>{ANSWER}</CitationText>
    </div>
  ),
};

/** Opens near the bottom edge — the card flips above the chip. */
export const FlipsNearViewportEdge: Story = {
  render: () => (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "flex-end",
        padding: 24,
        fontSize: 14,
      }}
    >
      <span>
        Near the bottom of the viewport
        <Citation citation={CITATIONS[1]} />
      </span>
    </div>
  ),
};

/** A citation whose passage did not come back — still names the document. */
export const NoPassage: Story = {
  render: () => (
    <div style={{ padding: 80, fontSize: 14 }}>
      Reference without quoted text
      <Citation
        citation={{ ...CITATIONS[0], citedText: "", sourceUrl: undefined }}
      />
    </div>
  ),
};

/** With a deep link to the source document, when the product can serve one. */
export const WithSourceLink: Story = {
  render: () => (
    <div style={{ padding: 80, fontSize: 14 }}>
      Linked source
      <Citation
        citation={{ ...CITATIONS[0], sourceUrl: "https://example.com/tier.pdf" }}
      />
    </div>
  ),
};

/** The documents strip that sits under an answer. */
export const Sources: Story = {
  render: () => (
    <div style={{ padding: 40, maxWidth: 620 }}>
      <CitationSources citations={CITATIONS} defaultOpen />
    </div>
  ),
};
