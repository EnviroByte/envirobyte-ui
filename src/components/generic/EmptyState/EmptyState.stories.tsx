import type { Meta, StoryObj } from "@storybook/react";
import { FileX } from "lucide-react";
import { Button } from "../../primitives/Button/Button";
import { EmptyState } from "./EmptyState";

const meta: Meta<typeof EmptyState> = {
  title: "Generic/EmptyState",
  component: EmptyState,
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  args: {
    title: "No data found",
    description: "There are no records matching your criteria.",
  },
};

export const WithAction: Story = {
  args: {
    title: "No facilities",
    description: "Get started by adding your first facility.",
    action: <Button size="sm">Add Facility</Button>,
  },
};

export const CustomIcon: Story = {
  args: {
    icon: <FileX className="h-12 w-12" />,
    title: "No reports",
    description: "Reports will appear here once generated.",
  },
};
