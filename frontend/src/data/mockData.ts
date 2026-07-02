import type {
  PlatformData,
  EquityPoint,
  SignalPoint,
  CompletedTrade,
  StrategyResult,
  OrderBookSnapshot,
  MatchFill,
  OrderEvent,
  PerformanceMetrics,
  StrategyId,
} from "../types";

// Deterministic PRNG so every reload is identical — no flicker, no "slot
// machine" feel. Same seed family throughout.
function rng(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const START = new Date("2026-02-14T00:00:00");
const dayISO = (i: number) => {
  const d = new Date(START);
  d.setDate(START.getDate() + i);
  return d.toISOString().slice(0, 10);
};
const stampISO = (i: number, h = 14, m = 0, s = 0) => {
  const d = new Date(START);
  d.setDate(START.getDate() + i);
  d.setHours(h, m, s, 0);
  return d.toISOString();
};

// --- Equity curve -----------------------------------------------------------
function buildCurve(seed: number, drift: number, sessions = 90): EquityPoint[] {
  const r = rng(seed);
  let nav = 1_000_000;
  const out: EquityPoint[] = [];
  for (let i = 0; i < sessions; i++) {
    const shock = (r() - 0.5) * 0.012;
    const regime = i > 38 && i < 52 ? -0.0022 : 0;
    nav *= 1 + drift + shock + regime;
    out.push({ date: dayISO(i), nav: Math.round(nav) });
  }
  return out;
}
const equityCurve = buildCurve(20260624, 0.0006);

// --- Signals (price + MAs + zscore + actions) -------------------------------
function buildSignals(seed: number, bars = 120): SignalPoint[] {
  const r = rng(seed);
  let price = 184;
  const prices: number[] = [];
  const out: SignalPoint[] = [];
  const shortN = 3;
  const longN = 5;
  let prevCross = 0;

  for (let i = 0; i < bars; i++) {
    price *= 1 + (r() - 0.5) * 0.018 + 0.0004;
    prices.push(price);
    const sma = (n: number) =>
      prices.slice(Math.max(0, prices.length - n)).reduce((a, b) => a + b, 0) /
      Math.min(prices.length, n);
    const shortMA = sma(shortN);
    const longMA = sma(longN);

    const window = prices.slice(Math.max(0, prices.length - 20));
    const mean = window.reduce((a, b) => a + b, 0) / window.length;
    const sd =
      Math.sqrt(
        window.reduce((a, b) => a + (b - mean) ** 2, 0) / window.length
      ) || 1;
    const zscore = (price - mean) / sd;

    const cross = Math.sign(shortMA - longMA);
    let action: SignalPoint["action"] = "HOLD";
    if (i > longN && cross !== 0 && cross !== prevCross) {
      action = cross > 0 ? "BUY" : "SELL";
      prevCross = cross;
    }

    out.push({
      t: stampISO(Math.floor(i / 4), 9 + (i % 4) * 2, (i * 7) % 60, 0),
      price: +price.toFixed(2),
      shortMA: +shortMA.toFixed(2),
      longMA: +longMA.toFixed(2),
      zscore: +zscore.toFixed(2),
      action,
    });
  }
  return out;
}
const signals = buildSignals(70077);

// --- Completed trades -------------------------------------------------------
function buildCompletedTrades(): CompletedTrade[] {
  const r = rng(424242);
  const syms = ["AAPL", "MSFT", "NVDA", "PLTR", "GOOGL"];
  const out: CompletedTrade[] = [];
  for (let i = 0; i < 18; i++) {
    const sym = syms[Math.floor(r() * syms.length)];
    const entry = 100 + r() * 350;
    const move = (r() - 0.42) * 0.06;
    const exit = entry * (1 + move);
    const qty = [25, 50, 75, 100, 150, 200][Math.floor(r() * 6)];
    const pnl = (exit - entry) * qty;
    out.push({
      id: `ct${i}`,
      symbol: sym,
      direction: "LONG",
      entryTime: stampISO(i, 10, 15, 0),
      exitTime: stampISO(i + (1 + Math.floor(r() * 3)), 13, 40, 0),
      entryPrice: +entry.toFixed(2),
      exitPrice: +exit.toFixed(2),
      quantity: qty,
      pnl: +pnl.toFixed(2),
      returnPct: +(move * 100).toFixed(2),
      bars: 1 + Math.floor(r() * 40),
    });
  }
  return out.reverse();
}
const completedTrades = buildCompletedTrades();

// --- Strategy comparison (real AAPL backtest numbers from your README) ------
const strategies: StrategyResult[] = [
  {
    id: "EMA",
    name: "Exponential MA Crossover",
    curve: buildCurve(11, 0.00075),
    metrics: { totalPnl: 50.4, winRate: 0.4, averageTradePnl: 0.63, maxDrawdown: 46.14, totalTrades: 80, sharpeRatio: 1.12, profitFactor: 1.29 },
  },
  {
    id: "SMA",
    name: "Simple MA Crossover",
    curve: buildCurve(22, 0.00018),
    metrics: { totalPnl: -10.74, winRate: 0.368, averageTradePnl: -0.08, maxDrawdown: 52.24, totalTrades: 133, sharpeRatio: 0.21, profitFactor: 0.96 },
  },
  {
    id: "ZSCORE",
    name: "Z-Score Mean Reversion",
    curve: buildCurve(33, 0.0005),
    metrics: { totalPnl: 32.6, winRate: 0.54, averageTradePnl: 0.71, maxDrawdown: 28.9, totalTrades: 46, sharpeRatio: 0.97, profitFactor: 1.41 },
  },
  {
    id: "PAIRS",
    name: "Pairs Trading (KO/PEP)",
    curve: buildCurve(44, 0.00041),
    metrics: { totalPnl: 21.3, winRate: 0.61, averageTradePnl: 0.49, maxDrawdown: 19.7, totalTrades: 35, sharpeRatio: 1.34, profitFactor: 1.58 },
  },
];

const metrics: PerformanceMetrics = strategies[0].metrics;

// --- Order book -------------------------------------------------------------
function buildOrderBook(mid = 186.12): OrderBookSnapshot {
  const r = rng(909090);
  const bids = [];
  const asks = [];
  for (let i = 0; i < 10; i++) {
    bids.push({ price: +(mid - 0.01 * (i + 1)).toFixed(2), size: Math.round(80 + r() * 900) });
    asks.push({ price: +(mid + 0.01 * (i + 1)).toFixed(2), size: Math.round(80 + r() * 900) });
  }
  const bestBid = bids[0].price;
  const bestAsk = asks[0].price;
  const spread = +(bestAsk - bestBid).toFixed(2);
  const microprice =
    +((bestBid * asks[0].size + bestAsk * bids[0].size) / (bids[0].size + asks[0].size)).toFixed(3);
  return { symbol: "AAPL", bids, asks, lastPrice: mid, spread, microprice };
}
const orderbook = buildOrderBook();

function buildMatches(): MatchFill[] {
  const r = rng(555);
  const out: MatchFill[] = [];
  for (let i = 0; i < 14; i++) {
    out.push({
      id: `m${i}`,
      time: stampISO(89, 14, 59 - i, Math.floor(r() * 60)),
      price: +(186.1 + (r() - 0.5) * 0.1).toFixed(2),
      size: Math.round(10 + r() * 300),
      side: r() > 0.5 ? "BUY" : "SELL",
    });
  }
  return out;
}
const matches = buildMatches();

const orderEvents: OrderEvent[] = [
  { id: "e1", time: stampISO(89, 14, 58, 12), orderId: "#10482", type: "FILL", symbol: "AAPL", side: "BUY", price: 186.11, size: 100 },
  { id: "e2", time: stampISO(89, 14, 56, 3), orderId: "#10481", type: "NEW", symbol: "AAPL", side: "SELL", price: 186.2, size: 150 },
  { id: "e3", time: stampISO(89, 14, 55, 41), orderId: "#10480", type: "PARTIAL", symbol: "MSFT", side: "BUY", price: 420.8, size: 25 },
  { id: "e4", time: stampISO(89, 14, 52, 9), orderId: "#10479", type: "CANCEL", symbol: "PLTR", side: "SELL", price: 23.9, size: 200 },
  { id: "e5", time: stampISO(89, 14, 50, 33), orderId: "#10478", type: "FILL", symbol: "NVDA", side: "BUY", price: 118.4, size: 30 },
];

// --- The full mock platform payload -----------------------------------------
export const platformData: PlatformData = {
  account: {
    cash: 999_432,
    todayPnl: 124,
    exposure: 12_500,
    netLiquidationValue: 1_011_932,
    todayPnlPct: 0.01,
    exposurePct: 1.25,
  },
  equityCurve,
  positions: [
    { symbol: "AAPL", quantity: 100, avgCost: 184.32, marketPrice: 186.15, unrealizedPnl: 183, realizedPnl: 42 },
    { symbol: "MSFT", quantity: 50, avgCost: 421.5, marketPrice: 420.8, unrealizedPnl: -35, realizedPnl: 95 },
    { symbol: "NVDA", quantity: 30, avgCost: 118.4, marketPrice: 121.07, unrealizedPnl: 80, realizedPnl: 0 },
    { symbol: "PLTR", quantity: 400, avgCost: 24.18, marketPrice: 23.71, unrealizedPnl: -188, realizedPnl: 64 },
    { symbol: "GOOGL", quantity: 60, avgCost: 176.05, marketPrice: 178.9, unrealizedPnl: 171, realizedPnl: -22 },
  ],
  trades: [
    { id: "t1", time: stampISO(89, 14, 32, 7), symbol: "AAPL", side: "BUY", quantity: 100, price: 184.32 },
    { id: "t2", time: stampISO(89, 14, 18, 55), symbol: "PLTR", side: "SELL", quantity: 150, price: 23.88 },
    { id: "t3", time: stampISO(89, 13, 57, 41), symbol: "NVDA", side: "BUY", quantity: 30, price: 118.4 },
    { id: "t4", time: stampISO(89, 13, 40, 12), symbol: "MSFT", side: "SELL", quantity: 25, price: 421.1 },
    { id: "t5", time: stampISO(89, 12, 11, 9), symbol: "GOOGL", side: "BUY", quantity: 60, price: 176.05 },
    { id: "t6", time: stampISO(89, 11, 48, 33), symbol: "AAPL", side: "BUY", quantity: 50, price: 183.9 },
  ],
  completedTrades,
  metrics,
  signals,
  activeStrategy: "EMA" as StrategyId,
  strategies,
  orderbook,
  matches,
  orderEvents,
  regime: { regime: "TRENDING", volatility: 0.42, momentum: 1.18 },
  risk: {
    status: "APPROVED",
    exposure: 24_300,
    dailyLoss: -43,
    positionLimit: 1000,
    reason: "All checks passed",
    limits: [
      { label: "Gross Exposure", used: 24_300, limit: 100_000, unit: "$" },
      { label: "Daily Loss", used: 43, limit: 5_000, unit: "$" },
      { label: "Largest Position", used: 400, limit: 1000, unit: "sh" },
      { label: "Cash Utilization", used: 12_500, limit: 250_000, unit: "$" },
    ],
  },
  broker: {
    name: "Paper Broker",
    connected: true,
    mode: "PAPER",
    buyingPower: 1_998_864,
    cash: 999_432,
    equity: 1_011_932,
    exposure: 12_500,
    realizedPnl: 0,
    unrealizedPnl: 124,
    openOrders: [
      { id: "o1", time: stampISO(89, 14, 56, 3), orderId: "#10481", type: "NEW", symbol: "AAPL", side: "SELL", price: 186.2, size: 150 },
      { id: "o2", time: stampISO(89, 14, 40, 18), orderId: "#10475", type: "NEW", symbol: "MSFT", side: "BUY", price: 419.5, size: 50 },
    ],
  },
};
