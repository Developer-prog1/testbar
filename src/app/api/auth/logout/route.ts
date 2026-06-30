import { NextResponse } from "next/server";
import { clearSession } from "@/lib/auth/current-user";

export async function POST(): Promise<NextResponse> {
  await clearSession();
  return NextResponse.json({ ok: true });
}
