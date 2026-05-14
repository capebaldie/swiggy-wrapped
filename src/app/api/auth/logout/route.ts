import { NextResponse } from "next/server";
import { clearSession, authProvider } from "@/lib/auth/session";

export async function POST() {
  await authProvider.signOut();
  await clearSession();
  return NextResponse.json({ ok: true });
}
