#include "Router.h"

Router::Router(PaperBroker& broker)
    : broker(broker)
{
}

std::string Router::route(
    HttpMethod method,
    const std::string& path
)
{
    if (method == HttpMethod::GET)
    {
        if (path == "/account")
        {
            auto snapshot = broker.getAccount();

            return JsonSerializer::serialize(snapshot).dump(4);
        }
    }

    if (method == HttpMethod::GET && path == "/positions")
    {
        return JsonSerializer::serialize(
            broker.getPositions()
        ).dump(4);
    }

    if (method == HttpMethod::GET &&
    path == "/trades")
    {
        return JsonSerializer::serialize(
            broker.getTradeHistory()
        ).dump(4);
    }

    return R"({"error":"Not Found"})";
}