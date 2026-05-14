"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handle() {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.replace("/");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handle}
      disabled={loading}
      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-surface px-4 py-3.5 text-sm font-semibold text-error shadow-card disabled:opacity-60"
    >
      <LogOut className="h-4 w-4" />
      {loading ? "Logging out…" : "Log out"}
    </button>
  );
}
