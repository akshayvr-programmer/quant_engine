# QuantEngine — Trading Platform Frontend

A calm, institutional front-end for the **QuantEngine** event-driven C++ trading
engine. Seven views surface the whole stack — portfolio, live strategy signals,
the matching-engine order book, backtest benchmarking, trades, risk, and broker.

Built to read like a desk tool, not a retail app: zinc/emerald/rose palette,
amber as the single accent, tabular figures, subtle motion only.

## Stack

React 18 · TypeScript · Vite · TailwindCSS · Recharts · lucide-react

## Run

    npm install
    npm run dev      # http://localhost:5173
    npm run build    # type-check + production build

## Views and what they map to in the engine

| View | Engine source |
| --- | --- |
| Overview    | PortfolioManager, EngineSnapshot[], MetricsCalculator |
| Signals     | EngineSnapshot (price/shortMA/longMA/zscore/action) |
| Order Book  | OrderBook, MatchingResult, ExecutionManager |
| Strategies  | per-strategy backtest + PerformanceMetrics |
| Trades      | getCompletedTrades(), TradeEvent |
| Risk        | RiskManager, RiskResult |
| Broker      | PaperBroker (Alpaca-ready: same shape) |

## How live data works

`src/data/usePlatform.ts` polls `/dashboard.json` (written by the engine into
`frontend/public/`) and shallow-merges it over the mock payload. Any subsystem the
exporter hasn't emitted yet keeps its mock data, so every view is complete today
and goes live field-by-field as you extend DashboardExporter. The sidebar shows
"Engine connected" once a real file is found, "Mock feed" until then.

The contract is `PlatformData` in `src/types.ts`. Emit the matching JSON keys from
C++ and the UI lights up — no frontend changes required. You already wired
account, equityCurve, positions, trades, and risk. Remaining keys to add to the
exporter: signals, completedTrades, metrics, strategies, orderbook, matches,
orderEvents, regime, broker.

## Structure

    src/
      App.tsx                Shell: sidebar + header + view switch
      types.ts               PlatformData — the engine/frontend contract
      data/mockData.ts       Seeded mock for every subsystem
      data/usePlatform.ts    Polls dashboard.json, merges over mock
      lib/format.ts          Currency / signed / tabular formatting
      components/            Sidebar, StatCard, tables, charts, ui/Card
      views/                 Overview, Signals, OrderBook, Strategies,
                             Trades, Risk, Broker
