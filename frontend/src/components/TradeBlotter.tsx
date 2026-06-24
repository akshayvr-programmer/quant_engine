import type { Trade } from "../types";
import { clockTime, count, price } from "../lib/format";

interface TradeBlotterProps {
  trades: Trade[];
}

function SidePill({ side }: { side: Trade["side"] }) {
  const isBuy = side === "BUY";
  return (
    <span
      className={[
        "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold tracking-wide",
        isBuy
          ? "bg-emerald-300/10 text-emerald-300"
          : "bg-rose-300/10 text-rose-300",
      ].join(" ")}
    >
      {side}
    </span>
  );
}

export default function TradeBlotter({ trades }: TradeBlotterProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
      <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
        <h2 className="text-sm font-semibold text-zinc-100">Trade Blotter</h2>
        <span className="text-xs text-zinc-500">Today</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-[0.08em] text-zinc-500">
              <th className="py-3 pl-5 pr-5 font-medium">Time</th>
              <th className="px-5 py-3 font-medium">Symbol</th>
              <th className="px-5 py-3 font-medium">Side</th>
              <th className="px-5 py-3 text-right font-medium">Qty</th>
              <th className="px-5 py-3 text-right font-medium">Price</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((t) => {
              const accent = t.side === "BUY" ? "bg-emerald-300/70" : "bg-rose-300/70";
              return (
                <tr
                  key={t.id}
                  className="group border-t border-zinc-800/70 transition-colors duration-300 ease-calm hover:bg-zinc-800/40"
                >
                  <td className="relative py-3.5 pl-5 pr-5">
                    {/* Quiet left accent encodes side without shouting. */}
                    <span
                      className={`absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r ${accent} opacity-70 transition-opacity duration-300 group-hover:opacity-100`}
                    />
                    <span className="nums text-zinc-400">{clockTime(t.time)}</span>
                  </td>
                  <td className="px-5 py-3.5 font-semibold tracking-tight text-zinc-100">
                    {t.symbol}
                  </td>
                  <td className="px-5 py-3.5">
                    <SidePill side={t.side} />
                  </td>
                  <td className="nums px-5 py-3.5 text-right text-zinc-300">
                    {count(t.quantity)}
                  </td>
                  <td className="nums px-5 py-3.5 text-right text-zinc-100">
                    {price(t.price)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
