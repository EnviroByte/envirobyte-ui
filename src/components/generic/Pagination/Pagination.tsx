"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 0) return null;

  const safePage = Math.max(1, Math.min(currentPage, totalPages));

  const goToPage = (page: number) => {
    const clamped = Math.max(1, Math.min(page, totalPages));
    onPageChange(clamped);
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (safePage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, safePage - 1);
      const end = Math.min(totalPages - 1, safePage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      if (safePage < totalPages - 2) {
        pages.push("...");
      }

      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const isFirst = safePage <= 1;
  const isLast = safePage >= totalPages;

  return (
    <div className="flex justify-center items-center gap-2 mt-6 py-4">
      <button
        onClick={() => goToPage(safePage - 1)}
        disabled={isFirst}
        className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
          isFirst
            ? "text-gray-400 cursor-not-allowed"
            : "text-primary hover:bg-primary-50"
        }`}
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </button>

      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, index) => (
          <React.Fragment key={index}>
            {page === "..." ? (
              <span className="px-3 py-2 text-gray-500">...</span>
            ) : (
              <button
                onClick={() => goToPage(page as number)}
                className={`min-w-[40px] px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  safePage === page
                    ? "bg-primary text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>

      <button
        onClick={() => goToPage(safePage + 1)}
        disabled={isLast}
        className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
          isLast
            ? "text-gray-400 cursor-not-allowed"
            : "text-primary hover:bg-primary-50"
        }`}
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
