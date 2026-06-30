"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { type BookingDto } from "@/lib/dashboard/bookings";
import { useDashboardAction } from "@/hooks/use-dashboard-action";
import type { ServiceType } from "@/lib/types";

const DURATION_OPTIONS = [30, 60, 90, 120] as const;
const SUBMIT_KEY = "self-booking";

interface SelfBookingFormProps {
  readonly onCreated?: (booking: BookingDto) => void;
}

interface CreatedBookingResponse {
  readonly booking: {
    readonly id: string;
    readonly startsAt: string;
    readonly durationMinutes: number;
    readonly clientName: string;
    readonly clientPhone: string;
    readonly services: ServiceType[];
    readonly status: BookingDto["status"];
    readonly createdByBarber: boolean;
  };
}

export function SelfBookingForm({ onCreated }: SelfBookingFormProps) {
  const { run, isPending } = useDashboardAction();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState<number>(60);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const startsAt = new Date(`${date}T${time}`);
    if (Number.isNaN(startsAt.getTime())) {
      setError("Ընտրիր օր և ժամ:");
      return;
    }

    const payload = {
      startsAt: startsAt.toISOString(),
      durationMinutes: duration,
      clientName,
      clientPhone,
    };

    void run(SUBMIT_KEY, {
      action: async () => {
        const response = await fetch("/api/dashboard/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        return { response, payload };
      },
      isSuccess: ({ response }) => response.ok,
      onSuccess: async ({ response, payload }) => {
        const data = (await response.json()) as CreatedBookingResponse;
        const created: BookingDto = {
          id: data.booking.id,
          startsAt:
            typeof data.booking.startsAt === "string"
              ? data.booking.startsAt
              : payload.startsAt,
          durationMinutes: data.booking.durationMinutes,
          clientName: data.booking.clientName,
          clientPhone: data.booking.clientPhone,
          services: data.booking.services,
          status: data.booking.status,
          createdByBarber: data.booking.createdByBarber,
        };

        onCreated?.(created);
        setDate("");
        setTime("");
        setClientName("");
        setClientPhone("");
      },
      onError: async ({ response }) => {
        if (response.status === 409) {
          const body = (await response.json().catch(() => null)) as {
            error?: string;
          } | null;
          if (body?.error === "slot_taken") {
            setError("Այդ ժամանակահատվածը արդեն զբաղված է:");
            return;
          }
          setError("Այդ ժամը գրաֆիկից դուրս է կամ անհասանելի:");
          return;
        }
        setError("Ստուգիր դաշտերը (հեռ.՝ +374XXXXXXXX):");
      },
    });
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
      <Button
        type="submit"
        loading={isPending(SUBMIT_KEY)}
        loadingLabel="Ավելացվում է..."
      >
        Ավելացնել ամրագրում
      </Button>
    </form>
  );
}
