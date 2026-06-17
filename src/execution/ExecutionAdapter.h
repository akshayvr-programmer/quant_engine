#pragma once

#include <optional>

#include "../strategy/Signal.h"

#include "ExecutionRequest.h"


class ExecutionAdapter
{

public:

    static
    std::optional<ExecutionRequest>

    signalToRequest(

        Signal signal,

        const std::string&
        symbol,

        Quantity quantity

    );


};