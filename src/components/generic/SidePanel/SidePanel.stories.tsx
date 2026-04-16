import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SidePanel } from "./SidePanel";

const meta: Meta<typeof SidePanel> = {
  title: "Generic/SidePanel",
  component: SidePanel,
};

export default meta;
type Story = StoryObj<typeof SidePanel>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <div className="flex h-[400px] bg-gray-50 rounded-xl overflow-hidden ring-1 ring-gray-200">
        <div className="flex-1 p-4 text-sm text-gray-500">
          Main content area
        </div>
        <SidePanel open={open}>
          <div className="p-3 flex items-center justify-between">
            {open && <span className="text-sm font-semibold">Filters</span>}
            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="p-1.5 rounded hover:bg-gray-100"
            >
              {open ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </button>
          </div>
          {open && (
            <div className="px-3 text-sm text-gray-500">Panel content</div>
          )}
        </SidePanel>
      </div>
    );
  },
};
