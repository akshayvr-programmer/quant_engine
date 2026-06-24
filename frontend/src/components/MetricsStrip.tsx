import { TrendingUp, Waves, Zap } from "lucide-react";
import type { PerformanceMetrics, RegimeState } from "../types";
import { signedMoney, ratioPct, num2, toneClass, count } from "../lib/format";

export function MetricsStrip({ m }: { m: PerformanceMetrics }) {
  const items: { label: string; value: string; cls?: string }[] = [
    { label: "Sharpe", value: num2(m.sharpeRatio), cls: m.sharpeRatio >= 1 ? "text-emerald-300" : "text-zinc-100" },
    { label: "Win Rate", value: ratioPct(m.winRate) },
    { label: "Profit Factor", value: num2(m.profitFactor), cls: m.profitFactor >= 1 ? "text-emerald-300" : "text-rose-300" },
    { label: "Max Drawdown", value: `${m.maxDrawdown.toFixed(1)}%`, cls: "text-rose-300" },
    { label: "Total PnL", value: signedMoney(m.totalPnl), cls: toneClass(m.totalPnl) },
    { label: "Trades", value: count(m.totalTrades) },
  ];
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-800 sm:grid-cols-3 lg:grid-cols-6">
      {items.map((it) => (
        <div key={it.label} className="bg-zinc-900 px-4 py-4">
          <div className="text-[11px] uppercase tracking-[0.08em] text-zinc-500">{it.label}</div>
          <div className={`nums mt-1.5 text-xl font-semibold tracking-tight ${it.cls ?? "text-zinc-100"}`}>{it.value}</div>
        </div>
      ))}
    </div>
  );
}

const REGIME_META = {
  TRENDING: { icon: TrendingUp, text: "text-emerald-300", bg: "bg-emerald-300/10", ring: "ring-emerald-300/20", label: "Trending" },
  MEAN_REVERTING: { icon: Waves, text: "text-amber-300", bg: "bg-amber-300/10", ring: "ring-amber-300/20", label: "Mean Reverting" },
  VOLATILE: { icon: Zap, text: "text-rose-300", bg: "bg-rose-300/10", ring: "ring-rose-300/20", label: "Volatile" },
} as const;

export function RegimeBadge({ r }: { r: RegimeState }) {
  const meta = REGIME_META[r.regime];
  const Icon = meta.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold ring-1 ${meta.bg} ${meta.text} ${meta.ring}`}>
      <Icon size={14} strokeWidth={2} />
      {meta.label}
    </span>
  );
}
