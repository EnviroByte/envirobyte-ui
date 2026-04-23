import type { Meta, StoryObj } from "@storybook/react";
import { CloudRain, Plus, Download } from "lucide-react";
import { Button } from "../../primitives/Button/Button";
import { PageHeader } from "./PageHeader";

const meta: Meta<typeof PageHeader> = {
  title: "Generic/PageHeader",
  component: PageHeader,
};

export default meta;
type Story = StoryObj<typeof PageHeader>;

export const Default: Story = {
  args: {
    title: "Releases to Air",
    description:
      "Summary of all air releases aggregated from Stationary Fuel Combustion, Flaring, and Fugitive sources.",
  },
};

export const WithIconAndBadge: Story = {
  args: {
    icon: <CloudRain className="h-8 w-8 text-sky-500" />,
    title: "Releases to Air",
    badge: "Destinations",
    description:
      "Summary of all air releases aggregated from Stationary Fuel Combustion, Flaring, and Fugitive sources.",
  },
};

export const WithActions: Story = {
  args: {
    icon: <CloudRain className="h-8 w-8 text-sky-500" />,
    title: "Releases to Air",
    badge: "Destinations",
    description:
      "Summary of all air releases aggregated from Stationary Fuel Combustion, Flaring, and Fugitive sources.",
    actions: (
      <>
        <Button variant="outline" leftIcon={<Download className="h-4 w-4" />}>
          Import
        </Button>
        <Button leftIcon={<Plus className="h-4 w-4" />}>Add Source</Button>
      </>
    ),
  },
};
