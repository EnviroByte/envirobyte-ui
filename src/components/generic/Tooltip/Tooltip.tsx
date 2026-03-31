"use client";

import type { ReactNode } from "react";

interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: "top" | "bottom";
  align?: "center" | "end";
}

export function Tooltip({
  content,
  children,
  position = "bottom",
  align = "center",
}: TooltipProps) {
  const verticalClasses =
    position === "top" ? "bottom-full mb-2" : "top-full mt-2";

  const alignClasses =
    align === "end" ? "right-0" : "left-1/2 -translate-x-1/2";

  const arrowAlign =
    align === "end" ? "right-4" : "left-1/2 -translate-x-1/2";

  const arrowClasses =
    position === "top"
      ? `top-full ${arrowAlign} border-t-gray-800 border-l-transparent border-r-transparent border-b-transparent border-t-4 border-l-4 border-r-4`
      : `bottom-full ${arrowAlign} border-b-gray-800 border-l-transparent border-r-transparent border-t-transparent border-b-4 border-l-4 border-r-4`;

  return (
    <div className="relative group inline-block">
      {children}
      <div
        className={`absolute ${verticalClasses} ${alignClasses} z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 w-56`}
      >
        <div className="bg-gray-800 text-white text-xs leading-relaxed font-medium px-3 py-2 rounded-md shadow-lg">
          {content}
          <div className={`absolute ${arrowClasses} w-0 h-0`} />
        </div>
      </div>
    </div>
  );
}
