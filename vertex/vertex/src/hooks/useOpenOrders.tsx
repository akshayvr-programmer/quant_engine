import { useQuery } from "@tanstack/react-query";

import { getOpenOrders } from "../services/alpaca";

export function useOpenOrders() {

    return useQuery({

        queryKey: ["alpaca-open-orders"],

        queryFn: getOpenOrders,

        refetchInterval: 2000,

    });

}