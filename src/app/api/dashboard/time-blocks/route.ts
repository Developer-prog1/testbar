import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  ApiError,
  errorResponse,
  readJson,
  requireBarber,
} from "@/lib/auth/api";
import { timeBlockSchema } from "@/lib/validation";

const MS_PER_MINUTE = 60_000;
const ACTIVE_STATUSES = ["pending", "accepted"] as const;

const durationFromRange = (startsAt: Date, endsAt: Date): number =>
  Math.round((endsAt.getTime() - startsAt.getTime()) / MS_PER_MINUTE);

const hasActiveBookingOverlap = async (
  barberId: string,
  startsAt: Date,
  durationMinutes: number,
): Promise<boolean> => {
  const startMs = startsAt.getTime();
  const endMs = startMs + durationMinutes * MS_PER_MINUTE;
  const bookings = await prisma.booking.findMany({
    where: {
      barberId,
      status: { in: [...ACTIVE_STATUSES] },
      startsAt: { lt: new Date(endMs) },
    },
    select: { startsAt: true, durationMinutes: true },
  });
  return bookings.some((booking) => {
    const bookingStart = booking.startsAt.getTime();
    const bookingEnd = bookingStart + booking.durationMinutes * MS_PER_MINUTE;
    return startMs < bookingEnd && endMs > bookingStart;
  });
};

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { barberId } = await requireBarber();
    const parsed = timeBlockSchema.safeParse(await readJson(request));
    if (!parsed.success) throw new ApiError(422, "validation_failed");

    const startsAt = new Date(parsed.data.startsAt);
    const endsAt = new Date(parsed.data.endsAt);
    const durationMinutes = durationFromRange(startsAt, endsAt);

    if (await hasActiveBookingOverlap(barberId, startsAt, durationMinutes)) {
      throw new ApiError(409, "booking_conflict");
    }

    const block = await prisma.timeBlock.create({
      data: {
        barberId,
        startsAt,
        durationMinutes,
        note: parsed.data.note ?? "",
      },
    });

    return NextResponse.json({ block }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
