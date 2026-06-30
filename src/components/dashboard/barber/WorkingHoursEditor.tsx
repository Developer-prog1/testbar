"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { useDashboardAction } from "@/hooks/use-dashboard-action";

export interface DayHours {
  readonly dayOfWeek: number;
  readonly startMinute: number;
  readonly endMinute: number;
  readonly enabled: boolean;
}

const DAY_LABELS: Record<number, string> = {
  1: "Երկուշաբթի",
  2: "Երեքշաբթի",
  3: "Չորեքշաբթի",
  4: "Հինգշաբթի",
  5: "Ուրբաթ",
  6: "Շաբաթ",
  0: "Կիրակի",
};
const DISPLAY_ORDER = [1, 2, 3, 4, 5, 6, 0];
const SAVE_KEY = "working-hours";

const toTime = (minutes: number): string =>
  `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

const toMinutes = (time: string): number => {
  const [h, m] = time.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
};

export function WorkingHoursEditor({ initial }: { readonly initial: DayHours[] }) {
  const { run, isPending } = useDashboardAction();
  const [days, setDays] = useState(initial);

  useEffect(() => {
    setDays(initial);
  }, [initial]);

  const update = (dayOfWeek: number, patch: Partial<DayHours>) =>
    setDays((prev) =>
      prev.map((day) =>
        day.dayOfWeek === dayOfWeek ? { ...day, ...patch } : day,
      ),
    );

  const save = () => {
    void run(SAVE_KEY, {
      action: async () =>
        fetch("/api/dashboard/working-hours", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(days),
        }),
      isSuccess: (response) => response.ok,
    });
  };

  const byDay = (d: number) => days.find((day) => day.dayOfWeek === d)!;

  return (
    <div className="flex flex-col gap-3">
      {DISPLAY_ORDER.map((dayOfWeek) => {
        const day = byDay(dayOfWeek);
        return (
          <div
            key={dayOfWeek}
            className="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-ink-soft p-3"
          >
            <button
              type="button"
              onClick={() => update(dayOfWeek, { enabled: !day.enabled })}
              className={cn(
                "w-28 rounded-lg px-3 py-1.5 text-left text-sm transition-colors",
                day.enabled ? "bg-gold/15 text-gold" : "text-muted",
              )}
            >
              {DAY_LABELS[dayOfWeek]}
            </button>
            <input
              type="time"
              value={toTime(day.startMinute)}
              disabled={!day.enabled}
              onChange={(e) => update(dayOfWeek, { startMinute: toMinutes(e.target.value) })}
              className="rounded-lg border border-line bg-ink px-2 py-1.5 text-sm text-cream disabled:opacity-40"
            />
            <span className="text-muted">—</span>
            <input
              type="time"
              value={toTime(day.endMinute)}
              disabled={!day.enabled}
              onChange={(e) => update(dayOfWeek, { endMinute: toMinutes(e.target.value) })}
              className="rounded-lg border border-line bg-ink px-2 py-1.5 text-sm text-cream disabled:opacity-40"
            />
          </div>
        );
      })}
      <div>
        <Button
          onClick={save}
          loading={isPending(SAVE_KEY)}
          loadingLabel="Պահպանում..."
        >
          Պահպանել գրաֆիկը
        </Button>
      </div>
    </div>
  );
}
