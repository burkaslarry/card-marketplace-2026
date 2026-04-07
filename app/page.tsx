import { MarketPulse } from "@/components/market-pulse";
import { RSAUploadPortal } from "@/components/rsa-upload-portal";
import { VaultCardGrid } from "@/components/vault-card-grid";
import { GradingAssistant } from "@/components/grading-assistant";
import { ArrowRight, Layers, Globe, Lock } from "lucide-react";

function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#080812]">
      {/* CTA Strip */}
      <div className="border-b border-white/[0.06] bg-[#0A0A14]">
        <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 sm:py-10">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              {
                icon: Layers,
                title: "Professional Grading",
                desc: "Submit to PSA, BGS or CGC directly from the platform. Bulk discounts for shops.",
                cta: "Start Grading",
                color: "text-blue-400",
                bg: "bg-blue-500/10 border-blue-500/20",
              },
              {
                icon: Lock,
                title: "Secure Checkout",
                desc: "USDT settlements with escrow protection. Funds held until card is authenticated.",
                cta: "Learn About Escrow",
                color: "text-gold",
                bg: "bg-gold/10 border-gold/20",
              },
              {
                icon: Globe,
                title: "Cross-Border Settlement",
                desc: "Trade across SG, HK, JP, UAE, UK & EU with multi-currency USDT settlement.",
                cta: "View Supported Regions",
                color: "text-emerald-400",
                bg: "bg-emerald-500/10 border-emerald-500/20",
              },
            ].map(({ icon: Icon, title, desc, cta, color, bg }) => (
              <div
                key={title}
                className={`flex flex-col gap-3 rounded-xl border p-5 ${bg} transition-all hover:scale-[1.01]`}
              >
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg border ${bg}`}>
                  <Icon className={`h-4 w-4 ${color}`} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-white/50">{desc}</p>
                </div>
                <button
                  className={`mt-auto flex items-center gap-1 text-xs font-semibold ${color} hover:gap-2 transition-all`}
                >
                  {cta}
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mx-auto max-w-screen-2xl px-4 py-5 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
          <span className="text-xs text-white/25">
            © 2026 Elite Trader Platform. Premium card infrastructure for serious collectors.
          </span>
          <div className="flex items-center gap-4 text-xs text-white/25">
            <span>v0.1.0-demo</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#080812]">
      <MarketPulse />
      <RSAUploadPortal />
      <VaultCardGrid />
      <GradingAssistant />
      <Footer />
    </main>
  );
}
