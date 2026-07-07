#pragma once

#include <string>

struct AlpacaOpenOrder
{
    std::string id;

    std::string symbol;

    std::string side;

    std::string type;

    int quantity;

    double limitPrice;

    std::string status;
};
