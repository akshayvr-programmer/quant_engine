import { useQuery } from "@tanstack/react-query";

import { getBars } from "../services/alpaca";

export function useBars() {

    return useQuery({

        queryKey: ["alpaca-bars"],

        queryFn: getBars,

        refetchInterval: 5000,

    });

}
