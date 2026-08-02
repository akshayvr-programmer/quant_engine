//
// Created by axoss-scott on 5/26/26.
//

#pragma once

#include <iostream>

#include <cstddef>

#include "Istrategy.h"
#include <deque>
#include "Signal.h"
#include "../analytics/AnalyticsManager.h"
#include "../trading/Trade.h"
class ZScoreStrategy : public IStrategy {
private:
    std::deque<double> prices;
    size_t windowSize;
    double threshold;
    AnalyticsManager* analyticsManager;

public:

    ZScoreStrategy(

    size_t windowSize,
    double threshold,
    AnalyticsManager* analyticsManager


    );
    const std::vector<Trade>& getCompletedTrades() const;





    void onTick(const Tick& tick) override;

    double calculateMean() const;

    double calculateStandardDeviation(double mean) const;

    double calculateZScore(double price, double mean, double stddev) const;

    Signal generateSignal(double zscore) const;
    const std::vector<EngineSnapshot>& getSnapshots() const;



};