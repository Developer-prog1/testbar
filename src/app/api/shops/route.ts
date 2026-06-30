import { NextResponse } from "next/server";
import { asServiceType, listShops } from "@/lib/data/queries";

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const shops = await listShops({
    district: searchParams.get("district") ?? undefined,
    service: asServiceType(searchParams.get("service") ?? undefined),
    search: searchParams.get("search") ?? undefined,
  });

  return NextResponse.json({ shops });
}
