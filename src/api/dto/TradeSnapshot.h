#pragma once

#include <string>
#include <cstdint>

struct TradeSnapshot
{
    std::string symbol;

    std::string side;

    double price = 0.0;

    int quantity = 0;

    std::uint64_t timestamp = 0;
};