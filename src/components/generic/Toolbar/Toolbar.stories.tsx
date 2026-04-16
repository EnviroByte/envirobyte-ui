import type { Meta, StoryObj } from "@storybook/react";
import { Download } from "lucide-react";
import { Button } from "../../primitives/Button/Button";
import { FilterSelect } from "../FilterSelect/FilterSelect";
import { SearchInput } from "../SearchInput/SearchInput";
import { Toolbar } from "./Toolbar";

const meta: Meta<typeof Toolbar> = {
  title: "Generic/Toolbar",
  component: Toolbar,
};

export default meta;
type Story = StoryObj<typeof Toolbar>;

export const Default: Story = {
  render: () => (
    <div className="bg-white rounded-2xl ring-1 ring-gray-200 shadow-sm overflow-hidden w-full max-w-4xl">
      <Toolbar
        leading={<SearchInput placeholder="Search equipment..." />}
        middle={
          <>
            <FilterSelect
              placeholder="All Years"
              options={["2023", "2024", "2025"]}
            />
            <FilterSelect
              placeholder="All Months"
              options={["Jan", "Feb", "Mar"]}
            />
          </>
        }
        trailing={
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download className="h-4 w-4" />}
          >
            Export
          </Button>
        }
      />
    </div>
  ),
};
