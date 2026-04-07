import type { Meta, StoryObj } from "@storybook/react";
import { Footer } from "./Footer";

const meta: Meta<typeof Footer> = {
  title: "Generic/Footer",
  component: Footer,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof Footer>;

export const Default: Story = {};

export const DarkMode: Story = {
  parameters: {
    backgrounds: { default: "dark" },
  },
  decorators: [
    (Story) => (
      <div className="dark bg-zinc-950">
        <Story />
      </div>
    ),
  ],
};

export const CustomLinks: Story = {
  args: {
    links: [
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Support", href: "/support" },
    ],
  },
};

export const CustomBranding: Story = {
  args: {
    companyName: "AcmeCorp",
    websiteUrl: "acmecorp.com",
    contactEmail: "hello@acmecorp.com",
    location: "Toronto, Ontario, Canada",
    year: 2026,
  },
};
