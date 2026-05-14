"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Share2, Download, X } from "lucide-react";
import { toPng } from "html-to-image";
import { WrappedCard } from "@/components/WrappedCard";
import { ShareCard } from "@/components/ShareCard";
import { CUISINE_GLYPH, CUISINE_LABEL, type User } from "@/types/order";
import type { WrappedSummary } from "@/types/analytics";
import { formatINR, formatINRCompact } from "@/lib/utils";

const TOTAL_SLIDES = 7;

export function WrappedStory({ summary, user }: { summary: WrappedSummary; user: User }) {
  const containerRef = useRef<HTMLElement>(null);
  const shareRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const slides = Array.from(el.querySelectorAll<HTMLElement>("[data-slide]"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const idx = Number((e.target as HTMLElement).dataset.slide);
            setActive(idx);
          }
        }
      },
      { root: el, threshold: 0.6 },
    );
    slides.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  function scrollToSlide(idx: number) {
    const el = containerRef.current;
    if (!el) return;
    const target = el.querySelector<HTMLElement>(`[data-slide="${idx}"]`);
    target?.scrollIntoView({ behavior: "smooth" });
  }

  async function handleShare() {
    if (!shareRef.current) return;
    try {
      const dataUrl = await toPng(shareRef.current, { pixelRatio: 2, cacheBust: true });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], "swiggy-wrapped.png", { type: "image/png" });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "Swiggy Wrapped", text: "My year on Swiggy 🍽️" });
      } else {
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = "swiggy-wrapped.png";
        a.click();
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function handleDownload() {
    if (!shareRef.current) return;
    const dataUrl = await toPng(shareRef.current, { pixelRatio: 2, cacheBust: true });
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "swiggy-wrapped.png";
    a.click();
  }

  return (
    <main
      ref={containerRef}
      className="relative h-[100dvh] w-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide bg-background"
    >
      {/* progress bar */}
      <div className="pointer-events-none fixed inset-x-4 top-4 z-50 flex gap-1 safe-top">
        {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
          <div
            key={i}
            className={
              "h-[3px] flex-1 rounded-full transition-all " +
              (i <= active ? "bg-text-primary/85" : "bg-text-primary/15")
            }
          />
        ))}
      </div>

      {/* close button */}
      <Link
        href="/dashboard"
        className="fixed right-4 top-8 z-50 inline-flex h-9 w-9 items-center justify-center rounded-full bg-surface/85 text-text-primary shadow-card safe-top"
        aria-label="Exit Wrapped"
      >
        <X className="h-4 w-4" />
      </Link>

      {/* invisible tap zones */}
      <button
        type="button"
        onClick={() => scrollToSlide(Math.max(0, active - 1))}
        aria-label="Previous slide"
        className="fixed left-0 top-0 z-40 h-[100dvh] w-[28%] cursor-default"
      />
      <button
        type="button"
        onClick={() => scrollToSlide(Math.min(TOTAL_SLIDES - 1, active + 1))}
        aria-label="Next slide"
        className="fixed right-0 top-0 z-40 h-[100dvh] w-[28%] cursor-default"
      />

      {/* SLIDE 0 — Cover */}
      <div data-slide="0">
        <WrappedCard variant="dark">
          <div className="absolute inset-0 -z-0 bg-[radial-gradient(circle_at_30%_20%,rgba(232,148,101,0.25),transparent_45%),radial-gradient(circle_at_80%_85%,rgba(232,148,101,0.18),transparent_55%)]" />
          <div className="relative z-10 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] opacity-65">Swiggy Wrapped</p>
            <h1 className="mt-4 font-serif text-6xl leading-[1.02] tracking-tight">
              Your year<br /> in food.
            </h1>
            <p className="mt-6 text-base opacity-80">{user.name}, {summary.year}</p>
            <p className="mt-10 text-xs opacity-60">Tap or swipe to begin →</p>
          </div>
        </WrappedCard>
      </div>

      {/* SLIDE 1 — Total */}
      <div data-slide="1">
        <WrappedCard>
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">You ordered</p>
            <div className="mt-3 font-serif text-[88px] leading-none tracking-tighter text-accent">
              {summary.totalOrders}
            </div>
            <p className="mt-3 text-base text-text-muted">times this year</p>
            <p className="mt-10 font-serif text-3xl text-text-primary">
              and spent
            </p>
            <div className="mt-3 text-4xl font-semibold tracking-tight text-text-primary">
              {formatINR(summary.totalSpendPaise)}
            </div>
          </div>
        </WrappedCard>
      </div>

      {/* SLIDE 2 — Top cuisine */}
      <div data-slide="2">
        <WrappedCard variant="accent">
          <div className="text-center text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-80">Your top cuisine</p>
            <div className="mt-6 text-7xl" aria-hidden>
              {summary.favoriteCuisine ? CUISINE_GLYPH[summary.favoriteCuisine.cuisine] : "🍛"}
            </div>
            <h2 className="mt-4 font-serif text-5xl tracking-tight">
              {summary.favoriteCuisine ? CUISINE_LABEL[summary.favoriteCuisine.cuisine] : "—"}
            </h2>
            {summary.favoriteCuisine ? (
              <p className="mt-4 text-base opacity-90">
                {summary.favoriteCuisine.percentage}% of your orders · {summary.favoriteCuisine.orderCount} times
              </p>
            ) : null}
          </div>
        </WrappedCard>
      </div>

      {/* SLIDE 3 — Top restaurant */}
      <div data-slide="3">
        <WrappedCard>
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">Your go-to spot</p>
            <h2 className="mt-5 font-serif text-5xl leading-tight tracking-tight text-text-primary text-balance">
              {summary.topRestaurant?.name ?? "—"}
            </h2>
            {summary.topRestaurant ? (
              <>
                <p className="mt-3 text-base text-text-muted">{summary.topRestaurant.area}</p>
                <div className="mt-10 inline-flex flex-col gap-1 rounded-2xl bg-surface px-6 py-4 shadow-card">
                  <span className="text-xs font-medium uppercase tracking-wide text-text-muted">You ordered</span>
                  <span className="text-3xl font-semibold tracking-tight text-text-primary">
                    {summary.topRestaurant.orderCount} <span className="text-base font-medium text-text-muted">times</span>
                  </span>
                  <span className="text-[13px] text-text-muted">{formatINRCompact(summary.topRestaurant.spendPaise)} spent</span>
                </div>
              </>
            ) : null}
          </div>
        </WrappedCard>
      </div>

      {/* SLIDE 4 — Comfort food */}
      <div data-slide="4">
        <WrappedCard>
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">Comfort food</p>
            <div className="relative mx-auto mt-8 h-[180px] w-[220px]">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="absolute left-1/2 top-1/2 h-[90px] w-[180px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-accent-soft shadow-card"
                  style={{ transform: `translate(-50%, calc(-50% + ${(i - 1) * 14}px)) rotate(${(i - 1) * 4}deg)` }}
                />
              ))}
              <div className="absolute left-1/2 top-1/2 z-10 flex h-[110px] w-[200px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl bg-accent text-center text-white shadow-elevated">
                <div>
                  <div className="text-2xl font-semibold tracking-tight">
                    {summary.topItem ? summary.topItem.name : "—"}
                  </div>
                  <div className="mt-1 text-xs opacity-85">
                    {summary.topItem ? `ordered ${summary.topItem.count} times` : ""}
                  </div>
                </div>
              </div>
            </div>
            <p className="mt-10 max-w-xs text-base text-text-muted text-balance">
              {summary.topItem
                ? `That's a lot of ${summary.topItem.name}. We're not judging.`
                : "No repeats yet — keep exploring."}
            </p>
          </div>
        </WrappedCard>
      </div>

      {/* SLIDE 5 — Late night */}
      <div data-slide="5">
        <WrappedCard variant="dark">
          <div className="text-center text-[#FAF7F2]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-70">After dark</p>
            <div className="mt-8 text-7xl" aria-hidden>
              {summary.lateNight.percentage >= 5 ? "🌙" : "🌅"}
            </div>
            <h2 className="mt-6 font-serif text-5xl tracking-tight">
              {summary.lateNight.percentage >= 5 ? "Night owl" : "Early bird"}
            </h2>
            <p className="mt-4 max-w-xs text-base opacity-80 text-balance">
              {summary.lateNight.percentage >= 5
                ? `${summary.lateNight.percentage}% of your orders came in after 10pm.`
                : `Only ${summary.lateNight.percentage}% of your orders are late-night.`}
            </p>
            {summary.lateNight.topItem && summary.lateNight.percentage >= 5 ? (
              <p className="mt-4 text-sm opacity-65">Usually some {summary.lateNight.topItem}.</p>
            ) : null}
          </div>
        </WrappedCard>
      </div>

      {/* SLIDE 6 — Share */}
      <div data-slide="6">
        <WrappedCard>
          <div className="flex flex-col items-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">That's your year</p>
            <h2 className="mt-2 font-serif text-3xl tracking-tight text-text-primary text-balance">
              Share the receipt.
            </h2>
            <div className="mt-6">
              <ShareCard ref={shareRef} summary={summary} userName={user.name} />
            </div>
            <div className="mt-6 flex w-full max-w-xs flex-col gap-2">
              <button
                type="button"
                onClick={handleShare}
                className="flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-white shadow-card"
              >
                <Share2 className="h-4 w-4" /> Share
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="flex items-center justify-center gap-2 rounded-full bg-surface px-6 py-3.5 text-sm font-semibold text-text-primary shadow-card"
              >
                <Download className="h-4 w-4" /> Save image
              </button>
              <Link
                href="/dashboard"
                className="mt-2 text-center text-xs font-medium text-text-muted"
              >
                Back to dashboard
              </Link>
            </div>
          </div>
        </WrappedCard>
      </div>
    </main>
  );
}
