export interface SpinnerProps {
  label?: string;
  className?: string;
}

export function Spinner({
  label = "",
  className = "",
}: SpinnerProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 ${
        label ? "h-[160px]" : ""
      } ${className}`}
    >
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4" />
      {label && (
        <p className="text-gray-600 dark:text-gray-300">Loading {label}</p>
      )}
    </div>
  );
}
