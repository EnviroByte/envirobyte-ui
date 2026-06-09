import type { Meta, StoryObj } from "@storybook/react";
import { AppHubDropdown } from "./AppHubDropdown";

const meta: Meta<typeof AppHubDropdown> = {
  title: "Generic/AppHubDropdown",
  component: AppHubDropdown,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof AppHubDropdown>;

export const FromAtmosIQ: Story = {
  name: "Current App — AtmosIQ",
  args: {
    currentApp: "atmosiq",
  },
};

export const FromRIM: Story = {
  name: "Current App — RIM",
  args: {
    currentApp: "rim",
  },
};

export const FromDataPivot: Story = {
  name: "Current App — DataPivot",
  args: {
    currentApp: "datapivot",
  },
};

export const AlignLeft: Story = {
  args: {
    currentApp: "emissionx",
    align: "left",
  },
};
