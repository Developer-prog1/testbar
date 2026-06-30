import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  ApiError,
  errorResponse,
  readJson,
  requireSession,
} from "@/lib/auth/api";
import { clearSession } from "@/lib/auth/current-user";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { changePasswordSchema } from "@/lib/validation";

export async function PATCH(request: Request): Promise<NextResponse> {
  try {
    const user = await requireSession();
    const parsed = changePasswordSchema.safeParse(await readJson(request));
    if (!parsed.success) throw new ApiError(422, "validation_failed");

    const valid = await verifyPassword(
      user.passwordHash,
      parsed.data.currentPassword,
    );
    if (!valid) throw new ApiError(401, "invalid_current_password");

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: await hashPassword(parsed.data.newPassword) },
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(): Promise<NextResponse> {
  try {
    const user = await requireSession();
    await prisma.user.delete({ where: { id: user.id } });
    await clearSession();
    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
