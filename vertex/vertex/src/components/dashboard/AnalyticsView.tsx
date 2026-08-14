import { Activity, BarChart3, Briefcase, Percent, TrendingUp } from "lucide-react";
import { useAlpacaAccount } from "../../hooks/useAlpacaAccount";
import { useAlpacaPositions } from "../../hooks/useAlpacaPositions";
import { useAlpacaOrders } from "../../hooks/useAlpacaOrders";

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

function Stat({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[#2A2420] bg-[#1C1815] p-5">
      <div className="mb-4 flex items-center justify-between text-[#8B8178]">
        <span className="text-xs uppercase tracking-widest">{label}</span>{icon}
      </div>
      <div className="font-mono text-2xl font-bold text-[#F5F1EB]">{value}</div>
    </div>
  );
}

export default function AnalyticsView() {
  const { data: account } = useAlpacaAccount();
  const { data: positions = [] } = useAlpacaPositions();
  const { data: orders = [] } = useAlpacaOrders();

  const unrealized = positions.reduce((sum, p) => sum + p.unrealizedPnL, 0);
  const exposure = positions.reduce((sum, p) => sum + Math.abs(p.marketValue), 0);
  const winners = positions.filter((p) => p.unrealizedPnL > 0).length;
  const winRate = positions.length ? (winners / positions.length) * 100 : 0;
  const largestPosition = [...positions].sort((a, b) => Math.abs(b.marketValue) - Math.abs(a.marketValue))[0];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-[#8B8178]">
          <BarChart3 className="h-4 w-4 text-[#D6A15F]" /> Analytics
        </div>
        <h2 className="text-2xl font-bold text-[#F5F1EB]">Portfolio Analytics</h2>
        <p className="mt-2 text-sm text-[#A79B91]">Live account, position, and execution-derived performance view.</p>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <Stat label="Equity" value={account ? usd.format(account.equity) : "--"} icon={<TrendingUp size={18} />} />
        <Stat label="Exposure" value={usd.format(exposure)} icon={<Briefcase size={18} />} />
        <Stat label="Unrealized PnL" value={usd.format(unrealized)} icon={<Activity size={18} />} />
        <Stat label="Position Win Rate" value={`${winRate.toFixed(1)}%`} icon={<Percent size={18} />} />
      </div>

      <div className="grid grid-cols-12 gap-6">
        <section className="col-span-7 rounded-xl border border-[#2A2420] bg-[#1C1815]">
          <div className="border-b border-[#2A2420] px-5 py-4 text-xs uppercase tracking-widest text-[#8B8178]">
            Position Attribution
          </div>
          <div className="space-y-3 p-5">
            {positions.length === 0 && <div className="text-sm text-[#8B8178]">No open positions.</div>}
            {positions.map((p) => {
              const pct = exposure ? Math.min(100, (Math.abs(p.marketValue) / exposure) * 100) : 0;
              return (
                <div key={p.symbol}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="font-semibold text-[#F5F1EB]">{p.symbol}</span>
                    <span className={p.unrealizedPnL >= 0 ? "text-[#6FCF97]" : "text-[#E57373]"}>
                      {usd.format(p.unrealizedPnL)}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-[#2A2420]">
                    <div className="h-2 rounded-full bg-[#D6A15F]" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="col-span-5 rounded-xl border border-[#2A2420] bg-[#1C1815]">
          <div className="border-b border-[#2A2420] px-5 py-4 text-xs uppercase tracking-widest text-[#8B8178]">
            Desk Summary
          </div>
          <div className="space-y-4 p-5 text-sm text-[#B8ADA3]">
            <div>Filled orders: <span className="font-mono text-[#F5F1EB]">{orders.length}</span></div>
            <div>Open positions: <span className="font-mono text-[#F5F1EB]">{positions.length}</span></div>
            <div>Largest position: <span className="font-mono text-[#F5F1EB]">{largestPosition?.symbol ?? "--"}</span></div>
            <div>Buying power: <span className="font-mono text-[#F5F1EB]">{account ? usd.format(account.buyingPower) : "--"}</span></div>
          </div>
        </section>
      </div>
    </div>
  );
}