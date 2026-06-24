import { useMemo, useState } from "react";
import type { PlatformData, StrategyId } from "../types";
import SignalsChart from "../components/charts/SignalsChart";
import ZScorePanel from "../components/charts/ZScorePanel";
import { RegimeBadge } from "../components/MetricsStrip";
import { Card, PanelHeader, MiniStat } from "../components/ui/Card";
import { price as fmtPrice, num2 } from "../lib/format";

const STRATS: { id: StrategyId; label: string }[] = [
  { id: "SMA", label: "SMA" },
  { id: "EMA", label: "EMA" },
  { id: "ZSCORE", label: "Z-Score" },
  { id: "PAIRS", label: "Pairs" },
];

export default function SignalsView({ data }: { data: PlatformData }) {
  const [strat, setStrat] = useState<StrategyId>(data.activeStrategy);
  const sig = data.signals;
  const last = sig[sig.length - 1];

  const counts = useMemo(() => {
    const buys = sig.filter((s) => s.action === "BUY").length;
    const sells = sig.filter((s) => s.action === "SELL").length;
    return { buys, sells };
  }, [sig]);

  return (
    <div className="space-y-5">
      <Card>
        <PanelHeader
          title="Price & Strategy Signals"
          sub="Mid price with short / long moving averages and crossover entries"
          right={
            <div className="flex items-center gap-3">
              <RegimeBadge r={data.regime} />
              <div className="flex items-center gap-1 rounded-xl border border-zinc-800 bg-zinc-950 p-1">
                {STRATS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStrat(s.id)}
                    className={[
                      "rounded-lg px-2.5 py-1 text-xs font-medium transition-all duration-300 ease-calm",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/40",
                      strat === s.id ? "bg-zinc-800 text-zinc-100" : "text-zinc-500 hover:text-zinc-300",
                    ].join(" ")}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          }
        />

        <div className="mt-4 flex flex-wrap gap-8">
          <MiniStat label="Last Price" value={fmtPrice(last.price)} />
          <MiniStat label="Short MA" value={fmtPrice(last.shortMA)} valueClass="text-amber-300" />
          <MiniStat label="Long MA" value={fmtPrice(last.longMA)} valueClass="text-zinc-400" />
          <MiniStat label="Buy Signals" value={`${counts.buys}`} valueClass="text-emerald-300" />
          <MiniStat label="Sell Signals" value={`${counts.sells}`} valueClass="text-rose-300" />
        </div>

        <div className="mt-4">
          <SignalsChart data={sig} />
        </div>
        <div className="mt-3 flex items-center gap-5 text-xs text-zinc-500">
          <span className="flex items-center gap-1.5"><span className="h-0.5 w-4 rounded bg-zinc-200" />Price</span>
          <span className="flex items-center gap-1.5"><span className="h-0.5 w-4 rounded bg-amber-300" />Short MA</span>
          <span className="flex items-center gap-1.5"><span className="h-0.5 w-4 rounded bg-zinc-500" />Long MA</span>
          <span className="flex items-center gap-1.5"><span className="text-emerald-300">▲</span> Buy</span>
          <span className="flex items-center gap-1.5"><span className="text-rose-300">▼</span> Sell</span>
        </div>
      </Card>

      <Card>
        <PanelHeader title="Z-Score" sub="Deviation from 20-bar mean · ±1.5σ entry bands" right={<span className="nums text-sm font-semibold text-zinc-300">{num2(last.zscore)}σ</span>} />
        <div className="mt-4">
          <ZScorePanel data={sig} threshold={1.5} />
        </div>
      </Card>
    </div>
  );
}
