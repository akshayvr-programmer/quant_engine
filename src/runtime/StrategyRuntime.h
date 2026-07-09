#pragma once

#include <string>
#include <unordered_map>
#include <vector>

#include "../market data/ITickListener.h"
#include "../market data/Tick.h"
#include "../market data/ITickListener.h"

class IStrategy;

class StrategyRuntime : public ITickListener
{
public:

    void registerStrategy(
        const std::string& name,
        IStrategy* strategy
    );
    void onTick(const Tick& tick);

    IStrategy* get(
        const std::string& name
    ) const;

    std::vector<std::string> getStrategyNames() const;

    bool start(
    const std::string& name
);

    bool stop(
        const std::string& name
    );

    bool isRunning(
        const std::string& name
    ) const;



private:
    struct StrategyInfo
    {
        IStrategy* strategy;

        bool running = false;
    };

    std::unordered_map<
        std::string,
        StrategyInfo
    > strategies;

};