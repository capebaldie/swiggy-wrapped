import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";
import { getMcpClient } from "@/lib/mcp";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { MockDataset, User } from "@/types/order";
import type { Session } from "@/types/session";

const COOKIE_NAME = "sw_session";
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
  const expected = sign(userId);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return null;
  return timingSafeEqual(a, b) ? userId : null;
}

function loadUser(userId: string): User | null {
  // v1: read demo user from mock dataset. v2: read from Prisma.
  try {
    const path = join(process.cwd(), "data", "mock-orders.json");
    const raw = readFileSync(path, "utf-8");
    const ds = JSON.parse(raw) as MockDataset;
    return ds.user.id === userId ? ds.user : null;
  } catch {
    return null;
  }
}

export async function setSession(userId: string): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, pack(userId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;
  if (!raw) return null;
  const userId = unpack(raw);
  if (!userId) return null;
  const user = loadUser(userId);
  if (!user) return null;
  return { userId, user };
}

export async function requireSession(): Promise<Session> {
  const s = await getSession();
  if (!s) throw new Response("Unauthorized", { status: 401 });
  return s;
}

export { COOKIE_NAME };

/**
 * Auth provider abstraction. v1 mock signs in the demo user.
 * Real Swiggy MCP OAuth replaces this one file.
 */
export const authProvider = {
  async signIn(): Promise<{ userId: string }> {
    const client = getMcpClient();
    await client.authorize("user_demo");
    return { userId: "user_demo" };
  },
  async signOut(): Promise<void> {
    // no-op in v1
  },
};
