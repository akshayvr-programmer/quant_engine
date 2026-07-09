#pragma once

#include <nlohmann/json.hpp>
#include "dto/PositionSnapshot.h"
#include "dto/AccountSnapshot.h"
#include "dto/TradeSnapshot.h"
#include "dto/OrderRequest.h"
#include "dto/OrderBookSnapshot.h"
#include "../Alpaca/Models/Account.h"
#include "../Alpaca/Models/Position.h"
#include "../Alpaca/Models/Quote.h"
#include "../Alpaca/Models/Order.h"
#include "../Alpaca/Models/OpenOrder.h"
#include "dto/StrategyInfo.h"
#include "dto/StrategyRequest.h"
class JsonSerializer
{
public:

    static nlohmann::json serialize(
    const std::vector<PositionSnapshot>& positions);

    static nlohmann::json serialize(
    const AccountSnapshot& account);

    static nlohmann::json serialize(
    const AlpacaAccount& account);

    static nlohmann::json serialize(
    const std::vector<AlpacaPosition>& positions);

    static nlohmann::json serialize(
    const std::vector<AlpacaOrder>& orders);

    static nlohmann::json serialize(
    const std::vector<AlpacaOpenOrder>& orders);

    static nlohmann::json serialize(
    const AlpacaQuote& quote);

    static nlohmann::json serialize(
    const StrategyInfo& strategy
);

    static nlohmann::json serialize(
        const std::vector<StrategyInfo>& strategies
    );

    static StrategyRequest deserializeStrategy(
        const std::string& body
    );
    





    static nlohmann::json serialize(
    const std::vector<TradeSnapshot>& trades);

    static OrderRequest deserializeOrder(
    const std::string& body);

    static nlohmann::json serialize(
    const OrderBookSnapshot& snapshot);






};

