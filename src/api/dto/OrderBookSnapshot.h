#pragma once

#include <vector>

#include "OrderBookLevel.h"

struct OrderBookSnapshot
{
    std::vector<OrderBookLevel> bids;

    std::vector<OrderBookLevel> asks;
};
