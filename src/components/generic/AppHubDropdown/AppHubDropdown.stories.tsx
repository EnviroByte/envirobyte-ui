import type { Meta, StoryObj } from "@storybook/react";
import { Activity, CloudLightning, Database, Factory, Flame, BarChart3 } from "lucide-react";
import { AppHubDropdown } from "./AppHubDropdown";

const STANDARD_APPS = [
  { label: "EmissionX", href: "#", icon: <Activity className="h-6 w-6 text-emerald-500" /> },
  { label: "AtmosIQ", href: "#", icon: <CloudLightning className="h-6 w-6 text-cyan-500" />, active: true },
  { label: "RIM", href: "#", icon: <Flame className="h-6 w-6 text-orange-500" /> },
  { label: "DataPivot", href: "#", icon: <Database className="h-6 w-6 text-violet-500" /> },
  { label: "EF Hub", href: "#", icon: <Factory className="h-6 w-6 text-slate-500" /> },
  { label: "OpenPEMS", href: "#", icon: <BarChart3 className="h-6 w-6 text-slate-500" /> },
];

const meta: Meta<typeof AppHubDropdown> = {
  title: "Generic/AppHubDropdown",
  component: AppHubDropdown,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof AppHubDropdown>;

export const TwoColumns: Story = {
  args: {
    apps: STANDARD_APPS.slice(0, 4),
    columns: 2,
  },
};

export const ThreeColumns: Story = {
  args: {
    apps: STANDARD_APPS,
    columns: 3,
  },
};

export const WithActiveApp: Story = {
  args: {
    apps: STANDARD_APPS,
    columns: 3,
  },
};

export const AlignLeft: Story = {
  args: {
    apps: STANDARD_APPS.slice(0, 4),
    align: "left",
  },
};
