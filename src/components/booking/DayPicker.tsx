import { cn } from "@/lib/cn";
import type { DayOption } from "@/lib/datetime";

interface DayPickerProps {
  readonly days: readonly DayOption[];
  readonly selected: string;
  readonly onSelect: (date: string) => void;
}

export function DayPicker({ days, selected, onSelect }: DayPickerProps) {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
      {days.map((day) => {
        const active = day.date === selected;
        return (
          <button
            key={day.date}
            type="button"
            onClick={() => onSelect(day.date)}
            className={cn(
              "flex min-w-16 flex-col items-center rounded-xl border px-3 py-2 text-center transition-colors",
              active
                ? "border-gold bg-gold/10 text-gold"
                : "border-line text-muted hover:border-gold/50",
            )}
          >
            <span className="text-xs uppercase">{day.weekday}</span>
            <span className="text-sm font-medium">{day.dayMonth}</span>
          </button>
        );
      })}
    </div>
  );
}
