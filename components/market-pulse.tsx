"use client";

import { useEffect, useState, useRef } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { marketCards } from "@/lib/mock-data";
import { cn, formatCurrency, formatChange } from "@/lib/utils";
import type { CardCategory } from "@/lib/types";

const CATEGORY_COLORS: Record<CardCategory, { dot: string; badge: string }> = {
  Football: {
    dot: "bg-blue-400",
    badge: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  "One Piece": {
    dot: "bg-red-400",
    badge: "bg-red-500/10 text-red-400 border-red-500/20",
  },
  Pokemon: {
    dot: "bg-yellow-400",
    badge: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  },
};

// Inline SVG sparkline
function Sparkline({
  data,
  positive,
}: {
  data: number[];
  positive: boolean;
}) {
  const W = 56;
  const H = 24;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * W;
      const y = H - ((v - min) / range) * (H - 2) - 1;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const color = positive ? "#10b981" : "#ef4444";

  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      fill="none"
      className="shrink-0"
    >
      <polyline
        points={points}
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
    </svg>
  );
}

function TickerCard({
  card,
  livePrice,
}: {
  card: (typeof marketCards)[0];
  livePrice: number;
}) {
  const isPos = card.change24h >= 0;
  const isNeutral = Math.abs(card.change24h) < 0.1;
  const { dot, badge } = CATEGORY_COLORS[card.category];

  return (
    <div className="flex min-w-0 max-w-[min(260px,calc(100vw-3rem))] shrink-0 select-none cursor-default items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.025] px-3 py-2 transition-colors hover:border-gold/20 sm:max-w-none sm:gap-3 sm:px-4 sm:py-2.5">
      <span className={cn("h-2 w-2 rounded-full shrink-0", dot)} />
      <div className="flex flex-col gap-0.5">
        <span className="line-clamp-2 text-[11px] font-medium leading-tight text-white/90 sm:line-clamp-none">
          {card.name}
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-0.5 rounded px-1 py-px text-[9px] font-semibold border",
            badge
          )}
        >
          {card.category}
          {card.psaGrade && ` · PSA ${card.psaGrade}`}
        </span>
      </div>
      <div className="hidden shrink-0 sm:block">
        <Sparkline data={card.sparkline} positive={isPos} />
      </div>
      <div className="flex flex-col items-end gap-0.5">
        <span className="text-sm font-bold text-white tabular-nums font-mono">
          ${formatCurrency(livePrice)}
        </span>
        <span
          className={cn(
            "flex items-center gap-0.5 text-[11px] font-semibold",
            isNeutral
              ? "text-white/40"
              : isPos
              ? "text-emerald-400"
              : "text-red-400"
          )}
        >
          {isNeutral ? (
            <Minus className="h-3 w-3" />
          ) : isPos ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          {formatChange(card.change24h)}
        </span>
      </div>
    </div>
  );
}

export function MarketPulse() {
  const [activeCategory, setActiveCategory] = useState<"All" | CardCategory>(
    "All"
  );
  const [prices, setPrices] = useState<Record<string, number>>(() =>
    Object.fromEntries(marketCards.map((c) => [c.id, c.currentPrice]))
  );
  const [tickKey, setTickKey] = useState(0);
  const prevCategory = useRef(activeCategory);
  const [tickerSecPerCard, setTickerSecPerCard] = useState(6);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 640px)");
    const sync = () => setTickerSecPerCard(mq.matches ? 9 : 6);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Simulate live price ticks
  useEffect(() => {
    const interval = setInterval(() => {
      setPrices((prev) => {
        const next = { ...prev };
        // Tick 1–2 random cards
        const count = Math.random() < 0.5 ? 1 : 2;
        const shuffled = [...marketCards].sort(() => Math.random() - 0.5);
        for (let i = 0; i < count; i++) {
          const card = shuffled[i];
          const pct = (Math.random() - 0.49) * 0.004;
          next[card.id] = Math.max(1, prev[card.id] * (1 + pct));
        }
        return next;
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Reset ticker animation on category change
  useEffect(() => {
    if (prevCategory.current !== activeCategory) {
      setTickKey((k) => k + 1);
      prevCategory.current = activeCategory;
    }
  }, [activeCategory]);

  const filtered =
    activeCategory === "All"
      ? marketCards
      : marketCards.filter((c) => c.category === activeCategory);

  const doubled = [...filtered, ...filtered];

  return (
    <section className="border-b border-white/[0.06] bg-[#080812]">
      {/* Header row */}
      <div className="flex flex-col gap-3 border-b border-white/[0.04] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-emerald-400" />
          <span className="text-[11px] font-semibold uppercase tracking-widest text-white/35">
            Market Pulse
          </span>
          <span className="hidden text-[11px] text-white/20 lg:inline">
            · Real-time data keeps your inventory value accurate
          </span>
        </div>

        {/* Category filters — swipe on small screens */}
        <div className="scroll-touch-x -mx-4 flex flex-nowrap items-center gap-1.5 overflow-x-auto px-4 pb-0.5 sm:mx-0 sm:max-w-none sm:flex-wrap sm:overflow-visible sm:px-0">
          {(["All", "Football", "One Piece", "Pokemon"] as const).map(
            (cat) => (
              <button
                type="button"
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "shrink-0 rounded-full px-3 py-1.5 text-[11px] font-medium transition-all active:scale-[0.98]",
                  activeCategory === cat
                    ? "bg-gold/10 text-gold border border-gold/25"
                    : "border border-transparent text-white/35 hover:text-white/60"
                )}
              >
                {cat === "One Piece" ? (
                  <>
                    <span className="sm:hidden" title="One Piece">
                      OP
                    </span>
                    <span className="hidden sm:inline">One Piece</span>
                  </>
                ) : (
                  cat
                )}
              </button>
            )
          )}
        </div>
      </div>

      {/* Ticker strip */}
      <div className="relative overflow-hidden py-2 sm:py-3">
        {/* Fade edges */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-10 bg-gradient-to-r from-[#080812] to-transparent sm:w-16 md:w-20" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-10 bg-gradient-to-l from-[#080812] to-transparent sm:w-16 md:w-20" />

        <div
          key={tickKey}
          className="ticker-track flex gap-2 sm:gap-3"
          style={{
            width: "max-content",
            animation: `ticker ${filtered.length * tickerSecPerCard}s linear infinite`,
          }}
        >
          {doubled.map((card, i) => (
            <TickerCard
              key={`${card.id}-${i}`}
              card={card}
              livePrice={prices[card.id] ?? card.currentPrice}
            />
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div className="scroll-touch-x flex items-center gap-4 border-t border-white/[0.04] px-4 py-2.5 sm:gap-6 sm:px-6 sm:py-2 overflow-x-auto">
        {[
          { label: "24h Volume", value: "$318K USDT" },
          { label: "Active Listings", value: "1,204" },
          { label: "Verified Cards", value: "98.2%" },
          { label: "Avg Settlement", value: "< 4h" },
          { label: "Markets", value: "SG · HK · JP · AE · UK · EU" },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] uppercase tracking-wider text-white/25">
              {label}
            </span>
            <span className="text-[11px] font-semibold text-white/70">
              {value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
