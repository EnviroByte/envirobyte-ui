import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Switch } from "./Switch";

const meta: Meta<typeof Switch> = {
  title: "Primitives/Switch",
  component: Switch,
};

export default meta;
type Story = StoryObj<typeof Switch>;

function SwitchDemo({
  label,
  description,
  size,
  disabled,
}: {
  label?: string;
  description?: string;
  size?: "sm" | "md";
  disabled?: boolean;
}) {
  const [checked, setChecked] = useState(false);
  return (
    <Switch
      checked={checked}
      onChange={setChecked}
      label={label}
      description={description}
      size={size}
      disabled={disabled}
    />
  );
}

export const Default: Story = {
  render: () => <SwitchDemo label="Enable notifications" />,
};

export const WithDescription: Story = {
  render: () => (
    <SwitchDemo
      label="Dark mode"
      description="Switch between light and dark themes"
    />
  ),
};

export const Small: Story = {
  render: () => <SwitchDemo label="Compact" size="sm" />,
};

export const Disabled: Story = {
  render: () => <SwitchDemo label="Disabled" disabled />,
};
