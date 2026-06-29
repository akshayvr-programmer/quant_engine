#pragma once

#include <string>

struct PositionSnapshot
{
    std::string symbol;

    int quantity = 0;

    double averageCost = 0.0;

    double realizedPnL = 0.0;

    double unrealizedPnL = 0.0;
};
