import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import type { SignalPoint } from "../../types";

export default function ZScorePanel({
  data,
  threshold = 1.5,
}: {
  data: SignalPoint[];
  threshold?: number;
}) {
  return (
    <div className="h-[180px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="zFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#71717a" stopOpacity={0.18} />
              <stop offset="100%" stopColor="#71717a" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#27272a" vertical={false} />
          <XAxis dataKey="t" tickLine={false} axisLine={false} minTickGap={56} tick={{ fill: "#52525b", fontSize: 11 }}
            tickFormatter={(t: string) => new Date(t).toLocaleDateString("en-US", { month: "short", day: "numeric" })} />
          <YAxis tickLine={false} axisLine={false} width={36} domain={[-3, 3]} tick={{ fill: "#52525b", fontSize: 11 }} />
          <Tooltip
            cursor={{ stroke: "#3f3f46", strokeWidth: 1 }}
            contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 12, fontSize: 12 }}
            labelFormatter={(t) => new Date(t as string).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            formatter={(v: number) => [v.toFixed(2), "z-score"]}
          />
          <ReferenceLine y={threshold} stroke="#fda4af" strokeDasharray="4 3" strokeOpacity={0.7} />
          <ReferenceLine y={-threshold} stroke="#6ee7b7" strokeDasharray="4 3" strokeOpacity={0.7} />
          <ReferenceLine y={0} stroke="#3f3f46" />
          <Area type="monotone" dataKey="zscore" stroke="#a1a1aa" strokeWidth={1.5} fill="url(#zFill)" dot={false} animationDuration={500} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
