#include <iostream>

#include "market data/MarketDataFeed.h"
#include "market data/CandleAggregator.h"

#include "strategy/MovingAverageStrategy.h"
#include "replay/HistoricalDataPlayer.h"
#include "strategy/ZScoreStrategy.h"
#include "export/JsonExporter.h"
#include "strategy/EMAStrategy.h"
#include "analytics/AnalyticsManager.h"
#include "analytics/PerformanceMetrics.h"
#include "analytics/MetricsCalculator.h"
#include "ml/FeatureExtractor.h"
#include "ml/RegimeClassifier.h"
#include "strategy/PairParameters.h"
#include "strategy/PairsTradingStrategy.h"
#include "config/PairParameterLoader.h"

int main() {

    std::cout << "===== ENGINE START =====" << std::endl;

    MarketDataFeed feed;


    AnalyticsManager analyticsManager;
    ZScoreStrategy zscoreStrategy(5,1.5, &analyticsManager);

    MovingAverageStrategy strategy(3, 5, &analyticsManager);

    EMAStrategy ema_strategy(10,20, &analyticsManager);

    CandleAggregator aggregator;

    feed.subscribe(&strategy);

    feed.subscribe(&aggregator);

    //feed.subscribe(&zscoreStrategy);

    feed.subscribe(&ema_strategy);
    PairParamters params =
    PairParameterLoader::load(
        "../src/config/KO_PEP.json"
    );

    PairsTradingStrategy pairStrategy(
    "KO",
    "PEP",
    params);

    feed.subscribe(&pairStrategy);




    

    HistoricalDataPlayer player("../src/config/KO_PEP_engine.csv");



    player.replay(feed);

    PerformanceMetrics metrics =
    MetricsCalculator::calculate(
        ema_strategy.getCompletedTrades()
    );

    std::cout
    << "\n===== PERFORMANCE =====\n"
    << "Total Trades: "
    << metrics.totalTrades

    << "\nWin Rate: "
    << metrics.winRate * 100
    << "%"

    << "\nTotal PnL: "
    << metrics.totalPnL

    << "\nAverage Trade PnL: "
    << metrics.averageTradePnL
    << "\nSharpe Ratio: "
    << metrics.sharpeRatio

    << "\nMax Drawdown: "
    << metrics.maxDrawdown

    << "\nProfit Factor: "
    << metrics.profitFactor

    << std::endl;




    JsonExporter::exportSnapshots(
    analyticsManager.getSnapshots(),
    "engine_output.json");


    std::vector<double> prices {
        100,101,102,103,104,
        105,106,107,108
    };

    double volatility =
        FeatureExtractor::calculateVolatility(
            prices
        );

    double momentum =
        FeatureExtractor::calculateMomentum(
            prices
        );

    Regime regime = RegimeClassifier::Classify(volatility, momentum);

    switch(regime)
    {
        case Regime::TRENDING:
            std::cout << "TRENDING\n";
            break;

        case Regime::VOLATILE:
            std::cout << "VOLATILE\n";
            break;

        case Regime::MEAN_REVERTING:
            std::cout << "MEAN_REVERTING\n";
            break;
    }

    std::cout
        << "Volatility: "
        << volatility
        << "\nMomentum: "
        << momentum
        << std::endl;








    std::cout << "===== ENGINE END =====" << std::endl;

    return 0;
}