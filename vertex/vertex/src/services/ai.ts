import api from "./api";

export async function sendAIMessage(prompt: string): Promise<string> {
    const response = await api.post<{ response: string }>("/ai/chat", { prompt });
    return response.data.response;
}
