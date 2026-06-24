//
// Created by aksha on

#pragma once
#include "../execution/ExecutionManager.h"
#include "../portfolio/PortfolioManager.h"
class PaperBroker {

private:
    ExecutionManager engine;

public:
    PaperBroker();

    MatchingResult placeOrder(const ExecutionRequest& request);

    bool cancelOrder(OrderId id);

    PortfolioManager& getPortfolio();

    double getCash();
    double getExposure();
    double getPnL();
    std::vector<ExecutionTrade> getTrades();

};


