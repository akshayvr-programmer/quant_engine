#pragma once

#include <vector>

#include "ExecutionTrade.h"
#include "OrderEvent.h"

struct MatchingResult
{
    std::vector<ExecutionTrade> trades;

    std::vector<OrderEvent> events;
};