import type { Meta, StoryObj } from "@storybook/react";
import { useState, type CSSProperties } from "react";
import { FilterSidebarPanel, filterPanelSectionLabelClass } from "./FilterSidebarPanel";

const meta: Meta<typeof FilterSidebarPanel> = {
  title: "Generic/FilterSidebarPanel",
  component: FilterSidebarPanel,
  decorators: [
    (Story) => (
      <div
        style={
          {
            "--color-primary": "#111625",
            "--color-primary-50": "#e8eaef",
            "--app-header-h": "60px",
          } as CSSProperties
        }
        className="min-h-[680px] bg-gray-100 p-6"
      >
        <div className="mx-auto flex max-w-[1200px] justify-end">
          <Story />
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof FilterSidebarPanel>;

function SampleFilterContent() {
  const [view, setView] = useState("Monthly");

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <span className={filterPanelSectionLabelClass}>Province</span>
        <div className="flex flex-col gap-1.5">
          {["Alberta", "British Columbia", "Saskatchewan"].map((option) => {
            const selected = option === "Alberta";
            return (
              <label
                key={option}
                className={[
                  "relative flex w-full cursor-pointer items-center gap-3 rounded-md border px-3 py-2.5 text-left text-sm transition-colors",
                  selected
                    ? "border border-gray-100 border-l-[3px] border-l-[var(--color-primary)] bg-[var(--color-primary-50)] font-medium text-[var(--color-primary)]"
                    : "border border-gray-100 bg-white text-gray-600 hover:bg-gray-50",
                ].join(" ")}
              >
                <input type="radio" name="province" className="sr-only" readOnly checked={selected} />
                <span className="min-w-0 flex-1 leading-snug">{option}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="-mx-4 my-1 border-t border-gray-200" />

      <div className="flex flex-col gap-2">
        <span className={filterPanelSectionLabelClass}>View Options</span>
        <div className="flex flex-col gap-1.5">
          {["Monthly", "Quarterly", "Annual"].map((option) => {
            const selected = option === view;
            return (
              <button
                key={option}
                type="button"
                onClick={() => setView(option)}
                className={[
                  "relative w-full rounded-md border px-3 py-2.5 text-left text-sm transition-colors",
                  selected
                    ? "border border-gray-100 border-l-[3px] border-l-[var(--color-primary)] bg-[var(--color-primary-50)] font-medium text-[var(--color-primary)]"
                    : "border border-gray-100 bg-white text-gray-600 hover:bg-gray-50",
                ].join(" ")}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      <div className="-mx-4 my-1 border-t border-gray-200" />

      <div className="flex flex-col gap-2">
        <span className={filterPanelSectionLabelClass}>Category</span>
        <select className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]">
          <option>All Categories</option>
          <option>Stack</option>
          <option>Flare</option>
          <option>Vent</option>
        </select>
      </div>
    </div>
  );
}

export const Default: Story = {
  render: () => (
    <FilterSidebarPanel
      title="Filters"
      storageKeyPrefix="storybook-filter-sidebar"
      topOffsetCssVar="--app-header-h"
      className="lg:!static lg:!h-[620px] lg:rounded-xl"
    >
      <SampleFilterContent />
    </FilterSidebarPanel>
  ),
};
