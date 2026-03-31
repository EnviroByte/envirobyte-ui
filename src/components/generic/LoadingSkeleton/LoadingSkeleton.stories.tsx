import type { Meta, StoryObj } from "@storybook/react";
import { LoadingSkeleton } from "./LoadingSkeleton";

const meta: Meta<typeof LoadingSkeleton> = {
  title: "Generic/LoadingSkeleton",
  component: LoadingSkeleton,
  argTypes: {
    lines: { control: { type: "number", min: 1, max: 10 } },
    circle: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof LoadingSkeleton>;

export const Default: Story = {
  args: { lines: 3 },
};

export const SingleLine: Story = {
  args: { lines: 1 },
};

export const ManyLines: Story = {
  args: { lines: 6 },
};

export const Circle: Story = {
  args: { circle: true },
};

export const CardSkeleton: Story = {
  render: () => (
    <div className="space-y-4 rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-3">
        <LoadingSkeleton circle className="h-10 w-10" />
        <div className="flex-1">
          <LoadingSkeleton lines={1} className="w-1/3" />
          <LoadingSkeleton lines={1} className="mt-1 w-1/2" />
        </div>
      </div>
      <LoadingSkeleton lines={3} />
    </div>
  ),
};
