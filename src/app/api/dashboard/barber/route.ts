import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  ApiError,
  errorResponse,
  readJson,
  requireBarber,
} from "@/lib/auth/api";
import { barberProfileSchema } from "@/lib/validation";

export async function PATCH(request: Request): Promise<NextResponse> {
  try {
    const { barberId } = await requireBarber();
    const parsed = barberProfileSchema.safeParse(await readJson(request));
    if (!parsed.success) throw new ApiError(422, "validation_failed");

    await prisma.barber.update({ where: { id: barberId }, data: parsed.data });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
