import { cn } from "@/lib/cn";
import { formatSlotTime } from "@/lib/datetime";
import type { TimeSlot } from "@/lib/types";

interface SlotGridProps {
  readonly slots: readonly TimeSlot[];
  readonly selectedSlotId: string | null;
  readonly loading: boolean;
  readonly onSelect: (slot: TimeSlot) => void;
}

export function SlotGrid({ slots, selectedSlotId, loading, onSelect }: SlotGridProps) {
  if (loading) {
    return <p className="py-6 text-center text-sm text-muted">Բեռնվում է...</p>;
  }

  const available = slots.filter((slot) => slot.status === "available");
  if (available.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted">
        Այս օրը ազատ ժամ չկա: Ընտրիր այլ օր:
      </p>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
      {available.map((slot) => {
        const active = slot.id === selectedSlotId;
        return (
          <button
            key={slot.id}
            type="button"
            onClick={() => onSelect(slot)}
            className={cn(
              "rounded-lg border py-2 text-sm transition-colors",
              active
                ? "border-gold bg-gold text-ink"
                : "border-line text-cream hover:border-gold/60",
            )}
          >
            {formatSlotTime(slot.startsAt)}
          </button>
        );
      })}
    </div>
  );
}
