import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { EquityPoint } from "../types";
import { money, signedMoney, signedPct, toneClass } from "../lib/format";

const RANGES = [
  { label: "1W", days: 7 },
  { label: "1M", days: 30 },
  { label: "3M", days: 90 },
  { label: "All", days: Infinity },
] as const;

type RangeLabel = (typeof RANGES)[number]["label"];

interface EquityCurveProps {
  data: EquityPoint[];
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload as EquityPoint;
  const date = new Date(p.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/95 px-3 py-2 shadow-xl backdrop-blur">
      <div className="text-[11px] font-medium text-zinc-500">{date}</div>
      <div className="nums mt-0.5 text-sm font-semibold text-zinc-100">{money(p.nav)}</div>
    </div>
  );
}

export default function EquityCurve({ data }: EquityCurveProps) {
  const [range, setRange] = useState<RangeLabel>("3M");

  const series = useMemo(() => {
    const cfg = RANGES.find((r) => r.label === range)!;
    if (cfg.days === Infinity) return data;
    return data.slice(Math.max(0, data.length - cfg.days));
  }, [data, range]);

  const first = series[0]?.nav ?? 0;
  const last = series[series.length - 1]?.nav ?? 0;
  const changeAbs = last - first;
  const changePct = first ? (changeAbs / first) * 100 : 0;

  // Pad the domain a touch so the line never kisses the edges.
  const navs = series.map((d) => d.nav);
  const min = Math.min(...navs);
  const max = Math.max(...navs);
  const pad = (max - min) * 0.12 || max * 0.01;

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-[13px] font-medium text-zinc-400">Equity Curve</h2>
          <div className="nums mt-1 text-2xl font-semibold tracking-tight text-zinc-100">
            {money(last)}
          </div>
          <div className={`nums mt-0.5 text-[13px] font-medium ${toneClass(changeAbs)}`}>
            {signedMoney(changeAbs)} · {signedPct(changePct)}
            <span className="ml-1.5 font-normal text-zinc-500">this period</span>
          </div>
        </div>

        {/* Range toggle */}
        <div className="flex items-center gap-1 rounded-xl border border-zinc-800 bg-zinc-950 p-1">
          {RANGES.map((r) => (
            <button
              key={r.label}
              onClick={() => setRange(r.label)}
              className={[
                "rounded-lg px-2.5 py-1 text-xs font-medium transition-all duration-300 ease-calm",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/40",
                range === r.label
                  ? "bg-zinc-800 text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-300",
              ].join(" ")}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={series} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="navFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fcd34d" stopOpacity={0.16} />
                <stop offset="100%" stopColor="#fcd34d" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="0"
              stroke="#27272a"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              minTickGap={48}
              tick={{ fill: "#52525b", fontSize: 11 }}
              tickFormatter={(d: string) =>
                new Date(d).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            <YAxis
              domain={[min - pad, max + pad]}
              tickLine={false}
              axisLine={false}
              width={56}
              tick={{ fill: "#52525b", fontSize: 11 }}
              tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "#3f3f46", strokeWidth: 1 }}
            />
            <Area
              type="monotone"
              dataKey="nav"
              stroke="#fcd34d"
              strokeWidth={2}
              fill="url(#navFill)"
              dot={false}
              activeDot={{
                r: 4,
                fill: "#fcd34d",
                stroke: "#18181b",
                strokeWidth: 2,
              }}
              animationDuration={600}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
