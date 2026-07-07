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

export interface AlpacaOrder {

    symbol: string;

    side: string;

    quantity: number;

    filledPrice: number;

    filledAt: string;

}

export interface AlpacaQuote {

    bidPrice: number;

    bidSize: number;

    askPrice: number;

    askSize: number;

}

export interface AlpacaOpenOrder {

    id: string;

    symbol: string;

    side: string;

    type: string;

    quantity: number;

    limitPrice: number;

    status: string;

}
