import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { seedLiquidity } from "../../services/liquidity";

export default function SeedLiquidity() {
  const [symbol, setSymbol] = useState("AAPL");
  const [price, setPrice] = useState(100);
  const [quantity, setQuantity] = useState(10000);
  const [side, setSide] = useState<"BUY" | "SELL">("SELL");

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: seedLiquidity,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orderbook"] });
      queryClient.invalidateQueries({ queryKey: ["account"] });
      queryClient.invalidateQueries({ queryKey: ["positions"] });
      queryClient.invalidateQueries({ queryKey: ["trades"] });
    },

    onError: (error) => {
      console.error(error);
    },
  });

  const handleSeed = () => {
    mutation.mutate({
      symbol,
      quantity,
      price,
      side,
    });
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

      {/* Side */}
      <div>
        <label className="mb-2 block text-sm text-[#B8ADA3]">
          Liquidity Side
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

      {/* Price + Quantity */}
      <div className="grid grid-cols-2 gap-4">

        <div>
          <label className="mb-2 block text-sm text-[#B8ADA3]">
            Price
          </label>

          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full rounded-xl border border-[#3A322C] bg-[#2A2420] px-4 py-3 text-white outline-none transition focus:border-[#D6A15F]"
          />
        </div>

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

      </div>

      <div className="mt-auto border-t border-[#3A322C] pt-5">

        <button
          type="button"
          onClick={handleSeed}
          disabled={mutation.isPending}
          className="w-full rounded-xl bg-[#4F8EF7] py-4 font-semibold text-white transition hover:bg-[#6AA4FF] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {mutation.isPending
            ? "Seeding..."
            : `Seed ${side} Liquidity`}
        </button>

      </div>

    </div>
  );
}