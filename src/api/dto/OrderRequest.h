#pragma once
#include "../../execution/Order.h"
#include <string>
#include <optional>


struct OrderRequest
{
    std::string symbol;
    std::string side;
    std::string type;

    Quantity quantity;

    std::optional<Price> price;
};