import { SERVICE_LABELS } from "@/lib/constants";
import { formatDuration } from "@/lib/services";
import { cn } from "@/lib/cn";
import type { ServiceType } from "@/lib/types";

interface ServiceSelectorProps {
  readonly services: readonly ServiceType[];
  readonly selected: readonly ServiceType[];
  readonly durations: Readonly<Record<ServiceType, number>>;
  readonly onToggle: (service: ServiceType) => void;
}

export function ServiceSelector({
  services,
  selected,
  durations,
  onToggle,
}: ServiceSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {services.map((service) => {
        const active = selected.includes(service);
        return (
          <button
            key={service}
            type="button"
            aria-pressed={active}
            onClick={() => onToggle(service)}
            className={cn(
              "flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors",
              active
                ? "border-gold bg-gold/10 text-gold"
                : "border-line text-cream hover:border-gold/50",
            )}
          >
            <span>{SERVICE_LABELS[service]}</span>
            <span className="text-xs text-muted">
              {formatDuration(durations[service])}
            </span>
          </button>
        );
      })}
    </div>
  );
}
