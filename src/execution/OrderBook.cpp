#include "OrderBook.h"
#include <chrono>

MatchingResult OrderBook::submitOrder(const Order &order) {

    MatchingResult result;

    result.events.push_back(
        {
        order.id,
        OrderEventType::ACCEPTED,
        0,
        order.remainingQuantity});


    if (order.type == OrderType::LIMIT) {
        if (order.side == Side::BUY) {
            processLimitBuy(order, result);
        }

        else {
            processLimitSell(order, result);

        }

    }

    if (order.type == OrderType::MARKET) {
        if (order.side == Side::BUY) {
            processMarketBuy(order, result);
        }
        else {
            processMarketSell(order, result);
        }
    }

    return result;


}

bool OrderBook::cancelOrder(
    OrderId orderId
)
{
    auto locationIt =
        orderIndex.find(
            orderId
        );

    if (
        locationIt ==
        orderIndex.end()
    )

    {
        return false;
    }



    OrderLocation location =
        locationIt->second;

    if (
    location.side ==
    Side::BUY
)
    {
        auto levelIt =
            bids.find(
                location.price
            );

        if (
            levelIt ==
            bids.end()
        )
        {
            return false;
        }

        OrderQueue& queue =
            levelIt->second;

        for (auto it = queue.begin(); it != queue.end(); ++it) {

            if (it->id == orderId) {
                queue.erase(it);
                orderIndex.erase(orderId);

                if (queue.empty() ) {
                    bids.erase(levelIt);

                }

                return true;



            }






        }





    }
    else
    {
        auto levelIt =
            asks.find(
                location.price
            );

        if (
            levelIt ==
            asks.end()
        )
        {
            return false;
        }

        OrderQueue& queue =
            levelIt->second;

        for (auto it = queue.begin(); it != queue.end(); ++it) {

            if (it->id == orderId) {
                queue.erase(it);
                orderIndex.erase(orderId);

                if (queue.empty() ) {
                    asks.erase(levelIt);

                }

                return true;



            }






        }




        // search queue
    }

    return false;




}

std::optional<Price> OrderBook::bestBid() const {
    if (bids.empty()) {
        return std::nullopt;
    }

    return bids.begin()->first;

}

std::optional<Price> OrderBook::bestAsk() const {
    if (asks.empty()) {
        return std::nullopt;

    }
    return asks.begin()->first;
}
void OrderBook::processMarketSell(Order order, MatchingResult& result) {

    while (order.remainingQuantity > 0 && !bids.empty()) {

        auto bestBidIt = bids.begin();
        Price bestBidPrice = bestBidIt->first;

        OrderQueue& queue = bestBidIt->second;
        Order& restingOrder = queue.front();
        Quantity tradeqty = std::min(restingOrder.remainingQuantity, order.remainingQuantity);

        restingOrder.remainingQuantity -= tradeqty;
        order.remainingQuantity -= tradeqty;

        ExecutionTrade trade{
            order.id,
            restingOrder.id,
            order.symbol,
            order.side,
            bestBidPrice,
            tradeqty,
            static_cast<std::uint64_t>(
                std::chrono::duration_cast<std::chrono::milliseconds>(
                    std::chrono::system_clock::now().time_since_epoch()
                ).count()
            )
        };

        result.trades.push_back(trade);

        if (restingOrder.remainingQuantity == 0) {
            OrderId fillerOrderId = restingOrder.id;
            queue.pop_front();
            orderIndex.erase(fillerOrderId);

        }

        if (queue.empty()) {
            bids.erase(bestBidIt);
        }

    }
}

void OrderBook::processMarketBuy(Order order, MatchingResult& result) {

    while (order.remainingQuantity > 0 && !asks.empty()) {
        auto bestAskIt = asks.begin();

        Price bestAskPrice = bestAskIt->first;
        OrderQueue& queue = bestAskIt->second;
        Order& restingOrder = queue.front();

        Quantity tradeqty = std::min(order.remainingQuantity, restingOrder.remainingQuantity);

        order.remainingQuantity -= tradeqty;
        restingOrder.remainingQuantity -= tradeqty;
        ExecutionTrade trade{
            order.id,
            restingOrder.id,
            order.symbol,
            order.side,
            bestAskPrice,
            tradeqty,
            static_cast<std::uint64_t>(
                std::chrono::duration_cast<std::chrono::milliseconds>(
                    std::chrono::system_clock::now().time_since_epoch()
                ).count()
            )
        };

        result.trades.push_back(trade);


        if (restingOrder.remainingQuantity == 0) {
            OrderId fillerOrderId = restingOrder.id;

            queue.pop_front();

            orderIndex.erase(fillerOrderId);





        }

        if (queue.empty()) {
            asks.erase(bestAskIt);

        }



    }
};

void OrderBook::processLimitBuy(
    Order order,
    MatchingResult& result
)
{
    while (order.remainingQuantity > 0 && !asks.empty() && asks.begin()->first <= order.price) {



        auto bestAskIt = asks.begin();

        Price bestAskPrice = bestAskIt->first;



        OrderQueue& queue = bestAskIt->second;

        Order& restingOrder = queue.front();

        Quantity tradeQty = std::min(order.remainingQuantity, restingOrder.remainingQuantity);

        order.remainingQuantity -= tradeQty;
        restingOrder.remainingQuantity -= tradeQty;


        if (restingOrder.remainingQuantity > 0)
        {

            result.events.push_back({

                restingOrder.id,

                OrderEventType::PARTIALLY_FILLED,

                tradeQty,

                restingOrder.remainingQuantity

            });

        }
        else
        {

            result.events.push_back({

                restingOrder.id,

                OrderEventType::FILLED,

                tradeQty,

                0

            });

        }
        

        ExecutionTrade trade{
            order.id,
            restingOrder.id,
            order.symbol,
            order.side,
            order.price,
            tradeQty,
            static_cast<std::uint64_t>(
                std::chrono::duration_cast<std::chrono::milliseconds>(
                    std::chrono::system_clock::now().time_since_epoch()
                ).count()
            )
        };

        result.trades.push_back(trade);


        if (restingOrder.remainingQuantity == 0) {
            OrderId fillerOrderId = restingOrder.id;

            queue.pop_front();

            orderIndex.erase(fillerOrderId);





        }





        if (queue.empty()) {
            asks.erase(bestAskIt);
        }
    }

    if (order.remainingQuantity > 0) {
        bids[order.price].push_back(order);

        orderIndex[order.id] = {order.side, order.price, order.id};

    }








}

void OrderBook::processLimitSell(
    Order order,
    MatchingResult& result
)
{

    while (order.remainingQuantity > 0 && !bids.empty() && bids.begin()->first >= order.price) {
        auto bestBidIt = bids.begin();

        Price bestBidPrice = bestBidIt->first;
        OrderQueue& queue = bestBidIt->second;
        Order& restingOrder = queue.front();

        Quantity tradeQty = std::min(order.remainingQuantity, restingOrder.remainingQuantity);

        order.remainingQuantity -= tradeQty;
        restingOrder.remainingQuantity -= tradeQty;

        if (restingOrder.remainingQuantity > 0)
        {

            result.events.push_back({

                restingOrder.id,

                OrderEventType::PARTIALLY_FILLED,

                tradeQty,

                restingOrder.remainingQuantity

            });

        }
        else
        {

            result.events.push_back({

                restingOrder.id,

                OrderEventType::FILLED,

                tradeQty,

                0

            });

        }

        
        ExecutionTrade trade{
            order.id,
            restingOrder.id,
            order.symbol,
            order.side,
            order.price,
            tradeQty,
            static_cast<std::uint64_t>(
                std::chrono::duration_cast<std::chrono::milliseconds>(
                    std::chrono::system_clock::now().time_since_epoch()
                ).count()
            )
        };



        result.trades.push_back(trade);
        if (restingOrder.remainingQuantity == 0) {
            OrderId fillerOrderId = restingOrder.id;
            queue.pop_front();

            orderIndex.erase(fillerOrderId);


        }

        if (queue.empty()) {
            bids.erase(bestBidIt);

        }



    }



    if (order.remainingQuantity > 0) {
        asks[order.price].push_back(order);

        orderIndex[order.id] = {order.side, order.price, order.id};

    }
}

const OrderBook::BidBook&
OrderBook::getBids() const
{
    return bids;
}

const OrderBook::AskBook&
OrderBook::getAsks() const
{
    return asks;
}


