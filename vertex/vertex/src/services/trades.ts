import  api  from "./api";
import type { Trade } from "./types/trades";

export async function getTrades() {
    const response = await api.get<Trade[]>("/trades");
    return response.data;
}
