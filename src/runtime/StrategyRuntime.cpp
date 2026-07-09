#include "StrategyRuntime.h"

#include "../strategy/IStrategy.h"
#include <vector>

void StrategyRuntime::registerStrategy(
    const std::string& name,
    IStrategy* strategy
)
{
    strategies[name] = {

        strategy,

        false

    };
}

IStrategy* StrategyRuntime::get(
    const std::string& name
) const
{
    auto it = strategies.find(name);

    if (it == strategies.end())
    {
        return nullptr;
    }

    return it->second.strategy;

}

std::vector<std::string>
StrategyRuntime::getStrategyNames() const
{
    std::vector<std::string> names;

    for (const auto& pair : strategies)
    {
        names.push_back(pair.first);
    }

    return names;
}
bool StrategyRuntime::start(
    const std::string& name
)
{
    auto it = strategies.find(name);

    if (it == strategies.end())
        return false;

    it->second.running = true;

    return true;
}

bool StrategyRuntime::stop(
    const std::string& name
)
{
    auto it = strategies.find(name);

    if (it == strategies.end())
        return false;

    it->second.running = false;

    return true;
}

bool StrategyRuntime::isRunning(
    const std::string& name
) const
{
    auto it = strategies.find(name);

    if (it == strategies.end())
        return false;

    return it->second.running;
}
void StrategyRuntime::onTick(
    const Tick& tick
)
{
    for (auto& pair : strategies)
    {
        if (!pair.second.running)
        {
            continue;
        }

        pair.second.strategy->onTick(tick);

    }
}
