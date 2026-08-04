import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { setSession, clearSession } from "@/lib/auth/session";
import { validateCookie } from "@/lib/swiggy/dapi";
import { SWIGGY_COOKIE } from "@/lib/cookies";

const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

// Validate a pasted swiggy.com cookie, then store it (httpOnly) and open a session.
export async function POST(req: NextRequest) {
  const { cookie } = (await req.json().catch(() => ({}))) as { cookie?: string };
  if (!cookie?.trim()) return NextResponse.json({ ok: false, reason: "Cookie is required" }, { status: 400 });

  const result = await validateCookie(cookie.trim());
  if (!result.ok) return NextResponse.json({ ok: false, reason: result.reason }, { status: 401 });

  const store = await cookies();
  store.set(SWIGGY_COOKIE, cookie.trim(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
  await setSession(result.userId);
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  await clearSession();
  return NextResponse.json({ ok: true });
}
