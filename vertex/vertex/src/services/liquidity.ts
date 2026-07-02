import { api } from "./api";

export interface SeedRequest {
  symbol: string;
  side: "BUY" | "SELL";
  quantity: number;
  price: number;
}

export interface SeedResponse {
  success: boolean;
  message: string;
}

export async function seedLiquidity(request: SeedRequest) {
  const response = await api.post<SeedResponse>(
    "/seed",
    {
      ...request,
      type: "LIMIT",
    }
  );

  return response.data;
}
