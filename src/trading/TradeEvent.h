#pragma once
#include <string>
enum class TradeEventType {
    ENTER_LONG,
    EXIT_LONG
};

struct TradeEvent {
  TradeEventType type;

    std::string symbol;
    double price;
    long timestamp;

};

