#include "AlpacaClient.h"

#include <curl/curl.h>

#include <stdexcept>
#include <string>
#include <nlohmann/json.hpp>
#include <iostream>

static size_t WriteCallback(
    void* contents,
    size_t size,
    size_t nmemb,
    void* userp
)
{
    ((std::string*)userp)->append(
        (char*)contents,
        size * nmemb
    );

    return size * nmemb;
}

AlpacaClient::AlpacaClient(
    const std::string& apiKey,
    const std::string& secretKey
)
    : apiKey(apiKey),
      secretKey(secretKey)
{
}

std::string AlpacaClient::submitOrder(
    const SubmitOrderRequest& request
)
{
    nlohmann::json body;

    body["symbol"] = request.symbol;

    body["qty"] = request.quantity;

    body["side"] =
        request.side == "BUY"
            ? "buy"
            : "sell";

    body["type"] =
        request.type == "MARKET"
            ? "market"
            : "limit";

    body["time_in_force"] = "day";

    if (request.type == "LIMIT")
    {
        body["limit_price"] = request.price;
    }

    std::cout << body.dump(4) << std::endl;

    return performRequest(
        "https://paper-api.alpaca.markets/v2/orders",
        "POST",
        body.dump()
    );
}


std::string AlpacaClient::performRequest(
    const std::string& url,
    const std::string& method,
    const std::string& body
)
{
    CURL* curl = curl_easy_init();

    if (!curl)
    {
        throw std::runtime_error(
            "Failed to initialize CURL"
        );
    }

    std::string response;

    curl_easy_setopt(
        curl,
        CURLOPT_URL,
        url.c_str()
    );

    curl_easy_setopt(
        curl,
        CURLOPT_WRITEFUNCTION,
        WriteCallback
    );

    curl_easy_setopt(
        curl,
        CURLOPT_WRITEDATA,
        &response
    );
    if (method == "POST")
    {
        curl_easy_setopt(curl, CURLOPT_POST, 1L);

        curl_easy_setopt(
            curl,
            CURLOPT_POSTFIELDS,
            body.c_str()
        );
    }
    else if (method == "DELETE")
    {
        curl_easy_setopt(
            curl,
            CURLOPT_CUSTOMREQUEST,
            "DELETE"
        );
    }

    struct curl_slist* headers = nullptr;

    headers = curl_slist_append(
        headers,
        ("APCA-API-KEY-ID: " + apiKey).c_str()
    );

    headers = curl_slist_append(
        headers,
        ("APCA-API-SECRET-KEY: " + secretKey).c_str()
    );

    headers = curl_slist_append(
        headers,
        "Content-Type: application/json"
    );

    curl_easy_setopt(
        curl,
        CURLOPT_HTTPHEADER,
        headers
    );

    CURLcode result = curl_easy_perform(curl);

    if (result != CURLE_OK)
    {
        curl_slist_free_all(headers);
        curl_easy_cleanup(curl);

        throw std::runtime_error(
            curl_easy_strerror(result)
        );
    }

    curl_slist_free_all(headers);
    curl_easy_cleanup(curl);

    return response;
}

std::string AlpacaClient::getAccount()
{
    return performRequest(
        "https://paper-api.alpaca.markets/v2/account"
    );
}
std::string AlpacaClient::getBars(
    const std::string& symbol
)
{
    std::string url =
        "https://data.alpaca.markets/v2/stocks/" +
        symbol +
        "/bars?timeframe=1Min&limit=500&feed=iex";

    return performRequest(url);
}
AlpacaAccount AlpacaClient::getAccountInfo()
{
    auto response = getAccount();

    auto json = nlohmann::json::parse(response);

    AlpacaAccount account;

    account.buyingPower =
        std::stod(json["buying_power"].get<std::string>());

    account.cash =
        std::stod(json["cash"].get<std::string>());

    account.equity =
        std::stod(json["equity"].get<std::string>());

    account.portfolioValue =
        std::stod(json["portfolio_value"].get<std::string>());

    account.longMarketValue =
        std::stod(json["long_market_value"].get<std::string>());

    account.shortMarketValue =
        std::stod(json["short_market_value"].get<std::string>());

    return account;
}

std::vector<AlpacaPosition> AlpacaClient::getPositions()
{
    auto response = performRequest(
        "https://paper-api.alpaca.markets/v2/positions"
    );

    auto json = nlohmann::json::parse(response);

    std::vector<AlpacaPosition> positions;

    for (const auto& item : json)
    {
        AlpacaPosition position;

        position.symbol =
            item["symbol"].get<std::string>();

        position.quantity =
            std::stoi(item["qty"].get<std::string>());

        position.marketValue =
            std::stod(item["market_value"].get<std::string>());

        position.averageEntryPrice =
            std::stod(item["avg_entry_price"].get<std::string>());

        position.currentPrice =
            std::stod(item["current_price"].get<std::string>());

        position.unrealizedPnL =
            std::stod(item["unrealized_pl"].get<std::string>());

        positions.push_back(position);
    }

    return positions;
}

std::vector<AlpacaOrder> AlpacaClient::getFilledOrders()
{
    auto response = performRequest(
        "https://paper-api.alpaca.markets/v2/orders?status=filled&limit=50&direction=desc"
    );

    auto json = nlohmann::json::parse(response);

    std::vector<AlpacaOrder> orders;

    for (const auto& item : json)
    {
        AlpacaOrder order;

        order.symbol =
            item["symbol"].get<std::string>();

        order.side =
            item["side"].get<std::string>();

        order.quantity =
            std::stoi(item["qty"].get<std::string>());

        order.filledPrice =
            std::stod(item["filled_avg_price"].get<std::string>());

        order.filledAt =
            item["filled_at"].get<std::string>();

        orders.push_back(order);
    }

    return orders;
}

AlpacaQuote AlpacaClient::getLatestQuote(
    const std::string& symbol
)
{
    auto response = performRequest(

        "https://data.alpaca.markets/v2/stocks/"
        + symbol +
        "/quotes/latest"

    );

    auto json = nlohmann::json::parse(response);

    auto quoteJson = json["quote"];

    AlpacaQuote quote;

    quote.bidPrice =
        quoteJson["bp"].get<double>();

    quote.bidSize =
        quoteJson["bs"].get<int>();

    quote.askPrice =
        quoteJson["ap"].get<double>();

    quote.askSize =
        quoteJson["as"].get<int>();

    return quote;
}
std::vector<AlpacaOpenOrder>
AlpacaClient::getOpenOrders()
{
    auto response = performRequest(
        "https://paper-api.alpaca.markets/v2/orders?status=open"
    );

    auto json = nlohmann::json::parse(response);

    std::vector<AlpacaOpenOrder> orders;

    for (const auto& item : json)
    {
        AlpacaOpenOrder order;

        order.id =
            item["id"].get<std::string>();

        order.symbol =
            item["symbol"].get<std::string>();

        order.side =
            item["side"].get<std::string>();

        order.type =
            item["type"].get<std::string>();

        order.quantity =
            std::stoi(item["qty"].get<std::string>());

        if (
            item.contains("limit_price") &&
            !item["limit_price"].is_null()
        )
        {
            order.limitPrice =
                std::stod(
                    item["limit_price"].get<std::string>()
                );
        }
        else
        {
            order.limitPrice = 0.0;
        }

        order.status =
            item["status"].get<std::string>();

        orders.push_back(order);
    }

    return orders;
}

bool AlpacaClient::cancelOrder(
    const std::string& orderId
)
{
    performRequest(

        "https://paper-api.alpaca.markets/v2/orders/" +
        orderId,

        "DELETE"

    );

    return true;
}