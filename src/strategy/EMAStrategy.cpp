#include <iostream>

#include "../trading/TradeEvent.h"
#include "../export/EngineSnapshot.h"

#include "EMAStrategy.h"

EMAStrategy::EMAStrategy(
    size_t shortPeriod,
    size_t longPeriod,
    AnalyticsManager* analytics_manager
)
    :
    shortEMA(0.0),
    longEMA(0.0),

    shortAlpha(
        2.0 / (shortPeriod + 1)
    ),

    longAlpha(
        2.0 / (longPeriod + 1)
    ),

    shortInitialized(false),
    longInitialized(false),

    currentPosition(Position::FLAT),

    activeTrade(nullptr),

    analyticsManager(analytics_manager),

    totalPnL(0.0)
{
}

double EMAStrategy::updateEMA(
    double currentEMA,
    double alpha,
    double price
) const
{
    return
        alpha * price +
        (1.0 - alpha) * currentEMA;
}

Signal EMAStrategy::generateSignal(
    double shortEMA,
    double longEMA
) const
{
    if (shortEMA > longEMA) {
        return Signal::BUY;
    }

    if (shortEMA < longEMA) {
        return Signal::SELL;
    }

    return Signal::HOLD;
}

void EMAStrategy::onTick(
    const Tick& tick
)
{
    if (!shortInitialized) {

        shortEMA = tick.price;

        shortInitialized = true;
    }
    else {

        shortEMA = updateEMA(
            shortEMA,
            shortAlpha,
            tick.price
        );
    }

    if (!longInitialized) {

        longEMA = tick.price;

        longInitialized = true;
    }
    else {

        longEMA = updateEMA(
            longEMA,
            longAlpha,
            tick.price
        );
    }

    Signal signal =
        generateSignal(
            shortEMA,
            longEMA
        );

    std::string action = "HOLD";

    if (
        signal == Signal::BUY &&
        currentPosition == Position::FLAT
    ) {

        currentPosition =
            Position::LONG;

        activeTrade =
            new Trade(
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

        currentPosition =
            Position::FLAT;

        activeTrade->exitPrice =
            tick.price;

        activeTrade->exitTimestamp =
            tick.timestamp;

        activeTrade->open =
            false;

        double pnl =
            activeTrade->exitPrice -
            activeTrade->entryPrice;

        totalPnL += pnl;

        TradeEvent event {
            TradeEventType::EXIT_LONG,
            tick.symbol,
            tick.price,
            tick.timestamp
        };

        tradeEvents.push_back(event);

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

        shortEMA,

        longEMA,

        0.0,

        action,

        totalPnL
    };

    analyticsManager->addSnapshot(
        snapshot
    );

    std::cout
        << "Price: " << tick.price
        << " | Short EMA: " << shortEMA
        << " | Long EMA: " << longEMA
        << " | Action: " << action
        << " | Total PnL: "
        << totalPnL
        << " | Trades: "
        << completedTrades.size()
        << std::endl;
}
const std::vector<Trade>&
EMAStrategy::getCompletedTrades() const
{
    return completedTrades;
}
