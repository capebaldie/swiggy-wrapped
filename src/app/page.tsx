"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Sparkles, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSignIn() {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", { method: "POST" });
      if (!res.ok) throw new Error("Login failed");
      router.push("/dashboard");
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col bg-background px-6">
      <div className="flex flex-1 flex-col justify-center">
        <div className="flex items-center gap-2 text-text-muted">
          <Sparkles className="h-4 w-4" />
          <span className="text-xs font-semibold uppercase tracking-[0.18em]">
            Swiggy Wrapped
          </span>
        </div>
        <h1 className="mt-6 font-serif text-5xl leading-[1.05] tracking-tight text-text-primary text-balance">
          Your year on Swiggy,
          <br />
          beautifully summarised.
        </h1>
        <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-text-muted text-balance">
          Connect your account and see your favourite cuisines, top restaurants,
          and the late-night habits you didn't know you had.
        </p>

        <div className="mt-12 space-y-3">
          <button
            type="button"
            onClick={handleSignIn}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-4 text-base font-semibold text-white shadow-card transition active:scale-[0.99] disabled:opacity-70"
          >
            {loading ? "Connecting…" : "Continue with Swiggy"}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
          <p className="text-center text-[11px] text-text-muted">
            Demo mode — uses sample data, no real account needed.
          </p>
        </div>
      </div>

      <footer className="pb-6 text-center text-[11px] text-text-muted">
        Built with the Swiggy MCP for the Builders Club
      </footer>
    </div>
  );
}
