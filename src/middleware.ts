import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, SWIGGY_COOKIE } from "@/lib/cookies";

const PROTECTED_PREFIXES = ["/dashboard", "/orders", "/wrapped", "/insights", "/settings"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  if (!isProtected) return NextResponse.next();

  // Both are required: the signed session, and the Swiggy cookie the data comes from.
  if (!req.cookies.get(SESSION_COOKIE)?.value || !req.cookies.get(SWIGGY_COOKIE)?.value) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/orders/:path*", "/wrapped/:path*", "/insights/:path*", "/settings/:path*"],
};
