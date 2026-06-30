#include "Router.h"

Router::Router(PaperBroker& broker)
    : broker(broker)
{
}

std::string Router::route(
    HttpMethod method,
    const std::string& path,
    const std::string& body

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

    if(method == HttpMethod::POST)
    {
        if(path == "/order")
        {
            OrderRequest request =
                JsonSerializer::deserializeOrder(body);

            MatchingResult result =
                broker.placeOrder(request);

            return R"(
{
    "success": true,
    "tradesExecuted": )"
                + std::to_string(result.trades.size()) +
                R"(,
    "eventsGenerated": )"
                + std::to_string(result.events.size()) +
                R"(
})";
        }
    }

    if (method == HttpMethod::POST &&
    path == "/seed")
    {
        OrderRequest request =
            JsonSerializer::deserializeOrder(body);

        request.type = "LIMIT";

        broker.seedLiquidity(request);

        return R"(
{
    "success": true,
    "message": "Liquidity Added"
}
)";
    }

    if(method == HttpMethod::GET)
    {


        if(path == "/book/AAPL")
        {
            return JsonSerializer::
                serialize(
                    broker.getOrderBook("AAPL")
                ).dump(4);
        }
    }

    return R"({"error":"Not Found"})";
}
