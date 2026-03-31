import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { FilterChips, type FilterChip } from "./FilterChips";

const meta: Meta<typeof FilterChips> = {
  title: "Generic/FilterChips",
  component: FilterChips,
};

export default meta;
type Story = StoryObj<typeof FilterChips>;

const initialChips: FilterChip[] = [
  { id: "1", label: "Alberta", category: "Province" },
  { id: "2", label: "2025", category: "Year" },
  { id: "3", label: "Flare Gas", category: "Activity" },
];

function FilterChipsDemo() {
  const [chips, setChips] = useState(initialChips);
  return (
    <FilterChips
      chips={chips}
      onRemove={(chip) => setChips((prev) => prev.filter((c) => c.id !== chip.id))}
      onClearAll={() => setChips([])}
    />
  );
}

export const Default: Story = {
  render: () => <FilterChipsDemo />,
};

export const Empty: Story = {
  args: { chips: [], onRemove: () => {}, onClearAll: () => {} },
};
