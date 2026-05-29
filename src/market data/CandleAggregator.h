//
// Created by axoss-scott on 5/25/26.
//

#pragma once

#include <vector>

#include "Tick.h"
#include "Candle.h"
#include "ITickListener.h"

class CandleAggregator : public ITickListener {

private:

    bool initialized;

    size_t tickCount;
    size_t ticksPerCandle;


    Candle currentCandle;

    std::vector<Candle> candleHistory;

public:

    CandleAggregator();

    void onTick(
        const Tick& tick
    ) override;

    const std::vector<Candle>&
    getCandles() const;
};