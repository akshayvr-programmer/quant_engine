import {
  LayoutDashboard,
  ChartCandlestick,
  Briefcase,
  ReceiptText,
  Brain,
  BarChart3,
  Shield,
  History,
  Settings,
} from "lucide-react";

const items = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: ChartCandlestick, label: "Markets" },
  { icon: Briefcase, label: "Portfolio" },
  { icon: ReceiptText, label: "Orders" },
  { icon: Brain, label: "Strategies" },
  { icon: BarChart3, label: "Analytics" },
  { icon: Shield, label: "Risk" },
  { icon: History, label: "Replay" },
  { icon: Settings, label: "Settings" },
];

export default function Sidebar() {
  return (
    <div className="flex h-full flex-col">
      <div className="px-8 py-8">
        <h1 className="text-3xl font-bold tracking-tight text-[#D6A15F]">
          Vertex
        </h1>

        <p className="mt-2 text-sm text-[#A79B91]">
          Quant Trading Terminal
        </p>
      </div>

      <nav className="flex-1 px-4">
        {items.map(({ icon: Icon, label }) => (
          <button
            key={label}
            className="mb-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-[#E5DED6] transition-all duration-200 hover:bg-[#2A2420] hover:text-white"
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </nav>

      <div className="border-t border-[#3C342E] p-6">
        <div className="text-sm text-[#A79B91]">
          Connected
        </div>

        <div className="mt-2 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-400"></div>

          <span>Paper Engine</span>
        </div>
      </div>
    </div>
  );
}
