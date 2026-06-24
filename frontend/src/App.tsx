import { useState } from "react";
import { Wallet, TrendingUp, Gauge } from "lucide-react";
import Sidebar from "./components/Sidebar";
import StatCard from "./components/StatCard";
import EquityCurve from "./components/EquityCurve";
import PositionsTable from "./components/PositionsTable";
import TradeBlotter from "./components/TradeBlotter";
import RiskWidget from "./components/RiskWidget";
import { dashboardData } from "./data/mockData";
import { money, signedMoney, signedPct, toneClass } from "./lib/format";

export default function App() {
  const [active, setActive] = useState("Dashboard");
  const { account, equityCurve, positions, trades, risk } = dashboardData;

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950 text-zinc-100 antialiased">
      <Sidebar active={active} onSelect={setActive} />

      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-950/80 px-8 py-5 backdrop-blur">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-zinc-100">
                {active}
              </h1>
              <p className="mt-0.5 text-[13px] text-zinc-500">{today}</p>
            </div>
            <div className="text-right">
              <div className="text-[11px] uppercase tracking-[0.1em] text-zinc-500">
                Total Equity
              </div>
              <div className="nums text-sm font-semibold text-zinc-100">
                {money(account.cash + account.exposure)}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="animate-fade-rise space-y-5 px-8 py-6">
          {/* Top row — three stat cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard label="Cash" value={money(account.cash)} icon={Wallet} />
            <StatCard
              label="Today's PnL"
              value={signedMoney(account.todayPnl)}
              valueClass={toneClass(account.todayPnl)}
              sub={`${signedPct(account.todayPnlPct)} today`}
              subClass={toneClass(account.todayPnl)}
              icon={TrendingUp}
            />
            <StatCard
              label="Exposure"
              value={money(account.exposure)}
              sub={`${signedPct(account.exposurePct)} of NAV`}
              icon={Gauge}
            />
          </div>

          {/* Equity curve */}
          <EquityCurve data={equityCurve} />

          {/* Positions + Risk */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <PositionsTable positions={positions} />
            </div>
            <div className="lg:col-span-1">
              <RiskWidget risk={risk} />
            </div>
          </div>

          {/* Trade blotter */}
          <TradeBlotter trades={trades} />
        </div>
      </main>
    </div>
  );
}
