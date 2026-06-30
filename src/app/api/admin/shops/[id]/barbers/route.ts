import { NextResponse } from "next/server";
import { errorResponse, requireAdmin } from "@/lib/auth/api";
import { listAdminBarbersByShop } from "@/lib/data/admin";

interface RouteContext {
  readonly params: Promise<{ readonly id: string }>;
}

export async function GET(
  _request: Request,
  context: RouteContext,
): Promise<NextResponse> {
  try {
    await requireAdmin();
    const { id } = await context.params;
    const barbers = await listAdminBarbersByShop(id);
    return NextResponse.json({ barbers });
  } catch (error) {
    return errorResponse(error);
  }
}
