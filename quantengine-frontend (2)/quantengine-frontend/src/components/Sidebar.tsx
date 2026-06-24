import {
  LayoutDashboard,
  Activity,
  Layers,
  FlaskConical,
  ArrowLeftRight,
  ShieldCheck,
  Building2,
  type LucideIcon,
} from "lucide-react";

export type ViewId =
  | "overview"
  | "signals"
  | "orderbook"
  | "strategies"
  | "trades"
  | "risk"
  | "broker";

const NAV: { id: ViewId; label: string; icon: LucideIcon }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "signals", label: "Signals", icon: Activity },
  { id: "orderbook", label: "Order Book", icon: Layers },
  { id: "strategies", label: "Strategies", icon: FlaskConical },
  { id: "trades", label: "Trades", icon: ArrowLeftRight },
  { id: "risk", label: "Risk", icon: ShieldCheck },
  { id: "broker", label: "Broker", icon: Building2 },
];

export default function Sidebar({
  active,
  onSelect,
  live,
}: {
  active: ViewId;
  onSelect: (id: ViewId) => void;
  live: boolean;
}) {
  return (
    <aside className="flex w-[264px] shrink-0 flex-col border-r border-zinc-800 bg-zinc-950">
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
            <path d="M2 13L6.5 8L10 10.5L16 4" stroke="#fcd34d" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="leading-tight">
          <div className="text-[15px] font-semibold tracking-tight text-zinc-100">QuantEngine</div>
          <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-500">Trading Platform</div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 px-3">
        {NAV.map(({ id, label, icon: Icon }) => {
          const isActive = id === active;
          return (
            <button
              key={id}
              onClick={() => onSelect(id)}
              className={[
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium",
                "transition-all duration-300 ease-calm focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/40",
                isActive ? "bg-zinc-900 text-zinc-100" : "text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200",
              ].join(" ")}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon
                size={18}
                strokeWidth={1.75}
                className={isActive ? "text-amber-300" : "text-zinc-500 transition-colors duration-300 group-hover:text-zinc-300"}
              />
              {label}
            </button>
          );
        })}
      </nav>

      <div className="mx-3 mb-4 rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            {live && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300/40 [animation-duration:2.4s]" />
            )}
            <span className={`relative inline-flex h-2 w-2 rounded-full ${live ? "bg-emerald-300" : "bg-amber-300"}`} />
          </span>
          <span className="text-xs font-medium text-zinc-300">
            {live ? "Engine connected" : "Mock feed"}
          </span>
        </div>
        <div className="mt-1 pl-[18px] text-[11px] text-zinc-500">
          {live ? "Live · dashboard.json" : "Awaiting engine export"}
        </div>
      </div>
    </aside>
  );
}
