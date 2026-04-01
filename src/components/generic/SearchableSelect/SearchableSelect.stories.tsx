import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { SearchableSelect } from "./SearchableSelect";

const meta: Meta<typeof SearchableSelect> = {
  title: "Generic/SearchableSelect",
  component: SearchableSelect,
};

export default meta;
type Story = StoryObj<typeof SearchableSelect>;

const provinceOptions = [
  { value: "AB", label: "Alberta" },
  { value: "BC", label: "British Columbia" },
  { value: "SK", label: "Saskatchewan" },
  { value: "ON", label: "Ontario" },
  { value: "QC", label: "Quebec" },
  { value: "MB", label: "Manitoba" },
  { value: "NS", label: "Nova Scotia" },
  { value: "NB", label: "New Brunswick" },
];

function SingleDemo() {
  const [value, setValue] = useState("");
  return (
    <div className="w-72">
      <SearchableSelect
        label="Province"
        options={provinceOptions}
        value={value}
        onChange={(v) => setValue(v as string)}
        placeholder="Select a province"
      />
    </div>
  );
}

export const Single: Story = {
  render: () => <SingleDemo />,
};

function MultiDemo() {
  const [value, setValue] = useState<string[]>([]);
  return (
    <div className="w-80">
      <SearchableSelect
        label="Provinces"
        options={provinceOptions}
        value={value}
        onChange={(v) => setValue(v as string[])}
        placeholder="Select provinces"
        multiple
      />
    </div>
  );
}

export const Multiple: Story = {
  render: () => <MultiDemo />,
};

const facilityOptions = Array.from({ length: 50 }, (_, i) => ({
  value: `FAC-${String(i + 1).padStart(3, "0")}`,
  label: `Facility ${String(i + 1).padStart(3, "0")} - ${["Gordondale", "Riverbank", "Prairie", "Northern", "Clearwater"][i % 5]} Hub`,
}));

function ManyOptionsDemo() {
  const [value, setValue] = useState("");
  return (
    <div className="w-80">
      <SearchableSelect
        label="Facility"
        options={facilityOptions}
        value={value}
        onChange={(v) => setValue(v as string)}
        placeholder="Search facilities..."
        searchPlaceholder="Type to filter..."
      />
    </div>
  );
}

export const ManyOptions: Story = {
  render: () => <ManyOptionsDemo />,
};

export const WithError: Story = {
  render: () => (
    <div className="w-72">
      <SearchableSelect
        label="Province"
        options={provinceOptions}
        error="Please select a province"
        placeholder="Select a province"
      />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="w-72">
      <SearchableSelect
        label="Province"
        options={provinceOptions}
        value="AB"
        disabled
      />
    </div>
  ),
};
