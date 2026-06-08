#pragma once

#include <vector>

#include "Trade.h"
#include "OrderEvent.h"

struct MatchingResult
{
    std::vector<Trade> trades;

    std::vector<OrderEvent> events;
};