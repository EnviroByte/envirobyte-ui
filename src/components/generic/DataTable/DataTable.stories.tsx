import type { Meta, StoryObj } from "@storybook/react";
import { DataTable, type DataTableColumn } from "./DataTable";

const meta: Meta<typeof DataTable> = {
  title: "Generic/DataTable",
  component: DataTable,
};

export default meta;
type Story = StoryObj<typeof DataTable>;

const columns: DataTableColumn[] = [
  { key: "operator_name", label: "Operator" },
  { key: "year", label: "Year" },
  { key: "month", label: "Month" },
  { key: "volume", label: "Volume" },
  { key: "unit", label: "Unit" },
];

const data = [
  { operator_name: "ACME Corp", year: 2025, month: 1, volume: 1234.5678, unit: "m³" },
  { operator_name: "ACME Corp", year: 2025, month: 2, volume: 2345.6789, unit: "m³" },
  { operator_name: "Beta Inc", year: 2025, month: 1, volume: 3456.789, unit: "m³" },
  { operator_name: "Beta Inc", year: 2025, month: 2, volume: 4567.891, unit: "m³" },
  { operator_name: "Gamma LLC", year: 2025, month: 1, volume: 5678.912, unit: "m³" },
];

export const Default: Story = {
  args: { data, columns },
};

export const Restricted: Story = {
  args: { data: [...data, ...data, ...data], columns, isRestricted: true },
};

export const Empty: Story = {
  args: { data: [], columns },
};
