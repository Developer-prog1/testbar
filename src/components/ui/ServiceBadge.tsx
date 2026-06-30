import { SERVICE_LABELS } from "@/lib/constants";
import type { ServiceType } from "@/lib/types";

interface ServiceBadgeProps {
  readonly service: ServiceType;
}

export function ServiceBadge({ service }: ServiceBadgeProps) {
  return (
    <span className="rounded-full border border-line bg-ink px-2.5 py-1 text-xs text-muted">
      {SERVICE_LABELS[service]}
    </span>
  );
}
