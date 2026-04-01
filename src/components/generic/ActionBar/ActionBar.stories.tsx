import type { Meta, StoryObj } from "@storybook/react";
import { ActionBar } from "./ActionBar";

const meta: Meta<typeof ActionBar> = {
  title: "Generic/ActionBar",
  component: ActionBar,
};

export default meta;
type Story = StoryObj<typeof ActionBar>;

export const Default: Story = {
  args: {},
};

export const CustomLabel: Story = {
  args: { createLabel: "Add Equipment" },
};

export const DownloadOnly: Story = {
  args: { showCreate: false, showUpload: false },
};
