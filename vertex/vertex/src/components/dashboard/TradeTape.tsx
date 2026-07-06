import { useTrades } from "../../hooks/useTrades";

export default function TradeTape() {

    const { data, isLoading } = useTrades();

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center text-[#8B8178]">
                Loading Trades...
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col overflow-y-auto">

            <div className="grid grid-cols-4 border-b border-[#3A322C] pb-2 text-xs uppercase tracking-wider text-[#8B8178]">
                <span>Side</span>
                <span>Qty</span>
                <span>Price</span>
                <span className="text-right">Time</span>
            </div>

            {data?.length === 0 && (
                <div className="flex flex-1 items-center justify-center text-[#5F5750]">
                    No Trades Yet
                </div>
            )}

            {data?.map((trade, index) => (

                <div
                    key={index}
                    className="grid grid-cols-4 border-b border-[#2E2925] py-2 text-sm"
                >
                    <span
                        className={
                            trade.side === "BUY"
                                ? "text-green-400"
                                : "text-red-400"
                        }
                    >
                        {trade.side}
                    </span>

                    <span>{trade.quantity}</span>

                    <span>${trade.price.toFixed(2)}</span>

                    <span className="text-right text-[#B8ADA3]">
                        {new Date(trade.timestamp).toLocaleTimeString()}
                    </span>

                </div>

            ))}

        </div>
    );
}