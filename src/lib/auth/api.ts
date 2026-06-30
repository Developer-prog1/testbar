import { NextResponse } from "next/server";
import { getCurrentUser, type SessionUser } from "@/lib/auth/current-user";

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
  ) {
    super(code);
  }
}

export const errorResponse = (error: unknown): NextResponse => {
  if (error instanceof ApiError) {
    return NextResponse.json({ error: error.code }, { status: error.status });
  }
  console.error(error);
  return NextResponse.json({ error: "internal_error" }, { status: 500 });
};

export async function requireSession(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) throw new ApiError(401, "unauthenticated");
  return user;
}

export async function requireOwnerShop(): Promise<{
  user: SessionUser;
  shopId: string;
}> {
  const user = await requireSession();
  if (user.role !== "owner" || !user.shop) {
    throw new ApiError(403, "forbidden");
  }
  return { user, shopId: user.shop.id };
}

export async function requireBarber(): Promise<{
  user: SessionUser;
  barberId: string;
}> {
  const user = await requireSession();
  if (user.role !== "barber" || !user.barber) {
    throw new ApiError(403, "forbidden");
  }
  return { user, barberId: user.barber.id };
}

export async function readJson<T>(request: Request): Promise<T> {
  try {
    return (await request.json()) as T;
  } catch {
    throw new ApiError(400, "invalid_json");
  }
}
