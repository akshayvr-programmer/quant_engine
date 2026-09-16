import { Bell, Command, Search } from "lucide-react";

export default function Topbar() {
  return (
    <div className="flex h-full min-w-0 items-center justify-between gap-4 px-6">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Search size={18} className="text-[#A79B91]" />

        <input
          placeholder="Search symbol, order, strategy..."
          className="w-full max-w-md rounded-lg border border-[#3C342E] bg-[#211D1A] px-3 py-2 text-sm outline-none transition focus:border-[#D6A15F]"
        />
      </div>

      <div className="flex shrink-0 items-center gap-4 text-sm">
        <div className="hidden items-center gap-2 rounded-lg border border-[#3C342E] bg-[#211D1A] px-3 py-1.5 text-[#A79B91] lg:flex">
          <Command size={14} />
          v1.2.0
        </div>

        <span className="text-[#A79B91]">
          Paper Trading
        </span>

        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-400"></div>

          <span>Connected</span>
        </div>

        <Bell
          size={20}
          className="cursor-pointer text-[#A79B91]"
        />
      </div>
    </div>
  );
}
