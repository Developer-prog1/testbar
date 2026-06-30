"use client";

import { ALL_SERVICES, SERVICE_LABELS } from "@/lib/constants";
import { cn } from "@/lib/cn";
import type { ServiceType } from "@/lib/types";

interface ServiceChipsProps {
  readonly selected: readonly ServiceType[];
  readonly onToggle: (service: ServiceType) => void;
}

export function ServiceChips({ selected, onToggle }: ServiceChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {ALL_SERVICES.map((service) => {
        const active = selected.includes(service);
        return (
          <button
            key={service}
            type="button"
            onClick={() => onToggle(service)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm transition-colors",
              active
                ? "border-gold bg-gold text-ink"
                : "border-line text-muted hover:text-cream",
            )}
          >
            {SERVICE_LABELS[service]}
          </button>
        );
      })}
    </div>
  );
}
