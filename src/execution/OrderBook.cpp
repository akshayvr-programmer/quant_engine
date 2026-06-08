#include "OrderBook.h"

MatchingResult OrderBook::submitOrder(const Order &order) {

    MatchingResult result;

    if (order.type == OrderType::LIMIT) {
        if (order.side == Side::BUY) {
            processLimitBuy(order, result);
        }

        else {
            processLimitSell(order, result);

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

        Trade trade {
            order.id,
            restingOrder.id,
            bestAskPrice,
            tradeQty
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
        Trade trade {
        order.id,
        restingOrder.id,
        bestBidPrice,
        tradeQty

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


