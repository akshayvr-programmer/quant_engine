import { useMemo, useState } from "react";
import { Activity, Play, RotateCcw, TestTube2, Zap } from "lucide-react";
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

  const parsedPrices = useMemo(
    () =>
      prices
        .split(",")
        .map((p) => Number(p.trim()))
        .filter((p) => Number.isFinite(p) && p > 0),
    [prices]
  );

  const min = parsedPrices.length ? Math.min(...parsedPrices) : 0;
  const max = parsedPrices.length ? Math.max(...parsedPrices) : 0;
  const move =
    parsedPrices.length > 1
      ? ((parsedPrices[parsedPrices.length - 1] - parsedPrices[0]) / parsedPrices[0]) * 100
      : 0;

  const runReplay = async () => {
    if (!parsedPrices.length) return setStatus("Enter a valid comma-separated price path.");

    setRunning(true);
    setStatus("Injecting ticks...");
    try {
      for (const [index, price] of parsedPrices.entries()) {
        await injectTick({ symbol: symbol.toUpperCase(), price, volume: 1, timestamp: Date.now() + index });
      }
      setStatus(`Injected ${parsedPrices.length} ticks for ${symbol.toUpperCase()}.`);
    } catch {
      setStatus("Replay failed. Check that the C++ engine is running.");
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="flex min-h-full flex-col gap-5">
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-[#8B8178]">
          <TestTube2 className="h-4 w-4 text-[#D6A15F]" /> Replay Lab
        </div>
        <h2 className="text-2xl font-bold text-[#F5F1EB]">Market Replay</h2>
        <p className="mt-2 text-sm text-[#A79B91]">Inject deterministic tick paths into the same runtime used by live strategies.</p>
      </div>

      <section className="rounded-lg border border-[#2A2420] bg-[#1C1815] p-5">
        <div className="grid grid-cols-12 gap-4">
          <input value={symbol} onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            className="col-span-2 rounded-md border border-[#3C342E] bg-[#2A2420] px-3 py-3 text-[#F5F1EB] outline-none focus:border-[#D6A15F]" />
          <input value={prices} onChange={(e) => setPrices(e.target.value)}
            className="col-span-8 rounded-md border border-[#3C342E] bg-[#2A2420] px-3 py-3 font-mono text-sm text-[#F5F1EB] outline-none focus:border-[#D6A15F]" />
          <button onClick={runReplay} disabled={running}
            className="col-span-2 flex items-center justify-center gap-2 rounded-md bg-[#D6A15F] font-semibold text-[#171411] disabled:opacity-50">
            <Play size={16} /> {running ? "Running" : "Run"}
          </button>
        </div>

        <div className="mt-4 flex gap-3">
          {Object.entries(PRESETS).map(([name, path]) => (
            <button key={name} onClick={() => setPrices(path)}
              className="rounded-md border border-[#3C342E] bg-[#211D1A] px-3 py-2 text-xs text-[#B8ADA3] hover:border-[#D6A15F]">
              {name}
            </button>
          ))}
          <button onClick={() => setPrices("")}
            className="ml-auto flex items-center gap-2 rounded-md border border-[#3C342E] px-3 py-2 text-xs text-[#B8ADA3]">
            <RotateCcw size={14} /> Clear
          </button>
        </div>

        <div className="mt-5 grid grid-cols-4 gap-3">
          <div className="rounded-md border border-[#2A2420] bg-[#211D1A] p-4">
            <div className="text-xs uppercase tracking-widest text-[#8B8178]">Ticks</div>
            <div className="mt-2 font-mono text-xl font-bold text-[#F5F1EB]">{parsedPrices.length}</div>
          </div>
          <div className="rounded-md border border-[#2A2420] bg-[#211D1A] p-4">
            <div className="text-xs uppercase tracking-widest text-[#8B8178]">Range</div>
            <div className="mt-2 font-mono text-xl font-bold text-[#F5F1EB]">{min ? `${min.toFixed(2)}-${max.toFixed(2)}` : "--"}</div>
          </div>
          <div className="rounded-md border border-[#2A2420] bg-[#211D1A] p-4">
            <div className="text-xs uppercase tracking-widest text-[#8B8178]">Move</div>
            <div className={`mt-2 font-mono text-xl font-bold ${move >= 0 ? "text-[#6FCF97]" : "text-[#E57373]"}`}>
              {parsedPrices.length > 1 ? `${move >= 0 ? "+" : ""}${move.toFixed(2)}%` : "--"}
            </div>
          </div>
          <div className="rounded-md border border-[#2A2420] bg-[#211D1A] p-4">
            <div className="text-xs uppercase tracking-widest text-[#8B8178]">Target</div>
            <div className="mt-2 font-mono text-xl font-bold text-[#D6A15F]">{symbol || "--"}</div>
          </div>
        </div>

        <div className="mt-5 rounded-md border border-[#2A2420] bg-[#14110F] p-4">
          <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-widest text-[#8B8178]">
            <Activity className="h-4 w-4 text-[#D6A15F]" />
            Path Preview
          </div>
          <div className="flex h-56 items-end gap-2">
            {parsedPrices.map((price, index) => {
              const height = max === min ? 50 : 18 + ((price - min) / (max - min)) * 82;
              return (
                <div key={`${price}-${index}`} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t bg-[#D6A15F]"
                    style={{ height: `${height}%` }}
                    title={`${symbol.toUpperCase()} ${price}`}
                  />
                  <span className="font-mono text-[10px] text-[#8B8178]">{index + 1}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3 rounded-md border border-[#2A2420] bg-[#211D1A] p-4 font-mono text-sm text-[#D6A15F]">
          <Zap className="h-4 w-4" />
          {status}
        </div>
      </section>
    </div>
  );
}
