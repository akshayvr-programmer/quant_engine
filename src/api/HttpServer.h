#pragma once

#include "../broker/PaperBroker.h"
#include "Router.h"

class HttpServer
{
private:

    PaperBroker& broker;

    Router router;

public:

    explicit HttpServer(PaperBroker& broker);

    void start();
};