import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { ApiError, errorResponse, requireBarber } from "@/lib/auth/api";

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
    const cert = await prisma.certificate.findUnique({ where: { id } });
    if (!cert || cert.barberId !== barberId) {
      throw new ApiError(404, "certificate_not_found");
    }
    await prisma.certificate.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
