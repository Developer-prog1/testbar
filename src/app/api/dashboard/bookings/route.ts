import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  ApiError,
  errorResponse,
  readJson,
  requireBarber,
} from "@/lib/auth/api";
import { getRangeConflictReason } from "@/lib/data/availability";
import { selfBookingSchema } from "@/lib/validation";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { barberId } = await requireBarber();
    const parsed = selfBookingSchema.safeParse(await readJson(request));
    if (!parsed.success) throw new ApiError(422, "validation_failed");

    const { startsAt, durationMinutes, clientName, clientPhone } = parsed.data;
    const conflict = await getRangeConflictReason(
      barberId,
      startsAt,
      durationMinutes,
      { requireWorkingHours: false },
    );
    if (conflict) throw new ApiError(409, conflict);

    const booking = await prisma.booking.create({
      data: {
        barberId,
        services: [],
        startsAt: new Date(startsAt),
        durationMinutes,
        clientName,
        clientPhone,
        status: "accepted",
        createdByBarber: true,
      },
    });

    return NextResponse.json({ booking }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
