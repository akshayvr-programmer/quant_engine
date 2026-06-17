#pragma once

#include <unordered_map>
#include <vector>
#include "OrderBook.h"
#include "OrderIdGenerator.h"
#include "ExecutionRequest.h"
#include "MatchingResult.h"

class ExecutionManager {
private:

    std::unordered_map<std::string, OrderBook> books;

    std::vector<ExecutionTrade> executedTrades;

    std::vector<OrderEvent> executionEvents;

public:
    ExecutionManager();

    MatchingResult submitRequest(const ExecutionRequest& request);

    const std::vector<ExecutionTrade>& getTrades() const;

    const std::vector<OrderEvent>& getEvents() const;

};
