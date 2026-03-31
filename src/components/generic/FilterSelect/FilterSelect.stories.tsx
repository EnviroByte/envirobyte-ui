import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { FilterSelect } from "./FilterSelect";

const meta: Meta<typeof FilterSelect> = {
  title: "Generic/FilterSelect",
  component: FilterSelect,
};

export default meta;
type Story = StoryObj<typeof FilterSelect>;

function FilterSelectDemo() {
  const [value, setValue] = useState("");
  return (
    <FilterSelect
      label="Province"
      options={["Alberta", "British Columbia", "Ontario", "Saskatchewan"]}
      value={value}
      onChange={setValue}
      placeholder="All provinces"
    />
  );
}

export const Default: Story = {
  render: () => <FilterSelectDemo />,
};

export const WithObjectOptions: Story = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <FilterSelect
        label="Year"
        options={[
          { value: "2024", label: "2024" },
          { value: "2025", label: "2025" },
          { value: "2026", label: "2026" },
        ]}
        value={value}
        onChange={setValue}
      />
    );
  },
};

export const NoLabel: Story = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <FilterSelect
        options={["Fuel", "Flare", "Production"]}
        value={value}
        onChange={setValue}
        placeholder="Data type"
      />
    );
  },
};
