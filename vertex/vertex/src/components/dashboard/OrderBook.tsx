import { useOrderBook } from "../../hooks/useOrderBook";

export default function OrderBook() {
  const { data, isLoading } = useOrderBook("AAPL");

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center text-[#8B8178]">
        Loading Order Book...
      </div>
    );
  }

  // Enforce ordering regardless of what the feed sends.
  // Asks ascending, then reversed for display so the best ask
  // sits at the bottom, adjacent to the spread.
  const asks = [...(data?.asks ?? [])]
    .sort((a, b) => a.price - b.price)
    .reverse();

  // Bids descending: best bid at the top, adjacent to the spread.
  const bids = [...(data?.bids ?? [])].sort((a, b) => b.price - a.price);

  const bestAsk = asks.at(-1)?.price;
  const bestBid = bids[0]?.price;
  const spread =
    bestAsk !== undefined && bestBid !== undefined
      ? bestAsk - bestBid
      : undefined;

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="grid grid-cols-2 border-b border-[#3A322C] pb-2 text-xs uppercase tracking-widest text-[#8B8178]">
        <span>Quantity</span>
        <span className="text-right">Price</span>
      </div>

      {/* Asks — bottom-aligned so best ask hugs the spread line */}
      <div className="flex flex-1 flex-col justify-end overflow-y-auto pt-2">
        {asks.length ? (
          asks.map((level) => (
            <div
              key={`ask-${level.price}`}
              className="grid grid-cols-2 py-2 text-sm"
            >
              <span>{level.quantity.toLocaleString()}</span>
              <span className="text-right text-red-400">
                ${level.price.toFixed(2)}
              </span>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-[#5F5750]">No Sell Orders</div>
        )}
      </div>

      {/* Spread */}
      <div className="my-2 flex items-center justify-between border-y border-[#3A322C] py-1.5 text-xs text-[#8B8178]">
        <span className="uppercase tracking-widest">Spread</span>
        <span>{spread !== undefined ? `$${spread.toFixed(2)}` : "—"}</span>
      </div>

      {/* Bids — top-aligned so best bid hugs the spread line */}
      <div className="flex-1 overflow-y-auto">
        {bids.length ? (
          bids.map((level) => (
            <div
              key={`bid-${level.price}`}
              className="grid grid-cols-2 py-2 text-sm"
            >
              <span>{level.quantity.toLocaleString()}</span>
              <span className="text-right text-green-400">
                ${level.price.toFixed(2)}
              </span>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-[#5F5750]">No Buy Orders</div>
        )}
      </div>
    </div>
  );
}