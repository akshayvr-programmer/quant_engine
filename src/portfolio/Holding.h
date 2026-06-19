#pragma once

#include <string>
#include <cstdint>
using Quantity = std::uint64_t;
using Price = std::int64_t;

struct Holding {
    std::string symbol;
    Quantity quantity = 0;
    Price averageCost = 0;
    Price lastPrice = 0;
    double realizedPnL = 0.0;
    double unrealizedPnL = 0.0;

};