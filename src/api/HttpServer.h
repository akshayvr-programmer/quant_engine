#pragma once

#include "../broker/PaperBroker.h"
#include "Router.h"
#include "../runtime/StrategyRuntime.h"
class HttpServer
{
private:

    PaperBroker& broker;

    Router router;

public:

    explicit HttpServer(
    PaperBroker& broker,
    StrategyRuntime& strategyRuntime);

    void start();
};