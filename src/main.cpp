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
#include "execution/ExecutionManager.h"
#include "execution/ExecutionAdapter.h"
#include "portfolio/Holding.h"
#include "portfolio/PortfolioManager.h"
#include "risk/RiskManager.h"
#include "export/DashboardExporter.h"
#include "broker/PaperBroker.h"
#include "api/HttpServer.h"
#include "config/Config.h"
#include "Alpaca/AlpacaClient.h"
#include "runtime/StrategyRuntime.h"
#include "Alpaca/AlpacaMarketDataStream.h"

int main() {





    std::cout << "===== ENGINE START =====" << std::endl;

    MarketDataFeed feed;


    AnalyticsManager analyticsManager;


    MovingAverageStrategy strategy(3, 5, &analyticsManager);

    EMAStrategy ema_strategy(10,20, &analyticsManager);

    CandleAggregator aggregator;

    StrategyRuntime runtime;

    runtime.registerStrategy("ema", &ema_strategy);



    runtime.registerStrategy("moving average", &strategy);



    //feed.subscribe(&strategy);

   // feed.subscribe(&aggregator);

    //feed.subscribe(&zscoreStrategy);


    PairParamters params =
    PairParameterLoader::load(
        "../src/config/KO_PEP.json"
    );

    PairsTradingStrategy pairStrategy(
    "KO",
    "PEP",
    params);

    runtime.registerStrategy("pairs", &pairStrategy);


    //feed.subscribe(&pairStrategy);






    HistoricalDataPlayer player("../src/config/KO_PEP_engine.csv");





   // player.replay(feed);






    JsonExporter::exportSnapshots(
    analyticsManager.getSnapshots(),
    "engine_output.json");


    


    std::cout << "===== ENGINE END =====" << std::endl;

    ExecutionManager manager;

    runtime.setExecutionManager(&manager); // <-- ADD THIS LINE!
    ExecutionRequest sellLiquidity{
        "AAPL",
        Side::SELL,
        100,
        OrderType::LIMIT,
        100


    };

    manager.submitRequest(sellLiquidity);

    Signal signal = Signal::BUY;

    auto request = ExecutionAdapter::signalToRequest(signal, "AAPL", 100);

    if (request) {
        MatchingResult result = manager.submitRequest(*request);

        std::cout
        << "\nTrades\n";

        for (const auto& trade : result.trades) {
            std::cout
            <<trade.quantity
            << "@"
            << trade.price
            << "\n";

        }

        for (const auto& event: result.events) {
            std::cout
            << event.orderId
            << " "

            << static_cast<int>(event.type)
            << "\n";

        }

    }

    Holding p = manager.getPortfolio().getHolding("AAPL");



    std::cout


    <<"Qty : "


    <<p.quantity


    <<'\n';



    std::cout


    <<"Avg : "


    <<p.averageCost


    <<'\n';



    std::cout


    <<"Cash : "


    <<manager

    .getPortfolio()

    .getCash()


    <<'\n';



    std::cout


    <<"Realized : "


    <<p.realizedPnL


    <<'\n';

    std::vector<Holding> holdings = { manager.getPortfolio().getHolding("AAPL") };
    DashboardExporter::write(
        "../frontend/public/dashboard.json",
        manager.getPortfolio(),
        holdings,
        analyticsManager.getSnapshots()
    );


    PaperBroker broker;

    HttpServer server(broker, runtime);



    Config config;

    AlpacaClient client(

        config.get("ALPACA_API_KEY"),

        config.get("ALPACA_SECRET_KEY")

    );

    std::cout

    << client.getAccount()

    << std::endl;

    feed.subscribe(&runtime);

    AlpacaMarketDataStream stream(
config.get("ALPACA_API_KEY"),
config.get("ALPACA_SECRET_KEY"),
feed);

    stream.start({"AAPL"});

    std::cout << stream.isRunning() << std::endl;

    std::cout << "Created stream\n";

    







    server.start();














    return 0;
}