import { useState, useEffect } from "react";
import { Play, Square, Zap, TrendingUp, Activity } from "lucide-react";
import Card from "../ui/Card";
import { getStrategies, injectTick, startStrategy, stopStrategy, StrategyItem } from "../../services/strategies";

export default function StrategiesTab() {
  const [strategies, setStrategies] = useState<StrategyItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [replaySymbol, setReplaySymbol] = useState("AAPL");
  const [replayPrices, setReplayPrices] = useState("100,101,102,99,98");
  const [replaying, setReplaying] = useState(false);
  const [replayStatus, setReplayStatus] = useState<string | null>(null);

  const fetchStrategies = async () => {
    try {
      const data = await getStrategies();
      setStrategies(data);
      setError(null);
    } catch (err: any) {
      setError("Failed to connect to C++ Engine Strategy Runtime.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStrategies();
    const interval = setInterval(fetchStrategies, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleToggle = async (name: string, isRunning: boolean) => {
    try {
      if (isRunning) {
        await stopStrategy(name);
      } else {
        await startStrategy(name);
      }
      fetchStrategies();
    } catch (err) {
      console.error("Error toggling strategy:", err);
    }
  };

  const handleReplayTicks = async () => {
    const prices = replayPrices
      .split(",")
      .map((price) => Number(price.trim()))
      .filter((price) => Number.isFinite(price) && price > 0);

    if (!prices.length) {
      setReplayStatus("Enter at least one valid price.");
      return;
    }

    setReplaying(true);
    setReplayStatus(null);

    try {
      for (const [index, price] of prices.entries()) {
        await injectTick({
          symbol: replaySymbol.trim().toUpperCase() || "AAPL",
          price,
          volume: 1,
          timestamp: Date.now() + index,
        });
      }

      setReplayStatus(`Injected ${prices.length} ${replaySymbol.toUpperCase()} ticks into the runtime.`);
    } catch (err) {
      console.error("Error replaying ticks:", err);
      setReplayStatus("Failed to inject ticks. Check that the C++ engine is running.");
    } finally {
      setReplaying(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-zinc-400 font-mono">Loading Strategy Runtime...</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" /> Quantitative Strategy Runtime
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Real-time algorithmic signals connected to Alpaca Market Data & Matching Engine
          </p>
        </div>
        {error && (
          <span className="text-xs px-3 py-1 bg-red-500/10 border border-red-500/30 text-red-400 rounded-md">
            {error}
          </span>
        )}
      </div>

      <div className="rounded-xl border border-[#3C342E] bg-[#1C1815] p-5">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-[#F5F1EB]">
              <Activity className="h-4 w-4 text-[#D6A15F]" />
              Replay Test Ticks
            </h3>
            <p className="mt-1 text-xs text-[#A79B91]">
              Inject synthetic ticks into the same feed used by live Alpaca streaming.
            </p>
          </div>
          {replayStatus && (
            <span className="max-w-md text-right text-xs text-[#A79B91]">
              {replayStatus}
            </span>
          )}
        </div>

        <div className="grid grid-cols-12 gap-3">
          <input
            value={replaySymbol}
            onChange={(event) => setReplaySymbol(event.target.value.toUpperCase())}
            className="col-span-2 rounded-lg border border-[#3C342E] bg-[#2A2420] px-3 py-2 text-sm text-[#F5F1EB] outline-none transition focus:border-[#D6A15F]"
            placeholder="AAPL"
          />
          <input
            value={replayPrices}
            onChange={(event) => setReplayPrices(event.target.value)}
            className="col-span-8 rounded-lg border border-[#3C342E] bg-[#2A2420] px-3 py-2 text-sm text-[#F5F1EB] outline-none transition focus:border-[#D6A15F]"
            placeholder="100,101,102,99,98"
          />
          <button
            type="button"
            onClick={handleReplayTicks}
            disabled={replaying}
            className="col-span-2 rounded-lg bg-[#D6A15F] px-4 py-2 text-sm font-semibold text-[#171411] transition hover:bg-[#E0AF74] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {replaying ? "Injecting..." : "Replay"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {strategies.map((strat) => (
          <Card key={strat.name} title={strat.name.toUpperCase()} className="p-5 flex flex-col justify-between border-zinc-800 bg-zinc-950/60">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-blue-400" /> Algorithmic
                </span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
                  strat.running 
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                    : "bg-zinc-800 text-zinc-500"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${strat.running ? "bg-emerald-400 animate-pulse" : "bg-zinc-500"}`} />
                  {strat.running ? "ACTIVE" : "STOPPED"}
                </span>
              </div>

              <div className="space-y-3 my-6">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Target Feed</span>
                  <span className="font-mono text-zinc-200">Alpaca IEX / Live Ticks</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Execution Pipeline</span>
                  <span className="font-mono text-zinc-200">Risk → Matching Engine</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleToggle(strat.name, strat.running)}
              className={`w-full py-2.5 px-4 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                strat.running
                  ? "bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30"
                  : "bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-semibold shadow-lg shadow-emerald-500/20"
              }`}
            >
              {strat.running ? (
                <>
                  <Square className="w-4 h-4 fill-current" /> Stop Strategy
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" /> Start Strategy
                </>
              )}
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}
