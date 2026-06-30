#pragma once

#include <string>

struct OrderRequest {
    std::string symbol;
    std::string side;
    std::string type;
    int quantity = 0;
    double price = 0;
    
};