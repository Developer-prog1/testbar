"use client";

import { DeleteRowButton } from "@/components/admin/DeleteRowButton";
import { Button } from "@/components/ui/Button";
import { formatDateTime } from "@/lib/datetime";
import { formatDuration } from "@/lib/services";
import { SERVICE_LABELS } from "@/lib/constants";
import { useDashboardAction } from "@/hooks/use-dashboard-action";
import { sortBookings, type BookingDto } from "@/lib/dashboard/bookings";
import { cn } from "@/lib/cn";

export type { BookingDto } from "@/lib/dashboard/bookings";

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

interface BookingsListProps {
  readonly bookings: readonly BookingDto[];
  readonly onBookingsChange?: (bookings: readonly BookingDto[]) => void;
}

export function BookingsList({ bookings, onBookingsChange }: BookingsListProps) {
  const { run, isPending } = useDashboardAction();

  const setStatus = (id: string, status: "accepted" | "rejected") => {
    const previous = bookings;
    onBookingsChange?.(
      sortBookings(
        bookings.map((booking) =>
          booking.id === id ? { ...booking, status } : booking,
        ),
      ),
    );

    void run(`status-${id}-${status}`, {
      action: async () =>
        fetch(`/api/dashboard/bookings/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }),
      isSuccess: (response) => response.ok,
      onError: () => onBookingsChange?.(previous),
    });
  };

  const removeBooking = (id: string) => {
    onBookingsChange?.(bookings.filter((booking) => booking.id !== id));
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
                ? ` · ${booking.services.map((service) => SERVICE_LABELS[service]).join(", ")}`
                : ""}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {booking.status === "pending" ? (
              <>
                <Button
                  loading={isPending(`status-${booking.id}-accepted`)}
                  loadingLabel="..."
                  onClick={() => setStatus(booking.id, "accepted")}
                >
                  Ընդունել
                </Button>
                <Button
                  variant="ghost"
                  loading={isPending(`status-${booking.id}-rejected`)}
                  loadingLabel="..."
                  onClick={() => setStatus(booking.id, "rejected")}
                >
                  Մերժել
                </Button>
              </>
            ) : null}
            <DeleteRowButton
              endpoint={`/api/dashboard/bookings/${booking.id}`}
              label={booking.clientName}
              onChanged={() => removeBooking(booking.id)}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
