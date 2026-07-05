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

  return (
    <div className="flex h-full flex-col">

      {/* Header */}
      <div className="grid grid-cols-2 border-b border-[#3A322C] pb-2 text-xs uppercase tracking-widest text-[#8B8178]">
        <span>Quantity</span>
        <span className="text-right">Price</span>
      </div>

      {/* Asks */}
      <div className="flex-1 pt-2">

        {data?.asks.length ? (
          data.asks.map((level) => (
            <div
              key={`ask-${level.price}`}
              className="grid grid-cols-2 py-2 text-sm"
            >
              <span>{level.quantity}</span>

              <span className="text-right text-red-400">
                ${level.price.toFixed(2)}
              </span>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-[#5F5750]">
            No Sell Orders
          </div>
        )}

      </div>

      <div className="my-2 border-t border-[#3A322C]" />

      {/* Bids */}
      <div className="flex-1">

        {data?.bids.length ? (
          data.bids.map((level) => (
            <div
              key={`bid-${level.price}`}
              className="grid grid-cols-2 py-2 text-sm"
            >
              <span>{level.quantity}</span>

              <span className="text-right text-green-400">
                ${level.price.toFixed(2)}
              </span>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-[#5F5750]">
            No Buy Orders
          </div>
        )}

      </div>

    </div>
  );
}