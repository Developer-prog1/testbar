import { prisma } from "@/lib/db";
import {
  buildDaySlots,
  parseDayStart,
  type BookingInterval,
} from "@/lib/data/slots";
import type { TimeSlot } from "@/lib/types";

const MS_PER_MINUTE = 60_000;
const ACTIVE_STATUSES = ["pending", "accepted"] as const;

interface RangeCheckOptions {
  readonly requireWorkingHours?: boolean;
}

const dayBounds = (date: string): { start: Date; end: Date } => {
  const start = parseDayStart(date);
  const end = new Date(start);
  end.setDate(start.getDate() + 1);
  return { start, end };
};

const toIntervals = (
  rows: readonly { startsAt: Date; durationMinutes: number }[],
): BookingInterval[] =>
  rows.map((row) => ({
    startMs: row.startsAt.getTime(),
    endMs: row.startsAt.getTime() + row.durationMinutes * MS_PER_MINUTE,
  }));

const overlapsAny = (
  startMs: number,
  endMs: number,
  intervals: readonly BookingInterval[],
): boolean =>
  intervals.some((slot) => startMs < slot.endMs && endMs > slot.startMs);

const fetchBookingIntervals = async (
  barberId: string,
  start: Date,
  end: Date,
): Promise<BookingInterval[]> => {
  const bookings = await prisma.booking.findMany({
    where: {
      barberId,
      status: { in: [...ACTIVE_STATUSES] },
      startsAt: { gte: start, lt: end },
    },
    select: { startsAt: true, durationMinutes: true },
  });
  return toIntervals(bookings);
};

const fetchBlockIntervals = async (
  barberId: string,
  start: Date,
  end: Date,
): Promise<BookingInterval[]> => {
  const blocks = await prisma.timeBlock.findMany({
    where: {
      barberId,
      startsAt: { lt: end },
    },
    select: { startsAt: true, durationMinutes: true },
  });
  const startMs = start.getTime();
  const endMs = end.getTime();
  return toIntervals(blocks).filter(
    (block) => block.startMs < endMs && block.endMs > startMs,
  );
};

const fetchOverlapIntervals = async (
  barberId: string,
  startMs: number,
  endMs: number,
): Promise<readonly BookingInterval[]> => {
  const [bookings, blocks] = await Promise.all([
    prisma.booking.findMany({
      where: {
        barberId,
        status: { in: [...ACTIVE_STATUSES] },
        startsAt: { lt: new Date(endMs) },
      },
      select: { startsAt: true, durationMinutes: true },
    }),
    prisma.timeBlock.findMany({
      where: {
        barberId,
        startsAt: { lt: new Date(endMs) },
      },
      select: { startsAt: true, durationMinutes: true },
    }),
  ]);

  return [...toIntervals(bookings), ...toIntervals(blocks)].filter(
    (interval) => interval.startMs < endMs && interval.endMs > startMs,
  );
};

const isWithinWorkingHours = async (
  barberId: string,
  start: Date,
  durationMinutes: number,
): Promise<boolean> => {
  const weekday = start.getDay();
  const hours = await prisma.workingHours.findUnique({
    where: { barberId_dayOfWeek: { barberId, dayOfWeek: weekday } },
  });
  if (!hours?.enabled) return false;

  const startMinute = start.getHours() * 60 + start.getMinutes();
  return (
    startMinute >= hours.startMinute &&
    startMinute + durationMinutes <= hours.endMinute
  );
};

export async function getSlots(
  barberId: string,
  date: string,
): Promise<readonly TimeSlot[]> {
  const weekday = parseDayStart(date).getDay();
  const hours = await prisma.workingHours.findUnique({
    where: { barberId_dayOfWeek: { barberId, dayOfWeek: weekday } },
  });
  if (!hours?.enabled) return [];

  const { start, end } = dayBounds(date);
  const [bookings, blocks] = await Promise.all([
    fetchBookingIntervals(barberId, start, end),
    fetchBlockIntervals(barberId, start, end),
  ]);
  return buildDaySlots(
    barberId,
    date,
    hours.startMinute,
    hours.endMinute,
    bookings,
    blocks,
  );
}

/** Whether [startsAt, startsAt+duration) fits working hours and is free. */
export async function isRangeFree(
  barberId: string,
  startsAtIso: string,
  durationMinutes: number,
  options: RangeCheckOptions = {},
): Promise<boolean> {
  const requireWorkingHours = options.requireWorkingHours ?? true;
  const start = new Date(startsAtIso);
  const startMs = start.getTime();
  const endMs = startMs + durationMinutes * MS_PER_MINUTE;

  if (requireWorkingHours && !(await isWithinWorkingHours(barberId, start, durationMinutes))) {
    return false;
  }

  const overlaps = await fetchOverlapIntervals(barberId, startMs, endMs);
  return !overlapsAny(startMs, endMs, overlaps);
}

/** Reason code when `isRangeFree` returns false. */
export async function getRangeConflictReason(
  barberId: string,
  startsAtIso: string,
  durationMinutes: number,
  options: RangeCheckOptions = {},
): Promise<"slot_taken" | "outside_hours" | null> {
  const requireWorkingHours = options.requireWorkingHours ?? true;
  const start = new Date(startsAtIso);
  const startMs = start.getTime();
  const endMs = startMs + durationMinutes * MS_PER_MINUTE;

  if (requireWorkingHours && !(await isWithinWorkingHours(barberId, start, durationMinutes))) {
    return "outside_hours";
  }

  const overlaps = await fetchOverlapIntervals(barberId, startMs, endMs);
  return overlapsAny(startMs, endMs, overlaps) ? "slot_taken" : null;
}
