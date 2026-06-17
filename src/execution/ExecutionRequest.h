#pragma once

#include <optional>
#include <string>

#include "Order.h"


struct ExecutionRequest
{

    std::string symbol;

    Side side;

    Quantity quantity;

    OrderType orderType;


    std::optional<Price> limitPrice;


};

