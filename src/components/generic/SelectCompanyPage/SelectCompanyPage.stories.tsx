import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { SelectCompanyPage } from "./SelectCompanyPage";
import type { SelectableCompany } from "./SelectCompanyPage";

const meta: Meta<typeof SelectCompanyPage> = {
  title: "Generic/SelectCompanyPage",
  component: SelectCompanyPage,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof SelectCompanyPage>;

const companies: SelectableCompany[] = [
  { id: "1", name: "Acme Energy Corp", role: "admin" },
  { id: "2", name: "Northern Basin Resources", role: "viewer" },
  { id: "3", name: "Westfield Exploration Ltd." },
];

export const Default: Story = {
  args: {
    companies,
    selectedCompanyId: undefined,
    onSelect: (c) => alert(`Selected: ${c.name}`),
    onCancel: () => alert("Cancelled"),
  },
};

export const WithSelection: Story = {
  args: {
    companies,
    selectedCompanyId: "2",
    onSelect: (c) => alert(`Selected: ${c.name}`),
    onCancel: () => alert("Cancelled"),
  },
};

export const Empty: Story = {
  args: {
    companies: [],
    onSelect: () => {},
    onCancel: () => alert("Cancelled"),
  },
};

export const NoCancelButton: Story = {
  args: {
    companies,
    selectedCompanyId: "1",
    onSelect: (c) => alert(`Selected: ${c.name}`),
  },
};

export const Interactive: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [selected, setSelected] = useState<SelectableCompany | null>(null);
    return (
      <SelectCompanyPage
        companies={companies}
        selectedCompanyId={selected?.id}
        onSelect={setSelected}
        onCancel={() => setSelected(null)}
      />
    );
  },
};
