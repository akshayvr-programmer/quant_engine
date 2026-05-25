//
// Created by axoss-scott on 5/22/26.
//

#include <iostream>

#include "MarketDataFeed.h"



void MarketDataFeed::addTick(const Tick& tick)
{
    ticks.push_back(tick);

    for (ITickListener* listener : listeners) {
        listener->onTick(tick);
    }
}

void MarketDataFeed::subscribe(ITickListener* listener)
{
    listeners.push_back(listener);
}