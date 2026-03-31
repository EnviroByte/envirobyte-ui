import type { Meta, StoryObj } from "@storybook/react";
import { ComingSoon } from "./ComingSoon";

const meta: Meta<typeof ComingSoon> = {
  title: "Generic/ComingSoon",
  component: ComingSoon,
};

export default meta;
type Story = StoryObj<typeof ComingSoon>;

export const Default: Story = {
  args: {},
};

export const Custom: Story = {
  args: {
    title: "Feature Under Development",
    description: "Our team is building something great. Check back soon!",
  },
};
