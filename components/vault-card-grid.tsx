"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Clock,
  TrendingUp,
  Gavel,
  Zap,
  Users,
  Star,
  ChevronDown,
  SlidersHorizontal,
  Lock,
} from "lucide-react";
import { vaultListings } from "@/lib/mock-data";
import { cn, formatUSDT } from "@/lib/utils";
import type { CardCategory, VaultListing } from "@/lib/types";

// ─── Category colors ───────────────────────────────────────────────────────────

const CATEGORY_STYLES: Record<
  CardCategory,
  { badge: string; accent: string }
> = {
  Football: {
    badge: "bg-blue-500/15 text-blue-400 border-blue-500/25",
    accent: "#3b82f6",
  },
  "One Piece": {
    badge: "bg-red-500/15 text-red-400 border-red-500/25",
    accent: "#ef4444",
  },
  Pokemon: {
    badge: "bg-yellow-500/15 text-yellow-400 border-yellow-500/25",
    accent: "#f59e0b",
  },
};

const RARITY_STYLES = {
  Iconic: "bg-gold/15 text-gold border-gold/30",
  "Ultra Rare": "bg-purple-500/15 text-purple-400 border-purple-500/25",
  Rare: "bg-blue-500/15 text-blue-400 border-blue-500/25",
  Uncommon: "bg-white/10 text-white/50 border-white/15",
};

const SELLER_TIER_STYLES = {
  Elite: { label: "⭐ Elite Seller", color: "text-gold" },
  Verified: { label: "✓ Verified", color: "text-emerald-400" },
  Standard: { label: "Standard", color: "text-white/40" },
};

// ─── Card Tile ─────────────────────────────────────────────────────────────────

function CardTile({
  listing,
  index,
}: {
  listing: VaultListing;
  index: number;
}) {
  const [bidPlaced, setBidPlaced] = useState(false);
  const catStyle = CATEGORY_STYLES[listing.category];
  const rarityStyle = RARITY_STYLES[listing.rarity];
  const sellerStyle = SELLER_TIER_STYLES[listing.sellerTier];
  const isIconic = listing.rarity === "Iconic";
  const isPSA10 = listing.psaGrade === 10;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border bg-[#0E0E1A] transition-all duration-300",
        "hover:shadow-[0_8px_40px_rgba(0,0,0,0.5)] hover:-translate-y-1",
        isIconic || isPSA10
          ? "border-gold/25 hover:border-gold/45 shadow-[0_0_0_1px_rgba(212,160,23,0.08)]"
          : "border-white/[0.07] hover:border-white/[0.14]"
      )}
    >
      {/* Card image area */}
      <div
        className="relative h-44 w-full overflow-hidden sm:h-52"
        style={{
          background: `linear-gradient(135deg, ${listing.gradientFrom} 0%, ${listing.gradientVia} 50%, ${listing.gradientTo} 100%)`,
        }}
      >
        {/* Shine overlay */}
        <div className="absolute inset-0 bg-card-shine opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Card name in image */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 text-center">
          <div
            className="font-display text-sm font-bold leading-tight text-white/80 sm:text-base"
            style={{
              textShadow: "0 2px 12px rgba(0,0,0,0.8)",
            }}
          >
            {listing.cardName}
          </div>
          <div className="text-xs text-white/30">{listing.year}</div>
          {/* Decorative lines */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </div>

        {/* Top-left: Category badge */}
        <div className="absolute left-3 top-3">
          <span
            className={cn(
              "rounded-md border px-2 py-0.5 text-[10px] font-semibold",
              catStyle.badge
            )}
          >
            {listing.category}
          </span>
        </div>

        {/* Top-right: Rarity */}
        <div className="absolute right-3 top-3">
          <span
            className={cn(
              "rounded-md border px-2 py-0.5 text-[10px] font-semibold",
              rarityStyle
            )}
          >
            {listing.rarity}
          </span>
        </div>

        {/* Bottom: Verified badge */}
        <div className="absolute bottom-3 right-3">
          {listing.isVerified ? (
            <div className="flex items-center gap-1 rounded-lg border border-emerald-500/25 bg-emerald-500/15 px-2 py-1 verified-glow">
              <ShieldCheck className="h-3 w-3 text-emerald-400" />
              <span className="text-[9px] font-semibold text-emerald-400 sm:text-[10px]">
                <span className="sm:hidden">Verified</span>
                <span className="hidden sm:inline">RSA Verified</span>
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.06] px-2 py-1">
              <ShieldAlert className="h-3 w-3 text-white/30" />
              <span className="text-[10px] font-medium text-white/30">
                Unverified
              </span>
            </div>
          )}
        </div>

        {/* Iconic glow rim */}
        {isIconic && (
          <div className="pointer-events-none absolute inset-0 rounded-t-2xl ring-1 ring-inset ring-gold/20" />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Title + subtitle */}
        <div>
          <h3 className="text-sm font-bold text-white leading-tight">
            {listing.cardName}
          </h3>
          <p className="mt-0.5 text-[11px] text-white/35 leading-snug">
            {listing.subtitle}
          </p>
        </div>

        {/* PSA Grade row */}
        <div className="flex items-center justify-between">
          {listing.psaGrade ? (
            <div className="flex items-center gap-1.5">
              <div
                className={cn(
                  "flex h-6 w-10 items-center justify-center rounded font-bold text-[11px] border",
                  listing.psaGrade === 10
                    ? "bg-gold/15 text-gold border-gold/30"
                    : listing.psaGrade >= 9
                    ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/25"
                    : "bg-white/10 text-white/60 border-white/15"
                )}
              >
                PSA {listing.psaGrade}
              </div>
              {listing.population && (
                <span className="text-[10px] text-white/25">
                  Pop: {listing.population}
                </span>
              )}
            </div>
          ) : (
            <button
              type="button"
              className="flex items-center gap-1 rounded-lg border border-dashed border-white/15 px-2.5 py-1 text-[10px] font-medium text-white/35 transition-colors hover:border-gold/20 hover:text-gold/60"
            >
              <Star className="h-3 w-3" />
              Send to Grading
            </button>
          )}
          <div className="flex items-center gap-1 text-[10px] text-white/30">
            <Users className="h-3 w-3" />
            <span>{listing.bids} bids</span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/[0.05]" />

        {/* Price section */}
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-1 text-[10px] text-white/30 mb-0.5">
              <Gavel className="h-3 w-3" />
              <span>Current Bid</span>
            </div>
            <span className="text-xl font-bold text-white tabular-nums font-mono">
              {formatUSDT(listing.currentBid)}
            </span>
            <span className="ml-1 text-xs text-white/40">USDT</span>
          </div>

          {listing.buyNowPrice && (
            <div className="text-right">
              <div className="text-[10px] text-white/25 mb-0.5">Buy Now</div>
              <span className="text-sm font-semibold text-white/60 tabular-nums">
                {formatUSDT(listing.buyNowPrice)}
              </span>
            </div>
          )}
        </div>

        {/* Time left */}
        <div className="flex flex-col gap-1.5 text-[10px] text-white/30 sm:flex-row sm:items-center sm:gap-1">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3 shrink-0" />
            {listing.timeLeft} left
          </span>
          <span className="flex flex-wrap items-center gap-1 sm:ml-auto">
            <span className={sellerStyle.color + " font-medium"}>
              {sellerStyle.label}
            </span>
            <span className="text-white/20">·</span>
            <span>{listing.sellerRegion}</span>
          </span>
        </div>

        {/* Action buttons */}
        <div className="mt-auto flex flex-col gap-2 pt-1 sm:flex-row sm:gap-2">
          <button
            type="button"
            onClick={() => setBidPlaced(true)}
            disabled={bidPlaced}
            className={cn(
              "flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-semibold transition-all sm:min-h-0",
              bidPlaced
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 cursor-default"
                : "bg-white/[0.06] border border-white/10 text-white/70 hover:bg-white/[0.1] hover:text-white hover:border-white/20"
            )}
          >
            {bidPlaced ? (
              <>
                <Shield className="h-3.5 w-3.5" />
                Bid Placed
              </>
            ) : (
              <>
                <Gavel className="h-3.5 w-3.5" />
                Place Bid
              </>
            )}
          </button>

          {listing.buyNowPrice && (
            <button
              type="button"
              className={cn(
                "flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-semibold transition-all sm:min-h-0",
                isIconic
                  ? "bg-gold/15 border border-gold/30 text-gold hover:bg-gold/20"
                  : "bg-gold/10 border border-gold/20 text-gold/80 hover:bg-gold/15 hover:text-gold"
              )}
            >
              <Zap className="h-3.5 w-3.5" />
              Buy Now
            </button>
          )}
        </div>
      </div>

      {/* Elite card glow overlay */}
      {isIconic && (
        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-gold/10 group-hover:ring-gold/20 transition-all" />
      )}
    </motion.div>
  );
}

// ─── Filter Bar ────────────────────────────────────────────────────────────────

type FilterCategory = "All" | CardCategory;
type SortOption = "bid-high" | "bid-low" | "ending" | "grade";

function FilterBar({
  activeCategory,
  setActiveCategory,
  sortBy,
  setSortBy,
  count,
}: {
  activeCategory: FilterCategory;
  setActiveCategory: (c: FilterCategory) => void;
  sortBy: SortOption;
  setSortBy: (s: SortOption) => void;
  count: number;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Category pills */}
      <div className="scroll-touch-x -mx-1 flex min-w-0 flex-nowrap items-center gap-1.5 overflow-x-auto pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible">
        {(["All", "Football", "One Piece", "Pokemon"] as FilterCategory[]).map(
          (cat) => (
            <button
              type="button"
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "shrink-0 rounded-full border px-3 py-2 text-xs font-medium transition-all active:scale-[0.98] sm:py-1",
                activeCategory === cat
                  ? "bg-gold/10 border-gold/25 text-gold"
                  : "border-white/10 text-white/40 hover:border-white/20 hover:text-white/60"
              )}
            >
              {cat === "One Piece" ? (
                <>
                  <span className="sm:hidden">OP</span>
                  <span className="hidden sm:inline">One Piece</span>
                </>
              ) : (
                cat
              )}
            </button>
          )
        )}
        <span className="ml-1 hidden shrink-0 text-xs text-white/25 sm:inline">
          {count} listing{count !== 1 ? "s" : ""}
        </span>
      </div>
      <span className="text-xs text-white/25 sm:hidden">
        {count} listing{count !== 1 ? "s" : ""}
      </span>

      {/* Sort */}
      <div className="flex w-full items-center gap-2 sm:w-auto">
        <SlidersHorizontal className="h-3.5 w-3.5 text-white/30" />
        <div className="relative min-w-0 flex-1 sm:flex-initial">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="w-full min-h-[44px] cursor-pointer appearance-none rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2 pr-8 text-xs text-white/60 hover:border-white/15 focus:outline-none sm:min-h-0 sm:w-auto sm:py-1.5"
          >
            <option value="bid-high">Highest Bid</option>
            <option value="bid-low">Lowest Bid</option>
            <option value="ending">Ending Soon</option>
            <option value="grade">Highest Grade</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-white/30" />
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export function VaultCardGrid() {
  const [activeCategory, setActiveCategory] = useState<FilterCategory>("All");
  const [sortBy, setSortBy] = useState<SortOption>("bid-high");

  const filtered = vaultListings
    .filter(
      (l) => activeCategory === "All" || l.category === activeCategory
    )
    .sort((a, b) => {
      if (sortBy === "bid-high") return b.currentBid - a.currentBid;
      if (sortBy === "bid-low") return a.currentBid - b.currentBid;
      if (sortBy === "ending") return a.timeLeft.localeCompare(b.timeLeft);
      if (sortBy === "grade")
        return (b.psaGrade ?? 0) - (a.psaGrade ?? 0);
      return 0;
    });

  return (
    <section className="border-b border-white/[0.06] bg-[#080812]">
      <div className="mx-auto max-w-screen-2xl px-4 py-10 sm:px-6 sm:py-14">
        {/* Section header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <div className="mb-3 flex items-center gap-2">
              <Lock className="h-4 w-4 shrink-0 text-gold" />
              <span className="text-[11px] font-semibold uppercase tracking-widest text-gold/70">
                Secure Vault
              </span>
            </div>
            <h2 className="font-display text-xl font-bold text-white sm:text-2xl md:text-3xl">
              Auction Grid
            </h2>
            <p className="mt-1.5 max-w-md text-sm leading-relaxed text-white/40">
              A secure trading environment for serious collectors and card shops.
              Every listing verified before going live.
            </p>
          </div>

          {/* Live indicator */}
          <div className="flex flex-wrap items-stretch gap-2 sm:gap-3">
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.07] px-3 py-2.5 sm:flex-initial sm:px-4">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              <span className="text-xs font-semibold text-emerald-400">
                Live Auction
              </span>
            </div>
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2.5 sm:flex-initial sm:px-4">
              <TrendingUp className="h-3.5 w-3.5 text-gold" />
              <span className="text-xs font-semibold text-white/60">
                {vaultListings.length} Active
              </span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <FilterBar
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
          count={filtered.length}
        />

        {/* Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
          {filtered.map((listing, i) => (
            <CardTile key={listing.id} listing={listing} index={i} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 flex items-center justify-center">
          <button
            type="button"
            className="flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-6 py-3 text-sm font-medium text-white/50 transition-all hover:border-gold/20 hover:text-white/70 sm:min-h-0"
          >
            Load More Listings
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
