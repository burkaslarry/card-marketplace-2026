import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: "#D4A017",
        "gold-light": "#F5C518",
        "gold-dim": "#A07A10",
        surface: "#0E0E1A",
        "surface-2": "#12121E",
        "surface-3": "#1A1A2A",
        border: "#1E1E30",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      animation: {
        ticker: "ticker 55s linear infinite",
        "ticker-slow": "ticker 80s linear infinite",
        "pulse-gold": "pulse-gold 2s ease-in-out infinite",
        "scan-line": "scan-line 2s linear infinite",
        "fade-in-up": "fade-in-up 0.5s ease-out forwards",
        "scale-in": "scale-in 0.3s ease-out forwards",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "pulse-gold": {
          "0%, 100%": { opacity: "1", boxShadow: "0 0 0 0 rgba(212,160,23,0)" },
          "50%": { opacity: "0.85", boxShadow: "0 0 20px 4px rgba(212,160,23,0.15)" },
        },
        "scan-line": {
          "0%": { top: "0%", opacity: "1" },
          "100%": { top: "100%", opacity: "0.2" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.92)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(212,160,23,0)" },
          "50%": { boxShadow: "0 0 40px 8px rgba(212,160,23,0.08)" },
        },
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #D4A017 0%, #F5C518 50%, #A07A10 100%)",
        "dark-gradient": "linear-gradient(180deg, #080812 0%, #0E0E1A 100%)",
        "card-shine": "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%, rgba(255,255,255,0.02) 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
