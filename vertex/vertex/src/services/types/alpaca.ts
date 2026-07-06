export interface AlpacaAccount {
    buyingPower: number;
    cash: number;
    equity: number;
    portfolioValue: number;
    longMarketValue: number;
    shortMarketValue: number;
}

export interface AlpacaPosition {
    symbol: string;
    quantity: number;
    marketValue: number;
    averageEntryPrice: number;
    currentPrice: number;
    unrealizedPnL: number;
}

export interface AlpacaBar {
    t: string;
    o: number;
    h: number;
    l: number;
    c: number;
    v: number;
}
