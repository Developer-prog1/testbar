import { SLOT_DURATION_MINUTES } from "@/lib/constants";
import type { ServiceType, TimeSlot } from "@/lib/types";

type Durations = Readonly<Record<ServiceType, number>>;

export const getTotalDuration = (
  services: readonly ServiceType[],
  durations: Durations,
): number => services.reduce((sum, service) => sum + durations[service], 0);

/** Number of consecutive base slots a set of services occupies. */
export const getRequiredSlotCount = (
  services: readonly ServiceType[],
  durations: Durations,
): number =>
  Math.ceil(getTotalDuration(services, durations) / SLOT_DURATION_MINUTES);

export const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes} ր`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours} ժ` : `${hours} ժ ${rest} ր`;
};

/**
 * Start slots that have enough consecutive free base slots for the duration.
 * Assumes `slots` are contiguous and time-ordered for a single day.
 */
export const getStartableSlots = (
  slots: readonly TimeSlot[],
  requiredCount: number,
): readonly TimeSlot[] => {
  if (requiredCount <= 0) return [];
  return slots.filter((_, index) => {
    const window = slots.slice(index, index + requiredCount);
    return (
      window.length === requiredCount &&
      window.every((slot) => slot.status === "available")
    );
  });
};
