import { NextResponse } from "next/server";
import { authProvider, setSession, getSession } from "@/lib/auth/session";

export async function POST() {
  const { userId } = await authProvider.signIn();
  await setSession(userId);
  const session = await getSession();
  return NextResponse.json({ user: session?.user ?? null });
}
