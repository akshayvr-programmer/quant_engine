// Low-level REST client for the C++ trading engine (Boost.Beast server).
// One thin typed wrapper per endpoint. These return the BACKEND DTOs exactly as
// the engine serialises them (nlohmann/json); translation into the frontend's
// domain types lives in ./adapters so this file stays a faithful mirror of the
// wire format.
//
// Base URL: empty by default so requests are relative and ride the Vite dev
// proxy (see vite.config.ts) — which forwards to http://localhost:8080 without
// CORS. Override for a deployed backend with VITE_API_BASE.

const API_BASE = (
  (import.meta as unknown as { env?: Record<string, string> }).env
    ?.VITE_API_BASE ?? ""
).replace(/\/$/, "");

// --- Wire DTOs (exact backend shapes) ---------------------------------------

export interface AccountDto {
  buyingPower: number;
  cash: number;
  exposure: number;
  realizedPnL: number;
  unrealizedPnL: number;
}

export interface PositionDto {
  symbol: string;
  quantity: number;
  averageCost: number;
  realizedPnL: number;
  unrealizedPnL: number;
}

export interface TradeDto {
  symbol: string;
  side: "BUY" | "SELL";
  price: number;
  quantity: number;
  timestamp: number; // epoch milliseconds
}

export interface BookLevelDto {
  price: number;
  quantity: number;
}

export interface BookDto {
  bids: BookLevelDto[];
  asks: BookLevelDto[];
}

export type OrderType = "MARKET" | "LIMIT";

export interface OrderRequest {
  symbol: string;
  side: "BUY" | "SELL";
  type: OrderType;
  quantity: number;
  price: number; // 0 for MARKET
}

export interface OrderResponse {
  success: boolean;
  tradesExecuted?: number;
  eventsGenerated?: number;
  message?: string;
}

export interface SeedResponse {
  success: boolean;
  message?: string;
}

// --- Transport --------------------------------------------------------------

/** Thrown on any non-2xx response so callers can surface a real message. */
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      ...init,
    });
  } catch (e) {
    // Network-level failure (engine down, DNS, CORS) — never a Response.
    throw new ApiError(0, e instanceof Error ? e.message : "Network error");
  }

  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.text();
      if (body) detail = body;
    } catch {
      /* ignore secondary read errors */
    }
    throw new ApiError(res.status, `${res.status} ${detail}`.trim());
  }

  const text = await res.text();
  return (text ? JSON.parse(text) : null) as T;
}

// --- Endpoints --------------------------------------------------------------

export const api = {
  getAccount: () => request<AccountDto>("/account"),
  getPositions: () => request<PositionDto[]>("/positions"),
  getTrades: () => request<TradeDto[]>("/trades"),
  getBook: (symbol: string) =>
    request<BookDto>(`/book/${encodeURIComponent(symbol)}`),

  placeOrder: (order: OrderRequest) =>
    request<OrderResponse>("/order", {
      method: "POST",
      body: JSON.stringify(order),
    }),

  seed: (order: OrderRequest) =>
    request<SeedResponse>("/seed", {
      method: "POST",
      body: JSON.stringify(order),
    }),
};
