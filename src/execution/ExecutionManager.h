#pragma once

#include <unordered_map>
#include <vector>
#include "OrderBook.h"
#include "OrderIdGenerator.h"
#include "ExecutionRequest.h"
#include "MatchingResult.h"
#include "../risk/RiskManager.h"
#include "../portfolio/PortfolioManager.h"

class ExecutionManager {
private:
    PortfolioManager portfolio;

    RiskManager risk;


    std::unordered_map<std::string, OrderBook> books;

    std::vector<ExecutionTrade> executedTrades;

    std::vector<OrderEvent> executionEvents;

public:
    ExecutionManager();

    PortfolioManager& getPortfolio();

    MatchingResult submitRequest(const ExecutionRequest& request);

    const std::vector<ExecutionTrade>& getTrades() const;

    const std::vector<OrderEvent>& getEvents() const;

};
