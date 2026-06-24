cmake_minimum_required(VERSION 3.14)

project(QuantEngine)

set(CMAKE_CXX_STANDARD 17)



find_package(Qt6 REQUIRED COMPONENTS Widgets)

##############################################
# GoogleTest
##############################################

include(FetchContent)

FetchContent_Declare(
        googletest
        URL https://github.com/google/googletest/archive/refs/tags/v1.15.2.zip
)

FetchContent_MakeAvailable(googletest)
include(GoogleTest)

##############################################
# Engine
##############################################

add_executable(
        engine

        src/main.cpp
        "src/market data/Tick.cpp"
        "src/market data/Tick.h"
        "src/market data/MarketDataFeed.cpp"
        "src/market data/MarketDataFeed.h"
        src/strategy/Istrategy.h
        src/strategy/PrintStrategy.h
        src/strategy/PrintStrategy.cpp
        src/strategy/MovingAverageStrategy.h
        src/strategy/MovingAverageStrategy.cpp
        src/strategy/Signal.h
        "src/market data/Candle.h"
        "src/market data/Candle.cpp"
        "src/market data/CandleAggregator.h"
        "src/market data/CandleAggregator.cpp"
        "src/market data/ITickListener.h"
        src/strategy/Position.h
        src/trading/Trade.h
        src/trading/Trade.cpp
        src/replay/HistoricalDataPlayer.h
        src/replay/HistoricalDataPlayer.cpp
        src/strategy/ZScoreStrategy.h
        src/strategy/ZScoreStrategy.cpp
        src/export/EngineSnapshot.h
        src/export/JsonExporter.h
        src/export/JsonExporter.cpp
        src/strategy/EMAStrategy.h
        src/strategy/EMAStrategy.cpp
        src/trading/TradeEvent.h
        src/analytics/AnalyticsManager.h
        src/analytics/AnalyticsManager.cpp
        src/analytics/PerformanceMetrics.h
        src/analytics/MetricsCalculator.h
        src/analytics/MetricsCalculator.cpp
        src/ml/RegimeClassifier.cpp
        src/ml/RegimeClassifier.h
        src/ml/Regime.h
        src/ml/FeatureExtractor.cpp
        src/ml/FeatureExtractor.h
        src/strategy/PairParameters.h
        src/strategy/PairsTradingStrategy.h
        src/strategy/PairsTradingStrategy.cpp
        src/config/PairParameterLoader.cpp
        src/config/PairParameterLoader.h
        src/execution/Order.h
        src/execution/ExecutionTrade.h
        src/execution/OrderEvent.h
        src/execution/MatchingResult.h
        src/execution/OrderBook.h
        src/execution/OrderBook.cpp
        src/execution/ExecutionRequest.h
        src/execution/OrderIdGenerator.cpp
        src/execution/OrderIdGenerator.h
        src/execution/ExecutionManager.h
        src/execution/ExecutionManager.cpp
        src/execution/ExecutionAdapter.cpp
        src/execution/ExecutionAdapter.h
        src/portfolio/PortfolioManager.cpp
        src/portfolio/PortfolioManager.h
        src/portfolio/Holding.h
        src/risk/RiskManager.cpp
        src/risk/RiskManager.h
        src/risk/RiskDecision.h
        src/risk/RiskResult.h
        src/broker/PaperBroker.cpp
        src/broker/PaperBroker.h


        # UI


        # Existing files...
        # Keep everything else you already have
)





##############################################
# Tests
##############################################

add_executable(
        OrderBookTests

        tests/OrderBookTests.cpp

        src/execution/OrderBook.cpp
)

target_link_libraries(
        OrderBookTests

        PRIVATE

        GTest::gtest_main
)