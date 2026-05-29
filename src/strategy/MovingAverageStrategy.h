#pragma once

#include <deque>
#include <cstddef>
#include <vector>

#include "Signal.h"
#include "Istrategy.h"
#include "Position.h"

#include "../trading/Trade.h"
#include "../export/EngineSnapshot.h"
#include "../analytics/AnalyticsManager.h"
#include "../trading/TradeEvent.h"

class MovingAverageStrategy : public IStrategy {

private:

    std::deque<double> longPrices;

    std::deque<double> shortPrices;

    std::vector<TradeEvent> tradeEvents;

    size_t shortWindow;

    size_t longWindow;

    std::vector<EngineSnapshot> snapshots;

    std::vector<Trade> completedTrades;

    Trade* activeTrade;

    AnalyticsManager* analyticsManager;



    double totalPnL;

    Position currentPosition;

public:

    MovingAverageStrategy(
        size_t shortWindow,
        size_t longWindow,
        AnalyticsManager* analyticsManager
    );

    const std::vector<Trade>& getCompletedTrades() const;

    void onTick(
        const Tick& tick
    ) override;

    double calculateAverage(
        const std::deque<double>& prices
    ) const;

    Signal generateSignal(
        double shortAverage,
        double longAverage
    ) const;

    const std::vector<EngineSnapshot>&
    getSnapshots() const;
};
