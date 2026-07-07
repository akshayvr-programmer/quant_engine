#include "Router.h"
#include "../config/Config.h"
Router::Router(PaperBroker& broker)
    : broker(broker),
      alpacaClient(
          Config().get("ALPACA_API_KEY"),
          Config().get("ALPACA_SECRET_KEY")
      )
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
    if (
    method == HttpMethod::GET &&
    path == "/alpaca/account")
    {
        auto account =
            alpacaClient.getAccountInfo();

        return JsonSerializer::serialize(account).dump();
    }

    if (
    method == HttpMethod::GET &&
    path == "/alpaca/bars/AAPL"
)
    {
        return alpacaClient.getBars("AAPL");
    }

    if (
    method == HttpMethod::GET &&
    path == "/alpaca/positions"
)
    {
        auto positions =
            alpacaClient.getPositions();

        return JsonSerializer::serialize(
            positions
        ).dump();
    }

    if (
    method == HttpMethod::GET &&
    path == "/alpaca/orders")
    {
        auto orders =
            alpacaClient.getFilledOrders();

        return JsonSerializer::serialize(
            orders
        ).dump();
    }

    if (
    method == HttpMethod::GET &&
    path.rfind("/alpaca/quote/", 0) == 0
)
    {
        std::string symbol =
            path.substr(
                std::string("/alpaca/quote/").size()
            );

        auto quote =
            alpacaClient.getLatestQuote(symbol);

        return JsonSerializer::serialize(
            quote
        ).dump();
    }
    if (
    method == HttpMethod::GET &&
    path == "/alpaca/openOrders")
    {
        auto orders =
            alpacaClient.getOpenOrders();

        return JsonSerializer::serialize(
            orders
        ).dump();
    }
    if (
    method == HttpMethod::DELETE &&
    path.rfind("/alpaca/order/", 0) == 0
)
    {
        std::string id =
            path.substr(
                std::string("/alpaca/order/").size()
            );

        alpacaClient.cancelOrder(id);

        return R"({"success":true})";
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

    if (
    method == HttpMethod::POST &&
    path == "/alpaca/order"
)
    {
        auto json = nlohmann::json::parse(body);

        SubmitOrderRequest request;

        request.symbol = json["symbol"];
        request.side = json["side"];
        request.type = json["type"];
        request.quantity = json["quantity"];

        if (json.contains("price"))
        {
            request.price = json["price"];
        }

        return alpacaClient.submitOrder(request);
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