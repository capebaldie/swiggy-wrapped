"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ReceiptText, Sparkles, Lightbulb, User } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/orders", label: "Orders", icon: ReceiptText },
  { href: "/wrapped", label: "Wrapped", icon: Sparkles },
  { href: "/insights", label: "Insights", icon: Lightbulb },
  { href: "/settings", label: "Profile", icon: User },
] as const;

export function MobileBottomNav() {
  const pathname = usePathname();
  if (pathname?.startsWith("/wrapped")) return null;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface/95 backdrop-blur safe-bottom"
      aria-label="Primary"
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-around px-2 pt-1.5">
        {TABS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname?.startsWith(href));
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={cn(
                  "flex min-h-[52px] flex-col items-center justify-center gap-0.5 rounded-xl px-2 transition-colors",
                  active ? "text-accent" : "text-text-muted",
                )}
                aria-current={active ? "page" : undefined}
              >
                <Icon className={cn("h-5 w-5", active && "stroke-[2.4]")} aria-hidden />
                <span className="text-[10.5px] font-medium tracking-wide">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
