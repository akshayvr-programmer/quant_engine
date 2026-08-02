#pragma once

#include "Istrategy.h"
#include "vector"
#include "Position.h"
#include "../trading/Trade.h"
#include "Signal.h"
#include "../analytics/AnalyticsManager.h"
class EMAStrategy : public IStrategy {

private:

    double shortEMA;
    double longEMA;

    double shortAlpha;
    double longAlpha;

    bool shortInitialized;
    bool longInitialized;

    std::vector<TradeEvent> tradeEvents;

    Position currentPosition;

    Trade* activeTrade;
    AnalyticsManager* analyticsManager;

    std::vector<Trade> completedTrades;

    double totalPnL;

    double updateEMA(
        double currentEMA,
        double alpha,
        double price
    ) const;

public:



    EMAStrategy(
        size_t shortPeriod,
        size_t longPeriod,
        AnalyticsManager* analyticsManager
    );

    const std::vector<Trade>& getCompletedTrades() const;

    void onTick(
        const Tick& tick
    ) override;

    Signal generateSignal(
        double shortEMA,
        double longEMA
    ) const;
};