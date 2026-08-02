#pragma once

#include <string>
#include <unordered_map>
#include <vector>
#include "../market data/ITickListener.h"
#include "../market data/Tick.h"
#include "../strategy/Istrategy.h"
#include "../execution/ExecutionManager.h"
#include <functional>
#include <cstdint>

class StrategyRuntime : public ITickListener
{
public:
    void setExecutionManager(ExecutionManager* manager);

    void registerStrategy(
        const std::string& name,
        IStrategy* strategy
    );

    void onTick(const Tick& tick) override;

    IStrategy* get(const std::string& name) const;
    std::vector<std::string> getStrategyNames() const;

    bool start(const std::string& name);
    bool stop(const std::string& name);
    bool isRunning(const std::string& name) const;

private:
    struct StrategyInfo
    {
        IStrategy* strategy;
        bool running = false;
    };

    ExecutionManager* executionManager = nullptr;
    std::unordered_map<std::string, StrategyInfo> strategies;
};
