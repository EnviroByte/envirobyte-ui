import type { Meta, StoryObj } from "@storybook/react";
import { Flame, Database, Clock } from "lucide-react";
import { StatCard } from "./StatCard";

const meta: Meta<typeof StatCard> = {
  title: "Generic/StatCard",
  component: StatCard,
};

export default meta;
type Story = StoryObj<typeof StatCard>;

export const Default: Story = {
  args: {
    label: "Total Fuel Allocated",
    value: "12,345.67",
    unit: "e³m³",
    accent: "orange",
  },
};

export const WithIcon: Story = {
  args: {
    label: "Unique Substances",
    value: "24",
    accent: "cyan",
    icon: <Database className="h-5 w-5" />,
  },
};

export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl">
      <StatCard
        label="Total Fuel Allocated"
        value="12,345.67"
        unit="e³m³"
        accent="orange"
        icon={<Flame className="h-5 w-5" />}
      />
      <StatCard
        label="Total Operating Hours"
        value="8,760"
        unit="h"
        accent="slate"
        icon={<Clock className="h-5 w-5" />}
      />
      <StatCard
        label="Unique Substances"
        value="24"
        accent="emerald"
        icon={<Database className="h-5 w-5" />}
      />
    </div>
  ),
};
