import { Sparkles } from "lucide-react";
import { CookieForm } from "@/components/CookieForm";

export default function LoginPage() {
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
          and the late-night habits you didn&apos;t know you had.
        </p>

        <div className="mt-10 space-y-3">
          <CookieForm submitLabel="Connect Swiggy account" redirectTo="/dashboard" />
          <p className="text-center text-[11px] leading-relaxed text-text-muted">
            Log in on swiggy.com, export cookies with a Cookie-Editor extension, and paste the
            string. Stored server-side, never shared.
          </p>
        </div>
      </div>

      <footer className="pb-6 text-center text-[11px] text-text-muted">
        Reads your order history from swiggy.com. Not affiliated with Swiggy.
      </footer>
    </div>
  );
}
