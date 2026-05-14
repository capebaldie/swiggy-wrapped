"use client";

import { useMemo, useState } from "react";
import { CuisineBadge } from "@/components/CuisineBadge";
import { OrderCard } from "@/components/OrderCard";
import { EmptyState } from "@/components/EmptyState";
import type { Order, Cuisine } from "@/types/order";
import { CUISINE_LABEL } from "@/types/order";

const PAGE_SIZE = 20;

export function OrdersListClient({ orders }: { orders: Order[] }) {
  const [selected, setSelected] = useState<Cuisine | null>(null);
  const [visible, setVisible] = useState(PAGE_SIZE);

  const cuisines = useMemo(() => {
    const set = new Set<Cuisine>();
    orders.forEach((o) => set.add(o.restaurant.cuisine));
    return Array.from(set);
  }, [orders]);

  const filtered = useMemo(
    () =>
      selected
        ? orders.filter((o) => o.restaurant.cuisine === selected)
        : orders,
    [orders, selected],
  );

  const shown = filtered.slice(0, visible);
  const hasMore = filtered.length > visible;

  return (
    <>
      <div className="mt-4 flex gap-2 overflow-x-hidden pb-1 scrollbar-hide max-w-full min-w-0">
        <Chip
          active={selected === null}
          onClick={() => {
            setSelected(null);
            setVisible(PAGE_SIZE);
          }}
        >
          All <span className="ml-1 opacity-60">{orders.length}</span>
        </Chip>
        {cuisines.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => {
              setSelected(c);
              setVisible(PAGE_SIZE);
            }}
            className={
              "relative shrink-0 rounded-full max-w-fit px-3 py-1.5 text-xs font-medium transition " +
              (selected === c
                ? "bg-accent text-white shadow-card"
                : "bg-surface text-text-muted shadow-card")
            }
          >
            <CuisineBadge
              cuisine={c}
              className={selected === c ? "!bg-white/20 !text-white" : ""}
            />
            <span className="sr-only">{CUISINE_LABEL[c]}</span>
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-3">
        {shown.length === 0 ? (
          <EmptyState
            icon="🍽️"
            title="No orders yet"
            body="Try changing the cuisine filter above."
          />
        ) : (
          shown.map((o) => <OrderCard key={o.id} order={o} />)
        )}
      </div>

      {hasMore && (
        <button
          type="button"
          onClick={() => setVisible((v) => v + PAGE_SIZE)}
          className="mt-5 w-full rounded-full bg-surface px-6 py-3 text-sm font-semibold text-text-primary shadow-card"
        >
          Show more
        </button>
      )}
    </>
  );
}

function Chip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "relative shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition " +
        (active
          ? "bg-accent text-white shadow-card"
          : "bg-surface text-text-primary shadow-card")
      }
    >
      {children}
    </button>
  );
}
