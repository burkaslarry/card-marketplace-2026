import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, decimals = 0): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatChange(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

export function formatUSDT(value: number): string {
  if (value >= 10000) {
    return `$${(value / 1000).toFixed(1)}K`;
  }
  return `$${formatCurrency(value)}`;
}

export function scoreToGrade(avg: number): string {
  if (avg >= 9.5) return "GEM-MT 10";
  if (avg >= 9.0) return "MINT 9";
  if (avg >= 8.0) return "NM-MT 8";
  if (avg >= 7.0) return "NM 7";
  if (avg >= 6.0) return "EX-MT 6";
  return "EX 5";
}
