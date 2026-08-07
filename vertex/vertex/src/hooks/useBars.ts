import { useQuery } from "@tanstack/react-query";

import { getBars } from "../services/alpaca";

export function useBars(symbol = "AAPL") {

    return useQuery({

        queryKey: ["alpaca-bars", symbol],

        queryFn: () => getBars(symbol),

        refetchInterval: 5000,

    });

}
