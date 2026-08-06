#pragma once

#include <string>
#include "../Alpaca/AlpacaClient.h"
#include "../broker/PaperBroker.h"
#include "JsonSerializer.h"
#include "../runtime/StrategyRuntime.h"
#include "../ai/AIClient.h"
#include "../market data/MarketDataFeed.h"
enum class HttpMethod
{
    GET,
    POST,
    DELETE_
};

class Router
{
private:

    PaperBroker& broker;
    MarketDataFeed& feed;
    AlpacaClient alpacaClient;
    AIClient aiClient;


public:



    StrategyRuntime& strategyRuntime;

    explicit Router(
    PaperBroker& broker,
    MarketDataFeed& feed,
    StrategyRuntime& strategyRuntime);


    std::string route(
        HttpMethod method,
        const std::string& path,
        const std::string& body
    );
};
