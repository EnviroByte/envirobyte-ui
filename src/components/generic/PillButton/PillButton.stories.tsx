import type { Meta, StoryObj } from "@storybook/react";
import { PillButton } from "./PillButton";

const meta: Meta<typeof PillButton> = {
  title: "Generic/PillButton",
  component: PillButton,
  argTypes: {
    active: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof PillButton>;

export const Active: Story = {
  args: { active: true, children: "Selected" },
};

export const Inactive: Story = {
  args: { active: false, children: "Unselected" },
};

export const Group: Story = {
  render: () => (
    <div className="flex gap-2">
      <PillButton active>Fuel</PillButton>
      <PillButton>Flare</PillButton>
      <PillButton>Production</PillButton>
    </div>
  ),
};
