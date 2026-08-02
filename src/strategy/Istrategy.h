// src/strategy/Istrategy.h
#pragma once

#include "../market data/ITickListener.h"
#include "Signal.h"
#include <functional>
#include <string>
#include <cstdint>

class IStrategy : public ITickListener
{
public:
    using SignalCallback = std::function<void(Signal signal, const std::string& symbol, std::uint64_t quantity)>;

    virtual ~IStrategy() = default;

    void setSignalCallback(SignalCallback cb) {
        onSignalEmitted = cb;
    }

protected:
    void emitSignal(Signal signal, const std::string& symbol, std::uint64_t quantity) {
        if (onSignalEmitted) {
            onSignalEmitted(signal, symbol, quantity);
        }
    }

private:
    SignalCallback onSignalEmitted;
};
