import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import {
  ApiError,
  errorResponse,
  readJson,
  requireBarber,
} from "@/lib/auth/api";

const bodySchema = z.object({
  status: z.enum(["accepted", "rejected"]),
});

interface RouteContext {
  readonly params: Promise<{ readonly id: string }>;
}

export async function DELETE(
  _request: Request,
  context: RouteContext,
): Promise<NextResponse> {
  try {
    const { barberId } = await requireBarber();
    const { id } = await context.params;

    const booking = await prisma.booking.findFirst({
      where: { id, barberId },
      select: { id: true },
    });
    if (!booking) throw new ApiError(404, "booking_not_found");

    await prisma.booking.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(
  request: Request,
  context: RouteContext,
): Promise<NextResponse> {
  try {
    const { barberId } = await requireBarber();
    const { id } = await context.params;
    const parsed = bodySchema.safeParse(await readJson(request));
    if (!parsed.success) throw new ApiError(422, "validation_failed");

    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking || booking.barberId !== barberId) {
      throw new ApiError(404, "booking_not_found");
    }

    await prisma.booking.update({
      where: { id },
      data: { status: parsed.data.status },
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
