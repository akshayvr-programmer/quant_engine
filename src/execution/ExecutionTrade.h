#pragma once

#include "Order.h"
#include <string>
struct ExecutionTrade
{
    OrderId aggressorOrderId;
    OrderId restingOrderId;

    std::string symbol;

    Side side;

    Price price;

    Quantity quantity;

    std::uint64_t timestamp;
};