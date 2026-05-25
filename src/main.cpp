#include <iostream>

#include "market data/MarketDataFeed.h"
#include "market data/CandleAggregator.h"

#include "strategy/MovingAverageStrategy.h"

int main() {

    MarketDataFeed feed;

    MovingAverageStrategy strategy(3);

    CandleAggregator aggregator;

    feed.subscribe(&strategy);

    feed.subscribe(&aggregator);

    feed.addTick(
        Tick("AAPL", 100.0, 10.0, 1)
    );

    feed.addTick(
        Tick("AAPL", 102.0, 15.0, 2)
    );

    feed.addTick(
        Tick("AAPL", 99.0, 20.0, 3)
    );

    feed.addTick(
        Tick("AAPL", 106.0, 25.0, 4)
    );

    feed.addTick(
        Tick("AAPL", 101.0, 18.0, 5)
    );

    return 0;
}