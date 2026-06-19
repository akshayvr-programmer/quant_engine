//
// Created by aksha on 19-06-2026.


#include "RiskManager.h"

RiskManager::RiskManager(
    Quantity maxPos,
    double exposure,
    double loss
)
{
    maxPositionSize = maxPos;
    maxExposure = exposure;
    maxDailyLoss = loss;
}


RiskResult
RiskManager::
validateRequest(
    const ExecutionRequest& request,
    const PortfolioManager& portfolio
) const
{

    if (request.quantity > maxPositionSize)
    {
        return {
            RiskDecision::POSITION_LIMIT,
            "Position limit exceeded"
        };
    }


    if (portfolio.getExposure() > maxExposure)
    {
        return {
            RiskDecision::EXPOSURE_LIMIT,
            "Exposure limit exceeded"
        };
    }


    if (portfolio.getRealizedPnL() < -maxDailyLoss)
    {
        return {
            RiskDecision::DAILY_LOSS_LIMIT,
            "Daily loss limit breached"
        };
    }


    if (portfolio.getCash() < 0)
    {
        return {
            RiskDecision::INSUFFICIENT_CASH,
            "Insufficient cash"
        };
    }


    return {
        RiskDecision::APPROVED,
        "Approved"
    };
}