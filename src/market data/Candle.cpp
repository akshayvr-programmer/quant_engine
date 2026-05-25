#include "Candle.h"

Candle::Candle(
    const std::string& symbol,
    double open,
    double high,
    double low,
    double close,
    long long startTimestamp,
    long long endTimestamp
)
    : symbol(symbol),
      open(open),
      high(high),
      low(low),
      close(close),
      startTimestamp(startTimestamp),
      endTimestamp(endTimestamp)
{
}

Candle::Candle()
    : symbol(""),
      open(0.0),
      high(0.0),
      low(0.0),
      close(0.0),
      startTimestamp(0),
      endTimestamp(0)
{
}