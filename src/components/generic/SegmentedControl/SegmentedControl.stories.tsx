import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { SegmentedControl } from "./SegmentedControl";

const meta: Meta<typeof SegmentedControl> = {
  title: "Generic/SegmentedControl",
  component: SegmentedControl,
  argTypes: {
    variant: {
      control: "select",
      options: ["pill", "rounded"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof SegmentedControl>;

function PillDemo() {
  const [value, setValue] = useState("flare");
  return (
    <SegmentedControl
      options={[
        { value: "flare", label: "Flare" },
        { value: "fuel", label: "Fuel" },
        { value: "production", label: "Production" },
      ]}
      value={value}
      onChange={setValue}
    />
  );
}

export const Pill: Story = {
  render: () => <PillDemo />,
};

function RoundedDemo() {
  const [value, setValue] = useState("Alberta");
  return (
    <SegmentedControl
      options={[
        { value: "Alberta", label: "Alberta" },
        { value: "British Columbia", label: "British Columbia" },
        { value: "Saskatchewan", label: "Saskatchewan" },
      ]}
      value={value}
      onChange={setValue}
      variant="rounded"
    />
  );
}

export const Rounded: Story = {
  render: () => <RoundedDemo />,
};

function TwoTabDemo() {
  const [value, setValue] = useState("co2");
  return (
    <SegmentedControl
      options={[
        { value: "co2", label: "CO₂" },
        { value: "ch4", label: "CH₄ / N₂O" },
      ]}
      value={value}
      onChange={setValue}
    />
  );
}

export const TwoTabs: Story = {
  render: () => <TwoTabDemo />,
};

function RoundedTwoDemo() {
  const [value, setValue] = useState("vent");
  return (
    <SegmentedControl
      options={[
        { value: "vent", label: "Vent Limits" },
        { value: "flare", label: "Flare Limits" },
      ]}
      value={value}
      onChange={setValue}
      variant="rounded"
    />
  );
}

export const RoundedTwoTabs: Story = {
  render: () => <RoundedTwoDemo />,
};
