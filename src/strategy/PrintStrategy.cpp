//
// Created by axoss-scott on 5/22/26.
//

#include <iostream>

#include "PrintStrategy.h"

void PrintStrategy::onTick(const Tick& tick) {

    std::cout
        << "[Strategy] "
        << tick.symbol
        << " Price: "
        << tick.price
        << "\n";
}