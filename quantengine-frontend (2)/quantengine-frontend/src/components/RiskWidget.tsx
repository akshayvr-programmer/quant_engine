import { ShieldCheck, ShieldAlert, ShieldX, type LucideIcon } from "lucide-react";
import type { RiskMetrics, RiskStatus } from "../types";
import { count, money, signedMoney, toneClass } from "../lib/format";

interface RiskWidgetProps {
  risk: RiskMetrics;
}

const STATUS: Record<
  RiskStatus,
  { label: string; icon: LucideIcon; text: string; bg: string; ring: string }
> = {
  APPROVED: {
    label: "Approved",
    icon: ShieldCheck,
    text: "text-emerald-300",
    bg: "bg-emerald-300/10",
    ring: "ring-emerald-300/20",
  },
  WARNING: {
    label: "Warning",
    icon: ShieldAlert,
    text: "text-amber-300",
    bg: "bg-amber-300/10",
    ring: "ring-amber-300/20",
  },
  BREACHED: {
    label: "Breached",
    icon: ShieldX,
    text: "text-rose-300",
    bg: "bg-rose-300/10",
    ring: "ring-rose-300/20",
  },
};

function Metric({
  label,
  value,
  valueClass = "text-zinc-100",
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-[13px] text-zinc-400">{label}</span>
      <span className={`nums text-sm font-medium ${valueClass}`}>{value}</span>
    </div>
  );
}

export default function RiskWidget({ risk }: RiskWidgetProps) {
  const s = STATUS[risk.status];
  const Icon = s.icon;

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
      <h2 className="text-sm font-semibold text-zinc-100">Risk</h2>

      {/* Status */}
      <div className="mt-4 flex items-center justify-between">
        <span className="text-[13px] text-zinc-400">Status</span>
        <span
          className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold ring-1 ${s.bg} ${s.text} ${s.ring}`}
        >
          <Icon size={14} strokeWidth={2} />
          {s.label}
        </span>
      </div>

      <div className="mt-1 divide-y divide-zinc-800/70">
        <Metric label="Exposure" value={money(risk.exposure)} />
        <Metric
          label="Daily Loss"
          value={signedMoney(risk.dailyLoss)}
          valueClass={toneClass(risk.dailyLoss)}
        />
        <Metric label="Position Limit" value={`${count(risk.positionLimit)} shares`} />
      </div>
    </div>
  );
}
