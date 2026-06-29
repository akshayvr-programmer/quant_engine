#pragma once

#include <unordered_map>
#include <string>

#include "Holding.h"
#include "../execution/ExecutionTrade.h"


class PortfolioManager {
private:
    std::unordered_map<std::string, Holding> positions;

    double cash;

public:
    explicit PortfolioManager(double initialCash = 1000000.0);

    void updateFromTrade(const ExecutionTrade& trade, const std::string& symbol, bool isBuy);

    Holding getHolding(const std::string& symbol) const;

    double getCash() const;

    double getExposure() const;
    double getRealizedPnL() const;

    const std::unordered_map<std::string, Holding>& getPositions() const;
    


    double getNetLiquidationValue() const;

    void marktoMarket(const std::string& symbol, Price currentPrice);

};