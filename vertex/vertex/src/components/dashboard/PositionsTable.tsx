import { useAlpacaPositions } from "../../hooks/useAlpacaPositions";
import type { AlpacaPosition } from "../../services/types/alpaca";
export default function PositionsTable() {

    const { data, isLoading } = useAlpacaPositions();

    if (isLoading) {
        return (
            <p className="text-[#A79B91]">
                Loading...
            </p>
        );
    }

    if (!data?.length) {
        return (
            <p className="text-[#A79B91]">
                No Open Positions
            </p>
        );
    }

    return (

        <table className="w-full text-left">

            <thead>

                <tr className="border-b border-[#3A322C] text-[#A79B91]">

                    <th className="pb-3">Symbol</th>

                    <th className="pb-3">Qty</th>

                    <th className="pb-3">Avg Price</th>

                    <th className="pb-3">Current</th>

                    <th className="pb-3">Market Value</th>

                    <th className="pb-3">PnL</th>

                </tr>

            </thead>

            <tbody>

                {data.map((position: AlpacaPosition) => (

                    <tr
                        key={position.symbol}
                        className="border-t border-[#3A322C]"
                    >

                        <td className="py-3 font-medium">
                            {position.symbol}
                        </td>

                        <td>
                            {position.quantity}
                        </td>

                        <td>
                            ${position.averageEntryPrice.toFixed(2)}
                        </td>

                        <td>
                            ${position.currentPrice.toFixed(2)}
                        </td>

                        <td>
                            ${position.marketValue.toFixed(2)}
                        </td>

                        <td
                            className={
                                position.unrealizedPnL >= 0
                                    ? "text-green-400 font-semibold"
                                    : "text-red-400 font-semibold"
                            }
                        >
                            ${position.unrealizedPnL.toFixed(2)}
                        </td>

                    </tr>

                ))}

            </tbody>

        </table>

    );
}
