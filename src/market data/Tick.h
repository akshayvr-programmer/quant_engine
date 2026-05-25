//
// Created by axoss-scott on 5/22/26.
//

#ifndef QUANTENGINE_TICK_H
#define QUANTENGINE_TICK_H

#endif //QUANTENGINE_TICK_H


#pragma once

#include <string>

class Tick {
public:
    std::string symbol;
    double price;
    double volume;
    long long timestamp;

    Tick(
        const std::string& symbol,
        double price,
        double volume,
        long long timestamp

    );
};