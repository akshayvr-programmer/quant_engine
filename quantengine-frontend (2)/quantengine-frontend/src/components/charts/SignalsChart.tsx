import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { SignalPoint } from "../../types";
import { price as fmtPrice } from "../../lib/format";

function ActionDot(props: any) {
  const { cx, cy, payload } = props;
  if (payload.action === "BUY")
    return <path d={`M${cx} ${cy - 7} L${cx - 5} ${cy + 3} L${cx + 5} ${cy + 3} Z`} fill="#6ee7b7" stroke="#18181b" strokeWidth={1} />;
  if (payload.action === "SELL")
    return <path d={`M${cx} ${cy + 7} L${cx - 5} ${cy - 3} L${cx + 5} ${cy - 3} Z`} fill="#fda4af" stroke="#18181b" strokeWidth={1} />;
  return <g />;
}

function SignalTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload as SignalPoint;
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/95 px-3 py-2 text-xs shadow-xl backdrop-blur">
      <div className="nums font-semibold text-zinc-100">{fmtPrice(p.price)}</div>
      <div className="nums mt-1 text-zinc-400">short {fmtPrice(p.shortMA)} · long {fmtPrice(p.longMA)}</div>
      {p.action !== "HOLD" && (
        <div className={`mt-1 font-semibold ${p.action === "BUY" ? "text-emerald-300" : "text-rose-300"}`}>{p.action}</div>
      )}
    </div>
  );
}

export default function SignalsChart({ data }: { data: SignalPoint[] }) {
  return (
    <div className="h-[340px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid stroke="#27272a" vertical={false} />
          <XAxis dataKey="t" tickLine={false} axisLine={false} minTickGap={56} tick={{ fill: "#52525b", fontSize: 11 }}
            tickFormatter={(t: string) => new Date(t).toLocaleDateString("en-US", { month: "short", day: "numeric" })} />
          <YAxis tickLine={false} axisLine={false} width={56} domain={["auto", "auto"]} tick={{ fill: "#52525b", fontSize: 11 }}
            tickFormatter={(v: number) => `$${v.toFixed(0)}`} />
          <Tooltip content={<SignalTooltip />} cursor={{ stroke: "#3f3f46", strokeWidth: 1 }} />
          <Line type="monotone" dataKey="longMA" stroke="#52525b" strokeWidth={1.5} dot={false} strokeDasharray="4 3" animationDuration={500} />
          <Line type="monotone" dataKey="shortMA" stroke="#fcd34d" strokeWidth={1.5} dot={false} animationDuration={500} />
          <Line type="monotone" dataKey="price" stroke="#e4e4e7" strokeWidth={2} dot={<ActionDot />} animationDuration={600} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
