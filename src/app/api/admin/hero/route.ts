import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  ApiError,
  errorResponse,
  readJson,
  requireAdmin,
} from "@/lib/auth/api";
import { heroSlideSchema } from "@/lib/validation";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    await requireAdmin();
    const parsed = heroSlideSchema.safeParse(await readJson(request));
    if (!parsed.success) throw new ApiError(422, "validation_failed");

    const last = await prisma.heroSlide.findFirst({
      orderBy: { sortOrder: "desc" },
      select: { sortOrder: true },
    });

    const slide = await prisma.heroSlide.create({
      data: {
        imageId: parsed.data.imageId ?? null,
        imageUrl: parsed.data.imageUrl ?? null,
        sortOrder: (last?.sortOrder ?? -1) + 1,
      },
    });
    return NextResponse.json({ id: slide.id }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
