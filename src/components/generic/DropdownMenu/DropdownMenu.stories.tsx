import type { Meta, StoryObj } from "@storybook/react";
import { Edit3, Copy, Trash2, Download, MoreVertical } from "lucide-react";
import { DropdownMenu } from "./DropdownMenu";

const meta: Meta<typeof DropdownMenu> = {
  title: "Generic/DropdownMenu",
  component: DropdownMenu,
};

export default meta;
type Story = StoryObj<typeof DropdownMenu>;

export const Default: Story = {
  args: {
    label: "Actions",
    items: [
      { label: "Edit", value: "edit", icon: <Edit3 className="h-4 w-4" /> },
      { label: "Duplicate", value: "duplicate", icon: <Copy className="h-4 w-4" /> },
      { label: "Download", value: "download", icon: <Download className="h-4 w-4" /> },
      { label: "Delete", value: "delete", icon: <Trash2 className="h-4 w-4" />, danger: true },
    ],
    onSelect: (v) => alert(`Selected: ${v}`),
  },
};

export const AlignRight: Story = {
  render: () => (
    <div className="flex justify-end">
      <DropdownMenu
        label="More"
        align="right"
        items={[
          { label: "View details", value: "view" },
          { label: "Export CSV", value: "csv" },
          { label: "Remove", value: "remove", danger: true },
        ]}
        onSelect={(v) => alert(v)}
      />
    </div>
  ),
};

export const IconTrigger: Story = {
  render: () => (
    <DropdownMenu
      trigger={<MoreVertical className="h-5 w-5 text-gray-500" />}
      items={[
        { label: "Edit", value: "edit" },
        { label: "Delete", value: "delete", danger: true },
      ]}
      onSelect={(v) => alert(v)}
    />
  ),
};

export const WithDisabled: Story = {
  args: {
    label: "Options",
    items: [
      { label: "Active option", value: "active" },
      { label: "Disabled option", value: "disabled", disabled: true },
      { label: "Another active", value: "another" },
    ],
    onSelect: (v) => alert(v),
  },
};
