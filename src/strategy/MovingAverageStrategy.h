#pragma once

#include <deque>
#include <cstddef>

#include "Signal.h"
#include "Istrategy.h"

class MovingAverageStrategy : public IStrategy {

private:

    std::deque<double> prices;

    size_t windowSize;

public:

    MovingAverageStrategy(size_t windowSize);

    void onTick(const Tick& tick) override;

    double calculateAverage() const;

    Signal generateSignal(
        double price,
        double average
    ) const;
};