#pragma once

#include <deque>
#include <cstddef>
#include <vector>

#include "Signal.h"
#include "Istrategy.h"
#include "Position.h"

#include "../trading/Trade.h"
#include "../export/EngineSnapshot.h"

class MovingAverageStrategy : public IStrategy {

private:

    std::deque<double> longPrices;

    std::deque<double> shortPrices;

    size_t shortWindow;

    size_t longWindow;

    std::vector<EngineSnapshot> snapshots;

    std::vector<Trade> completedTrades;

    Trade* activeTrade;

    double totalPnL;

    Position currentPosition;

public:

    MovingAverageStrategy(
        size_t shortWindow,
        size_t longWindow
    );

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