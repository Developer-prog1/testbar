import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/auth/password";
import { setSession } from "@/lib/auth/current-user";
import { loginSchema } from "@/lib/validation";

export async function POST(request: Request): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 422 });
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });
  if (!user || !(await verifyPassword(user.passwordHash, parsed.data.password))) {
    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
  }

  await setSession({ userId: user.id, role: user.role });
  return NextResponse.json({ ok: true, role: user.role });
}
