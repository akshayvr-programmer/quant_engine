#pragma once

#include "../broker/PaperBroker.h"
#include "Router.h"
#include "../runtime/StrategyRuntime.h"
#include "../market data/MarketDataFeed.h"
class HttpServer
{
private:

    PaperBroker& broker;
    MarketDataFeed& feed;

    Router router;

public:

    explicit HttpServer(
    PaperBroker& broker,
    MarketDataFeed& feed,
    StrategyRuntime& strategyRuntime);

    void start();
};
