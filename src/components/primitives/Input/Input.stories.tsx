import type { Meta, StoryObj } from "@storybook/react";
import { Search, Eye } from "lucide-react";
import { Input } from "./Input";

const meta: Meta<typeof Input> = {
  title: "Primitives/Input",
  component: Input,
  argTypes: {
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: { label: "Email", placeholder: "Enter your email" },
};

export const WithError: Story = {
  args: {
    label: "Email",
    placeholder: "Enter your email",
    error: "This field is required",
  },
};

export const WithHint: Story = {
  args: {
    label: "Password",
    type: "password",
    placeholder: "Enter password",
    hint: "Must be at least 8 characters",
  },
};

export const WithIcons: Story = {
  args: {
    label: "Search",
    placeholder: "Search...",
    leftIcon: <Search className="h-4 w-4" />,
    rightIcon: <Eye className="h-4 w-4" />,
  },
};

export const Disabled: Story = {
  args: {
    label: "Disabled",
    value: "Cannot edit this",
    disabled: true,
  },
};
