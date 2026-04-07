import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import {
  Shield,
  TrendingUp,
  BarChart2,
  Bell,
  Settings,
  ChevronDown,
} from "lucide-react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Elite Trader | Premium Card Trading Platform",
  description:
    "A premium trading dashboard for Football, One Piece, and Pokémon cards — combining verification, pricing intelligence, grading support, and secure high-value trading.",
  keywords: "card trading, PSA grading, Pokemon, Football cards, One Piece, authentication",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#080812",
};

function NavBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#080812]/95 backdrop-blur-xl supports-[backdrop-filter]:bg-[#080812]/80 pt-[env(safe-area-inset-top,0)]">
      <div className="mx-auto flex h-14 max-w-screen-2xl items-center justify-between gap-2 px-4 sm:px-6">
        {/* Logo */}
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:flex-initial sm:gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-gold/20 bg-gold/10">
            <Shield className="h-4 w-4 text-gold" />
          </div>
          <div className="min-w-0 flex flex-col leading-none">
            <span
              className="truncate text-xs font-bold tracking-wide text-white sm:text-sm"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              ELITE TRADER
            </span>
            <span className="hidden text-[10px] tracking-widest text-gold/70 uppercase sm:block">
              Premium Platform
            </span>
          </div>
        </div>

        {/* Mobile: icon strip */}
        <nav
          aria-label="Quick sections"
          className="flex shrink-0 items-center gap-0.5 md:hidden"
        >
          {[
            { icon: TrendingUp, label: "Market" },
            { icon: Shield, label: "Vault" },
            { icon: BarChart2, label: "Portfolio" },
          ].map(({ icon: Icon, label }) => (
            <button
              key={label}
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-lg text-white/50 transition-colors hover:bg-white/[0.06] hover:text-white active:scale-95"
              aria-label={label}
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </nav>

        {/* Desktop center nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {[
            { icon: TrendingUp, label: "Market", active: true },
            { icon: Shield, label: "Vault" },
            { icon: BarChart2, label: "Portfolio" },
          ].map(({ icon: Icon, label, active }) => (
            <button
              type="button"
              key={label}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                active
                  ? "bg-white/[0.07] text-white"
                  : "text-white/40 hover:text-white/70"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            className="hidden items-center gap-1.5 rounded-md px-3 py-1.5 text-xs text-white/40 hover:text-white/70 transition-colors md:flex"
          >
            <Bell className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            className="hidden items-center gap-1.5 rounded-md px-3 py-1.5 text-xs text-white/40 hover:text-white/70 transition-colors md:flex"
          >
            <Settings className="h-3.5 w-3.5" />
          </button>
          <div className="h-5 w-px bg-white/10 hidden md:block" />
          <button
            type="button"
            className="flex min-h-[2.75rem] items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs font-medium text-white/70 hover:border-gold/20 hover:text-white transition-all sm:gap-2 sm:px-3"
          >
            <span className="h-5 w-5 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-[10px] font-bold text-gold">
              ET
            </span>
            <span className="hidden sm:block">Demo Account</span>
            <ChevronDown className="h-3 w-3 text-white/30" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(
          inter.variable,
          spaceGrotesk.variable,
          jetbrainsMono.variable,
          "min-h-screen bg-[#080812] font-sans antialiased"
        )}
      >
        <NavBar />
        {children}
      </body>
    </html>
  );
}
