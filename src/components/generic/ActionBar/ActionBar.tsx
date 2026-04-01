"use client";

import { Plus, Upload, Download } from "lucide-react";
import { cn } from "../../../lib/utils";

export interface ActionBarProps {
  onCreate?: () => void;
  onUpload?: () => void;
  onDownload?: () => void;
  createLabel?: string;
  showCreate?: boolean;
  showUpload?: boolean;
  showDownload?: boolean;
  className?: string;
}

export function ActionBar({
  onCreate,
  onUpload,
  onDownload,
  createLabel = "Create a new entry",
  showCreate = true,
  showUpload = true,
  showDownload = true,
  className,
}: ActionBarProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {showCreate && (
        <button
          type="button"
          onClick={onCreate}
          className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors h-[38px] whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> {createLabel}
        </button>
      )}
      <div className="flex gap-2">
        {showUpload && (
          <button
            type="button"
            onClick={onUpload}
            className="w-[38px] h-[38px] border border-gray-200 rounded-md flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
            aria-label="Upload"
          >
            <Upload className="w-4 h-4" />
          </button>
        )}
        {showDownload && (
          <button
            type="button"
            onClick={onDownload}
            className="w-[38px] h-[38px] border border-gray-200 rounded-md flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
            aria-label="Download"
          >
            <Download className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
