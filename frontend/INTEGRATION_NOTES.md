# QuantEngine frontend — engine integration

Drop-in `frontend/`. The React UI now reads/writes the C++ engine's REST API.
No backend changes, no UI redesign.

## Run
1. Start the C++ engine (REST on http://localhost:8080).
2. `npm install`
3. `npm run dev`  → http://localhost:5173
   The Vite dev proxy (vite.config.ts) forwards /account, /positions, /trades,
   /book, /order, /seed to :8080 — relative paths, no CORS.
4. Seed a two-sided book so depth shows, e.g.
   POST /seed {"symbol":"AAPL","side":"SELL","type":"LIMIT","quantity":500,"price":100}
5. Broker tab → place an order → account, positions, trades and the book all
   refresh automatically (no page reload).

Deployed backend instead of localhost? Set VITE_API_BASE to its URL; the proxy
rules then go unused.

## What changed
New:      src/services/api.ts (typed REST client), src/services/adapters.ts
          (DTO → domain mappers), src/components/OrderTicket.tsx (Buy/Sell).
Modified: src/data/usePlatform.ts (polls the 4 GETs, overlays live data on mock,
          exposes refresh + submitOrder + loading/error), src/views/BrokerView.tsx
          (account card → /account fields, renders the ticket),
          src/views/OrderBookView.tsx (guards an empty/one-sided book),
          src/types.ts + src/data/mockData.ts (BrokerAccount gains exposure /
          realizedPnl / unrealizedPnl), src/App.tsx, src/components/Sidebar.tsx,
          vite.config.ts (dev proxy).

## Reconstructed files
Your repo doesn't commit package.json / tsconfig.json / lockfile (only
node_modules + dist are gitignored), so this bundle includes a freshly built,
verified set (npm run build passes). If you already have your own versions
locally, keep yours — only the src/* and vite.config.ts changes are essential.
The dead, unused src/data/useDashboard.ts was removed (it didn't compile).
