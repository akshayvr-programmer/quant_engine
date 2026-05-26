#pragma once

#include <string>

struct  EngineSnapshot {
public:
    long long timestamp;
    double shortMA;
    double longMA;
    double pnl;
    double zscore;
    std::string action;
    double price;

};