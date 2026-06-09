/// <reference path="../../../vite-env.d.ts" />
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { getAppHubApps } from "../AppHubDropdown/appHubApps";
import { Navbar } from "./Navbar";

const meta: Meta<typeof Navbar> = {
  title: "Generic/Navbar",
  component: Navbar,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof Navbar>;

const mockApps = getAppHubApps();

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
