//
// Created by axoss-scott on 5/29/26.
//

#include "MetricsCalculator.h"
#include <vector>
#include <cmath>
PerformanceMetrics MetricsCalculator::calculate(
    const std::vector<Trade>& trades
)
{
    PerformanceMetrics metrics {};

    metrics.totalTrades =
        trades.size();

    if (trades.empty()) {
        return metrics;
    }

    double grossProfit = 0.0;
    double grossLoss = 0.0;

    double equity = 0.0;
    double peak = 0.0;
    double maxDrawdown = 0.0;

    std::vector<double> returns;



    double totalPnL = 0.0;

    int winningTrades = 0;

    for (const auto& trade : trades)
    {
        double pnl =
            trade.exitPrice -
            trade.entryPrice;

        totalPnL += pnl;
        equity += pnl;

        returns.push_back(pnl);


        if (equity > peak) {
            peak = equity;
        }

        double drawDown = peak - equity;

        if (drawDown>maxDrawdown) {
            maxDrawdown = drawDown;
        }

        if (pnl > 0.0) {
            winningTrades++;
            grossProfit += pnl;
        }
        else {
            grossLoss -= pnl;

        }
    }

    double meanReturns = 0.0;

    for (double r : returns) {
        meanReturns += r;
    }
    meanReturns /= returns.size();
    double variance = 0.0;

    for (double r : returns)
    {
        variance +=
            (r - meanReturns)
            * (r - meanReturns);
    }

    variance /= returns.size();

    double stddev = std::sqrt(variance);
    metrics.sharpeRatio =
    (stddev == 0.0)
        ? 0.0
        : meanReturns / stddev;

    metrics.totalPnL =
        totalPnL;

    metrics.winRate =
        static_cast<double>(winningTrades)
        / trades.size();

    metrics.averageTradePnL =
        totalPnL / trades.size();

    metrics.maxDrawdown = maxDrawdown;

    metrics.profitFactor =
    (grossLoss == 0.0)
        ? 0.0
        : grossProfit / grossLoss;

    metrics.maxDrawdown = maxDrawdown;

    return metrics;
}