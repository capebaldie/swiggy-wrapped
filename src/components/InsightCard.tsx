import { cn } from "@/lib/utils";
import type { Insight } from "@/types/analytics";

const TONE_BG: Record<Insight["tone"], string> = {
  neutral: "bg-surface",
  positive: "bg-accent-soft",
  warn: "bg-surface-muted",
};

export function InsightCard({ insight }: { insight: Insight }) {
  return (
    <div className={cn("rounded-2xl p-4 shadow-card", TONE_BG[insight.tone])}>
      <div className="flex items-start gap-3">
        <div className="text-2xl leading-none" aria-hidden>
          {insight.icon}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-[15px] font-semibold tracking-tight text-text-primary text-balance">
            {insight.title}
          </h3>
          <p className="mt-1 text-[13px] leading-relaxed text-text-muted text-balance">{insight.body}</p>
        </div>
      </div>
    </div>
  );
}
