import { api } from "./api";

export interface AccountSnapshot {
    buyingPower: number;
    cash: number;
    exposure: number;
    realizedPnL: number;
    unrealizedPnL: number;
}

export async function getAccount() {
    const response = await api.get("/account");

    console.log(response);

    return response.data;
}



