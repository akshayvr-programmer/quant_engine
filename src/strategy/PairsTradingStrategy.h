#pragma once

#include <unordered_map>
#include <string>
#include <vector>

#include "Istrategy.h"
#include "PairParameters.h"

#include "../trading/Trade.h"

class PairsTradingStrategy : public IStrategy
{
private:

    std::string symbolA;
    std::string symbolB;

    Trade* activeTrade;

    std::vector<Trade> completedTrades;

    double totalPnL;

    enum class PairPosition
    {
        FLAT,
        LONG_SPREAD,
        SHORT_SPREAD
    };

    PairPosition currentPosition;

    PairParamters params;

    std::unordered_map<
        std::string,
        double
    > latestPrices;

public:

    PairsTradingStrategy(
        const std::string& symbolA,
        const std::string& symbolB,
        const PairParamters& params
    );

    void onTick(
        const Tick& tick
    ) override;

    const std::vector<Trade>&
    getCompletedTrades() const;

    double getTotalPnL() const;

private:

    double calculateSpread() const;

    double calculateZscore(
        double spread
    ) const;
};