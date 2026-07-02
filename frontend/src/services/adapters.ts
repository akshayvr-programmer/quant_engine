// Translation layer: backend wire DTOs -> frontend domain types.
//
// The engine sends only what it stores. Fields the UI shows but the backend
// doesn't emit (a position's mark, the book's spread/microprice, ISO
// timestamps, stable row ids) are DERIVED here from what's available, so the
// rest of the app keeps consuming the same domain types it always has.
//
// Pure functions, no side effects — easy to reason about and to unit test.

import type {
  AccountSummary,
  BrokerAccount,
  OrderBookSnapshot,
  Position,
  Trade,
} from "../types";
import type {
  AccountDto,
  BookDto,
  PositionDto,
  TradeDto,
} from "./api";

export function toAccountSummary(a: AccountDto): AccountSummary {
  const netLiquidationValue = a.cash + a.exposure;
  const todayPnl = a.realizedPnL + a.unrealizedPnL;
  const base = netLiquidationValue - todayPnl;
  return {
    cash: a.cash,
    exposure: a.exposure,
    netLiquidationValue,
    todayPnl,
    todayPnlPct: base !== 0 ? (todayPnl / base) * 100 : 0,
    exposurePct:
      netLiquidationValue !== 0 ? (a.exposure / netLiquidationValue) * 100 : 0,
  };
}

/** Merge real account numbers onto the mock broker shell (mode/name/etc.). */
export function toBroker(a: AccountDto, base: BrokerAccount): BrokerAccount {
  return {
    ...base,
    connected: true,
    mode: "PAPER",
    buyingPower: a.buyingPower,
    cash: a.cash,
    equity: a.cash + a.exposure,
    exposure: a.exposure,
    realizedPnl: a.realizedPnL,
    unrealizedPnl: a.unrealizedPnL,
    // The backend exposes no working-orders endpoint, so show none rather
    // than inventing any.
    openOrders: [],
  };
}

export function toPositions(rows: PositionDto[]): Position[] {
  return rows.map((p) => ({
    symbol: p.symbol,
    quantity: p.quantity,
    avgCost: p.averageCost,
    // No live mark on the wire — back it out of unrealized PnL when we can,
    // otherwise fall back to cost.
    marketPrice:
      p.quantity !== 0
        ? p.averageCost + p.unrealizedPnL / p.quantity
        : p.averageCost,
    unrealizedPnl: p.unrealizedPnL,
    realizedPnl: p.realizedPnL,
  }));
}

/** Newest first, with a stable id synthesised from the fill itself. */
export function toTrades(rows: TradeDto[]): Trade[] {
  return rows
    .map((t, i) => ({
      id: `${t.timestamp}-${t.symbol}-${i}`,
      time: new Date(t.timestamp).toISOString(),
      symbol: t.symbol,
      side: t.side,
      quantity: t.quantity,
      price: t.price,
    }))
    .sort((a, b) => +new Date(b.time) - +new Date(a.time));
}

export function toOrderBook(
  symbol: string,
  book: BookDto,
  lastTradePrice?: number,
): OrderBookSnapshot {
  const bids = [...book.bids]
    .map((l) => ({ price: l.price, size: l.quantity }))
    .sort((a, b) => b.price - a.price); // best (highest) first
  const asks = [...book.asks]
    .map((l) => ({ price: l.price, size: l.quantity }))
    .sort((a, b) => a.price - b.price); // best (lowest) first

  const bestBid = bids[0];
  const bestAsk = asks[0];

  const spread =
    bestBid && bestAsk ? bestAsk.price - bestBid.price : 0;

  // Size-weighted mid (standard microprice); falls back gracefully when the
  // book is one-sided or empty.
  let microprice = lastTradePrice ?? 0;
  if (bestBid && bestAsk) {
    const denom = bestBid.size + bestAsk.size;
    microprice =
      denom > 0
        ? (bestBid.price * bestAsk.size + bestAsk.price * bestBid.size) / denom
        : (bestBid.price + bestAsk.price) / 2;
  } else if (bestBid) {
    microprice = bestBid.price;
  } else if (bestAsk) {
    microprice = bestAsk.price;
  }

  const lastPrice =
    lastTradePrice ??
    (bestBid && bestAsk
      ? (bestBid.price + bestAsk.price) / 2
      : (bestBid?.price ?? bestAsk?.price ?? 0));

  return { symbol, bids, asks, lastPrice, spread, microprice };
}
