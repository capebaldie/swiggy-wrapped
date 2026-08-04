import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LogoutButton } from "@/components/LogoutButton";
import { CookieForm } from "@/components/CookieForm";

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
          <div className="truncate text-[12px] text-text-muted">Swiggy account · {session.userId}</div>
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
        <div className="mt-2 space-y-3 rounded-2xl bg-surface p-4 shadow-card">
          <div>
            <div className="text-[14px] font-medium text-text-primary">Reconnect Swiggy</div>
            <div className="text-[11px] text-text-muted">
              Paste a fresh swiggy.com cookie if your orders stop loading.
            </div>
          </div>
          <CookieForm submitLabel="Update cookie" />
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
