#pragma once

#include <nlohmann/json.hpp>
#include "dto/PositionSnapshot.h"
#include "dto/AccountSnapshot.h"
#include "dto/TradeSnapshot.h"
class JsonSerializer
{
public:

    static nlohmann::json serialize(
    const std::vector<PositionSnapshot>& positions);

    static nlohmann::json serialize(
    const AccountSnapshot& account);

    static nlohmann::json serialize(
    const std::vector<TradeSnapshot>& trades);





};

