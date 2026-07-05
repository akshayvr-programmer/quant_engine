import MetricCard from "./MetriCard";
import Card from "../ui/Card";
import { useQuery } from "@tanstack/react-query";
import { getAccount } from "../../services/account";
import PositionsTable from "./PositionsTable";
import OrderEntry from "./OrderEntry";
import SeedLiquidity from "./SeedLiquidity";

import {
  Wallet,
  Landmark,
  BarChart3,
  TrendingUp,
} from "lucide-react";
import OrderBook from "./OrderBook";

export default function Dashboard() {

  const { data, isLoading } = useQuery({
    queryKey: ["account"],
    queryFn: getAccount,
    refetchInterval: 1000,
  });

  console.log(data);


  return (
    <div className="flex h-full flex-col gap-6">

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-6">

        <MetricCard
          title="Buying Power"
          value={
            isLoading
              ? "Loading..."
              : `$${data?.buyingPower.toLocaleString()}`
          }
          subtitle="Paper Account"
          icon={<Wallet size={22} color="#D6A15F" />}
          trend="+0.00%"
        />

        <MetricCard
          title="Cash"
          value={
            isLoading
              ? "Loading..."
              : `$${data?.cash.toLocaleString()}`
          }
          icon={<Landmark size={22} color="#D6A15F" />}
        />

        <MetricCard
          title="Exposure"
          value={
            isLoading
              ? "Loading..."
              : `$${data?.exposure.toLocaleString()}`
          }
          icon={<BarChart3 size={22} color="#D6A15F" />}
        />

        <MetricCard
          title="Unrealized PnL"
          value={
            isLoading
              ? "Loading..."
              : `$${data?.unrealizedPnL.toLocaleString()}`
          }
          icon={<TrendingUp size={22} color="#6FCF97" />}
          trend="+0.00%"
        />

      </div>

      {/* Main Trading Area */}
      <div className="grid flex-1 grid-cols-12 gap-6">

        <Card
          title="Market Chart"
          className="col-span-7"
        />

        <div className="col-span-5 flex flex-col gap-6">

          <Card
            title="Order Book"
            className="flex-1">
              <OrderBook />

            </Card>

          <Card
            title="Trade Tape"
            className="h-56"
          />

        </div>

      </div>

      {/* Bottom */}
      <div className="grid grid-cols-12 gap-6">

        <Card
    title="Order Entry"
    className="col-span-4 h-auto"
>
    <OrderEntry />
    </Card>

        <Card
    title="Positions"
    className="col-span-5 h-80">
    <PositionsTable />
    </Card>

    <Card
  title="Market Maker"
  className="col-span-3 h-[420px]">
  <SeedLiquidity />
  </Card>

      </div>

    </div>
  );
}
