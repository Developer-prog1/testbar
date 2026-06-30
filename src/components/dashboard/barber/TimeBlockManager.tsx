"use client";

import { useEffect, useState } from "react";
import { DeleteRowButton } from "@/components/admin/DeleteRowButton";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { formatDateTimeFull } from "@/lib/datetime";
import { useDashboardAction } from "@/hooks/use-dashboard-action";

export interface TimeBlockDto {
  readonly id: string;
  readonly startsAt: string;
  readonly durationMinutes: number;
  readonly note: string;
}

const MS_PER_MINUTE = 60_000;
const SUBMIT_KEY = "time-block";

const formatRange = (startsAt: string, durationMinutes: number): string => {
  const start = new Date(startsAt);
  const end = new Date(start.getTime() + durationMinutes * MS_PER_MINUTE);
  const timeFmt = (date: Date) =>
    date.toLocaleTimeString("hy-AM", { hour: "2-digit", minute: "2-digit" });
  return `${formatDateTimeFull(startsAt)} — ${timeFmt(end)}`;
};

export function TimeBlockManager({
  initial,
}: {
  readonly initial: readonly TimeBlockDto[];
}) {
  const { run, isPending } = useDashboardAction();
  const [blocks, setBlocks] = useState(initial);

  useEffect(() => {
    setBlocks(initial);
  }, [initial]);

  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const startsAt = new Date(`${date}T${startTime}`);
    const endsAt = new Date(`${date}T${endTime}`);
    if (Number.isNaN(startsAt.getTime()) || Number.isNaN(endsAt.getTime())) {
      setError("Ընտրիր օր, սկիզբ և ավարտ:");
      return;
    }
    if (endsAt <= startsAt) {
      setError("Ավարտի ժամը պետք է լինի սկզբից հետո:");
      return;
    }

    void run(SUBMIT_KEY, {
      action: async () => {
        const response = await fetch("/api/dashboard/time-blocks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            startsAt: startsAt.toISOString(),
            endsAt: endsAt.toISOString(),
            note: note.trim() || undefined,
          }),
        });
        return response;
      },
      isSuccess: (response) => response.ok,
      onSuccess: async (response) => {
        const data = (await response.json()) as { block: TimeBlockDto };
        setBlocks((prev) =>
          [...prev, data.block].sort(
            (a, b) =>
              new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
          ),
        );
        setDate("");
        setStartTime("");
        setEndTime("");
        setNote("");
      },
      onError: async (response) => {
        if (response.status === 409) {
          setError("Այդ ժամանակահատվածում արդեն կա ամրագրում:");
          return;
        }
        setError("Ստուգիր դաշտերը (նվազագույնը 15 ր, առավելագույնը 12 ժ):");
      },
    });
  };

  const handleRemoved = (id: string) => {
    setBlocks((prev) => prev.filter((block) => block.id !== id));
  };

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <TextField
            id="block-date"
            label="Օր"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <TextField
            id="block-start"
            label="Սկիզբ"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
          <TextField
            id="block-end"
            label="Ավարտ (գալու ժամ)"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>

        <TextField
          id="block-note"
          label="Նշում (ըստ ցանկության)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Օր.՝ ճաշ, գործեր"
        />

        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <Button
          type="submit"
          loading={isPending(SUBMIT_KEY)}
          loadingLabel="Պահպանում..."
        >
          Փակել ժամերը
        </Button>
      </form>

      {blocks.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {blocks.map((block) => (
            <li
              key={block.id}
              className="flex items-start justify-between gap-3 rounded-xl border border-line bg-ink-soft p-3"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm text-cream">
                  {formatRange(block.startsAt, block.durationMinutes)}
                </p>
                {block.note ? (
                  <p className="mt-1 text-xs text-muted">{block.note}</p>
                ) : null}
              </div>
              <DeleteRowButton
                endpoint={`/api/dashboard/time-blocks/${block.id}`}
                label={formatRange(block.startsAt, block.durationMinutes)}
                onChanged={() => handleRemoved(block.id)}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted">Ակտիվ փակումներ չկան:</p>
      )}
    </div>
  );
}
