import { useMemo, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  ChartCandlestick,
  Globe2,
  Newspaper,
  Radar,
  Search,
} from "lucide-react";

import MarketChart from "./MarketChart";
import { getLatestQuote } from "../../services/alpaca";

const WATCHLIST = ["AAPL", "MSFT", "NVDA", "TSLA", "SPY", "QQQ"];

const GLOBAL_MARKETS = [
  { name: "S&P 500", region: "US", value: "6,244.91", change: 0.38 },
  { name: "Nasdaq 100", region: "US", value: "22,811.42", change: 0.62 },
  { name: "Dow Jones", region: "US", value: "44,128.18", change: -0.12 },
  { name: "Nikkei 225", region: "Japan", value: "40,582.20", change: 0.44 },
  { name: "FTSE 100", region: "UK", value: "8,936.33", change: -0.21 },
  { name: "DAX", region: "Germany", value: "24,192.50", change: 0.18 },
];

const DEVELOPMENTS = [
  {
    label: "Macro",
    title: "Rates remain the central driver for equity duration and dollar strength.",
    impact: "Watch yields, USD, and mega-cap growth sensitivity.",
  },
  {
    label: "Energy",
    title: "Crude volatility can reprice inflation expectations quickly.",
    impact: "Useful cross-check for transport, industrials, and consumer names.",
  },
  {
    label: "Asia",
    title: "Overnight risk tone often sets the early US futures tape.",
    impact: "Compare Nikkei, Hang Seng, and USD/JPY before US cash open.",
  },
  {
    label: "AI",
    title: "Semiconductor leadership remains a high-beta market signal.",
    impact: "Track NVDA, SOXX proxies, and breadth beneath the headline move.",
  },
];

const NEWSWIRE = [
  {
    source: "Provider pending",
    time: "Live feed slot",
    title: "Connect a news API here for real-time market headlines.",
    tone: "neutral",
  },
  {
    source: "Market desk",
    time: "Pre-open",
    title: "Focus list: index futures, yields, dollar, oil, and mega-cap tech.",
    tone: "positive",
  },
  {
    source: "Risk monitor",
    time: "Intraday",
    title: "Alert when spread, volume, or volatility moves outside normal range.",
    tone: "warning",
  },
];

function formatPrice(value?: number) {
  if (value === undefined || Number.isNaN(value)) {
    return "--";
  }

  return `$${value.toFixed(2)}`;
}

function getMidpoint(bid?: number, ask?: number) {
  if (!bid || !ask) {
    return undefined;
  }

  return (bid + ask) / 2;
}

function ChangePill({ value }: { value: number }) {
  const positive = value >= 0;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold ${
        positive
          ? "bg-[#6FCF97]/10 text-[#6FCF97]"
          : "bg-[#E57373]/10 text-[#E57373]"
      }`}
    >
      {positive ? (
        <ArrowUpRight className="h-3.5 w-3.5" />
      ) : (
        <ArrowDownRight className="h-3.5 w-3.5" />
      )}
      {positive ? "+" : ""}
      {value.toFixed(2)}%
    </span>
  );
}

export default function MarketsView() {
  const [selectedSymbol, setSelectedSymbol] = useState("AAPL");
  const [symbolInput, setSymbolInput] = useState("AAPL");

  const quoteQueries = useQueries({
    queries: WATCHLIST.map((symbol) => ({
      queryKey: ["alpaca-quote", symbol],
      queryFn: () => getLatestQuote(symbol),
      refetchInterval: 2000,
      retry: 1,
    })),
  });

  const quotes = useMemo(
    () =>
      WATCHLIST.map((symbol, index) => ({
        symbol,
        quote: quoteQueries[index].data,
        isLoading: quoteQueries[index].isLoading,
        isError: quoteQueries[index].isError,
      })),
    [quoteQueries]
  );

  const selectedQuote =
    quotes.find((item) => item.symbol === selectedSymbol)?.quote;

  const spread =
    selectedQuote && selectedQuote.askPrice > 0 && selectedQuote.bidPrice > 0
      ? selectedQuote.askPrice - selectedQuote.bidPrice
      : undefined;

  const handleSymbolSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const nextSymbol = symbolInput.trim().toUpperCase();

    if (nextSymbol) {
      setSelectedSymbol(nextSymbol);
      setSymbolInput(nextSymbol);
    }
  };

  return (
    <div className="flex min-h-full flex-col gap-6">
      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-[#8B8178]">
            <Globe2 className="h-4 w-4 text-[#D6A15F]" />
            Markets Command Center
          </div>
          <h2 className="text-2xl font-bold text-[#F5F1EB]">
            Global Market Intelligence
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-[#A79B91]">
            Live quote monitoring, chart context, macro developments, and market
            performance in one trader-focused workspace.
          </p>
        </div>

        <form
          onSubmit={handleSymbolSubmit}
          className="flex w-80 items-center gap-2 rounded-xl border border-[#3C342E] bg-[#1C1815] p-2"
        >
          <Search className="h-4 w-4 text-[#8B8178]" />
          <input
            value={symbolInput}
            onChange={(event) => setSymbolInput(event.target.value.toUpperCase())}
            className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#F5F1EB] outline-none placeholder:text-[#5F5750]"
            placeholder="AAPL"
          />
          <button
            type="submit"
            className="rounded-lg bg-[#D6A15F] px-3 py-2 text-xs font-bold text-[#171411] transition hover:bg-[#E0AF74]"
          >
            Load
          </button>
        </form>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <section className="col-span-8 flex min-h-[520px] flex-col rounded-xl border border-[#2A2420] bg-[#1C1815]">
          <div className="flex items-center justify-between border-b border-[#2A2420] px-5 py-4">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#8B8178]">
                <ChartCandlestick className="h-4 w-4 text-[#D6A15F]" />
                Primary Chart
              </div>
              <div className="mt-2 flex items-end gap-3">
                <h3 className="text-xl font-bold text-[#F5F1EB]">
                  {selectedSymbol}
                </h3>
                <span className="text-sm text-[#A79B91]">
                  Mid {formatPrice(getMidpoint(selectedQuote?.bidPrice, selectedQuote?.askPrice))}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-right">
              <div>
                <div className="text-xs text-[#8B8178]">Bid</div>
                <div className="font-mono text-sm text-[#6FCF97]">
                  {formatPrice(selectedQuote?.bidPrice)}
                </div>
              </div>
              <div>
                <div className="text-xs text-[#8B8178]">Ask</div>
                <div className="font-mono text-sm text-[#E57373]">
                  {formatPrice(selectedQuote?.askPrice)}
                </div>
              </div>
              <div>
                <div className="text-xs text-[#8B8178]">Spread</div>
                <div className="font-mono text-sm text-[#F5F1EB]">
                  {spread === undefined ? "--" : spread.toFixed(3)}
                </div>
              </div>
            </div>
          </div>

          <div className="min-h-0 flex-1 p-4">
            <MarketChart symbol={selectedSymbol} />
          </div>
        </section>

        <aside className="col-span-4 flex min-h-[520px] flex-col rounded-xl border border-[#2A2420] bg-[#1C1815]">
          <div className="border-b border-[#2A2420] px-5 py-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#8B8178]">
              <Activity className="h-4 w-4 text-[#D6A15F]" />
              Live Watchlist
            </div>
          </div>

          <div className="scroll-area min-h-0 flex-1 px-5 pb-5 pt-2">
            {quotes.map(({ symbol, quote, isError, isLoading }) => {
              const midpoint = getMidpoint(quote?.bidPrice, quote?.askPrice);
              const active = symbol === selectedSymbol;

              return (
                <button
                  key={symbol}
                  type="button"
                  onClick={() => {
                    setSelectedSymbol(symbol);
                    setSymbolInput(symbol);
                  }}
                  className={`mb-3 grid w-full grid-cols-[1fr_auto] items-center gap-3 rounded-lg border px-4 py-3 text-left transition ${
                    active
                      ? "border-[#D6A15F]/60 bg-[#D6A15F]/10"
                      : "border-[#2A2420] bg-[#211D1A] hover:border-[#3C342E] hover:bg-[#2A2420]"
                  }`}
                >
                  <div>
                    <div className="font-mono text-sm font-bold text-[#F5F1EB]">
                      {symbol}
                    </div>
                    <div className="mt-1 text-xs text-[#8B8178]">
                      {isLoading
                        ? "Loading quote"
                        : isError
                          ? "Quote unavailable"
                          : `Bid ${formatPrice(quote?.bidPrice)} / Ask ${formatPrice(quote?.askPrice)}`}
                    </div>
                  </div>
                  <div className="text-right font-mono text-sm font-semibold text-[#F5F1EB]">
                    {formatPrice(midpoint)}
                  </div>
                </button>
              );
            })}
          </div>
        </aside>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <section className="col-span-7 rounded-xl border border-[#2A2420] bg-[#1C1815]">
          <div className="flex items-center justify-between border-b border-[#2A2420] px-5 py-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#8B8178]">
              <Globe2 className="h-4 w-4 text-[#D6A15F]" />
              Global Performance
            </div>
            <span className="text-xs text-[#8B8178]">Indicative board</span>
          </div>

          <div className="grid grid-cols-2 gap-3 p-5">
            {GLOBAL_MARKETS.map((market) => (
              <div
                key={market.name}
                className="rounded-lg border border-[#2A2420] bg-[#211D1A] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-[#F5F1EB]">
                      {market.name}
                    </div>
                    <div className="mt-1 text-xs text-[#8B8178]">
                      {market.region}
                    </div>
                  </div>
                  <ChangePill value={market.change} />
                </div>
                <div className="mt-5 font-mono text-lg font-bold text-[#F5F1EB]">
                  {market.value}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="col-span-5 rounded-xl border border-[#2A2420] bg-[#1C1815]">
          <div className="flex items-center gap-2 border-b border-[#2A2420] px-5 py-4 text-xs uppercase tracking-widest text-[#8B8178]">
            <Newspaper className="h-4 w-4 text-[#D6A15F]" />
            Market Newswire
          </div>

          <div className="space-y-3 p-5">
            {NEWSWIRE.map((item) => (
              <article
                key={`${item.source}-${item.title}`}
                className="rounded-lg border border-[#2A2420] bg-[#211D1A] p-4"
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-[#D6A15F]">
                    {item.source}
                  </span>
                  <span className="text-xs text-[#8B8178]">{item.time}</span>
                </div>
                <p className="text-sm leading-6 text-[#E5DED6]">{item.title}</p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <section className="col-span-8 rounded-xl border border-[#2A2420] bg-[#1C1815]">
          <div className="flex items-center gap-2 border-b border-[#2A2420] px-5 py-4 text-xs uppercase tracking-widest text-[#8B8178]">
            <Radar className="h-4 w-4 text-[#D6A15F]" />
            Global Developments
          </div>

          <div className="grid grid-cols-2 gap-3 p-5">
            {DEVELOPMENTS.map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-[#2A2420] bg-[#211D1A] p-4"
              >
                <div className="mb-3 text-xs font-bold uppercase tracking-widest text-[#D6A15F]">
                  {item.label}
                </div>
                <h4 className="text-sm font-semibold leading-6 text-[#F5F1EB]">
                  {item.title}
                </h4>
                <p className="mt-3 text-xs leading-5 text-[#A79B91]">
                  {item.impact}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="col-span-4 rounded-xl border border-[#2A2420] bg-[#1C1815]">
          <div className="flex items-center gap-2 border-b border-[#2A2420] px-5 py-4 text-xs uppercase tracking-widest text-[#8B8178]">
            <Bell className="h-4 w-4 text-[#D6A15F]" />
            Desk Alerts
          </div>

          <div className="space-y-3 p-5 text-sm text-[#E5DED6]">
            <div className="rounded-lg border border-[#2A2420] bg-[#211D1A] p-4">
              <div className="mb-1 font-semibold text-[#F5F1EB]">
                Spread monitor
              </div>
              <p className="text-xs leading-5 text-[#A79B91]">
                Flag symbols when bid/ask spread widens beyond your threshold.
              </p>
            </div>
            <div className="rounded-lg border border-[#2A2420] bg-[#211D1A] p-4">
              <div className="mb-1 font-semibold text-[#F5F1EB]">
                Market open readiness
              </div>
              <p className="text-xs leading-5 text-[#A79B91]">
                Use futures, rates, and watchlist liquidity before enabling live
                strategies.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
