#pragma once

#include <string>

#include "../strategy/PairParameters.h"

class PairParameterLoader
{
public:

    static PairParamters load(
        const std::string& filename
    );
};