import { NextResponse } from "next/server";
import { getShopWithBarbers } from "@/lib/data/queries";

interface RouteContext {
  readonly params: Promise<{ readonly id: string }>;
}

export async function GET(
  _request: Request,
  context: RouteContext,
): Promise<NextResponse> {
  const { id } = await context.params;
  const shop = await getShopWithBarbers(id);

  if (!shop) {
    return NextResponse.json({ error: "Shop not found" }, { status: 404 });
  }

  return NextResponse.json({ shop });
}
