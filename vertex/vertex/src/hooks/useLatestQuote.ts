import { useQuery } from "@tanstack/react-query";

import { getLatestQuote } from "../services/alpaca";

export function useLatestQuote(
    symbol: string
) {

    return useQuery({

        queryKey: [
            "alpaca-quote",
            symbol
        ],

        queryFn: () =>
            getLatestQuote(symbol),

        refetchInterval: 1000,

    });

}


