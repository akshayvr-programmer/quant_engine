import api from "./api";

export interface StrategyItem {
  name: string;
  running: boolean;
}

export async function getStrategies(): Promise<StrategyItem[]> {
  const response = await api.get<StrategyItem[]>("/strategies");
  return response.data;
}

export async function startStrategy(name: string): Promise<void> {
  await api.post("/strategies/start", { name });
}

export async function stopStrategy(name: string): Promise<void> {
  await api.post("/strategies/stop", { name });
}
