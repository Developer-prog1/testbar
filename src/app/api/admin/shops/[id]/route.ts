import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  ApiError,
  errorResponse,
  readJson,
  requireAdmin,
} from "@/lib/auth/api";
import { statusUpdateSchema } from "@/lib/validation";

interface RouteContext {
  readonly params: Promise<{ readonly id: string }>;
}

export async function PATCH(
  request: Request,
  context: RouteContext,
): Promise<NextResponse> {
  try {
    await requireAdmin();
    const { id } = await context.params;
    const parsed = statusUpdateSchema.safeParse(await readJson(request));
    if (!parsed.success) throw new ApiError(422, "validation_failed");

    await prisma.barberShop.update({
      where: { id },
      data: { status: parsed.data.status },
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(
  _request: Request,
  context: RouteContext,
): Promise<NextResponse> {
  try {
    await requireAdmin();
    const { id } = await context.params;
    await prisma.barberShop.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
