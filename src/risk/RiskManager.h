#pragma once

#include "../execution/ExecutionRequest.h"
#include "../portfolio/PortfolioManager.h"
#include "RiskDecision.h"
#include  "RiskResult.h"
class RiskManager {
private:
    double maxExposure;
    double maxDailyLoss;

    Quantity maxPositionSize;

public:

    RiskManager(Quantity maxPos = 1000, double exposure = 1000000, double loss = 50000);

     RiskResult validateRequest(const ExecutionRequest& request, const PortfolioManager& portfolio) const;



};