import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  ApiError,
  errorResponse,
  readJson,
  requireBarber,
} from "@/lib/auth/api";
import { certificateSchema } from "@/lib/validation";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { barberId } = await requireBarber();
    const parsed = certificateSchema.safeParse(await readJson(request));
    if (!parsed.success) throw new ApiError(422, "validation_failed");

    const certificate = await prisma.certificate.create({
      data: {
        barberId,
        title: parsed.data.title,
        issuer: parsed.data.issuer ?? "",
        year: parsed.data.year,
        imageId: parsed.data.imageId ?? null,
      },
    });
    return NextResponse.json({ certificate }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
