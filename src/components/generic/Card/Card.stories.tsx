import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../../primitives/Button/Button";
import { Card, CardHeader } from "./Card";

const meta: Meta<typeof Card> = {
  title: "Generic/Card",
  component: Card,
  argTypes: {
    padding: {
      control: "select",
      options: ["none", "sm", "md", "lg"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    children: (
      <p className="text-sm text-gray-600">
        This is a basic card with default padding.
      </p>
    ),
  },
};

export const WithHeader: Story = {
  render: () => (
    <Card>
      <CardHeader
        title="Emissions Summary"
        description="Overview of your facility emissions"
        action={<Button size="sm" variant="outline">Export</Button>}
      />
      <div className="mt-4 text-sm text-gray-600">
        <p>Total CO2e: 1,234 tonnes</p>
      </div>
    </Card>
  ),
};

export const NoPadding: Story = {
  args: {
    padding: "none",
    children: (
      <div className="divide-y divide-gray-200">
        <div className="px-6 py-4">Row 1</div>
        <div className="px-6 py-4">Row 2</div>
        <div className="px-6 py-4">Row 3</div>
      </div>
    ),
  },
};
