#pragma once

#include "../execution/ExecutionManager.h"
#include "../portfolio/PortfolioManager.h"
#include "../api/dto/AccountSnapshot.h"
#include "../api/dto/PositionSnapshot.h"
#include "../api/dto/TradeSnapshot.h"
#include "../api/dto/OrderRequest.h"
#include "../api/dto/OrderBookSnapshot.h"
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

    MatchingResult placeOrder(const OrderRequest& request);

    OrderBookSnapshot getOrderBook(
    const std::string& symbol) const;

    void seedLiquidity(const OrderRequest& request);
    


    // NEW
    AccountSnapshot getAccount();
};