import { Wallet, TrendingUp, Gauge, Landmark } from "lucide-react";
import type { PlatformData } from "../types";
import StatCard from "../components/StatCard";
import EquityCurve from "../components/EquityCurve";
import PositionsTable from "../components/PositionsTable";
import TradeBlotter from "../components/TradeBlotter";
import RiskWidget from "../components/RiskWidget";
import DrawdownChart from "../components/charts/DrawdownChart";
import { MetricsStrip } from "../components/MetricsStrip";
import { Card, PanelHeader } from "../components/ui/Card";
import { money, signedMoney, signedPct, compactMoney, toneClass } from "../lib/format";

export default function OverviewView({ data }: { data: PlatformData }) {
  const { account, equityCurve, positions, trades, risk, metrics } = data;
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Cash" value={money(account.cash)} icon={Wallet} />
        <StatCard
          label="Today's PnL"
          value={signedMoney(account.todayPnl)}
          valueClass={toneClass(account.todayPnl)}
          sub={`${signedPct(account.todayPnlPct)} today`}
          subClass={toneClass(account.todayPnl)}
          icon={TrendingUp}
        />
        <StatCard label="Exposure" value={money(account.exposure)} sub={`${signedPct(account.exposurePct)} of NAV`} icon={Gauge} />
        <StatCard label="Net Liq. Value" value={compactMoney(account.netLiquidationValue)} icon={Landmark} />
      </div>

      <MetricsStrip m={metrics} />

      <EquityCurve data={equityCurve} />

      <Card>
        <PanelHeader title="Drawdown" sub="Peak-to-trough, % of equity" />
        <div className="mt-4">
          <DrawdownChart curve={equityCurve} />
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PositionsTable positions={positions} />
        </div>
        <RiskWidget risk={risk} />
      </div>

      <TradeBlotter trades={trades} />
    </div>
  );
}
