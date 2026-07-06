import  api  from "./api";

export interface OrderRequest {
    symbol: string;
    side: "BUY" | "SELL";
    type: "MARKET" | "LIMIT";
    quantity: number;
    price?: number;
}

export interface OrderResponse {
    success: boolean;
    tradesExecuted: number;
    eventsGenerated: number;
}

export async function submitOrder(order: OrderRequest) {
    const response = await api.post<OrderResponse>(
        "/order",
        order
    );

    return response.data;
}
