import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Button } from "../Button/Button";
import { Modal } from "./Modal";

const meta: Meta<typeof Modal> = {
  title: "Primitives/Modal",
  component: Modal,
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl", "full"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

function ModalDemo({
  size,
  title,
  description,
}: {
  size?: "sm" | "md" | "lg" | "xl" | "full";
  title?: string;
  description?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Modal</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={title || "Confirm Action"}
        description={description}
        size={size}
      >
        <p className="text-sm text-gray-600">
          Are you sure you want to proceed with this action? This cannot be
          undone.
        </p>
        <div className="mt-4 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)}>Confirm</Button>
        </div>
      </Modal>
    </>
  );
}

export const Default: Story = {
  render: () => <ModalDemo />,
};

export const WithDescription: Story = {
  render: () => (
    <ModalDemo
      title="Delete Item"
      description="This will permanently remove the item from the system."
    />
  ),
};

export const Large: Story = {
  render: () => <ModalDemo size="lg" title="Large Modal" />,
};

export const Small: Story = {
  render: () => <ModalDemo size="sm" title="Small Modal" />,
};
