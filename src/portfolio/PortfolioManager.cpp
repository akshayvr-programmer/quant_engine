//
// Created by aksha on 19-06-2026.
//

#include "PortfolioManager.h"

PortfolioManager::PortfolioManager(double initialCash) {
    cash = initialCash;
}

Holding PortfolioManager::getHolding(const std::string &symbol) const {
    return positions.at(symbol);
}

double PortfolioManager::getCash() const {
    return cash;


}

double PortfolioManager::getNetLiquidationValue() const {
    double total = cash;

    for (const auto& [symbol, position] : positions) {
        total += position.quantity*position.averageCost;
    }

    return total;

}

void PortfolioManager::updateFromTrade(const ExecutionTrade &trade, const std::string &symbol, bool isBuy) {

    Holding& pos = positions[symbol];

    pos.symbol = symbol;

    Price tradePrice = trade.price;

    Quantity tradeQuantity = trade.quantity;


    if (isBuy) {

        double totalCost = pos.quantity*pos.averageCost + tradeQuantity*tradePrice;

        pos.quantity += tradeQuantity;

        pos.averageCost = totalCost / pos.quantity;

        cash -= tradeQuantity*tradePrice;

    }

    else
    {
        double pnl =
            (tradePrice - pos.averageCost)
            * tradeQuantity;

        pos.realizedPnL += pnl;

        cash += tradeQuantity * tradePrice;

        pos.quantity -= tradeQuantity;

        if (pos.quantity == 0)
        {
            pos.averageCost = 0.0;
        }
    }


}

void PortfolioManager::marktoMarket(const std::string &symbol, Price currentPrice) {

    Holding& pos = positions[symbol];

    pos.lastPrice = currentPrice;

    pos.unrealizedPnL = (currentPrice - pos.averageCost)*pos.quantity;

}

double PortfolioManager::getRealizedPnL() const {
    double pnl = 0;

    for (const auto& [symbol, pos] : positions) {
        pnl += pos.realizedPnL;
    }
    return pnl;
}

double PortfolioManager::getExposure() const
{
    double exposure = 0.0;

    for (const auto& [symbol, holding] : positions)
    {
        exposure += static_cast<double>(
                        holding.quantity
                        * holding.averageCost
                    );
    }

    return exposure;
}

const std::unordered_map<std::string, Holding>&
PortfolioManager::getPositions() const
{
    return positions;
}