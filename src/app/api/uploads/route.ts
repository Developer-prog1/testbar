import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { ApiError, errorResponse, requireSession } from "@/lib/auth/api";

const MAX_BYTES = 4 * 1024 * 1024; // 4 MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(request: Request): Promise<NextResponse> {
  try {
    await requireSession();
    const form = await request.formData();
    const file = form.get("file");

    if (!(file instanceof File)) throw new ApiError(400, "no_file");
    if (!ALLOWED.includes(file.type)) throw new ApiError(415, "unsupported_type");
    if (file.size > MAX_BYTES) throw new ApiError(413, "file_too_large");

    const buffer = Buffer.from(await file.arrayBuffer());
    const image = await prisma.image.create({
      data: { data: buffer, mimeType: file.type },
    });

    return NextResponse.json({ id: image.id }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
