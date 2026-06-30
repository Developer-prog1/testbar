import { prisma } from "@/lib/db";
import {
  buildDaySlots,
  parseDayStart,
  type BookingInterval,
} from "@/lib/data/slots";
import type { TimeSlot } from "@/lib/types";

const MS_PER_MINUTE = 60_000;
const ACTIVE_STATUSES = ["pending", "accepted"] as const;

const dayBounds = (date: string): { start: Date; end: Date } => {
  const start = parseDayStart(date);
  const end = new Date(start);
  end.setDate(start.getDate() + 1);
  return { start, end };
};

const fetchIntervals = async (
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
  return bookings.map((b) => ({
    startMs: b.startsAt.getTime(),
    endMs: b.startsAt.getTime() + b.durationMinutes * MS_PER_MINUTE,
  }));
};

export async function getSlots(
  barberId: string,
  date: string,
): Promise<readonly TimeSlot[]> {
  const weekday = parseDayStart(date).getDay();
  const hours = await prisma.workingHours.findUnique({
    where: { barberId_dayOfWeek: { barberId, dayOfWeek: weekday } },
  });
  if (!hours || !hours.enabled) return [];

  const { start, end } = dayBounds(date);
  const intervals = await fetchIntervals(barberId, start, end);
  return buildDaySlots(barberId, date, hours.startMinute, hours.endMinute, intervals);
}

/** Whether [startsAt, startsAt+duration) fits working hours and is free. */
export async function isRangeFree(
  barberId: string,
  startsAtIso: string,
  durationMinutes: number,
): Promise<boolean> {
  const start = new Date(startsAtIso);
  const weekday = start.getDay();
  const hours = await prisma.workingHours.findUnique({
    where: { barberId_dayOfWeek: { barberId, dayOfWeek: weekday } },
  });
  if (!hours || !hours.enabled) return false;

  const startMinute = start.getHours() * 60 + start.getMinutes();
  if (startMinute < hours.startMinute) return false;
  if (startMinute + durationMinutes > hours.endMinute) return false;

  const date = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, "0")}-${String(start.getDate()).padStart(2, "0")}`;
  const { start: dayStart, end: dayEnd } = dayBounds(date);
  const intervals = await fetchIntervals(barberId, dayStart, dayEnd);

  const startMs = start.getTime();
  const endMs = startMs + durationMinutes * MS_PER_MINUTE;
  return !intervals.some((slot) => startMs < slot.endMs && endMs > slot.startMs);
}
