import { cn } from "@/lib/cn";

interface SkeletonProps {
  readonly className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-lg bg-line/60", className)}
      aria-hidden
    />
  );
}
