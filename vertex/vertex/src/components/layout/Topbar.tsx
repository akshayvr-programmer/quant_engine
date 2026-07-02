import { Bell, Search } from "lucide-react";

export default function Topbar() {
  return (
    <div className="flex h-full items-center justify-between px-8">
      <div className="flex items-center gap-4">
        <Search size={18} className="text-[#A79B91]" />

        <input
          placeholder="Search symbol..."
          className="w-80 rounded-xl border border-[#3C342E] bg-[#211D1A] px-4 py-2 outline-none transition focus:border-[#D6A15F]"
        />
      </div>

      <div className="flex items-center gap-6">
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