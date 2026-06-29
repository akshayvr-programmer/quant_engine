#pragma once

#include "../execution/ExecutionManager.h"
#include "../portfolio/PortfolioManager.h"
#include "../api/dto/AccountSnapshot.h"
#include "../api/dto/PositionSnapshot.h"
#include "../api/dto/TradeSnapshot.h"
class PaperBroker
{
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

    std::vector<PositionSnapshot> getPositions();
    std::vector<TradeSnapshot> getTradeHistory();


    // NEW
    AccountSnapshot getAccount();
};