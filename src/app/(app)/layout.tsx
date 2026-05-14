"use client";

import { usePathname } from "next/navigation";
import { MobileBottomNav } from "@/components/MobileBottomNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isWrapped = pathname?.startsWith("/wrapped");

  if (isWrapped) {
    return <>{children}</>;
  }

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-md flex-col bg-background">
      <main className="flex-1 pb-24">{children}</main>
      <MobileBottomNav />
    </div>
  );
}
