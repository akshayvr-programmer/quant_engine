export interface Trade {
    buyOrderId: number;
    sellOrderId: number;
    symbol: string;
    side: "BUY" | "SELL";
    price: number;
    quantity: number;
    timestamp: number;
}
