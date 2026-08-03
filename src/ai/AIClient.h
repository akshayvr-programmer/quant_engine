#pragma once


#include <string>

class AIClient {

public:
    AIClient(const std::string& apiKey);

    std::string chat(const std::string& prompt);

private:
    std::string apiKey;

};