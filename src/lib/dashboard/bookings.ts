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

const STATUS_ORDER: Record<BookingDto["status"], number> = {
  pending: 0,
  accepted: 1,
  rejected: 2,
};

export function sortBookings(
  bookings: readonly BookingDto[],
): readonly BookingDto[] {
  return [...bookings].sort(
    (a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status],
  );
}
