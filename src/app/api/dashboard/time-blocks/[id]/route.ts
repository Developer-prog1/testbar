import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { ApiError, errorResponse, requireBarber } from "@/lib/auth/api";

type RouteParams = { params: Promise<{ id: string }> };

export async function DELETE(
  _request: Request,
  { params }: RouteParams,
): Promise<NextResponse> {
  try {
    const { barberId } = await requireBarber();
    const { id } = await params;

    const block = await prisma.timeBlock.findFirst({
      where: { id, barberId },
      select: { id: true },
    });
    if (!block) throw new ApiError(404, "not_found");

    await prisma.timeBlock.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
