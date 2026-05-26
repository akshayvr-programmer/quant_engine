//
// Created by axoss-scott on 5/26/26.
//

#include "Trade.h"

Trade::Trade(
    const std::string& symbol,
    Position position,
    double entryPrice,
    long long entryTimestamp
)
    : symbol(symbol),
      position(position),
      entryPrice(entryPrice),
      exitPrice(0.0),
      entryTimestamp(entryTimestamp),
      exitTimestamp(0),
      open(true)
{
}