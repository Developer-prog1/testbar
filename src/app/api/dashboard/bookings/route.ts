import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  ApiError,
  errorResponse,
  readJson,
  requireBarber,
} from "@/lib/auth/api";
import { isRangeFree } from "@/lib/data/availability";
import { selfBookingSchema } from "@/lib/validation";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { barberId } = await requireBarber();
    const parsed = selfBookingSchema.safeParse(await readJson(request));
    if (!parsed.success) throw new ApiError(422, "validation_failed");

    const { startsAt, durationMinutes, clientName, clientPhone } = parsed.data;
    if (!(await isRangeFree(barberId, startsAt, durationMinutes))) {
      throw new ApiError(409, "slot_taken");
    }

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
