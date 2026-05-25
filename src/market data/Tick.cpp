//
// Created by axoss-scott on 5/22/26.
//


#include "Tick.h"

Tick::Tick(
    const std::string& symbol,
    double price,
    double volume,
    long long timestamp
)
    : symbol(symbol),
      price(price),
      volume(volume),
      timestamp(timestamp)
{
}