import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
  icon?: React.ReactNode;
  accent?: boolean;
  className?: string;
}

export function StatCard({ label, value, hint, icon, accent, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl p-4 shadow-card",
        accent ? "bg-accent-soft text-text-primary" : "bg-surface",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="text-xs font-medium uppercase tracking-wide text-text-muted">{label}</div>
        {icon ? <div className="text-text-muted">{icon}</div> : null}
      </div>
      <div className="mt-2 text-2xl font-semibold tracking-tight text-text-primary">{value}</div>
      {hint ? <div className="mt-1 text-xs text-text-muted">{hint}</div> : null}
    </div>
  );
}
