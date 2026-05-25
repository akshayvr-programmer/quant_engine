//
// Created by axoss-scott on 5/25/26.
//

#pragma once

#include <string>

class Candle {

public:

    std::string symbol;

    double open;
    double high;
    double low;
    double close;

    long long startTimestamp;
    long long endTimestamp;

    Candle();

    Candle(
        const std::string& symbol,
        double open,
        double high,
        double low,
        double close,
        long long startTimestamp,
        long long endTimestamp
    );
};