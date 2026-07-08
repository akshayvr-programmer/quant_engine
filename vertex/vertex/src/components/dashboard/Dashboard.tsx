import MetricCard from "./MetriCard";
import Card from "../ui/Card";
import TradeTape from "./TradeTape";
import MarketChart from "./MarketChart";

import { useAlpacaAccount } from "../../hooks/useAlpacaAccount";

import {
    Wallet,
    Landmark,
    BarChart3,
    TrendingUp,
} from "lucide-react";
import Terminal from "../terminal/Terminal";
const usd = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

function formatMetric(
    isLoading: boolean,
    value: number | undefined
) {

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

                {metrics.map((metric) => (

                    <MetricCard
                        key={metric.title}
                        title={metric.title}
                        value={formatMetric(isLoading, metric.value)}
                        subtitle={metric.subtitle}
                        icon={metric.icon}
                    />

                ))}

            </div>

            {/* Main */}

            <div className="grid min-h-0 flex-1 grid-cols-12 gap-6">

                <Card
                    title="Market Chart"
                    className="col-span-8 min-h-0"
                >
                    <MarketChart />
                </Card>

                <Card
                    title="Trade Tape"
                    className="col-span-4 min-h-0"
                >
                    <TradeTape />
                </Card>

            </div>

            {/* Terminal */}

            <Card
                title="Vertex Terminal"
                className="h-80"
            >

                <div className="flex h-full flex-col rounded-lg bg-[#14110F] p-4 font-mono">

                    <div className="mb-4 text-[#D6A15F]">

                        <Terminal />

                    </div>

                    <div className="flex-1 space-y-2 overflow-y-auto text-sm">

                        <div className="text-[#6FCF97]">

                            ✓ Connected to Alpaca Paper

                        </div>

                        <div className="text-[#A79B91]">

                            Type <span className="text-[#D6A15F]">help</span> to begin.

                        </div>

                    </div>

                    <div className="mt-4 flex items-center gap-2 border-t border-[#2A2420] pt-3">

                        <span className="text-[#D6A15F]">&gt;</span>

                        <input
                            className="flex-1 bg-transparent text-white outline-none"
                            placeholder="buy AAPL 10 market"
                        />

                    </div>

                </div>

            </Card>

        </div>

    );

}