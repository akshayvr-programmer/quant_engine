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
    Radio,
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

        <div className="flex min-h-full flex-col gap-5">

            <div className="grid grid-cols-4 gap-5">

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

            <div className="grid min-h-[420px] grid-cols-12 gap-5">

                <Card
                    title="Primary Market"
                    className="col-span-7 min-h-0"
                >
                    <MarketChart />
                </Card>

                <Card
                    title="Trade Tape"
                    className="col-span-3 min-h-0"
                >
                    <TradeTape />
                </Card>

                <Card
                    title="Terminal"
                    className="col-span-2 min-h-0"
                >
                    <Terminal compact />
                </Card>

            </div>

            <div className="grid grid-cols-3 gap-5">
                <div className="rounded-lg border border-[#2A2420] bg-[#1C1815] p-4">
                    <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-widest text-[#8B8178]">
                        <Radio className="h-4 w-4 text-[#D6A15F]" />
                        Runtime
                    </div>
                    <div className="text-sm text-[#E5DED6]">Engine on port 8080, Alpaca Paper mode.</div>
                </div>
                <div className="rounded-lg border border-[#2A2420] bg-[#1C1815] p-4">
                    <div className="mb-3 text-xs uppercase tracking-widest text-[#8B8178]">Next Action</div>
                    <div className="text-sm text-[#E5DED6]">Check Markets, run Replay Lab, then enable strategies.</div>
                </div>
                <div className="rounded-lg border border-[#2A2420] bg-[#1C1815] p-4">
                    <div className="mb-3 text-xs uppercase tracking-widest text-[#8B8178]">Mode</div>
                    <div className="text-sm text-[#6FCF97]">Paper trading only</div>
                </div>
            </div>

        </div>

    );

}
