import type { DashboardData, EquityPoint } from "../types";

// --- Equity curve -----------------------------------------------------------
// Deterministic so the curve is identical on every reload (no flicker, no
// "slot machine" feel). Seeded PRNG → gentle upward drift with realistic
// noise and one modest drawdown, starting near $1.00M.

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildEquityCurve(sessions = 90): EquityPoint[] {
  const rand = mulberry32(20260624);
  const start = new Date("2026-02-14T00:00:00");
  let nav = 1_000_000;
  const points: EquityPoint[] = [];

  for (let i = 0; i < sessions; i++) {
    const drift = 0.0006; // ~0.06% expected daily return
    const shock = (rand() - 0.5) * 0.012; // ±0.6% daily noise
    // A measured mid-period drawdown, then recovery.
    const regime = i > 38 && i < 52 ? -0.0022 : 0;
    nav *= 1 + drift + shock + regime;

    const d = new Date(start);
    d.setDate(start.getDate() + i);
    points.push({
      date: d.toISOString().slice(0, 10),
      nav: Math.round(nav),
    });
  }
  return points;
}

const equityCurve = buildEquityCurve();
const latestNav = equityCurve[equityCurve.length - 1].nav;

// --- Dashboard payload ------------------------------------------------------

export const dashboardData: DashboardData = {
  account: {
    cash: 999_432,
    todayPnl: 124,
    exposure: 12_500,
    todayPnlPct: 0.01,
    exposurePct: 1.25,
  },

  equityCurve,

  positions: [
    {
      symbol: "AAPL",
      quantity: 100,
      avgCost: 184.32,
      marketPrice: 186.15,
      unrealizedPnl: 183,
      realizedPnl: 42,
    },
    {
      symbol: "MSFT",
      quantity: 50,
      avgCost: 421.5,
      marketPrice: 420.8,
      unrealizedPnl: -35,
      realizedPnl: 95,
    },
    {
      symbol: "NVDA",
      quantity: 30,
      avgCost: 118.4,
      marketPrice: 121.07,
      unrealizedPnl: 80,
      realizedPnl: 0,
    },
    {
      symbol: "PLTR",
      quantity: 400,
      avgCost: 24.18,
      marketPrice: 23.71,
      unrealizedPnl: -188,
      realizedPnl: 64,
    },
    {
      symbol: "GOOGL",
      quantity: 60,
      avgCost: 176.05,
      marketPrice: 178.9,
      unrealizedPnl: 171,
      realizedPnl: -22,
    },
  ],

  trades: [
    { id: "t1", time: "2026-06-24T14:32:07", symbol: "AAPL", side: "BUY", quantity: 100, price: 184.32 },
    { id: "t2", time: "2026-06-24T14:18:55", symbol: "PLTR", side: "SELL", quantity: 150, price: 23.88 },
    { id: "t3", time: "2026-06-24T13:57:41", symbol: "NVDA", side: "BUY", quantity: 30, price: 118.4 },
    { id: "t4", time: "2026-06-24T13:40:12", symbol: "MSFT", side: "SELL", quantity: 25, price: 421.1 },
    { id: "t5", time: "2026-06-24T12:11:09", symbol: "GOOGL", side: "BUY", quantity: 60, price: 176.05 },
    { id: "t6", time: "2026-06-24T11:48:33", symbol: "AAPL", side: "BUY", quantity: 50, price: 183.9 },
    { id: "t7", time: "2026-06-24T10:22:18", symbol: "PLTR", side: "BUY", quantity: 250, price: 24.34 },
    { id: "t8", time: "2026-06-24T09:36:02", symbol: "MSFT", side: "BUY", quantity: 25, price: 421.9 },
  ],

  risk: {
    status: "APPROVED",
    exposure: 24_300,
    dailyLoss: -43,
    positionLimit: 1000,
  },
};

export { latestNav };
