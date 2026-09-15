#include <gtest/gtest.h>

#include "../src/execution/OrderBook.h"

TEST(
    OrderBookTests,
    FilledEventGenerated
)
{
    OrderBook book;

    book.submitOrder(
        Order{
            1,
            "AAPL",
            Side::SELL,
            OrderType::LIMIT,
            100,
            50,
            50,
            1
        }
    );

    auto result =
        book.submitOrder(
            Order{
                2,
                "AAPL",
                Side::BUY,
                OrderType::LIMIT,
                100,
                50,
                50,
                2
            }
        );

    bool foundFilled = false;

    for (
        const auto& event :
        result.events
    )
    {
        if (
            event.type ==
            OrderEventType::FILLED
        )
        {
            foundFilled = true;
        }
    }

    EXPECT_TRUE(
        foundFilled
    );
}
