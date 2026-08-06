#include "PairsTradingStrategy.h"

#include <iostream>

PairsTradingStrategy::PairsTradingStrategy(
    const std::string& symbolA,
    const std::string& symbolB,
    const PairParamters& params
)
    :
    symbolA(symbolA),
    symbolB(symbolB),
    params(params),
    currentPosition(PairPosition::FLAT),
    activeTrade(nullptr),
    totalPnL(0.0)
{
}

double PairsTradingStrategy::calculateSpread() const
{
    double priceA =
        latestPrices.at(symbolA);

    double priceB =
        latestPrices.at(symbolB);

    return
        priceA -
        (
            params.alpha +
            params.beta * priceB
        );
}

double PairsTradingStrategy::calculateZscore(
    double spread
) const
{
    if (params.spreadStd == 0.0)
    {
        return 0.0;
    }

    return
        (spread - params.spreadMean)
        /
        params.spreadStd;
}

void PairsTradingStrategy::onTick(
    const Tick& tick
)
{
    std::cout
        << "[TICK] "
        << tick.symbol
        << " "
        << tick.price
        << std::endl;

    latestPrices[tick.symbol] =
        tick.price;

    if (
        latestPrices.find(symbolA)
        ==
        latestPrices.end()
    )
    {
        return;
    }

    if (
        latestPrices.find(symbolB)
        ==
        latestPrices.end()
    )
    {
        return;
    }

    double spread =
        calculateSpread();

    double z =
        calculateZscore(spread);

    std::cout
        << "Spread: "
        << spread
        << " | Z: "
        << z
        << std::endl;

    // =========================
    // ENTRY LOGIC
    // =========================

    if (
        currentPosition ==
        PairPosition::FLAT
    )
    {
        if (z > params.entryZ)
        {
            currentPosition =
                PairPosition::SHORT_SPREAD;

            emitSignal(Signal::SELL, symbolA, 10);
            emitSignal(Signal::BUY, symbolB, 10);

            activeTrade =
                new Trade(
                    symbolA + "-" + symbolB,
                    Position::SHORT,
                    spread,
                    tick.timestamp
                );

            std::cout
                << "[ENTER SHORT SPREAD]"
                << " Spread: "
                << spread
                << std::endl;

            return;
        }

        if (z < -params.entryZ)
        {
            currentPosition =
                PairPosition::LONG_SPREAD;

            emitSignal(Signal::BUY, symbolA, 10);
            emitSignal(Signal::SELL, symbolB, 10);

            activeTrade =
                new Trade(
                    symbolA + "-" + symbolB,
                    Position::LONG,
                    spread,
                    tick.timestamp
                );

            std::cout
                << "[ENTER LONG SPREAD]"
                << " Spread: "
                << spread
                << std::endl;

            return;
        }
    }

    // =========================
    // EXIT LONG SPREAD
    // =========================

    if (
        currentPosition ==
        PairPosition::LONG_SPREAD
        &&
        activeTrade != nullptr
    )
    {
        if (z >= params.exitZ)
        {
            activeTrade->exitPrice =
                spread;

            activeTrade->exitTimestamp =
                tick.timestamp;

            activeTrade->open =
                false;

            double pnl =
                spread -
                activeTrade->entryPrice;

            totalPnL += pnl;

            completedTrades.push_back(
                *activeTrade
            );

            delete activeTrade;

            activeTrade = nullptr;

            currentPosition =
                PairPosition::FLAT;

            emitSignal(Signal::SELL, symbolA, 10);
            emitSignal(Signal::BUY, symbolB, 10);

            std::cout
                << "[EXIT LONG SPREAD]"
                << " PnL: "
                << pnl
                << std::endl;
        }
    }

    // =========================
    // EXIT SHORT SPREAD
    // =========================

    if (
        currentPosition ==
        PairPosition::SHORT_SPREAD
        &&
        activeTrade != nullptr
    )
    {
        if (z <= params.exitZ)
        {
            activeTrade->exitPrice =
                spread;

            activeTrade->exitTimestamp =
                tick.timestamp;

            activeTrade->open =
                false;

            double pnl =
                activeTrade->entryPrice -
                spread;

            totalPnL += pnl;

            completedTrades.push_back(
                *activeTrade
            );

            delete activeTrade;

            activeTrade = nullptr;

            currentPosition =
                PairPosition::FLAT;

            emitSignal(Signal::BUY, symbolA, 10);
            emitSignal(Signal::SELL, symbolB, 10);

            std::cout
                << "[EXIT SHORT SPREAD]"
                << " PnL: "
                << pnl
                << std::endl;
        }
    }

    std::cout
        << "Trades: "
        << completedTrades.size()
        << " | Total PnL: "
        << totalPnL
        << std::endl;
}

const std::vector<Trade>&
PairsTradingStrategy::getCompletedTrades() const
{
    return completedTrades;
}
