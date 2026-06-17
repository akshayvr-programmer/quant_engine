#pragma once

#include "Order.h"

class OrderIdGenerator {
private:

    OrderId currentId;

public:
    OrderIdGenerator();
    OrderId nextId();

};