import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";
import { SESSION_COOKIE, SWIGGY_COOKIE } from "@/lib/cookies";
import type { Session } from "@/types/session";

const SECRET = process.env.SESSION_SECRET ?? "dev-fallback-secret-do-not-use-in-prod";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function sign(value: string): string {
  return createHmac("sha256", SECRET).update(value).digest("base64url");
}

function pack(userId: string): string {
  return `${userId}.${sign(userId)}`;
}

function unpack(raw: string): string | null {
  const [userId, sig] = raw.split(".");
  if (!userId || !sig) return null;
  const a = Buffer.from(sig);
  const b = Buffer.from(sign(userId));
  if (a.length !== b.length) return null;
  return timingSafeEqual(a, b) ? userId : null;
}

export async function setSession(userId: string): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, pack(userId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

/** Drops the session and the stored Swiggy cookie it depends on. */
export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  store.delete(SWIGGY_COOKIE);
}

export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  const raw = store.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  const userId = unpack(raw);
  if (!userId) return null;
  // No local user record — the user is whoever the Swiggy cookie belongs to.
  return { userId, user: { id: userId, email: "", name: "You", avatarUrl: null } };
}
