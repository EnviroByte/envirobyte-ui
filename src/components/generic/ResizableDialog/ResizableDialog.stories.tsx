import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { ResizableDialog } from "./ResizableDialog";
import { Button } from "../../primitives/Button";

const meta: Meta<typeof ResizableDialog> = {
  title: "Generic/ResizableDialog",
  component: ResizableDialog,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof ResizableDialog>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Resizable Dialog</Button>
        <ResizableDialog
          open={open}
          onClose={() => setOpen(false)}
          title="Resizable Dialog"
          description="Drag the edges or corners to resize. Drag the title bar to move."
          defaultWidth={560}
          footer={
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={() => setOpen(false)}>Save</Button>
            </div>
          }
        >
          <p className="text-sm text-slate-600">
            This dialog can be resized by dragging any edge or corner, and moved by dragging the title bar.
            Content scrolls automatically when the dialog is too small to fit it.
          </p>
        </ResizableDialog>
      </>
    );
  },
};
