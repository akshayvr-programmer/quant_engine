//
// Created by axoss-scott on 5/29/26.
//

#pragma once
#include <vector>

#include "PerformanceMetrics.h"
#include  "../export/EngineSnapshot.h"
#include "../net/EventPublisher.h"

class Trade;

class AnalyticsManager {

private:
    std::vector<EngineSnapshot> snapshots;


public:
    void addSnapshot(const EngineSnapshot& snapshot);

    const std::vector<EngineSnapshot>& getSnapshots() const;
    

};
