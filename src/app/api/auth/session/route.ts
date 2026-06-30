import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { sessionDisplayName } from "@/lib/auth/session-info";

export async function GET(): Promise<NextResponse> {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  return NextResponse.json({
    email: user.email,
    displayName: sessionDisplayName(user),
    role: user.role,
  });
}
