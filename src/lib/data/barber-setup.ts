import { Prisma, type ServiceType } from "@prisma/client";
import { ALL_SERVICES, SERVICE_DURATION_MINUTES } from "@/lib/constants";

const WORK_START_MINUTE = 10 * 60;
const WORK_END_MINUTE = 20 * 60;
const DEFAULT_WORK_DAYS = [1, 2, 3, 4, 5, 6] as const;

export const defaultServiceDurations = (): Prisma.ServiceDurationCreateWithoutBarberInput[] =>
  ALL_SERVICES.map((service) => ({
    service: service as ServiceType,
    minutes: SERVICE_DURATION_MINUTES[service],
  }));

export const defaultWorkingHours = (): Prisma.WorkingHoursCreateWithoutBarberInput[] =>
  DEFAULT_WORK_DAYS.map((dayOfWeek) => ({
    dayOfWeek,
    startMinute: WORK_START_MINUTE,
    endMinute: WORK_END_MINUTE,
    enabled: true,
  }));
