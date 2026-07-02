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
    // ============================================================
    // GET Routes
    // ============================================================

    if (method == HttpMethod::GET)
    {
        if (path == "/account")
        {
            return JsonSerializer::serialize(
                broker.getAccount()
            ).dump(4);
        }

        if (path == "/positions")
        {
            return JsonSerializer::serialize(
                broker.getPositions()
            ).dump(4);
        }

        if (path == "/trades")
        {
            return JsonSerializer::serialize(
                broker.getTradeHistory()
            ).dump(4);
        }

        const std::string bookPrefix = "/book/";

        if (path.rfind(bookPrefix, 0) == 0)
        {
            std::string symbol =
                path.substr(bookPrefix.length());

            return JsonSerializer::serialize(
                broker.getOrderBook(symbol)
            ).dump(4);
        }
    }

    // ============================================================
    // POST Routes
    // ============================================================

    if (method == HttpMethod::POST)
    {
        if (path == "/order")
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

        if (path == "/seed")
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
    }

    // ============================================================
    // Unknown Route
    // ============================================================

    return R"(
{
    "error": "Not Found"
}
)";
}