"use client";

import React, { useState, useMemo } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

export interface DataTableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  minWidth?: string;
}

interface DataTableProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  columns: DataTableColumn[];
  onSort?: (key: string, direction: "asc" | "desc") => void;
  isRestricted?: boolean;
}

const getDefaultMinWidth = (key: string): string => {
  const widthMap: Record<string, string> = {
    year: "80px",
    month: "80px",
    operator_name: "180px",
    petrinex_id: "120px",
    activity_id: "100px",
    product_id: "100px",
    volume: "100px",
    reporting_facility_province_state: "120px",
    submission_date: "120px",
    last_updated_on: "130px",
    unit: "80px",
    value: "100px",
    oe_m3: "100px",
  };
  return widthMap[key] || "100px";
};

const dateColumns = new Set(["submission_date", "last_updated_on", "created_at", "updated_at", "scan_time"]);
const fourDecimalColumns = new Set(["value", "oe_m3"]);

const formatCellValue = (key: string, value: unknown): string => {
  if (value === null || value === undefined) return "-";

  if (dateColumns.has(key) && typeof value === "string") {
    const dateTimeMatch = value.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2})/);
    if (dateTimeMatch) {
      return `${dateTimeMatch[1]} ${dateTimeMatch[2]}`;
    }
    const dateMatch = value.match(/^(\d{4}-\d{2}-\d{2})/);
    if (dateMatch) {
      return dateMatch[1];
    }
  }

  if (fourDecimalColumns.has(key) && (typeof value === "number" || !isNaN(Number(value)))) {
    return Number(value).toFixed(4);
  }

  return String(value);
};

export function DataTable({ data, columns, onSort, isRestricted = false }: DataTableProps) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});

  const handleSort = (key: string) => {
    const newDirection =
      sortKey === key && sortDirection === "asc" ? "desc" : "asc";
    setSortKey(key);
    setSortDirection(newDirection);
    onSort?.(key, newDirection);
  };

  const handleFilterChange = (key: string, value: string) => {
    setColumnFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredData = useMemo(() => {
    if (!Array.isArray(data)) return [];

    return data.filter((row) => {
      return Object.entries(columnFilters).every(([key, filterValue]) => {
        if (!filterValue) return true;
        const cellValue = row[key];
        if (cellValue === null || cellValue === undefined) return false;
        return String(cellValue).toLowerCase().includes(filterValue.toLowerCase());
      });
    });
  }, [data, columnFilters]);

  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      const comparison = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [filteredData, sortKey, sortDirection]);

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <p className="text-center py-6 text-gray-500">No data available</p>
    );
  }

  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                style={{ minWidth: column.minWidth || getDefaultMinWidth(column.key) }}
              >
                <div className="flex items-center gap-1 whitespace-nowrap">
                  {column.sortable !== false && (
                    <button
                      onClick={() => handleSort(String(column.key))}
                      className="hover:bg-gray-100 p-0.5 rounded transition-colors flex-shrink-0"
                    >
                      <div className="flex flex-col">
                        <ChevronUp
                          className={`w-3 h-3 -mb-1 ${
                            sortKey === column.key && sortDirection === "asc"
                              ? "text-primary"
                              : "text-gray-400"
                          }`}
                        />
                        <ChevronDown
                          className={`w-3 h-3 ${
                            sortKey === column.key && sortDirection === "desc"
                              ? "text-primary"
                              : "text-gray-400"
                          }`}
                        />
                      </div>
                    </button>
                  )}
                  <span>{column.label}</span>
                </div>
                {column.filterable !== false && (
                  <div className="mt-2">
                    <input
                      type="text"
                      value={columnFilters[String(column.key)] || ""}
                      onChange={(e) =>
                        handleFilterChange(column.key, e.target.value)
                      }
                      placeholder="Filter"
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary font-normal normal-case"
                    />
                  </div>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {sortedData.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-3 py-6 text-center text-gray-500">
                No matching records found
              </td>
            </tr>
          ) : (
            sortedData.map((row, rowIndex) => {
              const blurStartRow = 4;
              const shouldBlur = isRestricted && rowIndex >= blurStartRow;
              const blurIndex = rowIndex - blurStartRow;
              const blurAmount = shouldBlur ? Math.min(0.8 + blurIndex * 1, 5) : 0;
              const rowOpacity = shouldBlur ? Math.max(0.35, 1 - blurIndex * 0.1) : 1;

              return (
                <tr
                  key={rowIndex}
                  className={`transition-colors ${shouldBlur ? "select-none" : "hover:bg-gray-50"}`}
                  style={shouldBlur ? { filter: `blur(${blurAmount}px)`, opacity: rowOpacity } : undefined}
                >
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className="px-3 py-3 text-sm text-gray-700 whitespace-nowrap"
                    >
                      {formatCellValue(column.key, row[column.key])}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
          {isRestricted && sortedData.length > 0 && Array.from({ length: 5 }).map((_, index) => {
            const continuedBlur = Math.min(4 + index * 1.2, 8);
            const continuedOpacity = Math.max(0.15, 0.45 - index * 0.07);

            return (
              <tr key={`blurred-${index}`} className="border-b border-gray-100 select-none pointer-events-none"
                style={{ filter: `blur(${continuedBlur}px)`, opacity: continuedOpacity }}
              >
                {columns.map((column) => (
                  <td
                    key={`blurred-${index}-${column.key}`}
                    className="px-3 py-3 text-sm text-gray-400 whitespace-nowrap"
                    aria-hidden="true"
                  >
                    Value
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
