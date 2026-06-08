import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { CommandPalette } from "./CommandPalette";
import { SearchTriggerButton } from "./SearchTriggerButton";

const SAMPLE_ITEMS = [
  { label: "Dashboard", href: "/", keywords: ["home", "overview"] },
  { label: "Fuel Input", href: "/field-input/fuel", keywords: ["fuel", "gas"] },
  { label: "Flare Input", href: "/field-input/flare", keywords: ["flare", "burn"] },
  { label: "Vent Input", href: "/field-input/vent", keywords: ["vent", "emission"] },
  { label: "Equipment Inventory", href: "/equipment", keywords: ["inventory", "asset"] },
  { label: "FFVF Report", href: "/ffvf-report", keywords: ["report", "ffvf"] },
  { label: "Regulatory Requirements", href: "/regulatory", keywords: ["compliance", "rules"] },
];

const SAMPLE_RECENT_SEARCHES = ["fuel", "regulatory"];
const SAMPLE_RECENT_PAGES = [
  { label: "Dashboard", href: "/" },
  { label: "Fuel Input", href: "/field-input/fuel" },
];

const meta: Meta<typeof CommandPalette> = {
  title: "Generic/CommandPalette",
  component: CommandPalette,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof CommandPalette>;

export function WithTrigger() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-8">
      <SearchTriggerButton onClick={() => setOpen(true)} className="w-64" />
      <CommandPalette
        isOpen={open}
        onOpenChange={setOpen}
        items={SAMPLE_ITEMS}
        recentSearches={SAMPLE_RECENT_SEARCHES}
        recentPages={SAMPLE_RECENT_PAGES}
        onNavigate={(href) => {
          alert(`Navigate to: ${href}`);
          setOpen(false);
        }}
      />
    </div>
  );
}

export const EmptyRecents: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <CommandPalette
        isOpen={open}
        onOpenChange={setOpen}
        items={SAMPLE_ITEMS}
        recentSearches={[]}
        recentPages={[]}
        onNavigate={() => {}}
      />
    );
  },
};

export const WithRecents: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <CommandPalette
        isOpen={open}
        onOpenChange={setOpen}
        items={SAMPLE_ITEMS}
        recentSearches={SAMPLE_RECENT_SEARCHES}
        recentPages={SAMPLE_RECENT_PAGES}
        onNavigate={() => {}}
      />
    );
  },
};

export const TriggerButtonVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 p-8">
      <SearchTriggerButton onClick={() => {}} />
      <SearchTriggerButton onClick={() => {}} placeholder="Search pages..." className="w-64" />
      <SearchTriggerButton onClick={() => {}} shortcut="Ctrl+K" className="w-72" />
    </div>
  ),
};
