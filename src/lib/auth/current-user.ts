import { cookies } from "next/headers";
import type { Barber, BarberShop, Role, User } from "@prisma/client";
import { prisma } from "@/lib/db";
import {
  SESSION_COOKIE_NAME,
  createSessionToken,
  sessionCookieOptions,
  verifySessionToken,
  type SessionPayload,
} from "@/lib/auth/session";

export type SessionUser = User & {
  shop: BarberShop | null;
  barber: Barber | null;
};

export async function setSession(payload: SessionPayload): Promise<void> {
  const token = await createSessionToken(payload);
  const store = await cookies();
  store.set(SESSION_COOKIE_NAME, token, sessionCookieOptions);
}

export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE_NAME);
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const session = await verifySessionToken(token);
  if (!session) return null;

  return prisma.user.findUnique({
    where: { id: session.userId },
    include: { shop: true, barber: true },
  });
}

export async function requireUser(role?: Role): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHENTICATED");
  if (role && user.role !== role) throw new Error("FORBIDDEN");
  return user;
}
