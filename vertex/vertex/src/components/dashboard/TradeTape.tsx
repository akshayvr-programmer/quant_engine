import { useAlpacaOrders } from "../../hooks/useAlpacaOrders";
import type { AlpacaOrder } from "../../services/types/alpaca";


export default function TradeTape() {

    const { data, isLoading } = useAlpacaOrders();

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center text-[#8B8178]">
                Loading Trades...
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col overflow-y-auto">

            <div className="grid grid-cols-5 border-b border-[#3A322C] pb-2 text-xs uppercase tracking-wider text-[#8B8178]">

                <span>Side</span>

                <span>Symbol</span>

                <span>Qty</span>

                <span>Price</span>

                <span className="text-right">Time</span>

            </div>

            {!data?.length && (

                <div className="flex flex-1 items-center justify-center text-[#5F5750]">

                    No Filled Orders

                </div>

            )}

            {data?.map((order: AlpacaOrder, index: number) => (

                <div
                    key={index}
                    className="grid grid-cols-5 border-b border-[#2E2925] py-2 text-sm"
                >

                    <span
                        className={
                            order.side === "buy"
                                ? "font-semibold text-green-400"
                                : "font-semibold text-red-400"
                        }
                    >
                        {order.side.toUpperCase()}
                    </span>

                    <span>

                        {order.symbol}

                    </span>

                    <span>

                        {order.quantity}

                    </span>

                    <span>

                        ${order.filledPrice.toFixed(2)}

                    </span>

                    <span className="text-right text-[#B8ADA3]">

                        {new Date(order.filledAt).toLocaleTimeString()}

                    </span>

                </div>

            ))}

        </div>
    );

}