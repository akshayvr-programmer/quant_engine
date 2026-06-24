// Domain types for QuantEngine. These mirror the structs the C++ engine emits
// (or will emit) over the JSON/websocket layer. The frontend renders whatever
// subset is present and falls back to mock for the rest, so the UI is complete
// from day one and lights up subsystem-by-subsystem as the exporter grows.

export type Side = "BUY" | "SELL";
export type Direction = "LONG" | "SHORT";
export type RiskStatus = "APPROVED" | "WARNING" | "BREACHED";
export type Regime = "TRENDING" | "MEAN_REVERTING" | "VOLATILE";
export type StrategyId = "SMA" | "EMA" | "ZSCORE" | "PAIRS";

export interface AccountSummary {
  cash: number;
  todayPnl: number;
  exposure: number;
  netLiquidationValue: number;
  todayPnlPct: number;
  exposurePct: number;
}

export interface EquityPoint {
  date: string;
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

/** A single fill — the trade blotter row. */
export interface Trade {
  id: string;
  time: string;
  symbol: string;
  side: Side;
  quantity: number;
  price: number;
}

/** A closed round-trip — entry + exit, from getCompletedTrades(). */
export interface CompletedTrade {
  id: string;
  symbol: string;
  direction: Direction;
  entryTime: string;
  exitTime: string;
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  pnl: number;
  returnPct: number;
  bars: number;
}

/** AnalyticsManager / MetricsCalculator output. */
export interface PerformanceMetrics {
  totalPnl: number;
  winRate: number;
  averageTradePnl: number;
  maxDrawdown: number;
  totalTrades: number;
  sharpeRatio: number;
  profitFactor: number;
}

/** One bar of an EngineSnapshot: price + strategy internals. */
export interface SignalPoint {
  t: string;
  price: number;
  shortMA: number;
  longMA: number;
  zscore: number;
  action: Side | "HOLD";
}

export interface StrategyResult {
  id: StrategyId;
  name: string;
  curve: EquityPoint[];
  metrics: PerformanceMetrics;
}

export interface OrderBookLevel {
  price: number;
  size: number;
}

export interface OrderBookSnapshot {
  symbol: string;
  bids: OrderBookLevel[]; // best first (descending price)
  asks: OrderBookLevel[]; // best first (ascending price)
  lastPrice: number;
  spread: number;
  microprice: number;
}

export interface MatchFill {
  id: string;
  time: string;
  price: number;
  size: number;
  side: Side;
}

export type OrderEventType = "NEW" | "FILL" | "PARTIAL" | "CANCEL";

export interface OrderEvent {
  id: string;
  time: string;
  orderId: string;
  type: OrderEventType;
  symbol: string;
  side: Side;
  price: number;
  size: number;
}

export interface RegimeState {
  regime: Regime;
  volatility: number;
  momentum: number;
}

export interface RiskLimit {
  label: string;
  used: number;
  limit: number;
  unit: string;
}

export interface RiskMetrics {
  status: RiskStatus;
  exposure: number;
  dailyLoss: number;
  positionLimit: number;
  limits: RiskLimit[];
  reason?: string;
}

export interface BrokerAccount {
  name: string;
  connected: boolean;
  mode: "PAPER" | "LIVE";
  buyingPower: number;
  cash: number;
  equity: number;
  openOrders: OrderEvent[];
}

/** Everything the platform can show. The hook merges fetched fields over mock. */
export interface PlatformData {
  account: AccountSummary;
  equityCurve: EquityPoint[];
  positions: Position[];
  trades: Trade[];
  completedTrades: CompletedTrade[];
  metrics: PerformanceMetrics;
  signals: SignalPoint[];
  activeStrategy: StrategyId;
  strategies: StrategyResult[];
  orderbook: OrderBookSnapshot;
  matches: MatchFill[];
  orderEvents: OrderEvent[];
  regime: RegimeState;
  risk: RiskMetrics;
  broker: BrokerAccount;
}

/** Backwards-compatible slice for the original dashboard export. */
export type DashboardData = Pick<
  PlatformData,
  "account" | "equityCurve" | "positions" | "trades" | "risk"
>;
