import { useQuery } from "@tanstack/react-query";
import { getTrades } from "../services/trades";

export function useTrades() {
    return useQuery({
        queryKey: ["trades"],
        queryFn: getTrades,
        refetchInterval: 1000,
    });
}
