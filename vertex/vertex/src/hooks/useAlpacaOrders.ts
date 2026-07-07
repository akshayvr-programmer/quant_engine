import { useQuery } from "@tanstack/react-query";

import { getAlpacaOrders } from "../services/alpaca";

export function useAlpacaOrders() {

    return useQuery({

        queryKey: ["alpaca-orders"],

        queryFn: getAlpacaOrders,

        refetchInterval: 3000,

    });

}
