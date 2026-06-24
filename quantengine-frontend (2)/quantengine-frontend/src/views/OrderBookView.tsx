import type { PlatformData, OrderBookLevel, OrderEventType } from "../types";
import { Card, PanelHeader } from "../components/ui/Card";
import { price as fmtPrice, count, clockTime } from "../lib/format";

function Ladder({ bids, asks }: { bids: OrderBookLevel[]; asks: OrderBookLevel[] }) {
  const max = Math.max(...bids.map((b) => b.size), ...asks.map((a) => a.size));
  const Row = ({ lvl, side }: { lvl: OrderBookLevel; side: "bid" | "ask" }) => {
    const pct = (lvl.size / max) * 100;
    const tint = side === "bid" ? "bg-emerald-300/10" : "bg-rose-300/10";
    const priceCls = side === "bid" ? "text-emerald-300" : "text-rose-300";
    return (
      <div className="relative flex items-center justify-between px-3 py-1.5 text-sm">
        <div className={`absolute inset-y-0.5 ${side === "bid" ? "right-0" : "right-0"} rounded ${tint}`} style={{ width: `${pct}%` }} />
        <span className={`nums relative z-10 font-medium ${priceCls}`}>{fmtPrice(lvl.price)}</span>
        <span className="nums relative z-10 text-zinc-400">{count(lvl.size)}</span>
      </div>
    );
  };
  return (
    <div>
      <div className="flex justify-between px-3 pb-1 text-[11px] uppercase tracking-[0.08em] text-zinc-500">
        <span>Price</span>
        <span>Size</span>
      </div>
      <div className="flex flex-col-reverse">
        {asks.map((a, i) => <Row key={`a${i}`} lvl={a} side="ask" />)}
      </div>
      <div className="my-1 flex items-center justify-between border-y border-zinc-800 px-3 py-1.5">
        <span className="text-[11px] uppercase tracking-[0.08em] text-zinc-500">Spread</span>
        <span className="nums text-sm font-semibold text-amber-300">{fmtPrice(asks[0].price - bids[0].price)}</span>
      </div>
      <div className="flex flex-col">
        {bids.map((b, i) => <Row key={`b${i}`} lvl={b} side="bid" />)}
      </div>
    </div>
  );
}

const EVENT_CLS: Record<OrderEventType, string> = {
  NEW: "bg-zinc-700/40 text-zinc-300",
  FILL: "bg-emerald-300/10 text-emerald-300",
  PARTIAL: "bg-amber-300/10 text-amber-300",
  CANCEL: "bg-rose-300/10 text-rose-300",
};

export default function OrderBookView({ data }: { data: PlatformData }) {
  const ob = data.orderbook;
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-800 sm:grid-cols-3 lg:grid-cols-5">
        {[
          { l: "Symbol", v: ob.symbol, c: "text-zinc-100" },
          { l: "Last", v: fmtPrice(ob.lastPrice), c: "text-zinc-100" },
          { l: "Spread", v: fmtPrice(ob.spread), c: "text-amber-300" },
          { l: "Microprice", v: ob.microprice.toFixed(3), c: "text-zinc-100" },
          { l: "Best Bid / Ask", v: `${fmtPrice(ob.bids[0].price)} / ${fmtPrice(ob.asks[0].price)}`, c: "text-zinc-300" },
        ].map((s) => (
          <div key={s.l} className="bg-zinc-900 px-4 py-4">
            <div className="text-[11px] uppercase tracking-[0.08em] text-zinc-500">{s.l}</div>
            <div className={`nums mt-1.5 text-base font-semibold tracking-tight ${s.c}`}>{s.v}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <PanelHeader title="Order Book" sub={`${ob.symbol} · L2 depth`} />
          <div className="mt-3">
            <Ladder bids={ob.bids} asks={ob.asks} />
          </div>
        </Card>

        <Card className="lg:col-span-2" pad={false}>
          <div className="border-b border-zinc-800 px-5 py-4">
            <PanelHeader title="Recent Matches" sub="Matching engine fills" />
          </div>
          <div className="max-h-[260px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-zinc-900">
                <tr className="text-left text-[11px] uppercase tracking-[0.08em] text-zinc-500">
                  <th className="px-5 py-2.5 font-medium">Time</th>
                  <th className="px-5 py-2.5 font-medium">Side</th>
                  <th className="px-5 py-2.5 text-right font-medium">Price</th>
                  <th className="px-5 py-2.5 text-right font-medium">Size</th>
                </tr>
              </thead>
              <tbody>
                {data.matches.map((m) => (
                  <tr key={m.id} className="border-t border-zinc-800/70 transition-colors duration-300 hover:bg-zinc-800/40">
                    <td className="nums px-5 py-2.5 text-zinc-400">{clockTime(m.time)}</td>
                    <td className="px-5 py-2.5">
                      <span className={m.side === "BUY" ? "text-emerald-300" : "text-rose-300"}>{m.side}</span>
                    </td>
                    <td className="nums px-5 py-2.5 text-right text-zinc-100">{fmtPrice(m.price)}</td>
                    <td className="nums px-5 py-2.5 text-right text-zinc-400">{count(m.size)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-y border-zinc-800 px-5 py-4">
            <PanelHeader title="Order Events" sub="Lifecycle from ExecutionManager" />
          </div>
          <div className="divide-y divide-zinc-800/70">
            {data.orderEvents.map((e) => (
              <div key={e.id} className="flex items-center gap-3 px-5 py-2.5 text-sm">
                <span className="nums w-20 text-zinc-500">{clockTime(e.time)}</span>
                <span className={`rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${EVENT_CLS[e.type]}`}>{e.type}</span>
                <span className="nums w-16 text-zinc-500">{e.orderId}</span>
                <span className="font-semibold text-zinc-200">{e.symbol}</span>
                <span className={e.side === "BUY" ? "text-emerald-300" : "text-rose-300"}>{e.side}</span>
                <span className="nums ml-auto text-zinc-400">{count(e.size)} @ {fmtPrice(e.price)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
