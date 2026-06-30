import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";

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

  const home = session.role === "owner" ? "/dashboard/shop" : "/dashboard/barber";

  if (pathname === "/dashboard") {
    return NextResponse.redirect(new URL(home, request.url));
  }
  if (pathname.startsWith("/dashboard/shop") && session.role !== "owner") {
    return NextResponse.redirect(new URL(home, request.url));
  }
  if (pathname.startsWith("/dashboard/barber") && session.role !== "barber") {
    return NextResponse.redirect(new URL(home, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
