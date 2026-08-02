#include <iostream>
#include "MovingAverageStrategy.h"
#include "../trading/TradeEvent.h"

MovingAverageStrategy::MovingAverageStrategy(
    size_t shortWindow,
    size_t longWindow,
    AnalyticsManager* analytics_manager
)
    : shortWindow(shortWindow),
      longWindow(longWindow),
      currentPosition(Position::FLAT),
      activeTrade(nullptr),
      analyticsManager(analytics_manager),
      totalPnL(0.0)
{
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

    double shortAverage = calculateAverage(shortPrices);
    double longAverage = calculateAverage(longPrices);

    Signal signal = generateSignal(shortAverage, longAverage);
    std::string action = "HOLD";

    if (
        signal == Signal::BUY &&
        currentPosition == Position::FLAT
    ) {
        currentPosition = Position::LONG;

        // Emit signal to Execution Pipeline (Risk Manager -> Order Book -> Portfolio)
        emitSignal(Signal::BUY, tick.symbol, 10);

        activeTrade = new Trade(
            tick.symbol,
            Position::LONG,
            tick.price,
            tick.timestamp
        );

        TradeEvent event {
            TradeEventType::ENTER_LONG,
            tick.symbol,
            tick.price,
            tick.timestamp
        };

        tradeEvents.push_back(event);
        action = "ENTER LONG";
    }
    else if (
        signal == Signal::SELL &&
        currentPosition == Position::LONG
    ) {
        currentPosition = Position::FLAT;

        // Emit signal to Execution Pipeline
        emitSignal(Signal::SELL, tick.symbol, 10);

        double pnl = 0.0;
        if (activeTrade != nullptr) {
            activeTrade->exitPrice = tick.price;
            activeTrade->exitTimestamp = tick.timestamp;
            activeTrade->open = false;

            pnl = activeTrade->exitPrice - activeTrade->entryPrice;
            totalPnL += pnl;

            completedTrades.push_back(*activeTrade);
            delete activeTrade;
            activeTrade = nullptr;
        }

        TradeEvent event {
            TradeEventType::EXIT_LONG,
            tick.symbol,
            tick.price,
            tick.timestamp
        };

        tradeEvents.push_back(event);
        action = "EXIT LONG | Trade PnL: " + std::to_string(pnl);
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

    if (analyticsManager != nullptr) {
        analyticsManager->addSnapshot(snapshot);
    }

    std::cout
        << "Price: " << tick.price
        << " | Short MA: " << shortAverage
        << " | Long MA: " << longAverage
        << " | Action: " << action
        << " | Total PnL: " << totalPnL
        << " | Trades: " << completedTrades.size()
        << std::endl;
}

double MovingAverageStrategy::calculateAverage(
    const std::deque<double>& prices
) const
{
    if (prices.empty()) return 0.0;

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

const std::vector<Trade>&
MovingAverageStrategy::getCompletedTrades() const
{
    return completedTrades;
}
