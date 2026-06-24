import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { StrategyResult } from "../../types";

const COLORS: Record<string, string> = {
  EMA: "#fcd34d",
  SMA: "#a1a1aa",
  ZSCORE: "#6ee7b7",
  PAIRS: "#93c5fd",
};

export default function StrategyCompareChart({ strategies }: { strategies: StrategyResult[] }) {
  // Normalize each curve to a base of 100 and merge by index.
  const len = Math.min(...strategies.map((s) => s.curve.length));
  const merged = Array.from({ length: len }, (_, i) => {
    const row: Record<string, number | string> = { i };
    strategies.forEach((s) => {
      const base = s.curve[0].nav;
      row[s.id] = +((s.curve[i].nav / base) * 100).toFixed(2);
    });
    return row;
  });

  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={merged} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid stroke="#27272a" vertical={false} />
          <XAxis dataKey="i" tickLine={false} axisLine={false} minTickGap={48} tick={{ fill: "#52525b", fontSize: 11 }}
            tickFormatter={(v: number) => `${v}`} />
          <YAxis tickLine={false} axisLine={false} width={48} domain={["auto", "auto"]} tick={{ fill: "#52525b", fontSize: 11 }}
            tickFormatter={(v: number) => v.toFixed(0)} />
          <Tooltip
            cursor={{ stroke: "#3f3f46", strokeWidth: 1 }}
            contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 12, fontSize: 12 }}
            labelFormatter={(i) => `Bar ${i}`}
          />
          <Legend wrapperStyle={{ fontSize: 12, color: "#a1a1aa" }} iconType="plainline" />
          {strategies.map((s) => (
            <Line key={s.id} type="monotone" dataKey={s.id} name={s.id} stroke={COLORS[s.id] ?? "#a1a1aa"}
              strokeWidth={s.id === "EMA" ? 2.2 : 1.6} dot={false} animationDuration={500} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
