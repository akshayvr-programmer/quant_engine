#pragma once

#include <map>
#include <deque>
#include <optional>
#include <unordered_map>

#include "Order.h"
#include "MatchingResult.h"

struct OrderLocation {
    Side side;

    Price price;

    OrderId orderId;

};

class OrderBook {

private:
    void processLimitBuy(Order order, MatchingResult& result);
    void processLimitSell(Order order, MatchingResult& result);
    void processMarketBuy(Order order, MatchingResult& result);
    void processMarketSell(Order order, MatchingResult& result);

public:

    using OrderQueue = std::deque<Order>;

    using BidBook = std::map<Price, OrderQueue, std::greater<>>;
    using AskBook = std::map<Price, OrderQueue>;

    MatchingResult submitOrder(const Order& order);

    bool cancelOrder(OrderId orderId);

    std::optional<Price> bestBid() const;
    std::optional<Price> bestAsk() const;

    const BidBook& getBids() const;
    const AskBook& getAsks() const;

private:

    BidBook bids;
    AskBook asks;

    std::unordered_map<OrderId, OrderLocation> orderIndex;
};