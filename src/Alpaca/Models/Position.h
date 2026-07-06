#pragma once

#include <string>

struct AlpacaPosition
{
    std::string symbol;

    int quantity;

    double marketValue;

    double averageEntryPrice;

    double currentPrice;

    double unrealizedPnL;
};
