#pragma once

#include <string>

#include "RiskDecision.h"

struct RiskResult {
    RiskDecision decision;
    std::string reason;
};
