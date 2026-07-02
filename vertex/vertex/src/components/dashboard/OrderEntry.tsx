import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitOrder } from "../../services/orders";

export default function OrderEntry() {
  const [side, setSide] = useState<"BUY" | "SELL">("BUY");
  const [type, setType] = useState<"MARKET" | "LIMIT">("MARKET");

  const [symbol, setSymbol] = useState("AAPL");
  const [quantity, setQuantity] = useState(100);
  const [price, setPrice] = useState(100);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: submitOrder,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account"] });
      queryClient.invalidateQueries({ queryKey: ["positions"] });
      queryClient.invalidateQueries({ queryKey: ["trades"] });
      queryClient.invalidateQueries({ queryKey: ["orderbook"] });
    },

    onError: (error) => {
      console.error(error);
    },
  });

  const executeOrder = () => {
  const order = {
    symbol,
    side,
    type,
    quantity,
    ...(type === "LIMIT" ? { price } : {}),
  };

  console.log(order);

  mutation.mutate(order);
};


  return (
    <div className="flex h-full flex-col gap-4">

      {/* Symbol */}
      <div>
        <label className="mb-2 block text-sm text-[#B8ADA3]">
          Symbol
        </label>

        <input
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          className="w-full rounded-xl border border-[#3A322C] bg-[#2A2420] px-4 py-3 text-white outline-none transition focus:border-[#D6A15F]"
        />
      </div>

      {/* Side + Order Type */}
      <div className="grid grid-cols-2 gap-4">

        {/* Side */}
        <div>
          <label className="mb-2 block text-sm text-[#B8ADA3]">
            Side
          </label>

          <div className="grid grid-cols-2 gap-2">

            <button
              type="button"
              onClick={() => setSide("BUY")}
              className={`rounded-xl py-3 font-semibold transition ${
                side === "BUY"
                  ? "bg-green-600 text-white"
                  : "bg-[#2A2420] text-[#B8ADA3] hover:bg-[#35302C]"
              }`}
            >
              BUY
            </button>

            <button
              type="button"
              onClick={() => setSide("SELL")}
              className={`rounded-xl py-3 font-semibold transition ${
                side === "SELL"
                  ? "bg-red-600 text-white"
                  : "bg-[#2A2420] text-[#B8ADA3] hover:bg-[#35302C]"
              }`}
            >
              SELL
            </button>

          </div>
        </div>

        {/* Order Type */}
        <div>
          <label className="mb-2 block text-sm text-[#B8ADA3]">
            Order Type
          </label>

          <div className="grid grid-cols-2 gap-2">

            <button
              type="button"
              onClick={() => setType("MARKET")}
              className={`rounded-xl py-3 font-semibold transition ${
                type === "MARKET"
                  ? "bg-[#D6A15F] text-[#171411]"
                  : "bg-[#2A2420] text-[#B8ADA3] hover:bg-[#35302C]"
              }`}
            >
              MARKET
            </button>

            <button
              type="button"
              onClick={() => setType("LIMIT")}
              className={`rounded-xl py-3 font-semibold transition ${
                type === "LIMIT"
                  ? "bg-[#D6A15F] text-[#171411]"
                  : "bg-[#2A2420] text-[#B8ADA3] hover:bg-[#35302C]"
              }`}
            >
              LIMIT
            </button>

          </div>
        </div>

      </div>

      {/* Quantity + Price */}
      <div
        className={`grid gap-4 ${
          type === "LIMIT" ? "grid-cols-2" : "grid-cols-1"
        }`}
      >
        <div>
          <label className="mb-2 block text-sm text-[#B8ADA3]">
            Quantity
          </label>

          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full rounded-xl border border-[#3A322C] bg-[#2A2420] px-4 py-3 text-white outline-none transition focus:border-[#D6A15F]"
          />
        </div>

        {type === "LIMIT" && (
          <div>
            <label className="mb-2 block text-sm text-[#B8ADA3]">
              Limit Price
            </label>

            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full rounded-xl border border-[#3A322C] bg-[#2A2420] px-4 py-3 text-white outline-none transition focus:border-[#D6A15F]"
            />
          </div>
        )}
      </div>

      {/* Execute Button */}
      <div className="mt-auto border-t border-[#3A322C] pt-5">

        <button
          type="button"
          onClick={executeOrder}
          disabled={mutation.isPending}
          className="w-full rounded-xl bg-[#D6A15F] py-4 font-semibold text-[#171411] transition hover:bg-[#E0AF74] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {mutation.isPending
            ? "Submitting..."
            : `Execute ${side} Order`}
        </button>

      </div>

    </div>
  );
}
