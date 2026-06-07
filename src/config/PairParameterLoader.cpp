#include "PairParameterLoader.h"

#include <fstream>

#include "../third_party/json.hpp"

using json = nlohmann::json;

PairParamters PairParameterLoader::load(
    const std::string& filename
)
{
    std::ifstream file(filename);

    if (!file.is_open())
    {
        throw std::runtime_error(
            "Could not open parameter file: "
            + filename
        );
    }

    json j;

    file >> j;

    PairParamters params;

    params.beta =
        j["beta"];
    params.alpha = j["alpha"];

    params.spreadMean =
        j["spread_mean"];

    params.spreadStd =
        j["spread_std"];

    params.entryZ =
        j["entry_z"];

    params.exitZ =
        j["exit_z"];



    return params;
}