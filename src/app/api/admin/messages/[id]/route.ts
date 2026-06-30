import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { errorResponse, requireAdmin } from "@/lib/auth/api";

interface RouteContext {
  readonly params: Promise<{ readonly id: string }>;
}

export async function DELETE(
  _request: Request,
  context: RouteContext,
): Promise<NextResponse> {
  try {
    await requireAdmin();
    const { id } = await context.params;
    await prisma.contactMessage.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
