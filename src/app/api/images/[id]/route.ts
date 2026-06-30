import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

interface RouteContext {
  readonly params: Promise<{ readonly id: string }>;
}

export async function GET(
  _request: Request,
  context: RouteContext,
): Promise<NextResponse> {
  const { id } = await context.params;
  const image = await prisma.image.findUnique({ where: { id } });

  if (!image) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = new Uint8Array(image.data);
  return new NextResponse(body, {
    headers: {
      "Content-Type": image.mimeType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
