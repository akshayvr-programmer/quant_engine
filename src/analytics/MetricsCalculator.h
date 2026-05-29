//
// Created by axoss-scott on 5/29/26.
//

#pragma once

#include <vector>

#include "../trading/Trade.h"
#include "PerformanceMetrics.h"

class MetricsCalculator {
public:
    static PerformanceMetrics calculate(const std::vector<Trade>& trades);

    
};