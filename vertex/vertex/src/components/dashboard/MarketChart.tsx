import {
    createChart,
    CandlestickSeries,
    ColorType,
    type IChartApi,
    type ISeriesApi,
    type UTCTimestamp,
} from "lightweight-charts";
import { useEffect, useRef } from "react";
import { useBars } from "../../hooks/useBars";

type MarketChartProps = {
    symbol?: string;
};

export default function MarketChart({
    symbol = "AAPL",
}: MarketChartProps) {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
    const hasFitRef = useRef(false);

    const { data } = useBars(symbol);

    // Create the chart exactly once
    useEffect(() => {
        const container = chartContainerRef.current;
        if (!container) return;

        const chart = createChart(container, {
            layout: {
                background: { type: ColorType.Solid, color: "#171411" },
                textColor: "#B8ADA3",
            },
            grid: {
                vertLines: { color: "#2A2420" },
                horzLines: { color: "#2A2420" },
            },
            width: container.clientWidth,
            height: container.clientHeight || 350,
            rightPriceScale: { borderColor: "#3A322C" },
            timeScale: { borderColor: "#3A322C" },
        });

        const series = chart.addSeries(CandlestickSeries, {
            upColor: "#4CAF7D",
            downColor: "#E05C5C",
            wickUpColor: "#4CAF7D",
            wickDownColor: "#E05C5C",
            borderVisible: false,
        });

        chartRef.current = chart;
        seriesRef.current = series;

        const resizeObserver = new ResizeObserver((entries) => {
            const { width, height } = entries[0].contentRect;
            chart.applyOptions({ width, height });
        });
        resizeObserver.observe(container);

        return () => {
            resizeObserver.disconnect();
            chart.remove();
            chartRef.current = null;
            seriesRef.current = null;
        };
    }, []);

    // Push new data without rebuilding the chart
    useEffect(() => {
        if (!seriesRef.current || !data?.bars) return;

        const candles = data.bars
            .map((bar: any) => ({
                time: Math.floor(new Date(bar.t).getTime() / 1000) as UTCTimestamp,
                open: bar.o,
                high: bar.h,
                low: bar.l,
                close: bar.c,
            }))
            .sort((a, b) => a.time - b.time);

        seriesRef.current.setData(candles);

        if (!hasFitRef.current) {
            chartRef.current?.timeScale().fitContent();
            hasFitRef.current = true;
        }
    }, [data]);

    return <div ref={chartContainerRef} className="h-full w-full" />;
}
