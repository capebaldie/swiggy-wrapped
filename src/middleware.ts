import { NextResponse, type NextRequest } from "next/server";

const COOKIE_NAME = "sw_session";

const PROTECTED_PREFIXES = ["/dashboard", "/orders", "/wrapped", "/insights", "/settings"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  if (!isProtected) return NextResponse.next();

  const cookie = req.cookies.get(COOKIE_NAME);
  if (!cookie?.value) {
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
