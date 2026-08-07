import api from "./api";
import type { AlpacaOrder } from "../services/types/alpaca";
import type {
    AlpacaAccount,
    AlpacaPosition,
    AlpacaBar,
    AlpacaQuote,
    AlpacaOpenOrder
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

export async function getBars(symbol = "AAPL"): Promise<{
    bars: AlpacaBar[];
}> {

    const response =
        await api.get(
            `/alpaca/bars/${symbol}`
        );

    return response.data;
}



export async function getAlpacaOrders(): Promise<AlpacaOrder[]> {

    const response =
        await api.get<AlpacaOrder[]>(
            "/alpaca/orders"
        );

    return response.data;

}

export async function getLatestQuote(
    symbol: string
): Promise<AlpacaQuote> {

    const response =
        await api.get<AlpacaQuote>(
            `/alpaca/quote/${symbol}`
        );

    return response.data;

}

export async function getOpenOrders(): Promise<AlpacaOpenOrder[]> {

    const response =
        await api.get<AlpacaOpenOrder[]>(
            "/alpaca/openOrders"
        );

    return response.data;

}

export async function cancelOrder(
    id: string
) {

    await api.delete(
        `/alpaca/order/${id}`
    );

}
