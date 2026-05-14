import { cn } from "@/lib/utils";

export function WrappedCard({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: "default" | "accent" | "dark";
  className?: string;
}) {
  const palette =
    variant === "accent"
      ? "bg-accent text-white"
      : variant === "dark"
        ? "bg-[#1F1B16] text-[#FAF7F2]"
        : "bg-surface text-text-primary";
  return (
    <section
      className={cn(
        "relative flex h-[100dvh] w-full snap-start snap-always flex-col items-center justify-center overflow-hidden px-8",
        palette,
        className,
      )}
    >
      {children}
    </section>
  );
}
