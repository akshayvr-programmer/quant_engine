import { useQuery } from "@tanstack/react-query";

import { getAlpacaAccount } from "../services/alpaca";

export function useAlpacaAccount() {

    return useQuery({

        queryKey: ["alpaca-account"],

        queryFn: getAlpacaAccount,

        refetchInterval: 3000,

    });

}
