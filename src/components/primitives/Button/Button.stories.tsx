import type { Meta, StoryObj } from "@storybook/react";
import { Mail, ArrowRight } from "lucide-react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Primitives/Button",
  component: Button,
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "danger", "ghost", "outline"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { children: "Button", variant: "primary" },
};

export const Secondary: Story = {
  args: { children: "Button", variant: "secondary" },
};

export const Danger: Story = {
  args: { children: "Delete", variant: "danger" },
};

export const Ghost: Story = {
  args: { children: "Cancel", variant: "ghost" },
};

export const Outline: Story = {
  args: { children: "Settings", variant: "outline" },
};

export const WithIcons: Story = {
  args: {
    children: "Send Email",
    leftIcon: <Mail className="h-4 w-4" />,
    rightIcon: <ArrowRight className="h-4 w-4" />,
  },
};

export const Loading: Story = {
  args: { children: "Saving...", loading: true },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};
