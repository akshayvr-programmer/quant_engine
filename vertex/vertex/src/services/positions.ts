import { api } from "./api";

export interface Position {
    symbol: string;
    quantity: number;
    averageCost: number;
    realizedPnL: number;
    unrealizedPnL: number;
}

export async function getPositions() {
    const response = await api.get<Position[]>("/positions");
    return response.data;
}
