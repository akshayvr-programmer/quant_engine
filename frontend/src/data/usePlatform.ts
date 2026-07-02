import { useCallback, useEffect, useRef, useState } from "react";
import type { PlatformData } from "../types";
import { platformData as mock } from "./mockData";
import { api, type OrderRequest, type OrderResponse } from "../services/api";
import {
  toAccountSummary,
  toBroker,
  toOrderBook,
  toPositions,
  toTrades,
} from "../services/adapters";

/** The book the order-entry / depth views trade against. */
const SYMBOL = "AAPL";

export interface UsePlatform {
  data: PlatformData;
  /** Engine reachable on the last poll. */
  live: boolean;
  /** True only until the first poll resolves. */
  loading: boolean;
  /** Last connection error, or null when healthy. */
  error: string | null;
  /** Re-pull every endpoint now. */
  refresh: () => Promise<void>;
  /** POST an order, then refresh account/positions/trades/book. */
  submitOrder: (order: OrderRequest) => Promise<OrderResponse>;
}

/**
 * Polls the C++ engine's REST endpoints (/account, /positions, /trades,
 * /book/SYMBOL) and overlays the live slices onto the mock payload. Subsystems
 * the backend doesn't expose yet (signals, strategies, regime, risk, equity
 * curve) keep their mock data, so every view stays complete while the wiring
 * grows. Slices that fail a given cycle keep their last good value rather than
 * snapping back to mock.
 */
export function usePlatform(pollMs = 2000): UsePlatform {
  const [data, setData] = useState<PlatformData>(mock);
  const [live, setLive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const alive = useRef(true);

  const load = useCallback(async () => {
    const [accR, posR, trR, bkR] = await Promise.allSettled([
      api.getAccount(),
      api.getPositions(),
      api.getTrades(),
      api.getBook(SYMBOL),
    ]);
    if (!alive.current) return;

    const results = [accR, posR, trR, bkR];
    const anyOk = results.some((r) => r.status === "fulfilled");

    setData((prev) => {
      const next: PlatformData = { ...prev };
      if (accR.status === "fulfilled") {
        next.account = toAccountSummary(accR.value);
        next.broker = toBroker(accR.value, prev.broker);
      }
      if (posR.status === "fulfilled") {
        next.positions = toPositions(posR.value);
      }
      let lastPx: number | undefined;
      if (trR.status === "fulfilled") {
        next.trades = toTrades(trR.value);
        lastPx = next.trades[0]?.price;
      }
      if (bkR.status === "fulfilled") {
        next.orderbook = toOrderBook(
          SYMBOL,
          bkR.value,
          lastPx ?? prev.orderbook.lastPrice,
        );
      }
      return next;
    });

    setLive(anyOk);
    setLoading(false);
    if (anyOk) {
      setError(null);
    } else {
      const firstErr = results.find(
        (r) => r.status === "rejected",
      ) as PromiseRejectedResult | undefined;
      const reason = firstErr?.reason;
      setError(reason instanceof Error ? reason.message : "Cannot reach engine");
    }
  }, []);

  const submitOrder = useCallback(
    async (order: OrderRequest): Promise<OrderResponse> => {
      const res = await api.placeOrder(order);
      await load(); // refresh every endpoint after a fill — no page reload
      return res;
    },
    [load],
  );

  useEffect(() => {
    alive.current = true;
    void load();
    const id = setInterval(() => void load(), pollMs);
    return () => {
      alive.current = false;
      clearInterval(id);
    };
  }, [load, pollMs]);

  return { data, live, loading, error, refresh: load, submitOrder };
}
