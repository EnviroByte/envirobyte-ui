import type { Meta, StoryObj } from "@storybook/react";
import { Edit3, Eye, Trash2, PowerOff } from "lucide-react";
import { TableView, type TableViewColumn } from "./TableView";
import type { ActionItem } from "../ActionsDropdown";

interface SiteRow {
  id: string;
  name: string;
  petrinex_id: string;
  type: string;
  role: string;
  latitude: number;
  status: "Active" | "Inactive";
}

const meta: Meta<typeof TableView<SiteRow>> = {
  title: "Generic/TableView",
  component: TableView,
};
export default meta;

type Story = StoryObj<typeof TableView<SiteRow>>;

const columns: TableViewColumn<SiteRow>[] = [
  {
    key: "name",
    header: "Name",
    sortable: true,
    cellClassName: "text-sm font-medium text-gray-900",
    render: (row) => row.name,
  },
  {
    key: "petrinex_id",
    header: "Petrinex ID",
    sortable: true,
    cellClassName: "text-sm text-gray-600 font-mono",
    render: (row) => row.petrinex_id,
  },
  {
    key: "type",
    header: "Type",
    sortable: true,
    cellClassName: "text-sm text-gray-600",
    render: (row) => row.type,
  },
  {
    key: "role",
    header: "Role",
    cellClassName: "text-sm text-gray-600",
    render: (row) => row.role,
  },
  {
    key: "latitude",
    header: "Latitude",
    sortable: true,
    cellClassName: "text-sm text-gray-600",
    render: (row) => row.latitude.toFixed(4),
  },
  {
    key: "status",
    header: "Status",
    stickyRight: true,
    render: (row) => (
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
          row.status === "Active"
            ? "bg-green-50 text-green-700"
            : "bg-gray-100 text-gray-600"
        }`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            row.status === "Active" ? "bg-green-500" : "bg-gray-400"
          }`}
        />
        {row.status}
      </span>
    ),
  },
];

const data: SiteRow[] = [
  { id: "1", name: "BEC WILGREN 5-33", petrinex_id: "ABBT0122020", type: "Conventional Oil Gas", role: "Operator", latitude: 52.5713, status: "Active" },
  { id: "2", name: "ATCOR WILL 7-17", petrinex_id: "ABBT9670287", type: "Conventional Oil Gas", role: "Operator", latitude: 52.7043, status: "Active" },
  { id: "3", name: "BEC HZ WILLGR", petrinex_id: "ABBT0139498", type: "Conventional Oil Gas", role: "Operator", latitude: 52.5364, status: "Inactive" },
  { id: "4", name: "ALPHA PAD 12-5", petrinex_id: "ABBT0198765", type: "Oil Sands", role: "Licensee", latitude: 56.7234, status: "Active" },
  { id: "5", name: "BETA WELL 3-21", petrinex_id: "ABBT0145632", type: "Conventional Oil Gas", role: "Operator", latitude: 51.0482, status: "Active" },
];

const actionItems = (row: SiteRow): ActionItem[] => [
  { label: "Edit", value: "edit", icon: <Edit3 className="h-4 w-4" /> },
  { label: "View details", value: "view", icon: <Eye className="h-4 w-4" /> },
  { label: "Deactivate", value: "deactivate", icon: <PowerOff className="h-4 w-4" />, danger: true },
  { label: "Delete", value: "delete", icon: <Trash2 className="h-4 w-4" />, danger: true },
];

export const Default: Story = {
  args: {
    columns,
    data,
    rowKey: (row) => row.id,
    actionItems,
    onAction: (value, row) => console.log(value, row),
  },
};

export const WithPagination: Story = {
  args: {
    columns,
    data,
    rowKey: (row) => row.id,
    actionItems,
    onAction: (value, row) => console.log(value, row),
    totalPages: 5,
    currentPage: 1,
    onPageChange: (page) => console.log("page", page),
  },
};

export const Loading: Story = {
  args: {
    columns,
    data: [],
    rowKey: (row) => row.id,
    loading: true,
  },
};

export const Error: Story = {
  args: {
    columns,
    data: [],
    rowKey: (row) => row.id,
    error: "Network error",
    errorTitle: "Failed to load sites",
  },
};

export const Empty: Story = {
  args: {
    columns,
    data: [],
    rowKey: (row) => row.id,
    emptyTitle: "No sites found",
    emptyDescription: "No sites registered for this company.",
  },
};

export const NoActions: Story = {
  args: {
    columns,
    data,
    rowKey: (row) => row.id,
  },
};
