cmake_minimum_required(VERSION 3.10)

project(QuantEngine)

set(CMAKE_CXX_STANDARD 17)

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
)