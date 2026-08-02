#include "StrategyRuntime.h"
#include "../strategy/Istrategy.h"
#include "../strategy/Signal.h"
#include "../execution/ExecutionAdapter.h"
#include "../execution/ExecutionManager.h"
#include <vector>
#include <iostream>

void StrategyRuntime::setExecutionManager(ExecutionManager* manager)
{
    executionManager = manager;
}

void StrategyRuntime::registerStrategy(
    const std::string& name,
    IStrategy* strategy
)
{
    if (strategy != nullptr)
    {
        // Explicitly typed callback variable
        IStrategy::SignalCallback cb = [this](Signal signal, const std::string& symbol, std::uint64_t quantity) {
            if (executionManager == nullptr)
            {
                std::cout << "[Runtime Warning] ExecutionManager not attached to StrategyRuntime!" << std::endl;
                return;
            }

            auto requestOpt = ExecutionAdapter::signalToRequest(signal, symbol, quantity);
            if (requestOpt.has_value())
            {
                std::cout << "\n[PIPELINE TRIPPED] Signal -> Risk Check -> Matching Engine" << std::endl;
                MatchingResult result = executionManager->submitRequest(requestOpt.value());
                std::cout << "[PIPELINE] Trades Executed: " << result.trades.size()
                          << " | Events Generated: " << result.events.size() << std::endl;
            }
        };

        strategy->setSignalCallback(cb);
    }

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
    std::cout << "[Runtime] Started strategy: " << name << std::endl;

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
    std::cout << "[Runtime] Stopped strategy: " << name << std::endl;

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

void StrategyRuntime::onTick(const Tick& tick)
{
    std::cout
        << "[Runtime] "
        << tick.symbol
        << " "
        << tick.price
        << std::endl;

    for (auto& [name, info] : strategies)
    {
        if (!info.running || info.strategy == nullptr)
            continue;

        info.strategy->onTick(tick);

        std::cout
            << "["
            << name
            << "] processed tick"
            << std::endl;
    }
}
