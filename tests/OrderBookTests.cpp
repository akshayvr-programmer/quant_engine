#include <gtest/gtest.h>

#include "../src/execution/OrderBook.h"

TEST(
    OrderBookTests,
    NonCrossingOrders
)
{
    OrderBook book;

    Order sell{
        1,
        Side::SELL,
        OrderType::LIMIT,
        105,
        50,
        50
    };

    Order buy{
        2,
        Side::BUY,
        OrderType::LIMIT,
        100,
        50,
        50
    };

    book.submitOrder(sell);

    auto result =
        book.submitOrder(buy);

    EXPECT_EQ(
        result.trades.size(),
        0
    );
}