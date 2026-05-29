//
// Created by axoss-scott on 5/25/26.
//

#include "CandleAggregator.h"

#include <iostream>

CandleAggregator::CandleAggregator() : initialized(false), tickCount(0), ticksPerCandle(10)


{

}


void CandleAggregator::onTick(const Tick& tick)
{
    ++tickCount;
    if (!initialized) {

        currentCandle = Candle(
            tick.symbol,
            tick.price,
            tick.price,
            tick.price,
            tick.price,
            tick.timestamp,
            tick.timestamp
        );

        initialized = true;

        return;
    }

    if (tick.price > currentCandle.high) {
        currentCandle.high = tick.price;
    }
    if (tick.price < currentCandle.low) {
        currentCandle.low = tick.price;
    }

    currentCandle.close = tick.price;

    currentCandle.endTimestamp = tick.timestamp;

    if (tickCount >= ticksPerCandle) {
        candleHistory.push_back(currentCandle);
    }

    std::cout
        << "[Candle Closed] "
        << "O: " << currentCandle.open
        << " H: " << currentCandle.high
        << " L: " << currentCandle.low
        << " C: " << currentCandle.close
        << std::endl;
    currentCandle = Candle(tick.symbol, tick.price, tick.price, tick.price, tick.price, tick.timestamp, tick.timestamp);

    

}

const std::vector<Candle>&
CandleAggregator::getCandles() const
{
    return candleHistory;
}