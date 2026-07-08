import api from "./api";

export async function terminalAccount() {

    const response =
        await api.get("/alpaca/account");

    return response.data;

}

export async function terminalPositions() {

    const response =
        await api.get("/alpaca/positions");

    return response.data;

}

export async function terminalOrders() {

    const response =
        await api.get("/alpaca/openOrders");

    return response.data;

}

export async function terminalBuy(
    symbol: string,
    quantity: number
) {

    const response =
        await api.post("/alpaca/order", {

            symbol,

            side: "BUY",

            type: "MARKET",

            quantity,

        });

    return response.data;

}

export async function terminalSell(
    symbol: string,
    quantity: number
) {

    const response =
        await api.post("/alpaca/order", {

            symbol,

            side: "SELL",

            type: "MARKET",

            quantity,

        });

    return response.data;

}