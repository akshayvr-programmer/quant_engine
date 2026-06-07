#include "PairsTradingStrategy.h"
#include <iostream>

PairsTradingStrategy::PairsTradingStrategy(const std::string &symbolA, const std::string &symbolB, PairParamters &params) : symbolA(symbolA), symbolB(symbolB), params(params), currentPosition(PairPosition::FLAT){
}

double PairsTradingStrategy::calculateSpread() const {
    double priceA = latestPrices.at(symbolA);
    double priceB = latestPrices.at(symbolB);

    return priceA - (params.beta*priceB + params.alpha);
}
double PairsTradingStrategy::calculateZscore(
    double spread
) const
{
    return
        (spread - params.spreadMean)
        /
        params.spreadStd;
}

void PairsTradingStrategy::onTick(
    const Tick& tick
)
{
    std::cout << "[TICK]" << tick.symbol << " " << tick.price << std::endl;

    latestPrices[tick.symbol] =
        tick.price;

    if (
        latestPrices.find(symbolA)
        ==
        latestPrices.end()
    ) {
        return;
    }

    if (
        latestPrices.find(symbolB)
        ==
        latestPrices.end()
    ) {
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

    if (z > params.entryZ && currentPosition == PairPosition::FLAT) {
        currentPosition = PairPosition::SHORT_SPREAD;
        std::cout
            << "[ENTER SHORT SPREAD]"
            << "Z = "
            << z
            << std::endl;

    }
    else if (z < -params.entryZ && currentPosition == PairPosition::FLAT) {
        currentPosition = PairPosition::LONG_SPREAD;
        std::cout
             << "[ENTER SHORT SPREAD]"
             << "Z = "
             << z
             << std::endl;
    }

    if (
    currentPosition ==
    PairPosition::LONG_SPREAD
)
    {
        if (z >= params.exitZ)
        {
            currentPosition =
                PairPosition::FLAT;

            std::cout
                << "[EXIT LONG SPREAD]"
                << std::endl;
        }
    }

    if (
        currentPosition ==
        PairPosition::SHORT_SPREAD
    )
    {
        if (z <= params.exitZ)
        {
            currentPosition =
                PairPosition::FLAT;

            std::cout
                << "[EXIT SHORT SPREAD]"
                << std::endl;
        }
    }

}