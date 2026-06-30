"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";

const DURATION_OPTIONS = [30, 60, 90, 120] as const;

export function SelfBookingForm() {
  const router = useRouter();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState<number>(60);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    const startsAt = new Date(`${date}T${time}`);
    if (Number.isNaN(startsAt.getTime())) {
      setError("Ընտրիր օր և ժամ:");
      return;
    }

    const res = await fetch("/api/dashboard/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        startsAt: startsAt.toISOString(),
        durationMinutes: duration,
        clientName,
        clientPhone,
      }),
    });

    if (res.status === 409) return setError("Այդ ժամը զբաղված է կամ գրաֆիկից դուրս:");
    if (!res.ok) return setError("Ստուգիր դաշտերը (հեռ.՝ +374XXXXXXXX):");

    setDate("");
    setTime("");
    setClientName("");
    setClientPhone("");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          id="booking-date"
          label="Օր"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <TextField
          id="booking-time"
          label="Ժամ"
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </div>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-cream">Տևողություն</span>
        <select
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="rounded-xl border border-line bg-ink-soft px-3 py-2 text-cream outline-none focus:border-gold"
        >
          {DURATION_OPTIONS.map((value) => (
            <option key={value} value={value}>
              {value} րոպե
            </option>
          ))}
        </select>
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          id="booking-client"
          label="Հաճախորդ"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
        />
        <TextField
          id="booking-phone"
          label="Հեռախոս"
          value={clientPhone}
          onChange={(e) => setClientPhone(e.target.value)}
          placeholder="+374XXXXXXXX"
        />
      </div>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      <Button type="submit">Ավելացնել ամրագրում</Button>
    </form>
  );
}
