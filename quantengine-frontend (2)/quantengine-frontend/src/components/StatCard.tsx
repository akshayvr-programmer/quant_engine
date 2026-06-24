import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  /** Optional secondary line, e.g. a delta. */
  sub?: string;
  /** Tailwind text colour class for value + sub. Defaults to neutral. */
  valueClass?: string;
  subClass?: string;
  icon: LucideIcon;
}

export default function StatCard({
  label,
  value,
  sub,
  valueClass = "text-zinc-100",
  subClass = "text-zinc-500",
  icon: Icon,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 transition-all duration-300 ease-calm hover:border-zinc-700">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-medium text-zinc-400">{label}</span>
        <Icon size={16} strokeWidth={1.75} className="text-zinc-600" />
      </div>
      <div className={`nums mt-3 text-[28px] font-semibold tracking-tight ${valueClass}`}>
        {value}
      </div>
      {sub && <div className={`nums mt-1 text-[13px] font-medium ${subClass}`}>{sub}</div>}
    </div>
  );
}
