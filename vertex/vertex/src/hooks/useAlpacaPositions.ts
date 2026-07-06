import { useQuery } from "@tanstack/react-query";

import { getAlpacaPositions } from "../services/alpaca";

export function useAlpacaPositions() {

    return useQuery({

        queryKey: ["alpaca-positions"],

        queryFn: getAlpacaPositions,

        refetchInterval: 3000,

    });

}
