import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { CurrencyConfig } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ── Currency-aware formatters ──────────────────────────────────────────────

export const CURRENCY_CONFIGS: Record<string, CurrencyConfig> = {
  usd: { code: "usd", symbol: "$",    locale: "en-US", name: "US Dollar" },
  inr: { code: "inr", symbol: "₹",    locale: "en-IN", name: "Indian Rupee" },
  eur: { code: "eur", symbol: "€",    locale: "de-DE", name: "Euro" },
  gbp: { code: "gbp", symbol: "£",    locale: "en-GB", name: "British Pound" },
  aed: { code: "aed", symbol: "د.إ",  locale: "ar-AE", name: "UAE Dirham" },
  jpy: { code: "jpy", symbol: "¥",    locale: "ja-JP", name: "Japanese Yen" },
  sgd: { code: "sgd", symbol: "S$",   locale: "en-SG", name: "Singapore Dollar" },
};

export function formatPrice(price: number, currency = "usd"): string {
  const cfg = CURRENCY_CONFIGS[currency.toLowerCase()] ?? CURRENCY_CONFIGS.usd;
  const code = cfg.code.toUpperCase();
  if (price >= 1) {
    return new Intl.NumberFormat(cfg.locale, {
      style: "currency",
      currency: code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  }
  return new Intl.NumberFormat(cfg.locale, {
    style: "currency",
    currency: code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(price);
}

export function formatMarketCap(value: number, currency = "usd"): string {
  const cfg = CURRENCY_CONFIGS[currency.toLowerCase()] ?? CURRENCY_CONFIGS.usd;
  const sym = cfg.symbol;
  if (value >= 1e12) return `${sym}${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9)  return `${sym}${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6)  return `${sym}${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3)  return `${sym}${(value / 1e3).toFixed(2)}K`;
  return `${sym}${value.toFixed(2)}`;
}

export function formatVolume(value: number, currency = "usd"): string {
  return formatMarketCap(value, currency);
}

export function formatPercentage(value: number | null | undefined): string {
  if (value == null) return "—";
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

export function formatConfidence(value: number | null | undefined): string {
  if (value == null) return "—";
  const normalized = value <= 1 ? value * 100 : value;
  return `${Math.round(Math.min(100, Math.max(0, normalized)))}%`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatCompact(value: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function timeAgo(date: Date | string): string {
  const now = new Date();
  const then = new Date(date);
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

// ── Color helpers ──────────────────────────────────────────────────────────

export function getChangeColor(value: number | null | undefined): string {
  if (value == null) return "text-text-tertiary";
  if (value > 0) return "text-mint";
  if (value < 0) return "text-negative";
  return "text-text-tertiary";
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "text-mint";
  if (score >= 60) return "text-accent";
  if (score >= 40) return "text-warning";
  if (score >= 20) return "text-orange-400";
  return "text-negative";
}

export function getScoreBg(score: number): string {
  if (score >= 80) return "bg-mint";
  if (score >= 60) return "bg-accent";
  if (score >= 40) return "bg-warning";
  if (score >= 20) return "bg-orange-400";
  return "bg-negative";
}

export function getScoreStroke(score: number): string {
  if (score >= 80) return "#34d399";   // mint
  if (score >= 60) return "#3b82f6";   // accent blue
  if (score >= 40) return "#f59e0b";   // gold/warning
  if (score >= 20) return "#fb923c";   // orange
  return "#ef4444";                    // red
}

export function getRiskLabel(score: number): string {
  if (score <= 3) return "Low";
  if (score <= 5) return "Moderate";
  if (score <= 7) return "High";
  return "Very High";
}

export function getRiskLevelColor(level: string): string {
  switch (level?.toUpperCase()) {
    case "LOW":       return "text-mint";
    case "MODERATE":  return "text-warning";
    case "HIGH":      return "text-orange-400";
    case "VERY_HIGH": return "text-negative";
    default:          return "text-text-tertiary";
  }
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

// Truncate long text with ellipsis
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + "…";
}


