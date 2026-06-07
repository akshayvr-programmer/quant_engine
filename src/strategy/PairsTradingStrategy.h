#pragma once

#include <unordered_map>
#include <string>

#include "Istrategy.h"

#include "PairParameters.h"

class PairsTradingStrategy : public IStrategy {
private:
    std::string symbolA;
    std::string symbolB;

    enum class PairPosition {
        FLAT,
        LONG_SPREAD,
        SHORT_SPREAD
    };

    PairPosition currentPosition;


    PairParamters params;
    std::unordered_map<std::string, double> latestPrices;
public:
    PairsTradingStrategy(const std::string& symbolA, const std::string& symbolB, PairParamters& params);
    void onTick(const Tick& tick) override;

private:
    double calculateSpread() const;
    double calculateZscore(double spread) const;




};



