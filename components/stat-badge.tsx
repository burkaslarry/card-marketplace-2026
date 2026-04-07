import { cn } from "@/lib/utils";

type Variant = "gold" | "emerald" | "red" | "blue" | "yellow" | "ghost" | "outline";

interface StatBadgeProps {
  label: string;
  variant?: Variant;
  size?: "xs" | "sm" | "md";
  dot?: boolean;
  className?: string;
}

const variantStyles: Record<Variant, string> = {
  gold: "bg-gold/15 text-gold border-gold/30",
  emerald: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  red: "bg-red-500/15 text-red-400 border-red-500/30",
  blue: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  yellow: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  ghost: "bg-white/5 text-white/50 border-white/10",
  outline: "bg-transparent text-white/60 border-white/15",
};

const dotColors: Record<Variant, string> = {
  gold: "bg-gold",
  emerald: "bg-emerald-400",
  red: "bg-red-400",
  blue: "bg-blue-400",
  yellow: "bg-yellow-400",
  ghost: "bg-white/30",
  outline: "bg-white/30",
};

const sizeStyles = {
  xs: "px-1.5 py-0.5 text-[10px] rounded-md",
  sm: "px-2 py-0.5 text-[11px] rounded-md",
  md: "px-2.5 py-1 text-xs rounded-lg",
};

export function StatBadge({
  label,
  variant = "ghost",
  size = "sm",
  dot = false,
  className,
}: StatBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 border font-semibold tracking-wide",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {dot && (
        <span
          className={cn("h-1.5 w-1.5 rounded-full flex-shrink-0", dotColors[variant])}
        />
      )}
      {label}
    </span>
  );
}
