//
// Created by axoss-scott on 5/29/26.
//

#pragma once
#include <cstddef>
struct PerformanceMetrics
{
    double totalPnL;

    double winRate;

    double averageTradePnL;

    double maxDrawdown;

    size_t totalTrades;
    double sharpeRatio;
    double profitFactor;

};