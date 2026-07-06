#pragma once

#include <nlohmann/json.hpp>
#include "dto/PositionSnapshot.h"
#include "dto/AccountSnapshot.h"
#include "dto/TradeSnapshot.h"
#include "dto/OrderRequest.h"
#include "dto/OrderBookSnapshot.h"
#include "../Alpaca/Models/Account.h"
#include "../Alpaca/Models/Position.h"


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
    const std::vector<TradeSnapshot>& trades);

    static OrderRequest deserializeOrder(
    const std::string& body);

    static nlohmann::json serialize(
    const OrderBookSnapshot& snapshot);






};

