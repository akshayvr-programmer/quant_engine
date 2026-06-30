#pragma once

#include <string>

#include "../broker/PaperBroker.h"
#include "JsonSerializer.h"

enum class HttpMethod
{
    GET,
    POST
};

class Router
{
private:

    PaperBroker& broker;

public:

    explicit Router(PaperBroker& broker);

    std::string route(
        HttpMethod method,
        const std::string& path,
        const std::string& body
    );
};