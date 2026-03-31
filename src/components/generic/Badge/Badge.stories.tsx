import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./Badge";

const meta: Meta<typeof Badge> = {
  title: "Generic/Badge",
  component: Badge,
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "primary", "success", "warning", "error", "info"],
    },
    size: {
      control: "select",
      options: ["sm", "md"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: { children: "Default" },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="primary">Primary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
      <Badge variant="info">Info</Badge>
    </div>
  ),
};

export const Small: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge size="sm" variant="success">Active</Badge>
      <Badge size="sm" variant="error">Inactive</Badge>
    </div>
  ),
};
