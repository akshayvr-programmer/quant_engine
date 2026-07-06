import MetricCard from "./MetriCard";
import Card from "../ui/Card";
import PositionsTable from "./PositionsTable";
import OrderEntry from "./OrderEntry";
import SeedLiquidity from "./SeedLiquidity";
import TradeTape from "./TradeTape";
import MarketChart from "./MarketChart";
import OrderBook from "./OrderBook";

import { useAlpacaAccount } from "../../hooks/useAlpacaAccount";

import { Wallet, Landmark, BarChart3, TrendingUp } from "lucide-react";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function formatMetric(
  isLoading: boolean,
  value: number | undefined
): string {
  if (isLoading) return "Loading...";
  if (value === undefined) return "—";
  return usd.format(value);
}

export default function Dashboard() {
  const { data, isLoading } = useAlpacaAccount();

  const metrics = [
    {
      title: "Buying Power",
      value: data?.buyingPower,
      subtitle: "Alpaca Paper",
      icon: <Wallet size={22} color="#D6A15F" />,
    },
    {
      title: "Cash",
      value: data?.cash,
      icon: <Landmark size={22} color="#D6A15F" />,
    },
    {
      title: "Equity",
      value: data?.equity,
      icon: <BarChart3 size={22} color="#D6A15F" />,
    },
    {
      title: "Portfolio Value",
      value: data?.portfolioValue,
      icon: <TrendingUp size={22} color="#6FCF97" />,
    },
  ];

  return (
    <div className="flex h-full flex-col gap-6">
      {/* Metrics */}
      <div className="grid grid-cols-4 gap-6">
        {metrics.map((m) => (
          <MetricCard
            key={m.title}
            title={m.title}
            value={formatMetric(isLoading, m.value)}
            subtitle={m.subtitle}
            icon={m.icon}
          />
        ))}
      </div>

      {/* Main Trading Area */}
      <div className="grid min-h-0 flex-1 grid-cols-12 gap-6">
        <Card title="Market Chart" className="col-span-7 min-h-0">
          <MarketChart />
        </Card>

        <div className="col-span-5 flex min-h-0 flex-col gap-6">
          <Card title="Order Book" className="min-h-0 flex-1">
            <OrderBook />
          </Card>

          <Card title="Trade Tape" className="h-56 shrink-0">
            <TradeTape />
          </Card>
        </div>
      </div>

      {/* Bottom */}
      <div className="grid h-80 shrink-0 grid-cols-12 gap-6">
        <Card title="Order Entry" className="col-span-4 min-h-0">
          <OrderEntry />
        </Card>

        <Card title="Positions" className="col-span-5 min-h-0">
          <PositionsTable />
        </Card>

        <Card title="Market Maker" className="col-span-3 min-h-0">
          <SeedLiquidity />
        </Card>
      </div>
    </div>
  );
}