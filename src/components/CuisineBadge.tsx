import { cn } from "@/lib/utils";
import { CUISINE_GLYPH, CUISINE_LABEL, type Cuisine } from "@/types/order";

export function CuisineBadge({
  cuisine,
  className,
  size = "sm",
}: {
  cuisine: Cuisine;
  className?: string;
  size?: "sm" | "md";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-surface-muted text-text-muted",
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-3 py-1 text-xs",
        className,
      )}
    >
      <span aria-hidden>{CUISINE_GLYPH[cuisine]}</span>
      <span className="font-medium">{CUISINE_LABEL[cuisine]}</span>
    </span>
  );
}
