import api from "./api";

import type {
    AlpacaAccount,
    AlpacaPosition,
    AlpacaBar,
} from "../services/types/alpaca";

export async function getAlpacaAccount(): Promise<AlpacaAccount> {

    const response =
        await api.get<AlpacaAccount>(
            "/alpaca/account"
        );

    return response.data;
}

export async function getAlpacaPositions(): Promise<AlpacaPosition[]> {

    const response =
        await api.get<AlpacaPosition[]>(
            "/alpaca/positions"
        );

    return response.data;
}

export async function getBars(): Promise<{
    bars: AlpacaBar[];
}> {

    const response =
        await api.get(
            "/alpaca/bars/AAPL"
        );

    return response.data;
}