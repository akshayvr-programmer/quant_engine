import { Building2, CheckCircle2, CircleSlash } from "lucide-react";
import type { PlatformData, OrderEventType } from "../types";
import type { OrderRequest, OrderResponse } from "../services/api";
import PositionsTable from "../components/PositionsTable";
import OrderTicket from "../components/OrderTicket";
import { Card, PanelHeader } from "../components/ui/Card";
import { money, count, price as fmtPrice, clockTime, signedMoney, toneClass } from "../lib/format";

const EVENT_CLS: Record<OrderEventType, string> = {
  NEW: "bg-zinc-700/40 text-zinc-300",
  FILL: "bg-emerald-300/10 text-emerald-300",
  PARTIAL: "bg-amber-300/10 text-amber-300",
  CANCEL: "bg-rose-300/10 text-rose-300",
};

export default function BrokerView({
  data,
  onSubmitOrder,
}: {
  data: PlatformData;
  onSubmitOrder: (order: OrderRequest) => Promise<OrderResponse>;
}) {
  const b = data.broker;
  return (
    <div className="space-y-5">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950">
              <Building2 size={22} strokeWidth={1.75} className="text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold tracking-tight text-zinc-100">{b.name}</span>
                <span className="rounded-md bg-zinc-700/40 px-1.5 py-0.5 text-[11px] font-semibold text-zinc-300">{b.mode}</span>
              </div>
              <div className="mt-0.5 flex items-center gap-1.5 text-xs">
                {b.connected ? (
                  <><CheckCircle2 size={13} className="text-emerald-300" /><span className="text-emerald-300">Connected</span></>
                ) : (
                  <><CircleSlash size={13} className="text-rose-300" /><span className="text-rose-300">Disconnected</span></>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-zinc-800 bg-zinc-800 sm:grid-cols-3 lg:grid-cols-5">
          {[
            { l: "Buying Power", v: money(b.buyingPower), c: "text-zinc-100" },
            { l: "Cash", v: money(b.cash), c: "text-zinc-100" },
            { l: "Exposure", v: money(b.exposure), c: "text-zinc-100" },
            { l: "Realized PnL", v: signedMoney(b.realizedPnl), c: toneClass(b.realizedPnl) },
            { l: "Unrealized PnL", v: signedMoney(b.unrealizedPnl), c: toneClass(b.unrealizedPnl) },
          ].map((s) => (
            <div key={s.l} className="bg-zinc-900 px-4 py-4">
              <div className="text-[11px] uppercase tracking-[0.08em] text-zinc-500">{s.l}</div>
              <div className={`nums mt-1.5 text-xl font-semibold tracking-tight ${s.c}`}>{s.v}</div>
            </div>
          ))}
        </div>
      </Card>

      <OrderTicket onSubmit={onSubmitOrder} />

      <Card pad={false}>
        <div className="border-b border-zinc-800 px-5 py-4">
          <PanelHeader title="Open Orders" sub="Working orders at the broker" />
        </div>
        {b.openOrders.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-zinc-500">No working orders.</div>
        ) : (
          <div className="divide-y divide-zinc-800/70">
            {b.openOrders.map((e) => (
              <div key={e.id} className="flex items-center gap-3 px-5 py-3 text-sm">
                <span className="nums w-20 text-zinc-500">{clockTime(e.time)}</span>
                <span className={`rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${EVENT_CLS[e.type]}`}>{e.type}</span>
                <span className="nums w-16 text-zinc-500">{e.orderId}</span>
                <span className="font-semibold text-zinc-200">{e.symbol}</span>
                <span className={e.side === "BUY" ? "text-emerald-300" : "text-rose-300"}>{e.side}</span>
                <span className="nums ml-auto text-zinc-400">{count(e.size)} @ {fmtPrice(e.price)}</span>
              </div>
            ))}
          </div>
        )}
      </Card>

      <PositionsTable positions={data.positions} />
    </div>
  );
}
