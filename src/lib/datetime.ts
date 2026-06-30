import { BOOKING_DAYS_AHEAD } from "@/lib/constants";

const LOCALE = "hy-AM";

export interface DayOption {
  readonly date: string;
  readonly weekday: string;
  readonly dayMonth: string;
}

const toDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/** Upcoming selectable days for the booking picker (today included). */
export const getUpcomingDays = (): readonly DayOption[] => {
  const today = new Date();
  return Array.from({ length: BOOKING_DAYS_AHEAD }, (_, offset) => {
    const date = new Date(today);
    date.setDate(today.getDate() + offset);
    return {
      date: toDateKey(date),
      weekday: date.toLocaleDateString(LOCALE, { weekday: "short" }),
      dayMonth: date.toLocaleDateString(LOCALE, {
        day: "numeric",
        month: "short",
      }),
    };
  });
};

export const formatSlotTime = (iso: string): string =>
  new Date(iso).toLocaleTimeString(LOCALE, {
    hour: "2-digit",
    minute: "2-digit",
  });

export const formatDateTime = (iso: string): string =>
  new Date(iso).toLocaleString(LOCALE, {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });

export const formatDateTimeFull = (iso: string): string =>
  new Date(iso).toLocaleString(LOCALE, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
