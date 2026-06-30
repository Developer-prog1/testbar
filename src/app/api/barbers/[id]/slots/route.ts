import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSlots } from "@/lib/data/availability";

interface RouteContext {
  readonly params: Promise<{ readonly id: string }>;
}

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export async function GET(
  request: Request,
  context: RouteContext,
): Promise<NextResponse> {
  const { id } = await context.params;
  const barber = await prisma.barber.findUnique({ where: { id } });
  if (!barber) {
    return NextResponse.json({ error: "Barber not found" }, { status: 404 });
  }

  const date = new URL(request.url).searchParams.get("date") ?? "";
  if (!DATE_PATTERN.test(date)) {
    return NextResponse.json(
      { error: "Invalid date (expected YYYY-MM-DD)" },
      { status: 400 },
    );
  }

  const slots = await getSlots(id, date);
  return NextResponse.json({ slots });
}
