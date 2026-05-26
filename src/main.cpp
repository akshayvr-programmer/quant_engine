#include <iostream>

#include "market data/MarketDataFeed.h"
#include "market data/CandleAggregator.h"

#include "strategy/MovingAverageStrategy.h"
#include "replay/HistoricalDataPlayer.h"
#include "strategy/ZScoreStrategy.h"
#include "export/JsonExporter.h"

int main() {

    std::cout << "===== ENGINE START =====" << std::endl;

    MarketDataFeed feed;
    ZScoreStrategy zscoreStrategy(5,1.5);

    MovingAverageStrategy strategy(3, 5);

    CandleAggregator aggregator;

    feed.subscribe(&strategy);

    //feed.subscribe(&aggregator);

    feed.subscribe(&zscoreStrategy);
    

    HistoricalDataPlayer player("data.csv");

    player.replay(feed);

    JsonExporter::exportSnapshots(
    strategy.getSnapshots(),
    "engine_output.json");








    std::cout << "===== ENGINE END =====" << std::endl;

    return 0;
}