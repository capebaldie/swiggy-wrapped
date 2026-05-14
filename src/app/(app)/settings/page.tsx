import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LogoutButton } from "@/components/LogoutButton";
import { ChevronRight } from "lucide-react";

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) redirect("/");
  const initial = session.user.name.charAt(0);

  return (
    <div className="px-5 pt-6">
      <header>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-text-muted">Profile</p>
        <h1 className="mt-1 font-serif text-3xl tracking-tight text-text-primary">Settings</h1>
      </header>

      <section className="mt-5 flex items-center gap-4 rounded-2xl bg-surface p-4 shadow-card">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-xl font-semibold text-white">
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[15px] font-semibold text-text-primary">{session.user.name}</div>
          <div className="truncate text-[12px] text-text-muted">{session.user.email}</div>
        </div>
      </section>

      <section className="mt-6">
        <h2 className="px-1 text-[11px] font-semibold uppercase tracking-wide text-text-muted">Appearance</h2>
        <div className="mt-2 rounded-2xl bg-surface p-4 shadow-card">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[14px] font-medium text-text-primary">Theme</div>
              <div className="text-[11px] text-text-muted">Light or dark mode</div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </section>

      <section className="mt-6">
        <h2 className="px-1 text-[11px] font-semibold uppercase tracking-wide text-text-muted">Account</h2>
        <div className="mt-2 divide-y divide-border overflow-hidden rounded-2xl bg-surface shadow-card">
          <Row label="Connected service" value="Swiggy (demo)" />
          <Row label="Data range" value="May 2024 – May 2025" />
          <Row label="MCP mode" value={process.env.SWIGGY_MCP_MODE === "prod" ? "Production" : "Mock"} />
        </div>
      </section>

      <section className="mt-8">
        <LogoutButton />
        <p className="mt-4 text-center text-[11px] text-text-muted">
          v0.1 · built for the Swiggy Builders Club
        </p>
      </section>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="text-[13px] text-text-muted">{label}</div>
      <div className="flex items-center gap-1 text-[13px] font-medium text-text-primary">
        {value}
        <ChevronRight className="h-3.5 w-3.5 text-text-muted" aria-hidden />
      </div>
    </div>
  );
}
