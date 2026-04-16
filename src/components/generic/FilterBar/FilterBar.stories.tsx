import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { FilterBar, type FilterConfig, type FilterOption } from "./FilterBar";

const meta: Meta<typeof FilterBar> = {
  title: "Generic/FilterBar",
  component: FilterBar,
};

export default meta;
type Story = StoryObj<typeof FilterBar>;

const equipmentOptions: FilterOption[] = [
  { value: "eq-1", label: "Compressor C-101" },
  { value: "eq-2", label: "Engine E-202" },
  { value: "eq-3", label: "Flare F-303" },
];

const substanceOptions: FilterOption[] = [
  { value: "sub-1", label: "NOx" },
  { value: "sub-2", label: "SOx" },
  { value: "sub-3", label: "CO" },
  { value: "sub-4", label: "PM2.5" },
];

const yearOptions: FilterOption[] = [
  { value: "2023", label: "2023" },
  { value: "2024", label: "2024" },
  { value: "2025", label: "2025" },
];

const monthOptions: FilterOption[] = Array.from({ length: 12 }, (_, i) => ({
  value: String(i + 1),
  label: new Date(0, i).toLocaleString("en", { month: "long" }),
}));

const filters: FilterConfig[] = [
  { key: "equipment", label: "Equipment", options: equipmentOptions },
  { key: "substance", label: "Substance", options: substanceOptions },
  { key: "year", label: "Year", options: yearOptions },
  { key: "month", label: "Month", options: monthOptions },
];

function FilterBarDemo({ initial }: { initial?: Record<string, FilterOption[]> }) {
  const [values, setValues] = useState<Record<string, FilterOption[]>>(initial ?? {});
  return <FilterBar filters={filters} values={values} onChange={setValues} />;
}

export const Default: Story = {
  render: () => <FilterBarDemo />,
};

export const WithPreselected: Story = {
  render: () => (
    <FilterBarDemo
      initial={{
        substance: [substanceOptions[0], substanceOptions[1]],
        year: [yearOptions[2]],
      }}
    />
  ),
};

export const LoadingOptions: Story = {
  render: () => {
    const loadingFilters: FilterConfig[] = filters.map((f) => ({ ...f, isLoading: true }));
    const [values, setValues] = useState<Record<string, FilterOption[]>>({});
    return <FilterBar filters={loadingFilters} values={values} onChange={setValues} />;
  },
};

export const ThreeColumns: Story = {
  render: () => {
    const [values, setValues] = useState<Record<string, FilterOption[]>>({});
    return (
      <FilterBar
        filters={filters.slice(0, 3)}
        values={values}
        onChange={setValues}
        columns={{ base: 1, md: 3, lg: 3 }}
      />
    );
  },
};
