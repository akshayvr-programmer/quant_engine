#include "Config.h"

#include <fstream>
#include <sstream>
#include <stdexcept>

Config::Config(const std::string& filename)
{
    std::ifstream file(filename);

    if (!file)
    {
        throw std::runtime_error(
            "Could not open " + filename
        );
    }

    std::string line;

    while (std::getline(file, line))
    {
        if (line.empty() || line[0] == '#')
            continue;

        auto pos = line.find('=');

        if (pos == std::string::npos)
            continue;

        std::string key = line.substr(0, pos);
        std::string value = line.substr(pos + 1);

        values[key] = value;
    }
}

std::string Config::get(
    const std::string& key
) const
{
    auto it = values.find(key);

    if (it == values.end())
    {
        throw std::runtime_error(
            "Missing config key: " + key
        );
    }

    return it->second;
}
