import { NextResponse, type NextRequest } from "next/server";
import type { Role } from "@prisma/client";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";

const homeFor = (role: Role): string => {
  if (role === "admin") return "/admin";
  if (role === "owner") return "/dashboard/shop";
  return "/dashboard/barber";
};

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (!session) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  const home = homeFor(session.role);
  const redirectHome = () => NextResponse.redirect(new URL(home, request.url));

  if (pathname === "/dashboard") return redirectHome();
  if (pathname.startsWith("/admin") && session.role !== "admin") {
    return redirectHome();
  }
  if (pathname.startsWith("/dashboard/shop") && session.role !== "owner") {
    return redirectHome();
  }
  if (pathname.startsWith("/dashboard/barber") && session.role !== "barber") {
    return redirectHome();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
