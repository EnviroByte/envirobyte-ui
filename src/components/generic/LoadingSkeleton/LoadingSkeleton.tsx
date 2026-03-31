import { cn } from "../../../lib/utils";

export interface LoadingSkeletonProps {
  className?: string;
  lines?: number;
  circle?: boolean;
}

function SkeletonLine({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "h-4 animate-pulse rounded-md bg-gray-200",
        className
      )}
    />
  );
}

export function LoadingSkeleton({
  className,
  lines = 3,
  circle = false,
}: LoadingSkeletonProps) {
  if (circle) {
    return (
      <div
        className={cn(
          "h-10 w-10 animate-pulse rounded-full bg-gray-200",
          className
        )}
      />
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonLine
          key={i}
          className={i === lines - 1 ? "w-3/4" : "w-full"}
        />
      ))}
    </div>
  );
}
