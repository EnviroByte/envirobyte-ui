import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Select, type SelectOption } from "./Select";

const meta: Meta<typeof Select> = {
  title: "Primitives/Select",
  component: Select,
};

export default meta;
type Story = StoryObj<typeof Select>;

const options: SelectOption[] = [
  { value: "ab", label: "Alberta" },
  { value: "bc", label: "British Columbia" },
  { value: "on", label: "Ontario" },
  { value: "qc", label: "Quebec" },
  { value: "sk", label: "Saskatchewan", disabled: true },
];

function SelectDemo({
  label,
  error,
  disabled,
}: {
  label?: string;
  error?: string;
  disabled?: boolean;
}) {
  const [value, setValue] = useState("");
  return (
    <Select
      value={value}
      onChange={setValue}
      options={options}
      label={label}
      placeholder="Choose a province"
      error={error}
      disabled={disabled}
    />
  );
}

export const Default: Story = {
  render: () => <SelectDemo label="Province" />,
};

export const WithError: Story = {
  render: () => (
    <SelectDemo label="Province" error="Please select a province" />
  ),
};

export const Disabled: Story = {
  render: () => <SelectDemo label="Province" disabled />,
};

function MonthSelectDemo() {
  const [value, setValue] = useState("9");
  const monthOptions: SelectOption[] = [
    { value: "1", label: "January" },
    { value: "9", label: "September" },
    { value: "12", label: "December" },
  ];
  return (
    <div className="w-72">
      <Select
        value={value}
        onChange={setValue}
        options={monthOptions}
        label="Month"
        hideSelectedIndicator
        truncateSelected={false}
      />
    </div>
  );
}

export const WithoutCheckmark: Story = {
  render: () => <MonthSelectDemo />,
};
