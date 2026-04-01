"use client";

import { useRef, useEffect, useLayoutEffect, useState } from "react";

export interface SegmentedOption<T extends string = string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  variant?: "pill" | "rounded";
  className?: string;
}

const containerVariants = {
  pill: "rounded-full",
  rounded: "rounded-lg",
};

const indicatorVariants = {
  pill: "rounded-full",
  rounded: "rounded-md",
};

const buttonVariants = {
  pill: "rounded-full",
  rounded: "rounded-md",
};

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  variant = "pill",
  className = "",
}: SegmentedControlProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  const activeIndex = options.findIndex((o) => o.value === value);

  const updateIndicatorRef = useRef<() => void>(() => {});

  updateIndicatorRef.current = () => {
    const container = containerRef.current;
    const activeRef = optionRefs.current[activeIndex];
    if (!container || !activeRef || activeIndex < 0) return;
    const containerRect = container.getBoundingClientRect();
    const activeRect = activeRef.getBoundingClientRect();
    setIndicatorStyle({
      left: activeRect.left - containerRect.left,
      width: activeRect.width,
    });
  };

  useLayoutEffect(() => {
    updateIndicatorRef.current();
  }, [activeIndex, options.length]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const resizeObserver = new ResizeObserver(() => updateIndicatorRef.current());
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex w-fit ${containerVariants[variant]} bg-gray-100 p-1 ${className}`}
      role="tablist"
    >
      <div
        className={`absolute top-1 bottom-1 ${indicatorVariants[variant]} bg-primary transition-[left,width] duration-200 ease-out`}
        style={{
          left: indicatorStyle.left,
          width: indicatorStyle.width,
        }}
        aria-hidden
      />
      {options.map((option, index) => (
        <button
          key={option.value}
          ref={(el) => {
            optionRefs.current[index] = el;
          }}
          type="button"
          role="tab"
          aria-selected={value === option.value}
          onClick={() => onChange(option.value)}
          className={`relative z-10 ${buttonVariants[variant]} px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
            value === option.value
              ? "text-white"
              : "text-primary hover:text-primary-hover"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
