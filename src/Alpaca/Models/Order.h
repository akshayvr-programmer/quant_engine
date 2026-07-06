#pragma once

#include <string>

struct AlpacaOrder
{
    std::string symbol;

    std::string side;

    int quantity;

    double filledPrice;

    std::string filledAt;
};
