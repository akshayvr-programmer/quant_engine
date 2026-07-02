import { useQuery } from "@tanstack/react-query";
import { getPositions } from "../../services/positions";

export default function PositionsTable() {

    const { data, isLoading } = useQuery({
        queryKey: ["positions"],
        queryFn: getPositions,
        refetchInterval: 1000,
    });

    if (isLoading) {
        return <p>Loading...</p>;
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

                <tr className="text-[#A79B91]">

                    <th>Symbol</th>

                    <th>Qty</th>

                    <th>Avg</th>

                    <th>Unrealized</th>

                </tr>

            </thead>

            <tbody>

                {data.map(position => (

                    <tr
                        key={position.symbol}
                        className="border-t border-[#3A322C]"
                    >

                        <td className="py-3">
                            {position.symbol}
                        </td>

                        <td>
                            {position.quantity}
                        </td>

                        <td>
                            ${position.averageCost.toFixed(2)}
                        </td>

                        <td
                            className={
                                position.unrealizedPnL >= 0
                                    ? "text-green-400"
                                    : "text-red-400"
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