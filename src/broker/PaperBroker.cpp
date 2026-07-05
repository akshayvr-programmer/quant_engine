//
// Created by aksha on 24-06-2026.
//

#include "PaperBroker.h"


PaperBroker::PaperBroker() {

}


AccountSnapshot PaperBroker::getAccount()  {
    AccountSnapshot snapshot;
    snapshot.cash = engine.getPortfolio().getCash();
    snapshot.exposure = engine.getPortfolio().getExposure();
    snapshot.realizedPnL = engine.getPortfolio().getRealizedPnL();
    snapshot.unrealizedPnL = 0.0;
    snapshot.buyingPower = snapshot.cash;

    return snapshot;

}

MatchingResult PaperBroker::placeOrder(const ExecutionRequest &request) {
    return engine.submitRequest(request);



}

double PaperBroker::getCash()  {

    return engine.getPortfolio().getCash();

}

std::vector<ExecutionTrade> PaperBroker::getTrades() {
    return engine.getTrades();
}

double PaperBroker::getExposure() {
    return engine.getPortfolio().getExposure();

}
double PaperBroker::getPnL() {
    return engine.getPortfolio().getRealizedPnL();
}

std::vector<PositionSnapshot>
PaperBroker::getPositions()
{
    std::vector<PositionSnapshot> snapshots;

    const auto& positions =
        engine.getPortfolio().getPositions();

    for (const auto& [symbol, holding] : positions)
    {
        PositionSnapshot snapshot;

        snapshot.symbol = symbol;
        snapshot.quantity = holding.quantity;
        snapshot.averageCost = holding.averageCost;
        snapshot.realizedPnL = holding.realizedPnL;

        // We'll compute MTM later
        snapshot.unrealizedPnL = 0.0;

        snapshots.push_back(snapshot);
    }

    return snapshots;
}

std::vector<TradeSnapshot>
PaperBroker::getTradeHistory()
{
    std::vector<TradeSnapshot> snapshots;

    for (const auto& trade : engine.getTrades())
    {
        TradeSnapshot snapshot;

        snapshot.symbol = trade.symbol;

        snapshot.side =
            trade.side == Side::BUY
            ? "BUY"
            : "SELL";

        snapshot.price = trade.price;

        snapshot.quantity = trade.quantity;

        snapshot.timestamp = trade.timestamp;

        snapshots.push_back(snapshot);
    }

    return snapshots;
}

MatchingResult
PaperBroker::placeOrder(
    const OrderRequest& request
)
{
    ExecutionRequest executionRequest;

    executionRequest.symbol = request.symbol;

    executionRequest.quantity = request.quantity;

    executionRequest.limitPrice = request.price;

    executionRequest.side =
        request.side == "BUY"
        ? Side::BUY
        : Side::SELL;

    executionRequest.orderType =
        request.type == "MARKET"
        ? OrderType::MARKET
        : OrderType::LIMIT;

    return engine.submitRequest(executionRequest);
}

OrderBookSnapshot
PaperBroker::getOrderBook(
    const std::string& symbol
) const
{
    OrderBookSnapshot snapshot;

    const auto& book =
        engine.getOrderBook(symbol);

    // Bids
    for(const auto& [price, queue] : book.getBids())
    {
        int totalQuantity = 0;

        for(const auto& order : queue)
        {
            totalQuantity += order.remainingQuantity;
        }

        OrderBookLevel level;
        level.price = price;
        level.quantity = totalQuantity;
        snapshot.bids.push_back(level);

    }

    // Asks
    for(const auto& [price, queue] : book.getAsks())
    {
        int totalQuantity = 0;

        for(const auto& order : queue)
        {
            totalQuantity += order.remainingQuantity;
        }
        OrderBookLevel level;
        level.price = price;
        level.quantity = totalQuantity;

        snapshot.asks.push_back(level);



    }

    return snapshot;
}

void PaperBroker::seedLiquidity(
    const OrderRequest& request
)
{
    ExecutionRequest executionRequest;

    executionRequest.symbol = request.symbol;
    executionRequest.quantity = request.quantity;
    executionRequest.limitPrice = request.price;

    executionRequest.side =
        request.side == "BUY"
        ? Side::BUY
        : Side::SELL;

    executionRequest.orderType = OrderType::LIMIT;

    engine.addLiquidity(executionRequest);
}