import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Card, PanelHeader } from "./ui/Card";
import type { OrderRequest, OrderResponse, OrderType } from "../services/api";

interface OrderTicketProps {
  /** Wired to usePlatform().submitOrder — POSTs then refreshes everything. */
  onSubmit: (order: OrderRequest) => Promise<OrderResponse>;
  defaultSymbol?: string;
}

type Status =
  | { kind: "idle" }
  | { kind: "sending"; side: "BUY" | "SELL" }
  | { kind: "ok"; text: string }
  | { kind: "err"; text: string };

const INPUT =
  "w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition-colors focus:border-zinc-600 disabled:opacity-50";
const LABEL = "text-[11px] uppercase tracking-[0.08em] text-zinc-500";

export default function OrderTicket({
  onSubmit,
  defaultSymbol = "AAPL",
}: OrderTicketProps) {
  const [symbol, setSymbol] = useState(defaultSymbol);
  const [type, setType] = useState<OrderType>("MARKET");
  const [quantity, setQuantity] = useState("100");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const sending = status.kind === "sending";

  async function send(side: "BUY" | "SELL") {
    const qty = Number(quantity);
    const px = type === "LIMIT" ? Number(price) : 0;

    if (!symbol.trim()) return setStatus({ kind: "err", text: "Symbol required." });
    if (!Number.isFinite(qty) || qty <= 0)
      return setStatus({ kind: "err", text: "Quantity must be positive." });
    if (type === "LIMIT" && (!Number.isFinite(px) || px <= 0))
      return setStatus({ kind: "err", text: "Limit price required." });

    setStatus({ kind: "sending", side });
    try {
      const res = await onSubmit({
        symbol: symbol.trim().toUpperCase(),
        side,
        type,
        quantity: qty,
        price: px,
      });
      if (res.success) {
        const fills = res.tradesExecuted ?? 0;
        setStatus({
          kind: "ok",
          text: `${side} ${qty} ${symbol.toUpperCase()} · ${fills} fill${fills === 1 ? "" : "s"}`,
        });
      } else {
        setStatus({ kind: "err", text: res.message ?? "Order rejected." });
      }
    } catch (e) {
      setStatus({
        kind: "err",
        text: e instanceof Error ? e.message : "Order failed.",
      });
    }
  }

  return (
    <Card>
      <PanelHeader title="Order Ticket" sub="Route to the matching engine" />

      <div className="mt-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={LABEL}>Symbol</label>
            <input
              className={`nums mt-1.5 ${INPUT}`}
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              disabled={sending}
              spellCheck={false}
            />
          </div>
          <div>
            <label className={LABEL}>Quantity</label>
            <input
              className={`nums mt-1.5 ${INPUT}`}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value.replace(/[^0-9.]/g, ""))}
              inputMode="numeric"
              disabled={sending}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={LABEL}>Type</label>
            <div className="mt-1.5 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-zinc-800 bg-zinc-800">
              {(["MARKET", "LIMIT"] as OrderType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  disabled={sending}
                  className={`px-3 py-2 text-xs font-semibold transition-colors ${
                    type === t
                      ? "bg-zinc-900 text-zinc-100"
                      : "bg-zinc-900/40 text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className={LABEL}>Limit Price</label>
            <input
              className={`nums mt-1.5 ${INPUT}`}
              value={type === "LIMIT" ? price : ""}
              onChange={(e) => setPrice(e.target.value.replace(/[^0-9.]/g, ""))}
              placeholder={type === "MARKET" ? "—" : "0.00"}
              inputMode="decimal"
              disabled={sending || type === "MARKET"}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={() => send("BUY")}
            disabled={sending}
            className="flex items-center justify-center gap-2 rounded-lg bg-emerald-500/15 py-2.5 text-sm font-semibold text-emerald-300 ring-1 ring-inset ring-emerald-400/20 transition-colors hover:bg-emerald-500/25 disabled:opacity-50"
          >
            {sending && status.side === "BUY" && (
              <Loader2 size={14} className="animate-spin" />
            )}
            Buy
          </button>
          <button
            type="button"
            onClick={() => send("SELL")}
            disabled={sending}
            className="flex items-center justify-center gap-2 rounded-lg bg-rose-500/15 py-2.5 text-sm font-semibold text-rose-300 ring-1 ring-inset ring-rose-400/20 transition-colors hover:bg-rose-500/25 disabled:opacity-50"
          >
            {sending && status.side === "SELL" && (
              <Loader2 size={14} className="animate-spin" />
            )}
            Sell
          </button>
        </div>

        {status.kind === "ok" && (
          <p className="nums text-xs text-emerald-300">{status.text}</p>
        )}
        {status.kind === "err" && (
          <p className="text-xs text-rose-300">{status.text}</p>
        )}
      </div>
    </Card>
  );
}
