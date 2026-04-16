import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { ConfirmInlineAction } from "./ConfirmInlineAction";

const meta: Meta<typeof ConfirmInlineAction> = {
  title: "Generic/ConfirmInlineAction",
  component: ConfirmInlineAction,
};

export default meta;
type Story = StoryObj<typeof ConfirmInlineAction>;

export const Default: Story = {
  args: {
    onConfirm: () => {},
    onCancel: () => {},
  },
};

export const InRow: Story = {
  render: () => {
    const [confirming, setConfirming] = useState(false);
    return (
      <div className="w-[400px] bg-white rounded-md ring-1 ring-gray-200 p-3 flex items-center justify-between">
        <span className="text-sm text-gray-700">Benzene (71-43-2)</span>
        {confirming ? (
          <ConfirmInlineAction
            onConfirm={() => setConfirming(false)}
            onCancel={() => setConfirming(false)}
          />
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  },
};
