"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { formatDateTime } from "@/lib/datetime";
import { formatDuration } from "@/lib/services";
import { SERVICE_LABELS } from "@/lib/constants";
import { cn } from "@/lib/cn";
import type { ServiceType } from "@/lib/types";

export interface BookingDto {
  readonly id: string;
  readonly startsAt: string;
  readonly durationMinutes: number;
  readonly clientName: string;
  readonly clientPhone: string;
  readonly services: ServiceType[];
  readonly status: "pending" | "accepted" | "rejected";
  readonly createdByBarber: boolean;
}

const STATUS_LABEL: Record<BookingDto["status"], string> = {
  pending: "Սպասում է",
  accepted: "Հաստատված",
  rejected: "Մերժված",
};

const STATUS_STYLE: Record<BookingDto["status"], string> = {
  pending: "bg-gold/15 text-gold",
  accepted: "bg-green-500/15 text-green-400",
  rejected: "bg-red-500/15 text-red-400",
};

export function BookingsList({ bookings }: { readonly bookings: readonly BookingDto[] }) {
  const router = useRouter();

  const setStatus = async (id: string, status: "accepted" | "rejected") => {
    const res = await fetch(`/api/dashboard/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) router.refresh();
  };

  if (bookings.length === 0) {
    return <p className="text-sm text-muted">Ամրագրումներ դեռ չկան:</p>;
  }

  return (
    <ul className="flex flex-col gap-3">
      {bookings.map((booking) => (
        <li
          key={booking.id}
          className="flex flex-col gap-3 rounded-xl border border-line bg-ink-soft p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-medium text-cream">{booking.clientName}</p>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs",
                  STATUS_STYLE[booking.status],
                )}
              >
                {STATUS_LABEL[booking.status]}
              </span>
            </div>
            <p className="text-sm text-muted">
              {formatDateTime(booking.startsAt)} ·{" "}
              {formatDuration(booking.durationMinutes)}
            </p>
            <p className="text-xs text-muted">
              {booking.clientPhone}
              {booking.services.length > 0
                ? ` · ${booking.services.map((s) => SERVICE_LABELS[s]).join(", ")}`
                : ""}
            </p>
          </div>

          {booking.status === "pending" ? (
            <div className="flex shrink-0 gap-2">
              <Button onClick={() => setStatus(booking.id, "accepted")}>
                Ընդունել
              </Button>
              <Button variant="ghost" onClick={() => setStatus(booking.id, "rejected")}>
                Մերժել
              </Button>
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
