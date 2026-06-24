import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
  pad = true,
}: {
  children: ReactNode;
  className?: string;
  pad?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border border-zinc-800 bg-zinc-900 ${pad ? "p-5" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

export function PanelHeader({
  title,
  right,
  sub,
}: {
  title: string;
  right?: ReactNode;
  sub?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <h2 className="text-sm font-semibold text-zinc-100">{title}</h2>
        {sub && <p className="mt-0.5 text-xs text-zinc-500">{sub}</p>}
      </div>
      {right}
    </div>
  );
}

/** Small label/value stat used inside dense panels. */
export function MiniStat({
  label,
  value,
  valueClass = "text-zinc-100",
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-[0.08em] text-zinc-500">{label}</div>
      <div className={`nums mt-1 text-lg font-semibold tracking-tight ${valueClass}`}>{value}</div>
    </div>
  );
}
