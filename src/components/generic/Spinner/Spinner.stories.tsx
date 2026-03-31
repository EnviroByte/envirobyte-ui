import type { Meta, StoryObj } from "@storybook/react";
import { Spinner } from "./Spinner";

const meta: Meta<typeof Spinner> = {
  title: "Generic/Spinner",
  component: Spinner,
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {
  args: {},
};

export const WithLabel: Story = {
  args: { label: "emission factors" },
};
