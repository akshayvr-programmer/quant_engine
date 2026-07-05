import { useQuery } from "@tanstack/react-query";
import { getOrderBook } from "../services/orderbook";

export function useOrderBook(symbol: string) {
  return useQuery({
    queryKey: ["orderbook", symbol],
    queryFn: () => getOrderBook(symbol),
    refetchInterval: 1000,
  });
}
