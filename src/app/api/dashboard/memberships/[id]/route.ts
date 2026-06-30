import { NextResponse } from "next/server";
import { errorResponse, requireSession } from "@/lib/auth/api";
import { confirmMembership, removeMembership } from "@/lib/data/memberships";

interface RouteContext {
  readonly params: Promise<{ readonly id: string }>;
}

export async function PATCH(
  _request: Request,
  context: RouteContext,
): Promise<NextResponse> {
  try {
    const user = await requireSession();
    const { id } = await context.params;
    await confirmMembership(id, user);
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
    const user = await requireSession();
    const { id } = await context.params;
    await removeMembership(id, user);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
