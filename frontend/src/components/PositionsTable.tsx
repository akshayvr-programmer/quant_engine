import type { Position } from "../types";
import { count, price, signedMoney, toneClass } from "../lib/format";

interface PositionsTableProps {
  positions: Position[];
}

export default function PositionsTable({ positions }: PositionsTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
      <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
        <h2 className="text-sm font-semibold text-zinc-100">Positions</h2>
        <span className="text-xs text-zinc-500">{positions.length} open</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-[0.08em] text-zinc-500">
              <th className="px-5 py-3 font-medium">Symbol</th>
              <th className="px-5 py-3 text-right font-medium">Qty</th>
              <th className="px-5 py-3 text-right font-medium">Avg Cost</th>
              <th className="px-5 py-3 text-right font-medium">Market</th>
              <th className="px-5 py-3 text-right font-medium">Unrealized</th>
              <th className="px-5 py-3 text-right font-medium">Realized</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((p) => (
              <tr
                key={p.symbol}
                className="border-t border-zinc-800/70 transition-colors duration-300 ease-calm hover:bg-zinc-800/40"
              >
                <td className="px-5 py-3.5">
                  <span className="font-semibold tracking-tight text-zinc-100">
                    {p.symbol}
                  </span>
                </td>
                <td className="nums px-5 py-3.5 text-right text-zinc-300">
                  {count(p.quantity)}
                </td>
                <td className="nums px-5 py-3.5 text-right text-zinc-300">
                  {price(p.avgCost)}
                </td>
                <td className="nums px-5 py-3.5 text-right text-zinc-100">
                  {price(p.marketPrice)}
                </td>
                <td className={`nums px-5 py-3.5 text-right font-medium ${toneClass(p.unrealizedPnl)}`}>
                  {signedMoney(p.unrealizedPnl)}
                </td>
                <td className={`nums px-5 py-3.5 text-right font-medium ${toneClass(p.realizedPnl)}`}>
                  {signedMoney(p.realizedPnl)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
