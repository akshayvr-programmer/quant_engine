import { api } from "./api";
import type { OrderBookResponse } from "./types/orderbook";

export async function getOrderBook(symbol: string) {
  const response = await api.get<OrderBookResponse>(
    `/book/${symbol}`
  );

  return response.data;
}