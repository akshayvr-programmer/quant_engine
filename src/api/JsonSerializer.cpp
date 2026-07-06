#include "JsonSerializer.h"
#include "../execution/Order.h"
nlohmann::json JsonSerializer::serialize(
    const AccountSnapshot& account
)
{
    return
    {
            {"cash", account.cash},
            {"exposure", account.exposure},
            {"realizedPnL", account.realizedPnL},
            {"unrealizedPnL", account.unrealizedPnL},
            {"buyingPower", account.buyingPower}
    };
}

nlohmann::json JsonSerializer::serialize(
    const std::vector<PositionSnapshot>& positions
)
{
    nlohmann::json array = nlohmann::json::array();

    for (const auto& position : positions)
    {
        array.push_back({
            {"symbol", position.symbol},
            {"quantity", position.quantity},
            {"averageCost", position.averageCost},
            {"realizedPnL", position.realizedPnL},
            {"unrealizedPnL", position.unrealizedPnL}
        });
    }

    return array;
}

nlohmann::json
JsonSerializer::serialize(
    const std::vector<TradeSnapshot>& trades
)
{
    nlohmann::json array =
        nlohmann::json::array();

    for (const auto& trade : trades)
    {
        array.push_back({

            {"symbol", trade.symbol},

            {"side", trade.side},

            {"price", trade.price},

            {"quantity", trade.quantity},

            {"timestamp", trade.timestamp}

        });
    }

    return array;
}

OrderRequest
JsonSerializer::deserializeOrder(
    const std::string& body
)
{
    auto json =
        nlohmann::json::parse(body);

    OrderRequest request;

    request.symbol =
        json["symbol"];

    request.side =
        json["side"];

    request.type =
        json["type"];

    request.quantity =
        json["quantity"];

    if (
    json.contains("price") &&
    !json["price"].is_null()
)
    {
        request.price =
            json["price"].get<Price>();
    }

    return request;
}

nlohmann::json
JsonSerializer::serialize(
    const OrderBookSnapshot& snapshot
)
{
    nlohmann::json result;

    result["bids"] = nlohmann::json::array();
    result["asks"] = nlohmann::json::array();

    for(const auto& level : snapshot.bids)
    {
        result["bids"].push_back({
            {"price", level.price},
            {"quantity", level.quantity}
        });
    }

    for(const auto& level : snapshot.asks)
    {
        result["asks"].push_back({
            {"price", level.price},
            {"quantity", level.quantity}
        });
    }

    return result;
}

nlohmann::json JsonSerializer::serialize(
    const AlpacaAccount& account
)
{
    return {

            {"buyingPower", account.buyingPower},

            {"cash", account.cash},

            {"equity", account.equity},

            {"portfolioValue", account.portfolioValue},

            {"longMarketValue", account.longMarketValue},

            {"shortMarketValue", account.shortMarketValue}

    };
}
nlohmann::json JsonSerializer::serialize(
    const std::vector<AlpacaPosition>& positions
)
{
    nlohmann::json result = nlohmann::json::array();

    for (const auto& position : positions)
    {
        result.push_back({

            {"symbol", position.symbol},

            {"quantity", position.quantity},

            {"marketValue", position.marketValue},

            {"averageEntryPrice", position.averageEntryPrice},

            {"currentPrice", position.currentPrice},

            {"unrealizedPnL", position.unrealizedPnL}

        });
    }

    return result;
}

