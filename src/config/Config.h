#pragma once

#include <string>
#include <unordered_map>

class Config
{
public:

    explicit Config(const std::string& filename = ".env");

    std::string get(const std::string& key) const;

private:

    std::unordered_map<std::string, std::string> values;
};
