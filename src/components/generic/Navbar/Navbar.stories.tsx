/// <reference path="../../../vite-env.d.ts" />
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Navbar } from "./Navbar";

import steamSvg from "./icons/steam.svg?raw";
import aefHubSvg from "./icons/aef-hub.svg?raw";
import dataPivotSvg from "./icons/data-pivot.svg?raw";
import emissionxSvg from "./icons/emissionx.svg?raw";
import rimSvg from "./icons/rim.svg?raw";
import openpemsSvg from "./icons/openpems.svg?raw";

/** Inline SVG so `fill="currentColor"` follows the Navbar hub text color (light/dark). */
function AppHubIcon({ svg }: { svg: string }) {
  return (
    <span
      className="inline-flex h-full w-full items-center justify-center [&>svg]:block [&>svg]:h-full [&>svg]:w-full"
      dangerouslySetInnerHTML={{ __html: svg }}
      aria-hidden
    />
  );
}

const meta: Meta<typeof Navbar> = {
  title: "Generic/Navbar",
  component: Navbar,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof Navbar>;

const mockApps = [
  {
    label: "Steam",
    href: "https://steam.envirobyte.com",
    icon: <AppHubIcon svg={steamSvg} />,
  },
  {
    label: "AEF Hub",
    href: "https://aefhub.envirobyte.com",
    icon: <AppHubIcon svg={aefHubSvg} />,
  },
  {
    label: "Data Pivot",
    href: "https://datapivot.envirobyte.com",
    icon: <AppHubIcon svg={dataPivotSvg} />,
  },
  {
    label: "EmissionX",
    href: "https://emissionx-dev.envirobyte.com",
    icon: <AppHubIcon svg={emissionxSvg} />,
  },
  {
    label: "RIM",
    href: "https://rim.envirobyte.com",
    icon: <AppHubIcon svg={rimSvg} />,
  },
  {
    label: "AtmosIQ",
    href: "https://atmosiq.envirobyte.com",
    icon: <AppHubIcon svg={openpemsSvg} />,
  },
];

const mockUser = {
  name: "Maxine Afable",
  email: "maxine@envirobyte.com",
  role: "Developer",
};

// ─── AtmosIQ / EmissionX style (with company switcher) ───────────────────────

export const WithCompanySwitcher: Story = {
  name: "AtmosIQ / EmissionX — With Company Switcher",
  args: {
    user: mockUser,
    apps: mockApps,
    company: {
      name: "Demo Company 1",
      facilityName: "Cochrane Extraction Plant",
    },
    showCompanySwitcher: true,
    showNotifications: true,
    notificationCount: 3,
    showSearch: false,
    theme: "light",
    onChangeCompany: () => alert("Change Company clicked"),
    onChangeLog: () => alert("Change Log clicked"),
    onSettings: () => alert("Settings clicked"),
    onThemeToggle: () => alert("Theme toggled"),
    onSignOut: () => alert("Sign Out clicked"),
    onNotificationsClick: () => alert("Notifications clicked"),
    onCompanyClick: () => alert("Company breadcrumb clicked"),
  },
};

// ─── RIM / DataPivot style (no company switcher) ─────────────────────────────

export const WithoutCompanySwitcher: Story = {
  name: "RIM / DataPivot — No Company Switcher",
  args: {
    user: mockUser,
    apps: mockApps,
    showCompanySwitcher: false,
    showNotifications: false,
    showSearch: true,
    searchPlaceholder: "Search...",
    theme: "light",
    onChangeLog: () => alert("Change Log clicked"),
    onSettings: () => alert("Settings clicked"),
    onThemeToggle: () => alert("Theme toggled"),
    onSignOut: () => alert("Sign Out clicked"),
  },
};

// ─── Dark mode ────────────────────────────────────────────────────────────────

export const DarkMode: Story = {
  name: "Dark Mode",
  parameters: {
    backgrounds: { default: "dark" },
  },
  decorators: [
    (Story) => (
      <div className="dark">
        <Story />
      </div>
    ),
  ],
  args: {
    user: mockUser,
    apps: mockApps,
    company: {
      name: "Demo Company 1",
      facilityName: "Cochrane Extraction Plant",
    },
    showCompanySwitcher: true,
    showNotifications: true,
    notificationCount: 2,
    theme: "dark",
    onChangeCompany: () => alert("Change Company clicked"),
    onChangeLog: () => alert("Change Log clicked"),
    onSettings: () => alert("Settings clicked"),
    onThemeToggle: () => alert("Theme toggled"),
    onSignOut: () => alert("Sign Out clicked"),
  },
};

// ─── No notifications, no apps ───────────────────────────────────────────────

export const Minimal: Story = {
  name: "Minimal — No Apps or Notifications",
  args: {
    user: mockUser,
    showCompanySwitcher: false,
    showNotifications: false,
    showSearch: false,
    theme: "light",
    onChangeLog: () => alert("Change Log clicked"),
    onSettings: () => alert("Settings clicked"),
    onThemeToggle: () => alert("Theme toggled"),
    onSignOut: () => alert("Sign Out clicked"),
  },
};
