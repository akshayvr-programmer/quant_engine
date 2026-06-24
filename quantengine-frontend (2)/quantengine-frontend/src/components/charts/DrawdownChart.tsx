import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { EquityPoint } from "../../types";

/** Computes peak-to-current drawdown (%) from the NAV series. */
export function toDrawdown(curve: EquityPoint[]) {
  let peak = -Infinity;
  return curve.map((p) => {
    peak = Math.max(peak, p.nav);
    return { date: p.date, dd: +(((p.nav - peak) / peak) * 100).toFixed(2) };
  });
}

export default function DrawdownChart({ curve }: { curve: EquityPoint[] }) {
  const data = toDrawdown(curve);
  return (
    <div className="h-[160px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="ddFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fda4af" stopOpacity={0} />
              <stop offset="100%" stopColor="#fda4af" stopOpacity={0.22} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#27272a" vertical={false} />
          <XAxis dataKey="date" tickLine={false} axisLine={false} minTickGap={56} tick={{ fill: "#52525b", fontSize: 11 }}
            tickFormatter={(d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" })} />
          <YAxis tickLine={false} axisLine={false} width={44} tick={{ fill: "#52525b", fontSize: 11 }}
            tickFormatter={(v: number) => `${v.toFixed(0)}%`} />
          <Tooltip
            cursor={{ stroke: "#3f3f46", strokeWidth: 1 }}
            contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 12, fontSize: 12 }}
            labelFormatter={(d) => new Date(d as string).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            formatter={(v: number) => [`${v.toFixed(2)}%`, "drawdown"]}
          />
          <Area type="monotone" dataKey="dd" stroke="#fda4af" strokeWidth={1.5} fill="url(#ddFill)" dot={false} animationDuration={500} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
