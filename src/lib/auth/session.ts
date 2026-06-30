import { SignJWT, jwtVerify } from "jose";
import type { Role } from "@prisma/client";

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

export const SESSION_COOKIE_NAME =
  process.env.SESSION_COOKIE_NAME ?? "bsa_session";

export interface SessionPayload {
  readonly userId: string;
  readonly role: Role;
}

const getSecret = (): Uint8Array => {
  const secret = process.env.AUTH_SESSION_SECRET;
  if (!secret) throw new Error("AUTH_SESSION_SECRET is not set");
  return new TextEncoder().encode(secret);
};

export const createSessionToken = (payload: SessionPayload): Promise<string> =>
  new SignJWT({ userId: payload.userId, role: payload.role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(getSecret());

export async function verifySessionToken(
  token: string,
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    const userId = payload.userId;
    const role = payload.role;
    if (typeof userId !== "string" || (role !== "owner" && role !== "barber")) {
      return null;
    }
    return { userId, role };
  } catch {
    return null;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_MAX_AGE_SECONDS,
};
