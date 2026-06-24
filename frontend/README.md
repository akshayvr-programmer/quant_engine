# QuantEngine — Frontend

A calm, institutional portfolio dashboard for the **QuantEngine** event-driven
trading engine. Built to feel like a trusted co-pilot: confidence, clarity, and
control — not a slot machine.

## Stack

- React 18 + TypeScript
- Vite
- TailwindCSS
- Recharts (equity curve)
- lucide-react (icons)

## Run

```bash
npm install
npm run dev
```

Open http://localhost:5173.

```bash
npm run build    # type-check + production build
npm run preview  # serve the production build
```

## Design language

| Token          | Value         |
| -------------- | ------------- |
| Background     | `zinc-950`    |
| Cards          | `zinc-900`    |
| Borders        | `zinc-800`    |
| Positive       | `emerald-300` |
| Negative       | `rose-300`    |
| Accent         | `amber-300`   |
| Type           | Inter         |
| Card radius    | `rounded-2xl` |
| Transitions    | `duration-300`, calm easing |

Financial figures use tabular, lining numerals (`.nums`) so columns align like a
real terminal. Motion is limited to soft fades and hover transitions, and
`prefers-reduced-motion` is respected.

## Structure

```
src/
  App.tsx                 Layout: sidebar + dashboard grid
  types.ts                Domain types (the engine's expected payload shape)
  data/mockData.ts        Mock feed (seeded equity curve, positions, trades, risk)
  lib/format.ts           Currency / signed-value / time formatting + tone colours
  components/
    Sidebar.tsx           Navigation + engine status
    StatCard.tsx          Cash / Today's PnL / Exposure
    EquityCurve.tsx       NAV area chart with 1W/1M/3M/All toggle
    PositionsTable.tsx    Open positions
    TradeBlotter.tsx      Recent fills (BUY emerald / SELL rose)
    RiskWidget.tsx        Risk status + limits
```

## Wiring the real engine

Mock data lives entirely in `src/data/mockData.ts` and conforms to the
`DashboardData` type in `src/types.ts`. When the C++ engine is ready, replace the
mock import with a fetch/websocket subscription that returns the same shape:

```ts
// e.g. a hook that subscribes to the engine's websocket
const data = useEngineFeed(); // -> DashboardData
```

Nothing else in the UI needs to change — the types are the contract between the
engine and the frontend.
