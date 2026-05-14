"use client";

import { forwardRef } from "react";
import type { WrappedSummary } from "@/types/analytics";
import { CUISINE_GLYPH, CUISINE_LABEL } from "@/types/order";
import { formatINRCompact } from "@/lib/utils";

interface Props {
  summary: WrappedSummary;
  userName: string;
}

export const ShareCard = forwardRef<HTMLDivElement, Props>(function ShareCard(
  { summary, userName },
  ref,
) {
  return (
    <div
      ref={ref}
      className="flex w-full max-w-[340px] flex-col gap-4 rounded-3xl bg-[#1F1B16] p-6 text-[#FAF7F2] shadow-elevated"
    >
      <div className="flex items-baseline justify-between">
        <div className="font-serif text-2xl tracking-tight">Swiggy Wrapped</div>
        <div className="text-xs font-medium uppercase tracking-wide opacity-60">{summary.year}</div>
      </div>
      <div className="text-[13px] opacity-70">{userName}'s year in food</div>

      <div className="grid grid-cols-2 gap-3">
        <Tile label="Orders" value={String(summary.totalOrders)} />
        <Tile label="Spent" value={formatINRCompact(summary.totalSpendPaise)} />
        {summary.favoriteCuisine ? (
          <Tile
            label="Top cuisine"
            value={`${CUISINE_GLYPH[summary.favoriteCuisine.cuisine]} ${CUISINE_LABEL[summary.favoriteCuisine.cuisine]}`}
          />
        ) : null}
        {summary.topRestaurant ? <Tile label="Go-to" value={summary.topRestaurant.name} /> : null}
        {summary.topItem ? <Tile label="Comfort food" value={`${summary.topItem.name} ×${summary.topItem.count}`} /> : null}
        {summary.lateNight.percentage > 0 ? (
          <Tile label="After 10pm" value={`${summary.lateNight.percentage}%`} />
        ) : null}
      </div>

      <div className="mt-2 border-t border-white/10 pt-3 text-[11px] opacity-60">swiggywrapped.app</div>
    </div>
  );
});

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/5 p-3">
      <div className="text-[10px] font-medium uppercase tracking-wide opacity-60">{label}</div>
      <div className="mt-1 truncate text-sm font-semibold">{value}</div>
    </div>
  );
}
