import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  ApiError,
  errorResponse,
  readJson,
  requireOwnerShop,
  requireSession,
} from "@/lib/auth/api";
import { shopCreateSchema, shopUpdateSchema } from "@/lib/validation";
import { slugify } from "@/lib/slug";

export async function PATCH(request: Request): Promise<NextResponse> {
  try {
    const { shopId } = await requireOwnerShop();
    const parsed = shopUpdateSchema.safeParse(await readJson(request));
    if (!parsed.success) throw new ApiError(422, "validation_failed");

    await prisma.barberShop.update({ where: { id: shopId }, data: parsed.data });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const user = await requireSession();
    if (user.role !== "owner") throw new ApiError(403, "forbidden");
    if (user.shop) throw new ApiError(409, "shop_exists");

    const parsed = shopCreateSchema.safeParse(await readJson(request));
    if (!parsed.success) throw new ApiError(422, "validation_failed");

    await prisma.barberShop.create({
      data: {
        ownerId: user.id,
        name: parsed.data.name,
        slug: slugify(parsed.data.name),
      },
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(): Promise<NextResponse> {
  try {
    const { shopId } = await requireOwnerShop();
    await prisma.barberShop.delete({ where: { id: shopId } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
