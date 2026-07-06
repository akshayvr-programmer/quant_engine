import api from "./api";

export async function submitAlpacaOrder(order: {
    symbol: string;
    side: "BUY" | "SELL";
    type: "MARKET" | "LIMIT";
    quantity: number;
    price?: number;
}) {
    const response = await api.post(
        "/alpaca/order",
        order
    );

    return response.data;
}
