// Domain types for QuantEngine. These mirror the shape we expect the C++
// engine to emit over the websocket/REST layer, so swapping mock data for
// live data later is a matter of pointing the fetch at the real endpoint.

export type Side = "BUY" | "SELL";

export type RiskStatus = "APPROVED" | "WARNING" | "BREACHED";

export interface AccountSummary {
  cash: number;
  todayPnl: number;
  exposure: number;
  /** Day-over-day deltas, used for the quiet sub-labels on the stat cards. */
  todayPnlPct: number;
  exposurePct: number;
}

export interface EquityPoint {
  /** ISO date string, e.g. "2026-06-24". */
  date: string;
  /** Net asset value at the close of that session. */
  nav: number;
}

export interface Position {
  symbol: string;
  quantity: number;
  avgCost: number;
  marketPrice: number;
  unrealizedPnl: number;
  realizedPnl: number;
}

export interface Trade {
  id: string;
  /** ISO timestamp. */
  time: string;
  symbol: string;
  side: Side;
  quantity: number;
  price: number;
}

export interface RiskMetrics {
  status: RiskStatus;
  exposure: number;
  dailyLoss: number;
  /** Maximum allowed position size, in shares. */
  positionLimit: number;
}

export interface DashboardData {
  account: AccountSummary;
  equityCurve: EquityPoint[];
  positions: Position[];
  trades: Trade[];
  risk: RiskMetrics;
}
