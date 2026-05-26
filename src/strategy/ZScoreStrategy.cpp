//
// Created by axoss-scott on 5/26/26.
//

#include "ZScoreStrategy.h"

#include <cmath>
#include <iostream>

ZScoreStrategy::ZScoreStrategy(
    size_t windowSize,
    double threshold
)
    : windowSize(windowSize),
      threshold(threshold)
{
}



double ZScoreStrategy::calculateMean() const {
    double sum = 0.0;

    for (const auto& price : prices) {
        sum += price;
    }

    return sum/prices.size();


}

double ZScoreStrategy::calculateStandardDeviation(
    double mean
) const
{
    double variance = 0.0;

    for (const auto& price : prices) {

        variance +=
            (price - mean) *
            (price - mean);
    }

    variance /= prices.size();

    return std::sqrt(variance);
}

double ZScoreStrategy::calculateZScore(double price, double mean, double stddev) const {
    if (stddev==0.0) return 0.0;

    return (price-mean)/stddev;

}

Signal ZScoreStrategy::generateSignal(
    double zscore
) const
{
    if (zscore > threshold) {
        return Signal::SELL;
    }

    if (zscore < -threshold) {
        return Signal::BUY;
    }

    return Signal::HOLD;
}

void ZScoreStrategy::onTick(const Tick &tick) {
    prices.push_back(tick.price);

    if (prices.size() > windowSize) {
        prices.pop_front();
    }

    if (prices.size() < windowSize) {
        return;
    }

    double mean = calculateMean();
    double stddev = calculateStandardDeviation(mean);
    double zscore = calculateZScore(tick.price, mean, stddev);

    Signal signal = generateSignal(zscore);

    std::string action;

    switch(signal) {

        case Signal::BUY:
            action = "BUY";
            break;

        case Signal::SELL:
            action = "SELL";
            break;

        case Signal::HOLD:
            action = "HOLD";
            break;
    }

    std::cout
        << "[Z-Score Strategy]"
        << " Price: " << tick.price
        << " | Mean: " << mean
        << " | StdDev: " << stddev
        << " | Z-Score: " << zscore
        << " | Action: " << action
        << std::endl;



}
