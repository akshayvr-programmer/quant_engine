import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useOpenOrders } from "../../hooks/useOpenOrders";
import { cancelOrder } from "../../services/alpaca";

export default function OpenOrders() {

    const queryClient = useQueryClient();

    const { data, isLoading } = useOpenOrders();

    const mutation = useMutation({

        mutationFn: cancelOrder,

        onSuccess: () => {

            queryClient.invalidateQueries({

                queryKey: ["alpaca-open-orders"]

            });

        }

    });

    if (isLoading) {

        return (

            <div className="flex h-full items-center justify-center text-[#8B8178]">

                Loading...

            </div>

        );

    }

    if (!data?.length) {

        return (

            <div className="flex h-full items-center justify-center text-[#5F5750]">

                No Open Orders

            </div>

        );

    }

    return (

        <div className="flex h-full flex-col">

            {/* Header */}

            <div className="grid grid-cols-6 border-b border-[#3A322C] pb-2 text-xs uppercase tracking-widest text-[#8B8178]">

                <span>Side</span>

                <span>Symbol</span>

                <span>Type</span>

                <span>Qty</span>

                <span>Price</span>

                <span className="text-right">Action</span>

            </div>

            {/* Orders */}

            <div className="flex-1 overflow-y-auto">

                {data.map((order) => (

                    <div
                        key={order.id}
                        className="grid grid-cols-6 items-center border-b border-[#2A2420] py-3 text-sm"
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

                        <span className="font-medium">

                            {order.symbol}

                        </span>

                        <span className="text-[#B8ADA3]">

                            {order.type.toUpperCase()}

                        </span>

                        <span>

                            {order.quantity}

                        </span>

                        <span>

                            {order.limitPrice > 0
                                ? `$${order.limitPrice.toFixed(2)}`
                                : "Market"}

                        </span>

                        <div className="flex justify-end">

                            <button

                                onClick={() => mutation.mutate(order.id)}

                                className="rounded-md bg-red-600 px-3 py-1 text-xs font-semibold text-white transition hover:bg-red-700"

                            >

                                Cancel

                            </button>

                        </div>

                    </div>

                ))}

            </div>

        </div>

    );

}