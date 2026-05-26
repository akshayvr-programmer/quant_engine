//
// Created by axoss-scott on 5/26/26.
//

#pragma once

#include <iostream>

#include <cstddef>

#include "Istrategy.h"
#include <deque>
#include "Signal.h"

class ZScoreStrategy : public IStrategy {
private:
    std::deque<double> prices;
    size_t windowSize;
    double threshold;

public:

    ZScoreStrategy(

    size_t windowSize,
    double threshold


    );

    void onTick(const Tick& tick) override;

    double calculateMean() const;

    double calculateStandardDeviation(double mean) const;

    double calculateZScore(double price, double mean, double stddev) const;

    Signal generateSignal(double zscore) const;



};