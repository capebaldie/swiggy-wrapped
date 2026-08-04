"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

/**
 * Paste-a-swiggy.com-cookie form. Used for first connect (with `redirectTo`)
 * and for reconnecting an expired cookie from Settings (without).
 */
export function CookieForm({ submitLabel, redirectTo }: { submitLabel: string; redirectTo?: string }) {
  const router = useRouter();
  const [cookie, setCookie] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function submit() {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/settings/swiggy-cookie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cookie }),
      });
      const data = (await res.json()) as { ok: boolean; reason?: string };
      if (!res.ok || !data.ok) throw new Error(data.reason ?? "Could not connect");
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? e.message : "Could not connect" });
      setLoading(false);
      return;
    }
    if (redirectTo) return router.push(redirectTo); // keep `loading` on through navigation
    setCookie("");
    setMsg({ ok: true, text: "Reconnected — refreshing your orders." });
    setLoading(false);
    router.refresh();
  }

  return (
    <>
      <textarea
        value={cookie}
        onChange={(e) => setCookie(e.target.value)}
        rows={3}
        placeholder="Paste your swiggy.com cookie here…"
        aria-label="Swiggy cookie"
        className="w-full resize-none rounded-2xl border border-border bg-surface px-4 py-3 text-[13px] text-text-primary shadow-card outline-none focus:border-accent"
      />
      <button
        type="button"
        onClick={submit}
        disabled={loading || !cookie.trim()}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-[15px] font-semibold text-white shadow-card transition active:scale-[0.99] disabled:opacity-70"
      >
        {loading ? "Connecting…" : submitLabel}
        {!loading && <ArrowRight className="h-4 w-4" />}
      </button>
      {msg && (
        <p className={`text-center text-[11px] ${msg.ok ? "text-text-muted" : "text-error"}`}>{msg.text}</p>
      )}
    </>
  );
}
