#pragma once

#include <vector>

#include "Tick.h"
#include "../strategy/Istrategy.h"

class MarketDataFeed {

private:

    std::vector<Tick> ticks;

    std::vector<ITickListener*> listeners;


public:

    void addTick(const Tick& tick);

    void subscribe(ITickListener* listener);
};