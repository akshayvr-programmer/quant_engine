import { ShieldCheck, ShieldAlert, ShieldX, type LucideIcon } from "lucide-react";
import type { PlatformData, RiskStatus, RiskLimit } from "../types";
import { Card, PanelHeader } from "../components/ui/Card";
import { money, count, signedMoney, toneClass } from "../lib/format";

const STATUS: Record<RiskStatus, { label: string; icon: LucideIcon; text: string; bg: string; ring: string }> = {
  APPROVED: { label: "Approved", icon: ShieldCheck, text: "text-emerald-300", bg: "bg-emerald-300/10", ring: "ring-emerald-300/20" },
  WARNING: { label: "Warning", icon: ShieldAlert, text: "text-amber-300", bg: "bg-amber-300/10", ring: "ring-amber-300/20" },
  BREACHED: { label: "Breached", icon: ShieldX, text: "text-rose-300", bg: "bg-rose-300/10", ring: "ring-rose-300/20" },
};

function fmtLimit(v: number, unit: string) {
  return unit === "$" ? money(v) : `${count(v)} ${unit}`;
}

function LimitBar({ lim }: { lim: RiskLimit }) {
  const pct = Math.min(100, (lim.used / lim.limit) * 100);
  const bar = pct > 85 ? "bg-rose-300" : pct > 60 ? "bg-amber-300" : "bg-emerald-300";
  return (
    <div className="py-3.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-zinc-300">{lim.label}</span>
        <span className="nums text-zinc-400">
          {fmtLimit(lim.used, lim.unit)} <span className="text-zinc-600">/ {fmtLimit(lim.limit, lim.unit)}</span>
        </span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
        <div className={`h-full rounded-full ${bar} transition-all duration-500 ease-calm`} style={{ width: `${pct}%` }} />
      </div>
      <div className="nums mt-1 text-[11px] text-zinc-500">{pct.toFixed(1)}% utilized</div>
    </div>
  );
}

export default function RiskView({ data }: { data: PlatformData }) {
  const r = data.risk;
  const s = STATUS[r.status];
  const Icon = s.icon;

  return (
    <div className="space-y-5">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ring-1 ${s.bg} ${s.ring}`}>
              <Icon size={22} strokeWidth={2} className={s.text} />
            </div>
            <div>
              <div className="text-[13px] text-zinc-400">Pre-trade Risk Status</div>
              <div className={`text-2xl font-semibold tracking-tight ${s.text}`}>{s.label}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] uppercase tracking-[0.08em] text-zinc-500">Last Check</div>
            <div className="text-sm text-zinc-300">{r.reason ?? "—"}</div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <PanelHeader title="Limit Utilization" sub="RiskManager checks, live against configured limits" />
          <div className="mt-2 divide-y divide-zinc-800/70">
            {r.limits.map((lim) => <LimitBar key={lim.label} lim={lim} />)}
          </div>
        </Card>

        <Card>
          <PanelHeader title="Summary" />
          <div className="mt-2 divide-y divide-zinc-800/70">
            <div className="flex items-center justify-between py-3 text-sm">
              <span className="text-zinc-400">Gross Exposure</span>
              <span className="nums font-medium text-zinc-100">{money(r.exposure)}</span>
            </div>
            <div className="flex items-center justify-between py-3 text-sm">
              <span className="text-zinc-400">Daily Loss</span>
              <span className={`nums font-medium ${toneClass(r.dailyLoss)}`}>{signedMoney(r.dailyLoss)}</span>
            </div>
            <div className="flex items-center justify-between py-3 text-sm">
              <span className="text-zinc-400">Position Limit</span>
              <span className="nums font-medium text-zinc-100">{count(r.positionLimit)} sh</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
