import { SLOT_DURATION_MINUTES } from "@/lib/constants";
import type { TimeSlot } from "@/lib/types";

const MS_PER_MINUTE = 60_000;

export const buildSlotId = (barberId: string, startsAt: string): string =>
  `${barberId}__${startsAt}`;

export interface BookingInterval {
  readonly startMs: number;
  readonly endMs: number;
}

export const parseDayStart = (date: string): Date => {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year ?? 0, (month ?? 1) - 1, day ?? 1, 0, 0, 0, 0);
};

const overlaps = (
  startMs: number,
  endMs: number,
  intervals: readonly BookingInterval[],
): boolean =>
  intervals.some((slot) => startMs < slot.endMs && endMs > slot.startMs);

/** Base 30-min slots within working hours, flagged by bookings and time blocks. */
export const buildDaySlots = (
  barberId: string,
  date: string,
  startMinute: number,
  endMinute: number,
  bookingIntervals: readonly BookingInterval[],
  blockIntervals: readonly BookingInterval[] = [],
): readonly TimeSlot[] => {
  const dayStart = parseDayStart(date);
  const slots: TimeSlot[] = [];

  for (
    let minute = startMinute;
    minute + SLOT_DURATION_MINUTES <= endMinute;
    minute += SLOT_DURATION_MINUTES
  ) {
    const start = new Date(dayStart);
    start.setMinutes(minute);
    const iso = start.toISOString();
    const startMs = start.getTime();
    const endMs = startMs + SLOT_DURATION_MINUTES * MS_PER_MINUTE;
    const status = overlaps(startMs, endMs, bookingIntervals)
      ? "booked"
      : overlaps(startMs, endMs, blockIntervals)
        ? "blocked"
        : "available";
    slots.push({ id: buildSlotId(barberId, iso), barberId, startsAt: iso, status });
  }

  return slots;
};
