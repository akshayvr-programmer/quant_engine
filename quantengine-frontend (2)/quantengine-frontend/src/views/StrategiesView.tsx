import type { PlatformData } from "../types";
import StrategyCompareChart from "../components/charts/StrategyCompareChart";
import { Card, PanelHeader } from "../components/ui/Card";
import { signedMoney, ratioPct, num2, toneClass, count } from "../lib/format";

export default function StrategiesView({ data }: { data: PlatformData }) {
  const ranked = [...data.strategies].sort((a, b) => b.metrics.sharpeRatio - a.metrics.sharpeRatio);
  const best = ranked[0];

  return (
    <div className="space-y-5">
      <Card>
        <PanelHeader
          title="Strategy Benchmarking"
          sub="Normalized equity (base 100) · 5-year backtest"
          right={<span className="text-xs text-zinc-500">Best by Sharpe: <span className="font-semibold text-amber-300">{best.id}</span></span>}
        />
        <div className="mt-4">
          <StrategyCompareChart strategies={data.strategies} />
        </div>
      </Card>

      <Card pad={false}>
        <div className="border-b border-zinc-800 px-5 py-4">
          <PanelHeader title="Performance Comparison" sub="Ranked by Sharpe ratio" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-[0.08em] text-zinc-500">
                <th className="px-5 py-3 font-medium">Strategy</th>
                <th className="px-5 py-3 text-right font-medium">Sharpe</th>
                <th className="px-5 py-3 text-right font-medium">Total PnL</th>
                <th className="px-5 py-3 text-right font-medium">Win Rate</th>
                <th className="px-5 py-3 text-right font-medium">Profit Factor</th>
                <th className="px-5 py-3 text-right font-medium">Max DD</th>
                <th className="px-5 py-3 text-right font-medium">Trades</th>
              </tr>
            </thead>
            <tbody>
              {ranked.map((s, i) => (
                <tr key={s.id} className="border-t border-zinc-800/70 transition-colors duration-300 hover:bg-zinc-800/40">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      {i === 0 && <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />}
                      <span className="font-semibold tracking-tight text-zinc-100">{s.id}</span>
                      <span className="text-xs text-zinc-500">{s.name}</span>
                    </div>
                  </td>
                  <td className={`nums px-5 py-3.5 text-right font-medium ${s.metrics.sharpeRatio >= 1 ? "text-emerald-300" : "text-zinc-100"}`}>{num2(s.metrics.sharpeRatio)}</td>
                  <td className={`nums px-5 py-3.5 text-right font-medium ${toneClass(s.metrics.totalPnl)}`}>{signedMoney(s.metrics.totalPnl)}</td>
                  <td className="nums px-5 py-3.5 text-right text-zinc-300">{ratioPct(s.metrics.winRate)}</td>
                  <td className={`nums px-5 py-3.5 text-right ${s.metrics.profitFactor >= 1 ? "text-emerald-300" : "text-rose-300"}`}>{num2(s.metrics.profitFactor)}</td>
                  <td className="nums px-5 py-3.5 text-right text-rose-300">{s.metrics.maxDrawdown.toFixed(1)}%</td>
                  <td className="nums px-5 py-3.5 text-right text-zinc-400">{count(s.metrics.totalTrades)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
