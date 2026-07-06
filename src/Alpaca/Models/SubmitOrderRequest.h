#pragma once

#include <string>

struct SubmitOrderRequest
{
    std::string symbol;
    std::string side;
    std::string type;

    int quantity;

    double price = 0.0;
};
