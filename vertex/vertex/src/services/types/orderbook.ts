export interface BookLevel {
  price: number;
  quantity: number;
}

export interface OrderBookResponse {
  bids: BookLevel[];
  asks: BookLevel[];
}