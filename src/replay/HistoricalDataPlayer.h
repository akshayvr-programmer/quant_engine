//
// Created by axoss-scott on 5/26/26.
//

#pragma once

#include <string>

#include "../market data/MarketDataFeed.h"

class HistoricalDataPlayer {
private:
    std::string filename;

public:
    HistoricalDataPlayer(const std::string& filename);

    void replay(MarketDataFeed& feed);


};