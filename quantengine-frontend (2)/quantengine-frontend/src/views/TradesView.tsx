import type { PlatformData } from "../types";
import TradeBlotter from "../components/TradeBlotter";
import { Card, PanelHeader } from "../components/ui/Card";
import { price as fmtPrice, count, signedMoney, signedPct, toneClass } from "../lib/format";

export default function TradesView({ data }: { data: PlatformData }) {
  const ct = data.completedTrades;
  const wins = ct.filter((t) => t.pnl > 0).length;
  const winRate = ct.length ? (wins / ct.length) * 100 : 0;
  const total = ct.reduce((a, t) => a + t.pnl, 0);

  const d = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-800 sm:grid-cols-4">
        {[
          { l: "Closed Trades", v: `${ct.length}`, c: "text-zinc-100" },
          { l: "Win Rate", v: `${winRate.toFixed(1)}%`, c: "text-zinc-100" },
          { l: "Net PnL", v: signedMoney(total), c: toneClass(total) },
          { l: "Open Fills", v: `${data.trades.length}`, c: "text-zinc-100" },
        ].map((s) => (
          <div key={s.l} className="bg-zinc-900 px-4 py-4">
            <div className="text-[11px] uppercase tracking-[0.08em] text-zinc-500">{s.l}</div>
            <div className={`nums mt-1.5 text-xl font-semibold tracking-tight ${s.c}`}>{s.v}</div>
          </div>
        ))}
      </div>

      <Card pad={false}>
        <div className="border-b border-zinc-800 px-5 py-4">
          <PanelHeader title="Completed Trades" sub="Round-trips from getCompletedTrades()" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-[0.08em] text-zinc-500">
                <th className="px-5 py-3 font-medium">Symbol</th>
                <th className="px-5 py-3 font-medium">Dir</th>
                <th className="px-5 py-3 font-medium">Entry</th>
                <th className="px-5 py-3 font-medium">Exit</th>
                <th className="px-5 py-3 text-right font-medium">Qty</th>
                <th className="px-5 py-3 text-right font-medium">Entry Px</th>
                <th className="px-5 py-3 text-right font-medium">Exit Px</th>
                <th className="px-5 py-3 text-right font-medium">Return</th>
                <th className="px-5 py-3 text-right font-medium">PnL</th>
              </tr>
            </thead>
            <tbody>
              {ct.map((t) => (
                <tr key={t.id} className="border-t border-zinc-800/70 transition-colors duration-300 hover:bg-zinc-800/40">
                  <td className="px-5 py-3.5 font-semibold tracking-tight text-zinc-100">{t.symbol}</td>
                  <td className="px-5 py-3.5"><span className="rounded-md bg-zinc-700/40 px-1.5 py-0.5 text-[11px] font-semibold text-zinc-300">{t.direction}</span></td>
                  <td className="nums px-5 py-3.5 text-zinc-400">{d(t.entryTime)}</td>
                  <td className="nums px-5 py-3.5 text-zinc-400">{d(t.exitTime)}</td>
                  <td className="nums px-5 py-3.5 text-right text-zinc-300">{count(t.quantity)}</td>
                  <td className="nums px-5 py-3.5 text-right text-zinc-300">{fmtPrice(t.entryPrice)}</td>
                  <td className="nums px-5 py-3.5 text-right text-zinc-100">{fmtPrice(t.exitPrice)}</td>
                  <td className={`nums px-5 py-3.5 text-right ${toneClass(t.returnPct)}`}>{signedPct(t.returnPct)}</td>
                  <td className={`nums px-5 py-3.5 text-right font-medium ${toneClass(t.pnl)}`}>{signedMoney(t.pnl)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <TradeBlotter trades={data.trades} />
    </div>
  );
}
