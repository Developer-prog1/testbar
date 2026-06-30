import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  ApiError,
  errorResponse,
  readJson,
  requireBarber,
} from "@/lib/auth/api";
import { workingHoursSchema } from "@/lib/validation";

export async function PATCH(request: Request): Promise<NextResponse> {
  try {
    const { barberId } = await requireBarber();
    const parsed = workingHoursSchema.safeParse(await readJson(request));
    if (!parsed.success) throw new ApiError(422, "validation_failed");

    await prisma.$transaction(
      parsed.data.map((day) =>
        prisma.workingHours.upsert({
          where: {
            barberId_dayOfWeek: { barberId, dayOfWeek: day.dayOfWeek },
          },
          update: {
            startMinute: day.startMinute,
            endMinute: day.endMinute,
            enabled: day.enabled && day.startMinute < day.endMinute,
          },
          create: {
            barberId,
            dayOfWeek: day.dayOfWeek,
            startMinute: day.startMinute,
            endMinute: day.endMinute,
            enabled: day.enabled && day.startMinute < day.endMinute,
          },
        }),
      ),
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
