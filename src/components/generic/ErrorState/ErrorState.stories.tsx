import type { Meta, StoryObj } from "@storybook/react";
import { ErrorState } from "./ErrorState";

const meta: Meta<typeof ErrorState> = {
  title: "Generic/ErrorState",
  component: ErrorState,
};

export default meta;
type Story = StoryObj<typeof ErrorState>;

export const Default: Story = {
  args: {},
};

export const WithAction: Story = {
  args: {
    title: "Failed to load data",
    description: "We couldn't fetch the emission factors. Please try again.",
    actionLabel: "Retry",
    onAction: () => alert("Retrying..."),
  },
};

export const CustomMessage: Story = {
  args: {
    title: "Network Error",
    description: "Check your internet connection and try again.",
  },
};
