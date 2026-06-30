#include "JsonSerializer.h"

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

    request.price =
        json["price"];

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

