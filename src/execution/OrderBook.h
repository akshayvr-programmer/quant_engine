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

public:

    MatchingResult submitOrder(const Order& order);
    bool cancelOrder(OrderId orderId);

    std::optional<Price> bestBid() const;
    std::optional<Price> bestAsk() const;

private:
    using OrderQueue = std::deque<Order>;
    std::map<Price, OrderQueue, std::greater<>>bids;
    std::map<Price, OrderQueue>asks;
    std::unordered_map<OrderId, OrderLocation> orderIndex;




};