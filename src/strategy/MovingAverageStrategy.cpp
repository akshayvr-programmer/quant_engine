//
// Created by axoss-scott on 5/25/26.
//

#include <iostream>

#include "MovingAverageStrategy.h"

MovingAverageStrategy::MovingAverageStrategy(
    size_t shortWindow,
    size_t longWindow
)
    : shortWindow(shortWindow),
      longWindow(longWindow),
      currentPosition(Position::FLAT),
      activeTrade(nullptr),
      totalPnL(0.0)
{
}

const std::vector<EngineSnapshot>&
MovingAverageStrategy::getSnapshots() const
{
    return snapshots;
}

void MovingAverageStrategy::onTick(
    const Tick& tick
)
{
    shortPrices.push_back(tick.price);

    longPrices.push_back(tick.price);

    if (shortPrices.size() > shortWindow) {
        shortPrices.pop_front();
    }

    if (longPrices.size() > longWindow) {
        longPrices.pop_front();
    }

    if (
        shortPrices.size() < shortWindow ||
        longPrices.size() < longWindow
    ) {
        return;
    }

    double shortAverage =
        calculateAverage(shortPrices);

    double longAverage =
        calculateAverage(longPrices);

    Signal signal =
        generateSignal(
            shortAverage,
            longAverage
        );

    std::string action = "HOLD";

    if (
        signal == Signal::BUY &&
        currentPosition == Position::FLAT
    ) {

        currentPosition = Position::LONG;

        activeTrade = new Trade(
            tick.symbol,
            Position::LONG,
            tick.price,
            tick.timestamp
        );

        action = "ENTER LONG";
    }

    else if (
        signal == Signal::SELL &&
        currentPosition == Position::LONG
    ) {

        currentPosition = Position::FLAT;

        activeTrade->exitPrice =
            tick.price;

        activeTrade->exitTimestamp =
            tick.timestamp;

        activeTrade->open = false;

        double pnl =
            activeTrade->exitPrice -
            activeTrade->entryPrice;

        totalPnL += pnl;

        action =
            "EXIT LONG | Trade PnL: " +
            std::to_string(pnl);

        completedTrades.push_back(
            *activeTrade
        );

        delete activeTrade;

        activeTrade = nullptr;
    }

    EngineSnapshot snapshot {

        tick.timestamp,

        tick.price,

        shortAverage,

        longAverage,

        0.0,

        action,

        totalPnL
    };

    snapshots.push_back(snapshot);

    std::cout
        << "Price: " << tick.price
        << " | Short MA: " << shortAverage
        << " | Long MA: " << longAverage
        << " | Action: " << action
        << " | Total PnL: " << totalPnL
        << " | Trades: "
        << completedTrades.size()
        << std::endl;
}

double MovingAverageStrategy::calculateAverage(
    const std::deque<double>& prices
) const
{
    double sum = 0.0;

    for (const auto& price : prices) {
        sum += price;
    }

    return sum / prices.size();
}

Signal MovingAverageStrategy::generateSignal(
    double shortAverage,
    double longAverage
) const
{
    if (shortAverage > longAverage) {
        return Signal::BUY;
    }

    if (shortAverage < longAverage) {
        return Signal::SELL;
    }

    return Signal::HOLD;
}