import type { Booking } from "@prisma/client";
import { prisma } from "@/lib/db";
import { SERVICE_DURATION_MINUTES } from "@/lib/constants";
import { isRangeFree } from "@/lib/data/availability";
import type { ServiceType } from "@/lib/types";

export interface CreateBookingInput {
  readonly barberId: string;
  readonly startsAt: string;
  readonly services: readonly ServiceType[];
  readonly clientFirstName: string;
  readonly clientLastName: string;
  readonly clientPhone: string;
  readonly createdByBarber?: boolean;
}

export type BookingResult =
  | { readonly ok: true; readonly booking: Booking }
  | { readonly ok: false; readonly reason: "not_found" | "slot_taken" };

const totalDuration = async (
  barberId: string,
  services: readonly ServiceType[],
): Promise<number> => {
  const rows = await prisma.serviceDuration.findMany({
    where: { barberId, service: { in: [...services] } },
  });
  const map = new Map(rows.map((row) => [row.service, row.minutes]));
  return services.reduce(
    (sum, service) => sum + (map.get(service) ?? SERVICE_DURATION_MINUTES[service]),
    0,
  );
};

export async function createBooking(
  input: CreateBookingInput,
): Promise<BookingResult> {
  const barber = await prisma.barber.findUnique({ where: { id: input.barberId } });
  if (!barber) return { ok: false, reason: "not_found" };

  const durationMinutes = await totalDuration(input.barberId, input.services);
  if (!(await isRangeFree(input.barberId, input.startsAt, durationMinutes))) {
    return { ok: false, reason: "slot_taken" };
  }

  const booking = await prisma.booking.create({
    data: {
      barberId: input.barberId,
      services: input.services as ServiceType[],
      startsAt: new Date(input.startsAt),
      durationMinutes,
      clientName: `${input.clientFirstName} ${input.clientLastName}`.trim(),
      clientPhone: input.clientPhone,
      status: input.createdByBarber ? "accepted" : "pending",
      createdByBarber: Boolean(input.createdByBarber),
    },
  });

  return { ok: true, booking };
}
