import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Tabs } from "./Tabs";

const meta: Meta<typeof Tabs> = {
  title: "Generic/Tabs",
  component: Tabs,
};

export default meta;
type Story = StoryObj<typeof Tabs>;

function TabsDemo({ tabs }: { tabs: string[] }) {
  const [value, setValue] = useState(tabs[0]);
  return <Tabs tabs={tabs} value={value} onChange={setValue} />;
}

export const Default: Story = {
  render: () => <TabsDemo tabs={["Alarms", "Equipment", "Reports"]} />,
};

export const TwoTabs: Story = {
  render: () => <TabsDemo tabs={["Alberta", "British Columbia"]} />,
};

export const ManyTabs: Story = {
  render: () => (
    <TabsDemo
      tabs={["Overview", "Alarms", "Equipment", "Reports", "Settings"]}
    />
  ),
};
