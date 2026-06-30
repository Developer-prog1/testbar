"use client";

import { useLinkStatus } from "next/link";
import { cn } from "@/lib/cn";

interface PendingIndicatorProps {
  readonly className?: string;
}

export function PendingIndicator({ className }: PendingIndicatorProps) {
  const { pending } = useLinkStatus();
  if (!pending) return null;

  return (
    <span
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-gold/50",
        className,
      )}
      aria-hidden
    />
  );
}
