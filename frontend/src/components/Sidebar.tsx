import {
  LayoutDashboard,
  Briefcase,
  ArrowLeftRight,
  ShieldCheck,
  Building2,
  Settings,
  type LucideIcon,
} from "lucide-react";

interface NavItem {
  label: string;
  icon: LucideIcon;
}

const NAV: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Portfolio", icon: Briefcase },
  { label: "Trades", icon: ArrowLeftRight },
  { label: "Risk", icon: ShieldCheck },
  { label: "Broker", icon: Building2 },
  { label: "Settings", icon: Settings },
];

interface SidebarProps {
  active: string;
  onSelect: (label: string) => void;
}

export default function Sidebar({ active, onSelect }: SidebarProps) {
  return (
    <aside className="flex w-[264px] shrink-0 flex-col border-r border-zinc-800 bg-zinc-950">
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900">
          {/* Quiet geometric mark — a steady upward line, the one amber note. */}
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
            <path
              d="M2 13L6.5 8L10 10.5L16 4"
              stroke="#fcd34d"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="leading-tight">
          <div className="text-[15px] font-semibold tracking-tight text-zinc-100">
            QuantEngine
          </div>
          <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-500">
            Portfolio
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-0.5 px-3">
        {NAV.map(({ label, icon: Icon }) => {
          const isActive = label === active;
          return (
            <button
              key={label}
              onClick={() => onSelect(label)}
              className={[
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium",
                "transition-all duration-300 ease-calm focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/40",
                isActive
                  ? "bg-zinc-900 text-zinc-100"
                  : "text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200",
              ].join(" ")}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon
                size={18}
                strokeWidth={1.75}
                className={
                  isActive
                    ? "text-amber-300"
                    : "text-zinc-500 transition-colors duration-300 group-hover:text-zinc-300"
                }
              />
              {label}
            </button>
          );
        })}
      </nav>

      {/* Engine status */}
      <div className="mx-3 mb-4 rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300/40 [animation-duration:2.4s]" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-300" />
          </span>
          <span className="text-xs font-medium text-zinc-300">Engine connected</span>
        </div>
        <div className="mt-1 pl-[18px] text-[11px] text-zinc-500">
          Mock feed · paper trading
        </div>
      </div>
    </aside>
  );
}
