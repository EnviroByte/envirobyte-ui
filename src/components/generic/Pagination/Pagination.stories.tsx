import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Pagination } from "./Pagination";

const meta: Meta<typeof Pagination> = {
  title: "Generic/Pagination",
  component: Pagination,
};

export default meta;
type Story = StoryObj<typeof Pagination>;

function PaginationDemo({ totalPages }: { totalPages: number }) {
  const [page, setPage] = useState(1);
  return (
    <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
  );
}

export const FewPages: Story = {
  render: () => <PaginationDemo totalPages={5} />,
};

export const ManyPages: Story = {
  render: () => <PaginationDemo totalPages={20} />,
};

export const SinglePage: Story = {
  render: () => <PaginationDemo totalPages={1} />,
};
