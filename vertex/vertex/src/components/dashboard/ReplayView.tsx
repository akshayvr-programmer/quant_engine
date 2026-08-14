import { useState } from "react";
import { Play, RotateCcw, TestTube2 } from "lucide-react";
import { injectTick } from "../../services/strategies";

const PRESETS = {
  Breakout: "100,101,102,103,105,107",
  Reversal: "105,104,103,101,99,98",
  Chop: "100,101,100.5,101.2,100.8,101",
};

export default function ReplayView() {
  const [symbol, setSymbol] = useState("AAPL");
  const [prices, setPrices] = useState(PRESETS.Breakout);
  const [status, setStatus] = useState("Ready");
  const [running, setRunning] = useState(false);

  const runReplay = async () => {
    const parsed = prices.split(",").map((p) => Number(p.trim())).filter((p) => Number.isFinite(p) && p > 0);
    if (!parsed.length) return setStatus("Enter a valid comma-separated price path.");

    setRunning(true);
    setStatus("Injecting ticks...");
    try {
      for (const [index, price] of parsed.entries()) {
        await injectTick({ symbol: symbol.toUpperCase(), price, volume: 1, timestamp: Date.now() + index });
      }
      setStatus(`Injected ${parsed.length} ticks for ${symbol.toUpperCase()}.`);
    } catch {
      setStatus("Replay failed. Check that the C++ engine is running.");
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-[#8B8178]">
          <TestTube2 className="h-4 w-4 text-[#D6A15F]" /> Replay Lab
        </div>
        <h2 className="text-2xl font-bold text-[#F5F1EB]">Strategy Replay</h2>
        <p className="mt-2 text-sm text-[#A79B91]">Inject deterministic ticks into the live runtime path.</p>
      </div>

      <section className="rounded-xl border border-[#2A2420] bg-[#1C1815] p-5">
        <div className="grid grid-cols-12 gap-4">
          <input value={symbol} onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            className="col-span-2 rounded-lg border border-[#3C342E] bg-[#2A2420] px-3 py-3 text-[#F5F1EB] outline-none" />
          <input value={prices} onChange={(e) => setPrices(e.target.value)}
            className="col-span-8 rounded-lg border border-[#3C342E] bg-[#2A2420] px-3 py-3 text-[#F5F1EB] outline-none" />
          <button onClick={runReplay} disabled={running}
            className="col-span-2 flex items-center justify-center gap-2 rounded-lg bg-[#D6A15F] font-semibold text-[#171411] disabled:opacity-50">
            <Play size={16} /> {running ? "Running" : "Run"}
          </button>
        </div>

        <div className="mt-4 flex gap-3">
          {Object.entries(PRESETS).map(([name, path]) => (
            <button key={name} onClick={() => setPrices(path)}
              className="rounded-lg border border-[#3C342E] bg-[#211D1A] px-3 py-2 text-xs text-[#B8ADA3] hover:border-[#D6A15F]">
              {name}
            </button>
          ))}
          <button onClick={() => setPrices("")}
            className="ml-auto flex items-center gap-2 rounded-lg border border-[#3C342E] px-3 py-2 text-xs text-[#B8ADA3]">
            <RotateCcw size={14} /> Clear
          </button>
        </div>

        <div className="mt-5 rounded-lg border border-[#2A2420] bg-[#211D1A] p-4 font-mono text-sm text-[#D6A15F]">
          {status}
        </div>
      </section>
    </div>
  );
}