import { useState } from "react";
import Sidebar, { type ViewId } from "./components/Sidebar";
import OverviewView from "./views/OverviewView";
import SignalsView from "./views/SignalsView";
import OrderBookView from "./views/OrderBookView";
import StrategiesView from "./views/StrategiesView";
import TradesView from "./views/TradesView";
import RiskView from "./views/RiskView";
import BrokerView from "./views/BrokerView";
import { RegimeBadge } from "./components/MetricsStrip";
import { usePlatform } from "./data/usePlatform";
import { compactMoney } from "./lib/format";

const TITLES: Record<ViewId, { title: string; sub: string }> = {
  overview: { title: "Overview", sub: "Portfolio command center" },
  signals: { title: "Signals", sub: "Strategy internals and entries" },
  orderbook: { title: "Order Book", sub: "Matching engine & market depth" },
  strategies: { title: "Strategies", sub: "Backtest benchmarking" },
  trades: { title: "Trades", sub: "Fills and closed round-trips" },
  risk: { title: "Risk", sub: "Pre-trade checks & limits" },
  broker: { title: "Broker", sub: "Account & order routing" },
};

export default function App() {
  const [view, setView] = useState<ViewId>("overview");
  const { data, live, loading, error, submitOrder } = usePlatform();
  const t = TITLES[view];

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950 text-zinc-100 antialiased">
      <Sidebar active={view} onSelect={setView} live={live} />

      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-950/80 px-8 py-5 backdrop-blur">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-zinc-100">{t.title}</h1>
              <p className="mt-0.5 text-[13px] text-zinc-500">{t.sub}</p>
            </div>
            <div className="flex items-center gap-5">
              <RegimeBadge r={data.regime} />
              <div className="text-right">
                <div className="text-[11px] uppercase tracking-[0.1em] text-zinc-500">Net Liq. Value</div>
                <div className="nums text-sm font-semibold text-zinc-100">{compactMoney(data.account.netLiquidationValue)}</div>
              </div>
            </div>
          </div>
        </header>

        {error && !loading && (
          <div className="border-b border-amber-400/20 bg-amber-400/5 px-8 py-2 text-[12px] text-amber-300">
            Engine unreachable — showing last known data. ({error})
          </div>
        )}

        <div key={view} className="animate-fade-rise px-8 py-6">
          {view === "overview" && <OverviewView data={data} />}
          {view === "signals" && <SignalsView data={data} />}
          {view === "orderbook" && <OrderBookView data={data} />}
          {view === "strategies" && <StrategiesView data={data} />}
          {view === "trades" && <TradesView data={data} />}
          {view === "risk" && <RiskView data={data} />}
          {view === "broker" && <BrokerView data={data} onSubmitOrder={submitOrder} />}
        </div>
      </main>
    </div>
  );
}
