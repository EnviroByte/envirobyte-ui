import type { Meta, StoryObj } from "@storybook/react";
import { Breadcrumb } from "./Breadcrumb";

const meta: Meta<typeof Breadcrumb> = {
  title: "Generic/Breadcrumb",
  component: Breadcrumb,
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

export const Default: Story = {
  args: {
    items: [
      { label: "Air Releases", href: "#" },
      { label: "Stack / Point Releases" },
    ],
  },
};

export const Deep: Story = {
  args: {
    items: [
      { label: "NPRI", href: "#" },
      { label: "Release", href: "#" },
      { label: "Air", href: "#" },
      { label: "Stack / Point Releases" },
    ],
  },
};
