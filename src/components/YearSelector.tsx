import Link from "next/link";

/**
 * Chip row to scope a page by year. Renders `?year=<v>` links on the current
 * path — server-component friendly (the page re-renders with the new scope).
 */
export function YearSelector({
  years,
  selected,
  includeAll = false,
}: {
  years: number[];
  selected: number | "all";
  includeAll?: boolean;
}) {
  const options: (number | "all")[] = includeAll ? ["all", ...years] : years;
  if (options.length <= 1) return null;

  return (
    <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {options.map((v) => {
        const active = v === selected;
        return (
          <Link
            key={v}
            href={`?year=${v}`}
            scroll={false}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition ${
              active ? "bg-accent text-white shadow-card" : "bg-surface text-text-muted"
            }`}
          >
            {v === "all" ? "Last 12 months" : v}
          </Link>
        );
      })}
    </div>
  );
}
