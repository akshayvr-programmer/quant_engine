#include "AnalyticsManager.h"

void AnalyticsManager::addSnapshot(
    const EngineSnapshot& snapshot
)
{
    snapshots.push_back(snapshot);
}

const std::vector<EngineSnapshot>&
AnalyticsManager::getSnapshots() const
{
    return snapshots;
}