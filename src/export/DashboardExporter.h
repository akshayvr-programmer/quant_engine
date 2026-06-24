#pragma once
#include <string>
#include <vector>
#include "EngineSnapshot.h"
#include "../portfolio/PortfolioManager.h"
#include "../portfolio/Holding.h"

class DashboardExporter {
public:
    static void write(
        const std::string& path,
        const PortfolioManager& pf,
        const std::vector<Holding>& holdings,
        const std::vector<EngineSnapshot>& snapshots,
        double startingCash = 1000000.0);
};
