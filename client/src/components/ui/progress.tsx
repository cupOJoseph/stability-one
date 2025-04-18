import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  className?: string;
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ value, max = 100, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        className={cn("h-2 bg-gray-200 rounded-full overflow-hidden", className)}
        {...props}
      >
        <div
          className="h-full rounded-full"
          style={{ width: `${Math.min(Math.max(value, 0), max)}%` }}
        />
      </div>
    );
  }
);

Progress.displayName = "Progress";
