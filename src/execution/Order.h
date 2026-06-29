#pragma once

#include <cstdint>
#include <string>
using Price = std::int64_t;
using Quantity = std::uint64_t;
using OrderId = std::uint64_t;
using Timestamp = std::uint64_t;

enum class Side {
    BUY,
    SELL
};

enum class OrderType {
    MARKET,
    LIMIT
};

struct Order {

    OrderId id;

    std::string symbol;

    Side side;

    OrderType type;

    Price price;

    Quantity quantity;

    Quantity remainingQuantity;

    Timestamp timestamp;

};