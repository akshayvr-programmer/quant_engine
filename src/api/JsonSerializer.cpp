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

nlohmann::json JsonSerializer::serialize(
    const std::vector<AlpacaOrder>& orders
)
{
    nlohmann::json result = nlohmann::json::array();

    for (const auto& order : orders)
    {
        result.push_back({

            {"symbol", order.symbol},

            {"side", order.side},

            {"quantity", order.quantity},

            {"filledPrice", order.filledPrice},

            {"filledAt", order.filledAt}

        });
    }

    return result;
}

nlohmann::json JsonSerializer::serialize(
    const AlpacaQuote& quote
)
{
    return {

            {"bidPrice", quote.bidPrice},

            {"bidSize", quote.bidSize},

            {"askPrice", quote.askPrice},

            {"askSize", quote.askSize}

    };
}
nlohmann::json JsonSerializer::serialize(
    const std::vector<AlpacaOpenOrder>& orders
)
{
    nlohmann::json result = nlohmann::json::array();

    for (const auto& order : orders)
    {
        result.push_back({

            {"id", order.id},

            {"symbol", order.symbol},

            {"side", order.side},

            {"type", order.type},

            {"quantity", order.quantity},

            {"limitPrice", order.limitPrice},

            {"status", order.status}

        });
    }

    return result;
}

nlohmann::json JsonSerializer::serialize(
    const StrategyInfo& strategy
)
{
    return {

            { "name", strategy.name },

            { "running", strategy.running }

    };
}

nlohmann::json JsonSerializer::serialize(
    const std::vector<StrategyInfo>& strategies
)
{
    nlohmann::json json =
        nlohmann::json::array();

    for (const auto& strategy : strategies)
    {
        json.push_back(
            serialize(strategy)
        );
    }

    return json;
}
StrategyRequest
JsonSerializer::deserializeStrategy(
    const std::string& body
)
{
    auto json =
        nlohmann::json::parse(body);

    StrategyRequest request;

    request.name =
        json["name"];

    return request;
}

AIChatRequest JsonSerializer::deserializeAIChat(
    const std::string& body
)
{
    auto json =
        nlohmann::json::parse(body);

    AIChatRequest request;

    request.prompt = json["prompt"];

    return request;
}
