import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  ApiError,
  errorResponse,
  readJson,
  requireBarber,
} from "@/lib/auth/api";
import { serviceDurationsSchema } from "@/lib/validation";

export async function PATCH(request: Request): Promise<NextResponse> {
  try {
    const { barberId } = await requireBarber();
    const parsed = serviceDurationsSchema.safeParse(await readJson(request));
    if (!parsed.success) throw new ApiError(422, "validation_failed");

    await prisma.$transaction(
      parsed.data.map((item) =>
        prisma.serviceDuration.upsert({
          where: { barberId_service: { barberId, service: item.service } },
          update: { minutes: item.minutes },
          create: { barberId, service: item.service, minutes: item.minutes },
        }),
      ),
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
