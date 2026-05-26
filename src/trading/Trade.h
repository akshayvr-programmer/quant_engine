//
// Created by axoss-scott on 5/26/26.
//

#pragma once

#include <string>

#include "../strategy/Position.h"

class Trade {
public:
    std::string symbol;
    Position position;
    double entryPrice;
    double exitPrice;
    double entryTimestamp;
    double exitTimestamp;

    bool open; // is the trade still  active?

    Trade(
      const std::string& symbol,
      Position position,
      double entryPrice,
      long long entryTimestamp

    );
};