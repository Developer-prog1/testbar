"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { SERVICE_LABELS } from "@/lib/constants";
import { useDashboardAction } from "@/hooks/use-dashboard-action";
import type { ServiceType } from "@/lib/types";

const SAVE_KEY = "service-durations";

export function ServiceDurationsEditor({
  initial,
}: {
  readonly initial: Record<ServiceType, number>;
}) {
  const { run, isPending } = useDashboardAction();
  const [durations, setDurations] = useState(initial);

  const entries = Object.entries(durations) as [ServiceType, number][];

  const save = () => {
    void run(SAVE_KEY, {
      action: async () =>
        fetch("/api/dashboard/service-durations", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            entries.map(([service, minutes]) => ({ service, minutes })),
          ),
        }),
      isSuccess: (response) => response.ok,
    });
  };

  return (
    <div className="flex flex-col gap-3">
      {entries.map(([service, minutes]) => (
        <label
          key={service}
          className="flex items-center justify-between gap-3 rounded-xl border border-line bg-ink-soft p-3 text-sm"
        >
          <span className="text-cream">{SERVICE_LABELS[service]}</span>
          <span className="flex items-center gap-2">
            <input
              type="number"
              min={15}
              max={360}
              step={15}
              value={minutes}
              onChange={(e) =>
                setDurations((prev) => ({
                  ...prev,
                  [service]: Number(e.target.value),
                }))
              }
              className="w-20 rounded-lg border border-line bg-ink px-2 py-1.5 text-right text-cream"
            />
            <span className="text-muted">րոպե</span>
          </span>
        </label>
      ))}
      <div>
        <Button
          onClick={save}
          loading={isPending(SAVE_KEY)}
          loadingLabel="Պահպանում..."
        >
          Պահպանել տևողությունները
        </Button>
      </div>
    </div>
  );
}
