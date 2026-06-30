import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth/password";
import { setSession } from "@/lib/auth/current-user";
import { registerSchema } from "@/lib/validation";
import { slugify } from "@/lib/slug";
import {
  defaultServiceDurations,
  defaultWorkingHours,
} from "@/lib/data/barber-setup";

export async function POST(request: Request): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const data = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    return NextResponse.json({ error: "email_taken" }, { status: 409 });
  }

  const passwordHash = await hashPassword(data.password);
  const user = await prisma.user.create({
    data: { email: data.email, passwordHash, role: data.role },
  });

  if (data.role === "owner") {
    await prisma.barberShop.create({
      data: { ownerId: user.id, name: data.shopName, slug: slugify(data.shopName) },
    });
  } else {
    await prisma.barber.create({
      data: {
        userId: user.id,
        firstName: data.firstName,
        lastName: data.lastName,
        serviceDurations: { create: defaultServiceDurations() },
        workingHours: { create: defaultWorkingHours() },
      },
    });
  }

  await setSession({ userId: user.id, role: user.role });
  return NextResponse.json({ ok: true, role: user.role }, { status: 201 });
}
