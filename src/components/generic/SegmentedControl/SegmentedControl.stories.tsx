import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { SegmentedControl } from "./SegmentedControl";

const meta: Meta<typeof SegmentedControl> = {
  title: "Generic/SegmentedControl",
  component: SegmentedControl,
};

export default meta;
type Story = StoryObj<typeof SegmentedControl>;

function SegmentedDemo() {
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

export const Default: Story = {
  render: () => <SegmentedDemo />,
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
