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

