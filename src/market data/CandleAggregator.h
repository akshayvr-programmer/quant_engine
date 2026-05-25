//
// Created by axoss-scott on 5/25/26.
//

#pragma once

#include "Tick.h"
#include "Candle.h"
#include "ITickListener.h"

class CandleAggregator : public ITickListener {
private:
    bool initialized;

    Candle currentCandle;

public:
    CandleAggregator();

    void onTick(const Tick& tick);

    

};