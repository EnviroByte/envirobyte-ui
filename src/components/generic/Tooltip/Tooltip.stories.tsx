import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip } from "./Tooltip";

const meta: Meta<typeof Tooltip> = {
  title: "Generic/Tooltip",
  component: Tooltip,
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Bottom: Story = {
  render: () => (
    <div className="p-20">
      <Tooltip content="This is a helpful tooltip message">
        <button className="px-4 py-2 bg-gray-200 rounded">Hover me</button>
      </Tooltip>
    </div>
  ),
};

export const Top: Story = {
  render: () => (
    <div className="p-20">
      <Tooltip content="Tooltip on top" position="top">
        <button className="px-4 py-2 bg-gray-200 rounded">Hover me</button>
      </Tooltip>
    </div>
  ),
};

export const AlignEnd: Story = {
  render: () => (
    <div className="p-20 flex justify-end">
      <Tooltip content="Right-aligned tooltip" align="end">
        <button className="px-4 py-2 bg-gray-200 rounded">Hover me</button>
      </Tooltip>
    </div>
  ),
};
