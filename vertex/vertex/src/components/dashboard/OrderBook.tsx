import { useLatestQuote } from "../../hooks/useLatestQuote";

export default function OrderBook() {

    const {

        data,

        isLoading,

    } = useLatestQuote("AAPL");

    if (isLoading) {

        return (

            <div className="flex h-full items-center justify-center text-[#8B8178]">

                Loading Quote...

            </div>

        );

    }

    const spread =
        data
            ? data.askPrice - data.bidPrice
            : 0;

    return (

        <div className="flex h-full flex-col justify-center">

            {/* Header */}

            <div className="grid grid-cols-2 border-b border-[#3A322C] pb-3 text-xs uppercase tracking-widest text-[#8B8178]">

                <span>Size</span>

                <span className="text-right">
                    Price
                </span>

            </div>

            {/* Ask */}

            <div className="mt-6 rounded-lg border border-red-900/40 bg-red-950/20 p-4">

                <div className="mb-2 text-xs uppercase tracking-widest text-red-300">

                    Ask

                </div>

                <div className="grid grid-cols-2 items-center">

                    <span className="text-lg font-semibold text-white">

                        {data?.askSize.toLocaleString()}

                    </span>

                    <span className="text-right text-xl font-bold text-red-400">

                        ${data?.askPrice.toFixed(2)}

                    </span>

                </div>

            </div>

            {/* Spread */}

            <div className="my-6 rounded-lg border border-[#3A322C] bg-[#211C18] p-4 text-center">

                <div className="mb-1 text-xs uppercase tracking-widest text-[#8B8178]">

                    Spread

                </div>

                <div className="text-lg font-semibold text-[#D6A15F]">

                    ${spread.toFixed(2)}

                </div>

            </div>

            {/* Bid */}

            <div className="rounded-lg border border-green-900/40 bg-green-950/20 p-4">

                <div className="mb-2 text-xs uppercase tracking-widest text-green-300">

                    Bid

                </div>

                <div className="grid grid-cols-2 items-center">

                    <span className="text-lg font-semibold text-white">

                        {data?.bidSize.toLocaleString()}

                    </span>

                    <span className="text-right text-xl font-bold text-green-400">

                        ${data?.bidPrice.toFixed(2)}

                    </span>

                </div>

            </div>

        </div>

    );

}
