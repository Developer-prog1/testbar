import { NextResponse } from "next/server";
import { z } from "zod";
import {
  ApiError,
  errorResponse,
  readJson,
  requireSession,
} from "@/lib/auth/api";
import { inviteBarberByEmail, requestJoin } from "@/lib/data/memberships";

const bodySchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("invite"), email: z.string().email() }),
  z.object({ action: z.literal("request"), shopId: z.string().min(1) }),
]);

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const user = await requireSession();
    const parsed = bodySchema.safeParse(await readJson(request));
    if (!parsed.success) throw new ApiError(422, "validation_failed");

    if (parsed.data.action === "invite") {
      if (user.role !== "owner" || !user.shop) throw new ApiError(403, "forbidden");
      await inviteBarberByEmail(user.shop.id, parsed.data.email);
    } else {
      if (user.role !== "barber" || !user.barber) throw new ApiError(403, "forbidden");
      await requestJoin(user.barber.id, parsed.data.shopId);
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
